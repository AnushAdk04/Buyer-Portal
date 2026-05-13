# 🏠 Buyer Portal — Feature Gap Analysis & Implementation Roadmap

> **Last Updated:** May 13, 2026  
> **Codebase:** React 19 + Vite 8 (Frontend) · Node.js + Express 4 (Backend) · PostgreSQL/Supabase · Cloudinary · JWT Auth  
> **Current Status:** Phase 1 & 2 complete — enriched data model, public pages, search/filter/pagination all live

---

## 📊 Current Feature Inventory

### ✅ What Already Exists

| Area | Feature | Status |
|------|---------|--------|
| **Auth** | Register / Login (JWT) | ✅ Working |
| **Auth** | Role-based access (buyer, admin) | ✅ Working |
| **Auth** | Protected routes | ✅ Working |
| **Properties** | Upload property (title, location, price, description, **multi-image**) | ✅ Working |
| **Properties** | Property type, status, bedrooms, bathrooms, area, parking | ✅ New (Phase 1) |
| **Properties** | Multi-image upload (up to 10 per property) | ✅ New (Phase 1) |
| **Properties** | Edit / Delete own properties | ✅ Working |
| **Properties** | View property details page | ✅ Working |
| **Properties** | View all properties in dashboard | ✅ Working |
| **Search** | Full-text search (title, location, description) | ✅ New (Phase 2) |
| **Search** | Filter by type, status, price range, beds, baths, area | ✅ New (Phase 2) |
| **Search** | Sort (newest, oldest, price asc/desc) | ✅ New (Phase 2) |
| **Search** | Pagination with page metadata | ✅ New (Phase 2) |
| **Search** | URL-synced filters (shareable, back-button works) | ✅ New (Phase 2) |
| **Search** | Active filter chips with remove/clear | ✅ New (Phase 2) |
| **Search** | Grid / List view toggle | ✅ New (Phase 2) |
| **Search** | Public search API (no auth required) | ✅ New (Phase 2) |
| **Favourites** | Add / Remove favourites | ✅ Working |
| **Favourites** | View favourites list | ✅ Working |
| **Profile** | View / Edit profile (name, phone, bio) | ✅ Working |
| **Profile** | Upload / Remove avatar (Cloudinary) | ✅ Working |
| **Profile** | Change password | ✅ Working |
| **Profile** | View seller public profile | ✅ Working |
| **Admin** | Dashboard with charts (user growth, property growth, price dist.) | ✅ Working |
| **Admin** | Manage all users (delete, change role) | ✅ Working |
| **Admin** | Manage all properties (delete) | ✅ Working |
| **Admin** | Recent activity feed | ✅ Working |
| **Pages** | Public Landing Page (`/`) with hero, stats, CTA | ✅ New (Phase 1) |
| **Pages** | About Page (`/about`) | ✅ New (Phase 1) |
| **Pages** | 404 Not Found page | ✅ New (Phase 1) |
| **UI** | Dark / Light mode toggle | ✅ Working |
| **UI** | Toast notifications | ✅ Working |
| **UI** | Responsive layout (basic) | ✅ Working |
| **UI** | Google Fonts (Inter + Outfit) | ✅ New (Phase 1) |
| **UI** | Framer Motion animations | ✅ New (Phase 1) |
| **UI** | Footer component (links, social, contact) | ✅ New (Phase 1) |
| **UI** | Skeleton loading cards | ✅ New (Phase 2) |
| **UI** | PropertyCard with status badges, type labels, spec chips | ✅ New (Phase 2) |
| **UI** | Filter sidebar (desktop static + mobile slide-out) | ✅ New (Phase 2) |

---

## 🚨 Critical Gaps — What's Missing

### 🔴 High Priority (Must-Have for a Real Portal)

| # | Missing Feature | Why It Matters | Status |
|---|----------------|----------------|--------|
| 1 | ~~No public landing/home page~~ | ~~Visitors can't browse without an account~~ | ✅ Done (Phase 1) |
| 2 | ~~No search or filtering~~ | ~~Users cannot find properties~~ | ✅ Done (Phase 2) |
| 3 | ~~Properties lack essential fields~~ | ~~Missing bedrooms, bathrooms, area, type, status~~ | ✅ Done (Phase 1) |
| 4 | ~~Single image per property~~ | ~~Buyers expect photo galleries~~ | ✅ Done (Phase 1) |
| 5 | ~~No property categories/types~~ | ~~No way to distinguish house vs apartment~~ | ✅ Done (Phase 1) |
| 6 | ~~No property status tracking~~ | ~~Missing For Sale, For Rent, Sold~~ | ✅ Done (Phase 1) |
| 7 | ~~No pagination~~ | ~~All properties loaded at once~~ | ✅ Done (Phase 2) |
| 8 | ~~No contact/inquiry system~~ | ~~Buyers can't message sellers about a property~~ | ✅ Done (Phase 4) |
| 9 | ~~No 404/error pages~~ | ~~Missing routes show blank screens~~ | ✅ Done (Phase 1) |
| 10 | ~~No email verification~~ | ~~Any email works for registration — no verification flow~~ | ✅ Done (Phase 4 - Implemented via Resend / Reset Flow) |

### 🟡 Medium Priority (Expected by Users)

| # | Missing Feature | Why It Matters | Status |
|---|----------------|----------------|--------|
| 11 | **No map integration** | Location-based browsing is core to real estate | ❌ Phase 5 |
| 12 | **No "Recently Viewed"** | Users lose track of properties they browsed | ❌ Phase 5 |
| 13 | **No compare feature** | Side-by-side comparison is a standard real estate UX pattern | ❌ Phase 5 |
| 14 | ~~No notifications~~ | ~~No alerts for new properties, price changes, etc.~~ | ✅ Done (Phase 4) |
| 15 | ~~No forgot password flow~~ | ~~Users are locked out if they forget their password~~ | ✅ Done (Phase 4) |
| 16 | ~~No social sharing~~ | ~~Can't share property listings on WhatsApp, Facebook, etc.~~ | ✅ Done (Phase 4) |
| 17 | **No SEO meta tags** | Only a generic `<title>` — no OG tags, meta descriptions, structured data | ❌ Phase 6 |
| 18 | ~~No loading skeletons~~ | ~~Plain spinners instead of content-aware skeleton screens~~ | ✅ Done (Phase 2) |
| 19 | ~~No footer~~ | ~~No legal info, links, contact details, or branding~~ | ✅ Done (Phase 1) |
| 20 | **No breadcrumbs** | Users lose navigation context in nested pages | ❌ Phase 3 |

### 🟢 Nice-to-Have (Competitive Edge)

| # | Missing Feature | Why It Matters |
|---|----------------|----------------|
| 21 | **No mortgage/EMI calculator** | Extremely common on real estate portals |
| 22 | **No virtual tour/360° view** | Increasingly expected in modern portals |
| 23 | **No review/rating system** | Trust signals for buyers |
| 24 | **No saved searches** | Users can't get alerts for matching criteria |
| 25 | **No analytics for sellers** | Sellers can't see view count, favourite count, inquiry count on their properties |
| 26 | **No multi-language support** | Nepal-focused portal should support Nepali |
| 27 | **No PWA/offline support** | Progressive Web App for mobile-first users |
| 28 | **No chatbot/AI assistant** | Modern portals use AI to help buyers |

---

## 🎨 UI/UX Critical Issues

| Issue | Current State | Target State | Status |
|-------|--------------|--------------|--------|
| ~~No landing page~~ | ~~Direct redirect to login~~ | Hero section, stats, CTA | ✅ Done |
| ~~Generic color palette~~ | ~~Basic blue/slate Tailwind defaults~~ | Curated brand colors, gradients, glassmorphism | ✅ Done (Phase 3) |
| ~~No typography system~~ | ~~Browser defaults~~ | Inter/Outfit from Google Fonts | ✅ Done |
| ~~No micro-animations~~ | ~~Static transitions only~~ | Framer Motion page transitions, hover effects | ✅ Done (Phase 3) |
| ~~No skeleton loading~~ | ~~Raw spinners~~ | Content-aware shimmer skeletons | ✅ Done |
| ~~No empty states~~ | ~~Plain text~~ | Illustrated empty states with CTAs | ✅ Done |
| ~~Inconsistent spacing~~ | ~~Mixed padding/margin values~~ | 4px-based spacing system | ✅ Done (Phase 3) |
| ~~No glassmorphism~~ | ~~Flat solid cards~~ | Frosted glass effects with backdrop-blur | ✅ Done (Phase 3) |
| **No image optimization** | Raw Cloudinary URLs | Cloudinary transforms | ❌ Phase 6 |
| **Mobile nav** | Desktop nav squeezed on mobile | Proper mobile bottom nav or slide-out drawer | ❌ Phase 3 |
| ~~Card design~~ | ~~Functional but plain~~ | Status badges, spec chips, hover effects | ✅ Done |
| ~~No animations on scroll~~ | ~~Static page content~~ | Intersection Observer fade-in / slide-up | ✅ Done (Phase 3) |

---

## 🗺️ Phased Implementation Roadmap

---

### Phase 1 — 🏗️ Foundation & Data Model Enrichment ✅ COMPLETED
**Goal:** Upgrade the property schema, add missing pages, and establish the design system.  
**Completed:** May 13, 2026

#### 1.1 — Property Schema Upgrade

**New DB Columns (`properties` table):**

```sql
ALTER TABLE properties ADD COLUMN property_type VARCHAR(30) DEFAULT 'house'
  CHECK (property_type IN ('house', 'apartment', 'land', 'commercial', 'villa', 'condo'));
ALTER TABLE properties ADD COLUMN status VARCHAR(20) DEFAULT 'for_sale'
  CHECK (status IN ('for_sale', 'for_rent', 'sold', 'under_contract'));
ALTER TABLE properties ADD COLUMN bedrooms INT DEFAULT 0;
ALTER TABLE properties ADD COLUMN bathrooms INT DEFAULT 0;
ALTER TABLE properties ADD COLUMN area_sqft DECIMAL(10,2);
ALTER TABLE properties ADD COLUMN amenities TEXT[];  -- PostgreSQL array
ALTER TABLE properties ADD COLUMN year_built INT;
ALTER TABLE properties ADD COLUMN parking_spaces INT DEFAULT 0;
ALTER TABLE properties ADD COLUMN is_featured BOOLEAN DEFAULT false;
```

**New Table — `property_images`:**

```sql
CREATE TABLE IF NOT EXISTS property_images (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(500),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.2 — Design System Setup

- [x] Install **Google Fonts** (Inter for body, Outfit for headings)
- [x] Create a comprehensive **Tailwind theme extension** with:
  - Custom color palette (brand colors, semantic colors)
  - Typography scale (font-sans: Inter, font-heading: Outfit)
- [x] Install **Framer Motion** for page transitions & animations
- [x] Create reusable UI primitive components:
  - `Badge` (status, category badges) — in PropertyCard
  - `Skeleton` (shimmer loading component) — in DashboardPage
  - `EmptyState` (illustrated, with CTA) — in DashboardPage

#### 1.3 — Essential Missing Pages

- [x] **Landing Page** (`/`) — Hero, stats bar, CTA section, footer
- [x] **404 Not Found** page — with navigation back
- [x] **About Page** (`/about`) — Portal info, mission, features
- [x] **Footer Component** — Links, contact, social media, legal

#### 1.4 — Backend: Update Models, Controllers, and Routes

- [x] Update `propertyModel.js` for new columns
- [x] Update `propertyController.js` for new fields
- [x] Add `propertyImageModel.js` for multi-image support
- [x] Update upload flow to handle multiple images (up to 10)
- [x] Update property routes (`multer.array('images', 10)`)
- [x] Run DB migration (`migrate.js`) — schema upgraded on Supabase

---

### Phase 2 — 🔍 Search, Filter & Browse Experience ✅ COMPLETED
**Goal:** Make properties discoverable. This is the single biggest UX upgrade.  
**Completed:** May 13, 2026

#### 2.1 — Backend: Search & Filter API

**Implemented endpoint: `GET /api/search`** (public, no auth)

```
Query params:
  ?q=kathmandu          — Full-text search (title + location + description)
  &type=house,apartment — Property type filter
  &status=for_sale      — Status filter
  &minPrice=5000000     — Min price
  &maxPrice=20000000    — Max price
  &bedrooms=3           — Min bedrooms
  &bathrooms=2          — Min bathrooms
  &minArea=1000         — Min area in sqft
  &sort=price_asc       — Sort order (price_asc, price_desc, newest, oldest)
  &page=1               — Pagination
  &limit=12             — Items per page
```

**Implementation details:**
- [x] Dynamic SQL with parameterized WHERE clauses (`searchController.js`)
- [x] LIKE-based search on title, location, description
- [x] Returns pagination metadata: `{ properties, total, page, totalPages, hasMore }`
- [x] Registered as public route in `app.js`

#### 2.2 — Frontend: Search & Filter UI

- [x] **Search bar** in dashboard header — instant text search with 400ms debounce (`useDebounce` hook)
- [x] **Filter sidebar** (`FilterSidebar.jsx`) with:
  - Property type toggle buttons
  - Price range min/max inputs
  - Bedrooms/bathrooms min inputs
  - Area min input
  - Status dropdown
  - Sort dropdown
  - Collapsible sections
  - Mobile: slides in from right with overlay
- [x] **Active filter chips** — show applied filters, click to remove, clear all
- [x] **Pagination component** (`Pagination.jsx`) — numbered pages + prev/next + ellipsis
- [x] **Results count** — "Showing X of Y properties"
- [x] **URL sync** — filters encoded in URL via `useSearchParams` (shareable & back button)
- [x] **View toggle** — Grid view / List view switch
- [x] **Skeleton loading** — shimmer cards while fetching
- [x] **PropertyCard upgrade** — status badges, type labels, bed/bath/area chips

#### 2.3 — Public Browse (No Login Required)

- [x] `GET /api/search` is public — no auth required
- [ ] Landing page shows featured/recent properties (wiring pending)
- [ ] Property details viewable without login (future enhancement)

---

### Phase 3 — 💎 UI/UX Premium Overhaul ✅ COMPLETED
**Goal:** Transform every page from "functional" to "wow factor."  
**Completed:** May 13, 2026

#### 3.1 — Landing Page (The First Impression)

```
┌────────────────────────────────────────────────────────────┐
│  HERO SECTION                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Background: Gradient mesh / Property image collage  │   │
│  │                                                     │   │
│  │   "Find Your Dream Property"                        │   │
│  │   Subtext: Browse 500+ verified listings            │   │
│  │                                                     │   │
│  │   [ 🔍 Search properties by location... ] [Search]  │   │
│  │                                                     │   │
│  │   Quick filters: 🏠 House  🏢 Apartment  🌾 Land   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  STATS BAR  (animated counters)                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ 500+ │ │ 200+ │ │ 50+  │ │ 100% │                      │
│  │Props │ │Users │ │Cities│ │Secure│                      │
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
│                                                            │
│  FEATURED PROPERTIES (horizontal scroll carousel)          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                          │
│  │ ▓▓▓ │ │ ▓▓▓ │ │ ▓▓▓ │ │ ▓▓▓ │                          │
│  │Card │ │Card │ │Card │ │Card │                          │
│  └─────┘ └─────┘ └─────┘ └─────┘                          │
│                                                            │
│  HOW IT WORKS (3-step animated section)                    │
│  1. Search → 2. Compare → 3. Connect                      │
│                                                            │
│  TESTIMONIALS / TRUST SIGNALS                              │
│                                                            │
│  CTA: "Ready to find your home?" [Get Started]             │
│                                                            │
│  FOOTER                                                    │
└────────────────────────────────────────────────────────────┘
```

#### 3.2 — Component-Level Upgrades

| Component | Upgrade |
|-----------|---------|
| **PropertyCard** | [x] Add: Image carousel dots, status badge, property type icon, bedrooms/bathrooms/area chips, gradient border on hover, staggered fade-in animation |
| **Navbar** | [x] Add: Search icon shortcut, notification bell, animated mobile hamburger → slide-out drawer, glassmorphism background |
| **Login/Register** | [x] Add: Split layout (form + illustration), social login placeholders, password strength meter, animated transitions |
| **Dashboard** | [x] Add: Search bar in hero, filter sidebar, view toggle (grid/list), infinite scroll or pagination, skeleton loading |
| **PropertyDetails** | [x] Add: Image gallery with lightbox, specs grid (beds/baths/area/parking), amenities list, map embed, related properties, share buttons, contact seller card |
| **Profile** | [ ] Add: Activity timeline, property stats, animated progress ring for profile completeness |
| **Admin** | [ ] Add: Sidebar navigation, exportable tables, search/filter within tables |

#### 3.3 — Animations & Interactions

- [x] Install `framer-motion` for:
  - Page route transitions (fade + slide)
  - Staggered property card reveals on scroll
  - Modal enter/exit animations
  - Tab switch transitions
  - Counter animations (stats)
- [x] Add CSS `@keyframes` for:
  - Skeleton shimmer
  - Floating gradient backgrounds
  - Pulse effects on CTAs
- [x] Hover effects:
  - Property cards: subtle scale + shadow elevation
  - Buttons: gradient shift + glow
  - Nav items: underline slide-in

#### 3.4 — Responsive Design Overhaul

- [ ] **Mobile bottom navigation** bar for core actions (Home, Search, Upload, Favourites, Profile)
- [ ] **Swipeable image galleries** on touch devices
- [ ] **Collapsible filter drawer** (slide from bottom on mobile)
- [ ] **Touch-optimized** tap targets (min 44×44px)
- [ ] **Container queries** for truly responsive components

---

### Phase 4 — 📬 Communication & Engagement ✅ COMPLETED
**Goal:** Enable buyer-seller interaction and user engagement loops.  
**Completed:** May 13, 2026

#### 4.1 — Contact / Inquiry System

**New DB Table:**

```sql
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Features:**
- [x] "Contact Seller" button on property detail page
- [x] Inquiry form modal (pre-filled with property & user info)
- [x] Inbox page for sellers — view inquiries with property context
- [x] Mark as read / Reply flow (Reply is direct via provided phone/email)
- [x] Inquiry count shown on seller dashboard

#### 4.2 — Notifications System

**New DB Table:**

```sql
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200),
  message TEXT,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Trigger notifications for:**
- New inquiry on your property
- Your property was favourited
- Price change on a favourited property
- New property matching saved search
- Admin notifications (role change, etc.)

**Frontend:**
- [x] Notification bell icon in navbar with unread count badge
- [x] Notification dropdown panel
- [x] Mark as read / Mark all as read
- [x] Click notification → navigate to relevant page

#### 4.3 — Forgot Password Flow

- [x] "Forgot Password?" link on login page
- [x] Backend: Generate password reset token → send email (using Resend)
- [x] Reset password page with token validation
- [x] Token expiry (1 hour)

#### 4.4 — Social Sharing

- [x] Share button on property details page
- [x] Generate shareable links (Native navigator.share / clipboard copy)
- [ ] Open Graph meta tags for rich link previews

---

### Phase 5 — 🗺️ Maps, Analytics & Advanced Features
**Goal:** Location intelligence and data-driven features.  
**Estimated Effort:** ~3–4 days

#### 5.1 — Map Integration

**Option:** Leaflet.js (free, open-source) with OpenStreetMap tiles

- [ ] Add `latitude` and `longitude` columns to properties table
- [ ] **Map view** toggle on dashboard — see all properties as pins on a map
- [ ] **Property detail map** — embedded map showing exact location
- [ ] **Cluster markers** for dense areas
- [ ] **Geocoding** — auto-suggest locations during property upload (use Nominatim API)
- [ ] **Radius search** — "Properties within 5km of [location]"

#### 5.2 — Property Analytics (Seller Dashboard)

**New DB Table:**

```sql
CREATE TABLE IF NOT EXISTS property_views (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  viewer_id INT REFERENCES users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] Track property views (log when a user opens property details)
- [ ] Seller dashboard card: Views, Favourites, Inquiries per property
- [ ] Simple line chart showing views over time
- [ ] "Most Viewed" badge on popular listings

#### 5.3 — Mortgage / EMI Calculator

- [ ] Standalone component on property details page
- [ ] Inputs: Property price, Down payment %, Interest rate %, Loan tenure
- [ ] Output: Monthly EMI, Total interest, Total payment
- [ ] Interactive chart (amortization schedule)

#### 5.4 — Property Comparison

- [ ] "Compare" checkbox on property cards (max 3)
- [ ] Floating compare bar at bottom when items selected
- [ ] Side-by-side comparison page (specs, price, images, location)

#### 5.5 — Recently Viewed

- [ ] Store in `localStorage` (last 20 property IDs with timestamps)
- [ ] "Recently Viewed" section on dashboard
- [ ] Horizontal scrollable card row

---

### Phase 6 — 🚀 Production Polish & SEO
**Goal:** Ship-ready quality, SEO, performance, accessibility.  
**Estimated Effort:** ~2–3 days

#### 6.1 — SEO & Meta Tags

- [ ] Install `react-helmet-async`
- [ ] Dynamic `<title>` and `<meta description>` for every page
- [ ] Open Graph (`og:title`, `og:description`, `og:image`) for social sharing
- [ ] Structured data (JSON-LD) for property listings
- [ ] Sitemap generation
- [ ] `robots.txt`

#### 6.2 — Performance Optimization

- [ ] **Image optimization** — Use Cloudinary transforms:
  - `f_auto,q_auto,w_400` for thumbnails
  - `f_auto,q_auto,w_1200` for detail view
  - Low-quality blur placeholder (LQIP)
- [ ] **Lazy loading** — Images + components below fold
- [ ] **Code splitting** — `React.lazy()` + `Suspense` for route-level splitting
- [ ] **Caching** — API response caching with SWR or React Query
- [ ] **Bundle analysis** — Remove unused dependencies

#### 6.3 — Accessibility (a11y)

- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation for modals, dropdowns, galleries
- [ ] Focus trap in modals
- [ ] Color contrast compliance (WCAG AA)
- [ ] Screen reader announcements for dynamic content

#### 6.4 — Error Handling & Edge Cases

- [ ] Global error boundary component
- [ ] 404 page with illustration
- [ ] Network error state (offline indicator)
- [ ] Form validation with inline error messages
- [ ] Rate limiting on backend endpoints
- [ ] Input sanitization (XSS prevention)

#### 6.5 — Testing & Documentation

- [ ] API documentation (Swagger/OpenAPI or simple Markdown)
- [ ] Component documentation
- [ ] Environment setup guide
- [ ] Deployment checklist

---

## 🎯 Implementation Priority Matrix

```
                        HIGH IMPACT
                            │
                ┌───────────┼───────────┐
                │  Phase 1  │  Phase 2  │
                │ Foundation│  Search   │
    LOW         │  + Schema │  + Filter │        HIGH
    EFFORT ─────┼───────────┼───────────┼───── EFFORT
                │  Phase 6  │  Phase 3  │
                │  SEO +    │  UI/UX    │
                │  Polish   │  Overhaul │
                ├───────────┼───────────┤
                │  Phase 5  │  Phase 4  │
                │  Maps +   │  Messaging│
                │  Analytics│  + Notifs │
                └───────────┼───────────┘
                            │
                        LOW IMPACT
```

> **Recommended order:** Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6  
> Phases 1 and 2 deliver the highest value with lowest risk.

---

## 🛠️ Tech Stack Additions

| Need | Recommended Package | Why |
|------|-------------------|-----|
| Animations | `framer-motion` | Best React animation library, page transitions + gestures |
| Maps | `react-leaflet` + `leaflet` | Free, no API key needed, works with OpenStreetMap |
| Image Gallery | `react-image-gallery` or custom with Framer Motion | Lightbox + thumbnails |
| Rich Text | `react-quill` or `tiptap` | For property description editor |
| Date Formatting | `date-fns` (already lightweight) | Relative time ("2 hours ago") |
| State Management | `@tanstack/react-query` | Server state caching, auto-refetch |
| SEO | `react-helmet-async` | Dynamic meta tags per page |
| Form Validation | `react-hook-form` + `zod` | Performant form handling with schema validation |
| Icons | Keep `react-icons` | Already installed, comprehensive |
| Email | `nodemailer` | For forgot-password, inquiry notifications |
| Rate Limiting | `express-rate-limit` | Prevent API abuse |
| Fonts | Google Fonts (Inter, Outfit) | Via `<link>` in index.html |

---

## 📂 Proposed File Structure (After All Phases)

```
frontend/src/
├── api/
│   └── axiosClient.js
├── assets/
│   ├── images/
│   └── icons/
├── components/
│   ├── ui/                    ← NEW: Reusable primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── Skeleton.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Tooltip.jsx
│   │   └── Card.jsx
│   ├── layout/                ← NEW: Layout components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── MobileNav.jsx
│   │   └── PageLayout.jsx
│   ├── property/              ← NEW: Property-specific
│   │   ├── PropertyCard.jsx
│   │   ├── PropertyGrid.jsx
│   │   ├── PropertyGallery.jsx
│   │   ├── PropertySpecs.jsx
│   │   ├── PropertyMap.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── CompareBar.jsx
│   │   └── EMICalculator.jsx
│   ├── ConfirmDialog.jsx
│   ├── EditPropertyModal.jsx
│   ├── UploadPropertyModal.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/                     ← NEW: Custom hooks
│   ├── useDebounce.js
│   ├── useIntersection.js
│   └── useLocalStorage.js
├── pages/
│   ├── LandingPage.jsx        ← NEW
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── PropertyDetailsPage.jsx
│   ├── ProfilePage.jsx
│   ├── SellerProfilePage.jsx
│   ├── InboxPage.jsx          ← NEW
│   ├── ComparePage.jsx        ← NEW
│   ├── AdminPage.jsx
│   ├── ForgotPasswordPage.jsx ← NEW
│   ├── ResetPasswordPage.jsx  ← NEW
│   ├── AboutPage.jsx          ← NEW
│   ├── NotFoundPage.jsx       ← NEW
│   └── NotAdminPage.jsx
├── utils/                     ← NEW: Utility functions
│   ├── formatPrice.js
│   ├── formatDate.js
│   └── cloudinaryUrl.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

```
backend/src/
├── config/
│   ├── cloudinary.js
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── propertyController.js
│   ├── favouritesController.js
│   ├── userController.js
│   ├── adminController.js
│   ├── inquiryController.js    ← NEW
│   ├── notificationController.js ← NEW
│   └── searchController.js     ← NEW
├── middleware/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   └── rateLimiter.js          ← NEW
├── models/
│   ├── userModel.js
│   ├── propertyModel.js
│   ├── favouriteModel.js
│   ├── propertyImageModel.js   ← NEW
│   ├── inquiryModel.js         ← NEW
│   └── notificationModel.js    ← NEW
├── routes/
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   ├── favouriteRoutes.js
│   ├── userRoutes.js
│   ├── adminRoutes.js
│   ├── inquiryRoutes.js        ← NEW
│   ├── notificationRoutes.js   ← NEW
│   └── searchRoutes.js         ← NEW
└── app.js
```

---

## ✅ Ready to Implement?

> **This plan is designed to be implemented phase by phase, in order. Each phase builds on the previous one.**

**Respond with:**
- `"Start Phase 1"` — Begin with foundation + schema upgrade
- `"Start Phase X"` — Jump to a specific phase
- `"Adjust priorities"` — Re-order or modify the plan
- `"All phases"` — Go through everything sequentially
