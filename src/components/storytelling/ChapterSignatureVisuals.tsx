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

const arrivalPalettes: Record<number, { sky: string; haze: string; ridge: string; bank: string; water: string; waterLight: string; accent: string }> = {
  7: { sky: '#F8E9DA', haze: '#E6C7AF', ridge: '#B6C9AD', bank: '#78927B', water: '#4D8FA0', waterLight: '#B6D8D3', accent: '#C77E62' },
  8: { sky: '#E4EFEA', haze: '#C8DDD2', ridge: '#8FAA91', bank: '#52745E', water: '#437F86', waterLight: '#A7D0C9', accent: '#D1B278' },
  9: { sky: '#E8EFF1', haze: '#C8D6D7', ridge: '#91A6A5', bank: '#657E75', water: '#4D8290', waterLight: '#B0D3D2', accent: '#D7B875' },
  10: { sky: '#F4EADB', haze: '#DCC6A5', ridge: '#A9B8A7', bank: '#617E70', water: '#397C88', waterLight: '#A7D0CC', accent: '#D7A554' },
  11: { sky: '#EAEDE2', haze: '#D4D9C4', ridge: '#A7B49B', bank: '#657D68', water: '#477F83', waterLight: '#B2D3C8', accent: '#C58D70' },
};

/** Lightweight, decorative chapter landscapes. All movement is CSS-only and
 * deliberately slow so the scene feels alive without adding another render loop. */
export const ChapterArrivalScene: React.FC<SignatureProps> = ({ chapterNumber }) => {
  const palette = arrivalPalettes[chapterNumber] ?? arrivalPalettes[7];
  const sceneId = `chapter-arrival-${chapterNumber}`;

  return (
    <div className="chapter-arrival-scene" data-scene-chapter={chapterNumber} aria-hidden="true">
      <svg className="chapter-arrival-art" viewBox="0 0 760 480" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id={`${sceneId}-sky`} x1="0" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor={palette.sky} />
            <stop offset="1" stopColor={palette.haze} />
          </linearGradient>
          <linearGradient id={`${sceneId}-water`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.waterLight} />
            <stop offset="1" stopColor={palette.water} />
          </linearGradient>
          <linearGradient id={`${sceneId}-mist`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFDF8" stopOpacity="0.72" />
            <stop offset="0.46" stopColor="#FFFDF8" stopOpacity="0.04" />
            <stop offset="1" stopColor="#FFFDF8" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${sceneId}-clip`}>
            <rect width="760" height="480" rx="24" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${sceneId}-clip)`}>
          <rect width="760" height="480" fill={`url(#${sceneId}-sky)`} />
          <circle cx="590" cy="104" r="48" fill="#FFF8E9" opacity="0.58" />
          <circle cx="590" cy="104" r="68" fill="#FFF8E9" opacity="0.16" />

          <g className="chapter-scene-cloud chapter-scene-cloud--one" fill="#FFFDF8" opacity="0.46">
            <path d="M425 94c8-19 35-22 47-6 14-12 37-4 39 14 19 2 25 24 10 34H426c-22-4-22-36-1-42Z" />
          </g>
          <g className="chapter-scene-cloud chapter-scene-cloud--two" fill="#FFFDF8" opacity="0.32">
            <path d="M150 129c7-14 27-16 36-4 12-9 29-3 31 11 15 2 19 18 8 26H151c-17-3-17-27-1-33Z" />
          </g>

          {chapterNumber === 9 ? (
            <g fill={palette.ridge} opacity="0.84">
              <path d="m-30 259 122-139 46 54 72-105 124 190Z" />
              <path d="m280 254 147-175 75 86 74-70 207 170Z" opacity="0.68" />
              <path d="m72 120 20-1 18 22-25-8Zm138-51 22-1 30 45-34-26Z" fill="#F9F6EC" opacity="0.7" />
            </g>
          ) : (
            <g fill={palette.ridge} opacity="0.78">
              <path d="M-30 250c89-91 158-98 250-35 83-65 169-69 257-12 86-57 183-47 313 34v60H-30Z" />
              <path d="M-10 242c93-52 156-56 235-17 78-43 164-46 250-6 79-41 159-38 270 10v42H-10Z" fill="#D9DFCD" opacity="0.56" />
            </g>
          )}

          {/* Chapter 7: a quiet riverside village and its orchard. */}
          {chapterNumber === 7 && (
            <g className="chapter-scene-landmark" fill="#9B755E">
              <path d="M504 222v-52l42-35 44 35v52Z" fill="#E7D3B8" />
              <path d="m493 173 52-46 57 46-9 9-48-36-44 36Z" fill="#8D6B56" />
              <path d="M534 222v-30q12-17 24 0v30Z" fill="#8B7660" />
              <path d="M602 224v-36l31-25 32 25v36Z" fill="#F0DCC4" />
              <path d="m595 192 38-32 40 32-7 7-33-25-31 25Z" fill="#9D755D" />
              <g fill={palette.accent}>
                <circle cx="471" cy="191" r="11" /><circle cx="489" cy="183" r="9" />
                <circle cx="459" cy="207" r="8" /><circle cx="485" cy="210" r="7" />
              </g>
            </g>
          )}

          {/* Chapter 8: layered bamboo trunks and leaves along the bank. */}
          {chapterNumber === 8 && (
            <g className="chapter-scene-landmark" stroke={palette.bank} strokeLinecap="round" fill="none">
              <path d="M522 266V74m0 65h18m-18 47h-16m67 80V49m0 83h17m-17 53h-18m62 77V96m0 52h16" strokeWidth="9" />
              <path d="m522 108-31-29m31 50 31-28m-31 83-29-22m82-49 28-31m-28 64-32-21m94 50 27-30m-27 59-33-22" strokeWidth="4" />
              <path d="M520 72h5m61-26h5m62 46h5" stroke="#D3B978" strokeWidth="5" />
            </g>
          )}

          {/* Chapter 9: small trail markers echo the long valley passage. */}
          {chapterNumber === 9 && (
            <g className="chapter-scene-landmark">
              {[0, 1, 2, 3].map((marker) => (
                <g key={marker} transform={`translate(${418 + marker * 48} ${211 - marker * 12})`}>
                  <path d="M0 0v55" stroke="#6D6550" strokeWidth="4" />
                  <path d="M2 2h24l-8 10 8 10H2Z" fill={marker === 3 ? palette.accent : '#F6E7C8'} />
                  <circle cx="1" cy="56" r="5" fill="#6D6550" />
                </g>
              ))}
            </g>
          )}

          {/* Chapter 10: the lantern bridge marks the next river station. */}
          {chapterNumber === 10 && (
            <g className="chapter-scene-landmark" fill="none" strokeLinecap="round">
              <path d="M420 242q128-126 272 0" stroke="#776550" strokeWidth="13" />
              <path d="M435 243q113-103 245 0" stroke="#E8D7B9" strokeWidth="4" opacity="0.8" />
              <path d="M446 217v41m69-74v60m74-54v57m72-37v45" stroke="#806B53" strokeWidth="7" />
              {[458, 515, 574, 632].map((x, index) => (
                <g key={x} className="chapter-scene-lantern" style={{ animationDelay: `${index * 260}ms` }} transform={`translate(${x} ${188 + Math.abs(545 - x) * 0.15})`}>
                  <path d="M0-12v8m-8 0h16l-2 18H-6Z" fill="#D5A45D" stroke="#8C7452" strokeWidth="2" />
                  <circle cy="2" r="13" fill="#F2CC83" opacity="0.18" stroke="none" />
                </g>
              ))}
            </g>
          )}

          {/* Chapter 11: an old garden gate softened by climbing vines. */}
          {chapterNumber === 11 && (
            <g className="chapter-scene-landmark" fill="none" strokeLinecap="round">
              <path d="M510 244v-56q5-77 77-77t77 77v56" stroke="#8C8170" strokeWidth="12" />
              <path d="M531 242v-52q5-54 56-54t55 54v52" stroke="#D6D0BD" strokeWidth="5" />
              <path d="M523 206q28-11 29-48m-17 58q39-5 47-44m65 31q-27-12-28-46m13 60q-37-7-43-43" stroke="#66816B" strokeWidth="5" />
              <g fill={palette.accent} stroke="none">
                <circle cx="529" cy="181" r="7" /><circle cx="565" cy="174" r="6" />
                <circle cx="649" cy="179" r="7" /><circle cx="619" cy="191" r="6" />
              </g>
            </g>
          )}

          {/* Riverbanks and the winding water channel. */}
          <path d="M-24 263c131 12 208 66 312 56 105-10 165-76 273-72 93 4 133 53 223 51v202H-24Z" fill={palette.bank} opacity="0.58" />
          <path d="M-20 302c112-32 190 38 299 26 117-13 170-85 284-69 79 11 122 51 217 40v181H-20Z" fill={`url(#${sceneId}-water)`} />
          <path d="M-20 335c121-35 189 23 303 13 111-10 175-69 283-55 77 10 128 40 214 32" fill="none" stroke="#E8F4EC" strokeWidth="3" opacity="0.54" strokeDasharray="45 22" className="chapter-scene-current" />
          <path d="M-10 383c115-29 187 17 284 10 115-9 185-52 284-42 80 8 141 32 224 24" fill="none" stroke="#E8F4EC" strokeWidth="2" opacity="0.35" strokeDasharray="68 34" className="chapter-scene-current chapter-scene-current--slow" />

          {/* Quiet shoreline plants frame the scene without competing with copy. */}
          <g fill={palette.bank} opacity="0.94">
            <path d="M0 330q11-46 23-56 7 32 3 59 18-41 38-44-2 32-26 55 29-23 48-17-14 29-53 39H0Z" />
            <path d="M672 286q-3-39 12-59 14 27 9 51 18-30 36-30-1 27-27 48 28-17 48-10-17 27-52 34h-29Z" />
          </g>

          {/* A small boat, distant birds, and drifting blossoms animate slowly. */}
          <g className="chapter-scene-sailboat">
            <path d="m366 329 54 0-9 13h-39Z" fill="#74553C" />
            <path d="M393 326v-32m2 2 21 23h-21Z" fill="#FFF7E7" opacity="0.92" />
            <path d="M392 297v-7h6v7" fill={palette.accent} />
            <path d="M374 340q19 7 39 0" fill="none" stroke="#E8F4EC" strokeWidth="2" opacity="0.7" />
          </g>
          <g className="chapter-scene-birds" fill="none" stroke="#546B67" strokeWidth="3" strokeLinecap="round" opacity="0.6">
            <path d="m278 171 10-8 10 8m8-14 8-7 8 7" />
            <path d="m348 184 7-6 8 6" />
          </g>
          <g transform="translate(520 286)" className="chapter-scene-petal chapter-scene-petal--one" fill={palette.accent} opacity="0.8"><path d="M0-7q8 3 0 9-8-6 0-9Z" /></g>
          <g transform="translate(604 272)" className="chapter-scene-petal chapter-scene-petal--two" fill="#E6CBA6" opacity="0.75"><path d="M0-6q7 3 0 8-7-5 0-8Z" /></g>
          <g transform="translate(446 295)" className="chapter-scene-petal chapter-scene-petal--three" fill="#FFF5E6" opacity="0.9"><path d="M0-5q6 3 0 7-6-4 0-7Z" /></g>
          <rect width="760" height="480" fill={`url(#${sceneId}-mist)`} />
        </g>
      </svg>
    </div>
  );
};

export const ChapterSignatureVisuals: React.FC<SignatureProps> = ({ chapterNumber }) => {
  switch (chapterNumber) {
    case 7:
      return <Ch7PedestalVisual />;
    case 8:
      return (
        <div className="space-y-16 sm:space-y-20">
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

/* Chapter 7: Architectural Pedestal of Analytics Maturity */
const Ch7PedestalVisual: React.FC = () => {
  const [activeFoundation, setActiveFoundation] = useState<number | null>(null);

  const foundations = [
    {
      num: '01',
      title: 'Leadership & Vision',
      sub: 'Foundation 01 · Alignment',
      lead: 'Sponsorship that demands probabilistic thinking over intuition.',
      detail:
        'Mandates active executive sponsorship, clear North Star metrics, and explicit business stakeholder co-ownership before mathematical modeling commences.',
      icon: <Sparkles className="w-5 h-5 text-[#C99A4B]" />,
      accent: 'border-t-[#C99A4B]',
    },
    {
      num: '02',
      title: 'Analytics Talent',
      sub: 'Foundation 02 · Capability',
      lead: 'The organizational triad: Translators, Data Scientists, and Data Engineers.',
      detail:
        'Eliminates reliance on a lone "unicorn." Deploys Business Translators to frame commercial stakes, Data Scientists to design models, and Data Engineers for resilient pipelines.',
      icon: <Users className="w-5 h-5 text-[#2F6F8F]" />,
      accent: 'border-t-[#2F6F8F]',
    },
    {
      num: '03',
      title: 'Decision Culture',
      sub: 'Foundation 03 · Governance',
      lead: 'Hypothesis-driven debates that eliminate executive HIPPO bias.',
      detail:
        'Transitions corporate culture from highest-paid opinions to empirical testing. Rewards structured experiments that disprove assumptions as vigorously as quick wins.',
      icon: <Compass className="w-5 h-5 text-[#163C3A]" />,
      accent: 'border-t-[#163C3A]',
    },
    {
      num: '04',
      title: 'Data Maturity',
      sub: 'Foundation 04 · Prescriptive ROI',
      lead: 'Advancing from descriptive reporting to prescriptive forward action.',
      detail:
        'Guides progression through Descriptive, Diagnostic, and Predictive stages to allocate 70% of analytical effort on Prescriptive commercial action rather than rear-view mirrors.',
      icon: <TrendingUp className="w-5 h-5 text-[#6B4A32]" />,
      accent: 'border-t-[#6B4A32]',
    },
  ];

  return (
    <section className="chapter-visual chapter-visual--foundations editorial-elevated p-8 sm:p-11 md:p-14 my-16 sm:my-20 bg-white border border-[#163C3A]/14 shadow-[0_1px_3px_rgba(22,60,58,0.04),0_6px_18px_-2px_rgba(22,60,58,0.06),0_16px_32px_-4px_rgba(22,60,58,0.04)] relative overflow-hidden">
      {/* Decorative top ambient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C99A4B] via-[#2F6F8F] to-[#163C3A]" />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] block mb-2 font-semibold font-sans">
          ✦ CHAPTER 07 FOUNDATIONAL ARCHITECTURE ✦
        </span>
        <h3 className="text-3xl sm:text-4xl font-serif text-[#163C3A] mb-3 font-normal leading-tight">
          The Four Foundations of Analytics Maturity
        </h3>
        <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
          Analytics capability is not an IT utility—it is an interdependent operational architecture.
        </p>
      </div>

      {/* Four Interdependent Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {foundations.map((f, idx) => {
          const isOpen = activeFoundation === idx;
          const panelId = `foundation-detail-${f.num}`;
          return (
            <div
              key={f.num}
              className={`p-6 sm:p-7 rounded-2xl border-t-4 ${f.accent} border-x border-b border-[#163C3A]/12 bg-[#FFFDF9] flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md ${
                isOpen ? 'ring-2 ring-[#2F6F8F]/30 bg-white' : 'hover:border-[#163C3A]/25'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-serif text-[#C99A4B] font-light leading-none">
                    {f.num}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#EEF3F1] flex items-center justify-center shadow-xs">
                    {f.icon}
                  </div>
                </div>

                <span className="text-[11px] uppercase tracking-wider text-[#85590A] font-semibold block mb-1 font-sans">
                  {f.sub}
                </span>

                <h4 className="text-xl font-serif text-[#163C3A] mb-3 font-normal leading-snug">
                  {f.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-sans mb-4">
                  {f.lead}
                </p>
              </div>

              <div className="pt-4 border-t border-[#163C3A]/10 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveFoundation(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full inline-flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#2F6F8F] hover:text-[#163C3A] transition-colors py-1 cursor-pointer font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded-lg"
                >
                  <span>{isOpen ? 'Close Criteria' : 'Explore Criteria'}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-label={`${f.title} Operational Criteria`}
                    className="mt-3 p-3.5 rounded-xl bg-[#EEF3F1]/80 border border-[#163C3A]/10 text-xs text-[#163C3A] leading-relaxed font-sans animate-memory"
                  >
                    <span className="font-semibold block mb-1 text-[#85590A]">Operational Mandate:</span>
                    {f.detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* Chapter 8: Organization Structure on a Misty Lake */
const Ch8OrgChartVisual: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<'exec' | 'hub' | 'spoke1' | 'spoke2' | 'spoke3' | null>(null);

  const nodeDetails: Record<string, { title: string; role: string; mandate: string }> = {
    exec: {
      title: 'Enterprise C-Suite & Business Sponsors',
      role: 'Capital Allocation & Strategic Intent',
      mandate: 'Sets high-level business objectives, funds analytical infrastructure, and removes cross-silo barriers.',
    },
    hub: {
      title: 'Central Hub: Head of Analytics',
      role: 'Methodological Governance & Capacity Allocation',
      mandate: 'Preserves technical rigor, manages enterprise analytics talent, and enforces the 70/20/10 prioritization rule.',
    },
    spoke1: {
      title: 'Retail & Operational Unit Spoke',
      role: 'Embedded Line Analysts',
      mandate: 'Sits directly in operations standups to rapidly translate business bottlenecks into hypotheses.',
    },
    spoke2: {
      title: 'Marketing & Growth Unit Spoke',
      role: 'Embedded Commercial Analysts',
      mandate: 'Partners with marketing leads on customer segmentation, experimentation velocity, and campaign ROI.',
    },
    spoke3: {
      title: 'Product & Risk Unit Spoke',
      role: 'Embedded Product Analysts',
      mandate: 'Collaborates with product management on user funnels, churn probability, and portfolio risk tolerance.',
    },
  };

  return (
    <section className="chapter-visual chapter-visual--organization p-8 sm:p-12 md:p-14 my-18 sm:my-24 bg-white border border-[#163C3A]/15 rounded-3xl shadow-[0_2px_8px_rgba(22,60,58,0.04),0_12px_28px_-4px_rgba(22,60,58,0.06)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C99A4B] via-[#2F6F8F] to-[#163C3A]" />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] block mb-2 font-semibold font-sans">
          ✦ CHAPTER 08 ORGANIZATIONAL BLUEPRINT ✦
        </span>
        <h3 className="text-3xl sm:text-4xl font-serif text-[#163C3A] mb-3 font-normal">
          The Hybrid Hub-and-Spoke Governance Structure
        </h3>
        <p className="text-sm sm:text-base text-[#4A5568] font-sans">
          Balancing centralized methodological excellence with decentralized commercial intimacy. Click any unit to inspect its mandate.
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center space-y-6">
        {/* Top Executive Node */}
        <div
          onClick={() => setSelectedNode(selectedNode === 'exec' ? null : 'exec')}
          className={`p-5 rounded-2xl shadow-sm text-center w-72 sm:w-80 cursor-pointer transition-all ${
            selectedNode === 'exec'
              ? 'bg-[#163C3A] text-white ring-4 ring-[#C99A4B]/40 scale-105'
              : 'bg-[#163C3A] text-white hover:bg-[#1D4A48]'
          }`}
        >
          <span className="text-[11px] text-[#C99A4B] block uppercase tracking-wider font-semibold font-sans mb-1">
            Enterprise Leadership
          </span>
          <span className="font-serif text-lg font-normal block">C-Suite & Business Sponsors</span>
          <span className="text-[11px] text-[#E1EDF2]/80 mt-1 block">Click to inspect governance</span>
        </div>

        <div className="w-0.5 h-7 bg-[#2F6F8F]" />

        {/* Central Head of Analytics */}
        <div
          onClick={() => setSelectedNode(selectedNode === 'hub' ? null : 'hub')}
          className={`p-6 rounded-2xl shadow-sm text-center w-80 sm:w-96 cursor-pointer transition-all border-2 ${
            selectedNode === 'hub'
              ? 'bg-white border-[#C99A4B] ring-4 ring-[#C99A4B]/30 scale-105'
              : 'bg-[#FAF6EE] border-[#2F6F8F] hover:border-[#163C3A]'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2F6F8F] animate-pulse" />
            <span className="text-[11px] text-[#2F6F8F] uppercase tracking-wider font-semibold font-sans">
              Central Methodological Hub
            </span>
          </div>
          <span className="font-serif text-2xl font-normal text-[#163C3A] block">Head of Analytics</span>
          <span className="text-xs text-[#718096] block mt-1.5 font-sans">
            Strategy Steward · Talent Engine · Methodological Arbiter
          </span>
        </div>

        <div className="w-full flex justify-center items-center">
          <div className="w-3/4 h-0.5 bg-[#2F6F8F]/30" />
        </div>

        {/* Embedded Spoke Units */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <div
            onClick={() => setSelectedNode(selectedNode === 'spoke1' ? null : 'spoke1')}
            className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedNode === 'spoke1'
                ? 'bg-white border-[#2F6F8F] ring-3 ring-[#2F6F8F]/30 shadow-md'
                : 'bg-[#F9FAF8] border-[#163C3A]/15 hover:border-[#163C3A]/30'
            }`}
          >
            <span className="text-[10px] text-[#85590A] block uppercase tracking-wider font-semibold font-sans mb-1">
              Spoke 01
            </span>
            <span className="text-base font-serif font-normal text-[#163C3A] block">Retail & Operations</span>
            <span className="text-xs text-[#718096] font-sans mt-1 block">Embedded Analysts</span>
          </div>

          <div
            onClick={() => setSelectedNode(selectedNode === 'spoke2' ? null : 'spoke2')}
            className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedNode === 'spoke2'
                ? 'bg-white border-[#2F6F8F] ring-3 ring-[#2F6F8F]/30 shadow-md'
                : 'bg-[#F9FAF8] border-[#163C3A]/15 hover:border-[#163C3A]/30'
            }`}
          >
            <span className="text-[10px] text-[#85590A] block uppercase tracking-wider font-semibold font-sans mb-1">
              Spoke 02
            </span>
            <span className="text-base font-serif font-normal text-[#163C3A] block">Marketing & Growth</span>
            <span className="text-xs text-[#718096] font-sans mt-1 block">Embedded Analysts</span>
          </div>

          <div
            onClick={() => setSelectedNode(selectedNode === 'spoke3' ? null : 'spoke3')}
            className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedNode === 'spoke3'
                ? 'bg-white border-[#2F6F8F] ring-3 ring-[#2F6F8F]/30 shadow-md'
                : 'bg-[#F9FAF8] border-[#163C3A]/15 hover:border-[#163C3A]/30'
            }`}
          >
            <span className="text-[10px] text-[#85590A] block uppercase tracking-wider font-semibold font-sans mb-1">
              Spoke 03
            </span>
            <span className="text-base font-serif font-normal text-[#163C3A] block">Product & Risk</span>
            <span className="text-xs text-[#718096] font-sans mt-1 block">Embedded Analysts</span>
          </div>
        </div>

        {/* Selected Node Mandate Drawer */}
        {selectedNode && (
          <div className="w-full mt-6 p-6 sm:p-7 rounded-2xl bg-[#FAF6EE] border-l-4 border-l-[#C99A4B] border-y border-r border-[#C99A4B]/30 shadow-md animate-memory text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#85590A] font-sans">
                {nodeDetails[selectedNode].role}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-xs text-[#718096] hover:text-[#163C3A] uppercase tracking-wider font-semibold cursor-pointer font-sans"
              >
                Close ✕
              </button>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif text-[#163C3A] mb-2 font-normal">
              {nodeDetails[selectedNode].title}
            </h4>
            <p className="text-sm sm:text-base text-[#2D3748] leading-relaxed font-sans">
              {nodeDetails[selectedNode].mandate}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

/* Chapter 9: River Ribbon Path with Map-Pins */
const Ch9PathVisual: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const phases = [
    {
      days: 'Days 01 – 30',
      name: 'ASSESS & DISCOVER',
      desc: 'Listen, audit data debt, map business sponsors, and catalog active analytic requests.',
      milestone: 'Stakeholder Map & Data Debt Audit Complete',
    },
    {
      days: 'Days 31 – 60',
      name: 'PLAN & EARLY WIN',
      desc: 'Prioritize Big Rocks with business sponsors; execute a single high-visibility quick win.',
      milestone: 'First Validated Business ROI Delivered',
    },
    {
      days: 'Days 61 – 90',
      name: 'EMBED & GOVERN',
      desc: 'Formalize request intake governance, charter team roles, and launch BADIR workflow.',
      milestone: 'Formal Intake Protocol Operationalized',
    },
    {
      days: 'Day 90+',
      name: 'SCALE & ACCELERATE',
      desc: 'Institutionalize monthly steering cadence across line units and invest in self-service tools.',
      milestone: 'Autonomous Cross-Functional Rhythm',
    },
  ];

  return (
    <section className="chapter-visual chapter-visual--timeline p-8 sm:p-12 md:p-14 my-18 sm:my-24 bg-white border border-[#163C3A]/15 rounded-3xl shadow-[0_2px_8px_rgba(22,60,58,0.04),0_12px_28px_-4px_rgba(22,60,58,0.06)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2F6F8F] via-[#C99A4B] to-[#163C3A]" />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] block mb-2 font-semibold font-sans">
          ✦ CHAPTER 09 OPERATIONAL BLUEPRINT ✦
        </span>
        <h3 className="text-3xl sm:text-4xl font-serif text-[#163C3A] mb-3 font-normal">
          The 90-Day Execution Ribbon
        </h3>
        <p className="text-sm sm:text-base text-[#4A5568] font-sans">
          A phased journey to establish credibility, deliver tangible ROI, and formalize analytics governance. Click a phase to inspect.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {phases.map((p, idx) => {
          const isSelected = selectedPhase === idx;
          return (
            <div
              key={idx}
              onClick={() => setSelectedPhase(isSelected ? null : idx)}
              className={`p-7 rounded-2xl border-t-4 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'border-t-[#C99A4B] border-x border-b border-[#C99A4B]/30 bg-[#FAF6EE] ring-3 ring-[#C99A4B]/30 -translate-y-1'
                  : 'border-t-[#163C3A] border-x border-b border-[#163C3A]/12 bg-[#F9FAF8] hover:border-[#163C3A]/30 hover:-translate-y-0.5'
              }`}
            >
              <div>
                <span className="text-xs text-[#85590A] uppercase tracking-wider font-semibold block mb-2 font-sans">
                  {p.days}
                </span>
                <h4 className="text-xl font-serif font-normal text-[#163C3A] mb-3 leading-snug">
                  {p.name}
                </h4>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-sans">{p.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#163C3A]/10 flex items-center justify-between text-xs text-[#2F6F8F] font-medium font-sans">
                <span>Phase 0{idx + 1}</span>
                <CheckCircle2 className="w-4 h-4 text-[#163C3A]" />
              </div>
            </div>
          );
        })}
      </div>

      {selectedPhase !== null && (
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#FAF6EE] border-l-4 border-l-[#C99A4B] border-y border-r border-[#C99A4B]/30 shadow-md animate-memory">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[#85590A] font-semibold font-sans">
              Key Milestone Gate · {phases[selectedPhase].days}
            </span>
            <button
              type="button"
              onClick={() => setSelectedPhase(null)}
              className="text-xs text-[#718096] hover:text-[#163C3A] uppercase tracking-wider font-semibold cursor-pointer font-sans"
            >
              Close ✕
            </button>
          </div>
          <h4 className="text-2xl font-serif text-[#163C3A] mb-2 font-normal">
            {phases[selectedPhase].milestone}
          </h4>
          <p className="text-sm sm:text-base text-[#2D3748] leading-relaxed font-sans">
            {phases[selectedPhase].desc}
          </p>
        </div>
      )}
    </section>
  );
};

/* Chapter 10: 48 Stakeholders Node Network */
const Ch10NetworkVisual: React.FC = () => {
  return (
    <section className="chapter-visual chapter-visual--impact p-8 sm:p-12 md:p-14 my-18 sm:my-24 bg-white border border-[#163C3A]/15 rounded-3xl text-center shadow-[0_2px_8px_rgba(22,60,58,0.04),0_12px_28px_-4px_rgba(22,60,58,0.06)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#163C3A] via-[#C99A4B] to-[#2F6F8F]" />

      <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] block mb-2 font-semibold font-sans">
        ✦ CHAPTER 10 SIGNATURE MOMENT ✦
      </span>
      <h3 className="text-3xl sm:text-4xl font-serif text-[#163C3A] mb-4 font-normal">
        The San Jose Airport Stakeholder Network
      </h3>
      <p className="text-sm sm:text-base text-[#4A5568] max-w-2xl mx-auto mb-10 font-sans">
        How predictive dwell modeling aligned 48 competing stakeholder groups and saved $3.0B in municipal capital.
      </p>

      {/* Central Hub Node */}
      <div className="max-w-md mx-auto my-8 p-10 rounded-3xl bg-gradient-to-b from-[#FAF6EE] to-white border-2 border-[#C99A4B] shadow-md relative flex flex-col items-center justify-center">
        <span className="text-6xl sm:text-7xl font-serif font-light text-[#163C3A] tracking-tight">48</span>
        <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] font-semibold mt-2 font-sans">
          Diverse Stakeholders
        </span>
        <span className="text-xs sm:text-sm text-[#4A5568] mt-3 max-w-xs text-center leading-relaxed font-sans">
          Commercial Airlines · City Council · TSA · Pilots Association · Airport Tenants
        </span>
      </div>

      {/* High-Impact Numeric CapEx Comparison */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 max-w-3xl mx-auto mt-12">
        <div className="p-6 bg-[#F9FAF8] rounded-2xl border border-[#163C3A]/12 shadow-xs">
          <span className="text-3xl sm:text-4xl font-serif font-light text-[#163C3A]">$4.5B</span>
          <span className="text-xs text-[#718096] block mt-1.5 font-sans">Original CapEx Plan</span>
        </div>
        <div className="p-6 bg-white rounded-2xl border-2 border-[#2F6F8F] shadow-sm">
          <span className="text-3xl sm:text-4xl font-serif font-normal text-[#2F6F8F]">$1.5B</span>
          <span className="text-xs text-[#2F6F8F] font-medium block mt-1.5 font-sans">Optimized CapEx</span>
        </div>
        <div className="p-6 bg-[#FAF6EE] rounded-2xl border border-[#C99A4B]/40 shadow-xs">
          <span className="text-3xl sm:text-4xl font-serif font-normal text-[#85590A]">$3.0B</span>
          <span className="text-xs text-[#85590A] font-medium block mt-1.5 font-sans">Capital Saved</span>
        </div>
        <div className="p-6 bg-[#F9FAF8] rounded-2xl border border-[#163C3A]/12 shadow-xs">
          <span className="text-3xl sm:text-4xl font-serif font-light text-[#163C3A]">100%</span>
          <span className="text-xs text-[#718096] block mt-1.5 font-sans">Passenger Throughput Kept</span>
        </div>
      </div>
    </section>
  );
};

/* Chapter 11: Failure Modes Across Roles */
const Ch11FrostedGridVisual: React.FC = () => {
  const [activeRoleIdx, setActiveRoleIdx] = useState<number | null>(null);

  const roles = [
    {
      role: 'Executive / Business Sponsor',
      pitfalls: '10 Pitfalls',
      example: 'Shiny Object Syndrome (chasing buzzwords) & starving data infrastructure.',
      color: 'border-t-[#A94A56] bg-[#FFF7F6]',
      badge: 'Executive Sponsor',
      focus: 'Demands shiny AI algorithms before basic data governance is in place, creating high-cost orphan projects.',
    },
    {
      role: 'Analytics Manager',
      pitfalls: '9 Pitfalls',
      example: 'Solving for mathematical sophistication over ROI & neglecting change management.',
      color: 'border-t-[#163C3A] bg-[#F4F8F7]',
      badge: 'Analytics Manager',
      focus: 'Builds complex predictive models that line managers cannot interpret or integrate into workflows.',
    },
    {
      role: 'Business Stakeholder',
      pitfalls: '9 Pitfalls',
      example: 'Weaponizing analytics (confirmation bias) & paralysis by analysis.',
      color: 'border-t-[#A94A56] bg-[#FFF7F6]',
      badge: 'Business Partner',
      focus: 'Demands data only to validate pre-ordained political conclusions, ignoring disconfirming evidence.',
    },
    {
      role: 'Data Analyst / Scientist',
      pitfalls: '8 Pitfalls',
      example: 'The "Data Dump" presentation & inability to quantify uncertainty.',
      color: 'border-t-[#163C3A] bg-[#F4F8F7]',
      badge: 'Data Analyst',
      focus: 'Delivers 50-slide technical slide decks without answering the single core commercial question.',
    },
  ];

  return (
    <section className="chapter-visual chapter-visual--pitfalls p-8 sm:p-12 md:p-14 my-18 sm:my-24 bg-white border border-[#163C3A]/15 rounded-3xl shadow-[0_2px_8px_rgba(22,60,58,0.04),0_12px_28px_-4px_rgba(22,60,58,0.06)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A94A56] via-[#C99A4B] to-[#163C3A]" />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] block mb-2 font-semibold font-sans">
          ✦ CHAPTER 11 DIAGNOSTIC BLUEPRINT ✦
        </span>
        <h3 className="text-3xl sm:text-4xl font-serif text-[#163C3A] mb-3 font-normal">
          The 36 Failure Modes Across Four Roles
        </h3>
        <p className="text-sm sm:text-base text-[#4A5568] font-sans">
          Analytics initiatives fail not from bad algorithms, but from predictable friction between stakeholder archetypes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
        {roles.map((r, idx) => {
          const isSelected = activeRoleIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveRoleIdx(isSelected ? null : idx)}
              className={`p-7 sm:p-8 rounded-2xl border-t-4 ${r.color} border-x border-b border-[#163C3A]/12 shadow-xs flex flex-col justify-between cursor-pointer transition-all ${
                isSelected ? 'ring-3 ring-[#163C3A]/30 bg-white' : 'hover:border-[#163C3A]/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#163C3A] font-sans">
                    {r.badge}
                  </span>
                  <span className="text-xs text-[#A94A56] font-semibold font-sans px-2.5 py-0.5 rounded-full bg-white border border-[#A94A56]/20">
                    {r.pitfalls}
                  </span>
                </div>
                <h4 className="text-2xl font-serif text-[#163C3A] mb-3 font-normal leading-snug">
                  {r.role}
                </h4>
                <p className="text-sm text-[#4A5568] leading-relaxed font-sans">{r.example}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#163C3A]/10 text-xs text-[#2F6F8F] font-semibold uppercase tracking-wider font-sans flex items-center justify-between">
                <span>{isSelected ? 'Close Risk Profile' : 'Inspect Risk Profile'}</span>
                <ArrowRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isSelected ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {activeRoleIdx !== null && (
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#FAF6EE] border-l-4 border-l-[#A94A56] border-y border-r border-[#A94A56]/30 shadow-md animate-memory text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[#A94A56] font-semibold font-sans">
              Critical Risk Pattern · {roles[activeRoleIdx].role}
            </span>
            <button
              type="button"
              onClick={() => setActiveRoleIdx(null)}
              className="text-xs text-[#718096] hover:text-[#163C3A] uppercase tracking-wider font-semibold cursor-pointer font-sans"
            >
              Close ✕
            </button>
          </div>
          <p className="text-base sm:text-lg text-[#2D3748] leading-relaxed font-sans">
            {roles[activeRoleIdx].focus}
          </p>
        </div>
      )}
    </section>
  );
};

