// ===================================================
// SlackSetupWizard — 4-step Slack connection flow
// ===================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  connected: boolean;
  webhookUrl: string;
  onConnect: (url: string) => Promise<{ success: boolean; error?: string }>;
  onDisconnect: () => void;
  onTest: () => Promise<{ success: boolean; error?: string }>;
}

const STEPS = [
  { id: 1, label: 'Create Webhook' },
  { id: 2, label: 'Paste URL' },
  { id: 3, label: 'Test Connection' },
  { id: 4, label: 'Configure' },
];

export const SlackSetupWizard = ({ connected, webhookUrl, onConnect, onDisconnect, onTest }: Props) => {
  const [step, setStep] = useState(connected ? 4 : 1);
  const [inputUrl, setInputUrl] = useState(webhookUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleConnect = async () => {
    if (!inputUrl.trim()) {
      setError('Please enter a webhook URL');
      return;
    }
    setLoading(true);
    setError('');
    const result = await onConnect(inputUrl.trim());
    setLoading(false);
    if (result.success) {
      setStep(3);
    } else {
      setError(result.error ?? 'Failed to connect');
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setTestResult(null);
    const result = await onTest();
    setLoading(false);
    setTestResult({
      success: result.success,
      message: result.success
        ? 'Test message sent! Check your Slack channel.'
        : result.error ?? 'Test failed',
    });
    if (result.success) setTimeout(() => setStep(4), 1500);
  };

  if (connected && step === 4) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-800 rounded-xl">
          <span className="text-2xl">✅</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-300">Slack Connected</p>
            <p className="text-xs text-green-400/70 mt-0.5 break-all">{webhookUrl.slice(0, 60)}…</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onTest}
              className="px-3 py-1.5 text-xs bg-surface-elevated border border-surface-border rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              Test
            </button>
            <button
              onClick={() => { onDisconnect(); setStep(1); setInputUrl(''); }}
              className="px-3 py-1.5 text-xs bg-red-900/30 border border-red-800 rounded-lg text-red-300 hover:text-red-200 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s.id < step
                  ? 'bg-green-600 text-white'
                  : s.id === step
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-elevated text-gray-500'
              }`}
            >
              {s.id < step ? '✓' : s.id}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-8 transition-colors ${s.id < step ? 'bg-green-600' : 'bg-surface-border'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Step 1: Create a Slack App & Webhook</h4>
            <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
              <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline hover:text-brand-300">api.slack.com/apps</a></li>
              <li>Click <strong className="text-gray-300">"Create New App"</strong> → "From scratch"</li>
              <li>Enable <strong className="text-gray-300">Incoming Webhooks</strong> in the app settings</li>
              <li>Click <strong className="text-gray-300">"Add New Webhook to Workspace"</strong> and choose a channel</li>
              <li>Copy the webhook URL that starts with <code className="text-brand-300 text-xs">https://hooks.slack.com/…</code></li>
            </ol>
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              I have my webhook URL →
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Step 2: Paste Your Webhook URL</h4>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-surface-border text-gray-400 rounded-lg text-sm hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? 'Connecting…' : 'Connect'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Step 3: Test the Connection</h4>
            <p className="text-sm text-gray-400">Send a test message to confirm Slack is connected.</p>
            {testResult && (
              <div className={`p-3 rounded-lg text-sm ${testResult.success ? 'bg-green-900/20 text-green-300 border border-green-800' : 'bg-red-900/20 text-red-300 border border-red-800'}`}>
                {testResult.message}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-surface-border text-gray-400 rounded-lg text-sm hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleTest}
                disabled={loading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? 'Sending…' : 'Send Test Message'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
