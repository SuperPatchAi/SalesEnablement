// Market Types
export type MarketId = "d2c" | "b2b" | "canadian";

export interface Market {
  id: MarketId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  productCount: number;
}

// Product Types
export type ProductCategory =
  | "pain"
  | "sleep"
  | "energy"
  | "balance"
  | "focus"
  | "mood"
  | "immunity"
  | "metabolism"
  | "habits"
  | "stress"
  | "beauty"
  | "mens"
  | "performance";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  emoji: string;
  color: string;
  hasClinicalStudy: boolean;
  studyName?: string;
  markets: MarketId[];
}

// Clinical Evidence Types
export interface StudyResult {
  metric: string;
  result: string;
  improvement?: string;
  before?: string;
  after?: string;
}

export interface ClinicalStudy {
  id: string;
  name: string;
  productId: string;
  journal: string;
  year: number;
  type: string;
  registration?: string;
  participants: number;
  duration: string;
  results: StudyResult[];
  conclusion: string;
  talkingPoints: string[];
}

// Word Track Types
export interface Script {
  id: string;
  title: string;
  scenario?: string;
  content: string;
}

export interface Objection {
  id: string;
  objection: string;
  response: string;
  psychology: string;
}

export interface DiscoveryQuestion {
  id: string;
  question: string;
  category: "opening" | "pain" | "impact" | "solution";
}

export interface FollowUpSequence {
  day: string;
  title: string;
  voicemail?: string;
  email?: string;
  text?: string;
}

export interface QuickReference {
  keyBenefits: string[];
  bestQuestions: string[];
  topObjections: { objection: string; shortResponse: string }[];
  bestClosingLines: string[];
  keyStats?: string[];
}

// Favorites Types
export interface Favorite {
  id: string;
  type: "script" | "objection" | "question" | "product";
  productId: string;
  market: MarketId;
  title: string;
  content: string;
  addedAt: string;
}

// Word Track Section Types
export interface WordTrackSection {
  id: string;
  title: string;
  content: string;
  copyable: boolean;
}

export interface WordTrack {
  id: string;
  productId?: string;
  practitionerId?: string;
  market: MarketId;
  title: string;
  subtitle: string;
  overview: string;
  idealCustomer?: string;
  idealPractitioner?: string;
  openingScripts: Script[];
  discoveryQuestions: DiscoveryQuestion[];
  productPresentation: string;
  objections: Objection[];
  closingScripts: Script[];
  followUpSequences: FollowUpSequence[];
  testimonialPrompts?: string[];
  quickReference: QuickReference;
}

// Practitioner Types (B2B)
export type PractitionerId =
  | "chiropractors"
  | "naturopaths"
  | "acupuncturists"
  | "massage-therapists"
  | "functional-medicine"
  | "integrative-medicine";

export interface Practitioner {
  id: PractitionerId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  philosophy: string;
  whyIdeal: string[];
  painPoints: string[];
  patientDemographics: string[];
}

// Navigation Types
export interface NavItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  badge?: string;
  items?: NavItem[];
}

