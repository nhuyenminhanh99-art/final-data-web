import React from 'react';
import { BookOpen, Shield } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen text-[#1E2B26] pt-28 pb-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24">
        <header className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#85590A] font-semibold block mb-3">
            ✦ Project Philosophy & Origin ✦
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#1E2B26] mb-6">
            The River of Insights
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] italic font-serif leading-relaxed">
            "I am stepping into a memory I have never lived — a bright, clear, spring-morning memory."
          </p>
        </header>

        {/* Source Material Card */}
        <section className="river-card p-7 sm:p-10 md:p-12 border border-[#2F6F6A]/20 bg-white">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.18em] text-[#85590A] font-semibold mb-4">
            <BookOpen className="w-4 h-4 text-[#2F6F6A]" /> The Source Work
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#1E2B26] mb-4">
            Behind Every Good Decision
          </h2>
          <p className="text-sm md:text-base text-[#4F5E57] leading-relaxed mb-6 font-sans">
            This digital journey is an experiential adaptation of <strong>Chapters 7 through 11</strong> of
            the acclaimed text by <strong>Piyanka Jain & Puneet Sharma</strong>:
            <br />
            <em className="text-[#1E2B26]">
              Behind Every Good Decision: How Anyone Can Use Business Analytics to Turn Data into
              Profitable Insight (AMACOM).
            </em>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-[#8E9C96] border-t border-[#D5E2DE] pt-5">
            <div>
              <span className="text-[#1F4F4B] font-semibold block">Curriculum Scope:</span>
              <span>Chapters 7 – 11 (Analytics Leadership)</span>
            </div>
            <div>
              <span className="text-[#1F4F4B] font-semibold block">Target Audience:</span>
              <span>Analytics Directors, VPs, CDOs, and Business Executives</span>
            </div>
          </div>
        </section>

        {/* Design System & Metaphor */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1E2B26]">
            The River Metaphor & Design System
          </h2>
          <p className="text-sm md:text-base text-[#4F5E57] leading-relaxed">
            Rather than presenting another sterile dashboard or slide deck, we created a quiet,
            contemplative river where learning becomes an act of travel. Each region of the river
            reflects the psychological and organizational climate of an analytics leader's evolution:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            <div className="bg-white p-6 rounded-2xl border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_4px_12px_-2px_rgba(22,60,58,0.05)]">
              <span className="text-[#163C3A] block font-semibold mb-1.5 text-sm">Peach Village (Ch. 7)</span>
              <p className="text-[#4A5568] leading-relaxed">Warm morning light, blooming peach trees: the inception of data culture, leadership vision, and organizational foundations.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_4px_12px_-2px_rgba(22,60,58,0.05)]">
              <span className="text-[#163C3A] block font-semibold mb-1.5 text-sm">Bamboo Forest (Ch. 8)</span>
              <p className="text-[#4A5568] leading-relaxed">Dense stalks, shafts of light: discerning WHAT to do from WHO does it, cutting through the thicket of endless ad-hoc requests.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_4px_12px_-2px_rgba(22,60,58,0.05)]">
              <span className="text-[#163C3A] block font-semibold mb-1.5 text-sm">Mountain Valley (Ch. 9)</span>
              <p className="text-[#4A5568] leading-relaxed">Steep granite walls, rushing current: the rigorous climb of the 90-day playbook—30 days to diagnose, 60 days to execute.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_4px_12px_-2px_rgba(22,60,58,0.05)]">
              <span className="text-[#163C3A] block font-semibold mb-1.5 text-sm">Lantern Bridge (Ch. 10)</span>
              <p className="text-[#4A5568] leading-relaxed">Spanning arches, glowing lanterns: orchestrating 48 diverse stakeholders to achieve consensus on high-stakes capital investments.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_4px_12px_-2px_rgba(22,60,58,0.05)] md:col-span-2">
              <span className="text-[#163C3A] block font-semibold mb-1.5 text-sm">Forgotten Garden (Ch. 11)</span>
              <p className="text-[#4A5568] leading-relaxed">Overgrown ancient ruins: a cautionary contemplation of the 36 recurring pitfalls that have derailed past data science investments.</p>
            </div>
          </div>
        </section>

        {/* Accessibility & Inclusive Architecture */}
        <section className="bg-white p-7 md:p-10 rounded-2xl border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_6px_18px_-2px_rgba(22,60,58,0.06),0_16px_32px_-4px_rgba(22,60,58,0.04)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#85590A] font-semibold">
            <Shield className="w-4 h-4 text-[#2F6F6A]" /> Technical & Inclusive Principles
          </div>
          <h3 className="text-xl font-serif text-[#1E2B26]">Accessible by Design</h3>
          <p className="text-xs md:text-sm text-[#4F5E57] leading-relaxed">
            The 3D environment features high-fidelity procedural water dynamics, realistic wooden hull construction, and multi-tier blossom physics.
            For mobile users, low-memory devices, or those with motion sensitivity, the platform provides an instantaneous 2D Lite Journey fallback,
            while ensuring that every chapter and case study remains accessible as semantic, crawlable HTML.
          </p>
        </section>
      </article>
    </div>
  );
};
