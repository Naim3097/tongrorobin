# TongRoroBin — Landing Page Baharu

Rebuild of tongrorobin.com built to answer every finding in the two Lean X Digital
"Website Visibility Check" audits (TongRoroBin 29/100, ROROBIN 47/100).

## Files

| File | Purpose |
|---|---|
| `index.html` | Complete landing page (single file: HTML + inline CSS + 20 lines of JS) |
| `robots.txt` | Crawl rules + sitemap pointer |
| `sitemap.xml` | XML sitemap for Google |

## Audit findings → fixes

| Audit finding (old site) | New page |
|---|---|
| 77 main headings, no H2s | Exactly **1 H1**, 12 H2s, 9 H3s in proper hierarchy; nav items are links, not headings |
| 6 of 76 images with alt text | **9 of 9 images** with descriptive Malay alt text + width/height (no layout shift) |
| No meta description, no OG tags | Title 62 chars, description 158 chars, full Open Graph + Twitter card, canonical |
| No sitemap / robots files | Both included |
| Service areas not machine-readable | `LocalBusiness` JSON-LD with **25 `areaServed` places**, offers, price range, phone |
| Coverage Area = empty heading | Real list of all 25 areas under its own H2 |
| Project Involvement = empty heading | 4 real projects (Terminal 2 KLIA, Tenpower Banting, UPM Bangi, SK Rinching Hilir) with photos |
| Under 300 words | **719 words** incl. uses, size guidance, 3-step process, FAQ (with FAQPage schema) |
| Website blue vs red/yellow fleet | Brand palette from the lorries: red `#C8161D` + yellow `#FFC400` |
| 3 typefaces, ALL-CAPS headings | One typeface (Poppins, 3 weights), sentence-case headings |
| 3 labels for one booking action | One word everywhere: **Tempah** |
| Broken `tel:` link | `tel:+60133985009` (no spaces) — opens the dialler |
| 2 dead `#` links | Zero dead links |
| Rotating banner, cramped layout | Static hero, generous spacing, no carousel |

## Deploy notes

1. Upload the three files to the web root of tongrorobin.com.
2. **Host the images locally.** The page currently hotlinks the client's existing
   WordPress uploads (`/wp-content/uploads/2025/03/*.webp`) so the preview works.
   On the final host, download those 9 images into an `/images/` folder and update
   the `src` attributes — same-origin images are faster and survive a WP teardown.
3. Submit `sitemap.xml` in Google Search Console.

## Recommended next step (from the audits)

Per-area landing pages ("Sewa tong roro Cyberjaya", "…Putrajaya", etc.) — one page
cannot rank for 25 town searches. The current page's structure (H1 pattern, schema,
coverage list) is designed to be cloned per area, then each page added to `sitemap.xml`.
