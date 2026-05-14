'use client';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCandle } from '@/lib/indicators';

export default function VolumeChart({ data }: { data: ChartCandle[] }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 8px' }}>
      <div style={{ fontSize: 11, color: 'var(--dim)', marginLeft: 8, marginBottom: 8, letterSpacing: 1 }}>VOLUME</div>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={data} margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" />
          <XAxis dataKey="time" tick={{ fill: 'var(--dim)', fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--dim)', fontSize: 9 }} tickLine={false} axisLine={false} width={45} />
          <Tooltip
            contentStyle={{ background: 'var(--panel2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: 'var(--gold)' }}
          />
          <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isGreen ? 'rgba(45, 212, 191, 0.7)' : 'rgba(248, 113, 113, 0.7)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
