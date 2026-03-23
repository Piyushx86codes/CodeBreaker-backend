import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";


export const  connectDB = async()=>{
    try {
        const dbUrl = serverConfig.DB_URL;
        await mongoose.connect(dbUrl);
        logger.info("Successfully Connected to DataBase");
        mongoose.connection.on("error",(error)=>{
            logger.error("MongoDb Connection Error",error);
        })
        mongoose.connection.on("disconnected",()=>{
            logger.warn("MongoDb disconnected");
        })
        process.on("SIGINT",async()=>{
            await mongoose.connection.close();
            logger.info("MongoDb Connection Closed");
            process.exit(0);
        })
    } catch (error) {
        logger.error("Failed to Connect to Database",error);
        process.exit(1);
    }
}