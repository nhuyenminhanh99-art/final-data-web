import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, Navigation, Compass } from 'lucide-react';

export interface SceneItem {
  id: string;
  label: string;
  type: 'fit' | 'flow';
  anchor: string;
  nextLabel?: string;
}

interface GuidedScrollRailProps {
  scenes: SceneItem[];
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  isGuidedMode: boolean;
  onToggleGuidedMode: () => void;
}

export const GuidedScrollRail: React.FC<GuidedScrollRailProps> = ({
  scenes,
  currentSceneIndex,
  onSelectScene,
  isGuidedMode,
  onToggleGuidedMode,
}) => {
  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const nextScene = scenes[currentSceneIndex + 1];

  return (
    <>
      {/* Desktop Vertical Scene Rail (Right Edge, Vertically Centred) matching §21.4 */}
      <nav
        aria-label="Page sections rail"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center bg-[#FFFDF8]/90 backdrop-blur-md border border-[#163C3A]/15 py-5 px-2.5 rounded-full shadow-lg"
      >
        {/* Top Counter: e.g. "03 / 06" in Cormorant Garamond */}
        <div className="font-serif text-sm text-[#163C3A] font-bold mb-3 select-none">
          0{currentSceneIndex + 1} <span className="text-[#85590A] text-xs font-normal">/</span> 0
          {scenes.length}
        </div>

        {/* Vertical Track Line */}
        <div className="relative h-44 w-1 bg-[#EEF3F1] rounded-full my-2 flex flex-col justify-between items-center">
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 w-full bg-[#163C3A] rounded-full transition-all duration-300"
            style={{
              height: `${(currentSceneIndex / (scenes.length - 1)) * 100}%`,
            }}
          />

          {/* Scene Nodes */}
          {scenes.map((scene, idx) => {
            const isCurrent = idx === currentSceneIndex;
            return (
              <a
                key={scene.id}
                href={`#${scene.anchor}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectScene(idx);
                }}
                className={`group relative z-10 w-4 h-4 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#163C3A] ${
                  isCurrent
                    ? 'bg-[#163C3A] ring-4 ring-[#C99A4B]/40 scale-125'
                    : 'bg-white border-2 border-[#667085]/40 hover:border-[#163C3A]'
                }`}
                title={scene.label}
                aria-label={`Jump to ${scene.label}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Boat marker on current node */}
                {isCurrent && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C99A4B]" />
                )}

                {/* Hover label pill */}
                <span className="absolute right-7 top-1/2 -translate-y-1/2 bg-[#163C3A] text-[#FFFDF8] text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                  {scene.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Guided / Free Mode Toggle Button matching §21.8 */}
        <button
          onClick={onToggleGuidedMode}
          className="mt-3 p-1.5 rounded-full hover:bg-[#EEF3F1] text-[#667085] hover:text-[#163C3A] transition-colors cursor-pointer"
          title={isGuidedMode ? 'Switch to Free Scroll' : 'Switch to Guided Sailing'}
          aria-label={isGuidedMode ? 'Switch to Free Scroll' : 'Switch to Guided Sailing'}
        >
          <Compass className={`w-4 h-4 ${isGuidedMode ? 'text-[#163C3A]' : 'text-[#667085]'}`} />
        </button>
      </nav>

      {/* "Next — [Label]" Cue at the bottom of the scene matching §21.4 */}
      {nextScene && currentScene.type === 'fit' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-2 pointer-events-auto animate-memory">
          <button
            onClick={() => onSelectScene(currentSceneIndex + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#163C3A]/15 text-[#163C3A] text-xs font-mono uppercase tracking-wider hover:border-[#2F6F8F] hover:bg-white shadow-sm transition-all cursor-pointer group"
          >
            <span>Next — {nextScene.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#2F6F8F] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </>
  );
};
