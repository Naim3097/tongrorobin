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
| `.claude/launch.json` | Local preview configs: PowerShell server (no dependencies) and `npx serve` |
| `.claude/serve.ps1` | Dependency-free static server for Windows machines without Node |

## Page flow

Hero (what Saiboss does) → quick quote bar → figures → what we handle →
delivery moment → sizes and pricing → how it works → why Saiboss + crew and
credentials → coverage → FAQ → enquiry.

## Design notes

- **Hero is the service film.** 30s original trimmed to 26.5s to drop the logo
  end-card so it loops cleanly, audio stripped, re-encoded 27MB → 1.75MB.
  Loads only when in view, skipped entirely under `prefers-reduced-motion` or
  Save-Data, with the poster frame as the LCP image. The copy block is centred
  on the film — eyebrow (symmetric red rules), H1, sub and both CTAs all on
  the page's centre line. Under 560px the eyebrow drops to `.72rem` with
  narrower rules so `Dengkil · Seluruh Lembah Klang` stays on one line.
- **Motion earns its place.** Line-mask reveal on the H1, counters on the
  figures, parallax on the delivery banner (desktop only). No blanket fade-ups.
  The banner sits 8% taller than its frame and is offset `top:-4%` so the
  ±3% parallax travel never exposes an edge — change one of those three
  numbers and you must change the others.
- **Delivery band.** Full-bleed `banner-rorobin.jpg` (2875 × 1080) in a frame
  sized `clamp(300px,37vw,470px)` to stay near the banner's own 2.66:1, so the
  lorry is never clipped. Copy is vertically centred and left-aligned on the
  page margin over a left-to-right scrim; under 760px the frame becomes 5:3
  anchored right (the lorry sits in the right two-thirds of the banner) and
  the copy centres on both axes over a flat veil.
- **How it works is a stepper.** White section, three columns, each with its
  own photo, a numbered red disc and copy. One red rule runs the full width of
  the row with the discs sitting on it, each set in from its column edge so a
  short lead-in tick shows. Everything is visible at once — nothing in the
  section waits on scroll. Under 900px the columns stack and each card keeps
  the same photo / rule / disc composition at full width.
- **Three sizes, one selector.** Three cards on the page margin, each carrying
  an inline SVG side-profile of the bin drawn to scale — body heights 34 / 68 /
  85 in a 100-unit box, i.e. exactly 2 : 4 : 5 kaki — on a shared ground line,
  with the hook bar, ribs and skids of a real RORO bin and a technical
  dimension line beside it. So the three heights are *seen*, not read. The
  silhouette is `currentColor`: warm grey idle, ink on hover, and when
  selected the bin yellow sampled from the drawings (`--yellow`, #FEDB1C),
  with a brand-red tick in the corner; the price, name, dims and a
  one-line "what it's for" hint sit below a hairline. Then the drawing for
  that size crossfading in a 3:2 stage beside a price / spec /
  "sesuai untuk" panel whose CTA carries the size into the WhatsApp message.
  Proper `role=tablist` with arrow-key movement. Picking a size also sets the
  size select in both enquiry forms, so a visitor who scrolls straight down to
  book gets the bin they were just looking at. The cards stay three-across at
  every width — the comparison is the point — going to a compact stacked
  layout under 560px (silhouette, price, name, dims; capacity and hint hidden)
  that still fits 375px with room to spare. The stage sits above the panel
  under 900px. Sizes, capacities and
  prices live once, in the `SIZES` array in the script; the markup only holds
  the default (Sederhana) so the page reads correctly without JavaScript.
- **Coverage rises out of the skyline.** `background-kl.jpg` sits in a
  bottom-anchored band (`clamp(300px,42vw,540px)`) on `#kawasan::before`,
  faded in from the top with a `mask-image` rather than veiled with an opaque
  white overlay — the page's own white *is* the gradient, so the head sits on
  pure paper and the Klang Valley skyline with its red highway trail only
  resolves below the copy. The section carries an oversized
  `padding-bottom` (`clamp(12rem,22vw,19rem)`) purely to buy that clear band:
  shrink it and the closing note lands on the buildings. Mask stops are tuned
  so no text sits above roughly 30% image opacity.
- **Coverage is a marquee.** Centred head, then Dengkil alone in a dark pill
  with a pulsing red dot and a `Pangkalan kami` label, a soft fading vertical
  rule, then the other 24 towns in two hairline-framed rows that scroll
  forever in opposite directions — top row left-to-right at 38s, bottom
  right-to-left at 46s, paused on hover. The loop is seamless because each
  row's track holds the same 12 chips twice and animates exactly `-50%`; the
  trailing gap lives on `.mq-group`'s `padding-right`, so track width is
  precisely 2 × group width. Move the gap onto the track and the loop will
  visibly jump. Edges are softened with a `mask-image` fade rather than a hard
  cut. Under `prefers-reduced-motion` the animation stops, the duplicate group
  is hidden and the chips reflow into a centred static cloud.
- **One margin, no exceptions.** Every block of content sits inside `.wrap`
  (1240px max, 1.25rem gutter). The quick quote bar under the hero is a white
  hairline-bordered card on that same margin with the red submit filling the
  right cell — it used to be a dark full-bleed strip. Only two things go edge
  to edge, and both are background media with their copy still on the margin:
  the hero film and the delivery-moment band.
- Squared corners except where a radius was asked for: the three step photos
  (10px, 8px small) and the booking form card (12px, 10px small). Hairline
  rules, real contrast rhythm between near-black and light sections. No
  gradient blobs, no glassmorphism, no decorative icons.
- **Booking section.** `red-background.jpg` under a left-to-right dark scrim
  (94% → 30%) so the white heading, bullets and phone number hold on the dark
  left while the red glow reads on the right. Under 900px the scrim floor
  lifts to 72% because the single column puts text across the full width.
- Brand red `#D01820` with blue `#1B4FD8` drawn from the Saiboss mark. Every
  WhatsApp affordance — the nav button, the in-page CTAs, the floating action
  button, the two inline WhatsApp links — is brand red, not WhatsApp green,
  by request. The `--green` tokens are gone; reverting means reintroducing
  them and swapping `var(--red)` back in `.btn-wa`, `.wa`, `.area-note a` and
  `.faq p a`.

## Assets

Used: hero film + poster, the three step photos (`langkah-1/2/3.png`, 1537 ×
1023), the two crew portraits (`krew-penghantaran.png`,
`pemandu-hantar-tong.png`, both 1122 × 1402 and shown in matching 4:5 frames
so neither is cropped), the delivery banner (`banner-rorobin.png`, 2048 ×
768), the coverage skyline
(`background-kl.jpg`), the booking backdrop (`red-background.jpg`), the three
bin drawings (`tong-kecil-2x6x12.png`, `tong-sederhana-4x6x12.png`,
`tong-besar-5x6x12.png`, 1536 × 1024 each), logo.

No longer shown on the page, kept in `images/` for now:
`krew-saiboss-tong-roro.webp`, `pemandu-lori-saiboss.webp`,
`tong-roro-saiboss.webp` and `tong_roro_technical_infographic.jpg` (the
single-size drawing, superseded by the three PNGs). The red-bin JPG versions
of the banner, step photos and crew portraits were removed from the tree when
the yellow-bin PNGs replaced them on 17 Sep 2026; they are in git history at
`c815121` if ever needed. `lori-turunkan-tong-roro.webp` no longer appears
either but is still the `image` value in the LocalBusiness JSON-LD — repoint
that at the banner or the hero poster if the file is ever removed.

Deliberately not used: the truck cutout and crew cutout (both duplicate what
the film and delivery photo already show better), and the two-crew image (its
checkerboard was flattened into the pixels, so it has no usable transparency).

**Outstanding, needs confirming before launch:**

1. **Bin sizes and capacities.** Three tiers: 2 × 6 × 12 kaki (±4 m³),
   4 × 6 × 12 (±8 m³) and 5 × 6 × 12 (±10 m³). Capacities are the box volume
   converted, not measured. They appear in the `SIZES` array, the tab labels,
   the two form selects, the FAQ answers (visible and JSON-LD), the
   LocalBusiness offers and the three drawings' alt text — change them in
   every place or the page contradicts itself.
2. **Prices.** RM245 / RM350 are the tiers this site published before the
   single-size interlude, restored as-is; RM480 for the large bin is the
   figure given on 17 Sep 2026 (the old site had RM490). None of the three
   has been confirmed against a current price list. Same places as item 1,
   plus `priceRange` in the JSON-LD and the "3 saiz dari RM245" meta and OG
   descriptions.
3. **Image weight — the biggest thing left to fix.** Six of the photos now
   ship as PNG, which is the wrong format for photographs and roughly doubles
   their size: `pemandu-hantar-tong.png` 2.3MB, `langkah-2.png` 2.2MB,
   `krew-penghantaran.png` 2.2MB, `langkah-3.png` 2.2MB, `langkah-1.png` 1.9MB,
   `banner-rorobin.png` 1.8MB. Then `red-background.jpg` 1.4MB, the three bin
   drawings as RGBA PNGs (`tong-sederhana` 1.4MB, `tong-kecil` 1.4MB,
   `tong-besar` 1.2MB), `background-kl.jpg` 439KB, against ~30-140KB for the
   original WebP set. That is roughly
   **18MB of images against a 1.75MB hero film**,
   on a page whose whole point is a fast WhatsApp conversion on mobile data.
   All of them are lazy-loaded so they do not hold up LCP, but they should be
   resized to about 1200px on the long edge (1800px for the banner) and
   re-exported as WebP before launch. The drawings are flat colour on white
   and need no alpha, so they compress hardest of all. Expect ~100-200KB each,
   so roughly 1.5MB total instead of 18MB. The six photo PNGs alone would drop
   from 12.6MB to about 700KB as JPG at quality 85, with no visible change. Separately, each drawing's small
   print (the three feature callouts) only reads at desktop width; the numbers
   that matter are repeated in the spec table.
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
Practices 100, SEO 100. CLS 0.037, TBT 0ms. **These predate the JPG swaps —
re-run Lighthouse after the images are optimised.**

Since then, verified in-browser with no console errors: video playback,
counters, both WhatsApp forms building correct deep links, the FAQ
accordions, and — measured element by element against the `.wrap` content
box at 375, 414, 600, 700, 768, 1024, 1280 and 1600px — nothing outside the
page margin and `scrollWidth === clientWidth` at every width.

## Local preview

Two configs in `.claude/launch.json`, both on port 8735:

- `tongrorobin-static` — `.claude/serve.ps1`, a static server on .NET
  `HttpListener`. Needs nothing installed beyond Windows PowerShell 5.1, which
  is why it is the default: the Node one fails outright on a machine without
  `npx`, and the machine this page was built on has no Node.
- `tongrorobin-node` — `npx -y serve`, for machines that have Node.

Direct invocations:

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/serve.ps1
```

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
