import { Request, Response, NextFunction } from "express"
import { PORT } from "../configs/config"
import { AlertQueue } from "../mongodb/schemas"
import { Console } from "console";

export const alertHandler = async (req: Request, res:Response, next: NextFunction) => {

  res.status(200).send('received');
  if(req.body === undefined) errorCatcher("bodyUndefined");

  console.log(req.body)

  const alertData = new AlertQueue(req.body);

  try {
    await alertData.save();
  } catch (err) {
    console.error('Error adding alert to queue:', err);
  }
  next();
}

export const getHandleer = async (req: Request, res:Response, next: NextFunction) => {
    //res.set('Access-Control-Allow-Origin', '*');
  res.send("HELLO FROM BOT GET REQUEST");
  next();
}

export const portMessage = () => {
  console.log(`listening on port ${PORT}`);
}

function errorCatcher(
  errorName: 
  | "bodyUndefined"
  | "notRangeAlert"
  | "unexpectedData"
) {
  const errorLogs: Record<string, () => void> = {
    bodyUndefined: () => console.log("ERROR: request alert body undefined"),
    notRangeAlert: () => console.log("ERROR: not a range alert"),
    unexpectedData: () => console.log("ERROR: unexpected data in alert")
  }
  errorLogs[errorName]();
}