import { TradeInfo } from "../typings"

export function makeAlert(info: TradeInfo){
  const url = `https://www.tradingview.com/chart/${info.chart}/?symbol=${info.exchangePrefix}%3A${info.ticker}&interval=${info.timeFrame}`;
  const caption =   `
  🔔ALERT🔔\n
  ${info.ticker}\n
  🕒 ${info.timeFrame} 🕒\n
  ${bullishBearishAlert(info.bullishBearish)}
  ${alertType(info.type)}
  ${bullishBearishAlert(info.bullishBearish)}\n
  📈📉chart:\n${url}\n
  `;
  return {url, caption}
}

function alertType(alertType: string){
  if(alertType === "range") return "⚠️ Engulfing Zone ⚠️"
  if(alertType === "daily") return "⚠️ Daily Bias ⚠️"
  else return ""
}
  
function bullishBearishAlert(bullishOrBearish: "Bullish" | "Bearish"){
  const emojis = {
    Bullish: "🟢🟢🟢🟢🟢🟢🟢🟢",
    Bearish: "🔴🔴🔴🔴🔴🔴🔴🔴"
  }
  return emojis[bullishOrBearish]
}