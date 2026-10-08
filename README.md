# Journal 1 — public website prototype

Clickable, client-side prototype of the public website for Journal 1 (React 18 + Vite + TypeScript + Tailwind CSS, React Router, react-helmet-async, react-icons with the Material outlined set). No real network calls, payments or messages: everything is simulated with realistic previews.

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (redirects to /ijmat)
npm run build      # typecheck + production build
```

Open **`/prototype-index`** for a list of every page and key demo state (paper at each tracking stage, submission success, certificate valid/invalid, empty states, 404).

Demo helpers: the email OTP code is `123456`. Demo papers for Track My Paper are listed on the Track page and in the prototype index.

## Deploying

`npm run build` produces a static site in `dist/` that works on any static host.

- Everything the site needs is bundled: fonts are self-hosted (`@fontsource-variable`), and the placeholder portraits live in `public/shared/portraits/` (people are matched to photos in `src/mock-data/journals/j1/portraits.ts`). Nothing depends on a third-party image or font server.
- Deep links such as `/ijmat/article/IJMAT2026000121` need the host to serve `index.html` for unknown paths. Ready-made rules are included: `public/_redirects` (Netlify, Cloudflare Pages) and `vercel.json` (Vercel). For Nginx use `try_files $uri /index.html;`; for Apache add an `index.html` fallback rewrite.
- The only live external service is the OpenStreetMap tiles on the Contact page map (it needs internet). Everything else works offline.
- Portraits are placeholders from randomuser.me; replace the files (same names) or edit `portraits.ts` to use real photos.

## Where to change things

| What | File |
| --- | --- |
| Journal name, ISSN, DOI prefix, APC, contact details, trust badges, indexing logos, statistics (each with a `show` flag) | `src/config/journals/j1.ts` |
| Index and verification logos (`show`, `verifyUrl`, status), trust ledger, next-issue deadline | `src/config/journals/j1.ts` (files in `public/shared/indexing/`) |
| Every URL | `src/config/routes.ts` |
| Main navigation and policy list | `src/config/navigation.ts` |
| Colours, fonts, radius (design tokens) | `tailwind.config.js` |
| Mock articles, issues, editors, policies, tracking papers | `src/mock-data/journals/j1/` |
| Fake API (300–800 ms latency) | `src/mock-data/journals/j1/index.ts` |

## Structure

Shared logic is written once; each journal only adds its own config, data, assets and theme (design).

```
frontend/
  docs/references/        design references (not part of the app)
  public/
    shared/indexing/      index and verification logos (all journals)
    shared/portraits/     placeholder photos (mock data only)
    journals/j1/          Journal 1 assets (favicon, logos)
  src/
    config/
      journals/j1.ts      Journal 1 (IJMAT) details, logos, stats, announcements
      routes.ts · navigation.ts
    core/                 shared logic, no design
      types/              Article, Issue, Paper, Editor … types
      containers/         the only layer that loads data and reads route params
      lib/                validators, citation formats, PDF, Scholar meta, drafts
    mock-data/
      latency.ts
      journals/j1/        Journal 1 mock data and the fake API (index.ts)
    themes/j1/            Journal 1 design only
      J1Site.tsx · layouts/ · pages/ · components/
    prototype/            prototype index page
```

Presentational components never import React Router or call APIs; the router is injected through `components/router.tsx`, so they can move into Next.js unchanged. Replace the functions in `mock-data/journals/j1/index.ts` with real API calls when ready.

## Design system

Primary `#14284B`, Secondary `#1F4E9C`, Tertiary `#E07B00` (used **only** for the "Submit Manuscript" call to action), Neutral `#5B6573`, muted green for Open Access. Headlines: Source Serif 4. Body and labels: Source Sans 3.

## Assumptions

- Pages live under `/ijmat/...`, based on the journal's short name (the prefix stands in for the journal's own domain; change `JOURNAL_SLUG` in `src/config/routes.ts`). Old `/j1/...` links redirect automatically. An article's URL slug is its Paper ID; its DOI is `10.55041/{Paper ID}`.
- The current issue is Volume 4, Issue 9 (September 2026); the archive has four volumes, 2023–2026.
- All names, institutions, figures, ISSN, APC (₹6,500 + 18% GST / US$120) and statistics are placeholders.
- Indexing "logos" are text wordmarks until licensed logos are supplied.
- Authors never log in. The only login reference is a small "Editorial login" text link in the footer (placeholder page).
- Conferences and Blog pages were removed from scope.
- The paper flow follows the platform architecture: Submission → Review → Decision → Acceptance → Payment → Production → Publication → Indexing. Reviewer review is optional; decision and acceptance messages go out in a daily 08:45 IST batch.
- Payment is simulated: online (Razorpay for INR, Stripe for USD) or an uploaded UPI / bank proof that the editor verifies. UPI ID and bank details shown in the payment dialog are placeholders.
- Certificates carry a QR code that opens the public verification page; "Print / Save as PDF" prints only the certificate. Certificate numbers are `IJMAT-CERT-{Paper ID}` (`-A2`, `-A3` for co-authors).
- Article "PDF" links point to `/pdf/{Paper ID}.pdf` (the address given to Google Scholar); in the prototype they download a generated placeholder PDF.
- Drafts of the submission form autosave to browser storage on the device (the uploaded file itself is not stored; only its name and size). Declarations and captcha are never restored.
- Downloads (PDFs, templates, certificates, receipts) are simulated with a confirmation toast; citation files really download.
- The Figma screenshots and "Image A" were not available when this was built; Home and the inner pages follow the written specification and the supplied colour/typography design system.

## Open questions for the client

1. Real journal name, short code (Paper ID prefix), ISSN, domain, APC amounts and subject areas.
2. Which trust claims and indexing services can genuinely be displayed (`journal.ts` entries marked "client to confirm").
3. Waiver policy wording and the GST invoice format.
4. Whether authors may edit a paper after the first review round, and how long the edit window is.
5. Real WhatsApp / SMS provider and the exact notification wording.
6. Editorial board photos (currently neutral avatars) and permission to list members.
7. Should Editorial login be a separate application, and what should it link to?
8. Certificate number format and QR-code target URL.

## Running a journal

One codebase serves several journals; the active one is chosen with `VITE_JOURNAL` (default `j1`).

| Command | Journal |
| --- | --- |
| `npm run dev:j1` / `npm run build:j1` | Journal 1, IJMAT (`/ijmat`) |
| `npm run dev:j2` / `npm run build:j2` | Journal 2, JIMRT (`/jimrt`) |

Shared logic lives in `src/core`, per-journal settings in `src/config/journals/<id>.ts`, mock data in `src/mock-data/journals/<id>/`, and each journal's design in `src/themes/<id>/`.
