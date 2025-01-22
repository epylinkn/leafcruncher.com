#!/bin/bash

# Check if the input image file exists
if [ ! -f "$1" ]; then
  echo "Input file does not exist."
  exit 1
fi

# Input file
input_file="$1"

# Maximum file size in bytes (10MB)
max_size=10000000

# JPG quality level for thumbnail images
thumbnail_quality=60

# Resize and optimize the full-sized image in JPG format
full_size_jpg="optimized_full.jpg"
convert "$input_file" -resize 3840x2160^ -gravity center -extent 3840x2160 -define jpeg:extent="$max_size" "$full_size_jpg"

# Resize and optimize the full-sized image in WebP format
full_size_webp="optimized_full.webp"
convert "$input_file" -resize 3840x2160^ -gravity center -extent 3840x2160 -define webp:extent="$max_size" "$full_size_webp"

# Resize and optimize the thumbnail image in JPG format
thumbnail_jpg="optimized_thumbnail.jpg"
convert "$input_file" -resize 400x400^ -gravity center -extent 400x400 -quality "$thumbnail_quality" "$thumbnail_jpg"

# Resize and optimize the thumbnail image in WebP format
thumbnail_webp="optimized_thumbnail.webp"
convert "$input_file" -resize 400x400^ -gravity center -extent 400x400 -quality "$thumbnail_quality" "$thumbnail_webp"

echo "Optimized full-sized JPG image saved as $full_size_jpg"
echo "Optimized full-sized WebP image saved as $full_size_webp"
echo "Optimized thumbnail JPG image saved as $thumbnail_jpg"
echo "Optimized thumbnail WebP image saved as $thumbnail_webp"

