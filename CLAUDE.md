# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Muraba Map is a static, mobile-friendly interactive map (Vite + TypeScript + Leaflet + OpenStreetMap tiles) of four places on the Slovene–Hungarian border. Its UI and content are in Hungarian, Slovene and English. GitHub Actions deploys it to GitHub Pages (`https://bensy79.github.io/muraba-map/`), and it is embedded in the owner's self-hosted WordPress site through an `<iframe>`. There is no backend and there are no tests.

## Commands

```bash
npm install
npm run dev      # dev server at /muraba-map/
npm run build    # tsc type-check, then vite build → dist/
npm run preview  # serve the built dist/
```

`git` needs `safe.directory` for this path, which is already configured globally, because the WSL mount is owned by root.

## Architecture

- `src/data/locations.json` is the only content source and is edited by the owner. Every place has `name`/`text` as `{hu, sl, en}` objects, plus optional `images` (filenames in `public/images/`, shown as a swipeable gallery) and `links`. `src/locations.ts` gives it a `Place` type.
- `src/i18n.ts` holds the UI strings and language detection. The order is `?lang=` param (used by the WordPress iframe), then `localStorage`, then browser language, then `en`. Any new UI text must be added to `UI` in all three languages.
- `src/map.ts` sets up Leaflet with `L.divIcon` pins, because the default marker images break under Vite. On touch devices `dragging` starts disabled so the parent WordPress page can still scroll. `main.ts` turns it on after the user taps the "tap to use the map" hint.
- `src/panel.ts` is the info panel. CSS makes it a side panel on desktop and a bottom sheet at ≤ 640 px. Content is built with DOM APIs (`textContent`), not `innerHTML`.
- `vite.config.ts` sets `base: '/muraba-map/'`. Asset URLs must use `import.meta.env.BASE_URL`.

## Dev container

The container comes from the `dotnet-mssql` template, so .NET 8 and SQL Server 2019 (`localhost,1433`, `sa` / `P@ssw0rd`) are available, but this app doesn't use them.
