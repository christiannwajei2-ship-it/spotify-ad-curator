import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PopularityChartProps {
  distribution: { range: string; count: number }[];
  average: number;
}

export const PopularityChart = ({ distribution, average }: PopularityChartProps) => {
  const maxCount = Math.max(...distribution.map((d) => d.count));

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-white">{average}</span>
        <span className="text-gray-400 text-sm">/ 100 average popularity</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={distribution} barSize={32}>
          <XAxis dataKey="range" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            content={({ active, payload }) => active && payload?.length ? (
              <div className="bg-surface-elevated border border-surface-border rounded-xl p-2.5 shadow-xl">
                <p className="text-gray-300 text-xs">Score: {payload[0].payload.range}</p>
                <p className="text-white font-medium text-sm">{payload[0].value} tracks</p>
              </div>
            ) : null}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {distribution.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.count === maxCount ? '#a855f7' : '#3b0764'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
