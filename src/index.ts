import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {Bot } from "grammy"
import { BOT_TOKEN, MONGO_URI, DB_NAME, DB_COLLECTION } from "./configs/config"
import { MongoClient, Collection } from 'mongodb';
console.log(MONGO_URI)
if(BOT_TOKEN === undefined) process.exit(".env errror");
if(MONGO_URI === undefined) process.exit(".env errror");

console.log(MONGO_URI)

let ALERT_DATA = null

const client: MongoClient = new MongoClient(MONGO_URI);


interface AlertData {
    alertId: string;
    message: string;
    timestamp: Date;
    price: number;
}



// Connect to the MongoDB database
async function connectToDatabase(): Promise<Collection<AlertData> | undefined> {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Select the database and collection
    const db = client.db(DB_NAME);
    const collection: Collection<AlertData> = db.collection(DB_COLLECTION);

    // Return the collection
    return collection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return
  }
}

async function loadAllAlerts(): Promise<AlertData[] | void> {
  const collection = await connectToDatabase();

  if (!collection) {
    console.error("Could not access collection");
    return;
  }

  try {
    // Retrieve all documents from the collection
    const alerts: AlertData[] = await collection.find({}).toArray();
    console.log('All alerts:', alerts);

    // Return the array of alerts
    return alerts;
  } catch (error) {
    console.error('Error loading alerts:', error);
  } finally {
    await client.close();
  }
}


async function saveAlertData(alertData: AlertData): Promise<void> {
  const collection = await connectToDatabase();

  if (!collection) {
    console.error("Could not access collection");
    return;
  }

  try {
    // Insert alert data into MongoDB
    const result = await collection.insertOne(alertData);
    console.log(`New alert inserted with ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Error inserting alert data:', error);
  } finally {
    await client.close();
  }
}



const bot = new Bot(BOT_TOKEN)
let CHAT_ID = -1002290965591


const app = express();
const port = process.env.PORT || 8080; //8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


bot.command('start', (ctx) => {

  console.log(ctx.channelPost);

  const chatId = ctx.chatId;
  CHAT_ID = ctx.chatId

  if(ctx.channelPost?.message_id){
    ctx.reply("working")
  }

})

bot.on('message', (ctx) => {
  ctx.reply('helloooo')
})

bot.start()


app.get("/", async (req, res, next) => {
  //res.set('Access-Control-Allow-Origin', '*');
  res.send("HELLO FROM BOT GET REQUEST");
  bot.api.sendMessage(CHAT_ID, "TESTING GET MESSAGE")
  next();
});


interface PostInfo {
  bullishBearish: "Bullish" | "Bearish"
  high: string // str float 2dp
  low: string // str float 2dp
  Timeframe: string
  tfNum: number
  Ticker: string
  Exchange: string
  Time: string //2023-09-18 14:30
  messageId?: string
  alertId?: string
}

function arrangeMessage(message: string): PostInfo {
  const si = message.split("\n");
  let x: "Bullish" | "Bearish" = "Bearish";
  if (si[0] === "Bullish") x = "Bullish";
  let tf = 15;
  if (si[3] === "Timeframe: 1h") tf = 60;
  return {
    bullishBearish: x,
    high: si[1],
    low: si[2],
    Timeframe: si[3],
    tfNum: tf,
    Ticker: si[5],
    Exchange: si[4],
    Time: si[6],
  }
}

function makeAlert(info: PostInfo){
  return `
🔔ALERT🔔\n
${info.Ticker}\n
🕒 ${info.Timeframe} 🕒\n
${bullishBearishAlert(info.bullishBearish)}
⚠️ Engulfing Zone ⚠️
${bullishBearishAlert(info.bullishBearish)}\n
📈📉chart:\n\nhttps://www.tradingview.com/chart/isXDKqS6/?symbol=${info.Exchange}%3A${info.Ticker}&interval=${info.tfNum}\n
  `
}

function bullishBearishAlert(bullishOrBearish: "Bullish" | "Bearish"){
  const emojis = {
    Bullish: "🟢🟢🟢🟢🟢🟢🟢🟢",
    Bearish: "🔴🔴🔴🔴🔴🔴🔴🔴"
  }
  return emojis[bullishOrBearish]
}


// Call the function to retrieve all saved alerts
loadAllAlerts().then((alerts) => {
  if (alerts) {
    // Handle alerts array
    console.log(alerts);
    ALERT_DATA = alerts
  }
});




app.post("/botalert", async (req, res, next) => {

  console.log("alert!")

  console.log(req.body.message)

  if(req.body.message === undefined) {return next();}

  if(req.body.message.indexOf("Price entered") != -1) {return next();}

  if(req.body.message.indexOf("High") == -1) {return next();}
  
  const message = await bot.api.sendMessage(CHAT_ID, makeAlert(arrangeMessage(req.body.message)));

  message.message_id


  return next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});