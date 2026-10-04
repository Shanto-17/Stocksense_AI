import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { PricePoint } from '@/types';

export function Sparkline({ data, color = '#10b981', height = 40 }: { data: PricePoint[]; color?: string; height?: number }) {
  const chartData = data.slice(-30).map((d) => ({ price: d.price }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
