import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectdb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is connected");

    }catch(err){
        res.status(400).json({message: err.message});
    }
    
}