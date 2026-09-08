# TASKS

Work queue for leafcruncher.com. Each task is scoped to be picked up independently by Claude Code.

Derived from a full audit of the live site vs. this repo (2026-08-27). The live site serves **7** works; this repo contains **15**; `README.md` names **6** more with no page at all.

**Ground rules**

- Never invent project facts — no venues, dates, collaborators, materials, or descriptions that aren't in this repo, in a linked source, or given by Anthony. A `TODO(anthony)` marker is always better than a plausible guess.
- Preserve voice. Body copy is deliberately lowercase and unpunctuated in places. Fix only the typos named explicitly below.
- `hugo server` must render cleanly and `hugo` must build before any task is called done.
- `.claude/` is gitignored — don't put durable notes there. This file and `CLAUDE.md` are tracked.
- **Never publish personal data found in source folders.** `~/Footage/last-dance/last-dance-cards/pii/` is segregated for a reason — nothing in it ships. `~/Footage/gloria/gloria-WAPs-hammertime.pdf` is not documentation: it's three Burning Man 2019 work-access passes issued to a named third party, carrying ticket IDs, confirmation numbers, barcodes and security codes. Do not copy it into the repo, the database, or any page. Faces and names in event photos need Anthony's sign-off before they go live.

---

## T0 — Make publishing a non-event

**Type:** infrastructure · **Do first** · **Size:** small

**Verified 2026-09-08.** The deploy is broken, and here is the proof:

- `content/projects/facing-the-fearbeast/` **is present on `origin/master`** on GitHub. The work was written, committed, *and pushed*.
- It is **not on the live site** — absent from `leafcruncher.com/projects/`, from `/archives/`, and from `sitemap.xml`.
- There is **no `.github/workflows/`** — not in the local checkout and not on `origin/master` (GitHub returns 404 for that path). No `netlify.toml`, `vercel.json`, `CNAME`, Makefile or deploy script either. `public/` is built locally and gitignored.

So pushing to GitHub does **not** publish this site, whatever it used to do. A finished page has been sitting on `master`, publicly, unpublished, for roughly a year. Writing was never the bottleneck — and neither was pushing.

**The host is Netlify** — project `astounding-paletas-999c32`, domain `leafcruncher.com`, "Deploys from GitHub with Hugo". Build settings live in the Netlify UI; there is no `netlify.toml` in the repo, which is why nothing about the deploy is visible from here.

**The last production deploy is `master@6c1e787` — "add claude config", Sep 14 2025, Published.**

That is the whole story. `.git/COMMIT_EDITMSG` still holds *"rough AI draft: fearbeast"*, meaning the fearbeast commit was authored **after** `6c1e787`. It reached GitHub. Netlify has not shipped anything since. The pipeline didn't break loudly — it just stopped, and there was no reason to notice.

**Do:**

1. Open the Netlify **Deploys** tab and find what happened after `6c1e787`. Expect one of: a failed build, auto-publish switched off, builds stopped/paused, or exhausted build minutes. Read the build log rather than guessing.
2. Retry the deploy at current `master`. If it fails, the two likeliest causes are both known:
   - **`.gitmodules` is 0 bytes** while `.git/config` does define the `whiteplain` submodule. A clean CI clone gets no theme and the build dies. Repair it with `git submodule add https://github.com/taikii/whiteplain.git themes/whiteplain` (or hand-write the `.gitmodules` entry) and commit.
   - **Hugo version drift.** The site was built with 0.85.0. Netlify's default is far newer and will break these templates.
3. Commit a `netlify.toml` pinning both, so the build is reproducible and reviewable in-repo:
   ```toml
   [build]
     command = "hugo --gc --minify"
     publish = "public"
   [build.environment]
     HUGO_VERSION = "0.85.0"
   ```
4. Netlify also warns the project is on **Node.js 16** — worth bumping while you're in there, though Hugo doesn't need it.
5. Replace "Build for production with `hugo`" in `CLAUDE.md` with the real path: push to `master` → Netlify builds → live.

**Done when:** a push to `master` reaches leafcruncher.com, and `facing-the-fearbeast` is live as proof.

---

## T1 — Render project metadata from frontmatter

**Type:** consistency · **Blocks:** T3 · **Size:** medium

Every project hand-types its metadata into the body:

```markdown
**location**: [echigo-tsumari art triennale](...), 2021\
**open**: jul 31, 2022\
**close**: nov 13, 2022
```

Meanwhile the frontmatter already carries `location`, `venue`, `event`, and `link` — and **no template renders any of them**. `themes/whiteplain/layouts/_default/single.html` outputs date, categories, and tags only. The result: `light arcade` has `location: brooklyn, new york` in frontmatter and shows no location at all on the page, while `at the bottom of the swimming pool` shows one because it was typed by hand.

**Do:**

1. Add `layouts/partials/project-meta.html` rendering, when present: `location`, `venue`, `event`, `opened`, `closed`, and `link` (as a labelled outbound link).
2. Override `layouts/_default/single.html` (do not edit the theme submodule — `themes/whiteplain` is a git submodule pointing at `taikii/whiteplain`) and call the partial after `article-meta`.
3. Normalize frontmatter across all 15 `content/**/index.md` to this schema:

   ```yaml
   title, date, categories, tags, location, venue, event, link,
   opened, closed, role, authorship, lead_artist,
   homelayout, homeimage, homedescription, draft
   ```

   `opened`/`closed` are new — migrate them from the hand-typed body lines. `role`, `authorship` and `lead_artist` are new — see T8, and set them in the same pass.
4. Delete the now-duplicated hand-typed metadata lines from every body.

**Also fix while in here (verified bugs, not judgment calls):**

- `content/projects/cloud-bathroom/index.md` — `link:` points at the Echigo-Tsumari **swimming pool** artwork URL. Wrong project; it's a copy-paste from `at-the-bottom-of-the-swimming-pool`. Remove it, or replace with a Luxury Escapism URL if Anthony supplies one.
- `cloud bathroom` body says `location: luxury escapism: VR spa, **2021**` but it opened **2019-10-15**.
- `at the bottom of the swimming pool` body says `echigo-tsumari art triennale, **2021**` but ran **2022-07-31 → 2022-11-13**. The triennale was postponed; keep the real run dates and drop the stray year.
- `at the bottom of the swimming pool` frontmatter has the official artwork URL (`echigo-tsumari.jp/en/art/artwork/at-the-bottom-of-the-swimming-pool/`) that never reaches the page. T1 fixes this by rendering `link`.

**Done when:** every project page shows its metadata from frontmatter, no body contains a hand-typed `**location**:` block, and the three date/link bugs above are gone.

---

## T2 — Copy consistency pass

**Type:** consistency · **Size:** small

Fix only these. Do not otherwise regularize casing or punctuation.

- `content/projects/light-arcade/index.md` — "the light **aracde**" → "arcade"
- `content/projects/portal/index.md` — alt text "portal **builid**" → "build"
- `content/projects/in-dreams/index.md` — "i was never really excelled at skateboarding" → "i never really excelled at skateboarding"
- `content/projects/search-divides-us/index.md` — the researcher is spelled **mcilwain** in the research section and **mcllwain** in the background section. Correct spelling: **McIlwain**. Also in that same sentence, `mcllwainthe` has two words run together — split it.
- `content/projects/search-divides-us/index.md` — the Atlantic article "the internet may be segregated as a city" is named but not linked. Search for the URL and link it; if not confidently found, leave a `TODO(anthony)`.
- `content/about/_index.md` — "artist & engineer living in **oakland**" is out of date. Ask Anthony for the replacement; do not guess.

**Done when:** the five text fixes are in and the about-page line is either corrected or carries a TODO.

---

## T3 — Ship Facing the Fearbeast

**Type:** documentation · **Blocked by:** T1, T8 · **Size:** small

Set `authorship: supporting`, `lead_artist: Tigre Mashaal-Lively`, and lift the existing `**my role**:` line into the `role` field. This page is the reference implementation for T8 — once its credit renders from frontmatter like everything else, there's nothing left holding it back.

`content/projects/facing-the-fearbeast/index.md` is written, fully credited, and `draft: false` — and has never appeared on the live site. Last commit touching it: *"rough AI draft: fearbeast"*. The site hasn't been rebuilt since ~July 2022.

It's the best-documented page in the repo: per-image photo credits, a named lead artist (Tigre Mashaal-Lively), and an explicit role statement. Nothing else has all three.

**Do:**

1. It has no `homeimage` / `homelayout` / `homedescription`, so it will render on `/projects/` as a bare title with no thumbnail. Generate `static/img/projects/facing-the-fearbeast.webp` via `scripts/optimize-square-image.sh` from one of the ten source images and add the three params. Match the pattern used by `portal` and `light-arcade`.
2. Confirm the piece belongs in `projects` and decide whether it takes the `joylabo` category — it currently has none, and it's a collaboration with an outside lead artist, so probably not. Confirm with Anthony.
3. Build and deploy.

**Done when:** the page is live and appears correctly in `/projects/`, `/archives/`, and the RSS feed.

---

## T8 — Role and authorship: make the site able to say what Anthony did

**Type:** consistency · **Pairs with:** T1 · **Unblocks:** T3, T4 · **Size:** medium

The reason `hubot`, `prismatic light` and `facing the fearbeast` have sat unpublished is not that they're unfinished — it's that **the site has no way to state a role.** Every page implicitly claims full authorship, so publishing a supporting-role work would over-claim, and the accurate version isn't currently sayable.

`content/projects/facing-the-fearbeast/index.md` already solves this, alone in the repo:

```markdown
**artist**: [Tigre Mashaal-Lively](...)
**my role**: interactive systems design, lighting design, installation & programming
```

Make that the site-wide convention rather than a one-off.

**Do:**

1. Add to the frontmatter schema:
   - `role` — free text, **on every work**, solo ones included (`artist`, `artist & engineer`, `technical PM & hardware engineering`). Universal, so stating a supporting role reads as precision, not apology.
   - `authorship` — one of `mine` · `collective` · `supporting`
   - `lead_artist` — name (+ optional link) where someone else led
2. Render `role` and `lead_artist` in the T1 metadata partial, on every page.
3. Group `/projects/` into two visibly separated tiers in `layouts/_default/list.html` — `mine` + `collective` above, `supporting` below under its own heading. One section, two headed groups: do **not** create a `/collaborations/` section (`/laboratory/` already shows how a one-entry section reads).
4. Backfill `authorship` across all 15:

   | authorship | works |
   |---|---|
   | `mine` | IN DREAMS · COFFEETHEQUE · KNOB · production of the other · human car wash · the last dance |
   | `mine` (co-authored, 4-person team) | search divides us |
   | `collective` (joylabo) | light arcade · cloud bathroom · PORTAL · at the bottom of the swimming pool |
   | `supporting` | facing the fearbeast · hubot |
   | **ask Anthony** | prismatic light — his words: *"everything minus the creative design, so more a contractor. though we could say it's mine too."* Default to `supporting` until he decides. |

**Done when:** every work declares a role, the listing shows two labelled tiers, and no page's credit overstates what Anthony did.

---

## T4 — Write hubot and prismatic light

**Type:** documentation · **Blocked by:** T8 · **Size:** large · **Needs Anthony**

Roles are settled (see T8) — `hubot`: technical PM & hardware engineer. `prismatic light`: everything but creative design. Both `authorship: supporting` pending Anthony's call on prismatic light. The credit question is no longer a reason to leave these unwritten.

`content/projects/hubot/index.md` and `content/projects/prismatic-light/index.md` are both dated 2022-11-10, both located at GitHub Universe Conference 2022, and **both contain a verbatim copy of the `search divides us` body** — its research section on Dr. McIlwain, its Arduino/p5.js stack, its four-person team, and its Vimeo ID `313934146`. Two folders were duplicated and never filled in. They still carry `<!-- TODO -->`.

These are real works that were shown at GitHub Universe 2022. Source repos are likely under **github.com/epylinkn** (the git remote here is `git@github.com:epylinkn/leafcruncher.com.git`) and may also exist locally on this machine.

**Do:**

1. Locate both projects — check GitHub under `epylinkn`, then search local dev directories (`~/me`, `~/opensource`, `~/CascadeProjects`, `~/Sites`, `~/go`).
2. **Delete the copied `search divides us` body from both files first**, so there's no chance of it shipping. Replace with a stub carrying only the real frontmatter and a `TODO(anthony)`.
3. Write each page from the actual repo: what it is, what it did at GitHub Universe, the stack, any collaborators. Follow the `search divides us` page structure — it's the house template for a documented project.
4. Both need media. Neither has a single image. Find screenshots, recordings, or conference photos before publishing.
5. Keep `draft: true` until Anthony confirms the content is accurate.

**Done when:** neither file contains any `search divides us` text, both describe their real project, and both have at least one image.

---

## T5 — Import operation: criminal cryptokitty

**Type:** documentation · **Size:** small

`content/laboratory/operation-criminal-cryptokitty/index.md` is a two-line TODO pointing at documentation that **already exists**:

- `https://github.com/epylinkn/operation-criminal-kitty/blob/master/DOCUMENTATION.md`
- `https://www.buoydontfloat.com/operation-criminal-cryptokitty/`

This is the cheapest win in the queue. Pull from those two sources, write the page in the site's voice, keep the `machine learning` tag (it's the only work carrying it), add media if either source has any.

Note `buoydontfloat.com` — an earlier site of Anthony's. Worth asking whether more of the 2014–2018 back catalogue lives there.

**Done when:** the page stands on its own without the reader following either link.

---

## T6 — Triage the remaining draft stubs

**Type:** documentation · **Size:** medium · **Needs Anthony**

Four stubs, each `draft: true`, each needing a publish-or-delete decision. Nothing here should ship half-written — but nothing should sit untouched either.

| file | has | needs |
|---|---|---|
| `human-car-wash` | a Vimeo embed (`371313584`), **zero words** | a description. The video is unreferenced anywhere else on the site. |
| `the-last-dance` | "TODO: add the slide deck presentation?" | **media is now located — see below.** Still needs the deck: check `~/itp/itp-the-last-dance`, `~/itp/itp-show-all-things-button` |
| `knob` | "just a big knobby knob." | context; check `~/itp/knob-server-client` |
| `production-of-the-other` | two lines (Tribeca Film Institute) | everything |

`the last dance` is no longer media-starved. `~/Footage/last-dance/` holds ~30 DSLR frames (`1E2A*`, `8W0B*`), three DJI drone clips, `crowds.MP4`, a set of HEICs, an edited Premiere project (`Untitled.prproj`) with cut sequences `dancing-anthony.mp4` and `dancing-campers-2.mp4`, a full music-originals folder, and `last-dance-cards/` — roughly 38 scanned participant cards. `selected/` (`lips.jpg`, `team.jpg`) is Anthony's own pick — start there. **`last-dance-cards/pii/` is off-limits.**

For each: gather what exists locally, draft a minimum viable page (what it was, where, when, one image or video), and either flip `draft: false` or record in this file why it stays a draft.

`README.md` also names four works with no page at all: **Collective Obsolescence** (Brooklyn — see `~/itp/collective-obsolescence`) · **100 Years of Joyrats** (see `~/itp/joyrats.com`, `~/me/joyrats`) · **Joycade** (Arcade, NY — possibly the second showing of `light arcade`) · **Pixel Party**. Create stub `index.md` files with `draft: true` and real frontmatter so they stop living in a README list.

**Settled — do not reopen:** *Gloria the Firefly* and *Mutant Vehicle at Burning Man: Metamorphoses* are **one work, not two** (Burning Man 2019, Metamorphoses). Anthony has decided **not to document it**. No page, no stub, no database entry. Its only local artifact is the third-party PII PDF in `~/Footage/gloria/`, which must not be used for anything — see the ground rules.

**Done when:** every stub has a decision recorded and the six README items exist as draft pages.

---

## T7 — Archive the material that exists in only one place

**Type:** archive · **Size:** small

**`raw/` is gitignored.** The full-resolution originals exist on this machine and nowhere else:

- `content/projects/at-the-bottom-of-the-swimming-pool/raw/` — 15 JPGs, 7.6–15.7 MB each, **~171 MB**
- `raw/facing-the-fearbeast/` — 10 source JPGs
- `static/img/projects/raw/coffeetheque.png` (14.3 MB), `in-dreams.jpg` (3.2 MB)
- `raw/` loose files — **now identified**: `diary-2.jpg`, `drinks.JPG`, `lips.jpg` and the four `2019_10_08_10_2*.jpg` all originate in `~/Footage/last-dance/` (the last three are scanned participant cards). They belong with `the last dance`; move them into that project folder when T6 gives it a real page.

The site serves ~200 KB WebP derivatives. If this disk goes, the originals go.

**Five Vimeo videos have no local copy** and four works exist on the site *only* as embeds:

`313912251` IN DREAMS · `313934146` search divides us · `370734458` cloud bathroom · `468270333` COFFEETHEQUE · `371313584` human car wash *(draft-only — referenced nowhere else)*

**Do:** pull all five with `yt-dlp` at best available quality into a location outside this repo, and get `raw/` onto a second disk or backup target. Do not commit either into git — keep `raw/` ignored.

**Done when:** every video has a local file and `raw/` exists in two places.

---

## Source material located outside the repo

`~/Footage/` subfolders, connected 2026-08-27. None of this is in git.

| folder | contents | maps to |
|---|---|---|
| `last-dance/` | ~30 DSLR frames, 3 DJI drone clips, `crowds.MP4`, HEICs, Premiere project + two cut sequences, music originals, ~38 scanned cards, `selected/` | T6 — `the last dance` |
| `facing-the-fearbeast/` | 10 JPGs — **byte-identical to `raw/facing-the-fearbeast/` already in the repo**. Nothing new; no action. | T3 |
| `cloud-bathroom/` | `vrspa-grid.ai`, `vrspa-occupied.ai` — Illustrator design source for the spa install | `cloud bathroom` — first process material it has |
| `100TVs/` | `one-mistake-at-a-time.png` — a Unity 2018.4.12f1 screenshot, project `100tvs`, scene `BombayBeach.unity`. Low-poly Bombay Beach previz with framed screens on posts spelling **"… one mistake at a time"** in Burma-Shave sequence. Dated Nov 2019, ~3 months before PORTAL opened. | `PORTAL` — the only previz for it, and the only evidence of that phrase. Ask Anthony whether it's a companion title to *there is still time*. |
| `gloria/` | **one PDF of third-party Burning Man work-access passes. Not documentation. Do not use.** See ground rules. Its work has been dropped from the queue — this folder has no remaining purpose and is a good candidate for deletion. | — (dropped) |
| `arcade/` | empty | `light arcade` / Joycade still have no source material |

`~/Footage/office-hours.md` (May 2019) is thesis writing, not project documentation — it develops a "digital heartbeat" concept (a timestamped check-in proving you're alive; a family portrait that dims over a year without one) and ends with notes on play as thesis method. It is the only prose found so far touching *meditations on playful interventions*. See the structural note at the end of this file, and `~/itp/thesis-presence`.

## Unused files worth a decision

- `content/projects/portal/portal-render.jpg` — an original rendering, unused by its page. The swimming pool page shows *its* render under an "original rendering" caption; portal doesn't.
- `content/projects/cloud-bathroom/luxury-escapism.jpg` (741 KB) — in the repo, referenced by nothing.

---

## Structural notes

- `/laboratory/` holds one published entry (`coffeetheque`) and one draft. Either grow it or fold it into projects.
- The `series` taxonomy is configured in `config.toml` and completely unused — `/series/` builds as an empty page.
- `COFFEETHEQUE` is absent from the main RSS feed (`/index.xml`), which only carries `projects`.
- No tag distinguishes solo work from joylabo work; the `joylabo` category does it implicitly. `search divides us` and `IN DREAMS` have no category at all.
- The ITP thesis — *"meditations on playful interventions (like leaf crunching!)"* — is named once, on the COFFEETHEQUE page, and documented nowhere. It's the origin of the site's name. Candidate for its own page. See `~/itp/thesis-2020-info`, `~/itp/thesis-presence`, `~/itp/thesis-soundboard`.
