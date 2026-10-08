/**
 * Authoritative Single Chapter Registry for "The River of Insights"
 *
 * EXACT FIVE CHAPTER STOPS:
 * Chapter 7 -> Chapter 8 -> Chapter 9 -> Chapter 10 -> Chapter 11
 *
 * Sequence:
 * chapter-7 -> chapter-8 -> chapter-9 -> chapter-10 -> chapter-11
 * Reverse:
 * chapter-11 -> chapter-10 -> chapter-9 -> chapter-8 -> chapter-7
 */

export type CanonicalChapterId =
  | 'chapter-7'
  | 'chapter-8'
  | 'chapter-9'
  | 'chapter-10'
  | 'chapter-11';

export interface ChapterRegistryEntry {
  id: CanonicalChapterId;
  chapterNumber: number;
  title: string;
  regionName: string;
  targetU: number;
  slug: string;
  contentId: string;
}

export const CHAPTER_REGISTRY: readonly ChapterRegistryEntry[] = [
  {
    id: 'chapter-7',
    chapterNumber: 7,
    title: 'Analytics and Leadership',
    regionName: 'Peach Village',
    targetU: 0.10,
    slug: 'analytics-leadership',
    contentId: 'analytics-leadership',
  },
  {
    id: 'chapter-8',
    chapterNumber: 8,
    title: 'Competing on Analytics',
    regionName: 'Bamboo Forest',
    targetU: 0.15,
    slug: 'competing-on-analytics',
    contentId: 'competing-on-analytics',
  },
  {
    id: 'chapter-9',
    chapterNumber: 9,
    title: "The Analytics Leader's 90-Day Playbook",
    regionName: 'Mountain Valley',
    targetU: 0.20,
    slug: 'analytics-leaders-playbook',
    contentId: 'analytics-leaders-playbook',
  },
  {
    id: 'chapter-10',
    chapterNumber: 10,
    title: 'Making It Happen',
    regionName: 'Lantern Bridge',
    targetU: 0.25,
    slug: 'making-it-happen',
    contentId: 'making-it-happen',
  },
  {
    id: 'chapter-11',
    chapterNumber: 11,
    title: 'Common Pitfalls',
    regionName: 'Forgotten Garden',
    targetU: 0.30,
    slug: 'common-pitfalls',
    contentId: 'common-pitfalls',
  },
] as const;

export function getChapterById(id: string): ChapterRegistryEntry | undefined {
  return CHAPTER_REGISTRY.find((entry) => entry.id === id);
}

export function getChapterByNumber(chapterNumber: number): ChapterRegistryEntry | undefined {
  return CHAPTER_REGISTRY.find((entry) => entry.chapterNumber === chapterNumber);
}

export function getChapterBySlug(slug: string): ChapterRegistryEntry | undefined {
  return CHAPTER_REGISTRY.find((entry) => entry.slug === slug || entry.contentId === slug);
}

export function getNextChapterId(currentId: CanonicalChapterId): CanonicalChapterId | null {
  const index = CHAPTER_REGISTRY.findIndex((entry) => entry.id === currentId);
  if (index >= 0 && index < CHAPTER_REGISTRY.length - 1) {
    return CHAPTER_REGISTRY[index + 1].id;
  }
  return null;
}

export function getPrevChapterId(currentId: CanonicalChapterId): CanonicalChapterId | null {
  const index = CHAPTER_REGISTRY.findIndex((entry) => entry.id === currentId);
  if (index > 0) {
    return CHAPTER_REGISTRY[index - 1].id;
  }
  return null;
}
