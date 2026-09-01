# Saiboss Enterprise — Landing Page (tongrorobin.com)

Conversion-focused landing page for Saiboss Enterprise (legal entity Rorobin
Dengkil Empire, NS0292662-V) — RORO bin rental in Dengkil / Klang Valley.
Single-page static site, no build step, WhatsApp as the primary conversion
channel.

## Files

| File | Purpose |
|---|---|
| `index.html` | Complete landing page (HTML + inline CSS/SVG + ~100 lines of vanilla JS) |
| `images/` | Saiboss logo, hero bin render (2 widths), lorry cutout, 3 bin photos, 4 real job photos (SEO filenames) |
| `robots.txt` | Crawl rules + sitemap pointer |
| `sitemap.xml` | XML sitemap for Google |
| `.claude/launch.json` | Local dev preview (`npx serve`) |

## Page structure (conversion flow)

Hero (problem → solution, CTA, bin vector) → animated lorry band → proof strip
→ use cases (kegunaan) → bin options with size diagrams (saiz & harga) → how it
works (cara) → why us + real job photos (kenapa) → coverage (kawasan) → FAQ
(soalan) → enquiry form (tempah). A round floating WhatsApp button appears
after the hero and hides at the enquiry section.

## Key decisions

- **Brand**: Saiboss Enterprise (logo in header); legal line keeps Rorobin
  Dengkil Empire (NS0292662-V). Schema `name` Saiboss Enterprise with
  `alternateName` TongRoroBin for domain continuity.
- **Malay-first copy**, conversational tone ("dah termasuk", "tak perlu") —
  matches how the market actually searches and talks. One English line in the
  footer covers "RORO bin rental Klang Valley".
- **Hero visual**: branded Saiboss bin render (transparent cutout) served as
  responsive WebP at 700w/1100w via `srcset`, preloaded as the LCP image.
  The three pricing cards use the original fleet bin photos.
- **Scroll-linked lorry**: the fleet cutout drives left to right across its own
  band as the page scrolls (rAF + transform only; static under
  `prefers-reduced-motion`).
- **No em-dashes in body copy**: sentences are punctuated with commas, colons
  and full stops, which reads as human rather than machine-generated.
- **WhatsApp everywhere**: hero CTA, per-bin "Tempah Tong Ini" (pre-filled
  per size), "Tanya Saiz yang Sesuai" photo helper, coverage fallback link,
  enquiry form that composes a full pre-filled message (size, area, days,
  waste type). All prefills greet "Hi Saiboss!".
- **Only supported claims**: registration NS0292662-V, prices from RM245 incl.
  delivery/collection, 25 areas, 1–7 day rentals, named past projects.
  Bin volumes (±4/±8/±10 m³) are computed from the stated dimensions.
- Typography: Archivo (headings) + Inter (body). Red `#C8161D` + yellow
  `#FFC400` accents; WhatsApp CTAs use accessible green `#15803D`.

## SEO

- Title/description target "sewa tong roro" + Dengkil/Lembah Klang; canonical,
  Open Graph, theme-color.
- JSON-LD: `LocalBusiness` (25 `areaServed`, 3 offers, price range, phone) +
  `FAQPage` (8 questions, mirrors the visible FAQ).
- One H1 (keyword + location), semantic H2/H3, descriptive Malay alt text,
  SEO image filenames, width/height everywhere, below-fold images lazy-loaded.
- Lighthouse (mobile, throttled): Perf 89 / A11y 100 / BP 100 / SEO 100, CLS 0.

## Local preview

```bash
npx -y serve -l 8735 .
```

## Deploy

1. Upload `index.html`, `robots.txt`, `sitemap.xml` and the `images/` folder to
   the web root of tongrorobin.com.
2. Submit `sitemap.xml` in Google Search Console.

## Recommended next step

Per-area landing pages ("Sewa tong roro Cyberjaya", "…Putrajaya", etc.) — one
page cannot rank for 25 town searches. This page's structure (H1 pattern,
schema, coverage groups) is designed to be cloned per area, then each page
added to `sitemap.xml`.
