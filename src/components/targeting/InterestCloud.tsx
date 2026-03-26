import type { InterestTarget } from '../../types';

interface InterestCloudProps {
  interests: InterestTarget[];
}

const categoryColors: Record<string, string> = {
  Music: 'bg-brand-900/60 text-brand-300 border-brand-800',
  Artists: 'bg-purple-900/60 text-purple-300 border-purple-800',
  Apps: 'bg-blue-900/60 text-blue-300 border-blue-800',
  Technology: 'bg-cyan-900/60 text-cyan-300 border-cyan-800',
  Events: 'bg-pink-900/60 text-pink-300 border-pink-800',
  Lifestyle: 'bg-orange-900/60 text-orange-300 border-orange-800',
  Culture: 'bg-green-900/60 text-green-300 border-green-800',
  default: 'bg-gray-800/60 text-gray-300 border-gray-700',
};

export const InterestCloud = ({ interests }: InterestCloudProps) => (
  <div className="flex flex-wrap gap-2">
    {interests.map((interest) => {
      const colorClass = categoryColors[interest.category] ?? categoryColors.default;
      return (
        <span
          key={interest.id}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border cursor-default ${colorClass}`}
          title={`Category: ${interest.category}`}
        >
          {interest.name}
        </span>
      );
    })}
  </div>
);
