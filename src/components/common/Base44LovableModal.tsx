import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Sparkles,
  Code,
  Layers,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface Base44LovableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Base44LovableModal: React.FC<Base44LovableModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'lovable' | 'base44' | 'files' | 'guide'>('lovable');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const lovablePrompt = `Create a full-stack immersive 3D/2D web application named "The River of Insights" based on Chapters 7–11 of the book "Behind Every Good Decision" by Piyanka Jain & Puneet Sharma.

### Core Concept:
The website is an atmospheric Chinese ink / watercolor & realistic 3D river journey. The user pilots or cruises in a traditional wooden sampan rowboat down an emerald misty river, sailing through 5 lands representing the 5 key chapters of Analytics Leadership:
1. Peach Village (Chapter 7: Analytics and Leadership - Bad-ass Analytics Leader, 4 traits, 3 roles)
2. Bamboo Forest (Chapter 8: Competing on Analytics - 5 Maturity stages, 3 team organizational models: Centralized, Decentralized, Center of Excellence / Hub & Spoke)
3. Mountain Valley (Chapter 9: The Analytics Leader's 90-Day Playbook - 30/60/90 days plan, quick wins, key milestones)
4. Lantern Bridge (Chapter 10: Making It Happen - 5-stage Change Management, persuasion, stakeholder alignment)
5. Forgotten Garden (Chapter 11: Common Pitfalls - 36 pitfalls across 4 roles: Executive, Lead, Stakeholder, Analyst)
6. The Harbour (6 real-world Case Studies: Capital One, Netflix, Google, Starbucks, Airbnb, Target)

### Tech Stack:
- React 19 + TypeScript + Vite + Tailwind CSS 4
- Three.js for 3D River & Sampan Boat (procedural water Fresnel shader, weathered wood hull, bamboo arched canopy, hanging amber paper lantern, floating peach petals, god rays, atmospheric fog)
- Web Audio API procedural sound engine (river flow, water lapping, bell chimes - no external audio files required)
- 18 content block types: hero, richText, storyCard, definitionBox, tabs, accordion, numberedCards, twoColumn, comparisonTable, timeline, flow, bigNumber, checklist, quote, table, callout, statGrid, codeSnippet
- Comprehensive Visual CMS & Admin studio at /admin with live theme token customizer and contrast validator
- Dual Mode: 3D WebGL Canvas + 2D Parallax SVG Lite Journey fallback for mobile / low-spec devices
- Language: 100% English production copy architecture`;

  const base44Prompt = `---
app_name: "The River of Insights"
framework: "React + Vite + TypeScript + Tailwind CSS + Three.js"
theme: "Light Morning River Palette (Emerald Jade #163C3A, Water #2F6F8F, Ivory #FFFDF8, Peach #DDA6A0, Gold #C99A4B)"
description: "Immersive 3D/2D interactive analytics leadership journey inspired by 'Behind Every Good Decision' Chapters 7-11."

data_models:
  Chapter:
    slug: string
    number: number
    title: string
    regionName: string
    tagline: string
    summary: string
    blocks: ContentBlock[]
  CaseStudy:
    id: string
    slug: string
    company: string
    headline: string
    metric: string
    narrative: string
    solution: string
    impact: string[]

key_features:
  - 3D Procedural WebGL River with realistic boat, water caustics, and hanging lantern
  - 3 Camera angles (Cinematic Follow, Bow Lantern View, Aerial Drone)
  - Auto-Cruise Guided Sail mode & Free virtual scroll
  - Procedural Web Audio river sound generator
  - 18 modular editorial block renderers
  - Export & Deploy ready for Lovable & Base44
---

### Prompt for Base44:
Generate the entire "River of Insights" application with interactive 3D WebGL river canvas, comprehensive chapters 7-11 curriculum data, and modular UI components styled with Tailwind CSS.`;

  const filesSummary = [
    { name: 'src/components/scene/RiverCanvas.tsx', desc: 'Three.js 3D River, Sampan boat with lantern & canopy, shaders, petals, camera modes' },
    { name: 'src/components/scene/RiverAudio.ts', desc: 'Zero-asset Web Audio API procedural water flow, oars splash, temple bell chime' },
    { name: 'src/data/chaptersData.ts', desc: 'Full curriculum for Chapters 7 to 11 with 18 block types, real numbers, and frameworks' },
    { name: 'src/data/caseStudiesData.ts', desc: 'Real corporate analytics case studies (Capital One, Netflix, Google, Starbucks, Airbnb, Target)' },
    { name: 'src/components/blocks/BlockRenderer.tsx', desc: 'Renderers for all 18 content block types with WCAG AA compliance' },
    { name: 'src/pages/JourneyPage.tsx', desc: 'Immersive journey route with Guided Sailing, Auto-Cruise, 3D/2D toggle, MiniMap' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFDF8] border border-[#163C3A]/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#1F2933]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#163C3A]/10 flex items-center justify-between bg-[#F8FAF9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#163C3A] text-[#FFFDF8] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#C99A4B]" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#163C3A]">
                Export for Base44 & Lovable
              </h2>
              <p className="text-xs text-[#667085] font-mono">
                Export complete source specification & prompt architecture for Base44 or Lovable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 text-[#667085] hover:text-[#1F2933] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#163C3A]/10 px-6 bg-white gap-2 text-xs font-mono uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('lovable')}
            className={`py-3 px-4 border-b-2 font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'lovable'
                ? 'border-[#163C3A] text-[#163C3A]'
                : 'border-transparent text-[#667085] hover:text-[#163C3A]'
            }`}
          >
            Lovable App Prompt
          </button>
          <button
            onClick={() => setActiveTab('base44')}
            className={`py-3 px-4 border-b-2 font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'base44'
                ? 'border-[#163C3A] text-[#163C3A]'
                : 'border-transparent text-[#667085] hover:text-[#163C3A]'
            }`}
          >
            Base44 App Spec
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 px-4 border-b-2 font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'files'
                ? 'border-[#163C3A] text-[#163C3A]'
                : 'border-transparent text-[#667085] hover:text-[#163C3A]'
            }`}
          >
            Core Files & Architecture
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 border-b-2 font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-[#163C3A] text-[#163C3A]'
                : 'border-transparent text-[#667085] hover:text-[#163C3A]'
            }`}
          >
            Deployment & Integration Guide
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'lovable' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#163C3A]">
                    Master Prompt for Lovable (Copy & Paste)
                  </h3>
                  <p className="text-xs text-[#667085]">
                    Paste this prompt directly into Lovable.dev to create the app
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(lovablePrompt, 'lovable')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#163C3A] text-[#FFFDF8] hover:bg-[#2F6F8F] text-xs font-mono font-semibold transition-all shadow-md cursor-pointer"
                >
                  {copiedKey === 'lovable' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Lovable Prompt
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#16231F] text-[#EEF3F1] text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96 border border-[#2F6F8F]/30">
                {lovablePrompt}
              </pre>
            </div>
          )}

          {activeTab === 'base44' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#163C3A]">
                    Base44 Specification & Schema Pack
                  </h3>
                  <p className="text-xs text-[#667085]">
                    Import into Base44 to generate the project structure and component hierarchy
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(base44Prompt, 'base44')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#163C3A] text-[#FFFDF8] hover:bg-[#2F6F8F] text-xs font-mono font-semibold transition-all shadow-md cursor-pointer"
                >
                  {copiedKey === 'base44' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Base44 Spec
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#16231F] text-[#EEF3F1] text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96 border border-[#2F6F8F]/30">
                {base44Prompt}
              </pre>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-[#163C3A]">
                Core Project Architecture & Key Source Files
              </h3>
              <p className="text-xs text-[#667085]">
                The codebase is fully modular. You can copy individual files directly into your Base44 or Lovable repository:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filesSummary.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-[#163C3A]/15 bg-white shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Code className="w-4 h-4 text-[#2F6F8F]" />
                        <span className="font-mono text-xs font-bold text-[#163C3A]">
                          {file.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] leading-relaxed">
                        {file.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-sm leading-relaxed text-[#1F2933]">
              <h3 className="font-serif font-bold text-base text-[#163C3A]">
                Deployment Steps for Base44 or Lovable
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-[#163C3A]/15">
                  <h4 className="font-bold text-[#163C3A] mb-1">
                    Step 1: Install Core Dependencies
                  </h4>
                  <p className="text-xs text-[#667085] mb-2">
                    In your Lovable or Base44 project, ensure the following dependencies are present in <code className="bg-[#EEF3F1] px-1 py-0.5 rounded">package.json</code>:
                  </p>
                  <pre className="bg-[#16231F] text-[#EEF3F1] p-3 rounded-xl text-xs font-mono">
{`"three": "^0.170.0",
"@types/three": "^0.170.0",
"lucide-react": "^0.460.0"`}
                  </pre>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#163C3A]/15">
                  <h4 className="font-bold text-[#163C3A] mb-1">
                    Step 2: Paste the Master Prompt or Specification
                  </h4>
                  <p className="text-xs text-[#667085]">
                    Select the <b>Lovable App Prompt</b> or <b>Base44 App Spec</b> tab above, copy the text, and paste it into the project creation prompt. The platform will configure the 3D River engine, Web Audio soundscape, and educational chapters.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#163C3A]/15">
                  <h4 className="font-bold text-[#163C3A] mb-1">
                    Step 3: Direct Client-Side Execution
                  </h4>
                  <p className="text-xs text-[#667085]">
                    All components run 100% client-side with zero secret backend requirements, including the WebGL canvas, procedural audio synthesis, and interactive chapter exercises.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#163C3A]/10 bg-[#F8FAF9] flex items-center justify-between">
          <span className="text-xs font-mono text-[#667085]">
            Behind Every Good Decision · The River of Insights
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#163C3A] text-[#FFFDF8] hover:bg-[#2F6F8F] text-xs font-mono uppercase font-semibold transition-all cursor-pointer shadow-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
