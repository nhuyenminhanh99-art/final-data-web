import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { teamMembers, type TeamMember } from '../../data/teamData';

const displayValue = (value: string) => value.trim() || 'Not provided yet';

const memberPlacement: Record<TeamMember['id'], string> = {
  'member-01': 'lg:col-span-3',
  'member-02': 'lg:col-span-3 lg:translate-y-8',
  'member-03': 'lg:col-span-3 lg:-translate-y-2',
  'member-04': 'lg:col-span-3 lg:translate-y-5',
  'member-05': 'lg:col-span-3 lg:col-start-3',
  'member-06': 'lg:col-span-3 lg:col-start-6 lg:translate-y-8',
  'member-07': 'lg:col-span-3 lg:col-start-9 lg:-translate-y-2',
};

const portraitFrame: Record<TeamMember['id'], string> = {
  'member-01': 'rounded-tl-[3.5rem] rounded-br-[2rem]',
  'member-02': 'rounded-tr-[3.5rem] rounded-bl-[2rem]',
  'member-03': 'rounded-tl-[2rem] rounded-br-[3.5rem]',
  'member-04': 'rounded-tr-[2rem] rounded-bl-[3.5rem]',
  'member-05': 'rounded-tl-[3.5rem] rounded-br-[2rem]',
  'member-06': 'rounded-tr-[3.5rem] rounded-bl-[2rem]',
  'member-07': 'rounded-tl-[2rem] rounded-br-[3.5rem]',
};

const placeholderTone: Record<TeamMember['id'], string> = {
  'member-01': 'from-[#526d60] via-[#293f39] to-[#172923]',
  'member-02': 'from-[#65756b] via-[#354741] to-[#1c2c28]',
  'member-03': 'from-[#766b54] via-[#454638] to-[#202c26]',
  'member-04': 'from-[#4c6870] via-[#2d4549] to-[#1a2928]',
  'member-05': 'from-[#746455] via-[#4b4037] to-[#242a24]',
  'member-06': 'from-[#5c7162] via-[#34463f] to-[#1a2926]',
  'member-07': 'from-[#696b57] via-[#3d463c] to-[#1b2924]',
};

export const TeamSection: React.FC = () => {
  const [expandedMembers, setExpandedMembers] = useState<Set<TeamMember['id']>>(() => new Set());

  const toggleMember = (memberId: TeamMember['id']) => {
    setExpandedMembers((current) => {
      const next = new Set(current);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  return (
    <section
      aria-labelledby="team-section-title"
      className="relative isolate overflow-hidden border-t border-[#C99A4B]/25 bg-[#16231F] px-4 py-24 text-[#FFFDF8] sm:px-6 md:py-32 lg:px-8 lg:py-40"
    >
      {/* Quiet layered light keeps the closing section in the river's existing palette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_8%,rgba(47,111,143,0.28),transparent_42%),radial-gradient(ellipse_at_82%_54%,rgba(169,184,166,0.12),transparent_38%),linear-gradient(180deg,#16231F_0%,#1D302A_54%,#14221E_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full bg-[#2F6F8F]/10 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <header className="relative mb-16 grid gap-8 border-b border-[#FFFDF8]/15 pb-10 md:mb-20 md:grid-cols-[1fr_auto] md:items-end md:pb-14 lg:mb-24">
          <div className="max-w-4xl">
            <span className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D8B777]">
              <span aria-hidden="true" className="h-px w-9 bg-[#C99A4B]" />
              The human current · A closing chapter
            </span>
            <h2
              id="team-section-title"
              className="max-w-4xl font-serif text-4xl font-medium leading-[0.98] tracking-[-0.025em] text-[#FFFDF8] sm:text-6xl lg:text-7xl"
            >
              THE PEOPLE BEHIND
              <span className="mt-1 block italic font-normal text-[#D8C59D]">THE JOURNEY</span>
            </h2>
          </div>
          <div className="max-w-sm md:pb-1">
            <p className="font-serif text-xl leading-snug text-[#F1EBDD] sm:text-2xl">
              Seven people. One journey. Different perspectives.
            </p>
            <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#A9B8A6]">
              Seven portraits · One shared passage
            </p>
          </div>
          <div aria-hidden="true" className="absolute -bottom-px left-0 h-px w-24 bg-[#C99A4B]" />
        </header>

        <div className="relative">
          {/* Decorative river route only. Member controls and reading order remain semantic HTML. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 left-0 z-0 hidden h-[1060px] w-full overflow-visible lg:block"
            viewBox="0 0 1200 1060"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="team-river-route" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#C99A4B" stopOpacity=".6" />
                <stop offset=".48" stopColor="#6F9A9B" stopOpacity=".55" />
                <stop offset="1" stopColor="#A9B8A6" stopOpacity=".36" />
              </linearGradient>
            </defs>
            <path
              d="M150 32 C260 -4 365 66 450 32 S650 -3 750 32 S950 62 1050 32 C1170 72 1152 330 1000 530 C860 705 575 717 350 640 C282 617 300 640 350 640 S550 682 650 640 S850 610 950 640"
              fill="none"
              stroke="url(#team-river-route)"
              strokeDasharray="3 9"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            {[
              [150, 32], [450, 32], [750, 32], [1050, 32],
              [350, 640], [650, 640], [950, 640],
            ].map(([cx, cy], index) => (
              <g key={index}>
                <circle cx={cx} cy={cy} r="7" fill="#16231F" stroke="#C99A4B" strokeOpacity=".72" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="2" fill="#D8C59D" />
              </g>
            ))}
          </svg>

          <ul className="relative grid list-none grid-cols-1 gap-x-7 gap-y-14 p-0 pl-7 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 sm:pl-0 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-24">
            {teamMembers.map((member) => {
              const isExpanded = expandedMembers.has(member.id);
              const detailsId = `${member.id}-details`;
              const fullName = member.fullName.trim() || member.name.trim();

              return (
                <li
                  key={member.id}
                  className={`group relative z-10 min-w-0 before:absolute before:-left-[25px] before:top-8 before:h-2 before:w-2 before:rounded-full before:bg-[#D8B777] before:ring-4 before:ring-[#16231F] sm:before:hidden ${memberPlacement[member.id]}`}
                >
                  <article>
                    <div className="relative mb-5">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] border border-[#FFFDF8]/[0.07] transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1"
                      />
                      <div className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${placeholderTone[member.id]} shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] ring-1 ring-[#FFFDF8]/20 ${portraitFrame[member.id]}`}>
                        {member.image.trim() ? (
                          <img
                            src={member.image}
                            alt={fullName ? `Portrait of ${fullName}` : 'Team member portrait'}
                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
                            loading="lazy"
                          />
                        ) : (
                          <>
                            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(245,236,211,0.16),transparent_42%),linear-gradient(155deg,transparent_34%,rgba(10,24,21,0.38)_100%)]" />
                            <svg aria-hidden="true" viewBox="0 0 500 620" className="absolute inset-0 h-full w-full opacity-55">
                              <path d="M-40 405 C95 330 144 472 250 404 S399 328 540 405" fill="none" stroke="#D8C59D" strokeOpacity=".42" strokeWidth="1" />
                              <path d="M-30 435 C95 362 154 495 260 432 S410 359 535 430" fill="none" stroke="#C99A4B" strokeOpacity=".26" strokeWidth="1" />
                              <path d="M-30 468 C95 399 154 523 260 464 S410 391 535 462" fill="none" stroke="#D8C59D" strokeOpacity=".2" strokeWidth="1" />
                            </svg>
                            <span aria-hidden="true" className="absolute -right-2 top-10 font-serif text-[11rem] leading-none text-[#FFFDF8]/[0.055]">
                              {member.number}
                            </span>
                            <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[#F1EBDD]/75">
                              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#D8B777]" />
                              Portrait to be added
                            </span>
                          </>
                        )}

                        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFFDF8]/90">
                            Waypoint {member.number}
                          </span>
                          <span aria-hidden="true" className="font-serif text-2xl text-[#D8C59D]">
                            {member.number}
                          </span>
                        </div>
                        {member.image.trim() && (
                          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101B18]/45 to-transparent" />
                        )}
                      </div>
                    </div>

                    <div className="px-1">
                      <h3 className="min-h-[2.1em] break-words font-serif text-2xl font-medium leading-[1.05] text-[#FFFDF8] sm:text-[1.7rem] lg:text-3xl">
                        {displayValue(fullName)}
                      </h3>
                      <p className="mt-2 min-h-6 break-words text-sm leading-relaxed text-[#C5D0C7]">
                        {displayValue(member.shortRole)}
                      </p>

                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => toggleMember(member.id)}
                        className="mt-5 inline-flex min-h-11 items-center gap-3 border-b border-[#C99A4B]/55 pb-2 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[#E8D6AD] transition-colors hover:border-[#FFFDF8] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B777] focus-visible:ring-offset-4 focus-visible:ring-offset-[#16231F]"
                      >
                        <span>More Information</span>
                        {isExpanded ? (
                          <ChevronDown aria-hidden="true" className="h-4 w-4 rotate-180" />
                        ) : (
                          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </button>

                      {isExpanded && (
                        <dl id={detailsId} className="mt-5 space-y-3 border-l border-[#C99A4B]/45 pl-4 text-sm leading-relaxed">
                          <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Full name</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.fullName)}</dd></div>
                          <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Student ID</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.studentId)}</dd></div>
                          <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Gmail</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.gmail)}</dd></div>
                          <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Role</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.role)}</dd></div>
                          <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Responsibility</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.responsibility)}</dd></div>
                        </dl>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

