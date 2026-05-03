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

`/publications` fetches from the Semantic Scholar API at build time and revalidates daily (ISR). To enable live fetching, set:

```
SEMANTIC_SCHOLAR_AUTHOR_ID=<your-author-id>
```

Find your author ID from the URL on https://www.semanticscholar.org/author/... — it's the number at the end. Without the env var, `/publications` falls back to the curated list in `lib/publications.js`. Notes (e.g. "Best Paper Honorable Mention") are merged into matching API entries by title.

## Deployment

Deploy to **Vercel**: import this repo, set the `SEMANTIC_SCHOLAR_AUTHOR_ID` env var, and point `rachelz.ca` at it via DNS. The previous GitHub Pages CNAME (`master` branch) can stay as-is until DNS cuts over.

## Branches

- `nextjs` — current source (this branch)
- `react` — old Create React App source (kept for reference)
- `master` — old static build output from CRA + GitHub Pages (kept for current live site)
