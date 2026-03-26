import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import type { MoodProfile } from '../../types';

interface MoodRadarProps {
  mood: MoodProfile;
}

export const MoodRadar = ({ mood }: MoodRadarProps) => {
  const data = [
    { subject: 'Energy', value: Math.round(mood.energy * 100) },
    { subject: 'Dance', value: Math.round(mood.danceability * 100) },
    { subject: 'Positivity', value: Math.round(mood.valence * 100) },
    { subject: 'Acoustic', value: Math.round(mood.acousticness * 100) },
    { subject: 'Instrumental', value: Math.round(mood.instrumentalness * 100) },
  ];

  return (
    <div>
      <div className="text-center mb-3">
        <span className="text-lg font-semibold text-white">{mood.label}</span>
        <p className="text-gray-400 text-sm mt-1">{mood.description}</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke="#2a2a38" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <Radar
            dataKey="value"
            stroke="#a855f7"
            fill="#a855f7"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-400">
        Tempo: <span className="text-white font-medium">{Math.round(mood.tempo)} BPM</span>
      </div>
    </div>
  );
};
