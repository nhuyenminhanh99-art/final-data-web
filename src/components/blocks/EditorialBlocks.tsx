import React, { useEffect, useRef, useState } from 'react';
import type {
  HeroBlock, StoryCardBlock, DefinitionBoxBlock, TabsBlock,
  ComparisonTableBlock, ChecklistBlock, QuoteBlock, ContentBlock,
  TwoColumnBlock, NumberedCardsBlock, CalloutBlock, TimelineBlock, FlowBlock, BigNumberBlock, AccordionBlock,
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

/** Wraps numeric data moments ($, %, "N days") in a highlight span. Text is never changed. */
const NUM_RE = /(\$\d[\d,]*(?:\.\d+)?[kKMB]?|\d[\d,]*(?:\.\d+)?%|\b\d+ (?:days|months|weeks|stakeholders|slides)\b)/;
export const Hl: React.FC<{ text: string }> = ({ text }) => (
  <>{text.split(NUM_RE).map((p, i) => (i % 2 ? <span key={i} className="ed-hl">{p}</span> : p))}</>
);

const PETALS = Array.from({ length: 12 }, (_, i) => ({ left: (i * 83) % 100, dur: 9 + ((i * 7) % 9), delay: -((i * 5) % 14) }));

export const EdHero: React.FC<{ block: HeroBlock }> = ({ block }) => {
  const num = block.kicker?.match(/\d+/)?.[0];
  return (
    <header className={`ed ed-open ed-v${num ? parseInt(num, 10) : 7}${block.title.length > 24 ? ' ed-long' : ''}`}>
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
        <h2 className="ed-title">{block.title}</h2>
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
          <div className="ed-steps">{steps.map(([k, v]) => <div className="ed-step" key={k}><b>{k}</b><p><Hl text={v} /></p></div>)}</div>
          <div style={{ marginTop: 32 }}>
            <button className="ed-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide insight' : 'Show insight'}</button>
            {open && (
              <div className="ed-reveal">
                {block.whyItWorked && <><b>Why it worked</b><p><Hl text={block.whyItWorked} /></p></>}
                <b>Lesson</b><p style={{ marginBottom: 0 }}><Hl text={block.lesson} /></p>
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
        <div className="k" role="columnheader">{dim}</div>
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
      <ol>{block.items.map((it, k) => <li key={k}><Hl text={it} /></li>)}</ol>
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

/* ---------- Chapters 8-11: additional presentation components ---------- */

const cleanHtml = (h: string) => h.replace(/class="[^"]*"/g, '');
const TONES = ['#2F6F8F', '#3F9AB5', '#C99A4B', '#DDA6A0', '#A94A56'];
/** Darker siblings of TONES, used where the colour carries text (contrast). */
const TEXT_TONES = ['#2F6F8F', '#1F7A8C', '#85590A', '#A94A56', '#A94A56'];

export const EdDuo: React.FC<{ block: TwoColumnBlock; renderBlock: (b: ContentBlock) => React.ReactNode }> = ({ block, renderBlock }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className="ed ed-rv ed-duo">
      {[block.left, block.right].map((col, i) => {
        const m = col.title?.match(/^([A-Z]{2,})\s+(.+)$/);
        return (
          <section key={i} className={`col c${i}`}>
            {col.title && <h2>{m ? <><span className="lead">{m[1]}</span>{' '}<span className="rest">{m[2]}</span></> : <span className="rest">{col.title}</span>}</h2>}
            {col.blocks.map((b) => b.type === 'richText'
              ? <div key={b.id} className="body" dangerouslySetInnerHTML={{ __html: cleanHtml(b.html) }} />
              : <div key={b.id}>{renderBlock(b)}</div>)}
          </section>
        );
      })}
    </div>
  );
};

export const EdQuestions: React.FC<{ block: NumberedCardsBlock }> = ({ block }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className="ed ed-rv ed-q">
      {block.cards.map((c, i) => (
        <article key={i} className="q" style={{ ['--c' as string]: TONES[i % TONES.length], ['--t' as string]: TEXT_TONES[i % TEXT_TONES.length] }}>
          <i>{c.number}</i>
          <h3>{c.title}</h3>
          <p><Hl text={c.text} /></p>
        </article>
      ))}
    </div>
  );
};

export const EdCallout: React.FC<{ block: CalloutBlock }> = ({ block }) => {
  const ref = useReveal();
  const warm = block.tone === 'peach' || block.tone === 'warning';
  return (
    <aside ref={ref} className={`ed ed-rv ed-call ${warm ? 'warm' : 'cool'}`}>
      <div className="art" aria-hidden="true">
        {warm
          ? <svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="70" fill="none" stroke="#DDA6A0" strokeWidth="3" opacity=".6" /><circle cx="80" cy="80" r="48" fill="none" stroke="#A94A56" strokeWidth="3" opacity=".5" /><circle cx="80" cy="80" r="26" fill="#A94A56" opacity=".85" /></svg>
          : <svg viewBox="0 0 160 160"><circle cx="58" cy="96" r="52" fill="#163C3A" /><circle cx="118" cy="112" r="32" fill="#2F6F8F" /><circle cx="96" cy="50" r="20" fill="#C99A4B" /><circle cx="136" cy="70" r="9" fill="#A9B8A6" /><circle cx="24" cy="38" r="6" fill="#DDA6A0" /></svg>}
      </div>
      <div>
        {block.title && <h2>{block.title}</h2>}
        <p><Hl text={block.text} /></p>
      </div>
    </aside>
  );
};

export const EdTimeline: React.FC<{ block: TimelineBlock }> = ({ block }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className="ed ed-rv ed-tl">
      <div className="route" aria-hidden="true" style={{ ['--n' as string]: block.phases.length }}>
        {block.phases.map((p, i) => <span key={i} style={{ ['--c' as string]: TONES[i % TONES.length] }}>{p.period}</span>)}
      </div>
      <ol>
        {block.phases.map((p, i) => (
          <li key={i} style={{ ['--c' as string]: TONES[i % TONES.length], ['--t' as string]: TEXT_TONES[i % TEXT_TONES.length] }}>
            <div className="when">{p.period}</div>
            <div className="what">
              <h3>{p.label}</h3>
              <p><Hl text={p.text} /></p>
              {p.milestone && (
                <div className="flag">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 21V4m0 0h11l-2 4 2 4H5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span><Hl text={p.milestone} /></span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const EdFlow: React.FC<{ block: FlowBlock }> = ({ block }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className="ed ed-rv ed-flow">
      <ol style={{ ['--n' as string]: block.steps.length }}>
        {block.steps.map((s, i) => (
          <li key={i} style={{ ['--c' as string]: TONES[i % TONES.length] }}>
            <i>{s.step}</i>
            <h3>{s.label}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const EdBigNumber: React.FC<{ block: BigNumberBlock }> = ({ block }) => {
  const ref = useReveal();
  const parts = block.value.split(/\s*\u2192\s*/);
  return (
    <div ref={ref} className="ed ed-rv ed-bn">
      <div className="nums" role="img" aria-label={block.value}>
        {parts.map((v, i) => (
          <React.Fragment key={i}>
            {i > 0 && <svg className="arr" viewBox="0 0 120 40" aria-hidden="true"><path d="M4 20h104m-22-16 22 16-22 16" fill="none" stroke="#C99A4B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            <span className={i === parts.length - 1 ? 'to' : 'from'}>{v}</span>
          </React.Fragment>
        ))}
      </div>
      <h2>{block.caption}</h2>
      {block.context && <p><Hl text={block.context} /></p>}
    </div>
  );
};

export const EdAccordion: React.FC<{ block: AccordionBlock }> = ({ block }) => {
  const ref = useReveal();
  const [open, setOpen] = useState<Record<string, boolean>>({ [block.items[0]?.id || '0']: true });
  return (
    <div ref={ref} className="ed ed-rv ed-acc">
      {block.items.map((it, i) => {
        const on = !!open[it.id];
        return (
          <div key={it.id} className={`row${on ? ' on' : ''}`} style={{ ['--c' as string]: TONES[i % TONES.length] }}>
            <button type="button" id={`eda-h-${it.id}`} aria-expanded={on} aria-controls={`eda-p-${it.id}`} onClick={() => setOpen({ ...open, [it.id]: !on })}>
              {it.badge && <span className="chip">{it.badge}</span>}
              <span className="t">{it.title}</span>
              <span className="pm" aria-hidden="true" />
            </button>
            <div className="pan" id={`eda-p-${it.id}`} role="region" aria-labelledby={`eda-h-${it.id}`}>
              <div>
                <p><Hl text={it.body} /></p>
                {it.extra && <p className="note"><b>Note</b>{it.extra}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
