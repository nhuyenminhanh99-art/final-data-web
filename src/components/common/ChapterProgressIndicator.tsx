import React from 'react';

interface ProgressIndicatorProps {
  currentChapter: number; // 7, 8, 9, 10, 11, or 12 for summary
}

export const ChapterProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentChapter }) => {
  const steps = [
    { num: 7, label: 'Leadership', href: '/analytics-leadership/?from=chapters' },
    { num: 8, label: 'Competing', href: '/competing-on-analytics/?from=chapters' },
    { num: 9, label: 'Playbook', href: '/analytics-leaders-playbook/?from=chapters' },
    { num: 10, label: 'Making It Happen', href: '/making-it-happen/?from=chapters' },
    { num: 11, label: 'Pitfalls', href: '/common-pitfalls/?from=chapters' },
    { num: 12, label: 'Summary', href: '/case-studies/?from=chapters' },
  ];

  const activeIndex = steps.findIndex((s) => s.num === currentChapter);
  const fillPercentage = activeIndex >= 0 ? (activeIndex / (steps.length - 1)) * 100 : 0;

  return (
    <nav
      aria-label="Chapter Curriculum Progress"
      className="chapter-progress-card max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-4 text-xs text-[#718096]">
        <span className="uppercase tracking-[0.16em] text-[#85590A] font-semibold">
          Curriculum Progress
        </span>
        <span className="font-medium">
          Step {Math.max(activeIndex + 1, 1)} of {steps.length}
        </span>
      </div>

      <div className="chapter-progress-track-wrap relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-[#EEF3F1] rounded-full z-0 hidden sm:block" />

        {/* Filled gradient line */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-[#C99A4B] to-[#163C3A] rounded-full z-0 transition-all duration-500 hidden sm:block"
          style={{ width: `calc(${fillPercentage}% - 16px)` }}
        />

        {/* Nodes */}
        <div className="chapter-progress-steps grid grid-cols-2 sm:grid-cols-6 gap-3 relative z-10">
          {steps.map((st, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            return (
              <a
                key={st.num}
                href={st.href}
                    className="chapter-progress-step flex flex-col items-center text-center group min-h-[44px] cursor-pointer"
              >
                <div
                    className={`chapter-progress-node w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-[#163C3A] text-white ring-4 ring-[#C99A4B]/40 scale-110'
                      : isCompleted
                      ? 'bg-[#2F6F8F] text-white'
                      : 'bg-[#EEF3F1] text-[#718096] border border-[#163C3A]/15 hover:border-[#163C3A]'
                  }`}
                >
                  {st.num === 12 ? 'Σ' : `0${st.num}`}
                </div>

                <span
                  className={`text-[11px] font-sans mt-2 font-medium transition-colors ${
                    isCurrent ? 'text-[#163C3A] font-bold' : 'text-[#718096] group-hover:text-[#163C3A]'
                  }`}
                >
                  {st.label}
                </span>

                {isCurrent && (
                  <span className="text-[10px] text-[#85590A] uppercase tracking-wider font-semibold mt-0.5">
                    Current
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
