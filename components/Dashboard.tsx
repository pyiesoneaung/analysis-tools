'use client';

import { useState, useEffect, useCallback } from 'react';
import { SessionData } from '@/lib/dataProviders';
import { enrichCandles } from '@/lib/indicators';
import SessionClock from './SessionClock';
import StatsBar from './StatsBar';
import DaySelector from './DaySelector';
import PriceChart from './PriceChart';
import RSIChart from './RSIChart';
import VolumeChart from './VolumeChart';
import HeatmapView from './HeatmapView';
import StatsTable from './StatsTable';
import SummaryCards from './SummaryCards';

type Tab = 'chart' | 'stats' | 'heatmap';

export default function Dashboard() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState('demo');
  const [tab, setTab] = useState<Tab>('chart');
  const [showEMA, setShowEMA] = useState(true);
  const [showBB, setShowBB] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [refreshTs, setRefreshTs] = useState(Date.now());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/sessions?t=${refreshTs}`);
      const json = await res.json();
      setSessions(json.sessions || []);
      setSource(json.source || 'demo');
      if (json.error) setError(`Data: ${json.error} — showing demo data`);
      else setError(null);
      setSelectedDay(Math.max(0, (json.sessions?.length || 1) - 1));
    } catch (e) {
      setError('Failed to fetch session data');
    } finally {
      setLoading(false);
    }
  }, [refreshTs]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const t = setInterval(() => setRefreshTs(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const session = sessions[selectedDay];
  const chartData = session ? enrichCandles(session.candles) : [];

  const sourceLabel: Record<string, string> = {
    demo: '⚠ DEMO DATA',
    twelvedata: '● TWELVE DATA',
    alphavantage: '● ALPHA VANTAGE',
    polygon: '● POLYGON.IO',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '16px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--gold)', letterSpacing: 1 }}>
              XAU/USD
            </span>
            <span style={{
              fontSize: 11, color: 'var(--dim)', background: 'var(--panel)',
              padding: '3px 10px', borderRadius: 4, border: '1px solid var(--border)', letterSpacing: 2
            }}>NY SESSION</span>
            <span style={{
              fontSize: 10, color: source === 'demo' ? 'var(--gold-dim)' : 'var(--green)',
              background: 'var(--panel)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)'
            }}>
              {sourceLabel[source] || source.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 4 }}>
            07:00 – 12:00 ET &nbsp;|&nbsp; 15-Minute Analysis &nbsp;|&nbsp; Gold Spot Price
          </div>
          {error && (
            <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 4, padding: '3px 8px', background: '#1a1500', borderRadius: 4, border: '1px solid #3d3000' }}>
              ⚠ {error}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <SessionClock />
          {session && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: session.bullish ? 'var(--green)' : 'var(--red)', lineHeight: 1 }}>
                {session.close.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: session.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {session.pnl >= 0 ? '▲' : '▼'} {Math.abs(session.pnl).toFixed(2)}
                &nbsp;({((session.pnl / session.open) * 100).toFixed(2)}%)
              </div>
            </div>
          )}
          <button
            onClick={() => setRefreshTs(Date.now())}
            style={{
              background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--dim)',
              borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 11,
            }}
          >
            ↺ Refresh
          </button>
        </div>
      </header>

      {loading ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {[200, 300, 100].map((h, i) => (
            <div key={i} className="skeleton" style={{ height: h }} />
          ))}
        </div>
      ) : session ? (
        <>
          <StatsBar session={session} />

          {/* Tab Bar */}
          <div style={{ display: 'flex', gap: 6, margin: '14px 0 10px', flexWrap: 'wrap' }}>
            {(['chart', 'stats', 'heatmap'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: tab === t ? 'var(--gold)' : 'var(--panel)',
                color: tab === t ? 'var(--bg)' : 'var(--dim)',
                border: `1px solid ${tab === t ? 'var(--gold)' : 'var(--border)'}`,
                borderRadius: 6, padding: '6px 18px', cursor: 'pointer',
                fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1,
                fontFamily: 'var(--font-mono)',
              }}>{t}</button>
            ))}
            {tab === 'chart' && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {[
                  { label: 'EMA', state: showEMA, set: setShowEMA },
                  { label: 'BB', state: showBB, set: setShowBB },
                  { label: 'RSI', state: showRSI, set: setShowRSI },
                ].map(b => (
                  <button key={b.label} onClick={() => b.set(!b.state)} style={{
                    background: b.state ? 'var(--panel2)' : 'var(--panel)',
                    color: b.state ? 'var(--gold)' : 'var(--dim)',
                    border: `1px solid ${b.state ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                  }}>{b.label}</button>
                ))}
              </div>
            )}
          </div>

          <DaySelector sessions={sessions} selectedDay={selectedDay} onSelect={setSelectedDay} />

          {tab === 'chart' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <PriceChart data={chartData} session={session} showEMA={showEMA} showBB={showBB} />
              {showRSI && <RSIChart data={chartData} />}
              <VolumeChart data={chartData} />
            </div>
          )}

          {tab === 'stats' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <StatsTable sessions={sessions} selectedDay={selectedDay} onSelect={(i) => { setSelectedDay(i); setTab('chart'); }} />
              <SummaryCards sessions={sessions} />
            </div>
          )}

          {tab === 'heatmap' && (
            <div className="fade-in">
              <HeatmapView session={session} data={chartData} />
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--dim)', padding: 60 }}>No session data available.</div>
      )}

      <footer style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--dim)', textAlign: 'center' }}>
        XAU/USD NY SESSION ANALYZER &nbsp;|&nbsp; 07:00–12:00 ET &nbsp;|&nbsp;
        {source === 'demo' ? 'Demo data — connect a real API in .env' : `Live data via ${source}`} &nbsp;|&nbsp;
        Not financial advice
      </footer>
    </div>
  );
}
