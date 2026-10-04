import type { PricePoint, TechnicalIndicators } from '@/types';

export function sma(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] ?? 0;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

export function ema(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  const k = 2 / (period + 1);
  let emaVal = prices[0];
  for (let i = 1; i < prices.length; i++) {
    emaVal = prices[i] * k + emaVal * (1 - k);
  }
  return emaVal;
}

export function rsi(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function macd(prices: number[]): { macd: number; signal: number; histogram: number } {
  if (prices.length < 35) {
    const last = prices[prices.length - 1] ?? 0;
    return { macd: 0, signal: 0, histogram: 0 };
  }
  const ema12Arr: number[] = [];
  const ema26Arr: number[] = [];
  const k12 = 2 / 13;
  const k26 = 2 / 27;
  let e12 = prices[0];
  let e26 = prices[0];
  for (let i = 0; i < prices.length; i++) {
    e12 = i === 0 ? prices[0] : prices[i] * k12 + e12 * (1 - k12);
    e26 = i === 0 ? prices[0] : prices[i] * k26 + e26 * (1 - k26);
    ema12Arr.push(e12);
    ema26Arr.push(e26);
  }
  const macdLine = ema12Arr.map((v, i) => v - ema26Arr[i]);
  const signalLine = ema(macdLine.slice(-35), 9);
  const macdValue = macdLine[macdLine.length - 1];
  const histogram = macdValue - signalLine;
  return { macd: macdValue, signal: signalLine, histogram };
}

export function bollingerBands(prices: number[], period = 20, multiplier = 2): { upper: number; middle: number; lower: number } {
  const slice = prices.slice(-period);
  const middle = slice.reduce((a, b) => a + b, 0) / slice.length;
  const variance = slice.reduce((acc, p) => acc + (p - middle) ** 2, 0) / slice.length;
  const stdDev = Math.sqrt(variance);
  return {
    upper: middle + multiplier * stdDev,
    middle,
    lower: middle - multiplier * stdDev,
  };
}

export function volatility(prices: number[], period = 20): number {
  const returns: number[] = [];
  for (let i = Math.max(1, prices.length - period); i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((acc, r) => acc + (r - mean) ** 2, 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}

export function computeTechnicals(history: PricePoint[]): TechnicalIndicators {
  const prices = history.map((h) => h.price);
  const bb = bollingerBands(prices);
  const m = macd(prices);
  return {
    sma20: sma(prices, 20),
    sma50: sma(prices, 50),
    sma200: sma(prices, 200),
    rsi: rsi(prices),
    macd: m.macd,
    macdSignal: m.signal,
    macdHistogram: m.histogram,
    bollingerUpper: bb.upper,
    bollingerMiddle: bb.middle,
    bollingerLower: bb.lower,
    volatility: volatility(prices),
  };
}
