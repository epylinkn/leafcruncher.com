#!/bin/bash

# Script to optimize square images while preserving aspect ratio
# Usage: ./optimize-square-image.sh input_image.jpg output_name

if [ ! -f "$1" ]; then
  echo "Input file does not exist."
  exit 1
fi

input_file="$1"
output_name="$2"

# Get original dimensions to confirm it's square
dimensions=$(magick identify -format "%wx%h" "$input_file")
width=$(echo $dimensions | cut -d'x' -f1)
height=$(echo $dimensions | cut -d'x' -f2)

if [ "$width" != "$height" ]; then
  echo "Warning: Input image is not square ($dimensions). Proceeding anyway..."
fi

echo "Processing $input_file (${dimensions}) -> $output_name"

# Create full-size optimized versions (max 2160x2160 for large squares)
target_size=2160
if [ "$width" -le "$target_size" ]; then
  # If original is smaller than target, keep original size
  target_size=$width
fi

# Full-size JPG (high quality)
magick "$input_file" -resize ${target_size}x${target_size} -quality 90 "${output_name}.jpg"

# Full-size WebP (high quality)
magick "$input_file" -resize ${target_size}x${target_size} -quality 85 "${output_name}.webp"

# Thumbnail JPG (400x400)
magick "$input_file" -resize 400x400 -quality 80 "${output_name}_thumb.jpg"

# Thumbnail WebP (400x400)
magick "$input_file" -resize 400x400 -quality 75 "${output_name}_thumb.webp"

echo "Created:"
echo "  ${output_name}.jpg (${target_size}x${target_size})"
echo "  ${output_name}.webp (${target_size}x${target_size})"
echo "  ${output_name}_thumb.jpg (400x400)"
echo "  ${output_name}_thumb.webp (400x400)"