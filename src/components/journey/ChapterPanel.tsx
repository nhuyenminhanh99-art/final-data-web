import React, { useEffect, useRef } from 'react';
import { Chapter } from '../../types';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { X, ExternalLink } from 'lucide-react';

interface ChapterPanelProps {
  chapter: Chapter | null;
  onClose: () => void;
}

export const ChapterPanel: React.FC<ChapterPanelProps> = ({ chapter, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!chapter) return;

    // Focus management
    closeButtonRef.current?.focus();

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [chapter, onClose]);

  if (!chapter) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-panel-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/35 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="w-full md:w-[50vw] max-w-2xl h-full bg-white/96 border-l border-[#2F6F6A]/20 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header bar */}
        <div className="p-6 border-b border-[#D5E2DE] flex items-center justify-between bg-[#E8EFEA] shrink-0">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#85590A] block font-semibold">
              {chapter.kicker}
            </span>
            <h2 id="chapter-panel-title" className="text-2xl font-serif text-[#1E2B26]">
              {chapter.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/${chapter.slug}/`}
              className="text-xs font-mono uppercase tracking-wider text-[#1F4F4B] hover:text-[#2F6F6A] flex items-center gap-1.5 border border-[#2F6F6A]/30 bg-white px-3 py-1.5 rounded-full transition-colors shadow-sm"
              title="Open canonical full-page article"
            >
              Full Page <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-[#4F5E57] hover:text-[#1E2B26] rounded-full hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F6F6A] cursor-pointer"
              aria-label="Close chapter panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white">
          <BlockRenderer blocks={chapter.blocks} />

          <div className="pt-8 border-t border-[#D5E2DE] text-center">
            <a
              href={`/${chapter.slug}/`}
              className="inline-flex items-center gap-2 bg-[#1F4F4B] text-[#F7F3EA] px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#2F6F6A] transition-all shadow-md shadow-[#1F4F4B]/20 cursor-pointer"
            >
              Read Canonical Full Page Article <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
