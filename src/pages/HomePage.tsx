import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RiverCanvas } from '../components/scene/RiverCanvas';
import { chaptersData } from '../data/chaptersData';
import { caseStudiesData } from '../data/caseStudiesData';
import { GuidedScrollRail, SceneItem } from '../components/common/GuidedScrollRail';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Users,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  BarChart3,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [isOutcomeRevealed, setIsOutcomeRevealed] = useState(false);
  const [expandedDilemma, setExpandedDilemma] = useState<number | null>(null);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isGuidedMode, setIsGuidedMode] = useState(true);
  const isTransitioningRef = useRef(false);

  const currentCase = caseStudiesData[activeCaseIdx];

  const dilemmas = [
    {
      num: '01',
      question: 'How do we build an authentic data culture?',
      summary:
        "Moving beyond HIPPO (Highest Paid Person's Opinion) to hypothesis-driven experimentation, just as Capital One reinvented retail banking.",
      resolution:
        'Root decision debates in falsifiable business hypotheses. Require every quantitative initiative to define a primary decision-maker, expected dollar ROI, and explicit stop-loss criteria before modeling begins.',
      chapterSlug: 'ch-7-leadership-dna',
      chapterNum: 7,
      colSpan: '',
    },
    {
      num: '02',
      question: 'What should our analysts actually work on?',
      summary:
        'Protecting top quantitative talent from low-value ad-hoc spreadsheet requests by ruthlessly focusing on the "Big Rocks": Revenue, Cost, and Risk.',
      resolution:
        'Institute a formal intake filter that rejects ad-hoc inquiries below a $500k value threshold. Reserve 70% of analytical capacity for top strategic bets, letting minor operational tasks fill the remaining margin.',
      chapterSlug: 'ch-8-aligning-priorities',
      chapterNum: 8,
      colSpan: '',
    },
    {
      num: '03',
      question: 'What does the first 90 days look like?',
      summary:
        'The structured 4-phase playbook: listening in month one, executing an undeniable quick win in month two, and scaling enterprise governance in month three.',
      resolution:
        'Resist launching massive infrastructure overhauls immediately. Secure executive credibility through a concentrated 30-day proof-of-concept sprint that quantifies actionable revenue or savings within existing systems.',
      chapterSlug: 'ch-9-first-90-days',
      chapterNum: 9,
      colSpan: '',
    },
    {
      num: '04',
      question: 'How do we align 48 stakeholders around an uncomfortable answer?',
      summary:
        'The San Jose International Airport case: reducing a $4.5B capital expansion to $1.5B by co-designing simulation assumptions with airlines, city planners, and federal agencies.',
      resolution:
        'Co-create simulation inputs transparently with skeptical partners. When stakeholders own the simulation parameters and constraint boundaries, they defend the resulting optimization model rather than resisting it.',
      chapterSlug: 'ch-10-steering-change',
      chapterNum: 10,
      colSpan: 'md:col-span-2',
    },
    {
      num: '05',
      question: 'Where will we stumble along the way?',
      summary:
        'An unvarnished catalog of 36 failure modes across Executive Sponsors, Analytics Managers, Business Partners, and Analysts.',
      resolution:
        "Map failure modes preemptively. The most lethal pitfall is not mathematical error, but 'The Orphan Dashboard'—building complex analytical tools without embedding them into recurring executive decision workflows.",
      chapterSlug: 'ch-11-navigating-pitfalls',
      chapterNum: 11,
      colSpan: '',
    },
  ];

  const pillarIcons = [
    { label: 'ANALYTICS LEADERSHIP', icon: <Compass className="w-4 h-4 text-[#C99A4B]" /> },
    { label: 'ORGANIZATION ALIGNMENT', icon: <Users className="w-4 h-4 text-[#2F6F8F]" /> },
    { label: 'STRATEGY EXECUTION', icon: <TrendingUp className="w-4 h-4 text-[#163C3A]" /> },
    { label: 'SUSTAINABLE IMPACT', icon: <ShieldCheck className="w-4 h-4 text-[#A9B8A6]" /> },
  ];

  // Defined Scenes matching §21.6
  const scenes: SceneItem[] = [
    { id: 'scene-hero', label: 'Overview', type: 'fit', anchor: 'hero', nextLabel: 'The Five Questions' },
    { id: 'scene-about', label: 'Questions', type: 'flow', anchor: 'about', nextLabel: 'Five Lands' },
    { id: 'scene-lands', label: 'Lands', type: 'flow', anchor: 'lands', nextLabel: 'Case Studies' },
    { id: 'scene-cases', label: 'Cases', type: 'fit', anchor: 'cases', nextLabel: 'Executive Takeaway' },
    { id: 'scene-takeaway', label: 'Takeaway', type: 'flow', anchor: 'takeaway' },
  ];

  // Jump to specific scene
  const scrollToScene = useCallback((index: number) => {
    if (index < 0 || index >= scenes.length) return;
    const targetEl = document.getElementById(scenes[index].anchor);
    if (targetEl) {
      isTransitioningRef.current = true;
      setCurrentSceneIdx(index);
      targetEl.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 1000);
    }
  }, [scenes]);

  // Track scroll position to update current scene
  useEffect(() => {
    const handleScroll = () => {
      if (isTransitioningRef.current) return;
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = scenes.length - 1; i >= 0; i--) {
        const el = document.getElementById(scenes[i].anchor);
        if (el && el.offsetTop <= scrollPos) {
          setCurrentSceneIdx(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scenes]);

  // Guided wheel gesture detection matching §21.3
  useEffect(() => {
    if (!isGuidedMode) return;

    let accumulatedDelta = 0;
    let wheelTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      // Allow native scroll inside flow scenes if not at edge
      const activeScene = scenes[currentSceneIdx];
      if (activeScene && activeScene.type === 'flow') {
        const el = document.getElementById(activeScene.anchor);
        if (el) {
          const rect = el.getBoundingClientRect();
          const atBottom = rect.bottom <= window.innerHeight + 80;
          const atTop = rect.top >= -80;
          if (e.deltaY > 0 && !atBottom) return;
          if (e.deltaY < 0 && !atTop) return;
        }
      }

      accumulatedDelta += e.deltaY;
      clearTimeout(wheelTimeout);

      wheelTimeout = setTimeout(() => {
        if (Math.abs(accumulatedDelta) >= 50 && !isTransitioningRef.current) {
          if (accumulatedDelta > 0 && currentSceneIdx < scenes.length - 1) {
            scrollToScene(currentSceneIdx + 1);
          } else if (accumulatedDelta < 0 && currentSceneIdx > 0) {
            scrollToScene(currentSceneIdx - 1);
          }
          accumulatedDelta = 0;
        }
      }, 90);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isGuidedMode, currentSceneIdx, scenes, scrollToScene]);

  // Keyboard navigation matching §21.3 (PageDown, ArrowDown, PageUp, ArrowUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (currentSceneIdx < scenes.length - 1) {
          e.preventDefault();
          scrollToScene(currentSceneIdx + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (currentSceneIdx > 0) {
          e.preventDefault();
          scrollToScene(currentSceneIdx - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSceneIdx, scenes.length, scrollToScene]);

  // Debug overlay hook if ?scrolldebug=1
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __riverScrollDebug?: Record<string, unknown> }).__riverScrollDebug = {
        sceneIndex: currentSceneIdx,
        isGuided: isGuidedMode,
        isTransitioning: isTransitioningRef.current,
      };
    }
  }, [currentSceneIdx, isGuidedMode]);

  return (
    <div className="relative min-h-screen text-[#1F2933]">
      {/* Guided Scene Rail on Right Edge */}
      <GuidedScrollRail
        scenes={scenes}
        currentSceneIndex={currentSceneIdx}
        onSelectScene={scrollToScene}
        isGuidedMode={isGuidedMode}
        onToggleGuidedMode={() => setIsGuidedMode(!isGuidedMode)}
      />

      {/* SCENE 1: HERO SECTION matching Moodboard §1 & §4.1 */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex items-center pt-24 pb-16 overflow-hidden"
      >
        {/* 3D River & Landscape Canvas (Hero Mode) */}
        <div className="absolute inset-0 z-0">
          <RiverCanvas progress={0.01} isHeroMode={true} qualityTier="high" />
        </div>

        {/* Soft mist wash overlay ensuring text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF8]/95 via-[#FFFDF8]/60 to-transparent pointer-events-none z-10 w-full sm:w-[65%]" />

        {/* Top-Right Floating Quote Card matching Moodboard */}
        <div className="hidden xl:block absolute top-28 right-12 z-20 max-w-sm pointer-events-auto">
          <div className="glass-panel p-6 shadow-xl border border-[#163C3A]/15 animate-memory">
            <span className="text-4xl font-serif text-[#C99A4B] block leading-none mb-1 font-light">
              “
            </span>
            <p className="font-serif italic text-lg text-[#163C3A] leading-snug mb-3">
              Turn data into better decisions and a brighter future.
            </p>
            <div className="w-10 h-0.5 bg-[#C99A4B] mb-2" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#667085] block font-semibold">
              EXECUTIVE LEADERSHIP PRINCIPLE
            </span>
          </div>
        </div>

        {/* Physical Easel Chart Board Callout (Tactile replacement per §18.3, No Sci-Fi Glow) */}
        <div className="hidden lg:block absolute bottom-24 right-20 z-20 pointer-events-none">
          <div className="w-64 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-[#163C3A]/15 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-[#163C3A]">
              <span className="flex items-center gap-1 font-semibold">
                <BarChart3 className="w-3.5 h-3.5 text-[#2F6F8F]" /> FIG. 7.1 · DECISION TELEMETRY
              </span>
              <span className="text-[#85590A] font-bold">+184% ROI</span>
            </div>
            {/* Tactile chart graphic */}
            <div className="flex items-end justify-between h-14 pt-2 gap-2 border-b border-[#163C3A]/10">
              <div className="w-full bg-[#163C3A]/25 rounded-t h-[40%]" />
              <div className="w-full bg-[#2F6F8F]/40 rounded-t h-[65%]" />
              <div className="w-full bg-[#163C3A]/30 rounded-t h-[50%]" />
              <div className="w-full bg-[#2F6F8F] rounded-t h-[90%]" />
              <div className="w-full bg-[#C99A4B] rounded-t h-[100%]" />
            </div>
            <div className="flex justify-between text-[10px] font-sans text-[#667085] mt-1.5">
              <span>Assess</span>
              <span>Model</span>
              <span>Test</span>
              <span>Deploy</span>
              <span>Scale</span>
            </div>
          </div>
        </div>

        {/* Hero Left Content Column */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 max-w-2xl animate-memory">
            {/* Tiny gold uppercase kicker */}
            <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#85590A] font-semibold block">
              ✦ AN IMMERSIVE ANALYTICS LEADERSHIP ODYSSEY · THE CURRICULUM ✦
            </span>

            {/* Very large two-line title in Cormorant Garamond */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif text-[#163C3A] font-medium leading-[0.92] tracking-tight">
              The River <br />
              <span className="italic font-normal">of</span>{' '}
              <span className="text-gradient-teal-river font-semibold">Insights</span>
            </h1>

            {/* Sub-headline preserving source copy */}
            <div className="space-y-3 pt-2">
              <p className="text-xl sm:text-2xl font-serif text-[#163C3A] leading-snug">
                Analytics is not only about producing insights.
              </p>
              <p className="text-base text-[#667085] font-normal leading-relaxed max-w-xl">
                A journey through data, people and decisions — from insight to impact.
                Explore Chapters 7–11 of <em>Behind Every Good Decision</em> by Piyanka Jain & Puneet Sharma.
              </p>
            </div>

            {/* Two Action Buttons matching Moodboard */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a href="/journey" className="btn-primary">
                <span>Start with Leadership</span>
                <ArrowRight className="w-4 h-4 ml-2 btn-arrow transition-transform" />
              </a>

              <a href="/case-studies/" className="btn-secondary">
                <span>See the Case Studies</span>
              </a>
            </div>

            {/* Four Line-Icons Row matching Moodboard */}
            <div className="pt-8 border-t border-[#163C3A]/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pillarIcons.map((p, idx) => (
                <div key={idx} className="flex flex-col space-y-1">
                  <div className="flex items-center gap-1.5">
                    {p.icon}
                    <span className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#163C3A] font-semibold">
                      {p.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 2: WHAT IS THIS SITE ABOUT? (5 Questions) */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#85590A] font-semibold block mb-3">
            ✦ STRATEGIC DILEMMAS ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#163C3A] mb-5">
            The Five Questions Every Analytics Leader Must Answer
          </h2>
          <p className="text-base text-[#667085]">
            Most analytics initiatives fail not from mathematical error, but from strategic disconnection.
            This curriculum maps the journey to resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {dilemmas.map((d, idx) => {
            const isExpanded = expandedDilemma === idx;
            const panelId = `dilemma-resolution-${d.num}`;
            return (
              <div
                key={d.num}
                className={`river-card p-8 sm:p-10 flex flex-col justify-between ${d.colSpan || ''}`}
              >
                <div>
                  <span className="text-4xl font-serif text-[#C99A4B] block mb-4 font-light">{d.num}</span>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#163C3A] mb-3.5 font-normal leading-snug">
                    {d.question}
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed font-sans">{d.summary}</p>
                </div>

                {/* Progressive Interactive Reveal for Strategic Resolution */}
                <div className="pt-6 mt-6 border-t border-[#163C3A]/10">
                  <button
                    type="button"
                    onClick={() => setExpandedDilemma(isExpanded ? null : idx)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2F6F8F] hover:text-[#163C3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded-lg py-1 cursor-pointer font-sans"
                  >
                    <span>{isExpanded ? 'Hide Strategic Resolution' : 'Explore Strategic Resolution'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div
                      id={panelId}
                      role="region"
                      aria-label={`Strategic Resolution for ${d.question}`}
                      className="mt-4 p-5 rounded-xl bg-[#EEF3F1]/80 border border-[#163C3A]/12 text-xs sm:text-sm text-[#2D3748] leading-relaxed font-sans space-y-3 animate-memory"
                    >
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85590A] block mb-1">
                          Leadership Playbook:
                        </span>
                        <p>{d.resolution}</p>
                      </div>
                      <div className="pt-2 border-t border-[#163C3A]/10 flex items-center justify-between">
                        <a
                          href={`/${d.chapterSlug}/`}
                          className="text-xs text-[#2F6F8F] hover:text-[#163C3A] font-semibold inline-flex items-center gap-1"
                        >
                          Read Chapter 0{d.chapterNum} Guide <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SCENE 3: THE 5 LANDS TOPIC CARDS */}
      <section id="lands" className="bg-[#EEF3F1] border-y border-[#163C3A]/15 py-32 md:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#85590A] font-semibold block mb-3">
              ✦ THE RIVER OF INSIGHTS JOURNEY ✦
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#163C3A] mb-5">
              Explore the Five Lands
            </h2>
            <p className="text-base text-[#667085]">
              Each region along the river reflects the temperament and demands of a specific leadership stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {chaptersData.map((ch) => (
              <div
                key={ch.slug}
                className="river-card p-8 sm:p-9 flex flex-col justify-between bg-white relative overflow-hidden group min-h-[360px]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-sans mb-3.5">
                    <span className="text-[#85590A] uppercase tracking-[0.16em] font-semibold">
                      CHAPTER {ch.number}
                    </span>
                    <span className="text-[#667085]">{ch.regionName}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-[#163C3A] mb-2.5 group-hover:text-[#2F6F8F] transition-colors font-medium">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-[#85590A] italic font-serif mb-3.5">"{ch.tagline}"</p>
                  <p className="text-sm text-[#667085] leading-relaxed mb-6">
                    {ch.summary}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#EEF3F1] flex items-center justify-between">
                  <a
                    href={`/${ch.slug}/`}
                    aria-label={`Open Chapter ${ch.number}: ${ch.title}`}
                    className="w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#C99A4B] text-[#C99A4B] hover:bg-[#C99A4B] hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:scale-110 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href={`/journey/${ch.slug}`}
                    className="text-xs font-sans text-[#2F6F8F] hover:text-[#163C3A] uppercase tracking-wider font-semibold flex items-center gap-1"
                  >
                    Sail in 3D <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}

            {/* Harbour Card */}
            <div className="river-card p-8 sm:p-9 flex flex-col justify-between bg-white relative overflow-hidden group min-h-[360px] border-[#2F6F8F]/40">
              <div>
                <div className="flex items-center justify-between text-xs font-sans mb-3.5">
                  <span className="text-[#2F6F8F] uppercase tracking-[0.16em] font-semibold">
                    THE HARBOUR
                  </span>
                  <span className="text-[#667085]">Final Stop</span>
                </div>
                <h3 className="text-2xl font-serif text-[#163C3A] mb-2.5 group-hover:text-[#2F6F8F] transition-colors font-medium">
                  Case Studies Archive
                </h3>
                <p className="text-xs text-[#85590A] italic font-serif mb-3.5">
                  "Where the river meets the open sea."
                </p>
                <p className="text-sm text-[#667085] leading-relaxed mb-6">
                  Six landmark enterprise case studies: Capital One, Netflix, Google, Booking.com, Uber,
                  and San Jose Airport.
                </p>
              </div>

              <div className="pt-5 border-t border-[#EEF3F1] flex items-center justify-between">
                <a
                  href="/case-studies/"
                  aria-label="Open Case Studies Archive"
                  className="w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#C99A4B] text-[#C99A4B] hover:bg-[#C99A4B] hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:scale-110 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="/case-studies/"
                  className="text-xs font-sans text-[#2F6F8F] hover:text-[#163C3A] uppercase tracking-wider font-semibold flex items-center gap-1"
                >
                  View All 6 Cases <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 4: CASE STUDY CAROUSEL */}
      <section id="cases" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#85590A] font-semibold block mb-3">
              ✦ EMPIRICAL CASE EVIDENCE ✦
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#163C3A]">
              Landmark Case Studies Preview
            </h2>
          </div>

          <div className="flex gap-2.5 mt-4 md:mt-0 flex-wrap">
            {caseStudiesData.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActiveCaseIdx(idx)}
                className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer ${
                  activeCaseIdx === idx
                    ? 'bg-[#163C3A] text-white font-semibold shadow-sm'
                    : 'bg-white text-[#667085] border border-[#163C3A]/15 hover:text-[#163C3A]'
                }`}
              >
                {c.company}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Case Study Card */}
        <div className="river-card p-8 sm:p-12 md:p-14 border border-[#163C3A]/15 bg-white">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <span className="text-xs uppercase font-sans tracking-[0.16em] text-[#85590A] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2F6F8F]" />
              Verified Case Study
            </span>
            <div className="flex gap-2">
              {currentCase.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#EEF3F1] text-[#163C3A] font-semibold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <h3 className="text-2xl md:text-4xl font-serif text-[#163C3A] mb-8">
            {currentCase.company}: {currentCase.headline}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 my-10 text-sm text-[#667085]">
            <div>
              <span className="text-xs font-sans uppercase text-[#163C3A] font-semibold tracking-wider block mb-2.5">
                The Strategic Challenge
              </span>
              <p className="leading-relaxed text-[#4A5568]">{currentCase.challenge}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-sans text-[#163C3A] font-semibold tracking-wider block mb-2.5">
                What Happened
              </span>
              <p className="leading-relaxed text-[#4A5568]">{currentCase.whatHappened}</p>
            </div>

            {/* Progressive Interactive Reveal for Measured Outcome & Metrics */}
            <div className="md:col-span-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOutcomeRevealed(!isOutcomeRevealed)}
                aria-expanded={isOutcomeRevealed}
                aria-controls="case-outcome-metrics"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2F6F8F] hover:text-[#163C3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded-lg px-3.5 py-2 bg-[#EEF3F1]/80 hover:bg-[#EEF3F1] cursor-pointer font-sans"
              >
                <span>{isOutcomeRevealed ? 'Hide Measured Outcome & Metrics' : 'Explore Measured Outcome & Metrics'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isOutcomeRevealed ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOutcomeRevealed && (
                <div
                  id="case-outcome-metrics"
                  role="region"
                  aria-label="Measured Outcome & Metrics"
                  className="mt-4 p-6 rounded-2xl bg-[#EEF3F1]/70 border border-[#2F6F8F]/25 text-sm text-[#2D3748] leading-relaxed font-sans space-y-3 animate-memory"
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#85590A] font-semibold">
                    <TrendingUp className="w-4 h-4 text-[#2F6F8F]" />
                    <span>Verified Empirical Metric:</span>
                  </div>
                  <p className="font-medium text-[#163C3A] text-base">{currentCase.result}</p>
                  <blockquote className="pt-2 border-t border-[#163C3A]/10 font-serif italic text-[#4A5568]">
                    "{currentCase.lesson}"
                  </blockquote>
                </div>
              )}
            </div>
          </div>

          <div className="pt-9 border-t border-[#EEF3F1] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase text-[#718096] font-semibold block mb-2">The Key Lesson</span>
              <p className="font-serif italic text-base md:text-lg text-[#163C3A]">
                "{currentCase.lesson}"
              </p>
            </div>
            <a
              href="/case-studies/"
              className="inline-flex items-center gap-2 bg-[#163C3A] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#2F6F8F] transition-all shrink-0 shadow-sm"
            >
              See All 6 Cases <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* SCENE 5: STATISTIC & TAKEAWAY */}
      <section id="takeaway" className="bg-[#EEF3F1]/70 border-t border-[#163C3A]/15 py-36 md:py-44 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-14 items-center">
          {/* Statistic Card matching Moodboard */}
          <div className="river-card p-9 sm:p-11 md:p-12 bg-white border border-[#163C3A]/15 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="p-2.5 rounded-lg bg-[#EEF3F1] text-[#163C3A]">
                <BarChart3 className="w-5 h-5" />
              </span>
              <span className="text-xs text-[#2F6F8F] font-semibold">+67% CapEx Saved</span>
            </div>
            <div className="text-6xl font-serif text-[#163C3A] font-light mb-4">$3B</div>
            <h4 className="text-xl font-serif font-normal text-[#163C3A] mb-2.5">
              San Jose Airport Cost Optimization
            </h4>
            <p className="text-xs sm:text-sm text-[#718096] leading-relaxed">
              Capital expansion budget successfully reduced from $4.5B to $1.5B via transparent simulation
              modeling across 48 stakeholders while maintaining 100% required passenger throughput.
            </p>
          </div>

          {/* Quote Card matching Moodboard */}
          <div className="river-card p-9 sm:p-11 md:p-12 bg-white border border-[#163C3A]/15 shadow-sm">
            <span className="text-5xl font-serif text-[#DDA6A0] block leading-none mb-4 font-light">
              “
            </span>
            <blockquote className="text-xl font-serif italic text-[#163C3A] leading-relaxed mb-6">
              "We structured thousands of micro-tests. If you make experimentation the foundational business
              model, market disruption follows naturally."
            </blockquote>
            <div className="w-12 h-0.5 bg-[#C99A4B] mb-3" />
            <cite className="text-xs uppercase tracking-[0.16em] text-[#85590A] font-semibold not-italic block">
              — Richard Fairbank, Founder of Capital One
            </cite>
          </div>
        </div>
      </section>
    </div>
  );
};
