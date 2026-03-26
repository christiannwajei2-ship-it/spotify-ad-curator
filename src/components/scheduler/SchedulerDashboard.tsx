// ===================================================
// SchedulerDashboard — Main scheduler management view
// ===================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ScheduleCard } from './ScheduleCard';
import { ScheduleBuilder } from './ScheduleBuilder';
import { ExecutionLog } from './ExecutionLog';
import { PerformanceRules } from './PerformanceRules';
import { UpgradeModal } from '../payments/UpgradeModal';
import { useScheduler } from '../../hooks/useScheduler';
import { useSubscription } from '../../hooks/useSubscription';
import type { CampaignSchedule } from '../../services/scheduler/types';
import type { NewScheduleForm } from '../../hooks/useScheduler';

// ===================================================
// Tabs
// ===================================================

type Tab = 'schedules' | 'history' | 'rules';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'schedules', label: 'Schedules', icon: '⏰' },
  { id: 'history', label: 'History', icon: '📋' },
  { id: 'rules', label: 'Rules', icon: '⚙️' },
];

// ===================================================
// Stats strip
// ===================================================

interface StatProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
}

const Stat = ({ label, value, sub, icon }: StatProps) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-brand-900/40 border border-brand-800/50 flex items-center justify-center text-lg">
      {icon}
    </div>
    <div>
      <p className="text-white font-bold text-xl leading-none">{value}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
      {sub && <p className="text-brand-400 text-xs">{sub}</p>}
    </div>
  </div>
);

// ===================================================
// Countdown to next run
// ===================================================

function formatCountdown(isoDate: string | null): string {
  if (!isoDate) return '—';
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return 'Running now';
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

// ===================================================
// Component
// ===================================================

export const SchedulerDashboard = () => {
  const {
    schedules,
    executionHistory,
    activeCount,
    pausedCount,
    nextSchedule,
    isRunning,
    createSchedule,
    updateSchedule,
    toggleSchedule,
    deleteSchedule,
    runNow,
  } = useScheduler();

  const { canAccess, upgradeModal, openUpgradeModal, closeUpgradeModal, checkout, isLoading: checkoutLoading } = useSubscription();

  const [activeTab, setActiveTab] = useState<Tab>('schedules');
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<CampaignSchedule | null>(null);

  // Feature gate: scheduler is Pro+
  const canUseScheduler = canAccess('scheduler' as Parameters<typeof canAccess>[0]);

  const handleRunNow = async (id: string) => {
    if (!canUseScheduler) {
      openUpgradeModal('scheduler' as Parameters<typeof openUpgradeModal>[0]);
      return;
    }
    await runNow(id);
  };

  const handleCreate = () => {
    if (!canUseScheduler) {
      openUpgradeModal('scheduler' as Parameters<typeof openUpgradeModal>[0]);
      return;
    }
    setEditingSchedule(null);
    setShowBuilder(true);
  };

  const handleEdit = (schedule: CampaignSchedule) => {
    setEditingSchedule(schedule);
    setShowBuilder(true);
  };

  const handleSave = (form: NewScheduleForm) => {
    if (editingSchedule) {
      updateSchedule(editingSchedule.id, form);
    } else {
      createSchedule(form);
    }
    setShowBuilder(false);
    setEditingSchedule(null);
  };

  const handlePauseAll = () => {
    schedules
      .filter((s) => s.status === 'active')
      .forEach((s) => toggleSchedule(s.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">⏰ Auto-Refresh Scheduler</h1>
          <p className="text-gray-400 text-sm mt-1">
            Automate your ad campaign optimizations on a schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handlePauseAll} className="text-xs">
              ⏸ Pause All
            </Button>
          )}
          <Button variant="primary" onClick={handleCreate} className="flex items-center gap-2">
            ➕ New Schedule
          </Button>
        </div>
      </div>

      {/* Stats strip */}
      <Card elevated>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Stat icon="⚡" label="Active Schedules" value={activeCount} />
          <Stat icon="⏸️" label="Paused" value={pausedCount} />
          <Stat
            icon="⏳"
            label="Next Run"
            value={nextSchedule ? formatCountdown(nextSchedule.nextRunAt) : '—'}
            sub={nextSchedule?.name}
          />
          <Stat icon="📊" label="Total Runs" value={executionHistory.length} />
        </div>
      </Card>

      {/* Demo mode banner */}
      <div className="p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-xl flex items-center gap-3">
        <span className="text-lg">🎭</span>
        <p className="text-xs text-yellow-300">
          <span className="font-semibold">Demo mode:</span> Schedules are stored in your browser (localStorage). Executions are simulated — no real ads are modified.
        </p>
      </div>

      {/* Builder */}
      <AnimatePresence>
        {showBuilder && (
          <ScheduleBuilder
            initial={editingSchedule}
            onSave={handleSave}
            onCancel={() => { setShowBuilder(false); setEditingSchedule(null); }}
          />
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-surface-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px',
              activeTab === tab.id
                ? 'border-brand-500 text-brand-300'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
            )}
          >
            {tab.icon} {tab.label}
            {tab.id === 'schedules' && schedules.length > 0 && (
              <Badge variant="gray" className="text-xs ml-1">{schedules.length}</Badge>
            )}
            {tab.id === 'history' && executionHistory.length > 0 && (
              <Badge variant="gray" className="text-xs ml-1">{executionHistory.length}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'schedules' && (
          <motion.div
            key="schedules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {schedules.length === 0 ? (
              <Card elevated>
                <div className="py-12 text-center">
                  <div className="text-5xl mb-4">⏰</div>
                  <h3 className="text-white font-semibold mb-2">No schedules yet</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Create your first auto-refresh schedule to automate campaign optimizations
                  </p>
                  <Button variant="primary" onClick={handleCreate}>
                    ➕ Create First Schedule
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="relative">
                    <ScheduleCard
                      schedule={schedule}
                      isRunning={isRunning === schedule.id}
                      onToggle={toggleSchedule}
                      onRunNow={handleRunNow}
                      onEdit={handleEdit}
                      onDelete={deleteSchedule}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ExecutionLog logs={executionHistory} />
          </motion.div>
        )}

        {activeTab === 'rules' && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <PerformanceRules />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade modal */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        feature={upgradeModal.feature}
        isLoading={checkoutLoading}
        onUpgrade={(planId, period) => checkout(planId, period)}
        onClose={closeUpgradeModal}
      />
    </div>
  );
};
