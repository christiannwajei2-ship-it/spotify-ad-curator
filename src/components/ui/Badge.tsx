import { clsx } from 'clsx';

type BadgeVariant = 'purple' | 'green' | 'blue' | 'yellow' | 'red' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  purple: 'bg-brand-900/60 text-brand-300 border-brand-800',
  green: 'bg-green-900/40 text-green-300 border-green-800',
  blue: 'bg-blue-900/40 text-blue-300 border-blue-800',
  yellow: 'bg-yellow-900/40 text-yellow-300 border-yellow-800',
  red: 'bg-red-900/40 text-red-300 border-red-800',
  gray: 'bg-gray-800/60 text-gray-300 border-gray-700',
};

export const Badge = ({ children, variant = 'purple', className }: BadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      variantClasses[variant],
      className
    )}
  >
    {children}
  </span>
);
