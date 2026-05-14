'use client';
import { useState, useEffect } from 'react';

export default function SessionClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => {
      const etStr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      setTime(new Date(etStr));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  if (!time) return null;

  const h = time.getHours(), m = time.getMinutes();
  const inSession = h >= 7 && (h < 12 || (h === 12 && m === 0));
  const progress = Math.min(100, Math.max(0, ((h * 60 + m) - 7 * 60) / (5 * 60) * 100));
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: inSession ? 'var(--green)' : 'var(--red)',
          boxShadow: `0 0 8px ${inSession ? 'var(--green)' : 'var(--red)'}`,
          animation: inSession ? 'pulse-dot 1.5s infinite' : 'none',
          display: 'inline-block',
        }} />
        <span style={{ fontSize: 11, color: inSession ? 'var(--green)' : 'var(--red)', fontWeight: 'bold' }}>
          {inSession ? 'SESSION LIVE' : 'SESSION CLOSED'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--dim)' }}>ET {timeStr}</span>
      </div>
      {inSession && (
        <div style={{ width: 200 }}>
          <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 3, display: 'flex', justifyContent: 'space-between' }}>
            <span>07:00</span>
            <span>{progress.toFixed(0)}% elapsed</span>
            <span>12:00</span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 3, height: 4 }}>
            <div style={{
              background: 'linear-gradient(90deg, var(--gold), var(--green))',
              height: '100%', borderRadius: 3,
              width: `${progress}%`, transition: 'width 1s linear',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
