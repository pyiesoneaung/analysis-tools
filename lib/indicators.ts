// lib/indicators.ts

export function calcEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  let ema = data[0];
  return data.map(v => {
    ema = v * k + ema * (1 - k);
    return +ema.toFixed(2);
  });
}

export function calcRSI(closes: number[], period = 14): (number | null)[] {
  const deltas = closes.slice(1).map((v, i) => v - closes[i]);
  const results: (number | null)[] = new Array(period).fill(null);

  let gains = 0, losses = 0;
  deltas.slice(0, period).forEach(d => {
    if (d > 0) gains += d;
    else losses -= d;
  });

  let avgGain = gains / period;
  let avgLoss = losses / period;
  results.push(+(100 - 100 / (1 + avgGain / (avgLoss || 0.001))).toFixed(2));

  for (let i = period; i < deltas.length; i++) {
    avgGain = (avgGain * (period - 1) + Math.max(deltas[i], 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-deltas[i], 0)) / period;
    results.push(+(100 - 100 / (1 + avgGain / (avgLoss || 0.001))).toFixed(2));
  }

  return results;
}

export function calcVWAP(candles: { high: number; low: number; close: number; volume: number }[]): number[] {
  let cumTP = 0, cumVol = 0;
  return candles.map(c => {
    cumTP += ((c.high + c.low + c.close) / 3) * c.volume;
    cumVol += c.volume;
    return +(cumTP / cumVol).toFixed(2);
  });
}

export function calcBollingerBands(closes: number[], period = 20, stdDev = 2) {
  return closes.map((_, i) => {
    if (i < period - 1) return { upper: null, middle: null, lower: null };
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
    const sd = Math.sqrt(variance);
    return {
      upper: +(mean + stdDev * sd).toFixed(2),
      middle: +mean.toFixed(2),
      lower: +(mean - stdDev * sd).toFixed(2),
    };
  });
}

export function calcATR(candles: { high: number; low: number; close: number }[], period = 14): number[] {
  const trs = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prevClose = candles[i - 1].close;
    return Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
  });
  const atrs: number[] = [];
  let atr = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = 0; i < trs.length; i++) {
    if (i < period) { atrs.push(+atr.toFixed(2)); continue; }
    atr = (atr * (period - 1) + trs[i]) / period;
    atrs.push(+atr.toFixed(2));
  }
  return atrs;
}

export interface ChartCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isGreen: boolean;
  ema9?: number;
  ema21?: number;
  ema50?: number;
  vwap?: number;
  rsi?: number | null;
  bbUpper?: number | null;
  bbMiddle?: number | null;
  bbLower?: number | null;
  atr?: number;
}

export function enrichCandles(candles: {
  time: string; open: number; high: number; low: number; close: number; volume: number; isGreen: boolean
}[]): ChartCandle[] {
  const closes = candles.map(c => c.close);
  const ema9 = calcEMA(closes, 9);
  const ema21 = calcEMA(closes, 21);
  const ema50 = calcEMA(closes, Math.min(50, closes.length));
  const vwap = calcVWAP(candles);
  const rsi = calcRSI(closes, 14);
  const bb = calcBollingerBands(closes, Math.min(20, closes.length));
  const atr = calcATR(candles, 14);

  return candles.map((c, i) => ({
    ...c,
    ema9: ema9[i],
    ema21: ema21[i],
    ema50: ema50[i],
    vwap: vwap[i],
    rsi: rsi[i],
    bbUpper: bb[i].upper,
    bbMiddle: bb[i].middle,
    bbLower: bb[i].lower,
    atr: atr[i],
  }));
}
