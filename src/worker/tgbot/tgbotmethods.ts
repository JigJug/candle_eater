import { TradeInfo } from "../typings"

export function makeAlert(info: TradeInfo){
  const url = `https://www.tradingview.com/chart/isXDKqS6/?symbol=${info.exchangePrefix}%3A${info.ticker}&interval=${info.timeFrame}`;
  const caption =   `
  🔔ALERT🔔\n
  ${info.ticker}\n
  🕒 ${info.timeFrame} 🕒\n
  ${bullishBearishAlert(info.bullishBearish)}
  ⚠️ Engulfing Zone ⚠️
  ${bullishBearishAlert(info.bullishBearish)}\n
  📈📉chart:\n${url}\n
  `;
  return {url, caption}
}
  
function bullishBearishAlert(bullishOrBearish: "Bullish" | "Bearish"){
  const emojis = {
    Bullish: "🟢🟢🟢🟢🟢🟢🟢🟢",
    Bearish: "🔴🔴🔴🔴🔴🔴🔴🔴"
  }
  return emojis[bullishOrBearish]
}