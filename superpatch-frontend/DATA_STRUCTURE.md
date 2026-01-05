# SuperPatch Sales App - Data Structure Specification

## Overview

Content will be sourced from the existing markdown files in `SalesEnablement/` and transformed into structured JSON/TypeScript data for the app.

---

## Products Data

### Product Definition
```typescript
// types/product.ts
export interface Product {
  id: string                    // e.g., "freedom", "rem", "boost"
  name: string                  // e.g., "Freedom"
  tagline: string               // e.g., "Drug-Free Pain Relief"
  category: ProductCategory
  emoji: string                 // e.g., "🔵"
  color: string                 // Hex color for theming
  clinicalStudy?: ClinicalStudy
  markets: Market[]             // Which markets this product is available in
}

export type ProductCategory = 
  | 'pain'
  | 'sleep'
  | 'energy'
  | 'balance'
  | 'focus'
  | 'mood'
  | 'immunity'
  | 'metabolism'
  | 'habits'
  | 'stress'
  | 'beauty'
  | 'mens'
  | 'performance'

export type Market = 'd2c' | 'b2b' | 'canadian'
```

### Products Catalog
```typescript
// data/products.ts
export const products: Product[] = [
  {
    id: 'freedom',
    name: 'Freedom',
    tagline: 'Drug-Free Pain Relief',
    category: 'pain',
    emoji: '🔵',
    color: '#007BFF',
    clinicalStudy: {
      name: 'RESTORE Study',
      journal: 'Pain Therapeutics',
      year: 2025,
      type: 'Double-Blind RCT',
    },
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'rem',
    name: 'REM',
    tagline: 'Drug-Free Sleep Support',
    category: 'sleep',
    emoji: '🟣',
    color: '#6F42C1',
    clinicalStudy: {
      name: 'HARMONI Study',
      journal: 'Sleep Research',
      year: 2024,
      type: 'Prospective Clinical Trial',
    },
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'liberty',
    name: 'Liberty',
    tagline: 'Drug-Free Balance Support',
    category: 'balance',
    emoji: '🟢',
    color: '#28A745',
    clinicalStudy: {
      name: 'Balance Study',
      journal: 'Int\'l Journal of Physical Medicine',
      year: 2022,
      type: 'Controlled Comparative',
    },
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'boost',
    name: 'Boost',
    tagline: 'Drug-Free Energy Support',
    category: 'energy',
    emoji: '⚡',
    color: '#FFC107',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'victory',
    name: 'Victory',
    tagline: 'Drug-Free Performance Support',
    category: 'performance',
    emoji: '🏆',
    color: '#E31937',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'focus',
    name: 'Focus',
    tagline: 'Drug-Free Concentration Support',
    category: 'focus',
    emoji: '🎯',
    color: '#17A2B8',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'defend',
    name: 'Defend',
    tagline: 'Drug-Free Immune Support',
    category: 'immunity',
    emoji: '🛡️',
    color: '#20C997',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'ignite',
    name: 'Ignite',
    tagline: 'Drug-Free Metabolic Support',
    category: 'metabolism',
    emoji: '🔥',
    color: '#FD7E14',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'kick-it',
    name: 'Kick It',
    tagline: 'Drug-Free Willpower Support',
    category: 'habits',
    emoji: '✊',
    color: '#6C757D',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'peace',
    name: 'Peace',
    tagline: 'Drug-Free Stress Support',
    category: 'stress',
    emoji: '☮️',
    color: '#6F42C1',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'joy',
    name: 'Joy',
    tagline: 'Drug-Free Mood Support',
    category: 'mood',
    emoji: '😊',
    color: '#FFC107',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'lumi',
    name: 'Lumi',
    tagline: 'Drug-Free Beauty Support',
    category: 'beauty',
    emoji: '✨',
    color: '#E83E8C',
    markets: ['d2c', 'b2b'],
  },
  {
    id: 'rocket',
    name: 'Rocket',
    tagline: 'Drug-Free Men\'s Vitality',
    category: 'mens',
    emoji: '🚀',
    color: '#343A40',
    markets: ['d2c', 'b2b'],
  },
]
```

---

## Word Track Data

### Word Track Structure
```typescript
// types/wordtrack.ts
export interface WordTrack {
  productId: string
  market: Market
  sections: {
    overview: OverviewSection
    practitionerProfile: PractitionerProfileSection  // B2B only
    customerProfile: CustomerProfileSection          // D2C only
    openingScripts: Script[]
    discoveryQuestions: DiscoveryQuestion[]
    presentation: string                             // Markdown
    objections: Objection[]
    closingScripts: Script[]
    followUpSequences: FollowUpSequence[]
    testimonialPrompts: string[]
    quickReference: QuickReference
  }
}

export interface OverviewSection {
  productDescription: string
  mechanism: string                    // How VTT works
  clinicalEvidence?: ClinicalEvidence  // If product has study
  differentiators: Differentiator[]
  integrationBenefits: string[]
}

export interface PractitionerProfileSection {
  targetPractitioners: {
    type: string
    whyFits: string
  }[]
  psychographics: string[]
  painPoints: string[]
  previouslyTried: string[]
}

export interface CustomerProfileSection {
  demographics: string[]
  psychographics: string[]
  painPoints: string[]
  previouslyTried: string[]
}

export interface Script {
  id: string
  title: string              // "Cold Call Script"
  scenario: string           // "Calling a chiropractic office"
  content: string            // The actual script
  keyElements?: string[]     // Teaching notes
}

export interface DiscoveryQuestion {
  id: string
  question: string
  category: 'opening' | 'pain' | 'impact' | 'solution'
}

export interface Objection {
  id: string
  objection: string
  response: string
  psychology: string
}

export interface FollowUpSequence {
  day: string                // "Day 1", "Day 3-4", etc.
  title: string
  voicemail?: string
  email?: string
  text?: string
}

export interface QuickReference {
  title: string
  keyBenefits: string[]
  bestQuestions: string[]
  topObjections: {
    objection: string
    shortResponse: string
  }[]
  bestClosingLines: string[]
  keyStats?: string[]
}
```

---

## Clinical Evidence Data

```typescript
// types/evidence.ts
export interface ClinicalStudy {
  id: string
  name: string                    // "RESTORE Study"
  productId: string               // "freedom"
  publication: {
    journal: string
    year: number
    type: string                  // "Double-Blind RCT"
    registration?: string         // "ClinicalTrials.gov NCT06505005"
  }
  design: {
    participants: number
    duration: string
    groups?: string
    conditions?: string[]
  }
  results: StudyResult[]
  conclusion: string
  talkingPoints: string[]
}

export interface StudyResult {
  metric: string
  result: string
  improvement?: string
  before?: string
  after?: string
}

// data/clinical-evidence.ts
export const clinicalStudies: ClinicalStudy[] = [
  {
    id: 'restore',
    name: 'RESTORE Study',
    productId: 'freedom',
    publication: {
      journal: 'Pain Therapeutics',
      year: 2025,
      type: 'Randomized, Controlled, Double-Blind',
      registration: 'ClinicalTrials.gov NCT06505005',
    },
    design: {
      participants: 118,
      duration: '14 days',
      groups: 'Active VTT (n=64) vs Placebo (n=54)',
      conditions: ['Myofascial/musculoskeletal pain', 'Arthritis', 'Neuropathy'],
    },
    results: [
      { metric: 'Pain Severity', result: 'Significantly greater improvement in active group' },
      { metric: 'Pain Interference', result: 'Significantly greater reduction in active group' },
      { metric: 'Range of Motion', result: 'Greater improvement at Day 7 and Day 14' },
    ],
    conclusion: 'Clinicians should consider this VTT patch as potential first-line or adjunct therapy to treat pain.',
    talkingPoints: [
      'Double-blind, placebo-controlled RCT',
      'Published in peer-reviewed Pain Therapeutics',
      'ClinicalTrials.gov registered',
      '118 participants with objective measurements',
    ],
  },
  {
    id: 'harmoni',
    name: 'HARMONI Study',
    productId: 'rem',
    publication: {
      journal: 'Sleep Research',
      year: 2024,
      type: 'Prospective Clinical Trial',
    },
    design: {
      participants: 113,
      duration: '14 days',
    },
    results: [
      { metric: 'Time to Fall Asleep', before: '69 min', after: '37 min', improvement: '46% faster' },
      { metric: 'Total Sleep Duration', before: '5 hours', after: '6.5 hours', improvement: '+1.5 hours' },
      { metric: 'Night Waking', before: '83% weekly', after: '22% weekly', improvement: '74% reduction' },
      { metric: 'Sleep Medication Use', result: '80% stopped medications during study' },
    ],
    conclusion: '70% of patients preferred the patch over sleep medications.',
    talkingPoints: [
      '46% faster sleep onset',
      '80% stopped sleep medications',
      '+1.5 hours of sleep per night',
      'Only 4.4% adverse events (minor)',
    ],
  },
  {
    id: 'balance',
    name: 'Balance Study',
    productId: 'liberty',
    publication: {
      journal: 'Int\'l Journal of Physical Medicine & Rehabilitation',
      year: 2022,
      type: 'Controlled Comparative Study',
    },
    design: {
      participants: 69,
      duration: 'Single assessment',
    },
    results: [
      { metric: 'Balance Score', improvement: '31% increase', result: 'Statistically significant (p<0.05)' },
    ],
    conclusion: 'VTT products influence neuromuscular balance control and coordination.',
    talkingPoints: [
      '31% improvement in balance scores',
      'Statistically significant (p<0.05)',
      'Validated Sway Medical Assessment',
      'Falls are #1 injury death cause in 65+',
    ],
  },
]
```

---

## Roadmaps Data

```typescript
// types/roadmap.ts
export interface Roadmap {
  id: string
  productId: string
  market: Market
  title: string
  imagePath: string
  thumbnailPath?: string
}

// data/roadmaps.ts
export const roadmaps: Roadmap[] = [
  // D2C Roadmaps
  { id: 'd2c-freedom', productId: 'freedom', market: 'd2c', title: 'Freedom 4K Roadmap', imagePath: '/roadmaps/d2c/Freedom_4K_Roadmap.png' },
  { id: 'd2c-rem', productId: 'rem', market: 'd2c', title: 'REM 4K Roadmap', imagePath: '/roadmaps/d2c/REM_4K_Roadmap.png' },
  // ... etc
  
  // B2B Roadmaps
  { id: 'b2b-freedom', productId: 'freedom', market: 'b2b', title: 'Freedom B2B Roadmap', imagePath: '/roadmaps/b2b/Freedom_B2B_Roadmap.png' },
  // ... etc
  
  // Canadian Roadmap
  { id: 'canadian-wellness', productId: 'all', market: 'canadian', title: 'Canadian Business Wellness Roadmap', imagePath: '/roadmaps/canadian/Canadian_Business_Wellness_Roadmap.png' },
]
```

---

## Markets Data

```typescript
// types/market.ts
export interface MarketInfo {
  id: Market
  name: string
  shortName: string
  description: string
  icon: string           // Lucide icon name
  productCount: number
  primaryColor: string
}

// data/markets.ts
export const markets: MarketInfo[] = [
  {
    id: 'd2c',
    name: 'Direct to Consumer',
    shortName: 'D2C',
    description: 'Word tracks for selling directly to end consumers',
    icon: 'User',
    productCount: 13,
    primaryColor: '#E31937',
  },
  {
    id: 'b2b',
    name: 'B2B Healthcare Practitioners',
    shortName: 'B2B',
    description: 'Word tracks for selling to healthcare practitioners',
    icon: 'Building',
    productCount: 13,
    primaryColor: '#20C997',
  },
  {
    id: 'canadian',
    name: 'Canadian Business Wellness',
    shortName: 'Canada',
    description: 'Word tracks for Canadian corporate wellness programs',
    icon: 'MapPin',
    productCount: 1,  // Single comprehensive track
    primaryColor: '#E31937',
  },
]
```

---

## Favorites/Bookmarks Data

```typescript
// types/favorites.ts
export interface Favorite {
  id: string
  type: 'script' | 'objection' | 'question' | 'product'
  productId: string
  market: Market
  title: string
  content: string
  addedAt: Date
}

// LocalStorage key: 'superpatch-favorites'
```

---

## Search Index Structure

```typescript
// types/search.ts
export interface SearchableItem {
  id: string
  type: 'product' | 'script' | 'objection' | 'question' | 'evidence'
  title: string
  content: string
  productId?: string
  market?: Market
  url: string
}

// Will be generated at build time for client-side search
```

---

## Content Loading Strategy

### Option 1: Static JSON (Recommended for MVP)
```typescript
// Convert markdown to JSON at build time
// Store in /data/*.json files
// Import directly in components

import { wordTracks } from '@/data/wordtracks'
import { products } from '@/data/products'
```

### Option 2: MDX (For future content editing)
```typescript
// Keep content as .mdx files
// Use next-mdx-remote or contentlayer
// Benefits: Easier content updates, markdown syntax
```

### Option 3: Headless CMS (For team editing)
```typescript
// Use Contentful, Sanity, or similar
// Benefits: Non-technical users can edit
// Costs: Additional service, complexity
```

**Recommendation:** Start with Option 1 (Static JSON), migrate to Option 2 or 3 if content updates become frequent.

---

## File Organization

```
superpatch-frontend/
├── data/
│   ├── products.ts           # Product catalog
│   ├── markets.ts            # Market definitions
│   ├── clinical-evidence.ts  # Study data
│   ├── roadmaps.ts           # Roadmap references
│   └── wordtracks/
│       ├── d2c/
│       │   ├── freedom.ts
│       │   ├── rem.ts
│       │   └── ...
│       ├── b2b/
│       │   ├── freedom.ts
│       │   ├── rem.ts
│       │   └── ...
│       └── canadian/
│           └── business-wellness.ts
├── types/
│   ├── product.ts
│   ├── wordtrack.ts
│   ├── evidence.ts
│   ├── market.ts
│   └── favorites.ts
└── lib/
    ├── content.ts           # Content loading utilities
    ├── search.ts            # Search utilities
    └── favorites.ts         # LocalStorage utilities
```

---

## Migration Script

To convert existing markdown files to structured data:

```typescript
// scripts/convert-content.ts
// 1. Read markdown files from SalesEnablement/
// 2. Parse markdown sections
// 3. Extract structured data
// 4. Write to TypeScript files in data/

// This will be run once during initial setup
// Future updates can be manual or scripted
```

