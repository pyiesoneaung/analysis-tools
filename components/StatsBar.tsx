'use client';
import { SessionData } from '@/lib/dataProviders';

export default function StatsBar({ session }: { session: SessionData }) {
  const stats = [
    { label: 'OPEN', value: session.open.toFixed(2), color: 'var(--text)' },
    { label: 'HIGH', value: session.high.toFixed(2), color: 'var(--green)' },
    { label: 'LOW', value: session.low.toFixed(2), color: 'var(--red)' },
    { label: 'CLOSE', value: session.close.toFixed(2), color: session.bullish ? 'var(--green)' : 'var(--red)' },
    { label: 'RANGE', value: session.range.toFixed(2), color: 'var(--gold)' },
    { label: 'P&L', value: `${session.pnl >= 0 ? '+' : ''}${session.pnl.toFixed(2)}`, color: session.pnl >= 0 ? 'var(--green)' : 'var(--red)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: 'var(--panel)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '10px 14px',
        }}>
          <div style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: 1, marginBottom: 5 }}>{s.label}</div>
          <div style={{ fontSize: 17, fontWeight: 'bold', color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}
