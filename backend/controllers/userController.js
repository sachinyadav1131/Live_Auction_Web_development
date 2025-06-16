import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary"
import { generateToken } from "../utils/jwtToken.js";


export const register= catchAsyncErrors(async(req,res,next) =>{
    if (!req.files || Object.keys(req.files).length === 0) {
    return next(new Errorhandler("Profile Image required", 400));
  }

  // 2. Extract the profile image file
  const profileImage = req.files.profileImage;

  // 3. Make sure the file actually exists
  if (!profileImage) {
    return next(new Errorhandler("Profile Image required", 400));
  }

  // 4. Validate file format
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new Errorhandler("File format not supported", 400));
  }

  
   const{
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    paypalEmail,
    upiId,
    phonePeNumber,
    gpayNumber,
    paytmNumber,
    cardNumber,
    expiry,
    nameOnCard
   }= req.body;

   if(!userName || !email || !phone || !password || !address || !role){
    return next(new Errorhandler("Please fill full form",400));
   }
   
   if (role === "Auctioneer") {
  if (!bankAccountName || !bankAccountNumber || !bankName) {
    return next(
      new Errorhandler("Please provide your full bank details", 400)
    );
  }


// Count how many payment methods are provided
let paymentMethodCount = 0;

if (paypalEmail) paymentMethodCount++;
if (upiId) paymentMethodCount++;
if (phonePeNumber) paymentMethodCount++;
if (gpayNumber) paymentMethodCount++;
if (paytmNumber) paymentMethodCount++;
if (cardNumber) paymentMethodCount++;

// Validate exactly one payment method
if (paymentMethodCount === 0) {
  return next(new Errorhandler("Please provide a payment method.", 400));
}
if (paymentMethodCount > 1) {
  return next(
    new Errorhandler("Only one payment method is allowed.", 400)
  );
}
   } 
   
  const isRegistered= await User.findOne({email});
  if(isRegistered){
    return next(new Errorhandler("User already registered",400));
  }

  const cloudinaryResponse=await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder:"MERN_AUCTION_PLATFORM_USERS",
    }
  );
  if(!cloudinaryResponse|| cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
  
  return next(
    new Errorhandler("Failed to upload profile image to cloudinary.", 500)
  );
}
 const user =await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage:{
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    
    paymentMethods: {
        bankTransfer: {
            bankAccountNumber ,
            bankName,
            bankAccountName,
        },
        paypal: {
            paypalEmail,
        },
        upi: {
            upiId,
        },
        phonePe: {
            phonePeNumber,
        },
        googlePay: {
            gpayNumber,
        },
        paytm: {
            paytmNumber,
        },
        card: {
            cardNumber,
            expiry,
            nameOnCard,
        },
    },
 });
  generateToken(user,"User Registered",201,res);
 
});

export const login=catchAsyncErrors(async(req,res,next) =>{
 const { email,password } =req.body;
 if(!email || !password){
  return next(new Errorhandler("Please fill full form."));
 }

 const user=await User.findOne({email: email.trim() }).select("+password");
 if(!user) {
  return next(new Errorhandler("Invalid credentials", 400));
 }

 const isPasswordMatch= await user.comparePassword(password);

 if(!isPasswordMatch){
  return next(new Errorhandler("Invalid credentials", 400));
 }

 generateToken(user, "Login successfully" , 200, res);
});

export const getProfile=catchAsyncErrors(async(req,res,next) =>{
      const user= req.user;
      res.status(200).json({
        success:true,
        user,
      });
});

export const logout=catchAsyncErrors(async(req,res,next) =>{
   res.status(200).cookie("token","",{
    expires: new Date(Date.now()),
    httpOnly: true,
   })
   .json({
    success:true,
    message: "Logout Succesfully",
   });
});

export const fetchLeaderboard=catchAsyncErrors(async(req,res,next) =>{
     const users= await User.find({ moneySpent: { $gt: 0}});
     const leaderboard= users.sort((a,b) => b.moneySpent-a.moneySpent);
     res.status(200).json({
      success: true,
      leaderboard,
     });
});
