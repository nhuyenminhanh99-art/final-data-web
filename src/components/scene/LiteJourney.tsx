import React from 'react';
import { chaptersData } from '../../data/chaptersData';
import { MapPin, ArrowRight, Compass } from 'lucide-react';

interface LiteJourneyProps {
  progress: number;
  onOpenChapter: (chapterNumber: number) => void;
}

export const LiteJourney: React.FC<LiteJourneyProps> = ({ progress, onOpenChapter }) => {
  return (
    <div className="relative w-full min-h-[500vh] bg-gradient-to-b from-[#F7F3EA] via-[#E8EFEA] to-[#F7F3EA] text-[#1E2B26] overflow-hidden">
      {/* Layered Parallax Background Silhouettes - Bright Morning */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          transform: `translateY(${progress * -70}px)`,
          backgroundImage: `radial-gradient(circle at 50% 20%, #E3B65C 0%, transparent 65%)`,
        }}
      />

      {/* Floating CSS Blossom Petals - Soft Delicate Spring Pink */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-4 bg-[#F3C1BE]/80 rounded-full blur-[0.3px] shadow-sm"
            style={{
              top: `${(i * 16 + progress * 220) % 100}%`,
              left: `${(i * 22 + Math.sin(progress * 8 + i) * 18) % 94}%`,
              transform: `rotate(${i * 40 + progress * 160}deg)`,
              transition: 'transform 0.1s linear',
            }}
          />
        ))}
      </div>

      {/* 2D River Path (SVG) with Fresh Jade Water Tones */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-full w-28 pointer-events-none z-10 opacity-60">
        <svg className="w-full h-full" viewBox="0 0 100 1000" preserveAspectRatio="none">
          <path
            d="M 50 0 Q 30 250, 70 500 T 50 1000"
            fill="none"
            stroke="#2F6F6A"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 50 0 Q 30 250, 70 500 T 50 1000"
            fill="none"
            stroke="#CFE6EA"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 50 0 Q 30 250, 70 500 T 50 1000"
            fill="none"
            stroke="#85590A"
            strokeWidth="2"
            strokeDasharray="4 8"
          />
        </svg>
      </div>

      {/* Floating 2D Boat following scroll progress */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-transform duration-75"
        style={{
          top: `${Math.min(Math.max(progress * 85 + 5, 8), 90)}%`,
          transform: `translateX(-50%) rotate(${Math.sin(progress * 10) * 6}deg)`,
        }}
      >
        <div className="relative w-11 h-22 bg-[#6B4A32] rounded-[50%_50%_35%_35%] border-2 border-[#85590A]/40 shadow-xl flex flex-col items-center justify-between p-1.5">
          {/* Warm lantern light on boat */}
          <div className="w-3 h-3 rounded-full bg-[#E3B65C] shadow-[0_0_12px_#E3B65C]" />
          <div className="w-7 h-1 bg-[#4A3222] rounded" />
          <div className="w-7 h-1 bg-[#4A3222] rounded" />
          <div className="w-2 h-2 bg-[#F3C1BE] rounded-full" />
        </div>
      </div>

      {/* Chapter Landmarks Along the Vertical Journey */}
      <div className="relative z-30 max-w-4xl mx-auto pt-24 pb-48 px-4 space-y-[80vh]">
        {chaptersData.map((ch, idx) => (
          <div
            key={ch.slug}
            className="river-card p-6 md:p-8 max-w-xl mx-auto backdrop-blur-md border border-[#2F6F6A]/20 transition-all hover:border-[#2F6F6A] shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono tracking-widest text-[#85590A] font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2F6F6A]" />
                Stop 0{idx + 1} · {ch.regionName}
              </span>
              <span className="text-xs text-[#4F5E57] font-mono">Chapter {ch.number}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif text-[#1E2B26] mb-2">{ch.title}</h3>
            <p className="text-sm text-[#4F5E57] leading-relaxed mb-6">{ch.summary}</p>

            <button
              onClick={() => onOpenChapter(ch.number)}
              className="w-full bg-[#1F4F4B] text-[#F7F3EA] py-3 rounded-xl font-medium text-xs uppercase tracking-wider hover:bg-[#2F6F6A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#1F4F4B]/20"
            >
              Open Chapter Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Final Harbour Card */}
        <div className="river-card p-6 md:p-8 max-w-xl mx-auto text-center border-[#2F6F6A]/40 shadow-lg">
          <span className="text-xs uppercase font-mono tracking-widest text-[#85590A] font-semibold block mb-2">
            The Harbour
          </span>
          <h3 className="text-3xl font-serif text-[#1E2B26] mb-3">The Journey Concludes</h3>
          <p className="text-sm text-[#4F5E57] mb-6">
            Review the 6 real-world enterprise case studies demonstrating these leadership principles in practice.
          </p>
          <a
            href="/case-studies/"
            className="inline-flex items-center gap-2 bg-[#1F4F4B] text-[#F7F3EA] px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#2F6F6A] transition-colors shadow-md shadow-[#1F4F4B]/20"
          >
            View Case Studies <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
