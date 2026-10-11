#!/bin/bash
#
# Resize source photos down to a web-sized WebP, preserving aspect ratio.
#
#   ./scripts/optimize-image.sh raw/0001.jpg
#   ./scripts/optimize-image.sh -o content/projects/foo raw/*.jpg
#   ./scripts/optimize-image.sh -w 1440 -q 78 raw/0001.jpg
#
# Output is named after the input with a .webp extension, so re-running this
# over a project's raw/ directory regenerates that project's bundle in place.
#
# Why this does not match the version that shipped until 2026-10:
#
#   -resize 3840x2160^ -gravity center -extent 3840x2160
#
# That `^` fills the box and `-extent` then crops to it, so every image came
# out 16:9 whatever it actually was — which silently centre-cropped the
# portrait photographs. It also forced thumbnails into a 400x400 square, and
# had no `>` flag, so a source smaller than the target was upscaled into a
# bigger file carrying no more detail.
#
# This version uses `-resize WxW>`, where the `>` means "only ever shrink".
# The box is square so it bounds the long edge whatever the orientation, and
# with no -extent nothing is cropped. An image already smaller than the target
# is copied at its own size rather than inflated.
#
# 1920 is the default because layouts/shortcodes/image/hero.html generates a
# srcset at 480/960/1440/1920 and never upscales: the source file is the
# ceiling on every width it can offer. A 900px column at 2x wants ~1800px, so
# anything beyond 1920 is bytes no layout on this site will ask for.

set -euo pipefail

max_width=1920
quality=82
outdir=""

usage() {
  echo "usage: $0 [-w max_width] [-q quality] [-o outdir] <image> [image...]" >&2
  exit 1
}

while getopts ":w:q:o:h" opt; do
  case "$opt" in
    w) max_width="$OPTARG" ;;
    q) quality="$OPTARG" ;;
    o) outdir="$OPTARG" ;;
    h) usage ;;
    \?) echo "unknown option: -$OPTARG" >&2; usage ;;
    :) echo "option -$OPTARG needs a value" >&2; usage ;;
  esac
done
shift $((OPTIND - 1))

[ "$#" -ge 1 ] || usage

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick not found. brew install imagemagick" >&2
  exit 1
fi

if [ -n "$outdir" ]; then
  mkdir -p "$outdir"
fi

for input in "$@"; do
  if [ ! -f "$input" ]; then
    echo "skipping, not a file: $input" >&2
    continue
  fi

  base="$(basename "${input%.*}")"
  dest_dir="${outdir:-$(dirname "$input")}"
  output="$dest_dir/$base.webp"

  # -auto-orient applies the EXIF rotation before -strip discards the tag,
  # so stripping metadata cannot leave an image lying on its side.
  magick "$input" \
    -auto-orient \
    -resize "${max_width}x${max_width}>" \
    -strip \
    -quality "$quality" \
    "$output"

  printf '%-24s %-12s -> %-24s %-12s %s\n' \
    "$(basename "$input")" \
    "$(magick identify -format '%wx%h' "$input")" \
    "$(basename "$output")" \
    "$(magick identify -format '%wx%h' "$output")" \
    "$(du -h "$output" | cut -f1 | tr -d ' ')"
done
