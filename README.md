# BeautifulMensClub.com

Independent men’s lifestyle publication: **Look sharp. Live well.**

## Publication workflow

Daily editorial source lives in `scripts/daily-pages-YYYY-MM-DD.mjs`. Generated HTML, department pages, the searchable Library, homepage modules, sitemap and `publication-manifest.json` are committed with each batch.

```bash
node scripts/generate-expansion.mjs
node scripts/generate-expansion-two.mjs
node scripts/generate-daily-pages.mjs
node scripts/inject-affiliate-commerce.mjs .
node scripts/inject-visitor-beacon.mjs . beautiful-mens-club
node scripts/audit-site.mjs
```

The audit verifies unique metadata, canonical URLs, schema, local links, sitemap discovery, accessibility, analytics, visitor-beacon presence and approved affiliate markup before GitHub Pages deployment.
