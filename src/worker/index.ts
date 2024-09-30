import dotenv from "dotenv";
import { Bot,  } from "grammy";
dotenv.config();
import { makeAlert } from "./tgbot/tgbotmethods";
import { getPicWithBrowser } from "./pup/getpic";
import { Message, InputFile } from "grammy/types";
import { ProcessedAlert, AlertQueue, IAlertQueue } from "./mongodb/schemas";
import { TradeInfo } from "./typings";
import { connectMongo } from "./mongodb/mongoconnect";

connectMongo().catch(err => process.exit(`worker mongo connect error ${err}`));

//start bot
if(process.env.BOT_TOKEN === undefined) process.exit(".env errror");
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot(BOT_TOKEN);
const CHAT_ID = -1002290965591;
const CHAT_ID_DAILY = -1002472723761;

bot.command('start', (ctx) => {
  console.log(ctx.channelPost);
  if(ctx.channelPost?.message_id){
    ctx.reply("working");
  }
});

bot.on('message', async (ctx) => {
  try {
    if(ctx.msg.chat.id === CHAT_ID) {
      const msg = await ctx.reply('helloooo');
      if(msg) console.log("message sent")
    }
    
  } catch (error) {
    console.error(error)
  }
  
});

bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data
  try {
    if(data == "Pin") await ctx.pinChatMessage(ctx.msg?.message_id!)? console.log("message pinned") : console.error("failed to pin message");
    else if(data == "Delete") await ctx.deleteMessages([ctx.msg?.message_id!])? console.log("message deleted") : console.error("failed to pin deleted");
  } catch (error) {
    console.error(error);
  }

})

bot.start();


function errorCatcher(
  errorName: 
  | "bodyUndefined"
  | "notRangeAlert"
  | "unexpectedData"
  | "mongodbprocessed"
) {
  const errorLogs: Record<string, () => void> = {
    bodyUndefined: () => console.error("ERROR: request alert body undefined"),
    notRangeAlert: () => console.error("ERROR: not a range alert"),
    unexpectedData: () => console.error("ERROR: unexpected data in alert"),
    mongodbprocessed: () => console.error("ERROR: mongodb error saving to processed alerts")
  }
  errorLogs[errorName]();
}

function tempSolTradeButton(info: TradeInfo){
  const reply_markup = {
    inline_keyboard: [
      [
        { text: "Pin", callback_data: "Pin" },
        { text: "Delete", callback_data: "Delete" }
      ]
    ],
    resize_keyboard: true,  // Optional: resizes the keyboard
    one_time_keyboard: true // Optional: hides the keyboard after use
  }
  if(
    info.type === "range"
    && info.ticker === "SOLUSDT"
  ){
    reply_markup.inline_keyboard.push([{ text: "Buy", callback_data: "Buy"}]);
  }
  return reply_markup;
}

async function rangeHandler(alert: IAlertQueue) {

  console.log("alert found!");
  if(!("bullishBearish" in alert)) errorCatcher("notRangeAlert");

  const tradeInfo: TradeInfo = alert.toObject();

  const {url, caption} = makeAlert(tradeInfo);

  const picBuffer = await getPicWithBrowser(url);

  let tgMessage: Message | null = null;
  if(picBuffer != null){
    console.log("finished grabbing piccy");

    const pic = new InputFile(picBuffer, `chart_${tradeInfo.ID}.png`);

    console.log("got inputfile");

    const reply_markup = tempSolTradeButton(tradeInfo);

    tgMessage = await bot.api.sendPhoto(CHAT_ID, pic, {caption, reply_markup});

  } else{
    tgMessage = await bot.api.sendMessage(CHAT_ID, caption);
  }

  tradeInfo["messageId"] = tgMessage.message_id;

  try {

    const processedAlert = new ProcessedAlert(tradeInfo);

    await processedAlert.save();

    await AlertQueue.deleteOne({_id: alert._id});
    
  } catch (error) {
    errorCatcher("mongodbprocessed");
  }

}


async function priceHandler(alert:IAlertQueue) {
  const alertId = alert.ID
  
  try {
    const foundAlert = await ProcessedAlert.findOne({ID: alertId})
    if(foundAlert !== null) {
      bot.api.sendMessage(CHAT_ID, "price in range", {reply_to_message_id: foundAlert?.messageId})
    }
  } catch (error) {
    console.error("could not find alert for price")
  }

  await AlertQueue.deleteOne({_id: alert._id});
  console.log("price alert")
}


async function dailyHandler(alert: IAlertQueue) {

  console.log("alert found!");
  if(!("bullishBearish" in alert)) errorCatcher("notRangeAlert");

  const tradeInfo: TradeInfo = alert.toObject();

  const {url, caption} = makeAlert(tradeInfo);

  const picBuffer = await getPicWithBrowser(url);

  let tgMessage: Message | null = null;
  if(picBuffer != null){
    console.log("finished grabbing piccy");

    const pic = new InputFile(picBuffer, `chart_${tradeInfo.ID}.png`);

    console.log("got inputfile");

    //const reply_markup = tempSolTradeButton(tradeInfo);

    tgMessage = await bot.api.sendPhoto(CHAT_ID_DAILY, pic, {caption});

  } else{
    tgMessage = await bot.api.sendMessage(CHAT_ID_DAILY, caption);
  }

  tradeInfo["messageId"] = tgMessage.message_id;

  try {
    //dont need to save alert just post in channel

    //const processedAlert = new ProcessedAlert(tradeInfo);

    //await processedAlert.save();

    await AlertQueue.deleteOne({_id: alert._id});
    
  } catch (error) {
    errorCatcher("mongodbprocessed");
  }

}

async function botAlertProcessor() {

  //get from que
  const alert = await AlertQueue.findOne().exec()

  if(alert === null) return

  if(alert.type === "range") await rangeHandler(alert);

  else if(alert.type === "price") await priceHandler(alert);

  else if(alert.type === "daily") await dailyHandler(alert);

  else errorCatcher("unexpectedData");


}

async function pollForAlerts(){
  while (true){
    try {
      await botAlertProcessor();
    } catch (error) {
      console.error("error processing the bot alert")
    }
    
    await new Promise(r => setTimeout(r,5000));
  }
}

pollForAlerts();