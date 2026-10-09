import React from 'react';
import { chaptersData } from '../../data/chaptersData';
import { Compass, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer mt-20 pt-16 pb-12" aria-label="Site footer">
      <div className="site-footer__grid max-w-[118rem] mx-auto px-4 sm:px-6 lg:px-8">
        <section className="site-footer__card site-footer__brand-card md:col-span-6" aria-labelledby="footer-brand-title">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8A66A]" aria-hidden="true" />
            <h3 id="footer-brand-title" className="font-serif text-2xl">The River of Insights</h3>
          </div>
          <p className="text-sm leading-relaxed max-w-md">
            A luminous spring morning river journey through the landscape of Analytics Leadership,
            distilling core frameworks from Chapters 7–11 of <em>Behind Every Good Decision</em>.
          </p>
          <div className="site-footer__quote inline-flex items-center gap-2 text-xs font-sans px-3.5 py-1.5 rounded-full" aria-label="Project quote">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>"Stepping into a memory you have never lived"</span>
          </div>
        </section>

        <section className="site-footer__card md:col-span-3" aria-labelledby="footer-lands-title">
          <h4 id="footer-lands-title" className="site-footer__eyebrow mb-4 flex items-center gap-2 font-semibold">
            <Compass className="w-4 h-4" aria-hidden="true" /> The Five Lands
          </h4>
          <ul className="space-y-2.5 text-xs font-sans">
            {chaptersData.map((ch) => (
              <li key={ch.slug}>
                <a href={`/${ch.slug}/`} className="flex items-center justify-between group">
                  <span>{ch.regionName}</span>
                  <span className="site-footer__muted group-hover:text-[#E5C58A]">Ch. {ch.number}</span>
                </a>
              </li>
            ))}
            <li>
              <a href="/case-studies/" className="flex items-center justify-between font-semibold">
                <span>The Harbour</span><span>Cases</span>
              </a>
            </li>
          </ul>
        </section>

        <section className="site-footer__card md:col-span-3" aria-labelledby="footer-source-title">
          <h4 id="footer-source-title" className="site-footer__eyebrow mb-4 flex items-center gap-2 font-semibold">
            <BookOpen className="w-4 h-4" aria-hidden="true" /> Source Work
          </h4>
          <p className="text-xs leading-relaxed mb-4 font-sans">
            Content and frameworks synthesized directly from:
            <br />
            <strong className="site-footer__book-title block mt-1 font-semibold">
              Behind Every Good Decision: How Anyone Can Use Business Analytics to Turn Data into Profitable Insight
            </strong>
            by Piyanka Jain &amp; Puneet Sharma.
          </p>
          <div className="space-y-2 text-xs font-sans">
            <a href="/about/" className="block">About &amp; Methodology →</a>
            <a href="/admin" className="block">Admin &amp; Theme CMS →</a>
          </div>
        </section>

        <div className="site-footer__bottom md:col-span-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 font-sans">
          <p>© {new Date().getFullYear()} The River of Insights. Dedicated to accessible, cinematic data leadership.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-wider font-medium">
            <a href="/">Home</a>
            <a href="/journey">3D River</a>
            <a href="/case-studies/">Case Studies</a>
            <a href="/about/">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
