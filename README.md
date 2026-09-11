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
- **One bin size.** A single spec block (technical drawing, price, spec table,
  CTA) rather than a size selector. Dimensions and capacity are placeholders
  pending confirmation; see Outstanding below.
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

Used: hero film + poster, the three step photos (`langkah-1/2/3.jpg`), the two
crew portraits (`krew-penghantaran.jpg`, `pemandu-hantar-tong.jpg`, both
1080 × 1350 and shown in matching 4:5 frames so neither is cropped), the
delivery banner (`banner-rorobin.jpg`), the coverage skyline
(`background-kl.jpg`), the booking backdrop (`red-background.jpg`), the bin
dimension drawing, logo.

No longer shown on the page, kept in `images/` for now:
`krew-saiboss-tong-roro.webp`, `pemandu-lori-saiboss.webp` and
`tong-roro-saiboss.webp`. `lori-turunkan-tong-roro.webp` no longer appears
either but is still the `image` value in the LocalBusiness JSON-LD — repoint
that at the banner or the hero poster if the file is ever removed.

Deliberately not used: the truck cutout and crew cutout (both duplicate what
the film and delivery photo already show better), and the two-crew image (its
checkerboard was flattened into the pixels, so it has no usable transparency).

**Outstanding, needs confirming before launch:**

1. **Bin dimensions and capacity.** Currently placeholders at 4 × 6 × 12 kaki /
   ±8 meter padu. These appear in five places: the spec table, the figures
   band, the FAQ answer, the LocalBusiness offer and the bin image alt text.
2. **Price.** `dari RM245` is carried over from the old lowest tier. Confirm
   it is right for the single bin.
3. **Image weight — the biggest thing left to fix.** The newer JPGs are far
   heavier than the originals: `banner-rorobin.jpg` 1.4MB,
   `red-background.jpg` 1.4MB, `langkah-3.jpg` 1.1MB, `langkah-2.jpg` 1.0MB,
   `krew-penghantaran.jpg` 1.0MB, `pemandu-hantar-tong.jpg` 992KB,
   `langkah-1.jpg` 778KB, `background-kl.jpg` 439KB and
   `tong_roro_technical_infographic.jpg` 287KB, against ~30-140KB for the
   WebP set. That is roughly
   **8.4MB of images against a 1.75MB hero film**,
   on a page whose whole point is a fast WhatsApp conversion on mobile data.
   All of them are lazy-loaded so they do not hold up LCP, but they should be
   resized to about 1200px on the long edge (1800px for the banner) and
   re-exported as WebP before launch. Expect ~100-200KB each, so roughly 1.2MB
   total instead of 8.4MB. Separately, the drawing's small print (the three
   feature callouts) only reads at desktop width; the numbers that matter are
   repeated in the spec table.
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
