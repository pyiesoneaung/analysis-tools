'use client';
import { SessionData } from '@/lib/dataProviders';

export default function DaySelector({ sessions, selectedDay, onSelect }: {
  sessions: SessionData[];
  selectedDay: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto', paddingBottom: 4 }}>
      {sessions.map((s, i) => (
        <button key={i} onClick={() => onSelect(i)} style={{
          background: selectedDay === i ? 'var(--gold)' : 'var(--panel)',
          color: selectedDay === i ? 'var(--bg)' : 'var(--dim)',
          border: `1px solid ${selectedDay === i ? 'var(--gold)' : 'var(--border)'}`,
          borderRadius: 6, padding: '5px 12px',
          cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap',
          fontWeight: selectedDay === i ? 'bold' : 'normal',
          fontFamily: 'var(--font-mono)',
        }}>
          <span style={{ display: 'block', fontSize: 9, opacity: 0.7 }}>{s.dayName.slice(0, 3).toUpperCase()}</span>
          {s.date}
        </button>
      ))}
    </div>
  );
}
