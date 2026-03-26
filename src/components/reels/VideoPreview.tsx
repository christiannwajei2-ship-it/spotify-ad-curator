// ===================================================
// VideoPreview — CSS-animated phone mockup (9:16)
// ===================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VideoTemplate, TemplateSection, TextOverlay } from '../../services/reels/types';

// ===================================================
// Text animation variants
// ===================================================

const textVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  typewriter: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0 },
  },
};

const FONT_SIZE_MAP: Record<TextOverlay['fontSize'], string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

const POSITION_CLASSES: Record<TextOverlay['position'], string> = {
  'top-left': 'top-4 left-4 items-start text-left',
  'top-center': 'top-4 left-0 right-0 items-center text-center',
  'top-right': 'top-4 right-4 items-end text-right',
  'center-left': 'top-1/2 -translate-y-1/2 left-4 items-start text-left',
  center: 'top-1/2 -translate-y-1/2 left-0 right-0 items-center text-center',
  'center-right': 'top-1/2 -translate-y-1/2 right-4 items-end text-right',
  'bottom-left': 'bottom-4 left-4 items-start text-left',
  'bottom-center': 'bottom-4 left-0 right-0 items-center text-center',
  'bottom-right': 'bottom-4 right-4 items-end text-right',
};

// ===================================================
// OverlayText
// ===================================================

const OverlayText = ({ overlay }: { overlay: TextOverlay }) => {
  const variant = textVariants[overlay.animation] ?? textVariants.fade;
  return (
    <motion.div
      className={`absolute flex flex-col px-2 ${POSITION_CLASSES[overlay.position]}`}
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ duration: 0.4, delay: (overlay.animationDelay ?? 0) / 1000 }}
    >
      <span
        className={`${FONT_SIZE_MAP[overlay.fontSize]} leading-tight drop-shadow-lg`}
        style={{
          color: overlay.color,
          fontWeight: overlay.bold ? 700 : 400,
          fontStyle: overlay.italic ? 'italic' : 'normal',
        }}
      >
        {overlay.content}
      </span>
    </motion.div>
  );
};

// ===================================================
// VideoPreview
// ===================================================

interface VideoPreviewProps {
  template: VideoTemplate;
}

export const VideoPreview = ({ template }: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TICK = 100; // ms

  const currentSection: TemplateSection = template.sections[currentSectionIdx] ?? template.sections[0];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsedMs((prev) => {
          const next = prev + TICK;
          if (next >= template.totalDurationMs) {
            setIsPlaying(false);
            setCurrentSectionIdx(0);
            return 0;
          }
          // Update section index
          const newIdx = template.sections.findIndex(
            (s) => next >= s.startMs && next < s.startMs + s.durationMs
          );
          if (newIdx !== -1) setCurrentSectionIdx(newIdx);
          return next;
        });
      }, TICK);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, template]);

  const handlePlayPause = () => {
    if (!isPlaying && elapsedMs >= template.totalDurationMs) {
      setElapsedMs(0);
      setCurrentSectionIdx(0);
    }
    setIsPlaying((p) => !p);
  };

  const progressPct = (elapsedMs / template.totalDurationMs) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Phone mockup */}
      <div className="relative" style={{ width: 220 }}>
        {/* Phone frame */}
        <div
          className="relative rounded-[2.5rem] border-4 border-gray-700 overflow-hidden shadow-2xl shadow-black/60"
          style={{ width: 220, height: 390, background: '#000' }}
        >
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-800 rounded-full z-20" />

          {/* Video frame */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection.id}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: currentSection.backgroundColorHex }}
            >
              {/* Text overlays */}
              {currentSection.textOverlays.map((overlay) => (
                <OverlayText key={overlay.id} overlay={overlay} />
              ))}

              {/* Section label badge */}
              <div className="absolute top-6 right-3 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                {currentSection.label}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-20">
            <motion.div
              className="h-full bg-brand-400"
              style={{ width: `${progressPct}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayPause}
          className="w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center text-lg transition-colors duration-200 shadow-lg shadow-brand-900/40"
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <div className="text-sm text-gray-400">
          {(elapsedMs / 1000).toFixed(1)}s / {template.totalDurationMs / 1000}s
        </div>
        <button
          onClick={() => {
            setIsPlaying(false);
            setElapsedMs(0);
            setCurrentSectionIdx(0);
          }}
          className="w-8 h-8 rounded-full bg-surface-elevated hover:bg-surface-border text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors duration-200"
          title="Reset"
        >
          ↺
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center max-w-[220px]">
        CSS preview — not actual video rendering
      </p>
    </div>
  );
};
