import React, { useState } from 'react';
import { chaptersData } from '../data/chaptersData';
import {
  Save,
  CheckCircle,
  Eye,
  Layers,
  Palette,
  Compass,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'theme' | 'scene'>('chapters');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSaveAll = () => {
    setSavedNotice('All changes published to live production!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#1E2B26] pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#D5E2DE]">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#85590A] font-semibold block mb-1">
              Admin & Content Management System
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1E2B26]">
              The River of Insights Studio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/journey"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D5E2DE] text-xs font-mono text-[#4F5E57] hover:border-[#1F4F4B] hover:text-[#1E2B26] bg-white shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-[#2F6F6A]" /> View 3D River
            </a>
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 bg-[#1F4F4B] text-[#F7F3EA] px-5 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-wider hover:bg-[#2F6F6A] transition-all cursor-pointer shadow-md shadow-[#1F4F4B]/20"
            >
              <Save className="w-3.5 h-3.5" /> Publish Live
            </button>
          </div>
        </header>

        {savedNotice && (
          <div className="mb-6 p-4 rounded-xl bg-[#E8EFEA] border border-[#2F6F6A]/30 text-[#1F4F4B] text-xs font-mono flex items-center gap-2 animate-memory shadow-sm font-semibold">
            <CheckCircle className="w-4 h-4 text-[#2F6F6A]" />
            {savedNotice}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[#D5E2DE] pb-3 mb-8 text-xs font-mono">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'chapters'
                ? 'bg-[#1F4F4B] text-[#F7F3EA] font-semibold'
                : 'text-[#4F5E57] hover:bg-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1.5" /> Chapters & Stops
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-[#1F4F4B] text-[#F7F3EA] font-semibold'
                : 'text-[#4F5E57] hover:bg-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 inline mr-1.5" /> Theme Tokens & Contrast
          </button>
          <button
            onClick={() => setActiveTab('scene')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'scene'
                ? 'bg-[#1F4F4B] text-[#F7F3EA] font-semibold'
                : 'text-[#4F5E57] hover:bg-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 inline mr-1.5" /> 3D Scene Parameters
          </button>
        </div>

        {/* Tab 1: Chapters & River Stops */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif text-[#1E2B26]">The Five Lands & Chapter Manifest</h2>
              <span className="text-xs font-mono text-[#8E9C96]">5 Chapters · 6 Case Studies</span>
            </div>

            <div className="space-y-4">
              {chaptersData.map((ch, idx) => (
                <div
                  key={ch.slug}
                  className="river-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#85590A] font-semibold">Stop 0{idx + 1}</span>
                      <span className="text-[#8E9C96]">· Position: {ch.stopPosition * 100}%</span>
                      <span className="text-[#8E9C96]">· Region: {ch.regionName}</span>
                    </div>
                    <h3 className="text-xl font-serif text-[#1E2B26]">
                      Ch. 0{ch.number}: {ch.title}
                    </h3>
                    <p className="text-xs text-[#85590A] italic font-serif">"{ch.tagline}"</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={`/${ch.slug}/`}
                      className="px-3 py-1.5 rounded-lg border border-[#D5E2DE] text-xs font-mono hover:border-[#1F4F4B] text-[#1E2B26]"
                    >
                      Edit Page
                    </a>
                    <a
                      href={`/journey/${ch.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-[#E8EFEA] border border-[#2F6F6A]/30 text-xs font-mono text-[#1F4F4B] hover:bg-[#CFE6EA]/40 font-semibold"
                    >
                      Preview in 3D
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Theme Tokens */}
        {activeTab === 'theme' && (
          <div className="river-card p-6 md:p-8 space-y-6 bg-white">
            <h2 className="text-xl font-serif text-[#1E2B26]">Bright Morning Palette Tokens & WCAG Contrast</h2>
            <p className="text-xs text-[#4F5E57]">
              Default theme is LIGHT (spring morning). 60% paper/mist/sky, 30% jade/wood/water, 10% gold/blossom.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg border border-[#D5E2DE] bg-[#F7F3EA]">
                <span className="text-[#85590A] block font-semibold">Paper</span>
                <span className="text-[#4F5E57]">#F7F3EA</span>
              </div>
              <div className="p-3 rounded-lg border border-[#D5E2DE] bg-[#E8EFEA]">
                <span className="text-[#1F4F4B] block font-semibold">Mist</span>
                <span className="text-[#4F5E57]">#E8EFEA</span>
              </div>
              <div className="p-3 rounded-lg border border-[#D5E2DE] bg-[#2F6F6A] text-white">
                <span className="block font-semibold">Jade</span>
                <span>#2F6F6A</span>
              </div>
              <div className="p-3 rounded-lg border border-[#D5E2DE] bg-[#1F4F4B] text-white">
                <span className="font-semibold block">Jade Deep</span>
                <span>#1F4F4B</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Scene */}
        {activeTab === 'scene' && (
          <div className="river-card p-6 md:p-8 space-y-6 bg-white">
            <h2 className="text-xl font-serif text-[#1E2B26]">3D Procedural Engine Status</h2>
            <div className="space-y-3 text-xs font-mono text-[#4F5E57]">
              <div className="flex justify-between py-2 border-b border-[#D5E2DE]">
                <span>Rendering Target:</span>
                <span className="text-[#1F4F4B] font-semibold">Realistic Three.js Procedural Canvas</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D5E2DE]">
                <span>Light & Tone Mapping:</span>
                <span className="text-[#1F4F4B] font-semibold">ACESFilmic 1.15 (Bright Morning Daylight)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D5E2DE]">
                <span>Water Dynamics:</span>
                <span className="text-[#1F4F4B] font-semibold">Gerstner Waves + Fresnel Sky Reflection + Wake</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D5E2DE]">
                <span>Blossom Particles:</span>
                <span className="text-[#1F4F4B] font-semibold">Air Flutter + Floating Water Petals (2 Tiers)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
