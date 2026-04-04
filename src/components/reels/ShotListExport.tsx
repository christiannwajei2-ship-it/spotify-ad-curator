// ===================================================
// ShotListExport — shot list table + export buttons
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import type { VideoTemplate } from '../../services/reels/types';
import type { ShotItem } from '../../services/reels/generator';
import { generateShotList } from '../../services/reels/generator';
import {
  exportAsJSON,
  exportAsShotList,
  exportAsCSV,
  generateCapCutProject,
  generateFFmpegScript,
} from '../../services/reels/export';
import { Button } from '../ui';

interface ShotListExportProps {
  template: VideoTemplate;
}

type ExportFormat = 'json' | 'shot-list' | 'csv' | 'capcut' | 'ffmpeg';

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const ShotListExport = ({ template }: ShotListExportProps) => {
  const shots: ShotItem[] = generateShotList(template);
  const [copied, setCopied] = useState(false);

  const handleExport = (format: ExportFormat) => {
    const slug = template.id;
    switch (format) {
      case 'json':
        download(exportAsJSON(template), `${slug}.json`);
        break;
      case 'shot-list':
        download(exportAsShotList(template), `${slug}-shot-list.md`);
        break;
      case 'csv':
        download(exportAsCSV(template), `${slug}.csv`);
        break;
      case 'capcut':
        download(generateCapCutProject(template), `${slug}-capcut.json`);
        break;
      case 'ffmpeg':
        download(generateFFmpegScript(template), `${slug}-ffmpeg.sh`);
        break;
    }
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportAsShotList(template));
    setCopied(true);
    toast.success('Shot list copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => handleExport('shot-list')}>
          📄 Shot List (.md)
        </Button>
        <Button size="sm" variant="secondary" onClick={() => handleExport('json')}>
          📦 JSON
        </Button>
        <Button size="sm" variant="secondary" onClick={() => handleExport('csv')}>
          📊 CSV
        </Button>
        <Button size="sm" variant="secondary" onClick={() => handleExport('capcut')}>
          🎬 CapCut
        </Button>
        <Button size="sm" variant="secondary" onClick={() => handleExport('ffmpeg')}>
          ⚙️ FFmpeg
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCopy}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </Button>
      </div>

      {/* Shot list table */}
      <div className="overflow-x-auto rounded-xl border border-surface-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-surface-border">
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium w-10">#</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">Section</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">Time</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">Text Overlays</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">Animation</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {shots.map((shot, idx) => (
              <motion.tr
                key={shot.shotNumber}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="border-b border-surface-border last:border-b-0 hover:bg-surface-elevated/50 transition-colors duration-100"
              >
                <td className="px-4 py-3 text-gray-500">{shot.shotNumber}</td>
                <td className="px-4 py-3 text-white font-medium">{shot.sectionLabel}</td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                  {shot.startTime} → {shot.endTime}
                  <span className="ml-1 text-gray-600">({shot.durationSec}s)</span>
                </td>
                <td className="px-4 py-3 text-gray-300 max-w-xs">
                  {shot.textOverlays.length === 0 ? (
                    <span className="text-gray-600 italic">none</span>
                  ) : (
                    <ul className="space-y-0.5">
                      {shot.textOverlays.map((t, i) => (
                        <li key={i} className="text-xs truncate">{t}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{shot.animationStyle}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">
                  {shot.notes || <span className="text-gray-700">—</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
