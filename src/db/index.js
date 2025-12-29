import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n mongodb connected DB host : ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MONGODB connection FAILED :", error);
        process.exit(1); //or throw error 

    }
}

export default connectDB