export interface TradeInfo {
  type: "range" | "price" | "daily" | "crypto",
  bullishBearish: "Bullish" | "Bearish"
  chart: string
  ID: string
  High: string // str float 2dp
  Low: string // str float 2dp
  timeFrame: string
  ticker: string
  exchangePrefix: string
  Time: string //2023-09-18 14:30
  messageId?: number | null
}