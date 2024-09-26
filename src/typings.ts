export interface TradeInfo {
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