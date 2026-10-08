export interface GlossaryTerm {
  id: string;
  term: string;
  partOfSpeech: string;
  executiveTakeaway: string;
  category: 'Leadership' | 'Analytics' | 'Data' | 'Organization' | 'Execution' | 'Business';
  definition: string;
  sourceContext: string;
  relatedTerms: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'analytics-leader',
    term: 'Analytics Leader',
    partOfSpeech: 'noun',
    executiveTakeaway: 'Bridges statistical models with commercial reality, translating business dilemmas into testable hypotheses.',
    category: 'Leadership',
    definition:
      'An executive or manager who bridges quantitative models with commercial reality, framing strategic bets into testable hypotheses and building an experimentation culture.',
    sourceContext: 'Chapter 7: Analytics and Leadership',
    relatedTerms: ['Analytics Culture', 'Analytics Capability', 'Decision Making'],
  },
  {
    id: 'analytics-culture',
    term: 'Analytics Culture',
    partOfSpeech: 'noun',
    executiveTakeaway: 'Transitions organizational decision-making from executive gut feel to disciplined hypothesis testing.',
    category: 'Leadership',
    definition:
      'An organizational operating rhythm where hypothesis testing replaces HIPPO (Highest Paid Person’s Opinion) and disproved assumptions are treated as valuable learning.',
    sourceContext: 'Chapter 7: Analytics and Leadership (Capital One case)',
    relatedTerms: ['HIPPO', 'Decision Making', 'Analytics Leader'],
  },
  {
    id: 'analytics-capability',
    term: 'Analytics Capability',
    partOfSpeech: 'noun',
    executiveTakeaway: 'The collective enterprise maturity across leadership, talent triad, decision culture, and data tooling.',
    category: 'Analytics',
    definition:
      'The collective organizational proficiency across four foundational pillars: Leadership vision, Analytics talent triad, Decision-making culture, and Data maturity.',
    sourceContext: 'Chapter 7: Four Foundations of Analytics Maturity',
    relatedTerms: ['Data Maturity', 'Analytics Talent', 'D2D'],
  },
  {
    id: 'big-rocks',
    term: 'Big Rocks',
    partOfSpeech: 'noun phrase',
    executiveTakeaway: 'The 3 to 5 enterprise priorities that move top-line revenue, bottom-line costs, or core risk exposures.',
    category: 'Execution',
    definition:
      'The 3 to 5 highest-stakes enterprise business problems (in Revenue, Cost, or Risk) that warrant dedicated data science capacity, guarded from incidental ad-hoc requests.',
    sourceContext: 'Chapter 8: Competing on Analytics',
    relatedTerms: ['Pullable Levers', 'Prioritization', 'KPI'],
  },
  {
    id: 'd2d',
    term: 'D2D (Data-to-Decisions)',
    partOfSpeech: 'framework acronym',
    executiveTakeaway: 'A structured, closed-loop operating methodology ensuring analytical insights culminate in measurable commercial action.',
    category: 'Analytics',
    definition:
      'The structured, repeatable methodology converting business questions into quantitative insights, actions, and measurable commercial return.',
    sourceContext: 'Chapters 7–11: Behind Every Good Decision methodology',
    relatedTerms: ['Analytics Capability', 'Data Maturity', 'Business Impact'],
  },
  {
    id: 'data-maturity',
    term: 'Data Maturity',
    partOfSpeech: 'noun phrase',
    executiveTakeaway: 'The developmental journey advancing from backwards-looking descriptive reporting to forward prescriptive action.',
    category: 'Data',
    definition:
      'The developmental continuum of analytics sophistication progressing through four distinct stages: Descriptive, Diagnostic, Predictive, and Prescriptive.',
    sourceContext: 'Chapter 7: Foundation 4 (Data Maturity & Tools)',
    relatedTerms: ['Prescriptive Analytics', 'Analytics Capability'],
  },
  {
    id: 'embedded-analytics',
    term: 'Embedded Analytics',
    partOfSpeech: 'noun phrase',
    executiveTakeaway: 'Hub-and-spoke organizational topology embedding specialized quants directly inside business unit workflows.',
    category: 'Organization',
    definition:
      'An organizational staffing model where quantitative analysts sit directly within functional business units (Hub-and-Spoke) rather than an isolated IT back office.',
    sourceContext: 'Chapter 8: Organizational Models (Centralized vs Embedded)',
    relatedTerms: ['Head of Analytics', 'Analytics Leader', 'Organization Alignment'],
  },
  {
    id: 'head-of-analytics',
    term: 'Head of Analytics',
    partOfSpeech: 'executive role',
    executiveTakeaway: 'The enterprise leader balancing portfolio strategy, cross-functional translation, and technical talent architecture.',
    category: 'Organization',
    definition:
      'The senior functional leader responsible for three indispensable functions: Portfolio Strategy, Translation Vanguard, and Talent Architecture.',
    sourceContext: 'Chapter 8: The Head of Analytics Triad',
    relatedTerms: ['Analytics Leader', 'Embedded Analytics', 'Strategy Execution'],
  },
  {
    id: 'hippo',
    term: 'HIPPO',
    partOfSpeech: 'acronym',
    executiveTakeaway: 'Highest Paid Person’s Opinion—the systemic corporate anti-pattern of defaulting to seniority over verified empirical data.',
    category: 'Leadership',
    definition:
      'Highest Paid Person’s Opinion. The legacy organizational tendency to make decisions based on executive tenure and intuition rather than empirical data testing.',
    sourceContext: 'Chapter 7: Analytics and Leadership',
    relatedTerms: ['Analytics Culture', 'Decision Making'],
  },
  {
    id: 'pullable-levers',
    term: 'Pullable Levers',
    partOfSpeech: 'noun phrase',
    executiveTakeaway: 'Specific operational controls (pricing tiers, channel mix, defect tolerances) that directly alter financial outcomes.',
    category: 'Business',
    definition:
      'Actionable operational mechanisms through which recommendations alter commercial outcomes: Revenue Expansion, Cost Optimization, or Risk Mitigation.',
    sourceContext: 'Chapter 8: Strategic Levers',
    relatedTerms: ['Big Rocks', 'Business Impact', 'KPI'],
  },
  {
    id: 'stakeholder',
    term: 'Stakeholder',
    partOfSpeech: 'noun',
    executiveTakeaway: 'Key operators, budget owners, and executives whose frontline buy-in dictates whether analytical models are adopted.',
    category: 'Leadership',
    definition:
      'Any organizational executive, partner, operator, or agency affected by an analytics model whose buy-in is required for implementation.',
    sourceContext: 'Chapter 10: San Jose Airport (48 Stakeholders)',
    relatedTerms: ['Organization Alignment', 'Analytics Leader'],
  },
  {
    id: 'business-impact',
    term: 'Business Impact',
    partOfSpeech: 'noun phrase',
    executiveTakeaway: 'The bottom-line commercial return that justifies the data science and engineering investment.',
    category: 'Business',
    definition:
      'The tangible commercial value—measured in dollar savings, revenue growth, or cycle-time reduction—derived from adopting an analytical recommendation.',
    sourceContext: 'Chapter 9: The 90-Day Playbook & Quick Wins',
    relatedTerms: ['KPI', 'Big Rocks', 'Quick Win'],
  },
  {
    id: 'quick-win',
    term: 'Quick Win',
    partOfSpeech: 'noun phrase',
    executiveTakeaway: 'A high-impact, 30-day proof of concept delivering early executive credibility and momentum.',
    category: 'Execution',
    definition:
      'A high-visibility, high-feasibility analytical project delivered within 30 to 60 days to earn executive trust before asking for larger infrastructure budget.',
    sourceContext: 'Chapter 9: Days 31–60 of the Leader Playbook',
    relatedTerms: ['90-Day Playbook', 'Business Impact'],
  },
  {
    id: 'prescriptive-analytics',
    term: 'Prescriptive Analytics',
    partOfSpeech: 'noun phrase',
    executiveTakeaway: 'Advanced mathematical optimization identifying not just what will happen, but exactly what decision to execute.',
    category: 'Analytics',
    definition:
      'The highest echelon of data maturity that models scenarios to directly prescribe what optimal decisions and actions an enterprise should take.',
    sourceContext: 'Chapter 7: Data Maturity Framework',
    relatedTerms: ['Data Maturity', 'D2D', 'Business Impact'],
  },
];
