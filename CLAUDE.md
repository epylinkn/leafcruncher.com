# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site for leafcruncher.com, a personal portfolio website showcasing creative projects and laboratory experiments. The site uses the "whiteplain" theme and is structured around three main content sections: projects, laboratory, and about.

## Development Commands

Since Hugo is not installed in the current PATH, you'll need to install it first:
```bash
# Install Hugo (macOS)
brew install hugo

# Serve the site locally for development
hugo server

# Build the site for production
hugo
```

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

## Content Management

Each project/laboratory item should have its own directory with an `index.md` file containing frontmatter and content. The site structure follows Hugo's content organization principles with sections corresponding to the main navigation.

## Development Workflow

1. Create content in appropriate `/content/` subdirectory
2. Use the image optimization script for any images: `./scripts/optimize-image.sh input_image.jpg`
3. Test locally with `hugo server`
4. Build for production with `hugo`