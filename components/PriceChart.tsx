'use client';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { ChartCandle } from '@/lib/indicators';
import { SessionData } from '@/lib/dataProviders';

interface Props {
  data: ChartCandle[];
  session: SessionData;
  showEMA: boolean;
  showBB: boolean;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { payload: ChartCandle }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: '#0E1420', border: '1px solid var(--border2)', borderRadius: 8,
      padding: '10px 14px', fontSize: 11, fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ color: 'var(--gold)', marginBottom: 6, fontWeight: 'bold' }}>{label}</div>
      <div>O: <b style={{ color: 'var(--gold)' }}>{d?.open}</b> H: <b style={{ color: 'var(--green)' }}>{d?.high}</b> L: <b style={{ color: 'var(--red)' }}>{d?.low}</b> C: <b style={{ color: d?.isGreen ? 'var(--green)' : 'var(--red)' }}>{d?.close}</b></div>
      {d?.ema9 && <div style={{ color: 'var(--dim2)', marginTop: 4 }}>EMA9: <b style={{ color: 'var(--purple)' }}>{d.ema9}</b> EMA21: <b style={{ color: 'var(--orange)' }}>{d.ema21}</b></div>}
      {d?.vwap && <div style={{ color: 'var(--dim2)' }}>VWAP: <b style={{ color: 'var(--gold)' }}>{d.vwap}</b></div>}
      {d?.atr && <div style={{ color: 'var(--dim2)' }}>ATR(14): <b style={{ color: 'var(--text)' }}>{d.atr}</b></div>}
    </div>
  );
}

export default function PriceChart({ data, session, showEMA, showBB }: Props) {
  const prices = data.map(d => d.close);
  const minP = Math.min(...prices) - 2;
  const maxP = Math.max(...prices) + 2;

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--dim)', letterSpacing: 1 }}>PRICE ACTION — 15M CANDLES</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--dim)' }}>
          {showEMA && <>
            <span style={{ color: 'var(--purple)' }}>● EMA 9</span>
            <span style={{ color: 'var(--orange)' }}>● EMA 21</span>
            <span style={{ color: 'var(--gold)' }}>- - VWAP</span>
          </>}
          {showBB && <span style={{ color: '#7C3AED' }}>⌇ BB(20,2)</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ left: 10, right: 10 }}>
          <defs>
            <linearGradient id="priceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" />
          <XAxis dataKey="time" tick={{ fill: 'var(--dim)', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis domain={[minP, maxP]} tick={{ fill: 'var(--dim)', fontSize: 10 }} tickLine={false} axisLine={false} width={65} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={session.open} stroke="var(--dim)" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="close" stroke="var(--gold)" fill="url(#priceArea)" strokeWidth={2} dot={false} />
          {showEMA && <>
            <Line type="monotone" dataKey="ema9" stroke="var(--purple)" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="ema21" stroke="var(--orange)" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="vwap" stroke="var(--gold)" strokeWidth={1} strokeDasharray="5 3" dot={false} />
          </>}
          {showBB && <>
            <Line type="monotone" dataKey="bbUpper" stroke="#7C3AED" strokeWidth={1} strokeDasharray="3 3" dot={false} />
            <Line type="monotone" dataKey="bbMiddle" stroke="#7C3AED" strokeWidth={1} dot={false} opacity={0.5} />
            <Line type="monotone" dataKey="bbLower" stroke="#7C3AED" strokeWidth={1} strokeDasharray="3 3" dot={false} />
          </>}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
