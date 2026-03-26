import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  elevated?: boolean;
  hoverable?: boolean;
  noPadding?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ elevated, hoverable, noPadding, children, className, onClick }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={hoverable ? { y: -2, transition: { duration: 0.2 } } : undefined}
    onClick={onClick}
    className={clsx(
      'rounded-2xl border',
      elevated ? 'bg-surface-elevated border-surface-border' : 'bg-surface-card border-surface-border',
      hoverable && 'cursor-pointer hover:border-brand-700 transition-colors duration-200',
      !noPadding && 'p-6',
      className
    )}
  >
    {children}
  </motion.div>
);

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ title, subtitle, icon, action, className }: CardHeaderProps) => (
  <div className={clsx('flex items-start justify-between mb-5', className)}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 bg-brand-900/40 rounded-xl flex items-center justify-center text-brand-400">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-white text-base">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
