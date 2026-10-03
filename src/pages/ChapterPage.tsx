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

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1F2933] pt-28 pb-20">
      {/* JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center space-x-2 text-xs font-mono text-[#667085] mb-8">
          <a href="/" className="hover:text-[#163C3A]">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/journey" className="hover:text-[#163C3A]">Journey</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#163C3A] font-semibold">Chapter {chapter.number}</span>
        </nav>

        {/* 6-Node Curriculum Progress Indicator */}
        <ChapterProgressIndicator currentChapter={chapter.number} />

        {/* 3D River Sail CTA Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-[#EEF3F1] border border-[#163C3A]/15 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F6F8F] animate-ping" />
            <span className="text-xs font-mono text-[#1F2933]">
              Landmark <strong>{chapter.regionName}</strong> located along the 3D river path.
            </span>
          </div>
          <a
            href={`/journey/${chapter.slug}`}
            className="inline-flex items-center gap-1.5 bg-[#163C3A] text-white px-5 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider hover:bg-[#2F6F8F] transition-all shadow-md shadow-[#163C3A]/20"
          >
            Sail Here in 3D <Compass className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Article Metadata bar */}
        <header className="mb-8 border-b border-[#EEF3F1] pb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 text-xs font-mono text-[#667085] mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[#85590A] font-semibold uppercase tracking-widest">{chapter.kicker}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#2F6F8F]" /> Behind Every Good Decision
              </span>
              <span>·</span>
              <span>Est. 8 min read</span>
            </div>

            {/* Reading Mode Switcher */}
            <div className="flex bg-[#EEF3F1] p-1 rounded-full border border-[#163C3A]/10 text-xs">
              <button
                onClick={() => setReadingMode('all')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  readingMode === 'all'
                    ? 'bg-[#163C3A] text-white font-semibold shadow-sm'
                    : 'text-[#667085] hover:text-[#163C3A]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> All Sections
              </button>
              <button
                onClick={() => setReadingMode('drilldown')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  readingMode === 'drilldown'
                    ? 'bg-[#163C3A] text-white font-semibold shadow-sm'
                    : 'text-[#667085] hover:text-[#163C3A]'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" /> Section Reader
              </button>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif text-[#163C3A] font-normal leading-tight mb-4">
            {chapter.title}
          </h1>

          <p className="text-lg text-[#85590A] italic font-serif leading-relaxed">
            "{chapter.tagline}"
          </p>
        </header>

        {/* Signature Storytelling Moment for this Chapter */}
        <ChapterSignatureVisuals chapterNumber={chapter.number} />

        {/* MAIN CONTENT AREA */}
        {readingMode === 'all' ? (
          <main className="space-y-12">
            <BlockRenderer blocks={chapter.blocks} />
          </main>
        ) : (
          /* SECTION-BY-SECTION DRILL-IN READER MODE */
          <main className="space-y-8 animate-memory">
            {/* Table of Contents Section Nav */}
            <div className="p-4 rounded-2xl bg-white border border-[#163C3A]/15 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[#667085] mb-3">
                <span className="flex items-center gap-1 font-semibold text-[#85590A]">
                  <ListTree className="w-4 h-4 text-[#2F6F8F]" /> SECTION CONTENTS
                </span>
                <span>
                  SECTION {currentSectionIndex + 1} OF {visibleBlocks.length}
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {visibleBlocks.map((b, idx) => (
                  <button
                    key={b.id || idx}
                    onClick={() => setCurrentSectionIndex(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                      currentSectionIndex === idx
                        ? 'bg-[#163C3A] text-white font-semibold'
                        : 'bg-[#EEF3F1] text-[#667085] hover:text-[#163C3A]'
                    }`}
                  >
                    0{idx + 1}. {b.type}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Section Content */}
            <div className="river-card p-6 md:p-10 bg-white">
              <SingleBlock block={activeBlock} />
            </div>

            {/* Previous / Next Section Pagination */}
            <div className="flex items-center justify-between pt-4">
              <button
                disabled={currentSectionIndex === 0}
                onClick={() => setCurrentSectionIndex((prev) => Math.max(prev - 1, 0))}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                  currentSectionIndex === 0
                    ? 'opacity-30 border-transparent cursor-not-allowed text-[#667085]'
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
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  currentSectionIndex === visibleBlocks.length - 1
                    ? 'opacity-30 bg-[#EEF3F1] text-[#667085] cursor-not-allowed'
                    : 'bg-[#163C3A] text-white hover:bg-[#2F6F8F] shadow-sm cursor-pointer'
                }`}
              >
                Next Section <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </main>
        )}

        {/* Next / Previous Chapter Navigation */}
        <div className="mt-20 pt-10 border-t border-[#EEF3F1] grid grid-cols-1 sm:grid-cols-2 gap-6">
          {prevChapter ? (
            <a
              href={`/${prevChapter.slug}/`}
              className="river-card p-6 flex flex-col justify-between group hover:border-[#163C3A] bg-white"
            >
              <span className="text-xs font-mono text-[#667085] flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#2F6F8F]" />
                Previous Chapter
              </span>
              <span className="font-serif text-xl text-[#1F2933] group-hover:text-[#163C3A] transition-colors">
                Ch. 0{prevChapter.number}: {prevChapter.title}
              </span>
            </a>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <a
              href={`/${nextChapter.slug}/`}
              className="river-card p-6 flex flex-col justify-between group text-right hover:border-[#163C3A] bg-white"
            >
              <span className="text-xs font-mono text-[#667085] flex items-center justify-end gap-1 mb-2">
                Next Chapter
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#2F6F8F]" />
              </span>
              <span className="font-serif text-xl text-[#1F2933] group-hover:text-[#163C3A] transition-colors">
                Ch. 0{nextChapter.number}: {nextChapter.title}
              </span>
            </a>
          ) : (
            <a
              href="/case-studies/"
              className="river-card p-6 flex flex-col justify-between group text-right hover:border-[#163C3A] bg-white"
            >
              <span className="text-xs font-mono text-[#667085] flex items-center justify-end gap-1 mb-2">
                Final Harbour
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#2F6F8F]" />
              </span>
              <span className="font-serif text-xl text-[#1F2933] group-hover:text-[#163C3A] transition-colors">
                Explore Case Studies
              </span>
            </a>
          )}
        </div>
      </article>
    </div>
  );
};
