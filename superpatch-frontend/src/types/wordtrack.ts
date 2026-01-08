// Word Track Types - Comprehensive structure for sales enablement content

export type MarketType = "d2c" | "b2b" | "canadian";
export type PractitionerType = 
  | "chiropractor" 
  | "naturopath" 
  | "acupuncturist" 
  | "massage_therapist" 
  | "functional_medicine" 
  | "integrative_medicine"
  | "homeopath"
  | "general";

// Opening Script
export interface OpeningScript {
  id?: string;
  title: string;
  scenario?: string;
  script?: string;
  content?: string; // Alternative to script
}

// Discovery Question
export interface DiscoveryQuestion {
  id?: string;
  category?: "opening" | "pain_point" | "impact" | "solution" | "decision" | "future" | "practice" | "patient" | "current" | "pain";
  question: string;
}

// Objection and Response
export interface ObjectionResponse {
  id?: string;
  objection: string;
  response: string;
  psychology?: string;
}

// Closing Script
export interface ClosingScript {
  id?: string;
  title: string;
  type?: "assumptive" | "alternative" | "urgency" | "summary" | "trial" | "referral" | "business_model" | "solution";
  scenario?: string;
  script?: string;
  content?: string; // Alternative to script
}

// Follow-up Sequence
export interface FollowUpItem {
  day: string;
  title: string;
  voicemail?: string;
  email?: string;
  text?: string;
  phone?: string;
}

// Testimonial Prompt
export interface TestimonialPrompt {
  id: string;
  question: string;
}

// Quick Reference Card
export interface QuickReference {
  keyBenefits: string[];
  bestQuestions: string[];
  topObjections: { objection: string; response?: string; shortResponse?: string }[];
  bestClosingLines: string[];
  keyStats?: string[];
}

// Product Presentation (P-A-S-E framework)
export interface ProductPresentation {
  problem: string;
  agitate: string;
  solve: string;
  explain?: string;
  fullScript?: string;
}

// Customer/Patient Profile
export interface CustomerProfile {
  demographics: {
    age?: string;
    gender?: string;
    lifestyle?: string[];
    healthStatus?: string;
  };
  psychographics: {
    values?: string[];
    attitudes?: string[];
    desires?: string[];
    concerns?: string[];
  };
  painPoints: string[];
  previousSolutions: string[];
}

// Practitioner Profile (for B2B)
export interface PractitionerProfile {
  type: PractitionerType;
  practicePhilosophy?: string;
  whyIdealPartner?: string[];
  commonPainPoints?: string[];
  patientDemographics?: string[];
}

// Product Recommendation (for B2B)
export interface ProductRecommendation {
  patientPresentation: string;
  productId: string;
  productName: string;
  emoji: string;
  reason: string;
  isPrimary: boolean;
}

// Ideal Customer Profile (simplified version)
export interface IdealCustomerProfile {
  demographics?: string;
  psychographics?: string;
  painPoints?: string[];
  previousSolutions?: string[];
}

// Complete Word Track - Flexible interface supporting multiple formats
export interface WordTrack {
  // Metadata
  id: string;
  productId?: string;
  productName?: string;
  practitionerType?: PractitionerType;
  market?: MarketType;
  marketId?: string; // Alternative to market
  title?: string; // Word track title
  tagline?: string;
  category?: string;
  benefits?: string[];
  
  // Overview - supports both naming conventions
  overview?: string;
  productOverview?: string; // Alternative to overview
  
  // Target Profile - supports both formats
  customerProfile?: CustomerProfile;
  idealCustomerProfile?: IdealCustomerProfile; // Alternative simplified format
  practitionerProfile?: PractitionerProfile;
  productRecommendations?: ProductRecommendation[];
  
  // Sales Content - supports both naming conventions
  openingScripts?: OpeningScript[];
  discoveryQuestions?: DiscoveryQuestion[];
  productPresentation?: ProductPresentation | string; // Can be object or HTML string
  objections?: ObjectionResponse[];
  objectionHandling?: ObjectionResponse[]; // Alternative name
  closingScripts?: ClosingScript[];
  followUpSequence?: FollowUpItem[];
  followUpSequences?: FollowUpItem[]; // Alternative name
  testimonialPrompts?: TestimonialPrompt[];
  quickReference?: QuickReference;
  
  // Additional B2B content
  businessModelOptions?: {
    wholesale?: string;
    affiliate?: string;
    hybrid?: string;
  };
}

// Word Track Collection by market
export interface WordTrackCollection {
  d2c: { [productId: string]: WordTrack };
  b2b: { [practitionerType: string]: WordTrack };
  canadian: WordTrack | null;
}

