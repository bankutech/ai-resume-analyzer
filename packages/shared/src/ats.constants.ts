export const STRONG_ACTION_VERBS = [
  // Leadership & Direction
  'Spearheaded', 'Directed', 'Orchestrated', 'Championed', 'Mobilized', 'Governed', 'Headed', 'Guided', 'Mentored', 'Fostered',
  // Technical & Architecture
  'Architected', 'Engineered', 'Designed', 'Constructed', 'Formulated', 'Devised', 'Developed', 'Pioneered', 'Authored', 'Modeled',
  // Execution & Delivery
  'Built', 'Shipped', 'Deployed', 'Launched', 'Implemented', 'Created', 'Executed', 'Delivered', 'Published', 'Dispatched',
  // Optimization & Performance
  'Optimized', 'Streamlined', 'Accelerated', 'Consolidated', 'Maximized', 'Refined', 'Scaled', 'Automated', 'Enhanced', 'Tuned',
  // Quantitative Reduction & Cost
  'Reduced', 'Slashing', 'Eliminated', 'Mitigated', 'Trimmed', 'Curtailed', 'Minimized', 'Decreased', 'Alleviated',
  // Data, Analysis & Testing
  'Benchmarked', 'Audited', 'Diagnosed', 'Analyzed', 'Evaluated', 'Synthesized', 'Quantified', 'Surveyed', 'Scraped', 'Indexed',
  // Collaboration & Integration
  'Integrated', 'Interfaced', 'Partnered', 'Coordinated', 'Unified', 'Standardized', 'Bridged', 'Centralized', 'Negotiated',
  // Modern Dev & Cloud
  'Containerized', 'Provisioned', 'Configured', 'Refactored', 'Migrated', 'Instrumented', 'Parallelized', 'Synchronized', 'Decoupled',
  // Additional Action Verbs
  'Acquired', 'Adapted', 'Administered', 'Advised', 'Allocated', 'Appraised', 'Approved', 'Arranged', 'Assembled', 'Assessed',
  'Augmented', 'Authenticated', 'Authored', 'Automated', 'Calculated', 'Cataloged', 'Centralized', 'Certified', 'Clarified', 'Coached',
  'Collaborated', 'Commissioned', 'Communicated', 'Compiled', 'Completed', 'Composed', 'Computed', 'Conceptualized', 'Conducted', 'Consolidated',
  'Constructed', 'Consulted', 'Converted', 'Coordinated', 'Crafted', 'Critiqued', 'Cultivated', 'Customized', 'Debugged', 'Decentralized',
  'Defined', 'Delegated', 'Delivered', 'Demonstrated', 'Designed', 'Detected', 'Determined', 'Developed', 'Devised', 'Diagnosed',
  'Directed', 'Discovered', 'Dispatched', 'Distributed', 'Documented', 'Drafted', 'Engineered', 'Enhanced', 'Enriched', 'Established',
  'Evaluated', 'Examined', 'Executed', 'Expanded', 'Expedited', 'Fabricated', 'Facilitated', 'Filtered', 'Finalized', 'Forecasted',
  'Formulated', 'Founded', 'Fulfilled', 'Generated', 'Governed', 'Guided', 'Handled', 'Harvested', 'Headheaded', 'Identified',
  'Illustrated', 'Implemented', 'Improved', 'Incorporated', 'Increased', 'Indexed', 'Influenced', 'Initiated', 'Innovated', 'Inspected',
  'Installed', 'Instituted', 'Instructed', 'Integrated', 'Interfaced', 'Interpreted', 'Interviewed', 'Introduced', 'Investigated', 'Isolated',
  'Launched', 'Lead', 'Led', 'Maintained', 'Managed', 'Mapped', 'Marketed', 'Mastered', 'Maximized', 'Measured',
  'Mediated', 'Mentored', 'Merged', 'Migrated', 'Minimized', 'Mobilized', 'Modernized', 'Modified', 'Monitored', 'Motivated',
  'Navigated', 'Negotiated', 'Normalized', 'Obtained', 'Operated', 'Optimized', 'Orchestrated', 'Organized', 'Originated', 'Overhauled',
  'Oversaw', 'Packaged', 'Partnered', 'Piloted', 'Pioneered', 'Planned', 'Positioned', 'Predicted', 'Prepared', 'Prescribed',
  'Presented', 'Processed', 'Produced', 'Programmed', 'Projected', 'Promoted', 'Proposed', 'Protected', 'Prototyped', 'Provided',
  'Published', 'Purchased', 'Quantified', 'Rallied', 'Realigned', 'Rebuilt', 'Received', 'Reconciled', 'Recruited', 'Redesigned',
  'Reduced', 'Reengineered', 'Refactored', 'Refined', 'Regulated', 'Reinforced', 'Remodeled', 'Reorganized', 'Replaced', 'Researched',
  'Resolved', 'Restructured', 'Retrieved', 'Revamped', 'Reviewed', 'Revised', 'Revitalized', 'Routed', 'Scaled', 'Scheduled',
  'Screened', 'Scrutinized', 'Secured', 'Selected', 'Separated', 'Sequenced', 'Served', 'Setup', 'Sharpened', 'Shipped',
  'Simplified', 'Simulated', 'Solved', 'Spearheaded', 'Specialized', 'Standardized', 'Stimulated', 'Streamlined', 'Structured', 'Supervised',
  'Supplied', 'Supported', 'Surpassed', 'Synthesized', 'Systematized', 'Targeted', 'Taught', 'Tested', 'Tracked', 'Trained',
  'Transformed', 'Translated', 'Triaged', 'Troubleshot', 'Unified', 'Updated', 'Upgraded', 'Utilized', 'Validated', 'Verified'
];

export const WEAK_PASSIVE_PHRASES = [
  'helped',
  'worked on',
  'worked with',
  'responsible for',
  'assisted in',
  'assisted with',
  'used',
  'tried to',
  'attempted to',
  'was tasked with',
  'participated in',
  'handled',
  'dealt with',
  'duties included',
  'supported team with',
];

export const CANONICAL_SECTION_SYNONYMS: Record<string, string[]> = {
  experience: [
    'experience',
    'work experience',
    'professional experience',
    'employment history',
    'work history',
    'industry experience',
  ],
  education: [
    'education',
    'academic background',
    'academic history',
    'educational qualifications',
    'degrees',
  ],
  skills: [
    'skills',
    'technical skills',
    'technologies',
    'competencies',
    'tools & technologies',
    'core competencies',
  ],
  projects: [
    'projects',
    'academic projects',
    'technical projects',
    'key projects',
    'personal projects',
    'portfolio projects',
  ],
  summary: [
    'summary',
    'professional summary',
    'executive summary',
    'profile',
    'about me',
    'objective',
    'career objective',
  ],
  honors: [
    'honors',
    'honors & leadership',
    'awards',
    'achievements',
    'awards & honors',
    'leadership',
  ],
  certifications: [
    'certifications',
    'licenses & certifications',
    'professional certifications',
    'certificates',
  ],
};

export const ATS_PILLAR_WEIGHTS = {
  contactCompleteness: 12,
  standardSectionHeadings: 12,
  sectionCompleteness: 14,
  actionVerbStrength: 14,
  quantifiableImpact: 16,
  formattingAndSafety: 12,
  consistencyAndRepetition: 10,
  keywordAlignment: 10,
};
