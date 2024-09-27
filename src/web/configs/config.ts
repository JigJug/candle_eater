import dotenv from "dotenv"
dotenv.config()
export const PORT = process.env.PORT || 8080; //8080;
if(process.env.MONGO_URI === undefined) process.exit(".env errror");
export const MONGO_URI = process.env.MONGO_URI