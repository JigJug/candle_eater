import dotenv from "dotenv"
import { Bot } from "grammy"
import { MongoClient } from "mongodb"
dotenv.config()

export const PORT = process.env.PORT || 8080; //8080;
export const BOT_TOKEN = process.env.BOT_TOKEN
export const MONGO_URI = process.env.MONGO_URI
export const DB_NAME = "candleeatersdb"
export const DB_COLLECTION = "ranges"

//start bot
if(BOT_TOKEN === undefined) process.exit(".env errror");
export const bot = new Bot(BOT_TOKEN)
export const CHAT_ID = -1002290965591

//start mongo
if(MONGO_URI === undefined) process.exit(".env errror");
export const mongoClient: MongoClient = new MongoClient(MONGO_URI);