// ─────────────────────────────────────────────────────────────
//  Single source of truth for all portfolio content.
//  Edit this file to update the site — no template changes needed.
// ─────────────────────────────────────────────────────────────

export interface Experience {
  period: string;
  role: string;
  company: string;
  type: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  year: string;
  blurb: string;
  impact: string;
  challenge: string;
  approach: string[];
  outcome: string;
  tags: string[];
  hue: number;
  size: 'xl' | 'wide' | 'tall' | 'sq';
}

export interface SkillGroup {
  id: string;
  label: string;
  icon: string;
  items: string[];
}

export const PROFILE = {
  first: 'Ketro',
  last: 'Sithole',
  title: 'Senior Data Engineer',
  roles: [
    'Senior Data Engineer',
    'Analytics Engineer',
    'Cloud Data Platform Builder',
    'Pipeline Reliability Nerd',
    '7× Hackathon Winner',
  ],
  location: 'Cape Town, South Africa',
  timezone: 'Africa/Johannesburg',
  email: 'Sithole.tk@tuks.co.za',
  // TODO: replace with your exact profile URLs
  links: {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    youtube: 'https://www.youtube.com/',
  },
  statement:
    'I design and run secure, scalable data platforms — pipelines, warehouses and models that turn millions of raw records into decisions people trust.',
  about: [
    'Four years delivering end-to-end data solutions across banking, retail, academia and a UK BPO — FNB, Nedbank, SBV, Superbalist and Takealot among them. I build with Python, SQL, Spark, BigQuery, Dataform, Looker and Azure, and I care as much about governance and reliability as I do about speed.',
    'Five years teaching Data Science, Statistics and Data Warehousing at the University of Pretoria made me ruthless about clarity. I’m now growing toward Principal Engineering — mentoring, setting standards and building engineering cultures that put security and automation first.',
  ],
  stats: [
    { value: 4, suffix: '+', label: 'Years building production data platforms' },
    { value: 7, suffix: '×', label: 'Hackathon wins' },
    { value: 1, suffix: 'M+', label: 'Transactional records in my pipelines' },
    { value: 15, suffix: '', label: 'Top Young Geeks in SA (2023)', prefix: 'Top ' },
  ],
};

export const EXPERIENCE: Experience[] = [
  {
    period: 'Apr 2026 — Now',
    role: 'Data & Analytics Engineer',
    company: 'Superbalist',
    type: 'Full-time · Cape Town',
    summary:
      'Leading large-scale data products for the end-to-end retail and supply-chain ecosystem — from procurement to the customer’s door.',
    highlights: [
      'Designed dashboards and analytical experiences in Looker on top of 1M+ transactional records',
      'Delivered forecasting & customer-behaviour insight for global brands such as Nike and Adidas',
      'Migrated client data from legacy systems to a modern GCP platform (BigQuery, Dataform)',
    ],
    tags: ['Looker', 'BigQuery', 'Dataform', 'GCP', 'Python', 'SQL'],
  },
  {
    period: 'Aug 2025 — Mar 2026',
    role: 'Senior Data Engineer',
    company: 'Sigma Connected Group',
    type: 'Contract · UK Remote',
    summary:
      'Owned credit-data products that let the business track balances, manage risk and power collections journeys.',
    highlights: [
      'Led a legacy Ruby → Golang re-platform, improving performance and maintainability',
      'Replaced SSIS workloads with version-controlled Python pipelines',
      'Built across microservices and REST APIs with Azure DevOps CI/CD',
    ],
    tags: ['Go', 'Ruby', 'Python', 'FastAPI', 'Azure', 'Microservices'],
  },
  {
    period: 'Jan 2024 — Jul 2025',
    role: 'BI Developer & Data Engineer',
    company: 'Expeditus → FNB · Nedbank · SBV',
    type: 'Full-time · On-site consultant',
    summary:
      'Built enterprise data lakes, warehouses and the reporting experiences on top of them for three major SA financial institutions.',
    highlights: [
      'FNB: ran the Power BI platform — workspaces, gateways, RLS — and built API watchers that surface refresh failures',
      'Nedbank: automated liquidity, interest-rate and FTP risk reporting for regulators and audit',
      'Mentored junior engineers and reviewed pipeline & architecture designs',
    ],
    tags: ['Power BI', 'DAX', 'Azure', 'Spark', 'SSIS', 'GraphQL'],
  },
  {
    period: 'Jan 2022 — Dec 2023',
    role: 'Data Science & AI Research Intern',
    company: 'University of Pretoria',
    type: 'Bursary research',
    summary:
      'Applied data science and AI research, communicating findings through visual dashboards and published work.',
    highlights: [
      'Co-authored “Dipolelo” — a benchmarked dataset for South African Sign Language',
      'Built Power BI dashboards for metropolitan financial analytics',
    ],
    tags: ['Python', 'ML', 'Power BI', 'PostgreSQL', 'Research'],
  },
  {
    period: 'Jan 2020 — Dec 2025',
    role: 'Programming Instructor',
    company: 'University of Pretoria',
    type: 'Part-time · Contract',
    summary:
      'Taught undergraduates algorithms, data structures and OOP — bridging theory with real-world engineering practice.',
    highlights: [
      'Ran hands-on labs on clean code, debugging and version control',
      'Mentored students into internships and technical interviews',
    ],
    tags: ['Teaching', 'Python', 'Git', 'Mentorship'],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'retail',
    title: 'Retail Intelligence Cockpit',
    client: 'Superbalist',
    year: '2026',
    blurb:
      'A decision layer over the full inventory lifecycle — procurement, warehousing, sales and fulfilment — designed so merchandisers get answers in seconds, not spreadsheets.',
    impact: '1M+ records · Nike & Adidas insights',
    challenge:
      'Merchandising, supply-chain and commercial teams needed one trusted view of the inventory lifecycle — while client data was still moving off legacy systems.',
    approach: [
      'Migrated client data from legacy systems onto GCP, modelled in BigQuery with Dataform',
      'Designed Looker explores and dashboards around the questions teams actually ask',
      'Built forecasting and customer-behaviour views for global brands such as Nike and Adidas',
    ],
    outcome:
      'Fast, reliable reporting over 1M+ transactional records, powering inventory management, customer analytics and commercial decisions.',
    tags: ['Looker', 'BigQuery', 'Dataform', 'GCP', 'Python'],
    hue: 262,
    size: 'xl',
  },
  {
    id: 'dipolelo',
    title: 'Dipolelo',
    client: 'University of Pretoria · Published',
    year: '2023',
    blurb: 'An automatically collected, prepared and benchmarked dataset for South African Sign Language.',
    impact: 'Published AI research',
    challenge: 'South African Sign Language had too little prepared, benchmarked data to support serious AI research.',
    approach: [
      'Automatically collected and prepared a South African Sign Language dataset',
      'Ran preprocessing, feature engineering, model development and evaluation in Python',
      'Benchmarked models against the new dataset',
    ],
    outcome:
      'Co-authored the published paper “Dipolelo: An automatically collected, prepared, and benchmarked dataset for the South African Sign Language”.',
    tags: ['AI', 'Python', 'Machine Learning'],
    hue: 172,
    size: 'tall',
  },
  {
    id: 'go',
    title: 'Ruby → Go Re-platform',
    client: 'Sigma Connected Group',
    year: '2025',
    blurb: 'Migrated a legacy Ruby system to a modern Go architecture to cut latency and technical debt.',
    impact: 'Faster · leaner · maintainable',
    challenge: 'A legacy Ruby system was slow and hard to maintain, adding technical debt to credit-data workflows.',
    approach: [
      'Led the migration to a modern Golang architecture',
      'Worked across microservices and RESTful APIs',
      'Replaced selected SSIS workloads with version-controlled Python pipelines',
    ],
    outcome:
      'Better performance, maintainability and scalability — and a stack that integrates far more easily with newer technologies.',
    tags: ['Go', 'Microservices', 'REST'],
    hue: 200,
    size: 'sq',
  },
  {
    id: 'watchtower',
    title: 'Pipeline Watchtower',
    client: 'FNB',
    year: '2024',
    blurb: 'API watchers that surface failing refreshes and pipelines before business users ever notice.',
    impact: 'Proactive BI reliability',
    challenge: 'Power BI refresh and pipeline failures were too often discovered by business users first.',
    approach: [
      'Managed Power BI workspaces, datasets, refresh schedules, gateways and row-level security',
      'Built API watchers that monitor pipeline and refresh failures',
      'Optimised ETL pipelines and Power BI data models for self-service analytics',
    ],
    outcome: 'More reliable data and proactive alerting across FNB’s enterprise reporting.',
    tags: ['Power BI', 'Python', 'APIs'],
    hue: 330,
    size: 'sq',
  },
  {
    id: 'risk',
    title: 'Regulatory Risk Suite',
    client: 'Nedbank',
    year: '2024',
    blurb:
      'Automated liquidity, interest-rate and Funds Transfer Pricing reporting — audit-ready, transparent and on time, every day.',
    impact: 'Basel-audit ready',
    challenge: 'Daily interest-rate, liquidity and FTP reports had to be accurate, on time and audit-ready.',
    approach: [
      'Designed and automated resilient pipelines across Azure, Netezza and Power BI',
      'Engineered SQL-driven ETL and ingestion workflows',
      'Worked with finance, risk and governance teams; supported Basel-related audits and disaster recovery',
    ],
    outcome: 'More accurate, timely daily risk and structural-mismatch reporting on transparent, audit-ready data.',
    tags: ['Azure', 'SQL', 'Power BI'],
    hue: 30,
    size: 'wide',
  },
];

export const SKILLS: SkillGroup[] = [
  {
    id: 'de',
    label: 'Data Engineering',
    icon: '⇶',
    items: ['Python', 'SQL', 'Apache Spark', 'Databricks', 'Snowflake', 'dbt', 'Dataform', 'SSIS', 'ETL/ELT', 'Streaming'],
  },
  {
    id: 'model',
    label: 'Modelling & Governance',
    icon: '◈',
    items: ['Data Warehousing', 'Data Lake Architecture', 'Dimensional Modelling', 'Data Quality', 'Data Governance', 'Performance Tuning'],
  },
  {
    id: 'cloud',
    label: 'Cloud & DataOps',
    icon: '⬡',
    items: ['GCP', 'BigQuery', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Azure DevOps'],
  },
  {
    id: 'bi',
    label: 'Analytics & BI',
    icon: '◭',
    items: ['Looker', 'Power BI', 'DAX', 'Google Data Studio', 'KPI Development'],
  },
  {
    id: 'eng',
    label: 'Software Engineering',
    icon: '⌘',
    items: ['Go', 'Ruby on Rails', 'FastAPI', 'REST & GraphQL', 'Microservices', 'Bash', 'PowerShell'],
  },
];

export const ACHIEVEMENTS = [
  {
    big: 'Top 15', label: 'Young Geeks in South Africa', meta: 'Geekulcha · 2023',
    back: 'Recognised by Geekulcha as one of South Africa’s Top 15 Young Geeks in 2023.',
  },
  {
    big: '7×', label: 'Hackathon winner', meta: 'Innovation under pressure',
    back: 'Seven hackathon wins — shipping working products against the clock with brand-new teams.',
  },
  {
    big: '#1', label: 'First in class — coding capstone', meta: 'University of Pretoria',
    back: 'Graduated first in my class for the coding capstone project.',
  },
  {
    big: 'Mentor', label: 'CSIR · NEMISA · MTN', meta: 'Large-scale coding initiatives',
    back: 'Mentor at CSIR, NEMISA and MTN, supporting skills development and large-scale coding initiatives.',
  },
];

export const EDUCATION = [
  { title: 'BSc Honours — Data Science', place: 'In progress', detail: 'Predictive sciences, microservices, big data, time-series forecasting' },
  { title: 'BSc Computer & Information Sciences', place: 'University of Pretoria', detail: 'CS, ML, data warehousing, statistics, information ethics' },
  { title: 'Azure Fundamentals · AZ-900', place: 'Microsoft Certified', detail: 'Passed' },
  { title: 'Azure Data Fundamentals · DP-900', place: 'Microsoft Certified', detail: 'Passed' },
];
