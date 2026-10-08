import React, { useEffect, useState } from 'react';
import { Check, ImagePlus, Pencil, Save, Trash2, X } from 'lucide-react';
import { teamMembers, type TeamMember } from '../../data/teamData';

const displayValue = (value: string) => value.trim() || 'Not provided yet';
const TEAM_STORAGE_KEY = 'river_team_members_v1';

const loadTeamMembers = (): TeamMember[] => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(TEAM_STORAGE_KEY) || 'null') as unknown;
    if (!Array.isArray(saved)) return teamMembers;
    const savedById = new Map<string, Partial<TeamMember>>(
      saved.filter((member): member is TeamMember =>
        Boolean(member && typeof member === 'object' && teamMembers.some((known) => known.id === (member as TeamMember).id))
      ).map((member) => [member.id, member])
    );
    return teamMembers.map((member) => ({ ...member, ...savedById.get(member.id), id: member.id, number: member.number }));
  } catch {
    return teamMembers;
  }
};

const compressPortrait = async (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
  if (file.size > 12 * 1024 * 1024) throw new Error('Choose an image smaller than 12 MB.');

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser could not prepare the image.');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const encode = (quality: number) => new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('This image could not be encoded.')), 'image/webp', quality);
  });
  let blob = await encode(0.76);
  if (blob.size > 360 * 1024) blob = await encode(0.58);
  if (blob.size > 360 * 1024) throw new Error('This image is still too large after compression. Choose a smaller image.');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('The image preview could not be created.'));
    reader.onerror = () => reject(new Error('The image could not be read.'));
    reader.readAsDataURL(blob);
  });
};

type EditableTeamField = 'name' | 'fullName' | 'studentId' | 'gmail' | 'role' | 'shortRole' | 'responsibility';
const editableFields: Array<{ key: EditableTeamField; label: string; multiline?: boolean }> = [
  { key: 'name', label: 'Display name' },
  { key: 'fullName', label: 'Full name' },
  { key: 'studentId', label: 'Student ID' },
  { key: 'gmail', label: 'Gmail' },
  { key: 'shortRole', label: 'Short role' },
  { key: 'role', label: 'Role' },
  { key: 'responsibility', label: 'Responsibility', multiline: true },
];

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
  const [members, setMembers] = useState<TeamMember[]>(loadTeamMembers);
  const [draftMembers, setDraftMembers] = useState<TeamMember[]>(loadTeamMembers);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editError, setEditError] = useState('');
  const [expandedMembers, setExpandedMembers] = useState<Set<TeamMember['id']>>(() => new Set());

  useEffect(() => {
    const handleEditMode = (event: Event) => {
      const enabled = Boolean((event as CustomEvent<{ enabled?: boolean }>).detail?.enabled);
      setIsEditing(enabled);
      setEditError('');
      if (!enabled) setDraftMembers(members);
    };
    window.addEventListener('river:team-edit-mode', handleEditMode);
    return () => window.removeEventListener('river:team-edit-mode', handleEditMode);
  }, [members]);

  const updateDraft = (memberId: TeamMember['id'], field: EditableTeamField | 'image', value: string) => {
    setDraftMembers((current) => current.map((member) => member.id === memberId ? { ...member, [field]: value } : member));
    setSaveMessage('');
  };

  const saveTeamMembers = () => {
    try {
      window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(draftMembers));
      setMembers(draftMembers);
      setSaveMessage('Saved in this browser.');
      setEditError('');
    } catch {
      setEditError('Could not save. Remove a portrait or use smaller images, then try again.');
    }
  };

  const toggleMember = (memberId: TeamMember['id']) => {
    setExpandedMembers((current) => {
      const next = new Set(current);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  const visibleMembers = isEditing ? draftMembers : members;

  return (
    <section
      aria-labelledby="team-section-title"
      className={`relative isolate overflow-hidden border-t border-[#C99A4B]/25 bg-[#16231F] px-4 py-24 text-[#FFFDF8] sm:px-6 md:py-32 lg:px-8 lg:py-40 ${isEditing ? 'pb-48 md:pb-56 lg:pb-64' : ''}`}
    >
      {/* Quiet layered light keeps the closing section in the river's existing palette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_8%,rgba(47,111,143,0.28),transparent_42%),radial-gradient(ellipse_at_82%_54%,rgba(169,184,166,0.12),transparent_38%),linear-gradient(180deg,#16231F_0%,#1D302A_54%,#14221E_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full bg-[#2F6F8F]/10 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <header className="relative mb-16 grid gap-8 border-b border-[#FFFDF8]/15 pb-10 md:mb-20 md:pb-14 lg:mb-24 xl:grid-cols-[1fr_auto] xl:items-end">
          <div className="max-w-4xl">
            <span className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D8B777]">
              <span aria-hidden="true" className="h-px w-9 bg-[#C99A4B]" />
              The human current · A closing chapter
            </span>
            <h2
              id="team-section-title"
              className="max-w-4xl font-serif text-4xl font-medium leading-[0.98] tracking-[-0.025em] text-[#FFFDF8] sm:text-6xl xl:text-7xl"
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
              Seven waypoints · One shared passage
            </p>
          </div>
          <div aria-hidden="true" className="absolute -bottom-px left-0 h-px w-24 bg-[#C99A4B]" />
        </header>

        {isEditing && (
          <div className="mb-12 flex flex-col gap-4 border border-[#D8B777]/30 bg-[#FFFDF8]/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6" aria-label="Team editing controls">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D8B777]">Team editor</p>
              <p className="mt-2 text-sm leading-relaxed text-[#D6DED8]">Update member details and portraits. Changes save in this browser.</p>
              <p className="mt-1 text-xs text-[#A9B8A6]" aria-live="polite">{saveMessage || editError}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button type="button" onClick={() => { setDraftMembers(members); setSaveMessage(''); setEditError(''); }} className="inline-flex min-h-11 items-center gap-2 border border-[#FFFDF8]/25 px-4 text-xs font-semibold uppercase tracking-wider text-[#F1EBDD] transition-colors hover:border-[#FFFDF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B777]">
                <X aria-hidden="true" className="h-4 w-4" /> Cancel
              </button>
              <button type="button" onClick={saveTeamMembers} className="inline-flex min-h-11 items-center gap-2 bg-[#C99A4B] px-4 text-xs font-semibold uppercase tracking-wider text-[#16231F] transition-colors hover:bg-[#D8B777] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFDF8]">
                <Save aria-hidden="true" className="h-4 w-4" /> Save profiles
              </button>
            </div>
          </div>
        )}

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
            <g><circle cx="150" cy="32" r="7" fill="#16231F" stroke="#C99A4B" strokeOpacity=".72" strokeWidth="1.5" /><circle cx="150" cy="32" r="2" fill="#D8C59D" /></g>
            <g><circle cx="450" cy="32" r="7" fill="#16231F" stroke="#C99A4B" strokeOpacity=".72" strokeWidth="1.5" /><circle cx="450" cy="32" r="2" fill="#D8C59D" /></g>
            <g><circle cx="750" cy="32" r="7" fill="#16231F" stroke="#C99A4B" strokeOpacity=".72" strokeWidth="1.5" /><circle cx="750" cy="32" r="2" fill="#D8C59D" /></g>
            <g><circle cx="1050" cy="32" r="7" fill="#16231F" stroke="#C99A4B" strokeOpacity=".72" strokeWidth="1.5" /><circle cx="1050" cy="32" r="2" fill="#D8C59D" /></g>
            <g><circle cx="350" cy="640" r="7" fill="#16231F" stroke="#C99A4B" strokeOpacity=".72" strokeWidth="1.5" /><circle cx="350" cy="640" r="2" fill="#D8C59D" /></g>
            <g><circle cx="650" cy="640" r="7" fill="#16231F" stroke="#C99A4B" strokeOpacity=".72" strokeWidth="1.5" /><circle cx="650" cy="640" r="2" fill="#D8C59D" /></g>
            <g><circle cx="950" cy="640" r="7" fill="#16231F" stroke="#C99A4B" strokeOpacity=".72" strokeWidth="1.5" /><circle cx="950" cy="640" r="2" fill="#D8C59D" /></g>
          </svg>

          <ul className="relative grid list-none grid-cols-1 gap-x-7 gap-y-14 p-0 pl-7 before:pointer-events-none before:absolute before:bottom-12 before:left-[7px] before:top-8 before:w-px before:bg-gradient-to-b before:from-[#C99A4B]/60 before:via-[#6F9A9B]/40 before:to-[#A9B8A6]/10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 sm:pl-0 sm:before:hidden lg:grid-cols-12 lg:gap-x-6 lg:gap-y-24">
            {visibleMembers.map((member) => {
              const isExpanded = expandedMembers.has(member.id);
              const detailsId = `${member.id}-details`;
              const fullName = member.fullName.trim() || member.name.trim();

              return (
                <li
                  key={member.id}
                  data-member-id={member.id}
                  className={`group relative z-10 min-w-0 before:absolute before:-left-[25px] before:top-8 before:h-2 before:w-2 before:rounded-full before:bg-[#D8B777] before:ring-4 before:ring-[#16231F] sm:before:hidden ${memberPlacement[member.id]}`}
                >
                  <article>
                    <div className="relative mb-5">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] border border-[#FFFDF8]/[0.07] transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                      />
                      <div className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${placeholderTone[member.id]} shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] ring-1 ring-[#FFFDF8]/20 ${portraitFrame[member.id]}`}>
                        {member.image.trim() ? (
                          <img
                            src={member.image}
                            alt={fullName ? `Portrait of ${fullName}` : 'Team member portrait'}
                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
                            loading="lazy"
                            onError={(event) => { event.currentTarget.hidden = true; }}
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
                        aria-describedby={`${member.id}-button-context`}
                        onClick={() => toggleMember(member.id)}
                        className="mt-5 inline-flex min-h-11 items-center gap-3 border-b border-[#C99A4B]/55 pb-2 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[#E8D6AD] transition-colors hover:border-[#FFFDF8] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B777] focus-visible:ring-offset-4 focus-visible:ring-offset-[#16231F]"
                      >
                        <span>MORE INFORMATION →</span>
                      </button>
                      <span id={`${member.id}-button-context`} className="sr-only">Member {member.number}: {displayValue(fullName)}</span>

                      <div
                        id={detailsId}
                        aria-hidden={!isExpanded}
                        className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out motion-reduce:transition-none ${isExpanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}
                      >
                        <div className={`min-h-0 overflow-hidden transition-transform duration-300 ease-out motion-reduce:transition-none ${isExpanded ? 'translate-y-0' : '-translate-y-1'}`}>
                          <dl className="space-y-3 border-l border-[#C99A4B]/45 pl-4 text-sm leading-relaxed">
                            <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Full name</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.fullName)}</dd></div>
                            <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Student ID</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.studentId)}</dd></div>
                            <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Gmail</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.gmail)}</dd></div>
                            <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Role</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.role)}</dd></div>
                            <div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">Responsibility</dt><dd className="break-words text-[#F1EBDD]">{displayValue(member.responsibility)}</dd></div>
                          </dl>
                        </div>
                      </div>

                      {isEditing && (
                        <fieldset className="mt-7 space-y-4 border border-[#FFFDF8]/15 bg-[#0F1A17]/45 p-4 sm:p-5">
                          <legend className="px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#D8B777]">Edit waypoint {member.number}</legend>
                          {editableFields.map(({ key, label, multiline }) => {
                            const fieldId = `${member.id}-${key}`;
                            const Field = multiline ? 'textarea' : 'input';
                            return (
                              <label key={key} htmlFor={fieldId} className="block min-w-0">
                                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A9B8A6]">{label}</span>
                                <Field
                                  id={fieldId}
                                  type={key === 'gmail' ? 'email' : 'text'}
                                  rows={multiline ? 4 : undefined}
                                  maxLength={multiline ? 5000 : 500}
                                  value={member[key]}
                                  onChange={(event) => updateDraft(member.id, key, event.target.value)}
                                  className="min-h-11 w-full min-w-0 scroll-mb-28 resize-y border border-[#FFFDF8]/20 bg-[#FFFDF8]/[0.06] px-3 py-2 text-sm leading-relaxed text-[#FFFDF8] outline-none placeholder:text-[#A9B8A6]/60 focus:border-[#D8B777] focus:ring-2 focus:ring-[#D8B777]/30"
                                />
                              </label>
                            );
                          })}
                          <div className="flex flex-wrap items-center gap-3 border-t border-[#FFFDF8]/10 pt-4">
                            <label htmlFor={`${member.id}-portrait`} className="inline-flex min-h-11 scroll-mb-28 cursor-pointer items-center gap-2 border border-[#D8B777]/45 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E8D6AD] transition-colors hover:border-[#D8B777] focus-within:ring-2 focus-within:ring-[#D8B777]">
                              <ImagePlus aria-hidden="true" className="h-4 w-4" /> {member.image ? 'Replace portrait' : 'Upload portrait'}
                              <input
                                id={`${member.id}-portrait`}
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={async (event) => {
                                  const input = event.currentTarget;
                                  const file = input.files?.[0];
                                  if (!file) return;
                                  setEditError('');
                                  try {
                                    updateDraft(member.id, 'image', await compressPortrait(file));
                                  } catch (error) {
                                    setEditError(error instanceof Error ? error.message : 'The image could not be prepared.');
                                  } finally {
                                    input.value = '';
                                  }
                                }}
                              />
                            </label>
                            {member.image && (
                              <button type="button" onClick={() => updateDraft(member.id, 'image', '')} className="inline-flex min-h-11 items-center gap-2 border border-[#FFFDF8]/20 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F1EBDD] transition-colors hover:border-[#FFFDF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B777]">
                                <Trash2 aria-hidden="true" className="h-4 w-4" /> Remove portrait
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] leading-relaxed text-[#A9B8A6]">Portraits are resized and compressed for a natural, undistorted cover crop.</p>
                        </fieldset>
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

