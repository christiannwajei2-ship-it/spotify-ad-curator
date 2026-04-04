import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { GenreCount } from '../../types';
import { capitalize } from '../../utils/formatters';
import { COLOR_PALETTE } from '../../utils/constants';

interface GenreChartProps {
  genres: GenreCount[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: GenreCount }[] }) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-elevated border border-surface-border rounded-xl p-3 shadow-xl">
        <p className="text-white font-medium">{capitalize(data.genre)}</p>
        <p className="text-brand-300 text-sm">{data.count} tracks ({(data.percentage * 100).toFixed(1)}%)</p>
      </div>
    );
  }
  return null;
};

export const GenreChart = ({ genres }: GenreChartProps) => {
  const data = genres.map((g) => ({
    ...g,
    name: capitalize(g.genre),
    value: g.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-gray-300 text-xs">{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
