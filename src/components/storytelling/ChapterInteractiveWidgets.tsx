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
    <div className="river-card p-8 sm:p-10 md:p-12 my-14 sm:my-16 bg-white border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_6px_18px_-2px_rgba(22,60,58,0.06),0_16px_32px_-4px_rgba(22,60,58,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-[#163C3A]/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-[#85590A] font-semibold block mb-1.5 font-sans">
            Interactive Mental Model · Ch. 8
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#163C3A] font-normal leading-snug">
            The "Big Rocks" Capacity Simulator
          </h3>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-[#EEF3F1] p-1.5 rounded-full border border-[#163C3A]/10 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setMode('rocks_first')}
            className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer font-sans font-semibold ${
              mode === 'rocks_first'
                ? 'bg-[#163C3A] text-white shadow-sm'
                : 'text-[#718096] hover:text-[#163C3A]'
            }`}
          >
            Big Rocks First (Strategic)
          </button>
          <button
            type="button"
            onClick={() => setMode('pebbles_first')}
            className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer font-sans font-semibold ${
              mode === 'pebbles_first'
                ? 'bg-[#DDA6A0] text-[#163C3A] shadow-sm'
                : 'text-[#718096] hover:text-[#163C3A]'
            }`}
          >
            Pebbles First (Ad-hoc Trap)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-center">
        {/* Visual Jar Simulation */}
        <div className="md:col-span-5 flex justify-center py-2">
          <div className="relative w-52 h-68 border-4 border-[#163C3A]/30 border-t-0 rounded-b-3xl bg-[#EEF3F1]/40 p-4 flex flex-col justify-end overflow-hidden shadow-inner">
            {mode === 'rocks_first' ? (
              <>
                {/* Sand filling gaps */}
                <div className="absolute inset-x-0 bottom-0 h-full bg-[#C99A4B]/15 pointer-events-none" />
                {/* Big Rocks */}
                <div className="space-y-2.5 relative z-10 font-sans">
                  <div className="p-3 rounded-xl bg-[#163C3A] text-white text-xs text-center font-semibold shadow-md">
                    ROCK 1: Revenue Levers ($10M+)
                  </div>
                  <div className="p-3 rounded-xl bg-[#2F6F8F] text-white text-xs text-center font-semibold shadow-md">
                    ROCK 2: Supply Chain Cost Cut
                  </div>
                  <div className="p-3 rounded-xl bg-[#163C3A] text-white text-xs text-center font-semibold shadow-md">
                    ROCK 3: Risk Default Scoring
                  </div>
                </div>
                {/* Pebbles on top / in between */}
                <div className="flex gap-2 justify-center mt-3 relative z-10">
                  <span className="w-4 h-4 rounded-full bg-[#718096]/60" />
                  <span className="w-4 h-4 rounded-full bg-[#718096]/60" />
                  <span className="w-4 h-4 rounded-full bg-[#718096]/60" />
                  <span className="w-4 h-4 rounded-full bg-[#718096]/60" />
                </div>
              </>
            ) : (
              <>
                {/* Overfilled with pebbles */}
                <div className="space-y-1.5 relative z-10 font-sans">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-1.5 rounded bg-[#718096]/30 text-[10px] text-center text-[#1F2933] font-medium"
                    >
                      Ad-hoc Report #{i + 1} (Pebble)
                    </div>
                  ))}
                </div>
                {/* Big rock overflows outside jar */}
                <div className="absolute -top-6 inset-x-2 p-2.5 rounded-xl bg-[#DDA6A0] text-[#163C3A] text-xs text-center font-semibold border-2 border-dashed border-[#A94A56] shadow-lg animate-bounce font-sans">
                  ⚠ $10M Strategic Bet Overflows!
                </div>
              </>
            )}
          </div>
        </div>

        {/* Explanation text */}
        <div className="md:col-span-7 space-y-5">
          <div
            className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
              mode === 'rocks_first'
                ? 'bg-[#EEF3F1] border-[#163C3A]/20'
                : 'bg-[#DDA6A0]/20 border-[#DDA6A0]'
            }`}
          >
            <h4 className="font-serif text-xl sm:text-2xl text-[#163C3A] mb-2 font-normal leading-snug">
              {mode === 'rocks_first'
                ? 'Outcome: Maximum Enterprise Value'
                : 'Outcome: The Analytics Capacity Quicksand'}
            </h4>
            <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
              {mode === 'rocks_first'
                ? 'By committing capacity to the 3–5 multi-million dollar structural opportunities first, smaller ad-hoc requests (pebbles and sand) naturally fill the remaining margins without displacing high-ROI priorities.'
                : 'When teams say "yes" to every ad-hoc dashboard or spreadsheet patch, their cognitive bandwidth is exhausted by low-value operational noise. Transformative strategic projects never fit.'}
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#85590A] flex items-center gap-2 font-semibold font-sans">
            <CheckCircle2 className="w-4 h-4 text-[#163C3A] shrink-0" />
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
    <div className="river-card p-8 sm:p-10 md:p-12 my-14 sm:my-16 bg-white border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_6px_18px_-2px_rgba(22,60,58,0.06),0_16px_32px_-4px_rgba(22,60,58,0.04)]">
      <span className="text-xs uppercase tracking-[0.16em] text-[#85590A] font-semibold block mb-2 font-sans">
        The Strategic Dilemma · Ch. 8
      </span>
      <h3 className="text-2xl sm:text-3xl font-serif text-[#163C3A] mb-6 font-normal leading-snug">
        Bridging the Two Shores: WHAT to Do vs. WHO Does It
      </h3>

      {/* Tabs */}
      <div className="flex border-b border-[#163C3A]/10 gap-6 mb-8 text-xs font-sans">
        <button
          type="button"
          onClick={() => setActiveShore('what')}
          className={`pb-3 transition-all cursor-pointer font-semibold uppercase tracking-wider ${
            activeShore === 'what'
              ? 'border-b-2 border-[#163C3A] text-[#163C3A]'
              : 'text-[#718096] hover:text-[#163C3A]'
          }`}
        >
          Shore 1: WHAT to Do (Strategic Levers)
        </button>
        <button
          type="button"
          onClick={() => setActiveShore('who')}
          className={`pb-3 transition-all cursor-pointer font-semibold uppercase tracking-wider ${
            activeShore === 'who'
              ? 'border-b-2 border-[#163C3A] text-[#163C3A]'
              : 'text-[#718096] hover:text-[#163C3A]'
          }`}
        >
          Shore 2: WHO Does It (Operating Models)
        </button>
      </div>

      {activeShore === 'what' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#EEF3F1] border border-[#163C3A]/10 flex flex-col justify-between">
            <div>
              <span className="w-9 h-9 rounded-full bg-[#163C3A] text-white flex items-center justify-center font-bold mb-4 text-xs shadow-xs">
                <DollarSign className="w-4 h-4" />
              </span>
              <h4 className="font-serif text-xl text-[#163C3A] mb-2 font-normal leading-snug">Revenue Expansion</h4>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-sans">
                Customer lifetime value (LTV), personalized cross-sell pricing, conversion funnel acceleration.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#EEF3F1] border border-[#163C3A]/10 flex flex-col justify-between">
            <div>
              <span className="w-9 h-9 rounded-full bg-[#2F6F8F] text-white flex items-center justify-center font-bold mb-4 text-xs shadow-xs">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h4 className="font-serif text-xl text-[#163C3A] mb-2 font-normal leading-snug">Cost Optimization</h4>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-sans">
                Supply chain bottlenecks, workforce routing, waste elimination, inventory turns.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#EEF3F1] border border-[#163C3A]/10 flex flex-col justify-between">
            <div>
              <span className="w-9 h-9 rounded-full bg-[#163C3A] text-white flex items-center justify-center font-bold mb-4 text-xs shadow-xs">
                <Shield className="w-4 h-4" />
              </span>
              <h4 className="font-serif text-xl text-[#163C3A] mb-2 font-normal leading-snug">Risk Mitigation</h4>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-sans">
                Default risk scoring, regulatory compliance telemetry, fraud detection, customer churn.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#EEF3F1] border border-[#163C3A]/10 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#85590A] uppercase font-semibold block mb-1 font-sans tracking-wider">
                Model A
              </span>
              <h4 className="font-serif text-xl text-[#163C3A] mb-2 font-normal leading-snug">Centralized CoE</h4>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mb-4 font-sans">
                High tool consistency and standard governance; weak commercial empathy and slow delivery.
              </p>
            </div>
            <span className="text-xs text-[#718096] block bg-white/80 p-2 rounded-xl font-medium font-sans border border-[#163C3A]/10">
              Rating: Sub-optimal for agile growth
            </span>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#EEF3F1] border border-[#163C3A]/10 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#85590A] uppercase font-semibold block mb-1 font-sans tracking-wider">
                Model B
              </span>
              <h4 className="font-serif text-xl text-[#163C3A] mb-2 font-normal leading-snug">Decentralized</h4>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mb-4 font-sans">
                High business unit intimacy; rampant metric divergence, duplicate data engineering, and siloed tools.
              </p>
            </div>
            <span className="text-xs text-[#718096] block bg-white/80 p-2 rounded-xl font-medium font-sans border border-[#163C3A]/10">
              Rating: Causes chaotic metric conflict
            </span>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#163C3A] text-white border border-[#C99A4B]/40 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#C99A4B] uppercase font-semibold block mb-1 font-sans tracking-wider">
                Gold Standard
              </span>
              <h4 className="font-serif text-xl text-white mb-2 font-normal leading-snug">Hybrid Hub-and-Spoke</h4>
              <p className="text-xs sm:text-sm text-[#EEF3F1] leading-relaxed mb-4 font-sans">
                Central Head of Analytics manages standards, data platforms, and career tracks, while analysts sit embedded inside business lines.
              </p>
            </div>
            <span className="text-xs text-[#C99A4B] block bg-white/15 p-2 rounded-xl font-medium font-sans">
              Recommended for sustained impact
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
