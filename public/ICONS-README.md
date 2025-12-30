# PWA Icon Setup

To complete the PWA setup, you need to create PNG icon files from the SVG template.

## Quick Setup:

1. Open `icon-512.svg` in a browser or image editor
2. Export/Save as PNG files with these exact sizes:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

## Alternative - Online Tool:

Visit https://realfavicongenerator.net or https://www.pwabuilder.com/imageGenerator to generate all icon sizes automatically.

## Or use ImageMagick command line:

```bash
# Install ImageMagick first, then run:
magick icon-512.svg -resize 192x192 icon-192.png
magick icon-512.svg -resize 512x512 icon-512.png
```

The SVG template provided uses the app's theme color (#667eea) with a simple book icon design.
