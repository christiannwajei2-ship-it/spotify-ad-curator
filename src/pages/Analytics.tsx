// ===================================================
// Analytics Page
// ===================================================

import { motion } from 'framer-motion';
import { AnalyticsDashboard } from '../components/analytics';

export const Analytics = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
  >
    <AnalyticsDashboard />
  </motion.div>
);
