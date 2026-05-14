// app/api/sessions/route.ts
import { NextResponse } from 'next/server';
import {
  generateDemoSessions,
  fetchTwelveData,
  fetchAlphaVantage,
  fetchPolygon,
  SessionData,
} from '@/lib/dataProviders';

// Simple in-memory cache
let cache: { data: SessionData[]; ts: number } | null = null;

export async function GET() {
  const provider = process.env.DATA_PROVIDER || 'demo';
  const cacheTTL = parseInt(process.env.CACHE_TTL_HIST || '300') * 1000;

  // Return cached data if fresh
  if (cache && Date.now() - cache.ts < cacheTTL) {
    return NextResponse.json({ sessions: cache.data, source: cache.data[0]?.source || provider, cached: true });
  }

  try {
    let sessions: SessionData[];

    switch (provider) {
      case 'twelvedata': {
        const key = process.env.TWELVEDATA_API_KEY;
        if (!key) throw new Error('TWELVEDATA_API_KEY not set');
        sessions = await fetchTwelveData(key);
        break;
      }
      case 'alphavantage': {
        const key = process.env.ALPHA_VANTAGE_API_KEY;
        if (!key) throw new Error('ALPHA_VANTAGE_API_KEY not set');
        sessions = await fetchAlphaVantage(key);
        break;
      }
      case 'polygon': {
        const key = process.env.POLYGON_API_KEY;
        if (!key) throw new Error('POLYGON_API_KEY not set');
        sessions = await fetchPolygon(key);
        break;
      }
      default:
        sessions = generateDemoSessions(8);
    }

    cache = { data: sessions, ts: Date.now() };
    return NextResponse.json({ sessions, source: sessions[0]?.source || provider, cached: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[sessions/route] Error:', msg);

    // Fallback to demo data on error
    const sessions = generateDemoSessions(8);
    return NextResponse.json({ sessions, source: 'demo', cached: false, error: msg }, { status: 200 });
  }
}
