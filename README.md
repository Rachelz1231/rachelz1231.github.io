# Rachel Zeng — Personal Website

Next.js 14 (App Router) + Tailwind CSS + shadcn/ui.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Dynamic Publications

`/publications` fetches from the ORCID public API at build time and revalidates daily (ISR). To enable live fetching, set:

```
ORCID_ID=0000-0000-0000-0000
```

Your ORCID iD is the 16-digit identifier on your ORCID profile (https://orcid.org/). The page falls back to the curated list in `lib/publications.js` when ORCID is unavailable or no ID is configured. Editorial notes (e.g. "Best Paper Honorable Mention") and missing fields are merged from the fallback into matching ORCID entries by title.

## Deployment

Deploy to **Vercel**: import this repo, set the `ORCID_ID` env var, and point `rachelz.ca` at it via DNS. The previous GitHub Pages CNAME (`master` branch) can stay as-is until DNS cuts over.

## Branches

- `nextjs` — current source (this branch)
- `react` — old Create React App source (kept for reference)
- `master` — old static build output from CRA + GitHub Pages (kept for current live site)
