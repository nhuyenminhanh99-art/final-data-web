import React, { useState } from 'react';
import {
  ContentBlock,
  HeroBlock,
  RichTextBlock,
  StoryCardBlock,
  DefinitionBoxBlock,
  TabsBlock,
  AccordionBlock,
  NumberedCardsBlock,
  TwoColumnBlock,
  ComparisonTableBlock,
  TimelineBlock,
  FlowBlock,
  BigNumberBlock,
  ChecklistBlock,
  QuoteBlock,
  CardGridBlock,
  FilterGridBlock,
  ImageBlock,
  CalloutBlock,
  DividerBlock,
} from '../../types';
import {
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';

interface BlockRendererProps {
  blocks: ContentBlock[];
  isEditable?: boolean;
  onEditBlock?: (blockId: string, updatedBlock: ContentBlock) => void;
  onDeleteBlock?: (blockId: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  blocks,
  isEditable = false,
  onEditBlock,
  onDeleteBlock,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className="space-y-20 sm:space-y-24">
      {blocks.map((block, index) => {
        if (block.visible === false) return null;
        return (
          <div key={block.id || index} className="relative group/block" id={block.anchorId}>
            {isEditable && (
              <div className="absolute -top-3 right-0 z-20 flex items-center space-x-2 bg-white border border-[#163C3A]/20 rounded-full px-3 py-1 text-xs opacity-0 group-hover/block:opacity-100 transition-opacity shadow-sm">
                <span className="text-[#163C3A] uppercase tracking-wider text-[11px] font-medium font-sans">{block.type}</span>
                {onMoveUp && index > 0 && (
                  <button
                    onClick={() => onMoveUp(index)}
                    className="hover:text-[#2F6F8F] p-0.5 cursor-pointer"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                {onMoveDown && index < blocks.length - 1 && (
                  <button
                    onClick={() => onMoveDown(index)}
                    className="hover:text-[#2F6F8F] p-0.5 cursor-pointer"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                {onDeleteBlock && (
                  <button
                    onClick={() => onDeleteBlock(block.id)}
                    className="hover:text-red-600 p-0.5 cursor-pointer"
                    title="Delete block"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
            <SingleBlock block={block} isEditable={isEditable} />
          </div>
        );
      })}
    </div>
  );
};

export const SingleBlock: React.FC<{ block: ContentBlock; isEditable?: boolean }> = ({ block }) => {
  switch (block.type) {
    case 'hero':
      return <RenderHero block={block} />;
    case 'richText':
      return <RenderRichText block={block} />;
    case 'storyCard':
      return <RenderStoryCard block={block} />;
    case 'definitionBox':
      return <RenderDefinitionBox block={block} />;
    case 'tabs':
      return <RenderTabs block={block} />;
    case 'accordion':
      return <RenderAccordion block={block} />;
    case 'numberedCards':
      return <RenderNumberedCards block={block} />;
    case 'twoColumn':
      return <RenderTwoColumn block={block} />;
    case 'comparisonTable':
      return <RenderComparisonTable block={block} />;
    case 'timeline':
      return <RenderTimeline block={block} />;
    case 'flow':
      return <RenderFlow block={block} />;
    case 'bigNumber':
      return <RenderBigNumber block={block} />;
    case 'checklist':
      return <RenderChecklist block={block} />;
    case 'quote':
      return <RenderQuote block={block} />;
    case 'cardGrid':
      return <RenderCardGrid block={block} />;
    case 'filterGrid':
      return <RenderFilterGrid block={block} />;
    case 'image':
      return <RenderImage block={block} />;
    case 'callout':
      return <RenderCallout block={block} />;
    case 'divider':
      return <RenderDivider block={block} />;
    default:
      return null;
  }
};

/* =========================================================================
   EDITORIAL PRESENTATION SUB-RENDERERS
   Strict Two-Font System: Cormorant Garamond (Serif) + Inter (Sans)
   Varied Compositions: Open Editorial, Split Magazine, Large Insight,
   Connected Pipelines, Monumental Data, and Dynamic Tables.
   ========================================================================= */

const RenderHero: React.FC<{ block: HeroBlock }> = ({ block }) => {
  return (
    <header className="py-12 md:py-16 text-center max-w-4xl mx-auto relative">
      {block.kicker && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6EE] border border-[#C99A4B]/30 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C99A4B]" />
          <p className="text-xs uppercase tracking-[0.22em] text-[#85590A] font-semibold font-sans">
            {block.kicker}
          </p>
        </div>
      )}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#163C3A] font-normal leading-[1.08] mb-7 tracking-tight">
        {block.title}
      </h1>
      {block.subtitle && (
        <p className="text-xl sm:text-2xl md:text-3xl text-[#4A5568] font-serif italic leading-relaxed max-w-3xl mx-auto mb-10">
          "{block.subtitle}"
        </p>
      )}
      {block.buttons && block.buttons.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {block.buttons.map((btn, i) => (
            <a
              key={i}
              href={btn.href}
              className={`px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all font-sans cursor-pointer ${
                btn.variant === 'outline'
                  ? 'border border-[#163C3A]/30 text-[#163C3A] hover:border-[#163C3A] hover:bg-[#EEF3F1]'
                  : 'bg-[#163C3A] text-white hover:bg-[#2F6F8F] shadow-md hover:shadow-lg'
              }`}
            >
              {btn.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

const RenderRichText: React.FC<{ block: RichTextBlock }> = ({ block }) => {
  return (
    <div className="editorial-open max-w-3xl mx-auto my-12 sm:my-16">
      <div
        className="editorial-lead-dropcap prose max-w-none text-[#2D3748] font-sans text-base sm:text-[18px] md:text-[19px] leading-[1.88]
          [&_p]:text-[#2D3748] [&_p]:mb-8
          [&_h2]:font-serif [&_h2]:text-3xl sm:[&_h2]:text-4xl [&_h2]:text-[#163C3A] [&_h2]:font-normal [&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:leading-snug
          [&_h3]:font-serif [&_h3]:text-2xl sm:[&_h3]:text-3xl [&_h3]:text-[#163C3A] [&_h3]:font-normal [&_h3]:mt-12 [&_h3]:mb-5 [&_h3]:leading-snug
          [&_strong]:text-[#163C3A] [&_strong]:font-semibold
          [&_em]:text-[#4A5568] [&_em]:font-serif [&_em]:italic
          [&_a]:text-[#2F6F8F] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#163C3A] [&_a]:transition-colors
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3.5 [&_ul]:my-8
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3.5 [&_ol]:my-8
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#C99A4B] [&_blockquote]:bg-[#FAF6EE]/60 [&_blockquote]:pl-8 [&_blockquote]:pr-6 [&_blockquote]:py-4 [&_blockquote]:rounded-r-xl [&_blockquote]:my-10 [&_blockquote]:font-serif [&_blockquote]:italic [&_blockquote]:text-xl sm:[&_blockquote]:text-2xl [&_blockquote]:text-[#163C3A]"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    </div>
  );
};

const RenderStoryCard: React.FC<{ block: StoryCardBlock }> = ({ block }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const dynamicsId = `dynamics-${block.who?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'story'}`;

  return (
    <article className="my-18 sm:my-24 bg-white border border-[#163C3A]/14 rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(22,60,58,0.04),0_12px_28px_-4px_rgba(22,60,58,0.08)]">
      {/* Editorial Banner Header */}
      <div className="bg-gradient-to-r from-[#FAF6EE] via-white to-[#F4F8F7] px-8 sm:px-12 py-7 border-b border-[#163C3A]/12 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] font-semibold flex items-center gap-2 font-sans">
          <BookOpen className="w-4 h-4 text-[#C99A4B]" />
          {block.badgeLabel || 'Executive Case Study'}
        </span>
        <span className="text-xs text-[#163C3A] bg-[#EEF3F1] border border-[#163C3A]/15 px-4 py-1.5 rounded-full font-medium font-sans">
          {block.who}
        </span>
      </div>

      <div className="p-8 sm:p-12 md:p-14 space-y-10">
        <div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#163C3A] font-normal mb-5 leading-tight">
            {block.who}
          </h3>
          <div className="w-16 h-1 bg-[#C99A4B] rounded-full" />
        </div>

        {/* Split Magazine Composition: Intervention & Outcome */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Strategic Intervention & Dynamic Mechanics */}
          <div className="lg:col-span-7 space-y-7">
            <div className="p-7 rounded-2xl bg-[#F9FAF8] border border-[#163C3A]/12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#163C3A] block mb-3 font-sans">
                The Strategic Intervention
              </span>
              <p className="text-base sm:text-lg text-[#2D3748] leading-relaxed font-sans">
                {block.whatChanged}
              </p>
            </div>

            {/* Progressive Interactive Reveal for Underlying Dynamics */}
            {block.whyItWorked && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsRevealed(!isRevealed)}
                  aria-expanded={isRevealed}
                  aria-controls={dynamicsId}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2F6F8F] hover:text-[#163C3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6F8F] rounded-full px-5 py-2.5 bg-[#EEF3F1] hover:bg-[#E2EBE8] cursor-pointer font-sans"
                >
                  <span>{isRevealed ? 'Hide Underlying Dynamics' : 'Explore Underlying Dynamics'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRevealed ? 'rotate-180' : ''}`} />
                </button>
                {isRevealed && (
                  <div
                    id={dynamicsId}
                    role="region"
                    aria-label="Underlying Dynamics"
                    className="mt-5 p-7 rounded-2xl bg-[#FAF6EE] border border-[#C99A4B]/30 text-base leading-relaxed text-[#2D3748] font-sans animate-memory"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#85590A] block mb-2 font-sans">
                      Underlying Dynamics & Mechanics
                    </span>
                    <p>{block.whyItWorked}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: High-Impact Measured Outcome Anchor */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="editorial-deep p-8 sm:p-9 rounded-2xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#C99A4B]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C99A4B] font-sans">
                    Measured Business Outcome
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-serif text-white leading-relaxed font-normal">
                  {block.result}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/15 text-xs text-[#A9B8A6] font-sans">
                Verified Enterprise Impact Landmark
              </div>
            </div>
          </div>
        </div>

        {/* Core Leadership Lesson in Cormorant Garamond Pull-Quote */}
        <div className="pt-10 border-t border-[#163C3A]/12 bg-[#FAF6EE]/50 -mx-8 sm:-mx-12 md:-mx-14 -mb-8 sm:-mb-12 md:-mb-14 p-8 sm:p-12 md:p-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] block mb-3 font-semibold font-sans">
            ✦ Core Leadership Lesson ✦
          </span>
          <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#163C3A] leading-snug max-w-4xl">
            "{block.lesson}"
          </blockquote>
        </div>
      </div>
    </article>
  );
};

const RenderDefinitionBox: React.FC<{ block: DefinitionBoxBlock }> = ({ block }) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  return (
    <div className="editorial-parchment p-8 sm:p-12 md:p-14 my-18 sm:my-24 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#C99A4B]/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#C99A4B]" />
        </div>
        <h4 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#163C3A] font-normal leading-tight">
          {block.title}
        </h4>
      </div>

      <ul className="space-y-5" role="list">
        {block.bullets.map((bullet, idx) => {
          const isHighlighted = highlightedIndex === idx;
          return (
            <li
              key={idx}
              onClick={() => setHighlightedIndex(isHighlighted ? null : idx)}
              className={`p-4 sm:p-5 rounded-xl transition-all cursor-pointer flex items-start gap-4 ${
                isHighlighted
                  ? 'bg-white shadow-md ring-2 ring-[#C99A4B]/40'
                  : 'hover:bg-white/80'
              }`}
            >
              <span className="text-[#C99A4B] mt-1 shrink-0 text-base font-bold">✦</span>
              <div className="flex-1 text-base sm:text-lg text-[#2D3748] leading-relaxed font-sans">
                {bullet}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const RenderTabs: React.FC<{ block: TabsBlock }> = ({ block }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!block.tabs || block.tabs.length === 0) return null;

  return (
    <div className="my-18 sm:my-24">
      {/* Sleek Tactile Tab Pill Bar */}
      <div className="flex justify-center mb-10 overflow-x-auto pb-2">
        <div
          className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EEF3F1] border border-[#163C3A]/12 shadow-inner"
          role="tablist"
        >
          {block.tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id || idx}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(idx)}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all font-sans cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#163C3A] text-white shadow-sm'
                    : 'text-[#4A5568] hover:text-[#163C3A] hover:bg-white/60'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C99A4B]" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Surface */}
      <div className="space-y-12">
        {block.tabs[activeTab]?.blocks && (
          <BlockRenderer blocks={block.tabs[activeTab].blocks} />
        )}
      </div>
    </div>
  );
};

const RenderAccordion: React.FC<{ block: AccordionBlock }> = ({ block }) => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [block.items[0]?.id || '0']: true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="divide-y divide-[#163C3A]/14 border-y border-[#163C3A]/16 my-16 sm:my-20">
      {block.items.map((item, idx) => {
        const itemId = item.id || String(idx);
        const isOpen = !!openIds[itemId];
        const panelId = `accordion-panel-${itemId}`;
        const headerId = `accordion-header-${itemId}`;
        return (
          <div key={itemId} className="transition-colors hover:bg-[#FAF7F2]/40">
            <button
              id={headerId}
              type="button"
              onClick={() => toggle(itemId)}
              className="w-full text-left py-6 sm:py-7 flex items-center justify-between gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#163C3A] cursor-pointer group px-2 sm:px-4"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <div className="flex items-center gap-4 flex-wrap">
                {item.badge && (
                  <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF3F1] text-[#163C3A] font-semibold font-sans border border-[#163C3A]/12">
                    {item.badge}
                  </span>
                )}
                <span className="font-serif text-2xl sm:text-3xl text-[#163C3A] font-normal group-hover:text-[#2F6F8F] transition-colors leading-snug">
                  {item.title}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#EEF3F1] flex items-center justify-center shrink-0 group-hover:bg-[#163C3A] group-hover:text-white transition-colors">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="pb-8 pt-2 px-2 sm:px-4 text-base sm:text-lg text-[#2D3748] leading-relaxed font-sans max-w-4xl space-y-4 animate-memory"
              >
                <p>{item.body}</p>
                {item.extra && (
                  <div className="mt-5 p-5 rounded-xl bg-[#FAF6EE] border-l-4 border-l-[#C99A4B] border-y border-r border-[#C99A4B]/20">
                    <span className="text-xs uppercase tracking-wider text-[#85590A] font-semibold block mb-1 font-sans">
                      Executive Note:
                    </span>
                    <p className="text-sm sm:text-base text-[#163C3A] font-serif italic">
                      {item.extra}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const RenderNumberedCards: React.FC<{ block: NumberedCardsBlock }> = ({ block }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 my-18 sm:my-24">
      {block.cards.map((card, idx) => {
        // Diverse visual rhythm across the 3 cards
        const cardStyle =
          idx === 0
            ? 'bg-[#FAF6EE] border-t-4 border-t-[#C99A4B] border-x border-b border-[#C99A4B]/25'
            : idx === 1
            ? 'bg-white border-t-4 border-t-[#2F6F8F] border-x border-b border-[#2F6F8F]/25 shadow-md'
            : 'bg-[#F4F8F7] border-t-4 border-t-[#163C3A] border-x border-b border-[#163C3A]/20';

        const numberColor =
          idx === 0 ? 'text-[#C99A4B]' : idx === 1 ? 'text-[#2F6F8F]' : 'text-[#163C3A]';

        return (
          <div
            key={idx}
            className={`p-8 sm:p-10 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_8px_rgba(22,60,58,0.04)] ${cardStyle}`}
          >
            <div>
              <span className={`text-6xl sm:text-7xl font-serif ${numberColor} block mb-5 font-light leading-none`}>
                {card.number}
              </span>
              <h4 className="text-2xl font-serif text-[#163C3A] mb-4 font-normal leading-snug">
                {card.title}
              </h4>
              <p className="text-base text-[#4A5568] leading-relaxed font-sans">{card.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RenderTwoColumn: React.FC<{ block: TwoColumnBlock }> = ({ block }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 my-18 sm:my-24">
      {/* Left Column: Warm Parchment for Strategic Levers */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF6EE]/80 border-t-4 border-t-[#C99A4B] border-x border-b border-[#C99A4B]/25 shadow-sm">
        {block.left.title && (
          <div className="mb-8 pb-5 border-b border-[#C99A4B]/30">
            <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] font-semibold block mb-2 font-sans">
              Dimension A
            </span>
            <h4 className="text-3xl font-serif text-[#163C3A] font-normal">
              {block.left.title}
            </h4>
          </div>
        )}
        <BlockRenderer blocks={block.left.blocks} />
      </div>

      {/* Right Column: Cool River Mist for Organizational Design */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#F4F8F7] border-t-4 border-t-[#2F6F8F] border-x border-b border-[#2F6F8F]/25 shadow-sm">
        {block.right.title && (
          <div className="mb-8 pb-5 border-b border-[#2F6F8F]/30">
            <span className="text-xs uppercase tracking-[0.2em] text-[#2F6F8F] font-semibold block mb-2 font-sans">
              Dimension B
            </span>
            <h4 className="text-3xl font-serif text-[#163C3A] font-normal">
              {block.right.title}
            </h4>
          </div>
        )}
        <BlockRenderer blocks={block.right.blocks} />
      </div>
    </div>
  );
};

const RenderComparisonTable: React.FC<{ block: ComparisonTableBlock }> = ({ block }) => {
  return (
    <div className="my-18 sm:my-24">
      {block.caption && (
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-[#C99A4B]" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#85590A] font-semibold font-sans">
            {block.caption}
          </p>
        </div>
      )}
      <div className="overflow-x-auto border border-[#163C3A]/16 rounded-2xl bg-white shadow-[0_2px_8px_rgba(22,60,58,0.04),0_12px_24px_-4px_rgba(22,60,58,0.06)]">
        <table className="w-full text-left border-collapse font-sans text-sm sm:text-base">
          <thead>
            <tr className="border-b border-[#163C3A]/20 bg-[#163C3A] text-white">
              {block.columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`p-5 sm:p-6 font-serif text-lg sm:text-xl font-normal tracking-wide ${
                    idx === 0 ? 'text-[#FAF6EE]' : idx === 1 ? 'text-[#DDA6A0]' : 'text-[#A9B8A6]'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#163C3A]/12">
            {block.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`transition-colors ${
                  rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/60'
                } hover:bg-[#EEF3F1]/50`}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`p-5 sm:p-6 leading-relaxed ${
                      cIdx === 0
                        ? 'font-medium text-[#163C3A] text-base sm:text-lg border-r border-[#163C3A]/10'
                        : 'text-[#2D3748]'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RenderTimeline: React.FC<{ block: TimelineBlock }> = ({ block }) => {
  return (
    <div className="my-18 sm:my-24 relative pl-8 sm:pl-12 border-l-4 border-l-[#C99A4B] space-y-16">
      {block.phases.map((phase, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-[42px] sm:-left-[58px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-[#163C3A] group-hover:border-[#C99A4B] group-hover:scale-125 transition-all shadow-md flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C99A4B]" />
          </div>
          <span className="text-xs uppercase tracking-[0.22em] text-[#85590A] font-semibold block mb-2 font-sans">
            {phase.period}
          </span>
          <h4 className="text-2xl sm:text-4xl font-serif text-[#163C3A] mb-3.5 font-normal leading-snug">
            {phase.label}
          </h4>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed mb-6 font-sans max-w-3xl">
            {phase.text}
          </p>
          {phase.milestone && (
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#163C3A] bg-[#EEF3F1] border border-[#163C3A]/15 px-4 py-2 rounded-full font-medium font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#2F6F8F]" />
              <span>{phase.milestone}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const RenderFlow: React.FC<{ block: FlowBlock }> = ({ block }) => {
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);

  return (
    <div className="my-18 sm:my-24 space-y-8">
      {/* Visual Connected Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
        {block.steps.map((st, idx) => {
          const isSelected = activeStepIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveStepIdx(isSelected ? null : idx)}
              className={`p-6 sm:p-7 relative flex flex-col justify-between rounded-2xl border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-[#163C3A] text-white border-[#163C3A] ring-4 ring-[#C99A4B]/30 -translate-y-1'
                  : 'bg-white border-[#163C3A]/15 hover:border-[#163C3A]/35 hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-5 font-sans transition-colors ${
                    isSelected ? 'bg-[#C99A4B] text-[#163C3A]' : 'bg-[#EEF3F1] text-[#163C3A]'
                  }`}
                >
                  0{st.step}
                </div>
                <h4
                  className={`text-lg sm:text-xl font-serif mb-2.5 font-normal leading-snug ${
                    isSelected ? 'text-white' : 'text-[#163C3A]'
                  }`}
                >
                  {st.label}
                </h4>
                <p
                  className={`text-xs sm:text-sm leading-relaxed font-sans ${
                    isSelected ? 'text-[#E1EDF2]' : 'text-[#4A5568]'
                  }`}
                >
                  {st.text}
                </p>
              </div>

              <div
                className={`mt-6 pt-3 border-t text-[11px] font-semibold uppercase tracking-wider font-sans flex items-center justify-between ${
                  isSelected ? 'border-white/20 text-[#C99A4B]' : 'border-[#163C3A]/10 text-[#2F6F8F]'
                }`}
              >
                <span>{isSelected ? 'Selected' : 'Inspect'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isSelected ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {activeStepIdx !== null && (
        <div
          role="region"
          aria-label="Active Stage Detail"
          className="p-8 sm:p-10 rounded-2xl bg-[#FAF6EE] border-l-4 border-l-[#C99A4B] border-y border-r border-[#C99A4B]/30 shadow-md animate-memory space-y-4"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-wider text-[#85590A] font-semibold font-sans">
              Stage 0{block.steps[activeStepIdx].step} Focused Inspection
            </span>
            <button
              type="button"
              onClick={() => setActiveStepIdx(null)}
              className="text-xs text-[#718096] hover:text-[#163C3A] uppercase tracking-wider font-semibold cursor-pointer font-sans"
            >
              Close ✕
            </button>
          </div>
          <h4 className="text-2xl sm:text-3xl font-serif text-[#163C3A] font-normal leading-snug">
            {block.steps[activeStepIdx].label}
          </h4>
          <p className="text-base sm:text-lg text-[#2D3748] leading-relaxed font-sans">
            {block.steps[activeStepIdx].text}
          </p>
        </div>
      )}
    </div>
  );
};

const RenderBigNumber: React.FC<{ block: BigNumberBlock }> = ({ block }) => {
  return (
    <div className="my-20 sm:my-28 p-12 sm:p-16 md:p-20 rounded-3xl bg-gradient-to-b from-white via-[#FAF6EE]/50 to-white border border-[#C99A4B]/30 text-center shadow-[0_4px_16px_rgba(201,154,75,0.08),0_16px_36px_-6px_rgba(22,60,58,0.06)] max-w-4xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C99A4B] to-transparent" />
      <div className="text-7xl sm:text-8xl md:text-9xl font-serif text-[#163C3A] font-light tracking-tight mb-6">
        {block.value}
      </div>
      <h4 className="text-2xl sm:text-4xl font-serif text-[#163C3A] mb-4 font-normal">
        {block.caption}
      </h4>
      {block.context && (
        <p className="text-base sm:text-lg text-[#4A5568] max-w-2xl mx-auto leading-relaxed font-sans mt-4">
          {block.context}
        </p>
      )}
    </div>
  );
};

const RenderChecklist: React.FC<{ block: ChecklistBlock }> = ({ block }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const total = block.items.length;
  const completed = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="p-8 sm:p-12 md:p-14 my-18 sm:my-24 bg-white border-l-4 border-l-[#163C3A] border-y border-r border-[#163C3A]/15 rounded-r-3xl shadow-[0_2px_8px_rgba(22,60,58,0.04),0_12px_28px_-4px_rgba(22,60,58,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-9 border-b border-[#163C3A]/12 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#85590A] font-semibold block mb-1 font-sans">
            ✦ Executive Charter ✦
          </span>
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#163C3A] font-normal">
            {block.title}
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-sans">
          <span className="text-[#718096]">
            {completed} of {total} acknowledged
          </span>
          <div className="w-28 h-2.5 bg-[#EEF3F1] rounded-full overflow-hidden border border-[#163C3A]/10">
            <div
              className="h-full bg-[#163C3A] transition-all duration-300"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <ul className="space-y-4" role="list">
        {block.items.map((item, idx) => {
          const isDone = !!checkedItems[idx];
          return (
            <li
              key={idx}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isDone
                  ? 'bg-[#EEF3F1]/80 border-[#2F6F8F]/40'
                  : 'bg-[#F9FAF8] border-[#163C3A]/12 hover:border-[#163C3A]/30 hover:bg-white'
              }`}
              onClick={() => toggleCheck(idx)}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={isDone}
                aria-label={`Acknowledge: ${item}`}
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                  isDone
                    ? 'bg-[#163C3A] border-[#163C3A] text-white'
                    : 'border-[#163C3A]/35 bg-white hover:border-[#163C3A]'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1 text-base sm:text-lg text-[#2D3748] font-sans">
                <span className={`leading-relaxed ${isDone ? 'line-through text-[#718096]' : ''}`}>
                  {item}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const RenderQuote: React.FC<{ block: QuoteBlock }> = ({ block }) => {
  return (
    <blockquote className="my-22 sm:my-28 py-12 sm:py-16 px-6 sm:px-12 text-center max-w-4xl mx-auto relative">
      <span className="text-8xl sm:text-9xl font-serif text-[#C99A4B]/20 leading-none select-none block -mb-10 sm:-mb-14">
        “
      </span>
      <p className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-[#163C3A] leading-snug mb-8 relative z-10 font-light">
        "{block.text}"
      </p>
      {block.attribution && (
        <cite className="text-xs uppercase tracking-[0.22em] text-[#85590A] not-italic block font-semibold font-sans">
          — {block.attribution} {block.role && <span className="text-[#718096]">({block.role})</span>}
        </cite>
      )}
    </blockquote>
  );
};

const RenderCardGrid: React.FC<{ block: CardGridBlock }> = ({ block }) => {
  const cols = block.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <div className={`grid grid-cols-1 ${cols} gap-8 sm:gap-10 my-18 sm:my-24`}>
      {block.cards.map((card, idx) => (
        <div
          key={idx}
          className="p-8 md:p-10 bg-white border border-[#163C3A]/14 rounded-3xl flex flex-col justify-between group shadow-sm hover:shadow-md hover:border-[#163C3A]/30 transition-all"
        >
          <div>
            {card.tags && card.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-5">
                {card.tags.map((tg, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] px-3 py-1 rounded-full bg-[#EEF3F1] text-[#163C3A] uppercase tracking-wider font-semibold font-sans border border-[#163C3A]/10"
                  >
                    {tg}
                  </span>
                ))}
              </div>
            )}
            <h4 className="text-2xl font-serif text-[#163C3A] mb-3.5 group-hover:text-[#2F6F8F] transition-colors font-normal leading-snug">
              {card.title}
            </h4>
            <p className="text-base text-[#4A5568] leading-relaxed mb-6 font-sans">{card.text}</p>
          </div>
          {card.href && (
            <a
              href={card.href}
              className="inline-flex items-center gap-1.5 text-xs text-[#2F6F8F] hover:text-[#163C3A] font-semibold uppercase tracking-wider font-sans transition-colors"
            >
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

const RenderFilterGrid: React.FC<{ block: FilterGridBlock }> = ({ block }) => {
  const [selectedChip, setSelectedChip] = useState('All');

  const filteredCards =
    selectedChip === 'All'
      ? block.cards
      : block.cards.filter((c) => c.category.toLowerCase() === selectedChip.toLowerCase());

  return (
    <div className="my-18 sm:my-24">
      <div className="flex gap-3 flex-wrap mb-10">
        {block.chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedChip(chip)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all font-sans cursor-pointer ${
              selectedChip.toLowerCase() === chip.toLowerCase()
                ? 'bg-[#163C3A] text-white shadow-sm'
                : 'bg-white text-[#4A5568] border border-[#163C3A]/15 hover:border-[#163C3A] shadow-xs'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="p-8 md:p-10 bg-white border border-[#163C3A]/14 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
          >
            <div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#EEF3F1] text-[#163C3A] uppercase tracking-wider font-semibold mb-4 inline-block font-sans border border-[#163C3A]/10">
                {card.category}
              </span>
              <h4 className="text-2xl sm:text-3xl font-serif text-[#163C3A] mb-4 font-normal leading-snug">
                {card.title}
              </h4>
              <p className="text-base text-[#4A5568] leading-relaxed mb-6 font-sans">{card.text}</p>
              {card.result && (
                <div className="pt-5 border-t border-[#163C3A]/10 text-sm text-[#163C3A] font-medium font-sans">
                  <span className="text-[#85590A] uppercase tracking-wider text-[11px] block font-semibold mb-1">
                    Impact
                  </span>
                  {card.result}
                </div>
              )}
            </div>
            {card.href && (
              <a
                href={card.href}
                className="mt-6 inline-flex items-center gap-1.5 text-xs text-[#2F6F8F] hover:text-[#163C3A] font-semibold uppercase tracking-wider font-sans transition-colors"
              >
                Read story <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const RenderImage: React.FC<{ block: ImageBlock }> = ({ block }) => {
  return (
    <figure className="my-18 sm:my-24 text-center">
      <img
        src={block.src}
        alt={block.alt}
        width={block.width}
        height={block.height}
        loading="lazy"
        className="rounded-3xl border border-[#163C3A]/14 mx-auto max-h-[500px] object-cover shadow-[0_2px_8px_rgba(22,60,58,0.04),0_12px_28px_-4px_rgba(22,60,58,0.06)]"
      />
      {block.caption && (
        <figcaption className="text-xs sm:text-sm text-[#718096] mt-4 italic font-serif">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
};

const RenderCallout: React.FC<{ block: CalloutBlock }> = ({ block }) => {
  const isPeach = block.tone === 'peach' || block.tone === 'warning';
  return (
    <div
      className={`p-8 sm:p-10 md:p-12 rounded-3xl border-l-4 my-18 sm:my-24 flex items-start gap-6 shadow-[0_2px_8px_rgba(22,60,58,0.04)] ${
        isPeach
          ? 'bg-[#FFF7F6] border-l-[#A94A56] border-y border-r border-[#A94A56]/25'
          : 'bg-[#F4F8F7] border-l-[#163C3A] border-y border-r border-[#163C3A]/18'
      }`}
    >
      {isPeach ? (
        <AlertTriangle className="w-6 h-6 text-[#A94A56] shrink-0 mt-1" />
      ) : (
        <Info className="w-6 h-6 text-[#2F6F8F] shrink-0 mt-1" />
      )}
      <div>
        {block.title && (
          <h5
            className={`font-serif text-2xl sm:text-3xl mb-3 ${
              isPeach ? 'text-[#A94A56] font-normal' : 'text-[#163C3A] font-normal'
            }`}
          >
            {block.title}
          </h5>
        )}
        <p className="text-base sm:text-lg leading-relaxed text-[#2D3748] font-sans">{block.text}</p>
      </div>
    </div>
  );
};

const RenderDivider: React.FC<{ block: DividerBlock }> = ({ block }) => {
  if (block.style === 'dots') {
    return (
      <div className="flex justify-center items-center gap-3 my-20 sm:my-24 text-[#163C3A]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#163C3A]/25" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#163C3A]/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#163C3A]/25" />
      </div>
    );
  }

  return (
    <div className="my-20 sm:my-24 relative flex items-center justify-center">
      <div className="w-full border-t border-[#163C3A]/15" />
      <div className="absolute px-5 bg-[#FFFDF8] text-[#85590A] text-xs tracking-widest uppercase font-serif">
        ✦
      </div>
    </div>
  );
};
