import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Users,
  TrendingUp,
  DollarSign,
  Shield,
  Briefcase,
} from 'lucide-react';

/* 1. THE BIG ROCKS JAR WIDGET (Chapter 8) */
export const BigRocksJarWidget: React.FC = () => {
  const [mode, setMode] = useState<'pebbles_first' | 'rocks_first'>('rocks_first');

  return (
    <div className="river-card p-6 md:p-8 my-10 bg-white border border-[#163C3A]/15 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#85590A] font-semibold block mb-1">
            INTERACTIVE MENTAL MODEL · CH. 8
          </span>
          <h3 className="text-2xl font-serif text-[#163C3A]">
            The "Big Rocks" Capacity Simulator
          </h3>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-[#EEF3F1] p-1 rounded-full border border-[#163C3A]/10 text-xs font-mono">
          <button
            onClick={() => setMode('rocks_first')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              mode === 'rocks_first'
                ? 'bg-[#163C3A] text-white font-semibold shadow-sm'
                : 'text-[#667085] hover:text-[#163C3A]'
            }`}
          >
            Big Rocks First (Strategic)
          </button>
          <button
            onClick={() => setMode('pebbles_first')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              mode === 'pebbles_first'
                ? 'bg-[#DDA6A0] text-[#163C3A] font-bold shadow-sm'
                : 'text-[#667085] hover:text-[#163C3A]'
            }`}
          >
            Pebbles First (Ad-hoc Trap)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Visual Jar Simulation */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-48 h-64 border-4 border-[#163C3A]/30 border-t-0 rounded-b-3xl bg-[#EEF3F1]/40 p-3 flex flex-col justify-end overflow-hidden shadow-inner">
            {mode === 'rocks_first' ? (
              <>
                {/* Sand filling gaps */}
                <div className="absolute inset-x-0 bottom-0 h-full bg-[#C99A4B]/15 pointer-events-none" />
                {/* Big Rocks */}
                <div className="space-y-2 relative z-10">
                  <div className="p-2.5 rounded-xl bg-[#163C3A] text-white text-[11px] font-mono text-center font-bold shadow-md">
                    ROCK 1: Revenue Levers ($10M+)
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#2F6F8F] text-white text-[11px] font-mono text-center font-bold shadow-md">
                    ROCK 2: Supply Chain Cost Cut
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#163C3A] text-white text-[11px] font-mono text-center font-bold shadow-md">
                    ROCK 3: Risk Default Scoring
                  </div>
                </div>
                {/* Pebbles on top / in between */}
                <div className="flex gap-1.5 justify-center mt-2 relative z-10">
                  <span className="w-4 h-4 rounded-full bg-[#667085]/60" />
                  <span className="w-4 h-4 rounded-full bg-[#667085]/60" />
                  <span className="w-4 h-4 rounded-full bg-[#667085]/60" />
                  <span className="w-4 h-4 rounded-full bg-[#667085]/60" />
                </div>
              </>
            ) : (
              <>
                {/* Overfilled with pebbles */}
                <div className="space-y-1.5 relative z-10">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-1 rounded bg-[#667085]/40 text-[9px] font-mono text-center text-[#1F2933]"
                    >
                      Ad-hoc Report #{i + 1} (Pebble)
                    </div>
                  ))}
                </div>
                {/* Big rock overflows outside jar */}
                <div className="absolute -top-6 inset-x-2 p-2 rounded-xl bg-[#DDA6A0] text-[#163C3A] text-[10px] font-mono text-center font-bold border-2 border-dashed border-[#A94A56] shadow-lg animate-bounce">
                  ⚠ $10M Strategic Bet Overflows!
                </div>
              </>
            )}
          </div>
        </div>

        {/* Explanation text */}
        <div className="md:col-span-7 space-y-3">
          <div
            className={`p-4 rounded-xl border ${
              mode === 'rocks_first'
                ? 'bg-[#EEF3F1] border-[#163C3A]/20'
                : 'bg-[#DDA6A0]/20 border-[#DDA6A0]'
            }`}
          >
            <h4 className="font-serif text-lg font-bold text-[#163C3A] mb-1">
              {mode === 'rocks_first'
                ? 'Outcome: Maximum Enterprise Enterprise Value'
                : 'Outcome: The Analytics Capacity Quicksand'}
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              {mode === 'rocks_first'
                ? 'By committing capacity to the 3–5 multi-million dollar structural opportunities first, smaller ad-hoc requests (pebbles and sand) naturally fill the remaining margins without displacing high-ROI priorities.'
                : 'When teams say "yes" to every ad-hoc dashboard or spreadsheet patch, their cognitive bandwidth is exhausted by low-value operational noise. Transformative strategic projects never fit.'}
            </p>
          </div>

          <div className="text-xs font-mono text-[#85590A] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#163C3A]" />
            <span>Rule: Reject ad-hoc intake that falls below a $500k value threshold.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 2. THE TWO SHORES WIDGET (Chapter 8: WHAT to Do vs WHO Does It) */
export const TwoShoresWidget: React.FC = () => {
  const [activeShore, setActiveShore] = useState<'what' | 'who'>('what');

  return (
    <div className="river-card p-6 md:p-8 my-10 bg-white border border-[#163C3A]/15 shadow-sm">
      <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#85590A] font-semibold block mb-1">
        THE STRATEGIC DILEMMA · CH. 8
      </span>
      <h3 className="text-2xl font-serif text-[#163C3A] mb-4">
        Bridging the Two Shores: WHAT to Do vs. WHO Does It
      </h3>

      {/* Tabs */}
      <div className="flex border-b border-[#EEF3F1] gap-4 mb-6 text-xs font-mono">
        <button
          onClick={() => setActiveShore('what')}
          className={`pb-2 transition-all cursor-pointer font-semibold ${
            activeShore === 'what'
              ? 'border-b-2 border-[#163C3A] text-[#163C3A]'
              : 'text-[#667085] hover:text-[#163C3A]'
          }`}
        >
          Shore 1: WHAT to Do (Strategic Levers)
        </button>
        <button
          onClick={() => setActiveShore('who')}
          className={`pb-2 transition-all cursor-pointer font-semibold ${
            activeShore === 'who'
              ? 'border-b-2 border-[#163C3A] text-[#163C3A]'
              : 'text-[#667085] hover:text-[#163C3A]'
          }`}
        >
          Shore 2: WHO Does It (Operating Models)
        </button>
      </div>

      {activeShore === 'what' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#EEF3F1] border border-[#163C3A]/10">
            <span className="w-8 h-8 rounded-full bg-[#163C3A] text-white flex items-center justify-center font-bold mb-3 text-xs">
              <DollarSign className="w-4 h-4" />
            </span>
            <h4 className="font-serif text-lg font-bold text-[#163C3A] mb-1">Revenue Expansion</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Customer lifetime value (LTV), personalized cross-sell pricing, conversion funnel acceleration.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#EEF3F1] border border-[#163C3A]/10">
            <span className="w-8 h-8 rounded-full bg-[#2F6F8F] text-white flex items-center justify-center font-bold mb-3 text-xs">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h4 className="font-serif text-lg font-bold text-[#163C3A] mb-1">Cost Optimization</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Supply chain bottlenecks, workforce routing, waste elimination, inventory turns.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#EEF3F1] border border-[#163C3A]/10">
            <span className="w-8 h-8 rounded-full bg-[#163C3A] text-white flex items-center justify-center font-bold mb-3 text-xs">
              <Shield className="w-4 h-4" />
            </span>
            <h4 className="font-serif text-lg font-bold text-[#163C3A] mb-1">Risk Mitigation</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Default risk scoring, regulatory compliance telemetry, fraud detection, customer churn.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#EEF3F1] border border-[#163C3A]/10">
            <span className="text-[10px] font-mono text-[#85590A] uppercase font-semibold block mb-1">
              Model A
            </span>
            <h4 className="font-serif text-lg font-bold text-[#163C3A] mb-1">Centralized CoE</h4>
            <p className="text-xs text-[#667085] leading-relaxed mb-2">
              High tool consistency and standard governance; weak commercial empathy and slow delivery.
            </p>
            <span className="text-[10px] font-mono text-[#667085] block bg-white p-1 rounded">
              Rating: Sub-optimal for agile growth
            </span>
          </div>

          <div className="p-5 rounded-xl bg-[#EEF3F1] border border-[#163C3A]/10">
            <span className="text-[10px] font-mono text-[#85590A] uppercase font-semibold block mb-1">
              Model B
            </span>
            <h4 className="font-serif text-lg font-bold text-[#163C3A] mb-1">Decentralized</h4>
            <p className="text-xs text-[#667085] leading-relaxed mb-2">
              High business unit intimacy; rampant metric divergence, duplicate data engineering, and siloed tools.
            </p>
            <span className="text-[10px] font-mono text-[#667085] block bg-white p-1 rounded">
              Rating: Causes chaotic metric conflict
            </span>
          </div>

          <div className="p-5 rounded-xl bg-[#163C3A] text-white border border-[#C99A4B]/40 shadow-md">
            <span className="text-[10px] font-mono text-[#C99A4B] uppercase font-semibold block mb-1">
              Gold Standard
            </span>
            <h4 className="font-serif text-lg font-bold text-white mb-1">Hybrid Hub-and-Spoke</h4>
            <p className="text-xs text-[#EEF3F1] leading-relaxed mb-2">
              Central Head of Analytics manages standards, data platforms, and career tracks, while analysts sit embedded inside business lines.
            </p>
            <span className="text-[10px] font-mono text-[#C99A4B] block bg-white/15 p-1 rounded">
              Recommended for sustained impact
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
