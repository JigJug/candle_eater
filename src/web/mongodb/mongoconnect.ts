import mongoose from "mongoose";

if(process.env.MONGO_URI === undefined) process.exit(".env errror");
const MONGO_URI = process.env.MONGO_URI;
export async function connectMongo(){
    try {
        await mongoose.connect(MONGO_URI);
    } catch (error) {
        throw error
    }
}
