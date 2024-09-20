import * as fs from "fs";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {Bot } from "grammy"
import { BOT_TOKEN } from "./configs/config"

if(BOT_TOKEN === undefined) process.exit(".env errror");
const bot = new Bot(BOT_TOKEN)
let CHAT_ID = 0


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

app.post("/botalert", async (req, res, next) => {

  console.log("alert!")

  console.log(req.body)

  bot.api.sendMessage(CHAT_ID, `TESTING POST MESSAGE, ${JSON.stringify(req.body)}`)
  bot.api.sendMessage(CHAT_ID, "https://www.tradingview.com/chart/isXDKqS6/")


  return next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});