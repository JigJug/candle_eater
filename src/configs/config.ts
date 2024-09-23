import dotenv from "dotenv"
import * as fs from "fs"
dotenv.config()

export const BOT_TOKEN = process.env.BOT_TOKEN
export const MONGO_URI = process.env.MONGO_URI
export const DB_NAME = "candleeatersdb"
export const DB_COLLECTION = "ranges"