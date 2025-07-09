import dotenv from "dotenv";
dotenv.config();

import app from "./app.js"
import cloudinary from "cloudinary"
import connectDB from "./database/connection.js";


connectDB();

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})
app.get("/", (req, res) => {
    console.log("GET / route hit");
    res.send("Server is working fine");
  });
  

  const PORT = process.env.PORT || 5050;

  app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
  });