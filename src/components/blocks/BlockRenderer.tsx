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
    <div className="space-y-12">
      {blocks.map((block, index) => {
        if (block.visible === false) return null;
        return (
          <div key={block.id || index} className="relative group/block" id={block.anchorId}>
            {isEditable && (
              <div className="absolute -top-3 right-0 z-20 flex items-center space-x-2 bg-white border border-[#2F6F6A]/30 rounded-full px-3 py-1 text-xs opacity-0 group-hover/block:opacity-100 transition-opacity shadow-sm">
                <span className="text-[#2F6F6A] uppercase font-mono">{block.type}</span>
                {onMoveUp && index > 0 && (
                  <button
                    onClick={() => onMoveUp(index)}
                    className="hover:text-[#1F4F4B] p-0.5"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                {onMoveDown && index < blocks.length - 1 && (
                  <button
                    onClick={() => onMoveDown(index)}
                    className="hover:text-[#1F4F4B] p-0.5"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                {onDeleteBlock && (
                  <button
                    onClick={() => onDeleteBlock(block.id)}
                    className="hover:text-[#A94A56] p-0.5"
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

/* Sub-renderers for Bright Theme */

const RenderHero: React.FC<{ block: HeroBlock }> = ({ block }) => {
  return (
    <header className="py-6 text-center max-w-4xl mx-auto">
      {block.kicker && (
        <p className="text-xs uppercase tracking-[0.2em] text-[#85590A] font-semibold mb-3">
          {block.kicker}
        </p>
      )}
      <h1 className="text-4xl md:text-6xl font-serif text-[#1E2B26] font-normal leading-tight mb-6">
        {block.title}
      </h1>
      {block.subtitle && (
        <p className="text-lg md:text-xl text-[#4F5E57] font-normal leading-relaxed max-w-2xl mx-auto mb-8">
          {block.subtitle}
        </p>
      )}
      {block.buttons && block.buttons.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {block.buttons.map((btn, i) => (
            <a
              key={i}
              href={btn.href}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                btn.variant === 'outline'
                  ? 'border border-[#2F6F6A]/40 text-[#1F4F4B] hover:border-[#1F4F4B] hover:bg-[#E8EFEA]'
                  : 'bg-[#1F4F4B] text-[#F7F3EA] hover:bg-[#2F6F6A] shadow-md shadow-[#1F4F4B]/20'
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
    <div
      className="prose max-w-none text-[#1E2B26]/90 leading-relaxed text-base md:text-lg [&_p]:mb-4 [&_strong]:text-[#1E2B26] [&_strong]:font-semibold [&_em]:text-[#4F5E57] [&_a]:text-[#2F6F6A] [&_a]:underline hover:[&_a]:text-[#1F4F4B]"
      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  );
};

const RenderStoryCard: React.FC<{ block: StoryCardBlock }> = ({ block }) => {
  return (
    <article className="river-card p-6 md:p-8 relative overflow-hidden my-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6F6A]/5 rounded-bl-full pointer-events-none" />
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#85590A] font-semibold flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#2F6F6A]" />
          {block.badgeLabel || 'Case in Point'}
        </span>
        <span className="text-xs text-[#8E9C96] font-medium font-mono">{block.who}</span>
      </div>

      <h3 className="text-2xl font-serif text-[#1E2B26] mb-4">{block.who}</h3>

      <div className="space-y-4 text-sm md:text-base text-[#4F5E57]">
        <div>
          <span className="text-[#1F4F4B] font-semibold block text-xs uppercase tracking-wider mb-1 font-mono">
            The Intervention
          </span>
          <p className="leading-relaxed">{block.whatChanged}</p>
        </div>

        <div>
          <span className="text-[#1F4F4B] font-semibold block text-xs uppercase tracking-wider mb-1 font-mono">
            The Result
          </span>
          <p className="leading-relaxed text-[#1E2B26] font-medium">{block.result}</p>
        </div>

        {block.whyItWorked && (
          <div>
            <span className="text-[#1F4F4B] font-semibold block text-xs uppercase tracking-wider mb-1 font-mono">
              Why It Worked
            </span>
            <p className="leading-relaxed">{block.whyItWorked}</p>
          </div>
        )}

        <div className="pt-3 border-t border-[#2F6F6A]/15">
          <span className="text-xs uppercase tracking-wider text-[#8E9C96] block mb-1 font-mono">
            Core Leadership Lesson
          </span>
          <p className="font-serif italic text-base md:text-lg text-[#1E2B26]">
            "{block.lesson}"
          </p>
        </div>
      </div>
    </article>
  );
};

const RenderDefinitionBox: React.FC<{ block: DefinitionBoxBlock }> = ({ block }) => {
  return (
    <div className="bg-[#E8EFEA] border-l-4 border-[#2F6F6A] p-6 rounded-r-xl my-6 shadow-sm">
      <h4 className="text-lg md:text-xl font-serif text-[#1E2B26] mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#85590A]" />
        {block.title}
      </h4>
      <ul className="space-y-2.5">
        {block.bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-[#4F5E57]">
            <span className="text-[#2F6F6A] mt-1 shrink-0 font-bold">✦</span>
            <span className="leading-relaxed">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RenderTabs: React.FC<{ block: TabsBlock }> = ({ block }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!block.tabs || block.tabs.length === 0) return null;

  return (
    <div className="my-8">
      {/* Tabs Header */}
      <div className="flex border-b border-[#D5E2DE] overflow-x-auto gap-2 pb-1" role="tablist">
        {block.tabs.map((tab, idx) => (
          <button
            key={tab.id || idx}
            role="tab"
            aria-selected={activeTab === idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-[3px] rounded-t cursor-pointer ${
              activeTab === idx
                ? 'border-[#1F4F4B] text-[#1F4F4B] bg-white font-semibold'
                : 'border-transparent text-[#4F5E57] hover:text-[#1E2B26] hover:border-[#8E9C96]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="river-card p-6 mt-4">
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
    <div className="space-y-3 my-6">
      {block.items.map((item, idx) => {
        const isOpen = !!openIds[item.id || String(idx)];
        return (
          <div
            key={item.id || idx}
            className="border border-[#D5E2DE] rounded-xl overflow-hidden bg-white shadow-sm transition-colors hover:border-[#2F6F6A]/40"
          >
            <button
              onClick={() => toggle(item.id || String(idx))}
              className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 focus:outline-none focus:ring-1 focus:ring-[#2F6F6A] cursor-pointer"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                {item.badge && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E8EFEA] text-[#1F4F4B] font-mono uppercase font-semibold">
                    {item.badge}
                  </span>
                )}
                <span className="font-serif text-lg md:text-xl text-[#1E2B26]">{item.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#8E9C96] transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-[#2F6F6A]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="p-4 md:p-5 pt-0 text-sm md:text-base text-[#4F5E57] leading-relaxed border-t border-[#D5E2DE]/60">
                <p>{item.body}</p>
                {item.extra && (
                  <p className="mt-3 text-xs md:text-sm text-[#85590A] italic font-serif">{item.extra}</p>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
      {block.cards.map((card, idx) => (
        <div key={idx} className="river-card p-6 relative">
          <span className="text-3xl font-serif text-[#85590A] block mb-2 font-light">
            {card.number}
          </span>
          <h4 className="text-xl font-serif text-[#1E2B26] mb-3">{card.title}</h4>
          <p className="text-sm text-[#4F5E57] leading-relaxed">{card.text}</p>
        </div>
      ))}
    </div>
  );
};

const RenderTwoColumn: React.FC<{ block: TwoColumnBlock }> = ({ block }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
      <div className="river-card p-6 md:p-8">
        {block.left.title && (
          <h4 className="text-2xl font-serif text-[#1E2B26] mb-4 pb-2 border-b border-[#2F6F6A]/20">
            {block.left.title}
          </h4>
        )}
        <BlockRenderer blocks={block.left.blocks} />
      </div>
      <div className="river-card p-6 md:p-8">
        {block.right.title && (
          <h4 className="text-2xl font-serif text-[#1E2B26] mb-4 pb-2 border-b border-[#2F6F6A]/20">
            {block.right.title}
          </h4>
        )}
        <BlockRenderer blocks={block.right.blocks} />
      </div>
    </div>
  );
};

const RenderComparisonTable: React.FC<{ block: ComparisonTableBlock }> = ({ block }) => {
  return (
    <div className="my-8">
      {block.caption && (
        <p className="text-xs uppercase tracking-widest text-[#85590A] font-mono mb-2 font-semibold">
          {block.caption}
        </p>
      )}
      <div className="overflow-x-auto border border-[#D5E2DE] rounded-xl bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#D5E2DE] bg-[#E8EFEA]">
              {block.columns.map((col, idx) => (
                <th
                  key={idx}
                  className="p-3.5 md:p-4 text-xs uppercase tracking-wider font-semibold text-[#1F4F4B]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D5E2DE]">
            {block.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-[#E8EFEA]/40 transition-colors">
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`p-3.5 md:p-4 leading-relaxed ${
                      cIdx === 0
                        ? 'font-semibold text-[#1E2B26]'
                        : 'text-[#4F5E57]'
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
    <div className="my-10 relative pl-6 md:pl-8 border-l-2 border-[#2F6F6A]/30 space-y-8">
      {block.phases.map((phase, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-[31px] md:-left-[39px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#1F4F4B] group-hover:scale-125 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#85590A] font-semibold block mb-1">
            {phase.period}
          </span>
          <h4 className="text-2xl font-serif text-[#1E2B26] mb-2">{phase.label}</h4>
          <p className="text-sm md:text-base text-[#4F5E57] leading-relaxed mb-2">{phase.text}</p>
          {phase.milestone && (
            <div className="inline-flex items-center gap-1.5 text-xs text-[#1F4F4B] bg-[#E8EFEA] px-3 py-1 rounded-full font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6F6A]" />
              {phase.milestone}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const RenderFlow: React.FC<{ block: FlowBlock }> = ({ block }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
      {block.steps.map((st, idx) => (
        <div
          key={idx}
          className="river-card p-5 relative flex flex-col justify-between"
        >
          <div>
            <div className="w-7 h-7 rounded-full bg-[#E8EFEA] text-[#1F4F4B] flex items-center justify-center font-mono text-xs font-semibold mb-3">
              {st.step}
            </div>
            <h4 className="text-lg font-serif text-[#1E2B26] mb-2">{st.label}</h4>
            <p className="text-xs md:text-sm text-[#4F5E57] leading-relaxed">{st.text}</p>
          </div>
          {idx < block.steps.length - 1 && (
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#2F6F6A]/40 font-bold">
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const RenderBigNumber: React.FC<{ block: BigNumberBlock }> = ({ block }) => {
  return (
    <div className="my-8 p-8 rounded-2xl bg-gradient-to-r from-[#E8EFEA] via-[#CFE6EA]/30 to-[#E8EFEA] border border-[#2F6F6A]/20 text-center shadow-sm">
      <div className="text-5xl md:text-7xl font-serif text-[#1F4F4B] font-light tracking-tight mb-2">
        {block.value}
      </div>
      <h4 className="text-xl md:text-2xl font-serif text-[#1E2B26] mb-2">{block.caption}</h4>
      {block.context && (
        <p className="text-sm text-[#4F5E57] max-w-xl mx-auto leading-relaxed">{block.context}</p>
      )}
    </div>
  );
};

const RenderChecklist: React.FC<{ block: ChecklistBlock }> = ({ block }) => {
  return (
    <div className="river-card p-6 md:p-8 my-8 border-l-4 border-l-[#1F4F4B]">
      <h4 className="text-xl font-serif text-[#1E2B26] mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-[#2F6F6A]" />
        {block.title}
      </h4>
      <ul className="space-y-3">
        {block.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-[#4F5E57]">
            <span className="text-[#1F4F4B] mt-1 shrink-0 text-xs font-mono font-bold">0{idx + 1}</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RenderQuote: React.FC<{ block: QuoteBlock }> = ({ block }) => {
  return (
    <blockquote className="my-10 p-6 md:p-8 border-y border-[#2F6F6A]/20 text-center max-w-3xl mx-auto bg-[#E8EFEA]/40 rounded-xl">
      <p className="text-xl md:text-3xl font-serif italic text-[#1E2B26] leading-relaxed mb-4">
        "{block.text}"
      </p>
      {block.attribution && (
        <cite className="text-xs uppercase tracking-widest text-[#85590A] font-mono not-italic block font-semibold">
          — {block.attribution} {block.role && <span className="text-[#8E9C96]">({block.role})</span>}
        </cite>
      )}
    </blockquote>
  );
};

const RenderCardGrid: React.FC<{ block: CardGridBlock }> = ({ block }) => {
  const cols = block.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <div className={`grid grid-cols-1 ${cols} gap-6 my-8`}>
      {block.cards.map((card, idx) => (
        <div key={idx} className="river-card p-6 flex flex-col justify-between group">
          <div>
            {card.tags && card.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-3">
                {card.tags.map((tg, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8EFEA] text-[#1F4F4B] font-mono uppercase font-semibold"
                  >
                    {tg}
                  </span>
                ))}
              </div>
            )}
            <h4 className="text-xl font-serif text-[#1E2B26] mb-2 group-hover:text-[#1F4F4B] transition-colors">
              {card.title}
            </h4>
            <p className="text-sm text-[#4F5E57] leading-relaxed mb-4">{card.text}</p>
          </div>
          {card.href && (
            <a
              href={card.href}
              className="inline-flex items-center gap-1.5 text-xs text-[#2F6F6A] hover:text-[#1F4F4B] font-semibold"
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
    <div className="my-8">
      <div className="flex gap-2 flex-wrap mb-6">
        {block.chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedChip(chip)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
              selectedChip.toLowerCase() === chip.toLowerCase()
                ? 'bg-[#1F4F4B] text-[#F7F3EA] font-semibold shadow-sm'
                : 'bg-white text-[#4F5E57] border border-[#D5E2DE] hover:border-[#2F6F6A]'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCards.map((card) => (
          <div key={card.id} className="river-card p-6">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8EFEA] text-[#1F4F4B] font-mono uppercase font-semibold mb-2 inline-block">
              {card.category}
            </span>
            <h4 className="text-xl font-serif text-[#1E2B26] mb-2">{card.title}</h4>
            <p className="text-sm text-[#4F5E57] leading-relaxed mb-4">{card.text}</p>
            {card.result && (
              <p className="text-xs text-[#1E2B26] font-mono border-t border-[#D5E2DE] pt-2 font-medium">
                Impact: {card.result}
              </p>
            )}
            {card.href && (
              <a
                href={card.href}
                className="mt-3 inline-flex items-center gap-1 text-xs text-[#2F6F6A] hover:underline font-semibold"
              >
                Read story <ArrowRight className="w-3 h-3" />
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
    <figure className="my-8 text-center">
      <img
        src={block.src}
        alt={block.alt}
        width={block.width}
        height={block.height}
        loading="lazy"
        className="rounded-xl border border-[#D5E2DE] mx-auto max-h-[500px] object-cover shadow-sm"
      />
      {block.caption && (
        <figcaption className="text-xs text-[#8E9C96] mt-2 font-mono italic">
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
      className={`p-5 rounded-xl border my-6 flex items-start gap-3.5 shadow-sm ${
        isPeach
          ? 'bg-[#F3C1BE]/25 border-[#A94A56]/30 text-[#1E2B26]'
          : 'bg-[#E8EFEA] border-[#2F6F6A]/30 text-[#1E2B26]'
      }`}
    >
      {isPeach ? (
        <AlertTriangle className="w-5 h-5 text-[#A94A56] shrink-0 mt-0.5" />
      ) : (
        <Info className="w-5 h-5 text-[#2F6F6A] shrink-0 mt-0.5" />
      )}
      <div>
        {block.title && (
          <h5
            className={`font-serif text-lg mb-1 ${
              isPeach ? 'text-[#A94A56] font-semibold' : 'text-[#1F4F4B] font-semibold'
            }`}
          >
            {block.title}
          </h5>
        )}
        <p className="text-sm md:text-base leading-relaxed text-[#4F5E57]">{block.text}</p>
      </div>
    </div>
  );
};

const RenderDivider: React.FC<{ block: DividerBlock }> = ({ block }) => {
  if (block.style === 'dots') {
    return (
      <div className="flex justify-center items-center gap-3 my-12 text-[#2F6F6A]/40">
        <span>✦</span>
        <span>✦</span>
        <span>✦</span>
      </div>
    );
  }

  return (
    <div className="my-12 relative flex items-center justify-center">
      <div className="w-full border-t border-[#D5E2DE]" />
      <div className="absolute px-4 bg-[#F7F3EA] text-[#2F6F6A] text-xs font-mono">
        〰〰〰
      </div>
    </div>
  );
};
