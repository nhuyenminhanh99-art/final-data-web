import React, { useEffect, useRef } from 'react';
import { Chapter } from '../../types';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { ChapterSignatureVisuals } from '../storytelling/ChapterSignatureVisuals';
import {
  Compass,
  ArrowRight,
  X,
  BookOpen,
  ChevronRight,
  Anchor,
} from 'lucide-react';

interface ChapterPanelProps {
  chapter: Chapter | null;
  onClose: () => void;
  isFocused?: boolean;
}

export const ChapterPanel: React.FC<ChapterPanelProps> = ({
  chapter,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const bottomExitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!chapter) return;

    // Shift focus to close button upon opening for keyboard accessibility
    closeButtonRef.current?.focus();

    // Escape key listener for secondary safe exit
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Lock root scroll while in full-page editorial reader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [chapter, onClose]);

  if (!chapter) return null;

  const stationIndex = Math.max(1, chapter.number - 6);
  const totalStations = 5;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-fullpage-title"
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#FFFDF8]/96 sm:bg-[#FFFDF8]/95 backdrop-blur-md text-[#1F2933] transition-opacity duration-300 ease-out animate-memory"
    >
      {/* Subtle Environmental Water Ambient Layer behind content */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-radial-gradient from-transparent via-[#E1EDF2]/30 to-[#EEF3F1]/50" />

      {/* STICKY TOP EDITORIAL NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#163C3A]/12 px-4 sm:px-8 py-3.5 shadow-xs transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: River Station Telemetry & Region */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F6F8F] animate-pulse shrink-0" />
            <div className="flex items-center gap-2 text-xs truncate">
              <span className="font-semibold text-[#85590A] uppercase tracking-wider font-sans shrink-0">
                Station 0{stationIndex} of 0{totalStations}
              </span>
              <span className="text-[#163C3A]/30 hidden sm:inline">·</span>
              <span className="text-[#163C3A] font-medium hidden sm:inline truncate font-sans">
                {chapter.regionName}
              </span>
            </div>
          </div>

          {/* Center: Editorial Chapter Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-sans text-[#718096]">
            <span className="font-serif italic text-sm text-[#163C3A]">
              Chapter {chapter.number}: {chapter.title}
            </span>
          </div>

          {/* Right: Authoritative Exit Control [ CONTINUE JOURNEY ] */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-[#163C3A] hover:bg-[#2F6F8F] text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider font-sans transition-all shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
              title="Return to river voyage (Esc)"
              aria-label="Continue Journey and return to river"
            >
              <span>CONTINUE JOURNEY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#718096] hover:text-[#163C3A] hover:bg-[#EEF3F1] rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#163C3A]"
              title="Close and continue journey (Esc)"
              aria-label="Close chapter view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* PRIMARY FULL-PAGE EDITORIAL READING CANVAS */}
      <main className="relative z-10 max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-28">
        <article className="space-y-16 sm:space-y-20">
          {/* TOP EDITORIAL HEADER SECTION */}
          <header className="border-b border-[#163C3A]/12 pb-14 sm:pb-16 relative overflow-hidden">
            {/* Monumental Chapter Number Watermark */}
            <span
              aria-hidden="true"
              className="text-[10rem] sm:text-[14rem] font-serif text-[#C99A4B]/10 select-none absolute -top-10 sm:-top-16 -right-4 sm:-right-8 pointer-events-none leading-none font-light"
            >
              0{chapter.number}
            </span>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#718096] mb-8 font-sans relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full bg-[#FAF6EE] border border-[#C99A4B]/30 text-[#85590A] font-semibold uppercase tracking-[0.2em]">
                  {chapter.kicker}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#4A5568]">
                  <BookOpen className="w-3.5 h-3.5 text-[#2F6F8F]" />
                  Behind Every Good Decision
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#718096]">
                <Anchor className="w-3.5 h-3.5 text-[#2F6F8F]" />
                <span>Station Landmark · {chapter.regionName}</span>
              </div>
            </div>

            {/* High-impact Cormorant Garamond Chapter Title */}
            <h1
              id="chapter-fullpage-title"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#163C3A] font-normal leading-[1.04] tracking-tight mb-8 relative z-10"
            >
              {chapter.title}
            </h1>

            {/* Introductory Tagline Statement */}
            <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-[#4A5568] leading-relaxed max-w-3xl mb-9 border-l-2 border-[#C99A4B]/40 pl-6 relative z-10">
              "{chapter.tagline}"
            </p>

            {/* Executive Overview Paragraph */}
            <p className="text-base sm:text-lg md:text-xl text-[#2D3748] leading-relaxed font-sans max-w-3xl relative z-10">
              {chapter.summary}
            </p>
          </header>

          {/* SIGNATURE VISUAL STORYTELLING MOMENT */}
          <section
            aria-label={`Signature Framework for Chapter ${chapter.number}`}
            className="my-14 sm:my-18"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#85590A] font-semibold mb-4 font-sans">
              <Compass className="w-3.5 h-3.5 text-[#85590A]" />
              <span>Interactive Mental Model & Field Framework</span>
            </div>
            <ChapterSignatureVisuals chapterNumber={chapter.number} />
          </section>

          {/* MAIN CURRICULUM CONTENT BLOCKS */}
          <section
            aria-label={`Curriculum Content for Chapter ${chapter.number}`}
            className="chapter-reader-body space-y-20 sm:space-y-24"
          >
            <BlockRenderer blocks={chapter.blocks} />
          </section>

          {/* BOTTOM TERMINAL CALLOUT: [ CONTINUE JOURNEY ] */}
          <footer className="pt-20 border-t border-[#163C3A]/12 text-center max-w-2xl mx-auto space-y-7">
            <div className="w-12 h-0.5 bg-[#C99A4B] mx-auto mb-4" />
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#85590A] font-semibold block">
              ✦ STATION EXPLORATION COMPLETE ✦
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#163C3A] font-normal">
              Ready to Continue Sailing?
            </h3>
            <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
              Return to the water to pilot your boat along the spline toward the next station landmark.
            </p>

            <div className="pt-2">
              <button
                ref={bottomExitRef}
                type="button"
                onClick={onClose}
                className="btn-primary inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider font-sans cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                <span>CONTINUE JOURNEY</span>
                <ArrowRight className="w-4 h-4 btn-arrow" />
              </button>
            </div>

            <p className="text-xs text-[#718096] font-sans">
              Press <kbd className="px-2 py-0.5 rounded bg-[#EEF3F1] border border-[#163C3A]/15 font-mono text-[11px] text-[#163C3A]">Esc</kbd> or click above to return to the river.
            </p>
          </footer>
        </article>
      </main>
    </div>
  );
};
