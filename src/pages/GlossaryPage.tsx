import React, { useState, useMemo } from 'react';
import { glossaryTerms, GlossaryTerm } from '../data/glossaryData';
import {
  Search,
  SlidersHorizontal,
  Volume2,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Check,
  Copy,
} from 'lucide-react';

export const GlossaryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [activeTermId, setActiveTermId] = useState<string>(glossaryTerms[0].id);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories = ['All', 'Leadership', 'Analytics', 'Data', 'Organization', 'Execution', 'Business'];

  // Toggle bookmark (in-memory/session)
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Pronounce term via Web Speech API
  const speakTerm = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy definition
  const copyDefinition = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  // Filter terms
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((item) => {
      if (showBookmarksOnly && !bookmarkedIds[item.id]) return false;
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.term.toLowerCase().includes(q) ||
        item.vietnamese.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, showBookmarksOnly, bookmarkedIds]);

  const activeTerm =
    glossaryTerms.find((t) => t.id === activeTermId) || filteredTerms[0] || glossaryTerms[0];

  const bookmarkedCount = Object.values(bookmarkedIds).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1F2933] pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-[0.24em] text-[#85590A] font-semibold block mb-2">
            ✦ LEADERSHIP DICTIONARY · TỪ ĐIỂN THUẬT NGỮ ✦
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#163C3A] mb-4">
            Analytics Leadership Glossary
          </h1>
          <p className="text-base text-[#667085] leading-relaxed">
            Core definitions, frameworks, and bilingual vocabulary from <em>Behind Every Good Decision</em>.
            Every definition is grounded strictly in source concepts.
          </p>
        </header>

        {/* Search Bar matching Moodboard */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white rounded-[14px] border border-[#163C3A]/15 shadow-sm px-4 h-[52px] focus-within:border-[#2F6F8F] focus-within:ring-2 focus-within:ring-[#2F6F8F]/15 transition-all">
            <Search className="w-5 h-5 text-[#667085] mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms or Vietnamese equivalent (e.g., Big Rocks, Stakeholder, HiPPO)..."
              className="w-full bg-transparent text-sm text-[#1F2933] placeholder:text-[#667085]/60 outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#667085] hover:text-[#163C3A] px-2 font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips + Bookmarks Toggle */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat && !showBookmarksOnly;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowBookmarksOnly(false);
                }}
                className={`h-10 px-4 rounded-full text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#163C3A] text-[#FFFDF8] font-semibold shadow-sm'
                    : 'bg-[#FFFDF8] text-[#667085] border border-[#163C3A]/20 hover:border-[#163C3A] hover:text-[#1F2933]'
                }`}
              >
                {isActive && <Check className="w-3.5 h-3.5 text-[#C99A4B]" />}
                {cat}
              </button>
            );
          })}

          {/* Bookmarked Filter Pill */}
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`h-10 px-4 rounded-full text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              showBookmarksOnly
                ? 'bg-[#C99A4B] text-white font-semibold shadow-sm'
                : 'bg-white text-[#85590A] border border-[#C99A4B]/40 hover:bg-[#EEF3F1]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved Bookmarks ({bookmarkedCount})
          </button>
        </div>

        {/* Two-Column Layout: Terms List (Left) + Detail Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Terms List */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#667085] pb-2 border-b border-[#EEF3F1]">
              <span>SHOWING {filteredTerms.length} TERMS</span>
              <span className="text-[#85590A] font-semibold">CLICK TO VIEW DETAIL</span>
            </div>

            {filteredTerms.length === 0 ? (
              <div className="river-card p-8 text-center text-[#667085] text-sm">
                No matching terminology found.
              </div>
            ) : (
              <div className="divide-y divide-[#EEF3F1] border border-[#163C3A]/10 rounded-2xl bg-white overflow-hidden shadow-sm">
                {filteredTerms.map((item) => {
                  const isSelected = activeTerm.id === item.id;
                  const isSaved = !!bookmarkedIds[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTermId(item.id)}
                      className={`w-full text-left p-4 flex items-center justify-between gap-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EEF3F1] border-l-4 border-l-[#163C3A]'
                          : 'hover:bg-[#FFFDF8]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-serif text-lg text-[#163C3A] font-medium">
                            {item.term}
                          </span>
                          <span className="text-[11px] font-mono text-[#667085] italic">
                            ({item.partOfSpeech})
                          </span>
                          {isSaved && (
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#C99A4B] fill-[#C99A4B]" />
                          )}
                        </div>
                        <span className="text-xs text-[#2F6F8F] font-sans">
                          {item.vietnamese}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'text-[#163C3A] translate-x-1' : 'text-[#667085]/40'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Term Detail Card matching Moodboard */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="river-card p-6 md:p-8 bg-white border border-[#163C3A]/15 shadow-lg">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#EEF3F1]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#85590A] font-semibold">
                      {activeTerm.category}
                    </span>
                    <span className="text-xs text-[#667085]">·</span>
                    <span className="text-xs font-mono text-[#667085] italic">
                      {activeTerm.partOfSpeech}
                    </span>
                  </div>
                  <h2 className="text-3xl font-serif text-[#163C3A]">{activeTerm.term}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakTerm(activeTerm.term)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      isSpeaking
                        ? 'bg-[#2F6F8F] text-white border-[#2F6F8F] animate-pulse'
                        : 'border-[#163C3A]/20 hover:bg-[#EEF3F1] text-[#163C3A]'
                    }`}
                    title="Pronounce term"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleBookmark(activeTerm.id)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      bookmarkedIds[activeTerm.id]
                        ? 'bg-[#163C3A] text-white border-[#163C3A]'
                        : 'border-[#163C3A]/20 hover:bg-[#EEF3F1] text-[#163C3A]'
                    }`}
                    title="Bookmark this term"
                  >
                    {bookmarkedIds[activeTerm.id] ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* English Definition */}
              <div className="space-y-4 text-sm leading-relaxed text-[#1F2933] mb-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#667085]">
                      English Definition (Source Grounded)
                    </span>
                    <button
                      onClick={() => copyDefinition(activeTerm.definition)}
                      className="text-[11px] font-mono text-[#2F6F8F] hover:text-[#163C3A] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedNotice ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-base text-[#1F2933] leading-relaxed">
                    {activeTerm.definition}
                  </p>
                </div>

                {/* Peach-tinted Vietnamese Definition Box matching Moodboard */}
                <div className="bg-[#DDA6A0]/15 border-l-4 border-[#DDA6A0] p-4 rounded-r-xl">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#A94A56] font-semibold block mb-1">
                    Tiếng Việt · Nghĩa ngữ cảnh
                  </span>
                  <p className="text-base text-[#163C3A] font-medium leading-relaxed">
                    {activeTerm.vietnamese}
                  </p>
                </div>

                <div className="text-xs font-mono text-[#667085] flex items-center gap-1.5 pt-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#2F6F8F]" />
                  <span>Appears in: {activeTerm.sourceContext}</span>
                </div>
              </div>

              {/* Related Terms */}
              <div className="pt-4 border-t border-[#EEF3F1]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#667085] block mb-2 font-semibold">
                  Related Concepts
                </span>
                <div className="flex gap-2 flex-wrap">
                  {activeTerm.relatedTerms.map((rt) => (
                    <button
                      key={rt}
                      onClick={() => {
                        const target = glossaryTerms.find(
                          (t) => t.term.toLowerCase() === rt.toLowerCase()
                        );
                        if (target) setActiveTermId(target.id);
                        else setSearchQuery(rt);
                      }}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-[#EEF3F1] text-[#163C3A] hover:bg-[#2F6F8F] hover:text-white transition-colors cursor-pointer"
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
