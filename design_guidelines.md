# VetConnect Design Guidelines

## Design Approach
**System:** Accessibility-First Hybrid (USWDS + Material Design principles)
**Justification:** Veterans need trustworthy, highly accessible interfaces. This approach combines government-standard accessibility with modern usability patterns, ensuring clarity and ease of use for diverse veteran populations.

**Core Principles:**
- Trust through simplicity and professionalism
- Accessibility as a non-negotiable foundation
- Clear visual hierarchy for stress-free navigation
- Mobile-first responsive design

---

## Color Palette

**Light Mode:**
- Primary: 211 100% 35% (Deep Navy Blue - evokes trust, service)
- Primary Hover: 211 100% 28%
- Secondary: 211 25% 20% (Charcoal)
- Accent: 14 90% 45% (Muted Red - sparingly for crisis/urgent actions)
- Success: 142 70% 35% (Forest Green)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 211 25% 15%
- Text Secondary: 211 15% 45%
- Border: 211 20% 85%

**Dark Mode:**
- Primary: 211 70% 55%
- Background: 211 25% 8%
- Surface: 211 20% 12%
- Text Primary: 0 0% 95%
- Text Secondary: 211 10% 70%

---

## Typography

**Fonts:**
- Primary: Inter (via Google Fonts CDN) - excellent readability, professional
- Headings: Inter 600-700
- Body: Inter 400
- Buttons/Labels: Inter 500

**Scale:**
- H1: text-4xl md:text-5xl font-bold (Hero/Page Titles)
- H2: text-3xl md:text-4xl font-semibold (Section Headers)
- H3: text-xl md:text-2xl font-semibold (Card Titles)
- Body: text-base md:text-lg (Primary Content)
- Small: text-sm (Metadata, Helper Text)

---

## Layout System

**Spacing Units:** Consistently use Tailwind units of **4, 6, 8, 12, 16, 20** (e.g., p-4, gap-6, my-8, px-12)

**Container Strategy:**
- Max width: max-w-7xl mx-auto px-4 md:px-6
- Section padding: py-12 md:py-16
- Card padding: p-6 md:p-8
- Form fields: p-4

**Grid System:**
- Questionnaire: Single column (max-w-2xl) for focus
- Resource cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Dashboard: Asymmetric 2-column (8/4 split on desktop)

---

## Component Library

**Navigation:**
- Fixed top navbar with prominent VetConnect logo
- Mobile: Hamburger menu with clear icons
- Desktop: Horizontal nav with Crisis Help always visible in red accent

**Crisis Help Button:**
- Position: Sticky bottom-right on all screens OR prominent in header
- Style: Large red accent background, white text, phone icon
- Size: px-8 py-4 text-lg font-semibold
- Shadow: Always elevated with drop-shadow-lg

**Questionnaire Form:**
- Progress indicator at top (step 1 of 4 style)
- Radio buttons and checkboxes with large tap targets (min 44px)
- Clear labels above inputs
- Helper text in muted secondary color below fields
- Primary CTA button: Full width on mobile, auto on desktop

**Resource Cards:**
- White/surface background with subtle border
- Icon or category badge top-left
- Title (H3), brief description, location
- Tags for categories (pills with soft backgrounds)
- Primary action button at bottom

**Map Integration:**
- Embedded Google Maps in rounded container
- List view toggle for accessibility
- Location markers with category colors
- Info cards on marker click

**Buttons:**
- Primary: Solid primary color, white text, rounded-lg, px-6 py-3
- Secondary: Outline style with primary border
- Over images: Blurred background (backdrop-blur-sm bg-white/90)

**Input Fields:**
- Consistent dark mode support including form inputs
- Border: 2px solid for focus states
- Rounded: rounded-lg
- Padding: p-4
- Labels: Always visible above input

---

## Accessibility Features

- WCAG AA minimum contrast ratios (AAA preferred)
- Focus indicators: 3px solid primary with offset
- Screen reader text for icon-only buttons
- Keyboard navigation throughout
- Error states with icons AND text
- Crisis button accessible via keyboard (Tab + Enter)

---

## Images

**Hero Section:** Yes - include impactful hero image
- Image: Veteran in civilian clothes using smartphone/tablet with hopeful expression, natural lighting
- Position: Full-width background with gradient overlay (primary color at 60% opacity)
- Height: 60vh on desktop, 50vh mobile
- Content overlay: Centered headline + subheadline + primary CTA

**Additional Images:**
- Category cards: Icon-based (use Heroicons for consistency)
- Success stories: Small circular avatars (if testimonials included)
- Resource thumbnails: Optional small icons per resource type

---

## Animations

**Minimal Motion:**
- Page transitions: Simple fade (200ms)
- Button states: Built-in hover/active only
- Card hover: Subtle lift (translateY -2px) with shadow increase
- NO scroll-triggered animations (can be disorienting)

---

## Page Structure

**Home/Dashboard:**
- Hero with value proposition + quick access buttons
- Crisis help prominent
- Quick questionnaire start
- Recently viewed resources
- Category browse cards

**Questionnaire:**
- Clean single-column form
- Progress indicator
- One question set per screen
- Clear next/back navigation

**Resources Page:**
- Filter sidebar (desktop) / drawer (mobile)
- Grid of resource cards
- Map toggle view
- Search bar at top

**Resource Detail:**
- Full information card
- Contact methods (call, email, visit)
- Directions/map integration
- Related resources section