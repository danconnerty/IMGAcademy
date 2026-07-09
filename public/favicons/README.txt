NTangible — Favicons
====================

Drop these files at your site root and add to <head>:

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

Files
-----
  favicon.svg           Primary. Vector, crisp at any size. Ink tile + white circled-N.
  favicon-16.png        Browser tab (fallback)
  favicon-32.png        Browser tab / retina (fallback)
  favicon-48.png        Windows / misc (fallback)
  apple-touch-icon.png  180x180, iOS home screen (full-bleed; iOS masks corners)
  favicon-192.png       Android / PWA
  favicon-512.png       Android / PWA splash
  site.webmanifest      References the 192/512 icons

Notes
-----
- Modern browsers use favicon.svg and render it razor-sharp. The PNGs are
  fallbacks for older browsers.
- Optional: generate a favicon.ico (16/32/48) from these PNGs with any favicon
  tool for legacy support.
- Mark: the circled-N on ink (#0E0E0E). Source: white_icon_transparent_background.svg
