import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import Errorhandler from "./error.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

export const isAuthenticated= catchAsyncErrors(async(req,resizeBy,next) =>{
    const token= req.cookies.token;
    if(!token){
        return next(new Errorhandler("User not authenticated",400));
    }
    const decoded =jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user= await User.findById(decoded.id);
    next();
});

export const isAuthorized = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new Errorhandler(
                    `${req.user.role} not allowed to access this resource`,403)
            );
        }
        next();
    }
}