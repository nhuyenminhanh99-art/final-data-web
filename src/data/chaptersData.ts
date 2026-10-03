import { Chapter } from '../types';

export const chaptersData: Chapter[] = [
  {
    slug: 'analytics-leadership',
    number: 7,
    title: 'Analytics and Leadership',
    kicker: 'CHAPTER 07 · PEACH VILLAGE',
    tagline: 'Where the river remembers spring: vision, culture, and foundations.',
    regionPreset: 'peach_village',
    regionName: 'Peach Village',
    stopPosition: 0.12,
    summary:
      'Analytics leadership is not about mastering mathematical models; it is about building the culture, literacy, and decision-making framework where data informs every significant strategic bet.',
    seo: {
      title: 'Chapter 7: Analytics and Leadership | The River of Insights',
      description:
        'Explore the 4 Foundations of Analytics Maturity and how leaders create lasting competitive advantage using data-driven decision frameworks.',
    },
    blocks: [
      {
        id: 'c7-hero',
        type: 'hero',
        kicker: 'CHAPTER 07',
        title: 'Analytics and Leadership',
        subtitle:
          'Data alone creates no value. Value is unlocked only when leadership aligns strategic intent with analytical discipline.',
      },
      {
        id: 'c7-intro',
        type: 'richText',
        html:
          '<p class="text-lg leading-relaxed text-[#EDE7D8]/90">In <em>Behind Every Good Decision</em>, authors Piyanka Jain and Puneet Sharma demonstrate that the bottleneck in modern analytics is almost never the algorithms—it is the leadership. True analytics leaders serve as the bridge between raw mathematical possibilities and commercial realities, turning passive reporting into proactive enterprise strategy.</p>',
      },
      {
        id: 'c7-story-capital-one',
        type: 'storyCard',
        who: 'Richard Fairbank & Nigel Morris (Capital One Founders)',
        whatChanged:
          'Replaced gut-feel credit approval with high-velocity data testing, conducting thousands of micro-experiments on interest rates, credit limits, and customer risk segments.',
        result:
          'Transformed a tiny spin-off into one of the top financial institutions in the world with superior portfolio risk management.',
        whyItWorked:
          'They did not treat analytics as an IT back-office utility. They treated scientific experimentation as the foundational business model.',
        lesson:
          'When leadership makes analytics the core operating rhythm, market disruption follows naturally.',
        badgeLabel: 'Foundational Landmark',
      },
      {
        id: 'c7-def-leader',
        type: 'definitionBox',
        title: 'The Data-Driven Leader Defined',
        bullets: [
          'Frames business dilemmas into solvable analytical hypotheses before touching tools.',
          'Demands probabilistic thinking rather than false certainty from executive teams.',
          'Invests equally in data literacy and change management as in data infrastructure.',
          'Celebrates valid experiments that disprove assumptions as vigorously as quick wins.',
        ],
      },
      {
        id: 'c7-foundations-tabs',
        type: 'tabs',
        tabs: [
          {
            id: 'tab-leadership',
            label: '1. Leadership & Vision',
            blocks: [
              {
                id: 'c7-t1-text',
                type: 'richText',
                html:
                  '<p class="leading-relaxed">Without explicit executive sponsorship, analytical initiatives languish in silos. Leaders must establish the "North Star" metrics that dictate which decisions warrant rigorous analytical modeling and which require swift tactical execution.</p>',
              },
              {
                id: 'c7-t1-quote',
                type: 'quote',
                text: 'A leader’s role is not to have all the answers, but to ask the analytical questions that illuminate blind spots.',
                attribution: 'Piyanka Jain & Puneet Sharma',
              },
            ],
          },
          {
            id: 'tab-talent',
            label: '2. Analytics Talent',
            blocks: [
              {
                id: 'c7-t2-text',
                type: 'richText',
                html:
                  '<p class="leading-relaxed">Building an analytics team requires a triad: <strong>Business Translators</strong> who understand corporate stakes, <strong>Data Scientists</strong> who craft robust quantitative models, and <strong>Data Engineers</strong> who ensure reliable data pipelines. Relying on a lone "unicorn" always fails at scale.</p>',
              },
            ],
          },
          {
            id: 'tab-decision',
            label: '3. Decision Making Culture',
            blocks: [
              {
                id: 'c7-t3-text',
                type: 'richText',
                html:
                  '<p class="leading-relaxed">Organizations must transition from "HIPPO" (Highest Paid Person\'s Opinion) decision-making to hypothesis-driven debate. When data contradicts executive intuition, the culture must reward the data, not punish the messenger.</p>',
              },
            ],
          },
          {
            id: 'tab-maturity',
            label: '4. Data Maturity & Tools',
            blocks: [
              {
                id: 'c7-t4-text',
                type: 'richText',
                html:
                  '<p class="leading-relaxed">Data maturity progresses through 4 stages: Descriptive (What happened?), Diagnostic (Why did it happen?), Predictive (What will happen?), and Prescriptive (What should we do?). Mature organizations focus 70% of effort on Prescriptive action rather than rear-view reporting.</p>',
              },
            ],
          },
        ],
      },
      {
        id: 'c7-comparison-table',
        type: 'comparisonTable',
        caption: 'Traditional Organization vs. Analytics-Led Organization',
        columns: ['Dimension', 'Traditional Organization', 'Analytics-Led Organization'],
        rows: [
          ['Decision Driver', 'Intuition, tenure, and executive consensus', 'Rigorous data hypotheses and measured trials'],
          ['Analytics Role', 'Back-office report generator (cost center)', 'Strategic co-pilot embedded in executive decisions'],
          ['Failure View', 'Punished or concealed', 'Valued as structured learning that narrows uncertainty'],
          ['Tooling Focus', 'Purchasing expensive software licenses', 'Building repeatable pipelines and cross-functional literacy'],
        ],
      },
      {
        id: 'c7-checklist',
        type: 'checklist',
        title: 'Chapter 7 in 5 Lines',
        items: [
          'Analytics leadership starts with culture and clarity, never with algorithms.',
          'Case in point: Capital One achieved hyper-growth through relentless testing culture.',
          'Four pillars define capability: Leadership, Talent, Decision Culture, and Data Maturity.',
          'Eliminate HIPPO bias by framing decisions around verifiable business hypotheses.',
          'Prescriptive action is the ultimate destination—descriptive reporting is merely table stakes.',
        ],
      },
    ],
  },
  {
    slug: 'competing-on-analytics',
    number: 8,
    title: 'Competing on Analytics',
    kicker: 'CHAPTER 08 · BAMBOO FOREST',
    tagline: 'Navigating the dense canopy: choosing what to do and who does it.',
    regionPreset: 'bamboo_forest',
    regionName: 'Bamboo Forest',
    stopPosition: 0.3,
    summary:
      'Winning companies focus their scarce analytical talent on the "Big Rocks"—the high-stakes levers that move the profit needle—while establishing the right organizational structure to sustain momentum.',
    seo: {
      title: 'Chapter 8: Competing on Analytics | The River of Insights',
      description:
        'Strategic allocation of analytical resources: Big Rocks vs Pebbles, organizational models, and the 3 core functions of the Head of Analytics.',
    },
    blocks: [
      {
        id: 'c8-hero',
        type: 'hero',
        kicker: 'CHAPTER 08',
        title: 'Competing on Analytics',
        subtitle:
          'The greatest threat to analytics ROI is not failure of math—it is spreading talent so thin across low-value ad-hoc requests that needle-moving opportunities remain untouched.',
      },
      {
        id: 'c8-two-column-focus',
        type: 'twoColumn',
        left: {
          title: 'WHAT to Do: Strategic Levers',
          blocks: [
            {
              id: 'c8-col1-text',
              type: 'richText',
              html:
                '<p>Leaders must categorize business opportunities into three core levers:</p><ul class="list-disc pl-5 mt-2 space-y-1"><li><strong>Revenue Expansion:</strong> Customer lifetime value, cross-sell algorithms, dynamic pricing.</li><li><strong>Cost Optimization:</strong> Supply chain bottlenecks, defect minimization, churn prevention.</li><li><strong>Risk Mitigation:</strong> Portfolio default scoring, regulatory exposure.</li></ul>',
            },
          ],
        },
        right: {
          title: 'WHO Does It: Organizational Design',
          blocks: [
            {
              id: 'c8-col2-text',
              type: 'richText',
              html:
                '<p>How should analytical minds sit within the company?</p><ul class="list-disc pl-5 mt-2 space-y-1"><li><strong>Centralized (CoE):</strong> Great for standardizing tools, weak on business intimacy.</li><li><strong>Decentralized:</strong> High business empathy, rampant duplication and inconsistent metrics.</li><li><strong>Hybrid (Hub & Spoke):</strong> The gold standard—central governance with analysts embedded in business units.</li></ul>',
            },
          ],
        },
      },
      {
        id: 'c8-numbered-questions',
        type: 'numberedCards',
        cards: [
          {
            number: '01',
            title: 'Where is the Value Leak?',
            text:
              'Before initiating any machine learning project, quantify the dollar impact of the existing gap. If closing the gap yields under $1M, it belongs in self-service BI, not dedicated data science.',
          },
          {
            number: '02',
            title: 'Can the Organization Act?',
            text:
              'Analytics without operational agency is vanity. If business partners lack the budget, political will, or technical systems to execute recommendations, do not commence analysis.',
          },
          {
            number: '03',
            title: 'What is the Feedback Loop?',
            text:
              'How quickly will you know if the predictive model was right? Continuous measurement loops separate resilient analytics engines from one-off academic reports.',
          },
        ],
      },
      {
        id: 'c8-big-rocks',
        type: 'callout',
        tone: 'info',
        title: 'The "Big Rocks" Prioritization Rule',
        text:
          'If you fill a jar with sand and pebbles first, the large rocks will not fit. Similarly, if your analytics team is consumed by endless ad-hoc spreadsheet requests ("pebbles"), they will never have the uninterrupted cognitive bandwidth to solve the multi-million dollar structural inefficiencies ("Big Rocks").',
      },
      {
        id: 'c8-head-of-analytics',
        type: 'definitionBox',
        title: 'The Head of Analytics: 3 Indispensable Functions',
        bullets: [
          'Portfolio Strategist: Ruthlessly audits incoming projects and matches scarce human capital against enterprise strategic goals.',
          'Translation Vanguard: Converts complex statistical distributions and confidence intervals into compelling executive business cases.',
          'Talent Architecture: Cultivates career tracks for technical specialists to grow without forcing them into bureaucratic people-management.',
        ],
      },
      {
        id: 'c8-checklist',
        type: 'checklist',
        title: 'Chapter 8 in 5 Lines',
        items: [
          'Strategy means choosing what NOT to do: protect analysts from low-value ad-hoc requests.',
          'Prioritize Big Rocks (Revenue, Cost, Risk) over incidental operational queries.',
          'Adopt the Hybrid Hub-and-Spoke model for peak organizational balance.',
          'Never start an analytics project if the business unit lacks operational leverage to act.',
          'The Head of Analytics must be an executive business strategist first and a technologist second.',
        ],
      },
    ],
  },
  {
    slug: 'analytics-leaders-playbook',
    number: 9,
    title: "The Analytics Leader's 90-Day Playbook",
    kicker: 'CHAPTER 09 · MOUNTAIN VALLEY',
    tagline: 'The timed climb: 30 days to assess, 60 days to execute and scale.',
    regionPreset: 'mountain_valley',
    regionName: 'Mountain Valley',
    stopPosition: 0.48,
    summary:
      'A structured, battle-tested roadmap for any incoming analytics leader to establish credibility, secure executive trust, deliver immediate value, and lay the foundation for long-term scalability.',
    seo: {
      title: "Chapter 9: The Analytics Leader's 90-Day Playbook | The River of Insights",
      description:
        'Step-by-step 90-day execution framework: Days 1-30 Listen & Assess, Days 31-60 Align & Quick Wins, Days 61-90 Scale & Long-term governance.',
    },
    blocks: [
      {
        id: 'c9-hero',
        type: 'hero',
        kicker: 'CHAPTER 09',
        title: "The Analytics Leader's 90-Day Playbook",
        subtitle:
          'New leaders rarely fail because of inadequate technical acumen. They fail because they build complex systems in isolation before building stakeholder trust.',
      },
      {
        id: 'c9-timeline',
        type: 'timeline',
        phases: [
          {
            period: 'Days 01 – 30',
            label: 'Phase 1: Listen, Audit & Diagnose',
            text:
              'Conduct stakeholder discovery interviews across all executive lines. Catalog existing reports and pipelines. Audit data veracity and identify the single source of truth.',
            milestone: 'Deliverable: Stakeholder Pain-Point Heatmap & Data Quality Assessment',
          },
          {
            period: 'Days 31 – 60',
            label: 'Phase 2: The "Quick Win" & Operating Model',
            text:
              'Select one high-visibility, high-feasibility analytical project that can be solved in 3 weeks. Deliver measurable business value. Establish bi-weekly review cadences with business sponsors.',
            milestone: 'Deliverable: First Validated Quick-Win ROI Presentation & Prioritization Charter',
          },
          {
            period: 'Days 61 – 90',
            label: 'Phase 3: Formalize Governance & Scale',
            text:
              'Standardize project intake forms. Implement data stewardship guidelines. Align team hiring goals with 12-month business milestones. Present the 1-Year Strategic Roadmap.',
            milestone: 'Deliverable: 1-Year Analytics Roadmap endorsed by C-Suite',
          },
          {
            period: 'Beyond Day 90',
            label: 'Phase 4: Cultural Transformation',
            text:
              'Expand analytics literacy programs across line managers. Transition from reactive ad-hoc reporting to predictive and automated decision engines.',
            milestone: 'Milestone: Self-service analytics adoption across 80% of business units',
          },
        ],
      },
      {
        id: 'c9-flow',
        type: 'flow',
        steps: [
          {
            step: 1,
            label: 'Assess Environment',
            text: 'Map stakeholders, identify data debt, inventory current analytic skillsets.',
          },
          {
            step: 2,
            label: 'Select Quick Win',
            text: 'Choose a problem with high visibility, low complexity, and an eager business sponsor.',
          },
          {
            step: 3,
            label: 'Execute & Measure',
            text: 'Ship the solution with rigorous pre-and-post metric tracking to prove commercial impact.',
          },
          {
            step: 4,
            label: 'Institutionalize',
            text: 'Lock in standard operating procedures, documentation, and executive cadence.',
          },
        ],
      },
      {
        id: 'c9-checklist',
        type: 'checklist',
        title: 'Chapter 9 in 5 Lines',
        items: [
          'Spend the first 30 days listening and diagnosing—resist the urge to overhaul tools on day one.',
          'Secure early credibility by executing a targeted "Quick Win" within the first 60 days.',
          'Never deliver analytics without a pre-agreed metric to measure commercial return.',
          'Establish a formal project intake workflow to safeguard team bandwidth.',
          'Present a C-suite-aligned 1-year roadmap before the 90th day closes.',
        ],
      },
    ],
  },
  {
    slug: 'making-it-happen',
    number: 10,
    title: 'Making It Happen',
    kicker: 'CHAPTER 10 · LANTERN BRIDGE',
    tagline: 'Bridging the divide: aligning 48 stakeholders and driving real execution.',
    regionPreset: 'lantern_bridge',
    regionName: 'Lantern Bridge',
    stopPosition: 0.66,
    summary:
      'The definitive playbook on stakeholder alignment, navigating organizational politics, and turning complex quantitative insights into consensual executive decisions.',
    seo: {
      title: 'Chapter 10: Making It Happen | The River of Insights',
      description:
        'Master stakeholder alignment: How San Jose Airport reduced a $4.5B plan to $1.5B across 48 stakeholders through structured analytics.',
    },
    blocks: [
      {
        id: 'c10-hero',
        type: 'hero',
        kicker: 'CHAPTER 10',
        title: 'Making It Happen',
        subtitle:
          'Analysis does not drive decisions. People drive decisions. Analytics is merely the flashlight that shows them where to step.',
      },
      {
        id: 'c10-bignumber',
        type: 'bigNumber',
        value: '$4.5B → $1.5B',
        caption: 'San Jose International Airport Capital Cost Reduction',
        context:
          'Achieved 67% capital expenditure reduction while preserving 100% of required passenger throughput and safety capacity.',
      },
      {
        id: 'c10-story-airport',
        type: 'storyCard',
        who: 'City of San Jose Airport Leadership & Analytics Team',
        whatChanged:
          'Faced with an exorbitant $4.5B master expansion plan opposed by airlines and city council, the analytics team created dynamic passenger flow and gate utilization models.',
        result:
          'Showed that re-sequencing gates and modernizing existing terminal footprints delivered the target capacity for $1.5B, saving taxpayers and airlines $3.0B.',
        whyItWorked:
          'The team systematically engaged 48 individual stakeholders (airline executives, TSA, city planners, pilots, concessionaires) in the model validation process.',
        lesson:
          'When stakeholders co-own the assumptions inside the model, they fight for the conclusions rather than against them.',
        badgeLabel: 'Masterclass in Alignment',
      },
      {
        id: 'c10-influencing-flow',
        type: 'flow',
        steps: [
          {
            step: 1,
            label: 'Empathize with Constraints',
            text: 'Discover each stakeholder’s personal and business incentives before proposing solutions.',
          },
          {
            step: 2,
            label: 'Frame in Business Currency',
            text: 'Translate mathematical findings into dollars, cycle time, or customer satisfaction.',
          },
          {
            step: 3,
            label: 'Co-Design Hypotheses',
            text: 'Involve detractors early in selecting the variables and boundary conditions.',
          },
          {
            step: 4,
            label: 'Transparent Assumptions',
            text: 'Demystify the black box—give stakeholders the levers to run their own sensitivity analyses.',
          },
          {
            step: 5,
            label: 'Shared Public Victory',
            text: 'Attribute the strategic breakthrough to the collaborative decision of the committee.',
          },
        ],
      },
      {
        id: 'c10-pitfall-callout',
        type: 'callout',
        tone: 'peach',
        title: 'The Danger of the "Big Reveal"',
        text:
          'Never surprise stakeholders in a final presentation. If a key leader sees your controversial conclusion for the first time in an open executive committee meeting, their instinct will be defensive rejection. Vet conclusions in 1-on-1 preview sessions beforehand.',
      },
      {
        id: 'c10-checklist',
        type: 'checklist',
        title: 'Chapter 10 in 5 Lines',
        items: [
          'Stakeholder alignment is 80% of the battle; analytical computation is 20%.',
          'San Jose Airport proved that transparent simulation models can resolve multi-billion dollar political deadlocks.',
          'Bring detractors into the hypothesis formulation phase to eliminate later resistance.',
          'Never conduct a "Big Reveal"—preview sensitive insights privately with affected leaders.',
          'Frame results exclusively in the commercial currency of your target audience.',
        ],
      },
    ],
  },
  {
    slug: 'common-pitfalls',
    number: 11,
    title: 'Common Pitfalls',
    kicker: 'CHAPTER 11 · FORGOTTEN GARDEN',
    tagline: 'Among the ancient ruins: 36 traps across four organizational roles.',
    regionPreset: 'forgotten_garden',
    regionName: 'Forgotten Garden',
    stopPosition: 0.84,
    summary:
      'A candid, cautionary exploration of the recurring pitfalls that derail analytics initiatives across Executives, Analytics Managers, Business Partners, and Data Analysts.',
    seo: {
      title: 'Chapter 11: Common Pitfalls | The River of Insights',
      description:
        'A comprehensive audit of 36 analytics failure modes across 4 key roles: Executive Sponsor, Analytics Manager, Business Partner, and Analyst.',
    },
    blocks: [
      {
        id: 'c11-hero',
        type: 'hero',
        kicker: 'CHAPTER 11',
        title: 'Common Pitfalls',
        subtitle:
          'Those who cannot remember the ruins of past analytics projects are condemned to repeat them. Wisdom consists of recognizing the traps before you step into them.',
      },
      {
        id: 'c11-story-jay',
        type: 'storyCard',
        who: "Jay's Enterprise Forecasting Project",
        whatChanged:
          'Jay spent 9 months engineering an exquisite, high-dimensional neural network forecast with 98% in-sample accuracy.',
        result:
          'The project was permanently shelved within 2 weeks of rollout because regional sales directors could not understand or adjust the inputs.',
        whyItWorked:
          'It did not work—it became an expensive monument to academic perfection disconnected from human operational needs.',
        lesson:
          'An imperfect model that is understood and trusted by business operators will outperform a mathematically perfect model that sits unused in a repository.',
        badgeLabel: 'Cautionary Tale',
      },
      {
        id: 'c11-role-tabs',
        type: 'tabs',
        tabs: [
          {
            id: 'role-exec',
            label: 'Executive Sponsor (10 Pitfalls)',
            blocks: [
              {
                id: 'c11-exec-accordion',
                type: 'accordion',
                items: [
                  {
                    id: 'p-exec-1',
                    title: '1. Shiny Object Syndrome (Chasing Buzzwords)',
                    body:
                      'Mandating generative AI, deep learning, or graph databases when the core problem only requires standard linear regression and data hygiene.',
                    badge: 'Executive',
                  },
                  {
                    id: 'p-exec-2',
                    title: '2. Expecting Overnight Miracles',
                    body:
                      'Expecting an analytics department to fix deep-seated operational product flaws within 60 days of formation.',
                    badge: 'Executive',
                  },
                  {
                    id: 'p-exec-3',
                    title: '3. Starving Data Infrastructure',
                    body:
                      'Willingness to hire $250k data scientists while refusing to invest in robust data pipelines, resulting in top talent spending 80% of time cleaning CSVs.',
                    badge: 'Executive',
                  },
                  {
                    id: 'p-exec-4',
                    title: '4. The HIPPO Override',
                    body:
                      'Commissioning a six-figure analytical study, only to discard the statistical findings the moment they contradict personal executive intuition.',
                    badge: 'Executive',
                  },
                ],
              },
            ],
          },
          {
            id: 'role-manager',
            label: 'Analytics Manager (9 Pitfalls)',
            blocks: [
              {
                id: 'c11-mgr-accordion',
                type: 'accordion',
                items: [
                  {
                    id: 'p-mgr-1',
                    title: '1. Solving for Mathematical Sophistication Over ROI',
                    body:
                      'Prioritizing algorithmic novelty to write conference papers over solving straightforward business bottlenecks.',
                    badge: 'Manager',
                  },
                  {
                    id: 'p-mgr-2',
                    title: '2. Accepting Ill-Defined Problems',
                    body:
                      'Allowing business partners to say "Give me all the data on churn" without forcing them to define the actionable decision and boundary parameters.',
                    badge: 'Manager',
                  },
                  {
                    id: 'p-mgr-3',
                    title: '3. Neglecting Change Management',
                    body:
                      'Delivering a completed dashboard or model over email without training the front-line workers who must integrate it into daily workflow.',
                    badge: 'Manager',
                  },
                ],
              },
            ],
          },
          {
            id: 'role-business',
            label: 'Business Partner (9 Pitfalls)',
            blocks: [
              {
                id: 'c11-biz-accordion',
                type: 'accordion',
                items: [
                  {
                    id: 'p-biz-1',
                    title: '1. Weaponizing Analytics (Confirmation Bias)',
                    body:
                      'Approaching analysts not with an open question, but with an instruction to "find numbers that support my pet project".',
                    badge: 'Business Partner',
                  },
                  {
                    id: 'p-biz-2',
                    title: '2. Data Hoarding & Tribal Knowledge',
                    body:
                      'Withholding critical business nuances or proprietary spreadsheets out of fear that transparent corporate data diminishes political leverage.',
                    badge: 'Business Partner',
                  },
                  {
                    id: 'p-biz-3',
                    title: '3. Paralysis by Analysis',
                    body:
                      'Refusing to make any operational decision until the confidence interval reaches 99.999%, while competitors move swiftly at 80% certainty.',
                    badge: 'Business Partner',
                  },
                ],
              },
            ],
          },
          {
            id: 'role-analyst',
            label: 'Data Analyst (8 Pitfalls)',
            blocks: [
              {
                id: 'c11-ana-accordion',
                type: 'accordion',
                items: [
                  {
                    id: 'p-ana-1',
                    title: '1. The "Data Dump" Presentation',
                    body:
                      'Presenting 60 slides of correlation matrices and p-values instead of 3 clear executive recommendations with expected financial upside.',
                    badge: 'Analyst',
                  },
                  {
                    id: 'p-ana-2',
                    title: '2. Ignoring Context & Data Provenance',
                    body:
                      'Building models on corrupted production logs without speaking to domain operators to understand why certain fields are null.',
                    badge: 'Analyst',
                  },
                  {
                    id: 'p-ana-3',
                    title: '3. Inability to Quantify Uncertainty',
                    body:
                      'Reporting point estimates like "$4,231,900" without confidence bands, creating false precision that leads to catastrophic downstream budgeting.',
                    badge: 'Analyst',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'c11-recap-table',
        type: 'comparisonTable',
        caption: 'Root Cause & Antidote Matrix',
        columns: ['Failure Mode', 'Root Cause', 'The Proven Antidote'],
        rows: [
          ['The Ignored Dashboard', 'Built without user-centric design', 'Embed analysts in the physical room with front-line users for 2 weeks'],
          ['The Shelved Model', 'Too complex for operators to trust', 'Default to simple interpretable models (decision trees, regression) before deep learning'],
          ['The Executive Revolt', 'Big reveal without prior vetting', 'Weekly pre-briefings with affected business leads to socialize emergent conclusions'],
          ['The Endless Backlog', 'Lack of strategic prioritization intake', 'Implement the "Big Rocks" charter: reject ad-hoc requests under $500k value threshold'],
        ],
      },
      {
        id: 'c11-checklist',
        type: 'checklist',
        title: 'Chapter 11 in 5 Lines',
        items: [
          'Jay’s project proves that technical brilliance cannot salvage an unaligned solution.',
          'Pitfalls cluster across 4 distinct roles: Sponsors, Managers, Partners, and Analysts.',
          'Simplicity beats complexity: an 80% accurate model in daily use outperforms a 99% model left on a shelf.',
          'Never weaponize data to validate pre-ordained political conclusions.',
          'Institute transparent intake charters to protect analysts from the quicksand of ad-hoc queries.',
        ],
      },
    ],
  },
];
