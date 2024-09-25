import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {Bot, InputFile } from "grammy"
import { getPicWithBrowser } from "./utils/getpic";
import { BOT_TOKEN, MONGO_URI, DB_NAME, DB_COLLECTION } from "./configs/config"
import { MongoClient, Collection } from 'mongodb';

if(BOT_TOKEN === undefined) process.exit(".env errror");
if(MONGO_URI === undefined) process.exit(".env errror");

let ALL_TRADES: null | TradeInfo[] = null

const client: MongoClient = new MongoClient(MONGO_URI);


interface TradeInfo {
  bullishBearish: "Bullish" | "Bearish"
  ID: number | null
  High: string // str float 2dp
  Low: string // str float 2dp
  timeFrame: string
  tfNum: number
  ticker: string
  exchangePrefix: string
  Time: string //2023-09-18 14:30
  messageId?: number | null
}



// Connect to the MongoDB database
async function connectToDatabase(): Promise<Collection<TradeInfo> | undefined> {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Select the database and collection
    const db = client.db(DB_NAME);
    const collection: Collection<TradeInfo> = db.collection(DB_COLLECTION);

    // Return the collection
    return collection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return
  }
}

async function loadAllAlerts(): Promise<TradeInfo[] | void> {
  const collection = await connectToDatabase();

  if (!collection) {
    console.error("Could not access collection");
    return;
  }

  try {
    // Retrieve all documents from the collection
    const alerts: TradeInfo[] = await collection.find({}).toArray();
    console.log('All alerts:', alerts);

    // Return the array of alerts
    return alerts;
  } catch (error) {
    console.error('Error loading alerts:', error);
  } finally {
    await client.close();
  }
}


async function saveAlertData(alertData: TradeInfo): Promise<void> {
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



function arrangeMessage(m: TradeInfo): TradeInfo {

  let tf = 15;
  if (m.timeFrame === "Timeframe: 30m") tf = 30;
  if (m.timeFrame === "Timeframe: 1h") tf = 60;
  if (m.timeFrame === "Timeframe: 4h") tf = 240;

  m["tfNum"] = tf
  m["messageId"] = null

  return m
}

function makeAlert(info: TradeInfo){
  return `
🔔ALERT🔔\n
${info.ticker}\n
🕒 ${info.timeFrame} 🕒\n
${bullishBearishAlert(info.bullishBearish)}
⚠️ Engulfing Zone ⚠️
${bullishBearishAlert(info.bullishBearish)}\n
📈📉chart:\nhttps://www.tradingview.com/chart/isXDKqS6/?symbol=${info.exchangePrefix}%3A${info.ticker}&interval=${info.tfNum}\n
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
    ALL_TRADES = alerts
    //console.log('got dababase data: ', ALL_TRADES)
  }
});




app.post("/botalert", async (req, res, next) => {

  console.log("alert!")

  console.log(req.body)
  

  res.status(200).send('Alert received'); // Respond to TradingView

  if(req.body.message === undefined) {return next();}

  if(req.body.message.indexOf("BearishRange")) await bot.api.sendMessage(CHAT_ID, req.body)

  if(!("bullishBearish" in req.body.message)) {return next();}

  const tradeInfo = arrangeMessage(req.body.message)

  const caption = makeAlert(tradeInfo)

  const picBuffer = await getPicWithBrowser(`https://www.tradingview.com/chart/isXDKqS6/?symbol=${tradeInfo.exchangePrefix}%3A${tradeInfo.ticker}&interval=${tradeInfo.tfNum}`);

  let message = null
  if(picBuffer != null){
    console.log("finished grabbing piccy")

    const pic = new InputFile(picBuffer, `chart_${tradeInfo.ID}.png`)

    console.log("got inputfile")

    message = await bot.api.sendPhoto(CHAT_ID, pic, {caption})

  } else{
    message = await bot.api.sendMessage(CHAT_ID, caption)
  }

  tradeInfo.messageId = message.message_id

  await saveAlertData(tradeInfo)

  ALL_TRADES?.push(tradeInfo)

  
  //const message = await bot.api.sendMessage(CHAT_ID, makeAlert(tradeInfo));




  return next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});