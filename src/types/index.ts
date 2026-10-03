export type BlockType =
  | 'hero'
  | 'richText'
  | 'storyCard'
  | 'definitionBox'
  | 'tabs'
  | 'accordion'
  | 'numberedCards'
  | 'twoColumn'
  | 'comparisonTable'
  | 'timeline'
  | 'flow'
  | 'bigNumber'
  | 'checklist'
  | 'quote'
  | 'cardGrid'
  | 'filterGrid'
  | 'image'
  | 'callout'
  | 'divider';

export interface BaseBlock {
  id: string;
  type: BlockType;
  visible?: boolean;
  anchorId?: string;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  kicker?: string;
  title: string;
  subtitle?: string;
  buttons?: Array<{ label: string; href: string; variant?: 'gold' | 'outline' }>;
}

export interface RichTextBlock extends BaseBlock {
  type: 'richText';
  html: string;
}

export interface StoryCardBlock extends BaseBlock {
  type: 'storyCard';
  who: string;
  whatChanged: string;
  result: string;
  whyItWorked?: string;
  lesson: string;
  badgeLabel?: string;
}

export interface DefinitionBoxBlock extends BaseBlock {
  type: 'definitionBox';
  title: string;
  bullets: string[];
}

export interface TabsBlock extends BaseBlock {
  type: 'tabs';
  tabs: Array<{
    id: string;
    label: string;
    blocks: ContentBlock[];
  }>;
}

export interface AccordionBlock extends BaseBlock {
  type: 'accordion';
  items: Array<{
    id: string;
    title: string;
    body: string;
    extra?: string;
    badge?: string;
  }>;
}

export interface NumberedCardsBlock extends BaseBlock {
  type: 'numberedCards';
  cards: Array<{
    number: string;
    title: string;
    text: string;
  }>;
}

export interface TwoColumnBlock extends BaseBlock {
  type: 'twoColumn';
  left: {
    title?: string;
    blocks: ContentBlock[];
  };
  right: {
    title?: string;
    blocks: ContentBlock[];
  };
}

export interface ComparisonTableBlock extends BaseBlock {
  type: 'comparisonTable';
  caption?: string;
  columns: string[];
  rows: string[][];
}

export interface TimelineBlock extends BaseBlock {
  type: 'timeline';
  phases: Array<{
    period: string;
    label: string;
    text: string;
    milestone?: string;
  }>;
}

export interface FlowBlock extends BaseBlock {
  type: 'flow';
  steps: Array<{
    step: number;
    label: string;
    text: string;
  }>;
}

export interface BigNumberBlock extends BaseBlock {
  type: 'bigNumber';
  value: string;
  caption: string;
  context?: string;
}

export interface ChecklistBlock extends BaseBlock {
  type: 'checklist';
  title: string;
  items: string[];
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  attribution?: string;
  role?: string;
}

export interface CardGridBlock extends BaseBlock {
  type: 'cardGrid';
  columns?: 2 | 3;
  cards: Array<{
    title: string;
    text: string;
    tags?: string[];
    href?: string;
    icon?: string;
  }>;
}

export interface FilterGridBlock extends BaseBlock {
  type: 'filterGrid';
  chips: string[];
  cards: Array<{
    id: string;
    title: string;
    category: string;
    text: string;
    result?: string;
    href?: string;
  }>;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  tone: 'info' | 'warning' | 'peach';
  text: string;
  title?: string;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  style?: 'river' | 'dots' | 'simple';
}

export type ContentBlock =
  | HeroBlock
  | RichTextBlock
  | StoryCardBlock
  | DefinitionBoxBlock
  | TabsBlock
  | AccordionBlock
  | NumberedCardsBlock
  | TwoColumnBlock
  | ComparisonTableBlock
  | TimelineBlock
  | FlowBlock
  | BigNumberBlock
  | ChecklistBlock
  | QuoteBlock
  | CardGridBlock
  | FilterGridBlock
  | ImageBlock
  | CalloutBlock
  | DividerBlock;

export interface Chapter {
  slug: string;
  number: number;
  title: string;
  kicker: string;
  tagline: string;
  regionPreset: 'peach_village' | 'bamboo_forest' | 'mountain_valley' | 'lantern_bridge' | 'forgotten_garden';
  regionName: string;
  stopPosition: number; // 0.0 to 1.0 along the river
  summary: string;
  blocks: ContentBlock[];
  seo: {
    title: string;
    description: string;
  };
}

export interface CaseStudy {
  id: string;
  slug: string;
  company: string;
  headline: string;
  tags: string[];
  challenge: string;
  whatHappened: string;
  result: string;
  lesson: string;
  relatedChapterSlug: string;
}

export interface SceneSettings {
  timeOfDay: 'dawn' | 'noon' | 'dusk' | 'night';
  fogDensity: number;
  petalCount: number;
  boatSpeed: number;
  waterTint: string;
  mistStrength: number;
  volume: number;
  qualityTier: 'high' | 'medium' | 'lite';
}

export interface ThemeTokens {
  obsidian: string;
  forest: string;
  deepWater: string;
  wood: string;
  river: string;
  mist: string;
  ivory: string;
  peach: string;
  gold: string;
  stone: string;
  textMuted: string;
}
