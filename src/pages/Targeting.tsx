import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { useAdGenerator } from '../hooks/useAdGenerator';
import { Button, Card, CardHeader, Badge } from '../components/ui';
import { CountryCard } from '../components/targeting/CountryCard';
import { InterestCloud } from '../components/targeting/InterestCloud';
import { BudgetCalculator } from '../components/targeting/BudgetCalculator';
import { formatPercentage } from '../utils/formatters';

export const Targeting = () => {
  const { targeting, setStep } = useAppStore();
  const { generate, isLoading } = useAdGenerator();

  if (!targeting) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-gray-400">No targeting data yet. Complete the analysis first.</p>
          <Button className="mt-4" onClick={() => setStep('landing')}>← Start Over</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Targeting Recommendations 🎯</h1>
            <p className="text-gray-400 text-sm mt-1">
              Optimized for <span className="text-brand-300">{targeting.primaryGenre}</span> listeners
              {' '}· Confidence: <span className="text-green-400">{formatPercentage(targeting.confidence)}</span>
            </p>
          </div>
          <Button
            onClick={() => generate()}
            isLoading={isLoading}
            rightIcon={<span>→</span>}
          >
            Generate Ad Campaign 📢
          </Button>
        </motion.div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Countries */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Best Countries to Target"
              subtitle={`${targeting.countries.length} markets ranked by conversion potential`}
              icon={<span>🌍</span>}
            />
            <div className="space-y-2.5">
              {targeting.countries.map((country, i) => (
                <CountryCard
                  key={country.code}
                  country={country}
                  rank={i + 1}
                  isTop={i < 2}
                />
              ))}
            </div>
          </Card>

          {/* Demographics */}
          <div className="space-y-5">
            <Card>
              <CardHeader
                title="Demographics"
                subtitle="Recommended audience"
                icon={<span>👥</span>}
              />
              <div className="space-y-3">
                <Demographic label="Age Range" value={targeting.demographics.primaryAgeRange} />
                <Demographic label="Gender" value="All genders" />
                <Demographic label="Platform" value="Facebook + Instagram" />
              </div>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">{targeting.demographics.reasoning}</p>
            </Card>

            <Card>
              <CardHeader title="Budget Calculator" icon={<span>💰</span>} />
              <BudgetCalculator budgetRec={targeting.budgetRecommendation} />
            </Card>
          </div>
        </div>

        {/* Interests */}
        <Card>
          <CardHeader
            title="Interest Targeting Keywords"
            subtitle="Pre-mapped for Meta Ads Manager"
            icon={<span>🏷️</span>}
            action={
              <Badge variant="green">{targeting.interests.length} interests</Badge>
            }
          />
          <InterestCloud interests={targeting.interests} />
        </Card>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={() => generate()}
            isLoading={isLoading}
          >
            Generate Full Ad Campaign 📢
          </Button>
        </div>
      </div>
    </div>
  );
};

const Demographic = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);
