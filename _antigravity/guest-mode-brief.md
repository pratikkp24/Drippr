# Antigravity Task Brief — Drippr. Guest Mode + Mock Data

> Paste this entire document into Antigravity as the initial prompt. It is fully self-contained. Do not add context from other conversations.

---

## Context

You are working on **Drippr.**, a Next.js 14 App Router + TypeScript + Tailwind + Supabase + Prisma app. The working directory is `/Users/pratikkumar/Desktop/Drippr.`. Authenticated users can build closets, publish drops, follow creators. Your task is to build a **public guest experience** — a read-only "explore" surface that lets anyone see a populated, alive-looking app without signing up.

**Critical rule:** another developer is actively shipping features in parallel. You must not touch their files. Your work lives entirely inside the paths listed under **"Files you may touch"** below. Any edit outside those paths is a collision and will be rejected.

---

## Files you may touch

Create or edit only these paths:

```
app/(marketing)/explore/                  # new route group, all public
app/(marketing)/explore/page.tsx
app/(marketing)/explore/layout.tsx
app/(marketing)/explore/discover/page.tsx
app/(marketing)/explore/drops/[slug]/page.tsx
app/(marketing)/explore/profile/[username]/page.tsx
app/api/explore/home/route.ts
app/api/explore/discover/route.ts
app/api/explore/drop/[slug]/route.ts
app/api/explore/profile/[username]/route.ts
lib/mock/creators.ts                      # mock data
lib/mock/drops.ts
lib/mock/pieces.ts
lib/mock/index.ts                         # re-exports + helpers
components/explore/GuestBanner.tsx
components/explore/ExploreNav.tsx
components/explore/SignupOverlay.tsx
_antigravity/progress.md                  # your running notes (optional)
```

Do **not** touch:
- `app/(auth)/*`, `app/(app)/*`, `app/auth/callback/*`
- `app/api/*` outside `app/api/explore/`
- `prisma/schema.prisma` (schema is frozen)
- `middleware.ts`
- `lib/supabase/*`, `lib/prisma.ts`
- Any existing file under `app/(marketing)/onboarding/` or `app/(marketing)/page.tsx`

If you need a new component, put it under `components/explore/`. Do not edit shared components elsewhere.

---

## Design system (LOCKED — do not deviate)

Every pixel must match the existing app. Read `tailwind.config.ts` and `app/globals.css` before writing any styles. Summary:

- **Colors:** `bg #F5EFE6`, `surface #FAF7F1`, `primary #1F3D2B` (CTA green), `primary-hover #244733`, `accent #CBBBA0`, `border #E6DDCF`, `text-1 #1F3D2B`, `text-2 #6B7C72`, `text-3 #A8B3AA`, `error #A04A43`
- **Fonts:** `font-display` (Fraunces 400/800, italic for emphasis) for headlines only; `font-sans` (DM Sans 300/400/500/600) for everything else. Fraunces is always paired with a `<em className="italic">word</em>` treatment on one emphasized word.
- **Radii:** `rounded-sm` 10px, `rounded-md` 14px, `rounded-lg` 20px, `rounded-xl` 24px, `rounded-pill` full.
- **Spacing tokens:** use `p-md`, `gap-lg`, `space-y-xl` etc (mapped to 16/24/32px in config).
- **Headline formula:** `fraunces text-[clamp(44px,7vw,84px)] leading-[1.02]` + one italicized word inside an `<em>`.
- **Sentence case** everywhere — no TITLE CASE, no ALL CAPS except 12px tracking-[0.2em] uppercase eyebrow labels.
- **No emojis.** No color deviations. No rounded-full on anything that isn't an avatar or pill.

Reference the existing pages for tone:
- `app/(marketing)/page.tsx` — landing voice
- `app/(app)/home/page.tsx` — hero drop card + creator picks grid pattern
- `app/(auth)/signup/page.tsx` — two-column editorial layout

Copy voice from `_context/` files if any exist, otherwise follow these rules: short sentences, active voice, second person ("you"), lowercase sentences, no jargon. The brand voice is "confident insider — makes fashion feel easy, real, and exciting."

---

## Deliverables

### 1. Mock data (`lib/mock/`)

Pure TypeScript modules, zero database writes. No network calls. All images must be stable Unsplash URLs under `images.unsplash.com` (which is already whitelisted in `next.config.mjs`).

**`lib/mock/creators.ts`** — export `MOCK_CREATORS: MockCreator[]` with exactly **12 creators**. Each has:

```ts
type MockCreator = {
  id: string;           // "mock-c-01" ... "mock-c-12"
  username: string;     // lowercase, 4-12 chars, realistic fashion handles
  displayName: string;  // First Name + Last Initial
  avatarUrl: string;    // stable Unsplash face portrait
  bio: string;          // 1 sentence, lowercase, max 90 chars
  styleSignature: string; // 2-4 words, e.g., "monsoon minimalism"
  location: string;     // Indian city + a few international
  followerCount: number; // 340–42k, varied
  dropIds: string[];    // 2-5 drop IDs from MOCK_DROPS
};
```

Verify each Unsplash URL resolves to 200 before committing (use `curl -sI "url" | head -1` for each). Replace any 404s. Test all 12 before proceeding.

Creator vibe distribution (make it feel intentional, not random):
- 3 minimalist / quiet-luxury leaning
- 2 streetwear-focused
- 2 workwear / elevated basics
- 2 monsoon / layering specialists
- 1 festive / occasion wear
- 1 travel
- 1 vintage / thrifted

Realistic Indian + international mix. Example usernames that work for this voice: `mayawear`, `khadilinen`, `anoushkaknits`, `shiloh.studio`, `quietorbit`, `monsoondiary`, `layerup.co`, `yash.wears`. Do not copy these verbatim — invent 12 that feel distinct.

**`lib/mock/drops.ts`** — export `MOCK_DROPS: MockDrop[]` with **40 drops total**, distributed across the 12 creators (creators with higher followerCount get more drops).

```ts
type MockDrop = {
  id: string;                 // "mock-d-001" ... "mock-d-040"
  slug: string;               // kebab-case from name
  creatorId: string;          // references MOCK_CREATORS
  name: string;               // Fraunces-friendly, 2-5 words
  story: string;              // 1-2 sentences, lowercase, max 160 chars
  coverImage: string;         // stable Unsplash URL, editorial fashion
  vibeTags: string[];         // 2-3 from: minimal, elevated-basics, street-luxe, workwear, weekend, monsoon, occasion, layering, travel, party, festive, casual
  season: ("SUMMER" | "MONSOON" | "WINTER" | "TRANSITIONAL" | "ALL_SEASON")[];
  pieceIds: string[];         // 4-10 piece IDs from MOCK_PIECES
  publishedAt: string;        // ISO, within last 90 days
  saveCount: number;          // 12–1800
};
```

Distribute `publishedAt` so some are 2 days old, some 2 weeks, some 8 weeks — makes the feed feel alive. Sort by `publishedAt desc` in the API.

**`lib/mock/pieces.ts`** — export `MOCK_PIECES: MockPiece[]` with **80 pieces total**, distributed across the 40 drops (each drop has 4-10 pieces, no overlap).

```ts
type MockPiece = {
  id: string;                 // "mock-p-001" ... "mock-p-080"
  name: string;               // "White Linen Shirt", "Ivory Co-ord", lowercase
  brand: string;              // realistic: Myntra brands, Zara, Uniqlo, H&M, indie Indian labels
  category: "TOPS" | "BOTTOMS" | "DRESSES" | "OUTERWEAR" | "FOOTWEAR" | "ACCESSORIES" | "BAGS" | "JEWELRY";
  primaryPhoto: string;       // stable Unsplash product shot
  price: number;              // INR, whole numbers: 1200–18000
  partnerSlug: "myntra" | "ajio" | "nykaa-fashion" | "zara" | "uniqlo" | "hm" | "mango" | "aritzia" | "asos" | "westside" | "souledstore" | "snitch";
  partnerProductUrl: string;  // fake but realistic-looking deep link (never actually clicked through)
  color: string;              // simple: "ivory", "forest", "charcoal"
  tags: string[];             // 1-3 freeform
};
```

Partner distribution should favor Indian retailers (myntra/ajio/nykaa-fashion together ≥ 50%) since the primary audience is India.

**`lib/mock/index.ts`** — re-exports plus helpers:

```ts
export { MOCK_CREATORS, type MockCreator } from "./creators";
export { MOCK_DROPS, type MockDrop } from "./drops";
export { MOCK_PIECES, type MockPiece } from "./pieces";

export function getCreatorByUsername(username: string): MockCreator | undefined;
export function getDropBySlug(slug: string): (MockDrop & { creator: MockCreator; pieces: MockPiece[] }) | undefined;
export function getCreatorProfile(username: string): { creator: MockCreator; drops: MockDrop[] } | undefined;
export function getHomeFeed(): { featured: MockDrop & { creator: MockCreator }; recent: (MockDrop & { creator: MockCreator })[] };
export function getDiscoverPieces(filters?: { category?: string; vibeTag?: string }): (MockPiece & { drop: MockDrop; creator: MockCreator })[];
```

All helper functions must be pure (no side effects, no fetches). They resolve IDs against the in-memory arrays.

### 2. API routes (`app/api/explore/*`)

Each route:
- Is a Next.js App Router route handler exporting `async function GET`
- Reads only from `lib/mock/`
- Returns JSON in the same shape the authenticated equivalents return (look at `app/api/home/route.ts`, `app/api/discover/pieces/route.ts` for reference — match field names exactly so components are swappable)
- Adds `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` header

Routes:

- `GET /api/explore/home` → `{ featuredDrop, creatorPicks }` — one featured drop (highest saveCount in last 14 days) + 8 trending pieces from various creators
- `GET /api/explore/discover?category=&vibe=` → `{ pieces: [...] }` — filterable piece grid, 24 items
- `GET /api/explore/drop/[slug]` → `{ drop, creator, pieces }` → 404 if slug unknown
- `GET /api/explore/profile/[username]` → `{ creator, drops }` → 404 if username unknown

### 3. UI pages (`app/(marketing)/explore/*`)

All public. All read-only. No database writes. No auth required. Users who are signed in may still visit these pages — don't redirect them away.

**`app/(marketing)/explore/layout.tsx`** — shared shell:
- Persistent `GuestBanner` at top (can dismiss to `sessionStorage`, reappears next session)
- Persistent `ExploreNav` — simple top nav with: Drippr. wordmark (left) + links "Explore | Creators | Drops" (center) + "Sign up" pill (right, primary color)
- No sidebar. No bottom nav. Stays editorial and horizontal.
- Children render inside `<main className="max-w-[1200px] mx-auto px-lg pb-3xl">`.

**`components/explore/GuestBanner.tsx`** — thin 44px bar, `bg-surface`, `border-b border-border`:
```
You're exploring Drippr. Sign up to save, follow, build your closet. →
```
Right-side "Sign up" text link to `/signup`. Dismiss `×` on far right.

**`components/explore/SignupOverlay.tsx`** — a reusable click-blocker component that can wrap any action (save, follow, shop). On click, instead of executing, it shows a centered modal:
- Fraunces italic headline: "Love it? *Save it.*" (or "Follow back." / "Shop it." — pass `variant` prop)
- DM Sans subline: "Make an account to keep going. Takes 20 seconds."
- Primary button "Create account" → `/signup`
- Secondary button "Keep exploring" → close modal

**`app/(marketing)/explore/page.tsx`** — Explore home:
- Hero: featured drop with Fraunces drop name + creator + "View drop" button (→ `/explore/drops/[slug]`)
- Section "Creators you should know" — horizontal scroll of 12 creator cards (avatar + name + styleSignature + follower count)
- Section "Trending drops" — 2-column grid, 6 drops
- Section "Discover pieces" — 4-column grid, 12 pieces. Each piece has a "Shop" button that triggers SignupOverlay (variant="shop").

**`app/(marketing)/explore/discover/page.tsx`** — discover grid:
- Top filter bar: category chips (8 categories from `Category` enum, plus "All"), vibe tag chips
- 4-column grid (2 on mobile, 3 on tablet) of `MockPiece`s pulled via `/api/explore/discover`. Piece card: image + name + "@creator" + price (`formatINR` from `lib/utils.ts`) + "Shop" button → SignupOverlay.
- Filters update URL search params for shareability.

**`app/(marketing)/explore/drops/[slug]/page.tsx`** — public drop view:
- Cover image hero (16:9, full-bleed inside max-w-1200)
- Fraunces drop name overlaid bottom-left
- "by @username" link → `/explore/profile/[username]`
- "Save drop" button → SignupOverlay (variant="save")
- Creator story paragraph
- Pieces grid (3-column): each piece card has "Shop" button → SignupOverlay
- "More from @creator" section at bottom — 3 other drops by same creator

**`app/(marketing)/explore/profile/[username]/page.tsx`** — public creator profile:
- Top: avatar (96px circle) + display name + @username + bio + styleSignature (italic) + location + follower count
- "Follow" button → SignupOverlay (variant="follow")
- Tabs: "Drops" | "Closet" (closet tab shows a "Sign up to see their closet" blurred preview with SignupOverlay)
- Drops grid — same card style as explore home trending section

### 4. Entry point from marketing

Edit **only** `app/(marketing)/page.tsx`'s CTA area to add an "Explore first" secondary link next to "Start your closet" that points to `/explore`. This is the *only* edit outside your listed files, and it's a one-line addition — show the exact diff in your progress notes.

### 5. Acceptance criteria

Before marking done, verify each manually in a browser:

- [ ] `/explore` loads, hero visible, no console errors, no unoptimized-image warnings
- [ ] Clicking a trending drop → `/explore/drops/[slug]` with full page populated
- [ ] Clicking a creator card → `/explore/profile/[username]` with bio + drops
- [ ] `/explore/discover` filters update URL and re-render grid
- [ ] "Shop" / "Follow" / "Save" buttons show SignupOverlay, do not navigate or POST anywhere
- [ ] Unknown slug → `/explore/drops/not-a-real-slug` returns 404 page
- [ ] Guest banner dismissal persists for the session only
- [ ] Every Unsplash image resolves (no broken thumbnails)
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Lighthouse Performance ≥ 90 on `/explore` (mobile emulation)
- [ ] No reads from Prisma, no calls to Supabase, no network calls outside Next.js itself. Grep: `grep -r "prisma\|supabase" app/api/explore app/\(marketing\)/explore lib/mock` must return **zero** matches.

### 6. Progress log

Write a running log at `_antigravity/progress.md`. For each session, append:
- Date/time
- What you built or fixed
- Any blockers
- Files touched (full paths)

Keep this file updated. The primary developer will read it to know what's done without reading your diff.

### 7. Output

When done, produce:
- All files listed above
- `_antigravity/progress.md` with a final "DONE" entry listing each acceptance-criteria checkbox as checked or not
- A single shell command (not executed) to verify: `npx tsc --noEmit && grep -r "prisma\|supabase" app/api/explore app/\(marketing\)/explore lib/mock | wc -l` — expected output: `0`

---

## Rules of engagement

- **Do not run `npm install`** — all dependencies you need are already installed (Next 14, Tailwind, lucide-react, next/image). If you think you need a new dep, stop and leave a note in `_antigravity/progress.md` instead.
- **Do not run migrations** — schema is frozen.
- **Do not delete or rename any file.** Add only.
- **Do not commit anything** unless explicitly told to.
- **Do not push to remote.**
- **Do not touch `.env.local`** or any other environment file.
- **Check your work.** After writing each file, re-read it to confirm it compiles against the tokens and shapes above. Missing imports, wrong Tailwind class names, hallucinated hooks — all common failure modes.
- **Stay in your lane.** The directory listing under "Files you may touch" is exhaustive. If you think you need to modify something outside it, write your proposed change to `_antigravity/progress.md` under a "BLOCKED" heading and stop. Do not edit it.

---

## Questions?

If any requirement above is genuinely ambiguous, write the question to `_antigravity/progress.md` under "QUESTIONS" and make the most reasonable assumption — then flag the assumption in the log so the primary developer can course-correct. Never guess silently.

Go.
