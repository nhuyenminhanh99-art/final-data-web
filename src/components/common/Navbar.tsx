import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Menu, X, ChevronDown, Search, BookOpen, Waves, ArrowRight, Download } from 'lucide-react';
import { chaptersData } from '../../data/chaptersData';
import { journeyCopy } from '../../data/journeyCopy';
import { riverAudio } from '../scene/RiverAudio';
import { Base44LovableModal } from './Base44LovableModal';

interface NavbarProps {
  currentPath: string;
}

const chapterThemeDots: Record<string, string> = {
  peach_village: '#C77E62',
  bamboo_forest: '#6B9A78',
  mountain_valley: '#728E98',
  lantern_bridge: '#D7A554',
  forgotten_garden: '#A45A59',
};

export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(riverAudio.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChaptersDropdownOpen, setIsChaptersDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const chaptersMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollFrame = 0;
    const handleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const nextScrolled = window.scrollY > 20;
        setIsScrolled((current) => current === nextScrolled ? current : nextScrolled);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!chaptersMenuRef.current?.contains(event.target as Node)) setIsChaptersDropdownOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsChaptersDropdownOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const toggleSound = () => {
    riverAudio.start();
    const muted = riverAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  const navLinks = [
    { label: journeyCopy.navigation.home, href: '/' },
    { label: journeyCopy.navigation.journey, href: '/journey' },
    { label: journeyCopy.navigation.caseStudies, href: '/case-studies/' },
    { label: journeyCopy.navigation.glossary, href: '/glossary/' },
    { label: journeyCopy.navigation.about, href: '/about/' },
  ];

  const isChapterActive = currentPath.includes('analytics') || currentPath.includes('pitfalls') || currentPath.includes('making');
  const focusChapterItem = (index: number) => {
    const items = chaptersMenuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
    items?.[Math.max(0, Math.min(index, (items.length || 1) - 1))]?.focus();
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-[#163C3A] text-[#FFFDF8] px-4 py-2 rounded-lg font-medium text-xs uppercase shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8A66A]"
      >
        {journeyCopy.navigation.skipToMain}
      </a>

      <header className={`river-site-header sticky top-3 sm:top-4 z-40 px-3 sm:px-6 transition-all duration-300 ${isScrolled ? 'river-site-header--scrolled' : ''}`}>
        <div className="river-header-shell max-w-[118rem] mx-auto px-4 sm:px-6 lg:px-7 rounded-[28px] border flex items-center justify-between transition-all">
          <a href="/" className="river-brand flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A66A] rounded-lg shrink-0" aria-label="The River of Insights home">
            <span className="river-brand-mark" aria-hidden="true"><Waves className="h-5 w-5" strokeWidth={1.35} /></span>
            <span className="flex flex-col leading-none">
              <span className="river-brand-overline font-serif text-[10px] text-[#85590A] tracking-[0.2em] uppercase">The River</span>
              <span className="river-brand-name font-serif text-[19px] tracking-[0.015em] text-[#163C3A] group-hover:text-[#2F6F8F] transition-colors font-medium">of Insights</span>
            </span>
          </a>

          <nav aria-label="Primary navigation" className="river-desktop-nav hidden lg:flex items-center font-sans font-medium">
            <a href="/" className={`river-nav-item ${currentPath === '/' ? 'is-active' : ''}`}><span className="river-nav-label">{journeyCopy.navigation.home}</span></a>
            <a href="/journey" className={`river-nav-item ${currentPath.startsWith('/journey') ? 'is-active' : ''}`}><span className="river-nav-label">{journeyCopy.navigation.journey}</span></a>

            <div
              ref={chaptersMenuRef}
              className="river-chapters-menu relative"
              onMouseEnter={() => setIsChaptersDropdownOpen(true)}
              onMouseLeave={() => setIsChaptersDropdownOpen(false)}
            >
              <button
                type="button"
                className={`river-nav-item river-chapters-trigger ${isChapterActive ? 'is-active' : ''}`}
                aria-haspopup="menu"
                aria-expanded={isChaptersDropdownOpen}
                onClick={() => setIsChaptersDropdownOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setIsChaptersDropdownOpen(true);
                    requestAnimationFrame(() => focusChapterItem(0));
                  }
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setIsChaptersDropdownOpen(true);
                    requestAnimationFrame(() => focusChapterItem(chaptersData.length - 1));
                  }
                }}
              >
                <span className="river-nav-label">{journeyCopy.navigation.chapters}</span>
                <ChevronDown aria-hidden="true" className={`river-chapters-chevron w-3.5 h-3.5 ${isChaptersDropdownOpen ? 'is-open' : ''}`} />
              </button>

              {isChaptersDropdownOpen && (
                <div className="river-chapters-dropdown absolute top-[calc(100%+0.6rem)] left-0 w-80 rounded-2xl p-2.5 space-y-1" role="menu" aria-label="Chapters">
                  {chaptersData.map((ch, index) => (
                    <a
                      key={ch.slug}
                      href={`/${ch.slug}/`}
                      role="menuitem"
                      className="river-chapter-menu-item block px-3 py-2.5 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#C8A66A]"
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown') { event.preventDefault(); focusChapterItem(index + 1); }
                        if (event.key === 'ArrowUp') { event.preventDefault(); focusChapterItem(index - 1); }
                        if (event.key === 'Escape') { event.preventDefault(); setIsChaptersDropdownOpen(false); }
                      }}
                    >
                      <span className="flex items-center gap-2 text-[10px] font-semibold font-sans uppercase tracking-wider text-[#85590A]">
                        <span className="river-chapter-dot" style={{ backgroundColor: chapterThemeDots[ch.regionPreset] || '#C8A66A' }} aria-hidden="true" />
                        <span>Ch. {ch.number} · {ch.regionName}</span>
                      </span>
                      <span className="font-serif font-medium text-[15px] text-[#163C3A]">{ch.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/case-studies/" className={`river-nav-item ${currentPath === '/case-studies/' ? 'is-active' : ''}`}><span className="river-nav-label">{journeyCopy.navigation.caseStudies}</span></a>
            <a href="/glossary/" className={`river-nav-item ${currentPath.startsWith('/glossary') ? 'is-active' : ''}`}><span className="river-nav-label">{journeyCopy.navigation.glossary}</span></a>
            <a href="/about/" className={`river-nav-item ${currentPath === '/about/' ? 'is-active' : ''}`}><span className="river-nav-label">{journeyCopy.navigation.about}</span></a>
          </nav>

          <div className="river-header-actions flex items-center gap-2 shrink-0">
            <span className="river-action-divider hidden lg:block" aria-hidden="true" />
            <button onClick={() => setIsExportModalOpen(true)} className="river-prompt-control hidden md:inline-flex items-center gap-2 h-9 px-3.5 rounded-full border text-xs font-sans font-semibold uppercase tracking-[0.14em] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C8A66A]" title="Open the project prompt, source files, and usage guide">
              <BookOpen aria-hidden="true" className="w-3.5 h-3.5 text-[#85590A]" />
              <span className="text-[10px]">Project Prompt</span>
            </button>
            <a href="/glossary/" className="river-icon-control river-search-control" title="Search leadership terms and case studies" aria-label="Search glossary"><Search className="w-4 h-4" /></a>
            <button onClick={toggleSound} className="river-icon-control river-sound-control" title={isAudioMuted ? journeyCopy.controls.audio.unmute : journeyCopy.controls.audio.mute} aria-label={journeyCopy.accessibility.audioToggleAria} aria-pressed={!isAudioMuted}>
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#2F6F8F]" />}
            </button>
            <a href="/journey" className="river-entry-cta inline-flex items-center justify-center gap-2 h-9 px-4 sm:px-5 rounded-full text-xs uppercase tracking-wider font-semibold focus-visible:ring-2 focus-visible:ring-[#C8A66A]">
              {journeyCopy.navigation.getStarted}<ArrowRight aria-hidden="true" className="h-3.5 w-3.5 river-entry-arrow" />
            </a>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="river-menu-control lg:hidden" aria-label={isMobileMenuOpen ? journeyCopy.accessibility.mobileMenuClose : journeyCopy.accessibility.mobileMenuOpen} aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.6} /> : <Menu className="w-5 h-5" strokeWidth={1.6} />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="river-mobile-menu fixed inset-0 z-50 lg:hidden flex flex-col p-6 animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="flex items-center justify-between pb-6 border-b border-[#163C3A]/10">
            <span className="font-serif text-lg font-bold text-[#163C3A]">The River of Insights</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="river-menu-control" aria-label={journeyCopy.accessibility.mobileMenuClose}><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 py-6 space-y-2 overflow-y-auto">
            {navLinks.slice(0, 2).map((link) => <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="river-mobile-nav-link"><span className="river-nav-label">{link.label}</span></a>)}
            <details className="river-mobile-chapters group">
              <summary className="river-mobile-nav-link list-none cursor-pointer flex items-center justify-between"><span className="river-nav-label">{journeyCopy.navigation.chapters}</span><ChevronDown aria-hidden="true" className="w-5 h-5 transition-transform group-open:rotate-180" /></summary>
              <div className="pl-3 pt-2 space-y-1">
                {chaptersData.map((ch) => <a key={ch.slug} href={`/${ch.slug}/`} onClick={() => setIsMobileMenuOpen(false)} className="river-mobile-chapter-link"><span className="river-chapter-dot" style={{ backgroundColor: chapterThemeDots[ch.regionPreset] || '#C8A66A' }} aria-hidden="true" /> Ch. {ch.number} · {ch.title}</a>)}
              </div>
            </details>
            {navLinks.slice(2).map((link) => <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="river-mobile-nav-link"><span className="river-nav-label">{link.label}</span></a>)}
            <div className="pt-4 border-t border-[#163C3A]/10 flex flex-col gap-2">
              <a href="/glossary/" onClick={() => setIsMobileMenuOpen(false)} className="river-mobile-action"><Search aria-hidden="true" className="h-4 w-4" /> Search the glossary</a>
              <button type="button" onClick={toggleSound} className="river-mobile-action"><Volume2 aria-hidden="true" className="h-4 w-4" /> {isAudioMuted ? journeyCopy.controls.audio.unmute : journeyCopy.controls.audio.mute}</button>
              <button onClick={() => { setIsMobileMenuOpen(false); setIsExportModalOpen(true); }} className="river-mobile-prompt"><Download aria-hidden="true" className="w-4 h-4 text-[#C8A66A]" /><span>Project Prompt</span></button>
            </div>
          </div>
        </div>
      )}

      <Base44LovableModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </>
  );
};
