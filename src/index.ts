import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { bot, PORT } from "./configs/config";
import { botAlertHandler, getHandleer, portMessage } from "./middleware/handlers";

//start express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", getHandleer);
app.post("/botalert", botAlertHandler);
app.listen(PORT, portMessage);


//start bot
bot.command('start', (ctx) => {
  console.log(ctx.channelPost);
  if(ctx.channelPost?.message_id){
    ctx.reply("working")
  }
})

bot.on('message', (ctx) => {
  ctx.reply('helloooo')
})

bot.start()



