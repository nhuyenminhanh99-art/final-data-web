import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ChevronDown, Search, BookOpen, Waves, ArrowRight, Download } from 'lucide-react';
import { chaptersData } from '../../data/chaptersData';
import { journeyCopy } from '../../data/journeyCopy';
import { riverAudio } from '../scene/RiverAudio';
import { Base44LovableModal } from './Base44LovableModal';

interface NavbarProps {
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(riverAudio.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChaptersDropdownOpen, setIsChaptersDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-[#163C3A] text-[#FFFDF8] px-4 py-2 rounded-lg font-medium text-xs uppercase shadow-md focus:outline-none focus:ring-2 focus:ring-[#2F6F8F]"
      >
        {journeyCopy.navigation.skipToMain}
      </a>

      {/* Floating Pill Desktop Header */}
      <header
        className={`river-site-header fixed left-3 right-3 sm:left-6 sm:right-6 z-40 transition-all duration-300 ${
          isScrolled ? 'top-3 sm:top-4' : 'top-4 sm:top-6'
        }`}
      >
        <div
          className={`river-header-shell max-w-7xl mx-auto px-5 sm:px-7 rounded-[28px] border border-[#163C3A]/15 bg-[#FFFDF8]/90 backdrop-blur-[16px] shadow-sm flex items-center justify-between transition-all ${
            isScrolled ? 'h-12' : 'h-14 sm:h-16'
          }`}
        >
          {/* Logo / Title */}
          <a href="/" className="river-brand flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded-lg">
            <span className="river-brand-mark" aria-hidden="true"><Waves className="h-5 w-5" strokeWidth={1.35} /></span>
            <span className="flex flex-col leading-none">
              <span className="river-brand-overline font-serif text-[10px] text-[#85590A] tracking-[0.2em] uppercase">The River</span>
              <span className="river-brand-name font-serif text-[19px] tracking-[0.015em] text-[#163C3A] group-hover:text-[#2F6F8F] transition-colors font-medium">of Insights</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-sans uppercase tracking-[0.14em] font-medium">
            <a
              href="/"
              className={`transition-colors hover:text-[#163C3A] focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded ${
                currentPath === '/' ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1' : 'text-[#667085]'
              }`}
            >
              {journeyCopy.navigation.home}
            </a>

            <a
              href="/journey"
              className={`flex items-center gap-1.5 transition-colors hover:text-[#163C3A] focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded ${
                currentPath.startsWith('/journey')
                  ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1'
                  : 'text-[#667085]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6F8F]" />
              {journeyCopy.navigation.journey}
            </a>

            {/* Chapters Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsChaptersDropdownOpen(true)}
              onMouseLeave={() => setIsChaptersDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 py-2 transition-colors hover:text-[#163C3A] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded ${
                  currentPath.includes('analytics') || currentPath.includes('pitfalls') || currentPath.includes('making')
                    ? 'text-[#163C3A] font-bold'
                    : 'text-[#667085]'
                }`}
                aria-expanded={isChaptersDropdownOpen}
              >
                {journeyCopy.navigation.chapters} <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isChaptersDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white border border-[#163C3A]/15 rounded-2xl p-2.5 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {chaptersData.map((ch) => (
                    <a
                      key={ch.slug}
                      href={`/${ch.slug}/`}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-[#EEF3F1] text-[#1F2933] transition-colors focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
                    >
                      <span className="text-[#85590A] block text-[10px] font-semibold font-sans uppercase tracking-wider">
                        Ch. 0{ch.number} · {ch.regionName}
                      </span>
                      <div className="font-serif font-medium text-sm">{ch.title}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/case-studies/"
              className={`transition-colors hover:text-[#163C3A] focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded ${
                currentPath === '/case-studies/' ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1' : 'text-[#667085]'
              }`}
            >
              {journeyCopy.navigation.caseStudies}
            </a>

            <a
              href="/glossary/"
              className={`transition-colors hover:text-[#163C3A] focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded ${
                currentPath.startsWith('/glossary')
                  ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1'
                  : 'text-[#667085]'
              }`}
            >
              {journeyCopy.navigation.glossary}
            </a>

            <a
              href="/about/"
              className={`transition-colors hover:text-[#163C3A] focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded ${
                currentPath === '/about/' ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1' : 'text-[#667085]'
              }`}
            >
              {journeyCopy.navigation.about}
            </a>
          </nav>

          {/* Right Action buttons */}
          <div className="river-header-actions flex items-center space-x-2.5">
            {/* Open the product prompt and project guide */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="river-prompt-control hidden md:inline-flex items-center gap-2 h-9 px-3.5 rounded-full border border-[#163C3A]/15 bg-[#F2F7F5] hover:bg-[#E8EFEA] text-[#163C3A] text-xs font-sans font-semibold uppercase tracking-[0.14em] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
              title="Open the project prompt, source files, and usage guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#85590A]" />
              <span className="text-[10px]">Project Prompt</span>
            </button>

            {/* Search Icon button */}
            <a
              href="/glossary/"
              className="river-icon-control river-search-control w-9 h-9 rounded-full border border-[#163C3A]/12 flex items-center justify-center text-[#667085] hover:text-[#163C3A] hover:bg-white transition-all focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
              title="Search leadership terms and case studies"
              aria-label="Search glossary"
            >
              <Search className="w-4 h-4" />
            </a>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="river-icon-control river-sound-control w-9 h-9 rounded-full border border-[#163C3A]/12 flex items-center justify-center text-[#667085] hover:text-[#163C3A] hover:bg-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
              title={isAudioMuted ? journeyCopy.controls.audio.unmute : journeyCopy.controls.audio.mute}
              aria-label={journeyCopy.accessibility.audioToggleAria}
              aria-pressed={!isAudioMuted}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#2F6F8F]" />}
            </button>

            {/* "Begin Journey" Primary Pill Button */}
            <a
              href="/journey"
              className="river-entry-cta inline-flex items-center justify-center gap-2 h-9 px-4 sm:px-5 rounded-full bg-[#163C3A] text-[#FFFDF8] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#2F6F8F] transition-all shadow-md shadow-[#163C3A]/15 focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
            >
              {journeyCopy.navigation.getStarted}
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 river-entry-arrow" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="river-menu-control lg:hidden p-2 text-[#1F2933] hover:text-[#163C3A] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded-lg"
              aria-label={isMobileMenuOpen ? journeyCopy.accessibility.mobileMenuClose : journeyCopy.accessibility.mobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.6} /> : <Menu className="w-5 h-5" strokeWidth={1.6} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="river-mobile-menu fixed inset-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-xl lg:hidden flex flex-col p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-[#163C3A]/10">
            <span className="font-serif text-lg font-bold text-[#163C3A]">
              The River of Insights
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-[#667085] hover:text-[#1F2933] focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded-lg"
              aria-label={journeyCopy.accessibility.mobileMenuClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 py-6 space-y-4 overflow-y-auto">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xl font-serif text-[#163C3A] hover:text-[#2F6F8F] py-2 focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/glossary/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="river-mobile-search flex items-center gap-2 border-t border-[#163C3A]/10 pt-4 text-sm font-sans text-[#667085] hover:text-[#163C3A]"
            >
              <Search aria-hidden="true" className="h-4 w-4" /> Search the glossary
            </a>

            <button
              type="button"
              onClick={toggleSound}
              className="river-mobile-sound flex min-h-11 items-center gap-2 text-sm font-sans text-[#667085] hover:text-[#163C3A]"
              aria-label={journeyCopy.accessibility.audioToggleAria}
              aria-pressed={!isAudioMuted}
            >
              {isAudioMuted ? <VolumeX aria-hidden="true" className="h-4 w-4" /> : <Volume2 aria-hidden="true" className="h-4 w-4" />}
              {isAudioMuted ? journeyCopy.controls.audio.unmute : journeyCopy.controls.audio.mute}
            </button>

            <div className="pt-4 border-t border-[#163C3A]/10">
              <span className="text-xs font-sans uppercase text-[#85590A] tracking-wider block mb-2 font-bold">
                5 Chapters (7-11)
              </span>
              <div className="space-y-2">
                {chaptersData.map((ch) => (
                  <a
                    key={ch.slug}
                    href={`/${ch.slug}/`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm text-[#667085] hover:text-[#163C3A] py-1 focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded"
                  >
                    Ch. 0{ch.number} · {ch.title}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#163C3A]/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsExportModalOpen(true);
                }}
                className="w-full py-3 rounded-2xl bg-[#163C3A] text-[#FFFDF8] font-sans text-xs uppercase font-semibold flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
              >
                <Download className="w-4 h-4 text-[#C99A4B]" />
                <span>Project Prompt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <Base44LovableModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
};
