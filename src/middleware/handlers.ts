import { Request, Response, NextFunction } from "express"
import { makeAlert } from "../tgbot/tgbotmethods"
import { getPicWithBrowser } from "../pup/getpic"
import { Message, InputFile } from "grammy/types"
import { bot, CHAT_ID, PORT } from "../configs/config"
import { saveAlertData } from "../mongodb/mongodbmethods"

export const botAlertHandler = async (req: Request, res:Response, next: NextFunction) => {

  console.log("alert!")

  console.log(req.body)
  
  res.status(200).send('Alert received'); // Respond to TradingView

  if(req.body === undefined) {return next();}

  //if(req.body.message.indexOf("BearishRange")) await bot.api.sendMessage(CHAT_ID, req.body)

  if(!("bullishBearish" in req.body)) {return next();}

  const tradeInfo = req.body//arrangeMessage(req.body)

  const {url, caption} = makeAlert(tradeInfo);

  const picBuffer = await getPicWithBrowser(url);

  let tgMessage: Message | null = null
  if(picBuffer != null){
    console.log("finished grabbing piccy")

    const pic = new InputFile(picBuffer, `chart_${tradeInfo.ID}.png`)

    console.log("got inputfile")

    tgMessage = await bot.api.sendPhoto(CHAT_ID, pic, {caption})

  } else{
    tgMessage = await bot.api.sendMessage(CHAT_ID, caption)
  }

  tradeInfo["messageId"] = tgMessage.message_id

  await saveAlertData(tradeInfo)

  return next();
}

export const getHandleer = async (req: Request, res:Response, next: NextFunction) => {
    //res.set('Access-Control-Allow-Origin', '*');
  res.send("HELLO FROM BOT GET REQUEST");
  bot.api.sendMessage(CHAT_ID, "TESTING GET MESSAGE")
  next();
}

export const portMessage = () => {
  console.log(`listening on port ${PORT}`);
}