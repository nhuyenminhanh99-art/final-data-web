import React from 'react';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16">
      <div className="max-w-md text-center bg-white rounded-3xl p-8 md:p-12 border border-[#163C3A]/12 shadow-[0_18px_40px_-12px_rgba(47,111,143,0.28)]">
        <span className="text-6xl font-serif block mb-2 font-semibold bg-gradient-to-br from-[#2F6F8F] to-[#C99A4B] bg-clip-text text-transparent">404</span>
        <h1 className="text-3xl font-serif text-[#163C3A] mb-4 font-semibold">You Have Drifted Beyond the River</h1>
        <p className="text-sm md:text-base text-[#4A5568] leading-relaxed mb-8">
          The misty waters carry many currents, but this shore does not exist in our charts. Let us guide your boat back to safe harbor.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#2F6F8F] text-white px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#163C3A] transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Home
          </a>
          <a
            href="/journey"
            className="inline-flex items-center justify-center gap-2 border border-[#163C3A]/30 text-[#163C3A] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:border-[#2F6F8F] hover:bg-[#EEF3F1] transition-colors min-h-[44px]"
          >
            <Compass className="w-3.5 h-3.5 text-[#85590A]" /> Sail the 3D River
          </a>
        </div>
      </div>
    </div>
  );
};
