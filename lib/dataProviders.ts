// lib/dataProviders.ts
// Supports: TwelveData | AlphaVantage | Polygon | Demo (simulated)

export interface Candle {
  time: string;       // "HH:MM"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isGreen: boolean;
}

export interface SessionData {
  date: string;
  dayName: string;
  candles: Candle[];
  open: number;
  high: number;
  low: number;
  close: number;
  pnl: number;
  range: number;
  bullish: boolean;
  source: string;
}

// ─── DEMO / SIMULATED DATA ────────────────────────────────────────────────────
function generateDemoSession(daysBack: number): SessionData | null {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  if (dayName === 'Saturday' || dayName === 'Sunday') return null;

  let basePrice = 2310 + Math.random() * 100 - 50;
  const candles: Candle[] = [];
  const sessionStart = 7 * 60;
  const sessionEnd = 12 * 60;
  const interval = 15;

  let trend = Math.random() > 0.5 ? 1 : -1;
  const trendStrength = Math.random() * 0.5 + 0.2;
  let volatility = Math.random() * 3 + 1.5;

  for (let m = sessionStart; m < sessionEnd; m += interval) {
    const hour = Math.floor(m / 60);
    const min = m % 60;
    const label = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

    if (m === sessionStart) volatility *= 1.9;
    else if (m === sessionStart + interval) volatility /= 1.5;

    const open = basePrice;
    const move = (Math.random() - 0.5 + trend * trendStrength * 0.3) * volatility;
    const close = open + move;
    const high = Math.max(open, close) + Math.random() * volatility * 0.7;
    const low = Math.min(open, close) - Math.random() * volatility * 0.7;
    const volume = Math.floor(Math.random() * 5000 + 800);

    candles.push({
      time: label,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
      isGreen: close >= open,
    });

    basePrice = close;
    if (Math.random() < 0.15) trend *= -1;
  }

  const opens = candles[0].open;
  const closes = candles[candles.length - 1].close;
  const highs = Math.max(...candles.map(c => c.high));
  const lows = Math.min(...candles.map(c => c.low));

  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    dayName,
    candles,
    open: +opens.toFixed(2),
    high: +highs.toFixed(2),
    low: +lows.toFixed(2),
    close: +closes.toFixed(2),
    pnl: +(closes - opens).toFixed(2),
    range: +(highs - lows).toFixed(2),
    bullish: closes > opens,
    source: 'demo',
  };
}

export function generateDemoSessions(count = 7): SessionData[] {
  const sessions: SessionData[] = [];
  for (let d = count; d >= 0; d--) {
    const s = generateDemoSession(d);
    if (s) sessions.push(s);
  }
  return sessions;
}

// ─── TWELVE DATA ──────────────────────────────────────────────────────────────
export async function fetchTwelveData(apiKey: string): Promise<SessionData[]> {
  // XAU/USD 15-minute bars, last 5 days
  const url = `https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=15min&outputsize=200&apikey=${apiKey}&timezone=America/New_York&format=JSON`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const json = await res.json();

  if (json.status === 'error') throw new Error(json.message);

  interface TwelveBar {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }

  const bars: TwelveBar[] = json.values || [];

  // Group by date, filter to NY session hours (07:00–11:45 ET)
  const byDate: Record<string, Candle[]> = {};
  for (const bar of bars.reverse()) {
    const [datePart, timePart] = bar.datetime.split(' ');
    const [hh, mm] = timePart.split(':').map(Number);
    const totalMin = hh * 60 + mm;
    if (totalMin < 7 * 60 || totalMin >= 12 * 60) continue;

    const label = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
    if (!byDate[datePart]) byDate[datePart] = [];
    const o = parseFloat(bar.open);
    const c = parseFloat(bar.close);
    byDate[datePart].push({
      time: label,
      open: o,
      high: parseFloat(bar.high),
      low: parseFloat(bar.low),
      close: c,
      volume: parseInt(bar.volume) || 1000,
      isGreen: c >= o,
    });
  }

  return Object.entries(byDate).slice(-7).map(([dateStr, candles]) => {
    const d = new Date(dateStr + 'T12:00:00');
    const opens = candles[0].open;
    const closes = candles[candles.length - 1].close;
    const highs = Math.max(...candles.map(c => c.high));
    const lows = Math.min(...candles.map(c => c.low));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
      candles,
      open: +opens.toFixed(2),
      high: +highs.toFixed(2),
      low: +lows.toFixed(2),
      close: +closes.toFixed(2),
      pnl: +(closes - opens).toFixed(2),
      range: +(highs - lows).toFixed(2),
      bullish: closes > opens,
      source: 'twelvedata',
    };
  });
}

// ─── ALPHA VANTAGE ────────────────────────────────────────────────────────────
export async function fetchAlphaVantage(apiKey: string): Promise<SessionData[]> {
  const url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=XAU&to_symbol=USD&interval=15min&outputsize=full&apikey=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const json = await res.json();

  const timeSeries = json['Time Series FX (15min)'];
  if (!timeSeries) throw new Error('Alpha Vantage: no data');

  interface AVBar {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
  }

  const byDate: Record<string, Candle[]> = {};
  for (const [dt, bar] of Object.entries(timeSeries) as [string, AVBar][]) {
    const [datePart, timePart] = dt.split(' ');
    const [hh, mm] = timePart.split(':').map(Number);
    const totalMin = hh * 60 + mm;
    // Alpha Vantage timestamps are UTC; NY session = 12:00–17:00 UTC (winter) / 11:00–16:00 UTC (summer)
    // Approximate: filter 11:00–17:00 UTC
    if (totalMin < 11 * 60 || totalMin >= 17 * 60) continue;

    if (!byDate[datePart]) byDate[datePart] = [];
    const o = parseFloat(bar['1. open']);
    const c = parseFloat(bar['4. close']);
    byDate[datePart].push({
      time: timePart.slice(0, 5),
      open: o,
      high: parseFloat(bar['2. high']),
      low: parseFloat(bar['3. low']),
      close: c,
      volume: 1000,
      isGreen: c >= o,
    });
  }

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([dateStr, candles]) => {
      const d = new Date(dateStr);
      const opens = candles[0].open;
      const closes = candles[candles.length - 1].close;
      const highs = Math.max(...candles.map(c => c.high));
      const lows = Math.min(...candles.map(c => c.low));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
        candles,
        open: +opens.toFixed(2),
        high: +highs.toFixed(2),
        low: +lows.toFixed(2),
        close: +closes.toFixed(2),
        pnl: +(closes - opens).toFixed(2),
        range: +(highs - lows).toFixed(2),
        bullish: closes > opens,
        source: 'alphavantage',
      };
    });
}

// ─── POLYGON.IO ───────────────────────────────────────────────────────────────
export async function fetchPolygon(apiKey: string): Promise<SessionData[]> {
  // Polygon free tier: C:XAUUSD aggregate bars
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10);
  const url = `https://api.polygon.io/v2/aggs/ticker/C:XAUUSD/range/15/minute/${from}/${to}?adjusted=true&sort=asc&limit=500&apiKey=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const json = await res.json();

  if (json.status === 'ERROR') throw new Error(json.error);

  interface PolyBar { t: number; o: number; h: number; l: number; c: number; v: number }

  const byDate: Record<string, Candle[]> = {};
  for (const bar of (json.results || []) as PolyBar[]) {
    const dt = new Date(bar.t);
    const etStr = dt.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const etDate = new Date(etStr);
    const hh = etDate.getHours();
    const mm = etDate.getMinutes();
    const totalMin = hh * 60 + mm;
    if (totalMin < 7 * 60 || totalMin >= 12 * 60) continue;

    const datePart = etDate.toISOString().slice(0, 10);
    if (!byDate[datePart]) byDate[datePart] = [];
    byDate[datePart].push({
      time: `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`,
      open: bar.o, high: bar.h, low: bar.l, close: bar.c, volume: Math.floor(bar.v),
      isGreen: bar.c >= bar.o,
    });
  }

  return Object.entries(byDate).slice(-7).map(([dateStr, candles]) => {
    const d = new Date(dateStr);
    const opens = candles[0].open;
    const closes = candles[candles.length - 1].close;
    const highs = Math.max(...candles.map(c => c.high));
    const lows = Math.min(...candles.map(c => c.low));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
      candles,
      open: +opens.toFixed(2), high: +highs.toFixed(2), low: +lows.toFixed(2), close: +closes.toFixed(2),
      pnl: +(closes - opens).toFixed(2), range: +(highs - lows).toFixed(2), bullish: closes > opens,
      source: 'polygon',
    };
  });
}
