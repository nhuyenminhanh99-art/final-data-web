import React from 'react';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0C0C0B] text-[#EDE7D8] flex items-center justify-center px-4">
      <div className="max-w-md text-center river-card p-8 md:p-12 border border-[#C8A66A]/30">
        <span className="text-4xl font-serif text-[#C8A66A] block mb-2 font-light">404</span>
        <h1 className="text-2xl font-serif text-[#EDE7D8] mb-4">You Have Drifted Beyond the River</h1>
        <p className="text-xs md:text-sm text-[#D9D8CC] leading-relaxed mb-8">
          The misty waters carry many currents, but this shore does not exist in our charts. Let us guide your boat back to safe harbor.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#C8A66A] text-[#0C0C0B] px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#C8A66A]/90 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Home
          </a>
          <a
            href="/journey"
            className="inline-flex items-center justify-center gap-2 border border-[#3A2B20] text-[#EDE7D8] px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider hover:border-[#C8A66A] transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#C8A66A]" /> Sail the 3D River
          </a>
        </div>
      </div>
    </div>
  );
};
