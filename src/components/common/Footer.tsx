import React from 'react';
import { chaptersData } from '../../data/chaptersData';
import { Compass, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#2F6F6A]/15 bg-[#E8EFEA] text-[#4F5E57] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Concept */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F6F6A]" />
              <h3 className="font-serif text-2xl text-[#1E2B26]">The River of Insights</h3>
            </div>
            <p className="text-sm text-[#4F5E57] leading-relaxed max-w-md">
              A luminous spring morning river journey through the landscape of Analytics Leadership,
              distilling core frameworks from Chapters 7–11 of <em>Behind Every Good Decision</em>.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#1F4F4B] bg-white px-3.5 py-1.5 rounded-full border border-[#2F6F6A]/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#85590A]" />
              <span>"Stepping into a memory you have never lived"</span>
            </div>
          </div>

          {/* Chapter Lands */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#85590A] mb-4 flex items-center gap-2 font-semibold">
              <Compass className="w-4 h-4 text-[#2F6F6A]" /> The Five Lands
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              {chaptersData.map((ch) => (
                <li key={ch.slug}>
                  <a
                    href={`/${ch.slug}/`}
                    className="hover:text-[#1F4F4B] transition-colors flex items-center justify-between group"
                  >
                    <span>{ch.regionName}</span>
                    <span className="text-[#8E9C96] group-hover:text-[#1F4F4B]">
                      Ch. 0{ch.number}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/case-studies/"
                  className="hover:text-[#1F4F4B] transition-colors flex items-center justify-between group text-[#1F4F4B] font-semibold"
                >
                  <span>The Harbour</span>
                  <span>Cases</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Attribution */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#85590A] mb-4 flex items-center gap-2 font-semibold">
              <BookOpen className="w-4 h-4 text-[#2F6F6A]" /> Source Work
            </h4>
            <p className="text-xs text-[#4F5E57] leading-relaxed mb-4">
              Content and frameworks synthesized directly from:
              <br />
              <strong className="text-[#1E2B26] block mt-1">
                Behind Every Good Decision: How Anyone Can Use Business Analytics to Turn Data into
                Profitable Insight
              </strong>
              by Piyanka Jain & Puneet Sharma.
            </p>
            <div className="space-y-2 text-xs font-mono">
              <a href="/about/" className="block text-[#4F5E57] hover:text-[#1F4F4B]">
                About & Methodology →
              </a>
              <a href="/admin" className="block text-[#4F5E57] hover:text-[#1F4F4B]">
                Admin & Theme CMS →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2F6F6A]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E9C96] gap-4">
          <p>© {new Date().getFullYear()} The River of Insights. Dedicated to accessible, cinematic data leadership.</p>
          <div className="flex items-center space-x-6 font-mono text-[11px]">
            <a href="/" className="hover:text-[#1F4F4B]">Home</a>
            <a href="/journey" className="hover:text-[#1F4F4B]">3D River</a>
            <a href="/case-studies/" className="hover:text-[#1F4F4B]">Case Studies</a>
            <a href="/about/" className="hover:text-[#1F4F4B]">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
