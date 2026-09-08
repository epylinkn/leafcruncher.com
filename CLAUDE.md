# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site for leafcruncher.com, a personal portfolio website showcasing creative projects and laboratory experiments. The site uses the "whiteplain" theme and is structured around three main content sections: projects, laboratory, and about.

## Development Commands

```bash
# Install Hugo (macOS) — must be the extended build
brew install hugo

# Serve the site locally for development
hugo server

# Build the site locally, the same way Netlify does
hugo --gc --minify
```

**Hugo must be extended and >= 0.128.0.** `layouts/partials/head_custom.html`
compiles `assets/scss/main.scss` with `css.Sass`, which requires the extended
build and did not exist before 0.128.0. `netlify.toml` pins the CI version;
keep it and your local version in step.

Building locally does **not** publish. See Deploying below.

## Architecture

### Content Structure
- `/content/projects/` - Portfolio projects with individual index.md files
- `/content/laboratory/` - Experimental/research content
- `/content/about/` - About page content
- `/content/archives/` - Archive listings
- `/content/posts/` - Blog posts (if used)

### Theme and Layouts
- Uses the "whiteplain" theme located in `/themes/whiteplain/`
- Custom layouts in `/layouts/` override theme defaults
- Theme supports simple blog functionality with clean typography

### Configuration
- Main site config in `config.toml`
- Uses Noto Sans Mono and Fredoka One fonts from Google Fonts
- Menu structure defined for header (projects, laboratory, about) and footer (archives)

### Static Assets
- `/static/` - Static files served directly
- `/assets/` - Source assets for Hugo processing
- `/raw/` - Raw/source materials (gitignored)
- `/resources/` - Generated resources (gitignored)

### Image Optimization
- `scripts/optimize-image.sh` - ImageMagick script for optimizing images
- Creates both JPG and WebP formats in full-size (3840x2160) and thumbnail (400x400) versions
- Requires ImageMagick installed

## Work Queue

`TASKS.md` holds the current work queue — consistency fixes, unfinished project pages, and archive gaps, each scoped to be picked up independently. Read it before starting content work. `.claude/` is gitignored, so durable notes belong in `TASKS.md` or this file, not there.

## Content Management

Each project/laboratory item should have its own directory with an `index.md` file containing frontmatter and content. The site structure follows Hugo's content organization principles with sections corresponding to the main navigation.

### Frontmatter schema

```yaml
title, date, categories, tags, location, venue, event, link,
opened, closed, role, authorship, lead_artist, lead_artist_link,
collaborators, homelayout, homeimage, homedescription, draft
```

`role` is free text stating what Anthony did — the site says it rather than implying full authorship. It is **not yet set on every work**: only where a source exists (`facing-the-fearbeast`, `hubot`, `prismatic-light`). The rest are blank pending Anthony, because a role is a claim about what he did and must not be guessed.

`authorship` is one of `mine` · `collective` · `commission` · `collaboration`. Four values, two displayed tiers on `/projects/`:

| tier heading | authorship values |
|---|---|
| works | `mine`, `collective` |
| commissions & collaborations | `commission`, `collaboration` |

A work with no `authorship` falls into **works**, so nothing silently disappears from the listing.

`lead_artist` names whoever led where that wasn't Anthony, with an optional `lead_artist_link`. Its rendered label follows `authorship`: **artist** on a `collaboration` (someone else's work that Anthony contributed to), **creative** on a `commission` (someone else directed, Anthony built). `collaborators` is a list, for a work that is Anthony's but not his alone — co-authors, not a lead — and renders as "with".

`homeimage` / `homelayout` / `homedescription` drive the `/projects/` listing (see `layouts/_default/list.html`); a page without them renders as a bare title with no thumbnail.

`layouts/partials/project-meta.html` renders `role`, `lead_artist`, `venue`, `event`, `location`, `opened`, `closed` and `link` on every work page, called from `layouts/_default/single.html`. Metadata belongs in frontmatter — do **not** hand-type a `**location**:` block into a body; that is what drifted out of sync before.

### House rules for project pages

- Body copy is deliberately lowercase. Preserve the voice; don't regularize it.
- Never invent project facts — venues, dates, collaborators, materials. Use `TODO(anthony)` instead of a plausible guess.
- `content/projects/search-divides-us/index.md` is the reference structure for a fully documented project; `content/projects/facing-the-fearbeast/index.md` is the reference for crediting photographers and stating your role on a collaboration.
- `themes/whiteplain` is vendored (`taikii/whiteplain`, copied in as ordinary tracked files, not a submodule) — override templates in `/layouts/`, don't edit the theme.

## Development Workflow

1. Create content in appropriate `/content/` subdirectory
2. Use the image optimization script for any images: `./scripts/optimize-image.sh input_image.jpg`
3. Test locally with `hugo server`
4. Push to `master` — publishing is step 4, not a separate ritual

## Deploying

Push to `master` → Netlify builds → live at leafcruncher.com. There is no
manual build or upload step, and `public/` is gitignored; never commit it.

The host is Netlify, project `astounding-paletas-999c32`. Build settings live
in `netlify.toml` (build command, publish dir, `HUGO_VERSION`) and
`.node-version` — change them there, in a commit, rather than in the Netlify
UI, so the deploy stays reviewable in-repo.

The build itself uses no Node (there is no `package.json`, and no Netlify
functions); `.node-version` exists to keep the project off end-of-life Node
and to pin nodenv locally to the same version.

**A failed Netlify build is silent.** Netlify keeps serving the last good
deploy and nothing about the site looks wrong. That is exactly how a finished
page sat unpublished on `master` for a year: the last successful deploy was
`6c1e787` (Sep 14 2025), and the very next commit changed
`resources.ToCSS` → `css.Sass`, which the older Hugo on Netlify did not have.
After pushing, confirm the change is actually live — don't assume.