import React, { Suspense, lazy, useState, useEffect, useRef, useCallback } from 'react';
import type { CameraViewMode } from '../components/scene/RiverCanvas';
import { LiteJourney } from '../components/scene/LiteJourney';
import { ChapterPanel } from '../components/journey/ChapterPanel';
import { MiniMap } from '../components/journey/MiniMap';
import { Base44LovableModal } from '../components/common/Base44LovableModal';
import { chaptersData } from '../data/chaptersData';
import {
  CHAPTER_REGISTRY,
  CanonicalChapterId,
  getChapterById,
  getNextChapterId,
  getPrevChapterId,
  getChapterBySlug,
} from '../data/chapterRegistry';
import { Chapter } from '../types';
import { journeyCopy } from '../data/journeyCopy';
import { riverAudio } from '../components/scene/RiverAudio';
import {
  Volume2,
  VolumeX,
  Layers,
  ArrowLeft,
  Compass,
  ChevronDown,
  ChevronUp,
  Camera,
  Play,
  Pause,
  Download,
  Eye,
} from 'lucide-react';

const RiverCanvas = lazy(() => import('../components/scene/RiverCanvas').then((module) => ({ default: module.RiverCanvas })));

interface JourneyPageProps {
  initialChapterSlug?: string;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ initialChapterSlug }) => {
  // =========================================================================
  // 1. DETERMINISTIC AUTHORITATIVE NAVIGATION STATE (Requirements 3, 4, 7, 10)
  // =========================================================================
  const [currentChapterId, setCurrentChapterId] = useState<CanonicalChapterId | null>(null);
  const [targetChapterId, setTargetChapterId] = useState<CanonicalChapterId | null>(null);
  const [currentU, setCurrentU] = useState<number>(0.01);
  const [targetU, setTargetU] = useState<number>(0.01);
  const [navigationState, setNavigationState] = useState<'idle' | 'navigating' | 'arriving' | 'stopped'>('idle');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [forwardVelocity, setForwardVelocity] = useState<number>(0);
  const [distanceToTarget, setDistanceToTarget] = useState<number>(0);
  const arrivalThreshold = 0.25; // 0.25 meters physical arrival threshold
  const [scrollLocked, setScrollLocked] = useState<boolean>(false);
  const [actualTravelTime, setActualTravelTime] = useState<number>(3.0);

  // Synchronous refs to prevent race conditions and protect against rapid clicks
  const currentChapterIdRef = useRef<CanonicalChapterId | null>(null);
  const targetChapterIdRef = useRef<CanonicalChapterId | null>(null);
  const targetURef = useRef<number>(0.01);
  const isNavigatingRef = useRef<boolean>(false);
  const scrollLockedRef = useRef<boolean>(false);
  const navigationStateRef = useRef<'idle' | 'navigating' | 'arriving' | 'stopped'>('idle');
  const navStartTimeRef = useRef<number>(0);

  // Application & Presentation State
  const [scrollProgress, setScrollProgress] = useState(0.01);
  const [boatProgress, setBoatProgress] = useState(0.01);
  const boatProgressRef = useRef(0.01);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [useLiteMode, setUseLiteMode] = useState(false);
  const [isMuted, setIsMuted] = useState(riverAudio.getMuted());
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('rider');
  const [isAutoCruise, setIsAutoCruise] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Cinematic UI Mode (Auto-fade non-essential controls during passive exploration)
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastControlsActivityRef = useRef(0);

  const pokeControls = useCallback(() => {
    setIsControlsVisible(true);
    if (controlsFadeTimer.current) {
      clearTimeout(controlsFadeTimer.current);
    }
    controlsFadeTimer.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 4500);
  }, []);

  useEffect(() => {
    const onActivity = () => {
      const now = performance.now();
      // Pointer movement can fire dozens of times per second. Refresh the fade
      // timer at a modest cadence instead of doing timer work for every event.
      if (now - lastControlsActivityRef.current < 250) return;
      lastControlsActivityRef.current = now;
      pokeControls();
    };
    window.addEventListener('pointermove', onActivity, { passive: true });
    window.addEventListener('touchstart', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('wheel', onActivity);
    pokeControls();
    return () => {
      window.removeEventListener('pointermove', onActivity);
      window.removeEventListener('touchstart', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('wheel', onActivity);
      if (controlsFadeTimer.current) clearTimeout(controlsFadeTimer.current);
    };
  }, [pokeControls]);

  const [isGuidedSail, setIsGuidedSail] = useState(() => {
    try {
      return localStorage.getItem('river_journey_mode') !== 'free';
    } catch {
      return true;
    }
  });

  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  // Wheel accumulation & Debug HUD telemetry
  const wheelAccumRef = useRef(0);
  const wheelDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debugScrollDelta, setDebugScrollDelta] = useState(0);
  const [debugScrollDir, setDebugScrollDir] = useState<'IDLE' | 'DOWN' | 'UP'>('IDLE');
  const [showDebugHUD, setShowDebugHUD] = useState(() => {
    return typeof window !== 'undefined' &&
      (window.location.search.includes('journeydebug=1') || window.location.search.includes('scrolldebug=1'));
  });

  // Initialize audio context
  useEffect(() => {
    riverAudio.start();
  }, []);

  // Handle deep link if chapter slug provided
  useEffect(() => {
    if (initialChapterSlug) {
      const match = getChapterBySlug(initialChapterSlug);
      if (match) {
        currentChapterIdRef.current = match.id;
        targetChapterIdRef.current = match.id;
        targetURef.current = match.targetU;
        navigationStateRef.current = 'stopped';
        setNavigationState('stopped');
        setCurrentChapterId(match.id);
        setTargetChapterId(match.id);
        setCurrentU(match.targetU);
        setTargetU(match.targetU);
        setScrollProgress(match.targetU);
        setBoatProgress(match.targetU);
        boatProgressRef.current = match.targetU;

        const content = chaptersData.find((c) => c.number === match.chapterNumber);
        if (content) {
          setActiveChapter(content);
        }
      }
    }
  }, [initialChapterSlug]);

  // =========================================================================
  // 2. AUTHORITATIVE MASTER NAVIGATION FUNCTION (Requirements 5, 6, 8, 12, 13, 15)
  // All Chapter Buttons, Scroll Gestures, Keyboard Arrows, MiniMap Clicks MUST call this function.
  // Rapid click protection: If currently navigating or scrollLocked, additional requests are blocked.
  // =========================================================================
  const navigateToChapter = useCallback((chapterId: CanonicalChapterId) => {
    // 15. RAPID CLICK PROTECTION:
    // If navigation is active, ignore clicks until arrival to prevent state corruption
    if (isNavigatingRef.current || scrollLockedRef.current) {
      return;
    }

    const targetEntry = getChapterById(chapterId);
    if (!targetEntry) return;

    // If already at target chapter and stopped, open chapter panel if closed
    if (currentChapterIdRef.current === chapterId && navigationStateRef.current === 'stopped') {
      const content = chaptersData.find((c) => c.number === targetEntry.chapterNumber);
      if (content) {
        setActiveChapter(content);
      }
      return;
    }

    // Set authoritative destination
    targetChapterIdRef.current = chapterId;
    setTargetChapterId(chapterId);
    targetURef.current = targetEntry.targetU;
    setTargetU(targetEntry.targetU);

    isNavigatingRef.current = true;
    setIsNavigating(true);
    scrollLockedRef.current = true;
    setScrollLocked(true);
    navigationStateRef.current = 'navigating';
    setNavigationState('navigating');
    setIsAutoCruise(false);

    navStartTimeRef.current = performance.now();

    // Close open chapter panel during transit so passenger experiences the river on the boat
    setActiveChapter(null);

    // Send boat along spline to targetU
    setScrollProgress(targetEntry.targetU);
    setAriaAnnouncement(`Sailing to Chapter ${targetEntry.chapterNumber}: ${targetEntry.title}`);
  }, []);

  // Reliable Next / Previous chapter navigation
  const sailNextStop = useCallback(() => {
    const currentId = currentChapterIdRef.current;
    const nextId = currentId ? getNextChapterId(currentId) : null;
    if (nextId) {
      navigateToChapter(nextId);
    }
  }, [navigateToChapter]);

  const sailPrevStop = useCallback(() => {
    const currentId = currentChapterIdRef.current;
    const prevId = currentId ? getPrevChapterId(currentId) : null;
    if (prevId) {
      navigateToChapter(prevId);
    }
  }, [navigateToChapter]);

  // =========================================================================
  // 3. PHYSICAL ARRIVAL & CHAPTER SYNCHRONIZATION (Requirements 9, 10, 14)
  // After boat decelerates, reaches arrival threshold (<= 0.25m), and stops:
  // forwardVelocity = 0, scrollLocked = false, activeChapterId = currentChapterId = arrived chapter
  // =========================================================================
  const handleReachStop = useCallback((chapterNumber: number) => {
    const arrivedEntry = CHAPTER_REGISTRY.find((e) => e.chapterNumber === chapterNumber);
    const isArrivingAtTarget =
      arrivedEntry !== undefined &&
      isNavigatingRef.current &&
      targetChapterIdRef.current === arrivedEntry.id;
    const isReopeningSelectedStop =
      arrivedEntry !== undefined &&
      navigationStateRef.current === 'stopped' &&
      currentChapterIdRef.current === arrivedEntry.id;
    if (!arrivedEntry || (!isArrivingAtTarget && !isReopeningSelectedStop)) {
      return;
    }

    const arrivedId = arrivedEntry.id;
    currentChapterIdRef.current = arrivedId;
    setCurrentChapterId(arrivedId);
    targetChapterIdRef.current = arrivedId;
    setTargetChapterId(arrivedId);
    setCurrentU(arrivedEntry.targetU);
    setTargetU(arrivedEntry.targetU);

    navigationStateRef.current = 'stopped';
    setNavigationState('stopped');
    setForwardVelocity(0);
    setDistanceToTarget(0);

    // Calculate actual travel time
    if (navStartTimeRef.current > 0) {
      const elapsedSec = (performance.now() - navStartTimeRef.current) / 1000;
      setActualTravelTime(elapsedSec);
    }

    // Unlock scroll after complete physical stop
    isNavigatingRef.current = false;
    setIsNavigating(false);
    scrollLockedRef.current = false;
    setScrollLocked(false);

    // Active Chapter Synchronization:
    // currentChapterId = activeChapterId = visibleChapterId = contentChapterId
    const content = chaptersData.find((c) => c.number === arrivedEntry.chapterNumber);
    if (content) {
      setActiveChapter(content);
      window.history.pushState(null, '', `/journey/${content.slug}`);
    }
  }, []);

  // =========================================================================
  // 4. SCROLL NAVIGATION (Requirements 11, 12, 13)
  // One deliberate scroll gesture advances exactly ONE chapter.
  // Down: 7 -> 8 -> 9 -> 10 -> 11. Up: 11 -> 10 -> 9 -> 8 -> 7.
  // Normalized delta, debounced, locked during travel.
  // =========================================================================
  useEffect(() => {
    if (isAutoCruise) return;

    const handleWheel = (e: WheelEvent) => {
      // If chapter full-page reader is open, allow ordinary content reading without navigating boat
      if (activeChapter) return;

      // Allow native page scrolling if pointer is inside open ChapterPanel reader body or interactive modal
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[role="dialog"], .chapter-reader-body, input, textarea')) {
        return;
      }

      // Prevent outer page bouncing while interacting with 3D journey
      e.preventDefault();

      // Lock scroll during boat travel: a single aggressive gesture must NOT skip multiple chapters
      if (scrollLockedRef.current || isNavigatingRef.current) {
        return;
      }

      // Normalize wheel delta (handles high-res trackpads vs notched mousewheels)
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 24; // Lines mode
      else if (e.deltaMode === 2) dy *= 100; // Pages mode
      if (Math.abs(dy) < 1.0) dy = Math.sign(dy) * 1.5;

      wheelAccumRef.current += dy;
      if (showDebugHUD) {
        setDebugScrollDelta(wheelAccumRef.current);
        setDebugScrollDir(wheelAccumRef.current > 0 ? 'DOWN' : wheelAccumRef.current < 0 ? 'UP' : 'IDLE');
      }

      if (wheelDebounceTimer.current) {
        clearTimeout(wheelDebounceTimer.current);
      }

      const THRESHOLD = 36; // Snappy, natural threshold for deliberate scroll gesture

      if (wheelAccumRef.current >= THRESHOLD) {
        wheelAccumRef.current = 0;
        // Scroll DOWN: 7 -> 8 -> 9 -> 10 -> 11
        const currentId = currentChapterIdRef.current;
        const nextId = currentId ? getNextChapterId(currentId) : null;
        if (nextId) {
          navigateToChapter(nextId);
        }
      } else if (wheelAccumRef.current <= -THRESHOLD) {
        wheelAccumRef.current = 0;
        // Scroll UP: 11 -> 10 -> 9 -> 8 -> 7
        const currentId = currentChapterIdRef.current;
        const prevId = currentId ? getPrevChapterId(currentId) : null;
        if (prevId) {
          navigateToChapter(prevId);
        }
      } else {
        wheelDebounceTimer.current = setTimeout(() => {
          wheelAccumRef.current = 0;
          if (showDebugHUD) {
            setDebugScrollDelta(0);
            setDebugScrollDir('IDLE');
          }
        }, 180);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelDebounceTimer.current) clearTimeout(wheelDebounceTimer.current);
    };
  }, [isAutoCruise, navigateToChapter, activeChapter, showDebugHUD]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If chapter full-page reader is active, allow normal reading scroll without triggering boat navigation
      if (activeChapter) return;

      const target = e.target as HTMLElement | null;
      if (target && target.closest('[role="dialog"], input, textarea')) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        sailNextStop();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        sailPrevStop();
      } else if (e.key.toLowerCase() === 'c') {
        // Toggle camera mode: rider -> bow -> aerial -> rider
        setCameraMode((prev) => (prev === 'rider' ? 'bow' : prev === 'bow' ? 'aerial' : 'rider'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sailNextStop, sailPrevStop, activeChapter]);

  const handleOpenChapterByNumber = (chapterNumber: number) => {
    const entry = CHAPTER_REGISTRY.find((e) => e.chapterNumber === chapterNumber);
    if (entry) {
      if (useLiteMode) {
        const content = chaptersData.find((c) => c.number === chapterNumber);
        if (content) {
          currentChapterIdRef.current = entry.id;
          navigationStateRef.current = 'stopped';
          setCurrentChapterId(entry.id);
          setActiveChapter(content);
        }
        return;
      }
      navigateToChapter(entry.id);
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

  const toggleGuidedMode = () => {
    const nextMode = !isGuidedSail;
    setIsGuidedSail(nextMode);
    try {
      localStorage.setItem('river_journey_mode', nextMode ? 'guided' : 'free');
    } catch {
      // Ignore
    }
  };

  const cycleCameraMode = () => {
    setCameraMode((prev) => {
      if (prev === 'rider') return 'bow';
      if (prev === 'bow') return 'aerial';
      return 'rider';
    });
  };

  const currentEntry = currentChapterId ? getChapterById(currentChapterId) : undefined;
  const targetEntry = targetChapterId ? getChapterById(targetChapterId) : undefined;

  return (
    <div className="journey-world relative w-screen h-screen overflow-hidden bg-[#FFFDF8] text-[#1F2933] select-none">
      {/* Polite live region for screen reader announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {ariaAnnouncement}
      </div>

      {/* 3D WebGL Canvas Layer with Rider Camera & Authoritative Physics */}
      {!useLiteMode ? (
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Suspense fallback={<div className="river-scene-loading river-scene-loading--journey" aria-hidden="true" />}>
            <RiverCanvas
              progress={scrollProgress}
              onReachStop={handleReachStop}
              qualityTier="high"
              cameraMode={cameraMode}
              isAutoCruise={isAutoCruise}
              isPaused={activeChapter !== null}
              onProgressUpdate={(p, isArrived, velocity, dist, phase, travelTime) => {
                boatProgressRef.current = p;
                setBoatProgress(p);
                setCurrentU(p);
                if (velocity !== undefined) setForwardVelocity(velocity);
                if (dist !== undefined) setDistanceToTarget(dist);
                if (phase !== undefined && isNavigatingRef.current) {
                  setNavigationState(phase);
                  navigationStateRef.current = phase;
                }
                if (travelTime !== undefined && travelTime > 0) {
                  setActualTravelTime(travelTime);
                }

                if (isArrived && isNavigatingRef.current) {
                  const targetNumber = targetChapterIdRef.current
                    ? getChapterById(targetChapterIdRef.current)?.chapterNumber
                    : undefined;
                  if (targetNumber !== undefined) handleReachStop(targetNumber);
                }
              }}
            />
          </Suspense>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 overflow-y-auto">
          <LiteJourney
            progress={boatProgress}
            onOpenChapter={handleOpenChapterByNumber}
          />
        </div>
      )}

      {/* Mini-Map progress bar along river driven by authoritative chapter registry */}
      <MiniMap
        currentProgress={boatProgress}
        activeChapterId={currentChapterId ?? undefined}
        onJumpTo={navigateToChapter}
      />

      {/* Floating Center Chapter Selector Pills (Absolute Chapter Button Rule) */}
      <nav
        aria-label="Chapter Stops Selection"
        className="journey-stop-selector fixed bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-1.5 pointer-events-auto"
      >
        {CHAPTER_REGISTRY.map((entry) => {
          const isActive = currentChapterId === entry.id;
          const isTargeting = targetChapterId === entry.id && navigationState !== 'stopped';

          return (
            <button
              key={entry.id}
              onClick={() => navigateToChapter(entry.id)}
              disabled={scrollLocked && !isActive}
              data-visual-state={isActive ? 'active' : isTargeting ? 'selected' : 'available'}
              className={`journey-stop-button px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer font-medium ${
                isActive
                  ? 'bg-[#163C3A] text-white shadow-sm font-semibold'
                  : isTargeting
                  ? 'bg-[#2F6F8F]/20 text-[#163C3A] border border-[#2F6F8F] animate-pulse'
                  : 'text-[#4A5568] hover:text-[#163C3A] hover:bg-[#EEF3F1]'
              } ${scrollLocked && !isActive ? 'opacity-60 cursor-not-allowed' : ''}`}
              title={`Sail to Chapter ${entry.chapterNumber}: ${entry.title}`}
              aria-label={`Sail to Chapter ${entry.chapterNumber}`}
            >
              Ch. {entry.chapterNumber}
            </button>
          );
        })}
      </nav>

      {/* Real-time Telemetry Debug HUD (?journeydebug=1) (Requirement 28) */}
      {showDebugHUD && (
        <aside
          aria-label="Navigation Telemetry Debug HUD"
          className="fixed top-20 left-4 sm:left-8 z-40 bg-slate-950/92 text-emerald-400 p-4 rounded-xl border border-emerald-500/30 font-mono text-[11px] shadow-2xl backdrop-blur-md max-w-xs animate-memory pointer-events-auto"
        >
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-2">
            <span className="font-bold text-white tracking-wider flex items-center gap-1.5 text-[10px]">
              <span className={`w-2 h-2 rounded-full ${navigationState !== 'stopped' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'} inline-block`} />
              JOURNEY NAVIGATION DEBUG HUD
            </span>
            <button
              onClick={() => setShowDebugHUD(false)}
              className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">CURRENT CHAPTER ID:</span>
              <span className="text-emerald-300 font-bold">{currentChapterId ?? 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TARGET CHAPTER ID:</span>
              <span className="text-amber-300 font-bold">{targetChapterId ?? 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CURRENT U:</span>
              <span className="text-cyan-300 font-bold">{currentU.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TARGET U:</span>
              <span className="text-cyan-300 font-bold">{targetU.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">NAVIGATION STATE:</span>
              <span className={navigationState === 'navigating' ? 'text-amber-400 font-bold' : navigationState === 'arriving' ? 'text-yellow-300 font-bold' : 'text-emerald-400 font-bold'}>
                {navigationState.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">FORWARD VELOCITY:</span>
              <span className="text-white font-bold">{forwardVelocity.toFixed(2)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DISTANCE TO TARGET:</span>
              <span className="text-white font-bold">{distanceToTarget.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ARRIVAL THRESHOLD:</span>
              <span className="text-slate-300">{arrivalThreshold.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SCROLL LOCKED:</span>
              <span className={scrollLocked ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {scrollLocked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SCROLL DIRECTION:</span>
              <span className={debugScrollDir === 'DOWN' ? 'text-amber-400 font-bold' : debugScrollDir === 'UP' ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                {debugScrollDir}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ACTUAL TRAVEL TIME:</span>
              <span className="text-white font-bold">{actualTravelTime.toFixed(2)}s (Target: ~5.0s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CAMERA MODE:</span>
              <span className="text-purple-300 font-bold">ELEVATED_THIRD_PERSON_FOLLOW</span>
            </div>
          </div>
        </aside>
      )}

      {/* Top Floating Control Bar (Cinematic Auto-Fade) */}
      <header
        onMouseEnter={() => setIsControlsVisible(true)}
        className={`journey-control-bar fixed top-4 left-4 right-4 sm:left-8 sm:right-8 z-30 flex items-center justify-between pointer-events-none transition-opacity duration-500 ease-out ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 hover:opacity-100'
        }`}
      >
        <a
          href="/"
          className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#163C3A]/15 text-[#163C3A] hover:text-[#2F6F8F] hover:border-[#2F6F8F] px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#2F6F8F]" />
          <span>{journeyCopy.navigation.returnHome}</span>
        </a>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Debug HUD Toggle */}
          <button
            onClick={() => setShowDebugHUD(!showDebugHUD)}
            className={`border px-3 py-2 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F] ${
              showDebugHUD
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/50'
                : 'bg-white/95 text-[#667085] hover:text-[#163C3A] border-[#163C3A]/15'
            }`}
            title={journeyCopy.controls.debugHud.tooltip}
            aria-label={journeyCopy.controls.debugHud.label}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{journeyCopy.controls.debugHud.label}</span>
          </button>

          {/* Camera View Switcher */}
          {!useLiteMode && (
            <button
              onClick={cycleCameraMode}
              className="bg-white/95 backdrop-blur-md border border-[#163C3A]/15 text-[#163C3A] hover:border-[#2F6F8F] px-3.5 py-2 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
              title={journeyCopy.controls.camera.switchTooltip}
              aria-label={journeyCopy.accessibility.cameraToggleAria}
            >
              <Camera className="w-3.5 h-3.5 text-[#2F6F8F]" />
              <span className="hidden sm:inline font-semibold">
                {cameraMode === 'rider' || cameraMode === 'follow'
                  ? journeyCopy.controls.camera.rider
                  : cameraMode === 'bow'
                  ? journeyCopy.controls.camera.bow
                  : journeyCopy.controls.camera.aerial}
              </span>
            </button>
          )}

          {/* Auto-Cruise / Tour Mode Toggle */}
          {!useLiteMode && (
            <button
              onClick={() => setIsAutoCruise(!isAutoCruise)}
              className={`backdrop-blur-md border px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F] ${
                isAutoCruise
                  ? 'bg-[#163C3A] text-[#FFFDF8] border-[#163C3A]'
                  : 'bg-white/95 text-[#163C3A] border-[#163C3A]/15 hover:border-[#2F6F8F]'
              }`}
              title={isAutoCruise ? journeyCopy.controls.cruise.pauseTooltip : journeyCopy.controls.cruise.startTooltip}
            >
              {isAutoCruise ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#C99A4B]" />
                  <span className="hidden sm:inline font-semibold">
                    {journeyCopy.controls.cruise.pause}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#2F6F8F]" />
                  <span className="hidden sm:inline font-semibold">
                    {journeyCopy.controls.cruise.start}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Guided / Free Sailing Mode Toggle */}
          <button
            onClick={toggleGuidedMode}
            className="hidden md:flex bg-white/95 backdrop-blur-md border border-[#163C3A]/15 text-[#163C3A] hover:border-[#163C3A] px-3.5 py-2 rounded-full text-xs items-center gap-1.5 transition-colors cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
            title={isGuidedSail ? journeyCopy.controls.sailingMode.guidedTooltip : journeyCopy.controls.sailingMode.freeTooltip}
          >
            <Compass className={`w-3.5 h-3.5 ${isGuidedSail ? 'text-[#C99A4B]' : 'text-[#667085]'}`} />
            <span className="font-semibold">
              {isGuidedSail
                ? journeyCopy.controls.sailingMode.guided
                : journeyCopy.controls.sailingMode.free}
            </span>
          </button>

          {/* 3D / 2D Lite Toggle */}
          <button
            onClick={() => setUseLiteMode(!useLiteMode)}
            className="bg-white/95 backdrop-blur-md border border-[#163C3A]/15 text-[#667085] hover:text-[#163C3A] px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
            title={journeyCopy.controls.viewMode.tooltip}
          >
            <Layers className="w-3.5 h-3.5 text-[#2F6F8F]" />
            <span className="hidden sm:inline font-medium">
              {useLiteMode ? journeyCopy.controls.viewMode.threeD : journeyCopy.controls.viewMode.lite2d}
            </span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 bg-white/95 backdrop-blur-md border border-[#163C3A]/15 text-[#667085] hover:text-[#163C3A] rounded-full transition-colors cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
            title={isMuted ? journeyCopy.controls.audio.unmute : journeyCopy.controls.audio.mute}
            aria-label={journeyCopy.accessibility.audioToggleAria}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#2F6F8F]" />}
          </button>

          {/* Export to Base44 / Lovable Modal Trigger */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="hidden lg:inline-flex bg-[#163C3A] text-[#FFFDF8] hover:bg-[#2F6F8F] px-3.5 py-2 rounded-full text-xs uppercase items-center gap-1.5 transition-colors shadow-sm cursor-pointer font-semibold tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
            title={journeyCopy.controls.export.tooltip}
          >
            <Download className="w-3.5 h-3.5 text-[#C99A4B]" />
            <span>{journeyCopy.controls.export.label}</span>
          </button>
        </div>
      </header>

      {/* Subtle River Journey Progress Indicator (Requirement 13) */}
      <footer className="journey-progress-bar fixed bottom-4 left-4 right-4 sm:left-8 sm:right-8 z-20 pointer-events-none flex items-center justify-between">
        <div className="bg-white/90 backdrop-blur-md border border-[#163C3A]/15 px-4 py-1.5 rounded-full text-xs text-[#163C3A] shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2F6F8F] animate-pulse" />
          {currentEntry ? (
            <>
              <span className="font-semibold text-[#85590A]">Ch. {currentEntry.chapterNumber}</span>
              <span className="text-[#667085]">·</span>
              <span className="truncate max-w-[140px] sm:max-w-[240px] font-sans font-medium">{currentEntry.title}</span>
            </>
          ) : (
            <span className="font-medium">Choose a chapter to begin</span>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-[#163C3A]/15 px-4 py-1.5 rounded-full text-xs text-[#667085] shadow-sm flex items-center gap-2">
          <span>River Voyage</span>
          <span className="font-bold text-[#163C3A]">{Math.round(boatProgress * 100)}%</span>
        </div>
      </footer>

      {/* Guided Sailing On-Screen Controls */}
      {isGuidedSail && !activeChapter && (
        <div className="fixed bottom-14 right-4 sm:right-8 z-30 flex flex-col gap-2 pointer-events-auto animate-memory">
          <button
            onClick={sailPrevStop}
            className="p-3 rounded-full bg-white/95 backdrop-blur-md border border-[#163C3A]/20 text-[#163C3A] hover:bg-[#EEF3F1] hover:text-[#2F6F8F] shadow-lg transition-all cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
            title={journeyCopy.instructions.prevChapter}
            aria-label={journeyCopy.instructions.prevChapter}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={sailNextStop}
            className="p-3 rounded-full bg-white/95 backdrop-blur-md border border-[#163C3A]/20 text-[#163C3A] hover:bg-[#EEF3F1] hover:text-[#2F6F8F] shadow-lg transition-all cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
            title={journeyCopy.instructions.nextChapter}
            aria-label={journeyCopy.instructions.nextChapter}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Floating Instructions Banner at start of journey */}
      {boatProgress < 0.12 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-memory">
          <div className="bg-white/95 backdrop-blur-md border border-[#163C3A]/15 rounded-full px-6 py-2.5 text-center text-xs font-mono text-[#163C3A] shadow-xl">
            {currentChapterId
              ? journeyCopy.instructions.heroBanner
              : 'Choose a chapter to begin · Drag mouse to look around'}
          </div>
        </div>
      )}

      {/* Chapter Detail Side Drawer Modal */}
      <ChapterPanel chapter={activeChapter} onClose={handleClosePanel} />

      {/* Base44 & Lovable Export Modal */}
      <Base44LovableModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
