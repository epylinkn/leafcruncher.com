# CHANGELOG

## 2026-10-10 — Swimming pool photos re-sourced from the 5760px originals (sitting 2)

**What** — All 15 photos in the `at the bottom of the swimming pool` bundle
regenerated from the originals in `raw/`, which had been sitting there at
5760×3840 while the site shipped 1600px. `scripts/optimize-image.sh` rewritten
so it is safe to run, and a latent srcset bug in `image/hero.html` fixed.
Closes the part of T11 that needed nobody; PORTAL and light arcade still need
hunting.

**Why** — T11 was tabled on 2026-09-08 and Anthony reopened it. It was the only
open item needing neither his input nor bandwidth: the originals were already
on this disk, so it was pure gain.

**The gain is below the ceiling, not at it** — the headline is 1600 → 1920, but
that is the smaller half. Every tier is now downsampled from the 5760px
original instead of from a 1600px intermediate, so the 960w and 1440w files
carry real detail where before they were near-copies of an already-soft source.
A 1440w crop compared side by side before and after shows it plainly in the
foliage.

**Two bugs fixed in the same pass**

1. `scripts/optimize-image.sh` used `-resize 3840x2160^ -gravity center -extent
   3840x2160`. The `^` fills and `-extent` then crops, so every image came out
   16:9 — it would have centre-cropped all six portrait photographs in this
   bundle. It also forced thumbnails to a 400×400 square and had no `>`, so it
   upscaled sources smaller than the target. T11 had flagged this as "do not
   re-run as written"; it is now `-resize WxW>` with a square bound and no
   `-extent`, `-auto-orient` before `-strip`, defaulting to 1920 at q82.
2. `image/hero.html` appended the source file to the srcset unconditionally. A
   source sitting exactly on a breakpoint — a 1920px photo, now the house
   ceiling — therefore appeared twice at the same `w`, letting the browser pick
   the 418KB original over the 397KB derivative of identical dimensions. The
   source is now only offered when it is wider than anything generated. Latent
   until this sitting, because nothing had previously hit 1920.

**Verified** — `hugo --gc --minify` clean. Srcset for a 1920px source now ends
at one `1920w` candidate, not two. A 1280px portrait still offers its source at
`1280w`, and facing-the-fearbeast still offers its 1169px original, so the
dedupe did not regress smaller sources. Aspect ratios checked on every file:
3:2 stayed 3:2, 2:3 stayed 2:3, nothing cropped. One portrait inspected visually
for orientation after `-strip`.

**Tradeoff** — +1.2 MB tracked in git (2.8 MB → 4.1 MB of bundle webp). Page
weight is 1.8 MB at the 960w tier and 3.3 MB at 1440w across 17 images, all
lazy-loaded. Accepted: the bytes a visitor actually fetches barely move, since
the browser picks a tier, and the detail at every tier improves.

**Correction to T11 itself** — the task table claimed a "big win" for
COFFEETHEQUE and IN DREAMS. It is wrong, and they were deliberately not done.
Both pages are a Vimeo embed with no photo on them; their only image is a
listing thumbnail already shipping at 1600×1200 and 1067×1600 into a card that
renders ~450px wide. They are oversized for their one use, not under.
Re-running the pipeline would change nothing a visitor sees. Their real gap —
no still photography at all — is a content decision belonging to T6.

**Out of scope (next sitting)** — PORTAL (960×540, the worst on the site and
below phone resolution) and light arcade (1500×884); neither has an original on
disk, so both need hunting rather than reprocessing. Fearbeast stays last: its
`raw/` files are Instagram CDN downloads, and real originals need ten
photographers' permission. T12 (visibility categories) still tabled pending a
walkthrough.

**Pattern echo** — same shape as the minify trap in sitting 1: in both cases the
pipeline silently degraded the work and the local build looked fine. Worth
assuming the asset path lies until checked.

**Key files**

- `scripts/optimize-image.sh` (rewritten — `-resize WxW>`, square bound, no `-extent`, `-auto-orient` before `-strip`; `-w`/`-q`/`-o` flags)
- `layouts/shortcodes/image/hero.html` (srcset no longer offers the source when a generated width already matches it)
- `content/projects/at-the-bottom-of-the-swimming-pool/*.webp` (15 photos regenerated at 1920px long edge; `pool-piano.webp` and `pool-piano-render.jpg` untouched — no original in `raw/`)
- `TASKS.md` (T11 marked partly done; COFFEETHEQUE and IN DREAMS dropped with the reasoning recorded)

---

## 2026-10-10 — Red Burns quotes, `quote` shortcode, and T5 shipped (sitting 1)

**What** — Two Red Burns quotes now sit at the foot of `/about/`, set by a new
reusable `quote` shortcode. `operation: criminal cryptokitty` is written,
illustrated and live, closing T5. Three commits pushed to `master` and verified
on leafcruncher.com; T12 is drafted and tabled but uncommitted.

**Why** — The quotes were Anthony's ask. T5 was the cheapest open item in the
queue: both sources already existed, so the work was transcription into the
site's voice rather than research. T7 was explicitly skipped this sitting — a
slow connection, and it is all large downloads.

**The minify trap** — The stepped indentation in *"make visible / that which
without YOU / may never be seen"* is the quote, so it has to survive the build.
A `<p>` with `white-space: pre-wrap` does not: `hugo --minify` — what Netlify
runs — collapses leading whitespace in every element **except `<pre>`**. The
CSS-only version rendered correctly under `hugo server` and flattened in
production. The shortcode emits `<pre>` with `font: inherit`, and the published
HTML was checked byte-for-byte to confirm the indents are intact.

**Quote provenance** — *"that poetry drives you, not hardware"* is verbatim
from Burns' *"What I hope for you"* list, read to incoming ITP students; it was
corrected from two earlier guesses before shipping. The wording of *"make
visible…"* is **unverified** — no source found, and the Internet Archive was
down when checked. Flagged to Anthony; it ships as he supplied it.

**Both T5 source links had rotted** — `buoydontfloat.com` is offline (DNS
resolves, connections reset). Its Jekyll source is at `~/me/epylinkn`, and the
cryptokitty repo is cloned at `~/itp/electronic-rituals/cryptokitties-phrenology`,
which is where the full-size screenshots came from after the GitHub downloads
kept truncating.

**One fact corrected** — the stub dated the work `2017-12-01`. It is spring
2019: the proposal post is dated 2019-03-13 and the documentation screenshots
run 2019-04-24 → 2019-05-09. It was the final project for *electronic rituals*
at ITP. `role: "artist & engineer"` and the Jenna Xu collaboration came from
Anthony directly, so neither is a guess.

**One claim retracted** — the first TASKS.md note said `~/me/epylinkn` was the
only reachable copy of the old site. It is not; it is a checkout of
`epylinkn/epylinkn.github.io`. Corrected in `1f10a0b`. Only seven uncommitted
posts and some screenshots are genuinely local-only, and the checkout is **4
commits behind** its remote — pull before editing there.

**Verified** — `hugo --gc --minify` builds clean. Live on leafcruncher.com
after push: `/about/` serving both quotes with indentation intact;
`/laboratory/operation-criminal-cryptokitty/` at 200 with all three images at
matching byte sizes; card present on `/laboratory/`; entry present in
`/archives/` and `sitemap.xml`. Per the house rule, the deploy was confirmed
live rather than assumed.

**Caught in review** — the `criminal-kitty` hero referenced a `.webp` that did
not exist, so `image/hero` had silently fallen through to its no-srcset
fallback and would have 404'd in production. Converted and fixed before commit.

**Out of scope (next sitting)** — T12, visibility categories for the ~40 ITP
coursework posts, is written up and deliberately tabled: the buckets are
Anthony's call and need a walkthrough together. T7 (archive) remains skipped,
not dropped.

**Note** — this is the first entry; `CHANGELOG.md` is a new tracked file. No
`release.md` was drafted — this is a personal portfolio site with no team
audience, so that half of the skill does not apply.

**Key files**

- `CHANGELOG.md` (new — this file)
- `layouts/shortcodes/quote.html` (new — `quote` shortcode; `<pre>` per saying, optional `author` rendered as `<cite>`)
- `assets/scss/main.scss` (new `blockquote.quote` block — left rule, `font: inherit`, `pre-wrap`, faded attribution)
- `content/about/_index.md` (two `quote` calls, each attributed, so more can be added without restructuring)
- `content/laboratory/operation-criminal-cryptokitty/index.md` (written from both sources; date corrected to 2019-05-09; `role` and `collaborators` set)
- `content/laboratory/operation-criminal-cryptokitty/{criminal-kitty,mturk-task,jailed-kitties}.webp` (new — the kitty that started it, the Mechanical Turk HIT, the Chrome extension running live)
- `static/img/projects/criminal-cryptokitty.webp` (new — listing thumbnail)
- `TASKS.md` (T5 marked done with both rotted sources recorded; `~/me/epylinkn` surveyed; backup status corrected; T12 added as tabled — **uncommitted**)
