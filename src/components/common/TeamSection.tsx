import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { teamMembers } from '../../data/teamData';

const displayValue = (value: string) => value.trim() || 'Not provided yet';

export const TeamSection: React.FC = () => {
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(() => new Set());

  const toggleMember = (memberId: string) => {
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
      className="border-t border-[#163C3A]/15 bg-[#FFFDF8] px-4 py-24 sm:px-6 md:py-32 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-3xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-[#85590A]">
            The team
          </span>
          <h2 id="team-section-title" className="font-serif text-3xl text-[#163C3A] sm:text-5xl">
            THE PEOPLE BEHIND THE JOURNEY
          </h2>
          <p className="mt-4 font-serif text-lg text-[#4A5568] sm:text-xl">
            Seven people. One journey. Different perspectives.
          </p>
        </header>

        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => {
            const isExpanded = expandedMembers.has(member.id);
            const detailsId = `${member.id}-details`;

            return (
              <li key={member.id} className="min-w-0 rounded-2xl border border-[#163C3A]/15 bg-white p-5 sm:p-6">
                <div className="mb-5 flex items-start gap-4">
                  {member.image.trim() ? (
                    <img
                      src={member.image}
                      alt={member.name ? `Portrait of ${member.name}` : 'Team member portrait'}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#EEF3F1] font-serif text-2xl text-[#163C3A]"
                    >
                      {member.number}
                    </div>
                  )}
                  <div className="min-w-0 pt-1">
                    <span className="mb-1 block text-xs font-semibold tracking-[0.14em] text-[#85590A]">
                      {member.number}
                    </span>
                    <h3 className="break-words font-serif text-xl text-[#163C3A]">
                      {displayValue(member.name)}
                    </h3>
                    <p className="mt-1 break-words text-sm text-[#4A5568]">
                      {displayValue(member.shortRole)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={detailsId}
                  onClick={() => toggleMember(member.id)}
                  className="inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#163C3A]/20 px-4 py-2 text-left text-sm font-semibold text-[#163C3A] hover:bg-[#EEF3F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F]"
                >
                  <span>More Information</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <dl id={detailsId} className="mt-4 space-y-3 border-t border-[#EEF3F1] pt-4 text-sm">
                    <div><dt className="font-semibold text-[#163C3A]">Full name</dt><dd className="break-words text-[#4A5568]">{displayValue(member.fullName)}</dd></div>
                    <div><dt className="font-semibold text-[#163C3A]">Student ID</dt><dd className="break-words text-[#4A5568]">{displayValue(member.studentId)}</dd></div>
                    <div><dt className="font-semibold text-[#163C3A]">Gmail</dt><dd className="break-words text-[#4A5568]">{displayValue(member.gmail)}</dd></div>
                    <div><dt className="font-semibold text-[#163C3A]">Role</dt><dd className="break-words text-[#4A5568]">{displayValue(member.role)}</dd></div>
                    <div><dt className="font-semibold text-[#163C3A]">Responsibility</dt><dd className="break-words text-[#4A5568]">{displayValue(member.responsibility)}</dd></div>
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
