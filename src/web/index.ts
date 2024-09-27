import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PORT, MONGO_URI } from "./configs/config";
import { alertHandler, getHandleer, portMessage } from "./middleware/handlers";
import { connectMongo } from "./mongodb/mongoconnect";

connectMongo().catch(err => process.exit(`web mongo connect error ${err}`))

/**
 * UPDATES TODO
 * 
 * split into web and worker dyno 
 * - add que system using mongo db
 * - worker to handle taking snapshot and telegram
 * - web for express and messages only
 * 
 * add range price tracking
 * - logic to handle alerts for price inside ranges
 * - link range ids to messages and reply to tg messages
 * - add buttons to dump incorrect ranges (bearish range in middle of uptrend/ wrong bias/daily bias)
 */

//start express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", getHandleer);
app.post("/botalert", alertHandler);
app.listen(PORT, portMessage);
