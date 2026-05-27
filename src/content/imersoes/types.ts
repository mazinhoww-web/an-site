// src/content/imersoes/types.ts
// Tipos compartilhados entre as imersões. Não alterar sem PR.

export type ImmersionSlug = "lovable" | "claude";

export type Comparison = {
  before: { head: string; body: string };
  now: { head: string; body: string };
};

export type ProgramBlock = {
  number: string;
  time: string;
  title: string;
  body: string;
  comparison?: Comparison;
  bullets?: string[];
  quote?: string;
  exercise?: string;
};

export type ProgramSession = {
  label: string;
  schedule: string;
  subtitle: string;
  blocks: ProgramBlock[];
};

export type Instructor = {
  name: string;
  role: string;
  photo: string;
  bio: string;
  credentials: string[];
};

export type ResultMetric = {
  label: string;
  value: string;
  description: string;
};

export type PriceTier = {
  label: string;
  price: string;
  note: string;
};

export type Immersion = {
  slug: ImmersionSlug;
  title: string;
  subtitle: string;
  highlightWord: string;
  logo: string;
  descriptor: string;
  whyTitle: string;
  whyBody: string;
  whyAccents: string[];
  results: ResultMetric[];
  instructors: Instructor[];
  program: {
    morning: ProgramSession;
    afternoon: ProgramSession;
    intervalText: string;
  };
  deliverables: string[];
  audience: string[];
  duration: string;
  includes: string;
  prices: PriceTier[];
  priceDisclaimer: string;
  ctaTitle: string;
  ctaHighlight: string;
  ctaBody: string;
  metaTitle: string;
  metaDescription: string;
};
