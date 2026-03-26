// ===================================================
// ExportButton — Export report buttons
// ===================================================

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ExportButtonProps {
  onExportJSON: () => void;
  onExportCSV: () => void;
  onExportText: () => void;
  className?: string;
}

interface BtnProps {
  label: string;
  icon: string;
  onClick: () => void;
  colorClass: string;
}

const Btn = ({ label, icon, onClick, colorClass }: BtnProps) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={clsx(
      'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors duration-200',
      colorClass
    )}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </motion.button>
);

export const ExportButton = ({
  onExportJSON,
  onExportCSV,
  onExportText,
  className,
}: ExportButtonProps) => (
  <div className={clsx('flex items-center gap-2 flex-wrap', className)}>
    <Btn
      label="JSON"
      icon="📄"
      onClick={onExportJSON}
      colorClass="bg-surface-elevated border-surface-border text-gray-300 hover:text-white hover:border-brand-700"
    />
    <Btn
      label="CSV"
      icon="📊"
      onClick={onExportCSV}
      colorClass="bg-surface-elevated border-surface-border text-gray-300 hover:text-white hover:border-brand-700"
    />
    <Btn
      label="Text"
      icon="📋"
      onClick={onExportText}
      colorClass="bg-surface-elevated border-surface-border text-gray-300 hover:text-white hover:border-brand-700"
    />
  </div>
);
