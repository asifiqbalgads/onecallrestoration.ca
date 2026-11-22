# One Call Restoration — Premium Homepage (design concept)

A single-page, hand-built homepage redesign for **[One Call Restoration](https://onecallrestoration.ca/)**, the Edmonton, Alberta commercial
restoration company (fire, water, storm, mould & asbestos abatement, general contracting and reconstruction).

Everything on this page — copy, contact details, service list and the project photographs — was researched from the live
website. No business facts were invented. The page is a **static demo**: HTML5 + CSS3 + vanilla JavaScript, no framework,
no build step, no server-side dependency, ready to serve straight from GitHub Pages.

> **Search engines:** the document is marked `noindex, nofollow` and carries a `canonical` pointing at
> `https://onecallrestoration.ca/`, so this prototype can never compete with the production site in results.

---

## 1. Live preview / deployment

Publish from the repository root:

1. GitHub → *Settings → Pages → Source: **Deploy from a branch*** → branch **`main`** (or this branch) → folder **`/ (root)`** → Save.
2. The site then serves from `index.html` at the repository root, including under a project subdirectory
   (e.g. `https://<user>.github.io/onecallrestoration.ca/`) because **every asset path is relative** (`./assets/…`, `./css/…`, `./js/…`).
3. [`.nojekyll`](.nojekyll) is committed so Jekyll processing is skipped.

No npm install, no bundler, and **no third-party requests at all** — the three typefaces are subset, self-hosted
WOFF2 files in `assets/fonts/` (with a system fallback stack behind them), so the page renders identically offline or on a
restricted network.

Optional local check: `python3 -m http.server 8080` → `http://localhost:8080/`.

---

## 2. File structure

```
.
├── index.html              ← the whole homepage (semantic, one H1, landmarks, JSON-LD)
├── css/
│   └── style.css           ← design system + all sections, mobile-first
├── js/
│   └── script.js           ← nav, drawer, dropdown, carousel, FAQ, form, floating actions
├── assets/
│   ├── images/             ← .jpg + matching .webp for every photo (picture/srcset)
│   ├── icons/icons.svg     ← the custom 24px icon set (also inlined in the HTML)
│   └── logo/               ← logo lockups, mark variants, favicon, apple-touch-icon, og-cover
├── .nojekyll
└── README.md
```

---

## 3. Brand identity carried over from the existing site

| Token | Value | Where it came from |
| --- | --- | --- |
| Accent gold | `#F5B325` | sampled from the homepage's yellow service band / highlighted word in the hero |
| Deep violet | `#493083` | the live header CTA and "Learn more" buttons |
| Logo blue | `#1803D0` | sampled from the original logo artwork |
| Ink | `#161311` | the black hero/trust sections of the current site |
| Bone | `#F5F2EC` | light section background of the current site |

**Logo** — the original mark (cog ring + amber towers + 24/7 clock dial + `ONE CALL / RESTORATION` wordmark) was rebuilt as
clean vector artwork on the same geometry, with the white box removed so it sits on dark or light backgrounds without a plate:
`assets/logo/logo-full.svg`, `logo-full-reversed.svg`, `logo-mark.svg`, `logo-mark-line.svg`, plus mono variants and a favicon
set. The wordmark in the header is live text so it stays crisp at any zoom. The original artwork is not distorted or recoloured
away from the brand.

**Typography** — `Bricolage Grotesque` (display) + `Public Sans` (body) + `IBM Plex Mono` (technical labels), three families,
fixed weight set, strong size scale via `clamp()`. The variable fonts are subset to Latin + punctuation (≈236 kB total,
OFL-licensed; `assets/fonts/OFL.txt`), declared with `@font-face` + `font-display: swap` and preloaded for the two faces needed
at first paint.

**Icons** — all hand-drawn inline SVG symbols on a 24px grid with one stroke weight. No emoji, no icon-font, no CDN.

---

## 4. Images & provenance (kept honest)

| Files | Source | Used for |
| --- | --- | --- |
| `site-project-01…05.jpg` | **Original photographs from onecallrestoration.ca** (the "about us" project collage, cropped panel-by-panel) | Projects section, captioned as coming from the current website |
| `hero-response.jpg`, `service-*.jpg`, `crew-detail.jpg`, `night-response.jpg` | Generated for this concept (photographic style, not presented as real jobs) | Hero, service tiles, why-us, CTA. Explicitly labelled on the page as *representative trade photography created for this design concept* |
| `og-cover.jpg` | Composite of the CTA photograph + the vector logo | Social preview |

Crew imagery carries the brand: the logo mark is composited onto the technicians' jacket backs (`hero-response`,
`service-storm`, `service-fire`, `service-water`, `crew-detail`) and onto the service van (`night-response`), so no
white-label stock worker appears in a branded scene.

Both `.jpg` and `.webp` versions ship for every photo; `<picture>` serves WebP first, JPEG as the fallback, and each
`<img>` has `width`/`height` to prevent layout shift.

---

## 5. Page sections

1. Utility bar — 24/7 emergency line, service area, Google rating
2. Premium sticky header with Services dropdown
3. Signature hero (headline + dispatch status, dual CTA, key facts, framed crew photograph, rating plate)
4. Trust & authority strip (rapid response, insurance-ready records, one accountable crew, commercial focus)
5. Services — editorial mosaic, five disciplines, each tile deep-links to the matching live service page
6. Why One Call — four proof points + portrait crew image with a real review pull-quote
7. Emergency response — five-step timeline from intake to hand-over
8. Project photographs from the existing website
9. Verified Google reviews — accessible carousel (buttons, dots, arrow keys, swipe)
10. Request a callback — validated form + contact rails
11. Service area & hours — dispatch radar, coverage list, opening hours
12. FAQ accordion
13. Full-bleed final CTA over the night-response photograph
14. Footer with real contact data + demo disclaimer
15. Floating actions — mobile bottom action bar, desktop call pill, back-to-top

---

## 6. Interaction & form behaviour

* Mobile drawer menu: focus trap, `Esc`, body scroll lock, `aria-expanded`, auto-close at desktop width.
* Services dropdown: hover on pointer devices, tap-to-open then tap-to-follow on touch, `Esc`/outside-click close, `↓` enters the list.
* Scroll-spy marks the current section; smooth in-page scrolling offsets the sticky header.
* Review carousel and FAQ are keyboard operable; `prefers-reduced-motion` disables reveals, the rotating gear and smooth scroll.
* **The form does not fake a submission.** There is no backend, so validation happens locally and the page then offers a
  pre-filled `mailto:` draft (plus a call link). No "Thanks, we'll be in touch!" success message is shown for data that was never sent.

Contact details used are the business's real ones: **780-952-5726** · **info@onecallrestoration.ca** ·
**11430 142 St NW, Edmonton, AB T5M 1V1** · office Mon–Fri 8:00am–4:30pm, emergency line 24/7.

---

## 7. Responsive behaviour

Mobile-first CSS; the layout is authored at 360/390/430 px, then re-composed at 620, 780, 900, 1000, 1040 and 1280 px:

* no horizontal scroll at 360 px (`overflow-x: clip` on `body`, `max-width:100%` media, `overflow-wrap` guard)
* the hero photograph bleeds edge-to-edge on phones (negative gutter) and returns to a clipped, angled frame from 600 px up
* sticky bottom action bar respects `env(safe-area-inset-bottom)` and hides itself while the callback form or the footer is on screen,
  so it never overlaps the footer or duplicates the form CTA
* header, drawer and floating buttons share one z-index scale — nothing can sit under the sticky header
* service tiles switch from one-per-row to a 12-column asymmetric mosaic; the rebuild tile becomes a wide banner
* reviews, quote rails, coverage list, process steps and footer columns all re-stack without orphaned side gaps

---

## 8. Accessibility & performance notes

* Landmarks (`header`, `nav`, `main`, `footer`), one `h1`, ordered heading hierarchy, skip link, labelled icon-only buttons,
  `aria-live` form status, visible focus rings on both light and dark surfaces, text contrast ≥ 4.5:1 for body copy
  (gold is only ever used as large text or as fill behind ink).
* `role="dialog"` + `aria-modal` drawer, `aria-expanded` on menus/FAQ, `aria-roledescription="carousel"` on the reviews.
* Zero render-blocking scripts (deferred), one CSS + one JS request, **no third-party requests whatsoever**, all images
  lazy-loaded except the hero (`fetchpriority="high"`). HTML + CSS + JS = 123 kB uncompressed; the whole repository including
  every image and font is 3.5 MB.

---

## 9. Known limits of this prototype

* It is a **homepage only**, by brief — the service, about and contact pages remain on the live WordPress site and are linked to directly.
* Contact form is intentionally mailto-based (see §6). Wiring it to Formspree/Web3Forms or the existing WordPress form is a one-field change.
* Some AI-composed photographs contain soft, illegible background signage — inherent to generated imagery; swap in real job photos when the client supplies them.

---

## 10. GitHub Pages — one manual step left

The repository is **Pages-ready** (`index.html` at the root, `.nojekyll` present, all paths relative) and pushed to
`arena/f2611dee-onecallrestoration-ca`. Pages could **not** be switched on from this integration — `POST /repos/…/pages`
returned `403 Resource not accessible by integration`, so the last step is manual:

**Settings → Pages → Source: *Deploy from a branch* → `main` (or this branch) → `/ (root)` → Save**, then wait ~1 minute for
`https://asifiqbalgads.github.io/onecallrestoration.ca/` to build. Nothing else needs to be changed.

---

## 11. QA actually performed

Headless Chromium (viewport-accurate) against a local static server:

| Check | Result |
| --- | --- |
| Horizontal overflow at 320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 | `scrollWidth == clientWidth` at every width, 0 px |
| Console errors, page errors | none |
| Network responses ≥400 | none |
| Broken or alt-less `<img>` | 0 broken, 0 missing alt |
| Custom fonts applied | `document.fonts.check()` true for all three families |
| Sticky header height across widths | 67 px, no layout jump |
| Mobile drawer (open, services submenu, `Esc`, focus return, body scroll lock) | passes |
| Services dropdown (hover-open ≥1040 px, close on leave, tap-toggle, `↓` into list) | passes |
| FAQ accordion (single-open, animated height, `aria-expanded`) | passes |
| Review carousel (prev/next, dots, `01 / 06` counter, swipe targets) | passes |
| Quote form (3 fields flagged when empty; valid submit composes a `mailto:` draft; no fake success message) | passes |
| Mobile action bar (appears past hero, hides over the form/footer, `env(safe-area-inset-bottom)` padding) | passes |
| Back-to-top / desktop call pill | passes; back-to-top hidden below 1040 px so it can never sit on footer text |
