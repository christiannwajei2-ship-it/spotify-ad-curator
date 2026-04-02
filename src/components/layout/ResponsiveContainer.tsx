import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  /** Whether to add default vertical padding */
  padded?: boolean;
  /** Max-width variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export const ResponsiveContainer = ({
  children,
  className,
  padded = true,
  size = 'xl',
}: ResponsiveContainerProps) => (
  <div
    className={clsx(
      'mx-auto w-full',
      'px-4 sm:px-6 lg:px-8',
      padded && 'py-4 sm:py-6 lg:py-8',
      sizeClasses[size],
      className
    )}
  >
    {children}
  </div>
);
