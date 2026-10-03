import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RiverCanvas } from '../components/scene/RiverCanvas';
import { LiteJourney } from '../components/scene/LiteJourney';
import { ChapterPanel } from '../components/journey/ChapterPanel';
import { MiniMap } from '../components/journey/MiniMap';
import { chaptersData } from '../data/chaptersData';
import { Chapter } from '../types';
import { riverAudio } from '../components/scene/RiverAudio';
import {
  Volume2,
  VolumeX,
  Layers,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

interface JourneyPageProps {
  initialChapterSlug?: string;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ initialChapterSlug }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [useLiteMode, setUseLiteMode] = useState(false);
  const [isMuted, setIsMuted] = useState(riverAudio.getMuted());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize audio context
  useEffect(() => {
    riverAudio.start();
  }, []);

  // Handle deep link if chapter slug provided
  useEffect(() => {
    if (initialChapterSlug) {
      const match = chaptersData.find((c) => c.slug === initialChapterSlug);
      if (match) {
        setActiveChapter(match);
      }
    }
  }, [initialChapterSlug]);

  // Scroll tracking to calculate normalized progress [0.0, 1.0]
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    const current = el.scrollTop / maxScroll;
    setScrollProgress(Math.min(Math.max(current, 0), 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = scrollContainerRef.current;
      if (!el || activeChapter) return;

      const step = 250;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        el.scrollBy({ top: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        el.scrollBy({ top: -step, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChapter]);

  // Mini-map jump
  const handleJumpTo = (targetProgress: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top: targetProgress * maxScroll, behavior: 'smooth' });
  };

  const handleOpenChapterByNumber = (chapterNumber: number) => {
    const ch = chaptersData.find((c) => c.number === chapterNumber);
    if (ch) {
      setActiveChapter(ch);
      window.history.pushState(null, '', `/journey/${ch.slug}`);
    }
  };

  const handleClosePanel = () => {
    setActiveChapter(null);
    window.history.pushState(null, '', '/journey');
  };

  const toggleSound = () => {
    const muted = riverAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F7F3EA] text-[#1E2B26] select-none">
      {/* 3D WebGL Canvas Layer with Realistic Graphics or 2D Lite Journey Fallback */}
      {!useLiteMode ? (
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <RiverCanvas
            progress={scrollProgress}
            onReachStop={handleOpenChapterByNumber}
            qualityTier="high"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 overflow-y-auto">
          <LiteJourney
            progress={scrollProgress}
            onOpenChapter={handleOpenChapterByNumber}
          />
        </div>
      )}

      {/* Virtual 700vh Scroll Rig when in 3D mode */}
      {!useLiteMode && (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 z-10 overflow-y-scroll pointer-events-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Scroll Track: ~700vh */}
          <div className="h-[750vh] w-full" />
        </div>
      )}

      {/* Mini-Map progress bar along river */}
      <MiniMap currentProgress={scrollProgress} onJumpTo={handleJumpTo} />

      {/* Top Floating Control Bar - Styled for Bright Spring Morning */}
      <header className="fixed top-4 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <a
          href="/"
          className="pointer-events-auto bg-white/90 backdrop-blur-md border border-[#2F6F6A]/25 text-[#1E2B26] hover:text-[#1F4F4B] hover:border-[#1F4F4B] px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#2F6F6A]" /> Return Home
        </a>

        <div className="flex items-center gap-3 pointer-events-auto">
          {/* 3D / 2D Lite Toggle */}
          <button
            onClick={() => setUseLiteMode(!useLiteMode)}
            className="bg-white/90 backdrop-blur-md border border-[#2F6F6A]/25 text-[#4F5E57] hover:text-[#1F4F4B] hover:border-[#1F4F4B] px-3.5 py-2 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Toggle between 3D Canvas and 2D Lite mode"
          >
            <Layers className="w-3.5 h-3.5 text-[#2F6F6A]" />
            <span className="hidden sm:inline">{useLiteMode ? 'Switch to 3D' : '2D Lite Mode'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 bg-white/90 backdrop-blur-md border border-[#2F6F6A]/25 text-[#4F5E57] hover:text-[#1F4F4B] hover:border-[#1F4F4B] rounded-full transition-colors cursor-pointer shadow-sm"
            title={isMuted ? 'Unmute river flow' : 'Mute river flow'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#2F6F6A]" />}
          </button>

          {/* Canonical Text Version Quick Link */}
          <a
            href="/analytics-leadership/"
            className="hidden md:flex bg-white/90 backdrop-blur-md border border-[#2F6F6A]/25 text-[#1E2B26] hover:text-[#1F4F4B] px-4 py-2 rounded-full text-xs font-mono uppercase items-center gap-1.5 transition-colors shadow-sm"
            title="Read canonical text page"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2F6F6A]" />
            <span>Text Version</span>
          </a>
        </div>
      </header>

      {/* Floating Instructions Banner at start of journey */}
      {scrollProgress < 0.05 && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-memory">
          <div className="bg-white/92 backdrop-blur-md border border-[#2F6F6A]/25 rounded-full px-6 py-2.5 text-center text-xs font-mono text-[#1E2B26] shadow-xl">
            Scroll or use <kbd className="text-[#1F4F4B] font-bold">↓</kbd> /{' '}
            <kbd className="text-[#1F4F4B] font-bold">Space</kbd> to row the boat along the river
          </div>
        </div>
      )}

      {/* Chapter Detail Side Drawer Modal */}
      <ChapterPanel chapter={activeChapter} onClose={handleClosePanel} />
    </div>
  );
};
