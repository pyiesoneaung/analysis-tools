'use client';
import { SessionData } from '@/lib/dataProviders';

export function StatsTable({ sessions, selectedDay, onSelect }: {
  sessions: SessionData[];
  selectedDay: number;
  onSelect: (i: number) => void;
}) {
  const cols = ['Date', 'Day', 'Open', 'High', 'Low', 'Close', 'P&L', 'Range', 'Bias'];

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#0A0E18' }}>
              {cols.map(h => (
                <th key={h} style={{ padding: '10px 14px', color: 'var(--dim)', textAlign: 'left', fontWeight: 'normal', borderBottom: '1px solid var(--border)', letterSpacing: 1, fontSize: 10, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={i} onClick={() => onSelect(i)}
                style={{ cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selectedDay === i ? '#16202E' : 'transparent', transition: 'background 0.15s' }}>
                <td style={{ padding: '9px 14px', color: 'var(--text)', whiteSpace: 'nowrap' }}>{s.date}</td>
                <td style={{ padding: '9px 14px', color: 'var(--dim)', whiteSpace: 'nowrap' }}>{s.dayName.slice(0, 3)}</td>
                <td style={{ padding: '9px 14px' }}>{s.open.toFixed(2)}</td>
                <td style={{ padding: '9px 14px', color: 'var(--green)' }}>{s.high.toFixed(2)}</td>
                <td style={{ padding: '9px 14px', color: 'var(--red)' }}>{s.low.toFixed(2)}</td>
                <td style={{ padding: '9px 14px', color: s.bullish ? 'var(--green)' : 'var(--red)', fontWeight: 'bold' }}>{s.close.toFixed(2)}</td>
                <td style={{ padding: '9px 14px', color: s.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}
                </td>
                <td style={{ padding: '9px 14px', color: 'var(--gold)' }}>{s.range.toFixed(2)}</td>
                <td style={{ padding: '9px 14px' }}>
                  <span style={{
                    background: s.bullish ? '#0A2A1E' : '#2A0A0A',
                    color: s.bullish ? 'var(--green)' : 'var(--red)',
                    padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 'bold',
                  }}>
                    {s.bullish ? 'BULL' : 'BEAR'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SummaryCards({ sessions }: { sessions: SessionData[] }) {
  if (!sessions.length) return null;
  const bulls = sessions.filter(s => s.bullish).length;
  const avgRange = (sessions.reduce((a, s) => a + s.range, 0) / sessions.length).toFixed(2);
  const avgPnL = (sessions.reduce((a, s) => a + s.pnl, 0) / sessions.length).toFixed(2);
  const totalPnL = sessions.reduce((a, s) => a + s.pnl, 0).toFixed(2);
  const winRate = ((bulls / sessions.length) * 100).toFixed(0);
  const maxRange = Math.max(...sessions.map(s => s.range)).toFixed(2);

  const cards = [
    { label: 'Bullish Days', value: `${bulls}/${sessions.length}`, sub: `${winRate}% win rate`, color: 'var(--green)' },
    { label: 'Avg Daily Range', value: avgRange, sub: 'per session (pts)', color: 'var(--gold)' },
    { label: 'Avg Session P&L', value: `${parseFloat(avgPnL) >= 0 ? '+' : ''}${avgPnL}`, sub: 'mean close vs open', color: parseFloat(avgPnL) >= 0 ? 'var(--green)' : 'var(--red)' },
    { label: 'Cumulative P&L', value: `${parseFloat(totalPnL) >= 0 ? '+' : ''}${totalPnL}`, sub: 'all sessions combined', color: parseFloat(totalPnL) >= 0 ? 'var(--green)' : 'var(--red)' },
    { label: 'Max Session Range', value: maxRange, sub: 'highest volatility day', color: 'var(--purple)' },
    { label: 'Sessions Analyzed', value: `${sessions.length}`, sub: 'NY 07:00–12:00 ET', color: 'var(--text)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px' }}>
          <div style={{ fontSize: 10, color: 'var(--dim)', marginBottom: 8, letterSpacing: 1 }}>{c.label.toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: c.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{c.value}</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 6 }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsTable;
