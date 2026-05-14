'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ChartCandle } from '@/lib/indicators';

export function RSIChart({ data }: { data: ChartCandle[] }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 8px' }}>
      <div style={{ fontSize: 11, color: 'var(--dim)', marginLeft: 8, marginBottom: 8, letterSpacing: 1 }}>
        RSI (14) &nbsp;
        <span style={{ color: 'var(--red)', fontSize: 10 }}>OB:70</span> &nbsp;
        <span style={{ color: 'var(--green)', fontSize: 10 }}>OS:30</span>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={data} margin={{ left: 10, right: 10 }}>
          <defs>
            <linearGradient id="rsiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--purple)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--purple)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" />
          <XAxis dataKey="time" tick={{ fill: 'var(--dim)', fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: 'var(--dim)', fontSize: 9 }} tickLine={false} axisLine={false} width={30} />
          <Tooltip
            contentStyle={{ background: 'var(--panel2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: 'var(--gold)' }}
          />
          <ReferenceLine y={70} stroke="var(--red)" strokeDasharray="3 3" strokeWidth={1} />
          <ReferenceLine y={30} stroke="var(--green)" strokeDasharray="3 3" strokeWidth={1} />
          <ReferenceLine y={50} stroke="var(--dim)" strokeDasharray="2 6" strokeWidth={1} />
          <Area type="monotone" dataKey="rsi" stroke="var(--purple)" fill="url(#rsiGrad)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RSIChart;
