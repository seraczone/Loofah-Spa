## Loofah Spa Abuja — Build Plan

Your brief is extraordinarily detailed and spans a full luxury site, AI consultation, booking, ecommerce, CRM, and admin dashboard. That is a multi-week build. To deliver quality (not a watered-down version of everything), I propose building it in clearly scoped phases, starting with a stunning **Phase 1 marketing site** that nails the brand experience end-to-end. Backend-heavy modules (booking DB, ecommerce, admin) come in later phases once Lovable Cloud is enabled.

---

### Phase 1 — Cinematic Marketing Site (this build)

**Pages (TanStack Start routes, each with own SEO metadata)**
- `/` Home — Sections 1, 2, 3 (preview), 4 (preview), 8, 10, 15
- `/services` — Full filterable service showcase (Section 3)
- `/services/$slug` — Individual treatment page template (16 treatments)
- `/results` — Before & After hub with comparison slider (Section 4)
- `/about` — The Loofah Spa Story, horizontal scroll (Section 9)
- `/membership` — Glow / Royal / Elite tiers (Section 11)
- `/visit` — Map + location (Section 7)
- `/consultation` — AI Skin Consultation quiz (Section 5, frontend-only result logic for now)
- `/book` — Booking flow UI (Section 6, captures lead → WhatsApp deep link in Phase 1)
- `/contact`

**Design system (`src/styles.css`)**
- Full color tokens from brief converted to oklch (ivory, cream, mocha, matte black, champagne gold, antique gold, rose dust, sage mist) + dark surface tokens
- Gradient recipes, easing tokens, duration tokens
- Typography: Cormorant Garamond, Playfair Display, DM Sans, Cormorant SC, DM Mono via Google Fonts
- Type scale with `clamp()`

**Animation/interaction stack**
- Framer Motion for component reveals + page transitions
- GSAP + ScrollTrigger + SplitText for cinematic scroll, pinning, masked headline reveals
- Lenis smooth scroll
- Custom magnetic button, gold shimmer sweep, custom cursor (desktop), parallax tilt cards, number counters, marquee
- `prefers-reduced-motion` fallbacks throughout

**Hero**
- Looping muted background video (Cloudinary-hosted placeholder) with brand gradient overlay
- Cinematic load sequence (curtain → wordmark → headline char-stagger → sub → CTA → trust strip → floating review cards)
- Glassmorphism trust marquee, 3 floating review cards

**Mobile**
- Sticky bottom "Book Treatment" bar
- Floating WhatsApp FAB with pulse
- Bottom tab nav
- Swipeable carousels, touch-friendly before/after slider

**Footer** — 4-column dark luxury, social, hours, mini-map thumbnail

**SEO**
- Per-route `head()` with title, description, og:title/description, og:image
- LocalBusiness + MedSpa JSON-LD on home & visit
- FAQPage JSON-LD on service pages
- Sitemap route

**Forms (frontend only in Phase 1)**
- React Hook Form + Zod for consultation, booking, contact
- Submissions open WhatsApp deep link with pre-filled message AND log to console (wired to Cloud in Phase 2)

---

### Phase 2 — Lovable Cloud backend (next build)
- Enable Lovable Cloud
- Bookings table + booking flow persistence
- Leads table (consultation + contact submissions)
- Auth (client accounts)
- Email confirmations (Resend integration)
- Admin login + role-based access (separate `user_roles` table)

### Phase 3 — Payments & Ecommerce
- Paystack via Lovable payments (NGN)
- Consultation deposit on booking
- Skincare ecommerce (Section 12) with cart + checkout
- Membership recurring billing

### Phase 4 — Admin dashboard (Section 14)
- Bookings calendar, CRM, before/after upload (Cloud Storage), inventory, email campaigns, revenue dashboard

### Phase 5 — Integrations
- Real Google Maps (needs API key)
- Real Instagram feed (needs Meta token)
- Google Analytics 4 + Hotjar
- WhatsApp Business API (vs. simple `wa.me` deep link in Phase 1)

---

### Technical notes (for the curious)
- Stack stays on the project's TanStack Start + Vite + Tailwind v4 (not Vite 5/CRA). Shadcn UI components customized to the design tokens.
- Animations layered: Framer Motion for component-scope, GSAP for scroll-pinned cinematic moments, Lenis for global smooth scroll.
- Images use placeholder URLs from Unsplash for Phase 1; swap to Cloudinary once you provide an account.
- Custom cursor and heavy parallax disabled on touch + reduced-motion.

---

### What I need from you to start Phase 1
1. **Confirm the phased approach** (or tell me to compress / reorder).
2. **Phone + WhatsApp number** for CTAs and footer (placeholders OK if not ready).
3. **Any real photography** you want to use, or should I use tasteful stock placeholders for now?
4. **Logo** — do you have a wordmark/mark, or should I typeset "Loofah Spa" in Cormorant for now?

Once you confirm, I'll implement Phase 1 in one pass.