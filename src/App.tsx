/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AdminEditor } from './components/cms/AdminEditor';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { ChapterPage } from './pages/ChapterPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { DevBlocksPage } from './pages/DevBlocksPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Intercept normal links for client-side navigation without page reload
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target &&
        target.href &&
        target.origin === window.location.origin &&
        !target.getAttribute('download') &&
        target.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const url = new URL(target.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          e.preventDefault();
          window.history.pushState(null, '', url.pathname + url.search + url.hash);
          setCurrentPath(url.pathname);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const isJourney = currentPath.startsWith('/journey');

  // Render appropriate view based on route
  const renderRoute = () => {
    // Normalise path (strip trailing slash if needed, except root)
    const path = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '');

    if (path === '' || path === '/') {
      return <HomePage />;
    }

    if (path === '/journey') {
      return <JourneyPage />;
    }

    if (path.startsWith('/journey/')) {
      const slug = path.replace('/journey/', '');
      return <JourneyPage initialChapterSlug={slug} />;
    }

    // Canonical chapter pages
    if (path === '/analytics-leadership') {
      return <ChapterPage slug="analytics-leadership" />;
    }
    if (path === '/competing-on-analytics') {
      return <ChapterPage slug="competing-on-analytics" />;
    }
    if (path === '/analytics-leaders-playbook') {
      return <ChapterPage slug="analytics-leaders-playbook" />;
    }
    if (path === '/making-it-happen') {
      return <ChapterPage slug="making-it-happen" />;
    }
    if (path === '/common-pitfalls') {
      return <ChapterPage slug="common-pitfalls" />;
    }

    // Other pages
    if (path === '/case-studies') {
      return <CaseStudiesPage />;
    }
    if (path === '/glossary') {
      return <GlossaryPage />;
    }
    if (path === '/about') {
      return <AboutPage />;
    }
    if (path === '/admin') {
      return <AdminPage />;
    }
    if (path === '/dev/blocks') {
      return <DevBlocksPage />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1F2933] flex flex-col font-sans selection:bg-[#2F6F8F]/20 selection:text-[#163C3A]">
      {/* Top Navbar (hidden on full-screen immersive /journey page, as journey has its own header) */}
      {!isJourney && <Navbar currentPath={currentPath} />}

      {/* Main Page View */}
      <div className="flex-1">{renderRoute()}</div>

      {/* Atmospheric Footer (hidden on immersive /journey) */}
      {!isJourney && <Footer />}

      {/* Floating Admin & Visual CMS Pill */}
      <AdminEditor />
    </div>
  );
}
