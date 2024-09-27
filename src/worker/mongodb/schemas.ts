import mongoose, { Schema, Document} from "mongoose";

// Alert Queue Schema
export interface IAlertQueue extends Document {
  type: "range" | "price";
  bullishBearish: "Bullish" | "Bearish";
  ID: string;
  High: string;
  Low: string;
  timeFrame: string;
  exchangePrefix: string;
  ticker: string;
  Time: string;
}
  
const alertQueueSchema: Schema<IAlertQueue> = new Schema({
  type: { type: String, required: true },
  bullishBearish: { type: String, required: true },
  ID: { type: String, required: true },
  High: { type: String, required: true },
  Low: { type: String, required: true },
  timeFrame: { type: String, required: true },
  exchangePrefix: { type: String, required: true },
  ticker: { type: String, required: true },
  Time: { type: String, required: true },
});

const AlertQueue = mongoose.model<IAlertQueue>('AlertQueue', alertQueueSchema);

// Processed Alerts Schema
interface IProcessedAlert extends Document {
  type: "range" | "price";
  bullishBearish: "Bullish" | "Bearish";
  ID: string;
  High: string;
  Low: string;
  timeFrame: string;
  exchangePrefix: string;
  ticker: string;
  Time: string;
  messageId: number;
  processedAt: Date;
}

const processedAlertSchema: Schema<IProcessedAlert> = new Schema({
  type: { type: String, required: true },
  bullishBearish: { type: String, required: true },
  ID: { type: String, required: true },
  High: { type: String, required: true },
  Low: { type: String, required: true },
  timeFrame: { type: String, required: true },
  exchangePrefix: { type: String, required: true },
  ticker: { type: String, required: true },
  Time: { type: String, required: true },
  messageId: { type: Number, required: true },
  processedAt: { type: Date, default: Date.now },
});

const ProcessedAlert = mongoose.model<IProcessedAlert>('ProcessedAlert', processedAlertSchema);

export { AlertQueue, ProcessedAlert };