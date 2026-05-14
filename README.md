# XAU/USD NY Session Analyzer

A professional **Next.js 14** application for analyzing Gold (XAU/USD) price action during the **New York trading session (07:00–12:00 ET)**. Features live session detection, technical indicators, volume analysis, and multi-day session history.

![Dashboard Preview](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Features

- **Live Session Clock** — Real-time ET clock with session progress bar
- **Price Chart** — 15-minute OHLCV with EMA 9/21/50, VWAP, Bollinger Bands
- **RSI (14)** — Overbought/oversold levels highlighted
- **Volume** — Color-coded bullish/bearish bars
- **Heatmap** — Intraday volatility heatmap + ATR(14) chart
- **Session Stats Table** — Multi-day OHLC, P&L, range, bias
- **Summary Cards** — Win rate, avg range, cumulative P&L
- **Multiple Data Providers** — Twelve Data, Alpha Vantage, Polygon.io, or Demo mode
- **Auto-refresh** every 60 seconds during live session

---

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/xauusd-ny-session.git
cd xauusd-ny-session
```

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Use "demo" for no API key required
DATA_PROVIDER=demo

# OR use a real provider:
DATA_PROVIDER=twelvedata
TWELVEDATA_API_KEY=your_key_here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📡 Data Providers

| Provider | Free Tier | Sign Up | Notes |
|----------|-----------|---------|-------|
| **Demo** | ✅ Always free | None needed | Simulated data, no API key |
| **Twelve Data** | ✅ 800 req/day | [twelvedata.com](https://twelvedata.com) | Best option — native XAU/USD support |
| **Alpha Vantage** | ✅ 25 req/day | [alphavantage.co](https://www.alphavantage.co/support/#api-key) | Free, limited rate |
| **Polygon.io** | ⚠ Paid for forex | [polygon.io](https://polygon.io) | Requires paid plan for C:XAUUSD |

### Setting up Twelve Data (recommended)

1. Sign up at [twelvedata.com](https://twelvedata.com)
2. Get your free API key from the dashboard
3. In `.env.local`:
   ```env
   DATA_PROVIDER=twelvedata
   TWELVEDATA_API_KEY=abc123yourkey
   ```

---

## 🐙 Deploy to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: XAU/USD NY Session Analyzer"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/xauusd-ny-session.git
git branch -M main
git push -u origin main
```

---

## ▲ Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel

# For production:
vercel --prod
```

### Option B — GitHub Integration (recommended)

1. Push your code to GitHub (see above)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add environment variables in Vercel Dashboard:
   - `DATA_PROVIDER` → `twelvedata` (or `demo`)
   - `TWELVEDATA_API_KEY` → your key
5. Click **Deploy**

### Environment Variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATA_PROVIDER` | `twelvedata` | Production, Preview |
| `TWELVEDATA_API_KEY` | `your_key` | Production, Preview |

> ⚠️ Never commit `.env.local` to git — it's in `.gitignore`

---

## 🗂 Project Structure

```
xauusd-ny-session/
├── app/
│   ├── api/
│   │   └── sessions/route.ts   # API endpoint — fetches XAUUSD data
│   ├── globals.css              # Global styles + CSS variables
│   ├── layout.tsx               # Root layout + metadata
│   └── page.tsx                 # Home page
├── components/
│   ├── Dashboard.tsx            # Main client dashboard
│   ├── SessionClock.tsx         # Live ET clock + session status
│   ├── StatsBar.tsx             # OHLC stats row
│   ├── DaySelector.tsx          # Multi-day session tabs
│   ├── PriceChart.tsx           # Area chart + EMA/BB/VWAP
│   ├── RSIChart.tsx             # RSI(14) area chart
│   ├── VolumeChart.tsx          # Color-coded volume bars
│   ├── HeatmapView.tsx          # Volatility heatmap + ATR
│   └── StatsTable.tsx           # Session stats table + summary cards
├── lib/
│   ├── dataProviders.ts         # TwelveData / AlphaVantage / Polygon / Demo
│   └── indicators.ts            # EMA, RSI, VWAP, BB, ATR
├── .env.example                 # Environment template
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 📊 Technical Indicators

| Indicator | Parameters | Description |
|-----------|-----------|-------------|
| EMA | 9, 21, 50 | Exponential Moving Averages |
| VWAP | Session | Volume-Weighted Avg Price |
| RSI | 14 | Relative Strength Index |
| Bollinger Bands | 20, 2σ | Volatility bands |
| ATR | 14 | Average True Range |

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript 5**
- **Recharts** — charting library
- **date-fns / date-fns-tz** — timezone handling

---

## ⚠️ Disclaimer

This tool is for **educational and informational purposes only**. It does not constitute financial advice. Past session performance does not guarantee future results. Always do your own research.

---

## 📄 License

MIT
