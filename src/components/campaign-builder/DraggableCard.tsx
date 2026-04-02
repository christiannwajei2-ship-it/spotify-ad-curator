import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { PlatformCard } from './types';

interface DraggableCardProps {
  card: PlatformCard;
  onDragStart: (card: PlatformCard) => void;
}

export const DraggableCard = ({ card, onDragStart }: DraggableCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNativeDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
    onDragStart(card);
  };

  const handleNativeDragEnd = () => setIsDragging(false);

  // Touch long press support
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      onDragStart(card);
    }, 400);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <div
      draggable
      onDragStart={handleNativeDragStart}
      onDragEnd={handleNativeDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group"
    >
      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        animate={{
          scale: isDragging ? 1.08 : 1,
          opacity: isDragging ? 0.7 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`
          flex items-center gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing
          select-none transition-colors duration-200
          ${isDragging ? 'border-brand-500 bg-brand-900/30' : 'border-surface-border bg-surface-elevated hover:border-brand-700 hover:bg-surface-card'}
        `}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${card.color}`}>
          {card.icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{card.label}</p>
          <p className="text-xs text-gray-500 truncate">{card.description}</p>
        </div>
        <div className="ml-auto text-gray-600 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
