'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCandle } from '@/lib/indicators';
import { SessionData } from '@/lib/dataProviders';

export default function HeatmapView({ session, data }: { session: SessionData; data: ChartCandle[] }) {
  const maxBody = Math.max(...session.candles.map(c => Math.abs(c.close - c.open)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--dim)', marginBottom: 14, letterSpacing: 1 }}>
          INTRADAY VOLATILITY HEATMAP — Body Size per 15-Min Bar
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
          gap: 5,
        }}>
          {session.candles.map((c, i) => {
            const bodySize = Math.abs(c.close - c.open);
            const intensity = maxBody > 0 ? bodySize / maxBody : 0;
            const bg = c.close >= c.open
              ? `rgba(45, 212, 191, ${0.08 + intensity * 0.85})`
              : `rgba(248, 113, 113, ${0.08 + intensity * 0.85})`;
            const borderC = c.close >= c.open
              ? `rgba(45, 212, 191, ${0.3 + intensity * 0.5})`
              : `rgba(248, 113, 113, ${0.3 + intensity * 0.5})`;
            return (
              <div key={i} title={`${c.time}\nO:${c.open} H:${c.high} L:${c.low} C:${c.close}\nMove: ${(c.close - c.open).toFixed(2)}`}
                style={{ background: bg, borderRadius: 6, padding: '8px 4px', textAlign: 'center', border: `1px solid ${borderC}` }}>
                <div style={{ fontSize: 9, color: 'var(--text)', letterSpacing: 0.5 }}>{c.time}</div>
                <div style={{ fontSize: 13, marginTop: 2, color: c.close >= c.open ? 'var(--green)' : 'var(--red)' }}>
                  {c.close >= c.open ? '▲' : '▼'}
                </div>
                <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 2 }}>
                  {(c.close - c.open).toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 10, color: 'var(--dim)' }}>
          <span>🟢 Bullish candles — intensity = body size</span>
          <span>🔴 Bearish candles</span>
        </div>
      </div>

      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 8px' }}>
        <div style={{ fontSize: 11, color: 'var(--dim)', marginLeft: 8, marginBottom: 8, letterSpacing: 1 }}>
          ATR(14) — VOLATILITY PER BAR
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={data} margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fill: 'var(--dim)', fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'var(--dim)', fontSize: 9 }} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              contentStyle={{ background: 'var(--panel2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: 'var(--gold)' }}
            />
            <Bar dataKey="atr" fill="var(--gold)" opacity={0.75} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
