# TasteTrust

A verified restaurant curation web app — every place personally visited and vetted by Gi-yeon. Currently covers Singapore, Johor Bahru and LA.

## Stack

- React 18 + Vite
- Tailwind CSS via CDN
- Lucide-React icons
- Recharts for the analytics chart

## Local development

    npm install
    npm run dev

Vite serves on http://localhost:5173.

## Deploy

This repo deploys to Vercel automatically on every push to the main branch. Build command: npm run build. Output directory: dist.

## Editing data

All restaurant data lives in src/TasteTrust.jsx at the top of the file inside the PLACES array. Each entry is built with the place() helper, which fills in defaults for any field you omit.

## Current seed data (2026-05-03)

106 places across 6 curated Google Maps lists:

- 한식 (Korean) — 17 places
- Restaurant — 20 of 48 visible
- Cafe — 20 of 43 visible
- Singapore — 17 of 44 (3 non-restaurants skipped)
- 일식 (Japanese) — 19 of 34 (1 non-restaurant skipped)
- Chinese — 13 of 14 (1 dup skipped)

Google Maps shared lists only render 20 places at a time in the side panel, so the rest of the larger lists need to be loaded manually.
