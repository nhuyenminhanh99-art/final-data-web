import React, { useState } from 'react';
import {
  BigRocksJarWidget,
  TwoShoresWidget,
} from './ChapterInteractiveWidgets';
import {
  Sparkles,
  Users,
  Compass,
  TrendingUp,
  Shield,
  Layers,
  CheckCircle2,
  AlertCircle,
  Network,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface SignatureProps {
  chapterNumber: number;
}

export const ChapterSignatureVisuals: React.FC<SignatureProps> = ({ chapterNumber }) => {
  switch (chapterNumber) {
    case 7:
      return <Ch7PedestalVisual />;
    case 8:
      return (
        <div className="space-y-6">
          <Ch8OrgChartVisual />
          <BigRocksJarWidget />
          <TwoShoresWidget />
        </div>
      );
    case 9:
      return <Ch9PathVisual />;
    case 10:
      return <Ch10NetworkVisual />;
    case 11:
      return <Ch11FrostedGridVisual />;
    default:
      return null;
  }
};

/* Chapter 7: Round Pedestal with 4 Glowing Circular Medallions */
const Ch7PedestalVisual: React.FC = () => {
  const [selectedMedallion, setSelectedMedallion] = useState(0);

  const medallions = [
    {
      title: 'Leadership Vision',
      sub: 'Foundation 01',
      desc: 'Sponsorship that demands probabilistic thinking over intuition.',
      icon: <Sparkles className="w-5 h-5 text-[#C99A4B]" />,
    },
    {
      title: 'Analytics Talent',
      sub: 'Foundation 02',
      desc: 'The triad: Translators, Data Scientists, and Data Engineers.',
      icon: <Users className="w-5 h-5 text-[#2F6F8F]" />,
    },
    {
      title: 'Decision Culture',
      sub: 'Foundation 03',
      desc: 'Hypothesis-driven debates that eliminate HIPPO bias.',
      icon: <Compass className="w-5 h-5 text-[#163C3A]" />,
    },
    {
      title: 'Data Maturity',
      sub: 'Foundation 04',
      desc: 'Advancing from descriptive reporting to prescriptive action.',
      icon: <TrendingUp className="w-5 h-5 text-[#A9B8A6]" />,
    },
  ];

  return (
    <div className="river-card p-6 md:p-8 my-10 bg-gradient-to-b from-white via-[#EEF3F1]/40 to-white text-center relative overflow-hidden border border-[#163C3A]/15">
      <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#85590A] block mb-2 font-semibold">
        CHAPTER 7 SIGNATURE MOMENT
      </span>
      <h3 className="text-2xl font-serif text-[#163C3A] mb-6">
        The Four Foundations of Analytics Maturity
      </h3>

      {/* Marble/Stone Pedestal Ring with 4 Glowing Circular Medallions */}
      <div className="max-w-xl mx-auto py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {medallions.map((m, idx) => {
            const isSelected = selectedMedallion === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedMedallion(idx)}
                className={`p-4 rounded-2xl transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#163C3A] shadow-lg scale-105 ring-4 ring-[#163C3A]/10'
                    : 'bg-white/80 border border-[#163C3A]/15 hover:border-[#2F6F8F] hover:bg-white'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-inner ${
                    isSelected ? 'bg-[#EEF3F1] ring-2 ring-[#C99A4B]' : 'bg-[#FFFDF8]'
                  }`}
                >
                  {m.icon}
                </div>
                <span className="text-[10px] font-mono uppercase text-[#85590A] font-semibold block mb-0.5">
                  {m.sub}
                </span>
                <span className="text-xs font-serif font-bold text-[#163C3A] leading-tight">
                  {m.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Medallion Detail Callout */}
        <div className="mt-6 p-4 rounded-xl bg-[#EEF3F1] border border-[#163C3A]/15 animate-memory text-left flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#163C3A] mt-1 shrink-0" />
          <div>
            <strong className="text-sm text-[#163C3A] font-serif block">
              {medallions[selectedMedallion].title}:
            </strong>
            <p className="text-xs text-[#667085] leading-relaxed">
              {medallions[selectedMedallion].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Chapter 8: Organization Structure on a Misty Lake */
const Ch8OrgChartVisual: React.FC = () => {
  return (
    <div className="river-card p-6 md:p-8 my-10 bg-gradient-to-b from-[#FFFDF8] via-[#EEF3F1]/60 to-[#FFFDF8] border border-[#163C3A]/15">
      <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#85590A] block mb-2 font-semibold text-center">
        CHAPTER 8 SIGNATURE MOMENT
      </span>
      <h3 className="text-2xl font-serif text-[#163C3A] text-center mb-6">
        The Hybrid Hub-and-Spoke Governance Structure
      </h3>

      <div className="max-w-lg mx-auto flex flex-col items-center space-y-4">
        {/* Top Executive Node */}
        <div className="bg-[#163C3A] text-[#FFFDF8] px-6 py-3 rounded-2xl shadow-md border border-[#C99A4B]/40 text-center w-64">
          <span className="text-[10px] font-mono text-[#C99A4B] block uppercase tracking-wider font-semibold">
            Enterprise Leadership
          </span>
          <span className="font-serif text-base font-medium">C-Suite & Business Sponsors</span>
        </div>

        <div className="w-0.5 h-6 bg-[#2F6F8F]" />

        {/* Central Head of Analytics */}
        <div className="bg-white border-2 border-[#2F6F8F] text-[#163C3A] px-6 py-3.5 rounded-2xl shadow-md text-center w-72">
          <span className="text-[10px] font-mono text-[#2F6F8F] block uppercase tracking-wider font-semibold">
            Central Hub
          </span>
          <span className="font-serif text-lg font-bold">Head of Analytics</span>
          <span className="text-[11px] text-[#667085] block mt-0.5">Strategy · Delivery · Talent</span>
        </div>

        <div className="w-full flex justify-center items-center">
          <div className="w-48 h-0.5 bg-[#2F6F8F]/40" />
        </div>

        {/* Embedded Spoke Units */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <div className="bg-white p-3 rounded-xl border border-[#163C3A]/15 text-center shadow-sm">
            <span className="text-[9px] font-mono text-[#85590A] block uppercase font-semibold">Spoke 01</span>
            <span className="text-xs font-serif font-bold text-[#163C3A] block">Retail / Ops</span>
            <span className="text-[10px] text-[#667085]">Embedded Analysts</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#163C3A]/15 text-center shadow-sm">
            <span className="text-[9px] font-mono text-[#85590A] block uppercase font-semibold">Spoke 02</span>
            <span className="text-xs font-serif font-bold text-[#163C3A] block">Marketing</span>
            <span className="text-[10px] text-[#667085]">Embedded Analysts</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#163C3A]/15 text-center shadow-sm">
            <span className="text-[9px] font-mono text-[#85590A] block uppercase font-semibold">Spoke 03</span>
            <span className="text-xs font-serif font-bold text-[#163C3A] block">Product / Risk</span>
            <span className="text-[10px] text-[#667085]">Embedded Analysts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Chapter 9: River Ribbon Path with Map-Pins */
const Ch9PathVisual: React.FC = () => {
  const phases = [
    { days: 'Days 01 – 30', name: 'ASSESS', desc: 'Listen, audit data debt, map stakeholders' },
    { days: 'Days 31 – 60', name: 'PLAN & EARLY EXECUTION', desc: 'Prioritize Big Rocks, deliver validated quick-win' },
    { days: 'Days 61 – 90', name: 'DELIVER QUICK WINS & EMBED', desc: 'Formalize intake governance, charter team' },
    { days: 'Day 90+', name: 'SCALE', desc: 'Institutionalize operating cadence across line units' },
  ];

  return (
    <div className="river-card p-6 md:p-8 my-10 bg-white border border-[#163C3A]/15">
      <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#85590A] block mb-2 font-semibold text-center">
        CHAPTER 9 SIGNATURE MOMENT
      </span>
      <h3 className="text-2xl font-serif text-[#163C3A] text-center mb-6">
        The 90-Day Execution Ribbon
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((p, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#EEF3F1] border-l-4 border-l-[#163C3A] shadow-sm flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-mono text-[#85590A] uppercase tracking-wider font-semibold block mb-1">
                {p.days}
              </span>
              <h4 className="text-base font-serif font-bold text-[#163C3A] mb-2">{p.name}</h4>
              <p className="text-xs text-[#667085] leading-relaxed">{p.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#163C3A]/10 flex items-center justify-between text-[11px] font-mono text-[#2F6F8F]">
              <span>Milestone 0{idx + 1}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#163C3A]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Chapter 10: 48 Stakeholders Node Network */
const Ch10NetworkVisual: React.FC = () => {
  return (
    <div className="river-card p-6 md:p-8 my-10 bg-gradient-to-r from-white via-[#EEF3F1]/50 to-white border border-[#163C3A]/15 text-center">
      <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#85590A] block mb-2 font-semibold">
        CHAPTER 10 SIGNATURE MOMENT
      </span>
      <h3 className="text-2xl font-serif text-[#163C3A] mb-6">
        The San Jose Airport Stakeholder Network
      </h3>

      <div className="max-w-md mx-auto my-6 p-6 rounded-full bg-white border-2 border-[#C99A4B] shadow-xl relative flex flex-col items-center justify-center">
        <span className="text-5xl font-serif font-bold text-[#163C3A] tracking-tight">48</span>
        <span className="text-xs font-mono uppercase tracking-widest text-[#85590A] font-semibold mt-1">
          Diverse Stakeholders
        </span>
        <span className="text-[11px] text-[#667085] mt-1 max-w-xs text-center">
          Airlines · City Council · TSA · Pilots · Tenants
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mt-6">
        <div className="p-3 bg-white rounded-xl border border-[#163C3A]/15 shadow-sm">
          <span className="text-xl font-serif font-bold text-[#163C3A]">$4.5B</span>
          <span className="text-[10px] text-[#667085] block font-mono">Original Plan</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-[#163C3A]/15 shadow-sm">
          <span className="text-xl font-serif font-bold text-[#2F6F8F]">$1.5B</span>
          <span className="text-[10px] text-[#667085] block font-mono">Optimized CapEx</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-[#163C3A]/15 shadow-sm">
          <span className="text-xl font-serif font-bold text-[#85590A]">$3.0B</span>
          <span className="text-[10px] text-[#667085] block font-mono">Capital Saved</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-[#163C3A]/15 shadow-sm">
          <span className="text-xl font-serif font-bold text-[#163C3A]">100%</span>
          <span className="text-[10px] text-[#667085] block font-mono">Throughput Kept</span>
        </div>
      </div>
    </div>
  );
};

/* Chapter 11: 2x2 Frosted Glass Cards (Peach/Sage Tints) */
const Ch11FrostedGridVisual: React.FC = () => {
  const roles = [
    {
      role: 'Executive / Business Sponsor',
      pitfalls: '10 Pitfalls',
      example: 'Shiny Object Syndrome & starving data engineering.',
      color: 'bg-[#DDA6A0]/20 border-[#DDA6A0]/40',
      badge: 'Executive',
    },
    {
      role: 'Analytics Manager',
      pitfalls: '9 Pitfalls',
      example: 'Solving for math over ROI & neglecting change management.',
      color: 'bg-[#A9B8A6]/20 border-[#A9B8A6]/40',
      badge: 'Manager',
    },
    {
      role: 'Business Stakeholder',
      pitfalls: '9 Pitfalls',
      example: 'Data confirmation bias & analysis paralysis.',
      color: 'bg-[#DDA6A0]/20 border-[#DDA6A0]/40',
      badge: 'Partner',
    },
    {
      role: 'Data Analyst / Scientist',
      pitfalls: '8 Pitfalls',
      example: 'Data dump presentations & inability to quantify uncertainty.',
      color: 'bg-[#A9B8A6]/20 border-[#A9B8A6]/40',
      badge: 'Analyst',
    },
  ];

  return (
    <div className="river-card p-6 md:p-8 my-10 bg-white border border-[#163C3A]/15">
      <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#85590A] block mb-2 font-semibold text-center">
        CHAPTER 11 SIGNATURE MOMENT
      </span>
      <h3 className="text-2xl font-serif text-[#163C3A] text-center mb-6">
        The 36 Failure Modes Across Four Roles
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((r, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border ${r.color} backdrop-blur-md shadow-sm flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#163C3A]">
                  {r.badge}
                </span>
                <span className="text-xs font-mono text-[#A94A56] font-bold">{r.pitfalls}</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-[#163C3A] mb-2">{r.role}</h4>
              <p className="text-xs text-[#667085] leading-relaxed">{r.example}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#163C3A]/10 text-[11px] font-mono text-[#163C3A] flex items-center justify-between">
              <span>View detailed avoidance tips</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2F6F8F]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
