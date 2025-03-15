import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"))

app.set('json spaces', 4);

const start = async () => {
 
 const connectDB = await mongoose.connect( "mongodb+srv://shaikhzahid178:M0I6CUxdAT3TMDmB@apnaproconnect.xdir2.mongodb.net/?retryWrites=true&w=majority&appName=apnaproconnect",)

 app.listen(9080, () => {
    console.log("Server is running on port 9080")
 })

}

start();