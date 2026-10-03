import React from 'react';
import { BlockRenderer } from '../components/blocks/BlockRenderer';
import { ContentBlock } from '../types';

export const DevBlocksPage: React.FC = () => {
  const sampleBlocks: ContentBlock[] = [
    {
      id: 'demo-hero',
      type: 'hero',
      kicker: 'DEVELOPER SHOWCASE',
      title: 'Block Type Catalog',
      subtitle: 'Inspection harness displaying all 18 block types configured in the design system.',
      buttons: [
        { label: 'Primary Gold Button', href: '#', variant: 'gold' },
        { label: 'Outline Button', href: '#', variant: 'outline' },
      ],
    },
    {
      id: 'demo-richtext',
      type: 'richText',
      html:
        '<p>This is a <strong>richText</strong> block with support for <em>emphasis</em>, <a href="#">inline links</a>, and clear typographic rhythm.</p>',
    },
    {
      id: 'demo-divider-1',
      type: 'divider',
      style: 'river',
    },
    {
      id: 'demo-bignumber',
      type: 'bigNumber',
      value: '$4.5B → $1.5B',
      caption: 'Capital Expenditure Optimization',
      context: 'Measured outcome demonstrating quantitative precision across multi-stakeholder initiatives.',
    },
    {
      id: 'demo-storycard',
      type: 'storyCard',
      who: 'Capital One Banking Innovation',
      whatChanged: 'Replaced traditional credit scoring with tens of thousands of controlled data tests.',
      result: 'Surpassed legacy banks in asset quality and portfolio growth.',
      whyItWorked: 'Executive sponsorship aligned scientific testing with the core P&L.',
      lesson: 'Experimentation culture beats bureaucratic assumptions every time.',
      badgeLabel: 'Exemplar',
    },
    {
      id: 'demo-definition',
      type: 'definitionBox',
      title: 'The Data-Driven Leader Matrix',
      bullets: [
        'Frames commercial ambiguities as testable mathematical hypotheses.',
        'Prioritizes rapid feedback loops over monolithic multi-year IT deployments.',
        'Insists on statistical confidence bands rather than misleading point estimates.',
      ],
    },
    {
      id: 'demo-numbered',
      type: 'numberedCards',
      cards: [
        { number: '01', title: 'Frame the Problem', text: 'Define the boundary conditions and business metric.' },
        { number: '02', title: 'Audit the Data', text: 'Verify provenance, veracity, and missing values.' },
        { number: '03', title: 'Drive to Action', text: 'Translate quantitative outputs into operational workflows.' },
      ],
    },
    {
      id: 'demo-callout-info',
      type: 'callout',
      tone: 'info',
      title: 'Information Callout',
      text: 'Useful context, framework notes, or operational reminders rendered in forest-tinted container.',
    },
    {
      id: 'demo-callout-peach',
      type: 'callout',
      tone: 'peach',
      title: 'Pitfall Warning Callout',
      text: 'Highlights common organizational failures and caution zones using the dusty peach token.',
    },
    {
      id: 'demo-flow',
      type: 'flow',
      steps: [
        { step: 1, label: 'Audit', text: 'Discover current state.' },
        { step: 2, label: 'Hypothesize', text: 'Formulate testable question.' },
        { step: 3, label: 'Test', text: 'Execute controlled trial.' },
        { step: 4, label: 'Scale', text: 'Institutionalize results.' },
      ],
    },
    {
      id: 'demo-comparison',
      type: 'comparisonTable',
      caption: 'Sample Comparison Table',
      columns: ['Capability', 'Level 1: Ad-hoc', 'Level 2: Strategic'],
      rows: [
        ['Metrics', 'Inconsistent across departments', 'Single unified enterprise dictionary'],
        ['Delivery', 'Reactive spreadsheets', 'Embedded prescriptive models'],
      ],
    },
    {
      id: 'demo-checklist',
      type: 'checklist',
      title: 'Implementation Checklist',
      items: [
        'Secure executive sponsor commitment before writing code.',
        'Establish baseline metrics prior to model development.',
        'Review preliminary insights with front-line users.',
      ],
    },
    {
      id: 'demo-quote',
      type: 'quote',
      text: 'Without data you’re just another person with an opinion.',
      attribution: 'W. Edwards Deming',
      role: 'Statistician',
    },
    {
      id: 'demo-divider-dots',
      type: 'divider',
      style: 'dots',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0B] text-[#EDE7D8] pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-[#3A2B20] pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C8A66A] block mb-2">
            Internal Component Testing
          </span>
          <h1 className="text-3xl font-serif text-[#EDE7D8]">/dev/blocks Inspection</h1>
        </header>

        <BlockRenderer blocks={sampleBlocks} />
      </div>
    </div>
  );
};
