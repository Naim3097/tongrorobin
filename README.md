# Saiboss Enterprise — Landing Page

Conversion-focused landing page for RORO bin rental in Dengkil / Klang Valley.
Single static page, no build step, WhatsApp as the primary conversion channel.

## Files

| File | Purpose |
|---|---|
| `index.html` | Complete page (HTML + inline CSS + ~150 lines of vanilla JS) |
| `video/` | Hero service film, trimmed and compressed |
| `images/` | Logo, hero poster, service and crew photography, bin photo |
| `robots.txt` | Crawl rules + sitemap pointer |
| `sitemap.xml` | XML sitemap |
| `.claude/launch.json` | Local preview (`npx serve`) |

## Page flow

Hero (what Saiboss does) → quick quote bar → figures → what we handle →
delivery moment → sizes and pricing → how it works → why Saiboss + crew and
credentials → coverage → FAQ → enquiry.

## Design notes

- **Hero is the service film.** 30s original trimmed to 26.5s to drop the logo
  end-card so it loops cleanly, audio stripped, re-encoded 27MB → 1.75MB.
  Loads only when in view, skipped entirely under `prefers-reduced-motion` or
  Save-Data, with the poster frame as the LCP image.
- **Motion earns its place.** Line-mask reveal on the H1, counters on the
  figures, parallax on the delivery photo (desktop only), sticky image that
  follows the active step. No blanket fade-ups.
- **One bin size.** A single spec block (photo, price, spec table, CTA) rather
  than a size selector. Dimensions and capacity are placeholders pending
  confirmation; see Outstanding below.
- Squared corners, hairline rules, real contrast rhythm between near-black and
  bone sections. No gradient blobs, no glassmorphism, no decorative icons.
- Brand red `#D01820` with blue `#1B4FD8` drawn from the Saiboss mark.

## Assets

Used: hero film + poster, lorry lowering a bin, driver at the cab, crew beside
a bin, one bin photo, logo.

Deliberately not used: the truck cutout and crew cutout (both duplicate what
the film and delivery photo already show better), and the two-crew image (its
checkerboard was flattened into the pixels, so it has no usable transparency).

**Outstanding, needs confirming before launch:**

1. **Bin dimensions and capacity.** Currently placeholders at 4 × 6 × 12 kaki /
   ±8 meter padu. These appear in five places: the spec table, the figures
   band, the FAQ answer, the LocalBusiness offer and the bin image alt text.
2. **Price.** `dari RM245` is carried over from the old lowest tier. Confirm
   it is right for the single bin.
3. **Bin photo.** `images/tong-roro-saiboss.webp` still shows the older
   RORO BIN mark. Replace that one file, same name, no markup change.
4. **Registration number.** The Rorobin Dengkil Empire entity and NS0292662-V
   have been removed throughout. If Saiboss has its own SSM number, send it
   and I will restore the registered-company trust point.

## SEO

- Title and description target "sewa tong roro" plus Dengkil / Lembah Klang.
- JSON-LD: `LocalBusiness` (25 `areaServed`, one offer, price range, phone) and
  `FAQPage` mirroring the visible FAQ.
- One H1, semantic H2/H3 per section, descriptive Malay alt text throughout.
- No em-dashes in body copy; sentences use commas, colons and full stops.

## Measured

Lighthouse mobile (throttled): Performance 91, Accessibility 100, Best
Practices 100, SEO 100. CLS 0.037, TBT 0ms. No horizontal overflow at 390px
or 1440px. Video playback, size selector, counters and the sticky step image
all verified in-browser with no console errors.

## Local preview

```bash
npx -y serve -l 8735 .
```

## Deploy

1. Upload `index.html`, `robots.txt`, `sitemap.xml`, `images/` and `video/` to
   the web root.
2. Submit `sitemap.xml` in Google Search Console.

## Recommended next step

Per-area landing pages ("Sewa tong roro Cyberjaya", "…Putrajaya"). One page
cannot rank for 25 town searches; this page's structure is built to be cloned
per area and added to `sitemap.xml`.
