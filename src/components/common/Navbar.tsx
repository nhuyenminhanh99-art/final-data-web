import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ChevronDown, Search } from 'lucide-react';
import { chaptersData } from '../../data/chaptersData';
import { riverAudio } from '../scene/RiverAudio';

interface NavbarProps {
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(riverAudio.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChaptersDropdownOpen, setIsChaptersDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    { label: 'Home', href: '/' },
    { label: 'Journey', href: '/journey' },
    { label: 'Case Studies', href: '/case-studies/' },
    { label: 'Glossary', href: '/glossary/' },
    { label: 'About', href: '/about/' },
  ];

  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-[#163C3A] text-[#FFFDF8] px-4 py-2 rounded-lg font-medium text-xs uppercase shadow-md"
      >
        Skip to main content
      </a>

      {/* Floating Pill Desktop Header matching Moodboard */}
      <header
        className={`fixed left-4 right-4 sm:left-8 sm:right-8 z-40 transition-all duration-300 ${
          isScrolled ? 'top-3 sm:top-4' : 'top-4 sm:top-6'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-5 sm:px-7 rounded-[28px] border border-[#163C3A]/15 bg-[#FFFDF8]/85 backdrop-blur-[16px] shadow-sm flex items-center justify-between transition-all ${
            isScrolled ? 'h-12' : 'h-14 sm:h-16'
          }`}
        >
          {/* Logo / Title: Two Lines like Moodboard */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-2.5 h-2.5 rounded-full bg-[#163C3A] group-hover:bg-[#2F6F8F] group-hover:scale-125 transition-all" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xs text-[#85590A] tracking-wider uppercase">
                The River
              </span>
              <span className="font-serif text-lg tracking-wide text-[#163C3A] group-hover:text-[#2F6F8F] transition-colors font-medium">
                of Insights
              </span>
            </div>
          </a>

          {/* Desktop Navigation matching Moodboard */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-mono uppercase tracking-wider">
            <a
              href="/"
              className={`transition-colors hover:text-[#163C3A] ${
                currentPath === '/' ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1' : 'text-[#667085]'
              }`}
            >
              Home
            </a>

            <a
              href="/journey"
              className={`flex items-center gap-1.5 transition-colors hover:text-[#163C3A] ${
                currentPath.startsWith('/journey')
                  ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1'
                  : 'text-[#667085]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6F8F]" />
              Journey
            </a>

            {/* Chapters Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsChaptersDropdownOpen(true)}
              onMouseLeave={() => setIsChaptersDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 py-2 transition-colors hover:text-[#163C3A] cursor-pointer ${
                  currentPath.includes('analytics') || currentPath.includes('pitfalls') || currentPath.includes('making')
                    ? 'text-[#163C3A] font-bold'
                    : 'text-[#667085]'
                }`}
                aria-expanded={isChaptersDropdownOpen}
              >
                Chapters <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isChaptersDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-[#163C3A]/15 rounded-2xl p-2.5 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {chaptersData.map((ch) => (
                    <a
                      key={ch.slug}
                      href={`/${ch.slug}/`}
                      className="block px-3 py-2 rounded-xl text-xs hover:bg-[#EEF3F1] text-[#1F2933] transition-colors"
                    >
                      <span className="text-[#85590A] block text-[10px] font-semibold">
                        Ch. 0{ch.number} · {ch.regionName}
                      </span>
                      {ch.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/case-studies/"
              className={`transition-colors hover:text-[#163C3A] ${
                currentPath === '/case-studies/' ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1' : 'text-[#667085]'
              }`}
            >
              Case Studies
            </a>

            <a
              href="/glossary/"
              className={`transition-colors hover:text-[#163C3A] ${
                currentPath.startsWith('/glossary')
                  ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1'
                  : 'text-[#667085]'
              }`}
            >
              Glossary
            </a>

            <a
              href="/about/"
              className={`transition-colors hover:text-[#163C3A] ${
                currentPath === '/about/' ? 'text-[#163C3A] font-bold border-b-2 border-[#163C3A] pb-1' : 'text-[#667085]'
              }`}
            >
              About
            </a>
          </nav>

          {/* Right Action buttons matching Moodboard: Search + Audio + Get Started Button */}
          <div className="flex items-center space-x-3">
            {/* Search Icon button */}
            <a
              href="/glossary/"
              className="w-10 h-10 rounded-full border border-[#163C3A]/15 flex items-center justify-center text-[#667085] hover:text-[#163C3A] hover:bg-white transition-all shadow-sm"
              title="Search terms and case studies"
            >
              <Search className="w-4 h-4" />
            </a>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="w-10 h-10 rounded-full border border-[#163C3A]/15 flex items-center justify-center text-[#667085] hover:text-[#163C3A] hover:bg-white transition-all cursor-pointer shadow-sm"
              title={isAudioMuted ? 'Unmute river flow' : 'Mute river flow'}
              aria-label={isAudioMuted ? 'Unmute river flow' : 'Mute river flow'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#2F6F8F]" />}
            </button>

            {/* "Get Started" Primary Pill Button matching Moodboard */}
            <a
              href="/journey"
              className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#163C3A] text-[#FFFDF8] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#2F6F8F] transition-all shadow-md shadow-[#163C3A]/15"
            >
              Get Started
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#1F2933] hover:text-[#163C3A]"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#FFFDF8]/98 pt-24 px-6 pb-12 flex flex-col justify-between lg:hidden animate-in fade-in duration-200">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#85590A] block mb-2 font-semibold">
              Navigation
            </span>
            <div className="space-y-4 text-2xl font-serif">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#163C3A] hover:text-[#2F6F8F] transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-[#163C3A]/15">
              <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#85590A] block mb-3 font-semibold">
                Chapters
              </span>
              <div className="space-y-3">
                {chaptersData.map((ch) => (
                  <a
                    key={ch.slug}
                    href={`/${ch.slug}/`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm text-[#667085] hover:text-[#163C3A]"
                  >
                    <span className="text-xs text-[#2F6F8F] font-mono mr-2 font-semibold">
                      Ch. 0{ch.number}
                    </span>
                    {ch.title}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#163C3A]/15 flex items-center justify-between text-xs font-mono text-[#667085]">
            <span>The River of Insights</span>
            <a
              href="/journey"
              className="bg-[#163C3A] text-white px-5 py-2 rounded-full font-semibold"
            >
              Start Journey
            </a>
          </div>
        </div>
      )}
    </>
  );
};
