# Performance Optimization Roadmap

Date: 2025-10-17

## Summary
Implement a phased set of optimizations to reduce initial JS payload, improve image delivery efficiency, and enhance perceived responsiveness for gallery interactions.

## Motivation
Current architecture can benefit from image pipeline improvements, bundle size trimming, and smarter rendering strategies to ensure fast load times as gallery size grows.

## Scope
Frontend (Next.js, React components), asset pipeline (images, JSON), build configuration, and runtime delivery (Edge/CDN).

## Tasks / Checklist
- [ ] Migrate all images to next/image with responsive sizes, blurDataURL placeholders, and AVIF/WebP output; use `priority` only for the hero.
- [ ] Introduce CDN (or image optimizer) for originals with `Cache-Control: public, max-age=31536000, immutable`.
- [ ] Pre-generate gallery metadata (dimensions, dominant color, blur hash) using ISR or static build; lazy-load full-res on intersection.
- [ ] Dynamic import heavy/rarely used components (UploadZone, Framer Motion animation modules).
- [ ] Purge unused Tailwind classes; audit `content` globs to ensure maximum tree-shaking.
- [ ] Run `next build --analyze`; split framer-motion imports to only required features (e.g., `import { m } from 'framer-motion'`).
- [ ] Replace any large date/manipulation libraries (moment/dayjs) with native Intl if present (verify usage).
- [ ] Enable Edge Runtime for lightweight API routes where feasible.
- [ ] Memoize gallery/grid components; apply `React.useDeferredValue` to filter/search inputs to avoid jank.
- [ ] Implement incremental/infinite scroll pagination instead of rendering entire gallery list.
- [ ] Compress JSON responses (gzip/brotli) and add ETag support; ensure proper cache headers.
- [ ] Define performance budgets (e.g., First Load JS < 180KB, LCP image < 2.5s on mid-tier device, CLS < 0.1).
- [ ] Add Lighthouse CI / WebPageTest workflow (follow-up issue) for continuous monitoring.

## Acceptance Criteria
- First Contentful Paint and LCP both improved (>15% faster versus current baseline measurement).
- JavaScript first load bundle reduced by at least 20%.
- Images served in next-gen formats with correct caching verified in network panel.
- Gallery remains responsive (no noticeable input lag) at 5x current number of items.
- Automated performance report available in CI (may land in a subsequent PR if split).

## Measurement Plan
1. Capture baseline metrics with Lighthouse (mobile & desktop) before changes.
2. Re-run after each major milestone; track in a markdown metrics table (future update).
3. Use Web Vitals logging (`next/script` or custom) to confirm production improvements.

## Notes
If any task reveals architectural blockers, create sub-issues instead of expanding scope here.
