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
    res.send("Server is working fine!");
  });

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
});