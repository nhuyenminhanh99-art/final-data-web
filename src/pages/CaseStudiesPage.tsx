import React, { useState } from 'react';
import { caseStudiesData } from '../data/caseStudiesData';
import { CaseStudy } from '../types';
import { chaptersData } from '../data/chaptersData';
import { Search, Filter, ArrowRight, ExternalLink, X } from 'lucide-react';

export const CaseStudiesPage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTags = [
    'All',
    'Enterprise ROI',
    'Cross-functional',
    'Strategy',
    'Simulation',
    'Execution',
    'Governance',
  ];

  const filteredCases = caseStudiesData.filter((cs) => {
    const matchesFilter =
      activeFilter === 'All' ||
      cs.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase());
    const matchesSearch =
      searchQuery === '' ||
      cs.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.challenge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Schema.org structured data for Case Studies
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Landmark Analytics Leadership Case Studies',
    description: 'Empirical enterprise case studies verifying the framework of Behind Every Good Decision.',
    mainEntity: caseStudiesData.map((cs) => ({
      '@type': 'Article',
      name: `${cs.company}: ${cs.headline}`,
      description: cs.challenge,
    })),
  };

  return (
    <div className="site-editorial-page case-studies-page min-h-screen text-[#1F2933] pt-32 pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="site-page-intro max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-[0.18em] text-[#85590A] font-semibold block mb-3">
            The Harbour · Empirical Case Evidence
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#163C3A] font-normal mb-4 tracking-tight">
            Landmark Analytics Case Studies
          </h1>
          <p className="text-base sm:text-lg text-[#718096] leading-relaxed">
            Real enterprise transformations demonstrating the principles of Chapters 7–11 from{' '}
            <em>Behind Every Good Decision</em>. Verified outcomes, stakeholder dynamics, and concrete ROI.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative flex items-center bg-white rounded-2xl border border-[#163C3A]/15 shadow-sm px-4 h-[52px] focus-within:border-[#2F6F8F] focus-within:ring-2 focus-within:ring-[#2F6F8F]/15 transition-all">
            <Search className="w-4 h-4 text-[#718096] mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case studies by company, challenge, or topic..."
              className="w-full bg-transparent text-xs text-[#1F2933] placeholder:text-[#718096]/60 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#718096] hover:text-[#163C3A] p-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap mb-14">
          <Filter className="w-3.5 h-3.5 text-[#2F6F8F] mr-1 shrink-0" />
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-full text-xs tracking-wider transition-all cursor-pointer ${
                activeFilter === tag
                  ? 'bg-[#163C3A] text-white font-semibold shadow-sm'
                  : 'bg-white text-[#718096] border border-[#163C3A]/15 hover:border-[#163C3A]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Showing Count */}
        <div className="flex justify-between items-center text-xs text-[#718096] mb-10 pb-4 border-b border-[#163C3A]/10">
          <span className="uppercase tracking-wider font-medium">Showing {filteredCases.length} of {caseStudiesData.length} case studies</span>
          <span>Click any card for deep dive</span>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
          {filteredCases.map((cs) => {
            const relatedChapter = chaptersData.find((ch) => ch.slug === cs.relatedChapterSlug);
            return (
              <article
                key={cs.id}
                onClick={() => setSelectedCase(cs)}
                className="case-study-card river-card p-8 sm:p-10 md:p-12 flex flex-col justify-between group cursor-pointer hover:border-[#2F6F8F] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#85590A]">
                      {cs.company}
                    </span>
                    <div className="flex gap-1.5">
                      {cs.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#EEF3F1] text-[#163C3A] uppercase tracking-wider font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-2xl font-serif text-[#163C3A] font-normal mb-5 group-hover:text-[#2F6F8F] transition-colors leading-snug">
                    {cs.headline}
                  </h2>

                  <div className="space-y-5 text-xs md:text-sm text-[#718096] mb-7">
                    <div>
                      <span className="text-xs uppercase text-[#163C3A] font-semibold block mb-1.5">
                        The Challenge
                      </span>
                      <p className="leading-relaxed line-clamp-3 text-[#4A5568]">{cs.challenge}</p>
                    </div>

                    <div className="bg-[#EEF3F1] p-4 sm:p-5 rounded-xl border border-[#163C3A]/10">
                      <span className="text-xs uppercase text-[#163C3A] font-semibold block mb-1.5">
                        Verified Result
                      </span>
                      <p className="leading-relaxed text-[#163C3A] font-medium line-clamp-2">
                        {cs.result}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#163C3A]/10 space-y-3.5">
                  <div>
                    <span className="text-xs uppercase text-[#718096] font-semibold block mb-1.5">
                      Leadership Principle
                    </span>
                    <p className="font-serif italic text-base text-[#163C3A] line-clamp-2">
                      "{cs.lesson}"
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    {relatedChapter ? (
                      <span className="text-[#2F6F8F] flex items-center gap-1 font-semibold">
                        Ch. {relatedChapter.number} ({relatedChapter.regionName})
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
              <div className="flex items-start justify-between gap-4 border-b border-[#163C3A]/10 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.16em] text-[#85590A] font-semibold block mb-1">
                    {selectedCase.company} · Case Deep Dive
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif text-[#163C3A] font-normal leading-snug">
                    {selectedCase.headline}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-2 rounded-full hover:bg-[#EEF3F1] text-[#718096] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {selectedCase.tags.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-0.5 rounded bg-[#EEF3F1] text-[#163C3A] font-semibold uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="space-y-4 text-sm text-[#1F2933] leading-relaxed">
                <div>
                  <h4 className="text-xs uppercase text-[#163C3A] font-semibold mb-1">
                    1. The Context & Business Challenge
                  </h4>
                  <p className="text-[#4A5568]">{selectedCase.challenge}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-[#163C3A] font-semibold mb-1">
                    2. The Quantitative Solution Implemented
                  </h4>
                  <p className="text-[#4A5568]">{selectedCase.whatHappened}</p>
                </div>

                <div className="bg-[#EEF3F1] p-4 rounded-xl border border-[#163C3A]/15">
                  <h4 className="text-xs uppercase text-[#163C3A] font-semibold mb-1">
                    3. Measured Commercial Return & Impact
                  </h4>
                  <p className="text-[#163C3A] font-medium">{selectedCase.result}</p>
                </div>

                <div className="bg-[#FFF7F6] border-l-4 border-[#A94A56] p-4 rounded-r-xl">
                  <h4 className="text-xs uppercase text-[#A94A56] font-semibold mb-1">
                    4. Core Executive Takeaway
                  </h4>
                  <p className="font-serif italic text-base text-[#163C3A]">
                    "{selectedCase.lesson}"
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#163C3A]/10 flex justify-between items-center">
                <a
                  href={`/${selectedCase.relatedChapterSlug}/`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#2F6F8F] hover:text-[#163C3A] font-semibold"
                >
                  Read Related Chapter <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedCase(null)}
                  className="bg-[#163C3A] text-white px-6 py-2 rounded-full text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#2F6F8F] transition-colors"
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
