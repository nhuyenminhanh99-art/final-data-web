import { CaseStudy } from '../types';

export const caseStudiesData: CaseStudy[] = [
  {
    id: 'case-capital-one',
    slug: 'capital-one',
    company: 'Capital One',
    headline: 'How Data-Driven Testing Revolutionized Consumer Credit',
    tags: ['Culture', 'Strategy', 'Testing'],
    challenge:
      'In the late 1980s, credit card issuers relied on homogenous terms and subjective human underwriting, leading to high default rates and underserved credit segments.',
    whatHappened:
      'Co-founders Richard Fairbank and Nigel Morris engineered the Information-Based Strategy (IBS). Every piece of customer interaction was structured as a controlled micro-experiment—testing card limits, teaser interest rates, fee structures, and rewards.',
    result:
      'Capital One skyrocketed from a small regional bank spin-off into one of the top credit card issuers globally, maintaining industry-leading loss ratios through economic recessions.',
    lesson:
      'Analytics is not an IT cost center; it can be the entire engine of corporate strategy and competitive differentiation.',
    relatedChapterSlug: 'analytics-leadership',
  },
  {
    id: 'case-netflix',
    slug: 'netflix',
    company: 'Netflix',
    headline: 'From Recommendation Engines to $100M Content Bets',
    tags: ['Culture', 'Predictive', 'Strategy'],
    challenge:
      'Transitioning from DVD-by-mail to streaming required investing hundreds of millions of dollars into original productions with no guarantee of viewer retention.',
    whatHappened:
      'Rather than relying on network executive intuition, Netflix synthesized granular subscriber telemetry—completion rates, pauses, rewind behavior, and director affinities—to predict the success of greenlighting "House of Cards".',
    result:
      'The multi-season investment was justified before production commenced, dramatically lowering portfolio risk and catalyzing a subscriber explosion.',
    lesson:
      'Data-driven leaders combine operational telemetry with creative audacity to make bold, calculated investments.',
    relatedChapterSlug: 'competing-on-analytics',
  },
  {
    id: 'case-google',
    slug: 'google',
    company: 'Google',
    headline: 'Project Oxygen: Using Analytics to Fix Human Management',
    tags: ['Talent', 'Culture', 'People Analytics'],
    challenge:
      'Early Google culture was skeptical of people managers, believing elite engineers did not need managerial oversight.',
    whatHappened:
      'Google’s People Analytics team gathered over 10,000 observations of manager evaluations, performance reviews, and employee sentiment surveys, applying regression to identify the core behaviors of top-performing leads.',
    result:
      'Disproved the anti-manager bias, uncovering that clear vision, coaching, and empowering the team without micro-managing directly correlated with retention and productivity.',
    lesson:
      'Even human empathy and leadership effectiveness can be empirically measured, coached, and improved.',
    relatedChapterSlug: 'analytics-leadership',
  },
  {
    id: 'case-booking',
    slug: 'booking-com',
    company: 'Booking.com',
    headline: 'Radical Decentralized Experimentation at Global Scale',
    tags: ['Testing', 'Culture', 'Infrastructure'],
    challenge:
      'Maintaining double-digit conversion gains across thousands of disparate international travel markets and currencies.',
    whatHappened:
      'Booking.com democratized testing: any developer, designer, or product manager has the authority to launch an A/B test directly to production without executive committee approval, backed by automated guardrails.',
    result:
      'Over 25,000 concurrent experiments run annually, creating compound microscopic improvements that yield the highest conversion velocity in the travel sector.',
    lesson:
      'A true analytics culture eliminates executive bottlenecks by entrusting front-line teams with robust experimentation tools.',
    relatedChapterSlug: 'competing-on-analytics',
  },
  {
    id: 'case-uber',
    slug: 'uber',
    company: 'Uber',
    headline: 'Real-Time Dynamic Pricing & Algorithmic Equilibrium',
    tags: ['Infrastructure', 'Predictive', 'Execution'],
    challenge:
      'Severe driver shortages during rainstorms and peak transit hours caused system-wide ride unreliability and customer attrition.',
    whatHappened:
      'Uber introduced spatial predictive algorithms and dynamic surge pricing. By analyzing real-time driver density against incoming ride requests, the algorithm incentivized drivers to relocate toward high-demand zones while rationing rides.',
    result:
      'Achieved over 98% ride completion reliability even during severe demand surges, solving the two-sided marketplace cold-start dilemma.',
    lesson:
      'Prescriptive analytics creates value by responding to real-world fluctuations at speeds no manual human committee could match.',
    relatedChapterSlug: 'analytics-leaders-playbook',
  },
  {
    id: 'case-san-jose-airport',
    slug: 'san-jose-airport',
    company: 'San Jose International Airport',
    headline: 'Resolving a $4.5B Stalemate with 48 Stakeholders',
    tags: ['Prioritization', 'Strategy', 'Alignment'],
    challenge:
      'A proposed $4.5B airport modernization plan was deadlocked due to conflicting demands from city council, airline carriers, TSA, and local commercial tenants.',
    whatHappened:
      'The analytics team modeled passenger foot traffic, gate turnaround metrics, and baggage system capacity. They brought all 48 stakeholders into the simulation lab, letting each party adjust operating assumptions interactively.',
    result:
      'Identified that modernizing gate scheduling and terminal re-sequencing delivered 100% of required throughput for $1.5B—saving $3.0B and achieving unanimous airline sign-off.',
    lesson:
      'When you invite stakeholders to co-design the model assumptions, their resistance dissolves into collaborative ownership.',
    relatedChapterSlug: 'making-it-happen',
  },
];
