import React from 'react';
import { CHAPTER_REGISTRY, CanonicalChapterId } from '../../data/chapterRegistry';

interface MiniMapProps {
  currentProgress: number;
  activeChapterId?: CanonicalChapterId;
  onJumpTo: (chapterId: CanonicalChapterId) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({ currentProgress, activeChapterId, onJumpTo }) => {
  // Find nearest stop for active label
  const nearest = CHAPTER_REGISTRY.reduce((prev, curr) =>
    Math.abs(curr.targetU - currentProgress) < Math.abs(prev.targetU - currentProgress) ? curr : prev
  );

  return (
    <nav
      aria-label="River Journey Progress Map"
      className="journey-minimap fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center py-6 px-3"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#85590A] font-semibold -rotate-90 my-4 select-none whitespace-nowrap">
        {nearest.regionName}
      </span>

      <div className="journey-minimap-rail relative h-48 w-1.5 rounded-full my-2 flex flex-col justify-between items-center">
        {/* Fill bar */}
        <div
          className="absolute top-0 left-0 w-full bg-[#1F4F4B] rounded-full transition-all duration-150"
          style={{ height: `${Math.min(Math.max((currentProgress / 0.35) * 100, 0), 100)}%` }}
        />

        {/* Clickable stop dots for the 5 Canonical Journey Chapters */}
        {CHAPTER_REGISTRY.map((entry) => {
          const isActive =
            activeChapterId === entry.id ||
            Math.abs(currentProgress - entry.targetU) < 0.022;

          return (
            <button
              key={entry.id}
              onClick={() => onJumpTo(entry.id)}
              className={`journey-minimap-stop group relative z-10 w-4 h-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#1F4F4B] cursor-pointer ${
                isActive
                  ? 'bg-[#1F4F4B] ring-4 ring-[#2F6F6A]/25 scale-125'
                  : 'bg-white border-2 border-[#8E9C96] hover:border-[#1F4F4B]'
              }`}
              title={`Sail to Chapter ${entry.chapterNumber}: ${entry.title}`}
              aria-label={`Sail to Chapter ${entry.chapterNumber}: ${entry.title}`}
            >
              <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-white text-[#1E2B26] text-[11px] font-mono px-2 py-0.5 rounded border border-[#2F6F6A]/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md font-medium">
                Ch. {entry.chapterNumber}: {entry.regionName}
              </span>
            </button>
          );
        })}
      </div>

      <span className="text-[10px] font-mono text-[#4F5E57] mt-2 select-none font-semibold">
        Ch. {nearest.chapterNumber}
      </span>
    </nav>
  );
};

