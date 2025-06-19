import { config } from "dotenv";
import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import  userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";

const app=express();
config({
    path: "./config/config.env"
});

app.use(cors({
   origin:[process.env.FRONTEND_URL],
   methods:["POST","GET","PUT","DELETE"],
   credentials:true,
}));

app.use(cookieParser());

app.use(
    fileUpload({
       useTempFiles:true,
       tempFileDir: "/tmp/",
    })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);

  
app.use(errorMiddleware)
export default app;
