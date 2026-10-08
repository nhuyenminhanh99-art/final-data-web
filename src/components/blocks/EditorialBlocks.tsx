import React, { useEffect, useRef, useState } from 'react';
import type {
  HeroBlock, StoryCardBlock, DefinitionBoxBlock, TabsBlock,
  ComparisonTableBlock, ChecklistBlock, QuoteBlock, ContentBlock,
} from '../../types';
import './editorial.css';

/** Presentation-only components. Every string comes from the block props; nothing is authored here. */

const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { el.classList.add('on'); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

const PETALS = Array.from({ length: 12 }, (_, i) => ({ left: (i * 83) % 100, dur: 9 + ((i * 7) % 9), delay: -((i * 5) % 14) }));

export const EdHero: React.FC<{ block: HeroBlock }> = ({ block }) => {
  const num = block.kicker?.match(/\d+/)?.[0];
  return (
    <header className="ed ed-open">
      {num && <div className="ed-num" aria-hidden="true">{num}</div>}
      <svg className="ed-river" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 110 C200 50 380 140 600 100 S1000 50 1200 100 V220 H0Z" fill="#A9B8A6" opacity=".55" />
        <path d="M0 140 C220 90 420 170 640 130 S1020 90 1200 140 V220 H0Z" fill="#9CCBDB" opacity=".85" />
        <path d="M0 175 C260 140 460 200 700 170 S1040 140 1200 175 V220 H0Z" fill="#4C9BB8" />
        <path d="M0 200 C300 175 500 215 760 195 S1060 175 1200 200 V220 H0Z" fill="#2F6F8F" />
      </svg>
      {PETALS.map((p, i) => <span key={i} className="ed-petal" aria-hidden="true" style={{ left: `${p.left}%`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />)}
      <div className="in">
        {block.kicker && <div className="ed-eyebrow">{block.kicker}</div>}
        <h1>{block.title}</h1>
        {block.subtitle && <p className="sub">{block.subtitle}</p>}
        {block.buttons && block.buttons.length > 0 && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            {block.buttons.map((b, i) => <a key={i} href={b.href} className="ed-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{b.label}</a>)}
          </div>
        )}
      </div>
    </header>
  );
};

export const EdStory: React.FC<{ block: StoryCardBlock }> = ({ block }) => {
  const [open, setOpen] = useState(false);
  const ref = useReveal();
  const steps: Array<[string, string]> = [['What changed', block.whatChanged], ['Result', block.result]];
  return (
    <div ref={ref} className="ed ed-rv">
      <div className="ed-story">
        <div className="l">{block.badgeLabel && <span className="ed-badge">{block.badgeLabel}</span>}<h2>{block.who}</h2></div>
        <div className="r">
          <div className="ed-steps">{steps.map(([k, v]) => <div className="ed-step" key={k}><b>{k}</b><p>{v}</p></div>)}</div>
          <div style={{ marginTop: 32 }}>
            <button className="ed-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide insight' : 'Show insight'}</button>
            {open && (
              <div className="ed-reveal">
                {block.whyItWorked && <><b>Why it worked</b><p>{block.whyItWorked}</p></>}
                <b>Lesson</b><p style={{ marginBottom: 0 }}>{block.lesson}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EdDefinition: React.FC<{ block: DefinitionBoxBlock }> = ({ block }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className="ed ed-rv ed-dg">
      <div className="ed-dl"><div className="ed-eyebrow">Definition</div><h2 className="ed-h2">{block.title}</h2></div>
      <ul>{block.bullets.map((b, i) => <li key={i}><i>{String(i + 1).padStart(2, '0')}</i><span>{b}</span></li>)}</ul>
    </div>
  );
};

const stripHtml = (h: string) => h.replace(/<[^>]+>/g, '');

export const EdTabs: React.FC<{ block: TabsBlock; renderBlock: (b: ContentBlock) => React.ReactNode }> = ({ block, renderBlock }) => {
  const [i, setI] = useState(0);
  const ref = useReveal();
  const tab = block.tabs[i];
  const rich = tab.blocks.find((b) => b.type === 'richText') as { html: string } | undefined;
  const quote = tab.blocks.find((b) => b.type === 'quote') as QuoteBlock | undefined;
  const others = tab.blocks.filter((b) => b.type !== 'richText' && b.type !== 'quote');
  const plain = rich ? stripHtml(rich.html) : '';
  const stages = [...plain.matchAll(/([A-Z][a-z]+) \(([^)]*\?)\)/g)];
  const pct = stages.length >= 3 ? plain.match(/(\d+)%/)?.[1] : undefined;
  return (
    <div ref={ref} className="ed ed-rv">
      <div className="ed-eyebrow">Explore</div>
      <div className="ed-nodes" role="tablist" style={{ ['--n' as string]: block.tabs.length }}>
        {block.tabs.map((t, k) => (
          <button key={t.id} role="tab" id={`edt-${t.id}`} aria-selected={k === i} aria-controls={`edp-${block.id}`} className="ed-node" onClick={() => setI(k)}>
            <i>{k + 1}</i>{t.label.replace(/^\d+\.\s*/, '')}
          </button>
        ))}
      </div>
      <div className="ed-panel" role="tabpanel" id={`edp-${block.id}`} aria-labelledby={`edt-${tab.id}`}>
        {pct && <div className="ed-stats"><div className="ed-big">{pct}%</div><div className="ed-stages">{stages.map((s, k) => <div className="ed-stg" key={k}><b>{s[1]}</b><span>{s[2]}</span></div>)}</div></div>}
        {rich && <div className="ed-rich" dangerouslySetInnerHTML={{ __html: rich.html.replace(/class="[^"]*"/g, '') .replace(/^<p>/, '<p>') }} />}
        {quote && <blockquote>{quote.text}{quote.attribution && <cite>{quote.attribution}</cite>}</blockquote>}
        {others.map((b) => <div key={b.id} style={{ marginTop: 24 }}>{renderBlock(b)}</div>)}
      </div>
    </div>
  );
};

export const EdComparison: React.FC<{ block: ComparisonTableBlock }> = ({ block }) => {
  const ref = useReveal();
  const [dim, a, b] = block.columns;
  const three = block.columns.length === 3;
  if (!three) {
    return <div ref={ref} className="ed ed-rv">{block.caption && <h2 className="ed-h2">{block.caption}</h2>}<div style={{ overflowX: 'auto', marginTop: 32 }}><table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter',sans-serif" }}><thead><tr>{block.columns.map((c) => <th key={c} style={{ textAlign: 'left', padding: 14 }}>{c}</th>)}</tr></thead><tbody>{block.rows.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j} style={{ padding: 14, borderTop: '1px solid rgba(22,60,58,.12)' }}>{c}</td>)}</tr>)}</tbody></table></div></div>;
  }
  return (
    <div ref={ref} className="ed ed-rv">
      <div className="ed-eyebrow">Compare</div>
      {block.caption && <h2 className="ed-h2" style={{ maxWidth: '18ch' }}>{block.caption}</h2>}
      <div className="ed-vs" role="table" aria-label={block.caption || dim}>
        <div className="a h" role="columnheader">{a}</div><div className="b h" role="columnheader">{b}</div>
        {block.rows.map((r, k) => <React.Fragment key={k}><div className="d" role="rowheader">{r[0]}</div><div className="a c" role="cell">{r[1]}</div><div className="b c" role="cell">{r[2]}</div></React.Fragment>)}
      </div>
    </div>
  );
};

export const EdChecklist: React.FC<{ block: ChecklistBlock }> = ({ block }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className="ed ed-rv ed-refl">
      <div className="ed-eyebrow">Reflection</div>
      <h2 className="ed-h2">{block.title}</h2>
      <ol>{block.items.map((it, k) => <li key={k}>{it}</li>)}</ol>
    </div>
  );
};

export const EdQuote: React.FC<{ block: QuoteBlock }> = ({ block }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className="ed ed-rv ed-panel" style={{ borderTopColor: '#DDA6A0' }}>
      <blockquote style={{ margin: 0, borderTop: 0, paddingTop: 20 }}>{block.text}{(block.attribution || block.role) && <cite>{block.attribution}{block.role ? ` · ${block.role}` : ''}</cite>}</blockquote>
    </div>
  );
};
