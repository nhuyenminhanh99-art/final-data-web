import React, { useState } from 'react';
import { chaptersData } from '../data/chaptersData';
import { BlockRenderer, SingleBlock } from '../components/blocks/BlockRenderer';
import { ChapterSignatureVisuals } from '../components/storytelling/ChapterSignatureVisuals';
import { ChapterProgressIndicator } from '../components/common/ChapterProgressIndicator';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  BookOpen,
  ListTree,
  BookMarked,
} from 'lucide-react';

interface ChapterPageProps {
  slug: string;
}

export const ChapterPage: React.FC<ChapterPageProps> = ({ slug }) => {
  const chapterIdx = chaptersData.findIndex((c) => c.slug === slug);
  const chapter = chaptersData[chapterIdx] || chaptersData[0];

  const prevChapter = chapterIdx > 0 ? chaptersData[chapterIdx - 1] : null;
  const nextChapter = chapterIdx < chaptersData.length - 1 ? chaptersData[chapterIdx + 1] : null;

  // Reading modes: 'all' (continuous scroll) or 'drilldown' (section-by-section reader)
  const [readingMode, setReadingMode] = useState<'all' | 'drilldown'>('all');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Structured Data Schema for Article and Breadcrumbs
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: chapter.seo.title,
    description: chapter.seo.description,
    author: {
      '@type': 'Person',
      name: 'Piyanka Jain & Puneet Sharma',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The River of Insights',
    },
    mainEntityOfPage: `/${chapter.slug}/`,
  };

  const visibleBlocks = chapter.blocks.filter((b) => b.visible !== false);
  const activeBlock = visibleBlocks[currentSectionIndex] || visibleBlocks[0];

  const getBlockLabel = (b: (typeof visibleBlocks)[0], idx: number): string => {
    if (b.type === 'hero') return (b as any).kicker || 'Curriculum Overview';
    if (b.type === 'storyCard') {
      const who = (b as any).who || '';
      return who.length > 24 ? who.slice(0, 24) + '...' : who || 'Executive Case Study';
    }
    if (b.type === 'definitionBox') return (b as any).title || 'Core Principles';
    if (b.type === 'timeline') return 'Curriculum Roadmap';
    if (b.type === 'comparisonTable') return (b as any).caption || 'Decision Matrix';
    if (b.type === 'flow') return 'Strategic Flow';
    if (b.type === 'bigNumber') return (b as any).caption || 'Key Metric';
    if (b.type === 'checklist') return (b as any).title || 'Action Checklist';
    if (b.type === 'quote') return 'Executive Reflection';
    if (b.type === 'tabs') return 'Interactive Analysis';
    if (b.type === 'accordion') return 'In-Depth Inquiry';
    if (b.type === 'numberedCards') return 'Core Pillars';
    if (b.type === 'twoColumn') return (b as any).left?.title || 'Comparative Study';
    if (b.type === 'cardGrid' || b.type === 'filterGrid') return 'Case Catalog';
    if (b.type === 'callout') return (b as any).title || 'Executive Advisory';
    if (b.type === 'richText') return 'Context & Analysis';
    return `Section 0${idx + 1}`;
  };

  return (
    <div className="chapter-page min-h-screen text-[#1F2933] pt-32 pb-28">
      {/* JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="chapter-article max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center space-x-2 text-xs text-[#718096] mb-10">
          <a href="/" className="hover:text-[#163C3A] transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/journey" className="hover:text-[#163C3A] transition-colors">Journey</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#163C3A] font-medium">Chapter {chapter.number}</span>
        </nav>

        {/* 6-Node Curriculum Progress Indicator */}
        <div className="chapter-progress-shell mb-14 sm:mb-16">
          <ChapterProgressIndicator currentChapter={chapter.number} />
        </div>

        {/* 3D River Sail CTA Banner */}
        <div className="chapter-sail-banner mb-16 sm:mb-20 p-6 sm:p-7 rounded-2xl bg-white border border-[#163C3A]/14 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_6px_18px_-2px_rgba(22,60,58,0.06),0_16px_32px_-4px_rgba(22,60,58,0.04)]">
          <div className="flex items-center gap-3.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F6F8F] animate-ping shrink-0" />
            <span className="text-xs sm:text-sm text-[#2D3748] leading-relaxed">
              Landmark <strong className="text-[#163C3A] font-semibold">{chapter.regionName}</strong> located along the 3D river path.
            </span>
          </div>
          <a
            href={`/journey/${chapter.slug}`}
            className="inline-flex items-center gap-2 bg-[#163C3A] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#2F6F8F] transition-all shadow-sm shrink-0"
          >
            Sail Here in 3D <Compass className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Article Metadata bar */}
        <header className="chapter-heading mb-18 sm:mb-24 border-b border-[#163C3A]/12 pb-14 sm:pb-16 relative overflow-hidden">

          <div className="chapter-meta flex items-center justify-between flex-wrap gap-4 text-xs text-[#718096] mb-8 relative z-10 font-sans">
            <div className="flex items-center gap-3">
              <span className="chapter-kicker px-3.5 py-1 rounded-full bg-[#FAF6EE] border border-[#C99A4B]/30 text-[#85590A] font-semibold uppercase tracking-[0.2em]">
                {chapter.kicker}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-[#4A5568]">
                <BookOpen className="w-3.5 h-3.5 text-[#2F6F8F]" /> Behind Every Good Decision
              </span>
              <span>·</span>
              <span>Est. 8 min read</span>
            </div>

            {/* Reading Mode Switcher */}
            <div className="flex bg-white/95 p-1.5 rounded-full border border-[#163C3A]/14 text-xs shadow-xs gap-1">
              <button
                onClick={() => setReadingMode('all')}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 font-sans ${
                  readingMode === 'all'
                    ? 'bg-[#163C3A] text-white font-semibold shadow-sm'
                    : 'text-[#718096] hover:text-[#163C3A]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> All Sections
              </button>
              <button
                onClick={() => setReadingMode('drilldown')}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 font-sans ${
                  readingMode === 'drilldown'
                    ? 'bg-[#163C3A] text-white font-semibold shadow-sm'
                    : 'text-[#718096] hover:text-[#163C3A]'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" /> Section Reader
              </button>
            </div>
          </div>

          <h1 className="chapter-title sr-only">
            {chapter.title}
          </h1>

          <p className="chapter-tagline text-xl sm:text-2xl md:text-3xl font-serif italic text-[#4A5568] leading-relaxed max-w-3xl mb-9 border-l-2 border-[#C99A4B]/40 pl-6 relative z-10">
            "{chapter.tagline}"
          </p>

          <p className="chapter-summary text-base sm:text-lg md:text-xl text-[#2D3748] leading-relaxed font-sans max-w-3xl relative z-10">
            {chapter.summary}
          </p>
        </header>

        {/* Signature Storytelling Moment for this Chapter */}
        <div className={`chapter-signature chapter-signature--${chapter.number} my-16 sm:my-20`}>
          <ChapterSignatureVisuals chapterNumber={chapter.number} />
        </div>

        {/* MAIN CONTENT AREA */}
        {readingMode === 'all' ? (
          <main className="chapter-content space-y-20 sm:space-y-24 pt-6">
            <BlockRenderer blocks={chapter.blocks} />
          </main>
        ) : (
          /* SECTION-BY-SECTION DRILL-IN READER MODE */
          <main className="chapter-reader space-y-16 animate-memory pt-6">
            {/* Table of Contents Section Nav */}
            <div className="chapter-reader-nav p-6 sm:p-7 rounded-2xl bg-white border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_6px_18px_-2px_rgba(22,60,58,0.06),0_16px_32px_-4px_rgba(22,60,58,0.04)] mb-10 sm:mb-12">
              <div className="flex items-center justify-between text-xs text-[#718096] mb-4">
                <span className="flex items-center gap-1.5 font-semibold text-[#85590A] uppercase tracking-wider">
                  <ListTree className="w-4 h-4 text-[#2F6F8F]" /> Section Contents
                </span>
                <span className="font-medium">
                  Section {currentSectionIndex + 1} of {visibleBlocks.length}
                </span>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {visibleBlocks.map((b, idx) => (
                  <button
                    key={b.id || idx}
                    onClick={() => setCurrentSectionIndex(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all font-sans cursor-pointer ${
                      currentSectionIndex === idx
                        ? 'bg-[#163C3A] text-[#FFFDF8] shadow-sm'
                        : 'bg-[#EEF3F1] text-[#4A5568] hover:text-[#163C3A] hover:bg-[#E2EBE8]'
                    }`}
                  >
                    0{idx + 1}. {getBlockLabel(b, idx)}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Section Content */}
            <div className="mb-10 sm:mb-12">
              <SingleBlock block={activeBlock} />
            </div>

            {/* Previous / Next Section Pagination */}
            <div className="flex items-center justify-between pt-10 border-t border-[#163C3A]/10">
              <button
                disabled={currentSectionIndex === 0}
                onClick={() => setCurrentSectionIndex((prev) => Math.max(prev - 1, 0))}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                  currentSectionIndex === 0
                    ? 'opacity-30 border-transparent cursor-not-allowed text-[#718096]'
                    : 'border-[#163C3A]/20 hover:border-[#163C3A] text-[#163C3A] cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Previous Section
              </button>

              <button
                disabled={currentSectionIndex === visibleBlocks.length - 1}
                onClick={() =>
                  setCurrentSectionIndex((prev) => Math.min(prev + 1, visibleBlocks.length - 1))
                }
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  currentSectionIndex === visibleBlocks.length - 1
                    ? 'opacity-30 bg-[#EEF3F1] text-[#718096] cursor-not-allowed'
                    : 'bg-[#163C3A] text-white hover:bg-[#2F6F8F] shadow-sm cursor-pointer'
                }`}
              >
                Next Section <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </main>
        )}

        {/* Terminal Voyage CTA: [ CONTINUE JOURNEY ] */}
        <section className="mt-20 pt-16 border-t border-[#163C3A]/12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-12 h-0.5 bg-[#C99A4B] mx-auto mb-2" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] font-semibold font-sans block">
            ✦ CHAPTER {String(chapter.number).padStart(2, '0')} EXPLORATION COMPLETE ✦
          </span>
          <h3 className="text-3xl sm:text-4xl font-serif text-[#163C3A] font-normal">
            Ready to Continue the River Voyage?
          </h3>
          <p className="text-base text-[#4A5568] leading-relaxed font-sans">
            Pilot your boat along the spline toward the next station landmark in the 3D river experience.
          </p>
          <div className="pt-2">
            <a
              href={`/journey/${chapter.slug}`}
              className="btn-primary inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider font-sans cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              <span>CONTINUE JOURNEY</span>
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </a>
          </div>
        </section>

        {/* Next / Previous Chapter Navigation */}
        <div className="mt-20 pt-12 border-t border-[#163C3A]/10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {prevChapter ? (
            <a
              href={`/${prevChapter.slug}/`}
              className="river-card p-6 md:p-7 flex flex-col justify-between group hover:border-[#163C3A]"
            >
              <span className="text-xs text-[#718096] flex items-center gap-1 mb-2 font-medium">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#2F6F8F]" />
                Previous Chapter
              </span>
              <span className="font-serif text-xl sm:text-2xl text-[#1F2933] group-hover:text-[#163C3A] transition-colors leading-snug">
                Ch. {String(prevChapter.number).padStart(2, '0')}: {prevChapter.title}
              </span>
            </a>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <a
              href={`/${nextChapter.slug}/`}
              className="river-card p-6 md:p-7 flex flex-col justify-between group text-right hover:border-[#163C3A]"
            >
              <span className="text-xs text-[#718096] flex items-center justify-end gap-1 mb-2 font-medium">
                Next Chapter
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#2F6F8F]" />
              </span>
              <span className="font-serif text-xl sm:text-2xl text-[#1F2933] group-hover:text-[#163C3A] transition-colors leading-snug">
                Ch. {String(nextChapter.number).padStart(2, '0')}: {nextChapter.title}
              </span>
            </a>
          ) : (
            <a
              href="/case-studies/"
              className="river-card p-6 md:p-7 flex flex-col justify-between group text-right hover:border-[#163C3A]"
            >
              <span className="text-xs text-[#718096] flex items-center justify-end gap-1 mb-2 font-medium">
                Final Harbour
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#2F6F8F]" />
              </span>
              <span className="font-serif text-xl sm:text-2xl text-[#1F2933] group-hover:text-[#163C3A] transition-colors leading-snug">
                Explore Case Studies
              </span>
            </a>
          )}
        </div>
      </article>
    </div>
  );
};

