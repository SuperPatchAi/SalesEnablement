# SuperPatch Sales App - Component Library Specification

## shadcn/ui Base Components Required

Install these from shadcn/ui v4:

```bash
npx shadcn@latest add sidebar accordion tabs card badge button tooltip dialog breadcrumb scroll-area command sonner input separator dropdown-menu sheet toggle-group progress skeleton
```

---

## Custom Components

### 1. Layout Components

#### `AppSidebar`
**Based on:** `sidebar-01` block
**Purpose:** Main navigation sidebar

```tsx
// components/layout/app-sidebar.tsx
interface AppSidebarProps {
  currentMarket: 'd2c' | 'b2b' | 'canadian'
}

// Structure:
// - Logo/Brand
// - Market Switcher
// - Search trigger
// - Navigation groups:
//   - Products (list all 13)
//   - Roadmaps
//   - Clinical Evidence
//   - Practice Mode
//   - Favorites
```

#### `MarketSwitcher`
**Based on:** `Tabs` or `DropdownMenu`
**Purpose:** Switch between D2C, B2B, and Canadian markets

```tsx
// components/layout/market-switcher.tsx
interface MarketSwitcherProps {
  value: 'd2c' | 'b2b' | 'canadian'
  onChange: (market: string) => void
}

const markets = [
  { id: 'd2c', label: 'D2C Sales', icon: User, description: 'Direct to consumer' },
  { id: 'b2b', label: 'B2B Practitioners', icon: Building, description: 'Healthcare practitioners' },
  { id: 'canadian', label: 'Canadian Business', icon: MapPin, description: 'Corporate wellness' },
]
```

#### `SearchPalette`
**Based on:** `Command` component
**Purpose:** Global search (⌘K trigger)

```tsx
// components/layout/search-palette.tsx
interface SearchPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Features:
// - ⌘K keyboard shortcut
// - Search across all products, scripts, objections
// - Grouped results (Products, Scripts, Objections, Evidence)
// - Navigate to result on select
```

---

### 2. Product Components

#### `ProductCard`
**Based on:** `Card`
**Purpose:** Display product in grid

```tsx
// components/products/product-card.tsx
interface ProductCardProps {
  product: {
    id: string
    name: string
    tagline: string
    category: string
    emoji: string
    hasClinicalStudy: boolean
  }
  market: 'd2c' | 'b2b' | 'canadian'
}

// Visual:
// ┌─────────────────────┐
// │ 🔵 Freedom          │
// │ Pain Relief         │
// │ ─────────────────── │
// │ "Take care of..."   │
// │ [Pain] [📊 Study]   │
// └─────────────────────┘
```

#### `ProductGrid`
**Based on:** CSS Grid + `ProductCard`
**Purpose:** Display products in responsive grid

```tsx
// components/products/product-grid.tsx
interface ProductGridProps {
  products: Product[]
  market: 'd2c' | 'b2b' | 'canadian'
}

// Grid: 1 col mobile, 2 col tablet, 3-4 col desktop
```

#### `CategoryFilter`
**Based on:** `Tabs` or `ToggleGroup`
**Purpose:** Filter products by category

```tsx
// components/products/category-filter.tsx
const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'pain', label: 'Pain', emoji: '🔵' },
  { id: 'sleep', label: 'Sleep', emoji: '🟣' },
  { id: 'energy', label: 'Energy', emoji: '⚡' },
  { id: 'balance', label: 'Balance', emoji: '🟢' },
  // ... etc
]
```

---

### 3. Word Track Components

#### `ScriptCard`
**Based on:** `Card`
**Purpose:** Display copyable script with context

```tsx
// components/wordtrack/script-card.tsx
interface ScriptCardProps {
  title: string          // e.g., "Cold Call Script"
  scenario?: string      // e.g., "Calling a chiropractic office"
  content: string        // The actual script
  variant?: 'default' | 'compact'
}

// Visual:
// ┌─────────────────────────────────────────┐
// │ 📞 Cold Call Script           [📋 Copy] │
// │ Scenario: Calling a chiropractor        │
// ├─────────────────────────────────────────┤
// │ "Good morning, this is [Name] from      │
// │ Super Patch. I'm reaching out..."       │
// └─────────────────────────────────────────┘
```

#### `ObjectionCard`
**Based on:** `Card` with flip animation
**Purpose:** Display objection and response

```tsx
// components/wordtrack/objection-card.tsx
interface ObjectionCardProps {
  objection: string
  response: string
  psychology?: string
  flippable?: boolean  // For practice mode
}

// Visual (default):
// ┌─────────────────────────────────────────┐
// │ ❓ "It's too expensive."       [📋] [⭐] │
// ├─────────────────────────────────────────┤
// │ Response:                               │
// │ "I understand that cost is important... │
// ├─────────────────────────────────────────┤
// │ 💡 Psychology: Validates their concern   │
// │ while shifting focus to value...        │
// └─────────────────────────────────────────┘
```

#### `SectionTabs`
**Based on:** `Tabs`
**Purpose:** Navigate word track sections

```tsx
// components/wordtrack/section-tabs.tsx
const sections = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'profile', label: 'Practitioner Profile', icon: Users },
  { id: 'opening', label: 'Opening Scripts', icon: MessageSquare },
  { id: 'discovery', label: 'Discovery Questions', icon: HelpCircle },
  { id: 'presentation', label: 'Presentation', icon: Presentation },
  { id: 'objections', label: 'Objections', icon: ShieldQuestion },
  { id: 'closing', label: 'Closing', icon: CheckCircle },
  { id: 'followup', label: 'Follow-Up', icon: Calendar },
  { id: 'testimonials', label: 'Testimonials', icon: Quote },
  { id: 'quickref', label: 'Quick Reference', icon: Zap },
]
```

#### `QuickRefCard`
**Based on:** `Card`
**Purpose:** Cheat sheet display

```tsx
// components/wordtrack/quick-ref-card.tsx
interface QuickRefCardProps {
  title: string
  sections: {
    heading: string
    items: string[]
  }[]
}

// Visual:
// ┌─────────────────────────────────────────┐
// │ ⚡ QUICK REFERENCE CARD                  │
// ├─────────────────────────────────────────┤
// │ KEY BENEFITS:                           │
// │ 1. Drug-free pain relief                │
// │ 2. Clinical evidence                    │
// │ 3. No contraindications                 │
// ├─────────────────────────────────────────┤
// │ BEST DISCOVERY QUESTIONS:               │
// │ 1. "What do you recommend for..."       │
// └─────────────────────────────────────────┘
```

#### `DiscoveryQuestion`
**Based on:** `Card` (compact)
**Purpose:** Display individual question with category

```tsx
// components/wordtrack/discovery-question.tsx
interface DiscoveryQuestionProps {
  question: string
  category: 'opening' | 'pain' | 'impact' | 'solution'
  number: number
}
```

---

### 4. Roadmap Components

#### `RoadmapGallery`
**Based on:** CSS Grid + `Card`
**Purpose:** Display roadmap thumbnails

```tsx
// components/roadmaps/roadmap-gallery.tsx
interface RoadmapGalleryProps {
  roadmaps: {
    product: string
    imagePath: string
    market: string
  }[]
}
```

#### `RoadmapViewer`
**Based on:** `Dialog`
**Purpose:** Full-screen roadmap with zoom

```tsx
// components/roadmaps/roadmap-viewer.tsx
interface RoadmapViewerProps {
  imagePath: string
  productName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Features:
// - Full-screen modal
// - Pinch-to-zoom (mobile)
// - Pan/scroll
// - Download button
// - Close button (X or swipe down)
```

---

### 5. Evidence Components

#### `StudyCard`
**Based on:** `Card`
**Purpose:** Display clinical study summary

```tsx
// components/evidence/study-card.tsx
interface StudyCardProps {
  study: {
    name: string         // "RESTORE Study"
    product: string      // "Freedom"
    journal: string      // "Pain Therapeutics"
    year: number
    type: string         // "Double-Blind RCT"
    participants: number
    duration: string
    keyResults: { metric: string; result: string }[]
  }
}

// Visual:
// ┌─────────────────────────────────────────┐
// │ 📊 RESTORE Study              [Freedom] │
// │ Pain Therapeutics, 2025                 │
// │ Double-Blind RCT • 118 participants     │
// ├─────────────────────────────────────────┤
// │ KEY RESULTS:                            │
// │ • Pain Severity: Significant reduction  │
// │ • ROM: Improved at Day 7 & 14           │
// │ • Safety: Excellent profile             │
// └─────────────────────────────────────────┘
```

#### `StatsHighlight`
**Based on:** Styled div
**Purpose:** Highlight key statistics

```tsx
// components/evidence/stats-highlight.tsx
interface StatsHighlightProps {
  value: string     // "46%"
  label: string     // "faster sleep onset"
  context?: string  // "69 min → 37 min"
}

// Visual:
// ┌───────────────┐
// │     46%       │
// │ faster sleep  │
// │    onset      │
// │ (69→37 min)   │
// └───────────────┘
```

---

### 6. Practice Components

#### `Flashcard`
**Based on:** `Card` with CSS flip
**Purpose:** Practice objection handling

```tsx
// components/practice/flashcard.tsx
interface FlashcardProps {
  front: string      // Objection
  back: string       // Response
  category: string   // Product or category
  isFlipped: boolean
  onFlip: () => void
}

// Animation: 3D flip on click/tap
// Front: Shows objection
// Back: Shows response
```

#### `PracticeControls`
**Based on:** `Button` group
**Purpose:** Navigate flashcards

```tsx
// components/practice/practice-controls.tsx
interface PracticeControlsProps {
  onPrevious: () => void
  onNext: () => void
  onFlip: () => void
  onShuffle: () => void
  current: number
  total: number
}
```

---

### 7. Utility Components

#### `CopyButton`
**Based on:** `Button`
**Purpose:** Copy text with feedback

```tsx
// components/ui/copy-button.tsx
interface CopyButtonProps {
  text: string
  variant?: 'icon' | 'text'
  onCopy?: () => void
}

// Behavior:
// - Click to copy
// - Show toast notification
// - Brief checkmark icon feedback
```

#### `FavoriteButton`
**Based on:** `Button` (icon)
**Purpose:** Add/remove from favorites

```tsx
// components/ui/favorite-button.tsx
interface FavoriteButtonProps {
  itemId: string
  itemType: 'script' | 'objection' | 'product'
  isFavorite: boolean
  onToggle: (id: string) => void
}

// Visual: Star icon (outline when not favorite, filled when favorite)
```

#### `EmptyState`
**Based on:** `Empty` component or custom
**Purpose:** Display when no content

```tsx
// components/ui/empty-state.tsx
interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

---

## Component Variants & States

### Button Variants
```tsx
// Already in shadcn, but document usage:
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost/Subtle</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Copy /></Button>
```

### Badge Variants
```tsx
// Category badges
<Badge variant="default">Pain</Badge>
<Badge variant="secondary">Sleep</Badge>
<Badge variant="outline">Energy</Badge>

// Status badges
<Badge className="bg-green-500">Has Study</Badge>
```

### Card Variants
```tsx
// Extend Card with custom variants
<Card variant="default">Normal card</Card>
<Card variant="highlight">Highlighted/Featured</Card>
<Card variant="compact">Smaller padding</Card>
```

---

## Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Small desktop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

### Layout Behavior
- **Mobile (< 768px):** Sidebar hidden, bottom nav, full-width content
- **Tablet (768-1024px):** Collapsible sidebar, 2-column grids
- **Desktop (> 1024px):** Persistent sidebar, 3-4 column grids

---

## Animation Tokens

```css
/* Transitions */
--duration-fast: 150ms
--duration-normal: 200ms
--duration-slow: 300ms

/* Easings */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1)
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
```

### Animations to implement
- Flashcard flip (3D transform)
- Accordion open/close (height)
- Toast enter/exit (slide + fade)
- Modal enter/exit (scale + fade)
- Button press (scale down)
- Copy success (checkmark bounce)

---

## Accessibility Requirements

- **Focus visible:** All interactive elements
- **Keyboard navigation:** Tab order, Enter/Space activation
- **Screen reader:** ARIA labels, live regions for toasts
- **Color contrast:** WCAG AA minimum (4.5:1)
- **Touch targets:** Minimum 44x44px
- **Reduced motion:** Respect `prefers-reduced-motion`

---

## Component Development Order

### Priority 1 (Foundation)
1. `AppSidebar`
2. `MarketSwitcher`
3. `ProductCard`
4. `ProductGrid`

### Priority 2 (Word Tracks)
5. `ScriptCard`
6. `CopyButton`
7. `SectionTabs`
8. `ObjectionCard`
9. `QuickRefCard`

### Priority 3 (Search & Navigation)
10. `SearchPalette`
11. `FavoriteButton`
12. `CategoryFilter`

### Priority 4 (Media & Practice)
13. `RoadmapGallery`
14. `RoadmapViewer`
15. `Flashcard`
16. `StudyCard`

---

## Testing Checklist

For each component:
- [ ] Renders correctly in light/dark mode
- [ ] Responsive at all breakpoints
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Touch-friendly on mobile
- [ ] Loading/empty states handled
- [ ] Error states handled
- [ ] Storybook story created (optional)

