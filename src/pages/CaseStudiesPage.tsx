import React, { useState, useMemo } from 'react';
import { caseStudiesData } from '../data/caseStudiesData';
import { chaptersData } from '../data/chaptersData';
import { CaseStudy } from '../types';
import {
  ShieldCheck,
  ArrowRight,
  Filter,
  Search,
  BookOpen,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const CaseStudiesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  const filterTags = [
    'All',
    'Culture',
    'Strategy',
    'Testing',
    'Prioritization',
    'Talent',
    'Infrastructure',
  ];

  const filteredCases = useMemo(() => {
    return caseStudiesData.filter((c) => {
      const matchesCategory =
        activeFilter === 'All' ||
        c.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.company.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.challenge.toLowerCase().includes(q) ||
        c.lesson.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1F2933] pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-[0.24em] text-[#85590A] font-semibold block mb-3">
            ✦ THE HARBOUR · EMPIRICAL CASE EVIDENCE ✦
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#163C3A] mb-4">
            Landmark Analytics Case Studies
          </h1>
          <p className="text-base text-[#667085] leading-relaxed">
            Real enterprise transformations demonstrating the principles of Chapters 7–11 from{' '}
            <em>Behind Every Good Decision</em>. Verified outcomes, stakeholder dynamics, and concrete ROI.
          </p>
        </header>

        {/* Search Bar matching Moodboard */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative flex items-center bg-white rounded-[14px] border border-[#163C3A]/15 shadow-sm px-4 h-[50px] focus-within:border-[#2F6F8F] focus-within:ring-2 focus-within:ring-[#2F6F8F]/15 transition-all">
            <Search className="w-4 h-4 text-[#667085] mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case studies by company, challenge, or topic..."
              className="w-full bg-transparent text-xs text-[#1F2933] placeholder:text-[#667085]/60 outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#667085] hover:text-[#163C3A] p-1 font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          <Filter className="w-3.5 h-3.5 text-[#2F6F8F] mr-2" />
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeFilter === tag
                  ? 'bg-[#163C3A] text-white font-semibold shadow-md shadow-[#163C3A]/20'
                  : 'bg-white text-[#667085] border border-[#163C3A]/15 hover:border-[#163C3A]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Showing Count */}
        <div className="flex justify-between items-center text-xs font-mono text-[#667085] mb-6 pb-2 border-b border-[#EEF3F1]">
          <span>SHOWING {filteredCases.length} OF {caseStudiesData.length} CASE STUDIES</span>
          <span>CLICK ANY CARD FOR DEEP DIVE</span>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCases.map((cs) => {
            const relatedChapter = chaptersData.find((ch) => ch.slug === cs.relatedChapterSlug);
            return (
              <article
                key={cs.id}
                onClick={() => setSelectedCase(cs)}
                className="river-card p-6 md:p-8 flex flex-col justify-between group bg-white cursor-pointer hover:border-[#2F6F8F] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#85590A]">
                      {cs.company}
                    </span>
                    <div className="flex gap-1.5">
                      {cs.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#EEF3F1] text-[#163C3A] font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-2xl font-serif text-[#163C3A] mb-4 group-hover:text-[#2F6F8F] transition-colors">
                    {cs.headline}
                  </h2>

                  <div className="space-y-4 text-xs md:text-sm text-[#667085] mb-6">
                    <div>
                      <span className="text-xs uppercase font-mono text-[#163C3A] font-semibold block mb-1">
                        The Challenge
                      </span>
                      <p className="leading-relaxed line-clamp-3">{cs.challenge}</p>
                    </div>

                    <div className="bg-[#EEF3F1] p-4 rounded-xl border border-[#163C3A]/10">
                      <span className="text-xs uppercase font-mono text-[#163C3A] font-semibold block mb-1">
                        Verified Result
                      </span>
                      <p className="leading-relaxed text-[#163C3A] font-medium line-clamp-2">
                        {cs.result}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EEF3F1] space-y-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#667085] block">
                      Leadership Principle
                    </span>
                    <p className="font-serif italic text-sm md:text-base text-[#163C3A] line-clamp-2">
                      "{cs.lesson}"
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono">
                    {relatedChapter ? (
                      <span className="text-[#2F6F8F] flex items-center gap-1 font-semibold">
                        Ch. 0{relatedChapter.number} ({relatedChapter.regionName})
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[#163C3A] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                      Deep Dive <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CASE STUDY DEEP DIVE MODAL DIALOG */}
        {selectedCase && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCase(null);
            }}
          >
            <div className="bg-white rounded-3xl border border-[#163C3A]/20 shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#EEF3F1] pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#85590A] font-semibold block mb-1">
                    {selectedCase.company} · CASE DEEP DIVE
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif text-[#163C3A]">
                    {selectedCase.headline}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-2 rounded-full hover:bg-[#EEF3F1] text-[#667085] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {selectedCase.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-[#EEF3F1] text-[#163C3A] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="space-y-4 text-sm text-[#1F2933] leading-relaxed">
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#163C3A] font-semibold mb-1">
                    1. The Context & Business Challenge
                  </h4>
                  <p className="text-[#667085]">{selectedCase.challenge}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-[#163C3A] font-semibold mb-1">
                    2. The Quantitative Solution Implemented
                  </h4>
                  <p className="text-[#667085]">{selectedCase.whatHappened}</p>
                </div>

                <div className="bg-[#EEF3F1] p-4 rounded-xl border border-[#163C3A]/15">
                  <h4 className="text-xs font-mono uppercase text-[#163C3A] font-semibold mb-1">
                    3. Measured Commercial Return & Impact
                  </h4>
                  <p className="text-[#163C3A] font-medium">{selectedCase.result}</p>
                </div>

                <div className="bg-[#DDA6A0]/15 border-l-4 border-[#DDA6A0] p-4 rounded-r-xl">
                  <h4 className="text-xs font-mono uppercase text-[#A94A56] font-semibold mb-1">
                    4. Core Executive Takeaway
                  </h4>
                  <p className="font-serif italic text-base text-[#163C3A]">
                    "{selectedCase.lesson}"
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EEF3F1] flex justify-between items-center">
                <a
                  href={`/${selectedCase.relatedChapterSlug}/`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2F6F8F] hover:text-[#163C3A] font-semibold"
                >
                  Read Related Chapter <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedCase(null)}
                  className="bg-[#163C3A] text-white px-6 py-2 rounded-full text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#2F6F8F] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
