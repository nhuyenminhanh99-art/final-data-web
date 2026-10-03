import React, { useState } from 'react';
import { RiverCanvas } from '../components/scene/RiverCanvas';
import { chaptersData } from '../data/chaptersData';
import { caseStudiesData } from '../data/caseStudiesData';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Users,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Layers,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  const currentCase = caseStudiesData[activeCaseIdx];

  const pillarIcons = [
    { label: 'ANALYTICS LEADERSHIP', icon: <Compass className="w-4 h-4 text-[#C99A4B]" /> },
    { label: 'ORGANIZATION ALIGNMENT', icon: <Users className="w-4 h-4 text-[#2F6F8F]" /> },
    { label: 'STRATEGY EXECUTION', icon: <TrendingUp className="w-4 h-4 text-[#163C3A]" /> },
    { label: 'SUSTAINABLE IMPACT', icon: <ShieldCheck className="w-4 h-4 text-[#A9B8A6]" /> },
  ];

  return (
    <div className="relative min-h-screen bg-[#FFFDF8] text-[#1F2933]">
      {/* HERO SECTION: MOODBOARD 90%+ VISUAL MATCH */}
      <section className="relative min-h-screen w-full flex items-center pt-24 pb-16 overflow-hidden">
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

        {/* Floating Holographic Data Panel on River (Right Side) matching Moodboard */}
        <div className="hidden lg:block absolute bottom-24 right-20 z-20 pointer-events-none animate-float">
          <div className="w-64 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#2F6F8F]/30 shadow-2xl">
            <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-[#163C3A]">
              <span className="flex items-center gap-1 font-semibold">
                <BarChart3 className="w-3.5 h-3.5 text-[#2F6F8F]" /> DECISION TELEMETRY
              </span>
              <span className="text-[#85590A]">+184% ROI</span>
            </div>
            {/* Holographic Bar Chart visual */}
            <div className="flex items-end justify-between h-16 pt-2 gap-2 border-b border-[#163C3A]/10">
              <div className="w-full bg-[#163C3A]/20 rounded-t h-[40%]" />
              <div className="w-full bg-[#2F6F8F]/40 rounded-t h-[65%]" />
              <div className="w-full bg-[#163C3A]/30 rounded-t h-[50%]" />
              <div className="w-full bg-[#2F6F8F] rounded-t h-[90%]" />
              <div className="w-full bg-[#C99A4B] rounded-t h-[100%]" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[#667085] mt-1.5">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
              <span>Impact</span>
            </div>
          </div>
        </div>

        {/* Hero Left Content Column */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 max-w-2xl animate-memory">
            {/* Tiny gold uppercase kicker */}
            <span className="text-xs uppercase font-mono tracking-[0.26em] text-[#85590A] font-semibold block">
              ✦ [Placeholder: site kicker] · THE CURRICULUM ✦
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
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#163C3A] font-semibold">
                      {p.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none opacity-70">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#85590A] font-semibold mb-1.5">
            Scroll to explore
          </span>
          <div className="w-4 h-7 border border-[#163C3A]/30 rounded-full flex justify-center p-1 bg-white/50 backdrop-blur-sm">
            <div className="w-1 h-2 bg-[#163C3A] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* SECTION 1: WHAT IS THIS SITE ABOUT? (5 Questions with River-Line connector) */}
      <section id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono tracking-[0.24em] text-[#85590A] font-semibold block mb-2">
            ✦ STRATEGIC DILEMMAS ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#163C3A] mb-4">
            The Five Questions Every Analytics Leader Must Answer
          </h2>
          <p className="text-base text-[#667085]">
            Most analytics initiatives fail not from mathematical error, but from strategic disconnection.
            This curriculum maps the journey to resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="river-card p-6 md:p-8">
            <span className="text-4xl font-serif text-[#C99A4B] block mb-3 font-light">01</span>
            <h3 className="text-xl font-serif text-[#163C3A] mb-2 font-medium">
              How do we build an authentic data culture?
            </h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Moving beyond HIPPO (Highest Paid Person's Opinion) to hypothesis-driven experimentation,
              just as Capital One reinvented retail banking.
            </p>
          </div>

          <div className="river-card p-6 md:p-8">
            <span className="text-4xl font-serif text-[#C99A4B] block mb-3 font-light">02</span>
            <h3 className="text-xl font-serif text-[#163C3A] mb-2 font-medium">
              What should our analysts actually work on?
            </h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Protecting top quantitative talent from low-value ad-hoc spreadsheet requests by ruthlessly
              focusing on the "Big Rocks": Revenue, Cost, and Risk.
            </p>
          </div>

          <div className="river-card p-6 md:p-8">
            <span className="text-4xl font-serif text-[#C99A4B] block mb-3 font-light">03</span>
            <h3 className="text-xl font-serif text-[#163C3A] mb-2 font-medium">
              What does the first 90 days look like?
            </h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              The structured 4-phase playbook: listening in month one, executing an undeniable quick win in
              month two, and scaling enterprise governance in month three.
            </p>
          </div>

          <div className="river-card p-6 md:p-8 md:col-span-2">
            <span className="text-4xl font-serif text-[#C99A4B] block mb-3 font-light">04</span>
            <h3 className="text-xl font-serif text-[#163C3A] mb-2 font-medium">
              How do we align 48 stakeholders around an uncomfortable answer?
            </h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              The San Jose International Airport case: reducing a $4.5B capital expansion to $1.5B by
              co-designing simulation assumptions with airlines, city planners, and federal agencies.
            </p>
          </div>

          <div className="river-card p-6 md:p-8">
            <span className="text-4xl font-serif text-[#C99A4B] block mb-3 font-light">05</span>
            <h3 className="text-xl font-serif text-[#163C3A] mb-2 font-medium">
              Where will we stumble along the way?
            </h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              An unvarnished catalog of 36 failure modes across Executive Sponsors, Analytics Managers,
              Business Partners, and Analysts.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 LANDS TOPIC CARDS (Chapter Card Style with Bottom-Left Gold Arrow Button) */}
      <section className="bg-[#EEF3F1] border-y border-[#163C3A]/15 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-[0.24em] text-[#85590A] font-semibold block mb-2">
              ✦ THE RIVER OF INSIGHTS JOURNEY ✦
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#163C3A] mb-4">
              Explore the Five Lands
            </h2>
            <p className="text-base text-[#667085]">
              Each region along the river reflects the temperament and demands of a specific leadership stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chaptersData.map((ch) => (
              <div
                key={ch.slug}
                className="river-card p-6 flex flex-col justify-between bg-white relative overflow-hidden group min-h-[340px]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-[#85590A] uppercase tracking-[0.2em] font-semibold">
                      CHAPTER {ch.number}
                    </span>
                    <span className="text-[#667085]">{ch.regionName}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-[#163C3A] mb-2 group-hover:text-[#2F6F8F] transition-colors font-medium">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-[#85590A] italic font-serif mb-3">"{ch.tagline}"</p>
                  <p className="text-sm text-[#667085] leading-relaxed mb-6">
                    {ch.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EEF3F1] flex items-center justify-between">
                  {/* Round 44px gold arrow button on bottom-left matching Moodboard */}
                  <a
                    href={`/${ch.slug}/`}
                    aria-label={`Open Chapter ${ch.number}: ${ch.title}`}
                    className="w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#C99A4B] text-[#C99A4B] hover:bg-[#C99A4B] hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:scale-110 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href={`/journey/${ch.slug}`}
                    className="text-xs font-mono text-[#2F6F8F] hover:text-[#163C3A] uppercase tracking-wider font-semibold flex items-center gap-1"
                  >
                    Sail in 3D <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}

            {/* Harbour Card */}
            <div className="river-card p-6 flex flex-col justify-between bg-white relative overflow-hidden group min-h-[340px] border-[#2F6F8F]/40">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-[#2F6F8F] uppercase tracking-[0.2em] font-semibold">
                    THE HARBOUR
                  </span>
                  <span className="text-[#667085]">Final Stop</span>
                </div>
                <h3 className="text-2xl font-serif text-[#163C3A] mb-2 group-hover:text-[#2F6F8F] transition-colors font-medium">
                  Case Studies Archive
                </h3>
                <p className="text-xs text-[#85590A] italic font-serif mb-3">
                  "Where the river meets the open sea."
                </p>
                <p className="text-sm text-[#667085] leading-relaxed mb-6">
                  Six landmark enterprise case studies: Capital One, Netflix, Google, Booking.com, Uber,
                  and San Jose Airport.
                </p>
              </div>

              <div className="pt-4 border-t border-[#EEF3F1] flex items-center justify-between">
                <a
                  href="/case-studies/"
                  aria-label="Open Case Studies Archive"
                  className="w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#C99A4B] text-[#C99A4B] hover:bg-[#C99A4B] hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:scale-110 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="/case-studies/"
                  className="text-xs font-mono text-[#2F6F8F] hover:text-[#163C3A] uppercase tracking-wider font-semibold flex items-center gap-1"
                >
                  View All 6 Cases <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATISTIC CARD & CASE STUDY CAROUSEL */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.24em] text-[#85590A] font-semibold block mb-2">
              ✦ EMPIRICAL CASE EVIDENCE ✦
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#163C3A]">
              Landmark Case Studies Preview
            </h2>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            {caseStudiesData.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActiveCaseIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
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

        {/* Selected Case Study Card matching Moodboard */}
        <div className="river-card p-6 md:p-10 border border-[#163C3A]/15 bg-white">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <span className="text-xs uppercase font-mono tracking-widest text-[#85590A] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2F6F8F]" />
              Verified Case Study
            </span>
            <div className="flex gap-1.5">
              {currentCase.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#EEF3F1] text-[#163C3A] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <h3 className="text-2xl md:text-4xl font-serif text-[#163C3A] mb-4">
            {currentCase.company}: {currentCase.headline}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6 text-sm text-[#667085]">
            <div>
              <span className="text-xs font-mono uppercase text-[#163C3A] font-semibold block mb-1">
                The Strategic Challenge
              </span>
              <p className="leading-relaxed">{currentCase.challenge}</p>
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-[#163C3A] font-semibold block mb-1">
                What Happened
              </span>
              <p className="leading-relaxed">{currentCase.whatHappened}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EEF3F1] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#667085] block">The Key Lesson</span>
              <p className="font-serif italic text-base md:text-lg text-[#163C3A]">
                "{currentCase.lesson}"
              </p>
            </div>
            <a
              href="/case-studies/"
              className="inline-flex items-center gap-2 bg-[#163C3A] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#2F6F8F] transition-all shrink-0 shadow-sm"
            >
              See All 6 Cases <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 4: STATISTIC CARD ($3B COST REDUCTION) & QUOTE CARD */}
      <section className="bg-[#EEF3F1]/70 border-t border-[#163C3A]/15 py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Statistic Card matching Moodboard */}
          <div className="river-card p-8 bg-white border border-[#163C3A]/15 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2 rounded-lg bg-[#EEF3F1] text-[#163C3A]">
                <BarChart3 className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono text-[#2F6F8F] font-semibold">+67% CapEx Saved</span>
            </div>
            <div className="text-6xl font-serif text-[#163C3A] font-light mb-2">$3B</div>
            <h4 className="text-base font-serif font-bold text-[#163C3A] mb-1">
              San Jose Airport Cost Optimization
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Capital expansion budget successfully reduced from $4.5B to $1.5B via transparent simulation
              modeling across 48 stakeholders while maintaining 100% required passenger throughput.
            </p>
          </div>

          {/* Quote Card matching Moodboard */}
          <div className="river-card p-8 bg-white border border-[#163C3A]/15 shadow-sm">
            <span className="text-5xl font-serif text-[#DDA6A0] block leading-none mb-2 font-light">
              “
            </span>
            <blockquote className="text-xl font-serif italic text-[#163C3A] leading-relaxed mb-4">
              "We structured thousands of micro-tests. If you make experimentation the foundational business
              model, market disruption follows naturally."
            </blockquote>
            <div className="w-12 h-0.5 bg-[#C99A4B] mb-2" />
            <cite className="text-xs font-mono uppercase tracking-wider text-[#85590A] font-semibold not-italic block">
              — Richard Fairbank, Founder of Capital One
            </cite>
          </div>
        </div>
      </section>
    </div>
  );
};
