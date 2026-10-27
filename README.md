# Muraba Map

An interactive map of the Slovene–Hungarian border region with four places: Prosenjakovci, Szentgotthárd, Zalaszentlászló and Nagykanizsa. Click or tap a pin to see information about that place. The text is available in Hungarian, Slovene and English.

Live site: https://bensy79.github.io/muraba-map/

## Editing the content

All content lives in `src/data/locations.json`. For each place you can set:

- `name` and `text`, with one value per language (`hu`, `sl`, `en`). Put a blank line (`\n\n`) in `text` to start a new paragraph.
- `image`: a filename you've put in `public/images/` (for example `"szentgotthard.jpg"`). Leave it as `""` for no photo.
- `links`: a list such as `[{ "url": "https://…", "label": { "hu": "…", "sl": "…", "en": "…" } }]`.
- `lat` / `lng`: the pin's position.

Every push to `main` rebuilds and publishes the site automatically (see the **Actions** tab on GitHub).

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173/muraba-map/
npm run build    # type-check + production build into dist/
```

## Embedding in WordPress

Add a **Custom HTML** block to the page and paste:

```html
<iframe src="https://bensy79.github.io/muraba-map/?lang=hu"
        style="width:100%;height:70vh;min-height:420px;border:0"
        loading="lazy" title="Muraba map"></iframe>
```

`?lang=hu|sl|en` sets the starting language. Without it, the map uses the visitor's browser language.

## One-time GitHub setup

In the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. On a free account, the repository must be public for this to work.
