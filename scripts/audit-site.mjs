import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = process.cwd();
const siteUrl = "https://beautifulmensclub.com";
const analyticsToken = "ebb9c435ac06430c9e3f3e6e03e7178b";
const visitorBeacon = "https://lokwod-visitor-beacon.syracuseappraiser.workers.dev/beacon.js";
const failures = [];
const batch = JSON.parse(readFileSync(join(root, "publication-manifest.json"), "utf8"));

function fail(message) { failures.push(message); }
function filesUnder(directory) {
  const results = [];
  for (const name of readdirSync(directory)) {
    if ([".git", "node_modules", ".wrangler"].includes(name)) continue;
    const path = join(directory, name);
    const stat = statSync(path);
    if (stat.isDirectory()) results.push(...filesUnder(path));
    else if (name.endsWith(".html")) results.push(path);
  }
  return results;
}
function match(html, pattern) { return pattern.exec(html)?.[1]?.trim() || ""; }
function text(html) { return html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim(); }
function count(html, needle) { return html.split(needle).length - 1; }

if (!Array.isArray(batch.pages) || batch.pages.length !== 3) fail(`Publication manifest must contain exactly 3 pages; found ${batch.pages?.length ?? 0}.`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(batch.generatedAt || "")) fail(`Publication manifest must contain an ISO generatedAt date; found ${batch.generatedAt}.`);
if (!Number.isInteger(batch.imageQa?.editorialImages) || !Number.isInteger(batch.imageQa?.affiliateProductImages) || batch.imageQa.editorialImages < 0 || batch.imageQa.affiliateProductImages < 0) fail("Publication manifest image QA counts must be non-negative integers.");
const batchSlugs = new Set(batch.pages.map((page) => page.slug));
if (batchSlugs.size !== 3) fail("Publication manifest contains duplicate slugs.");


const htmlFiles = filesUnder(root);
if (htmlFiles.length < batch.pages.length) fail(`Published HTML inventory is smaller than the current batch: ${htmlFiles.length} files for ${batch.pages.length} pages.`);
const titles = new Map();
const canonicals = new Map();
for (const path of htmlFiles) {
  const rel = relative(root, path).replaceAll("\\", "/");
  const html = readFileSync(path, "utf8");
  if (count(html, analyticsToken) !== 1 || count(html, "static.cloudflareinsights.com/beacon.min.js") !== 1) fail(`Cloudflare analytics missing or duplicated in ${rel}.`);
  if (count(html, visitorBeacon) !== 1 || count(html, 'data-site="beautiful-mens-club"') !== 1) fail(`Visitor beacon missing or duplicated in ${rel}.`);
  const title = match(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonical = match(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i) || match(html, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  if (title) {
    if (titles.has(title)) fail(`Duplicate title in ${rel} and ${titles.get(title)}: ${title}`);
    titles.set(title, rel);
  }
  if (canonical) {
    if (canonicals.has(canonical)) fail(`Duplicate canonical in ${rel} and ${canonicals.get(canonical)}: ${canonical}`);
    canonicals.set(canonical, rel);
  }
  for (const image of html.matchAll(/<img\b[^>]*>/gi)) if (!/\balt=["'][^"']*["']/i.test(image[0])) fail(`Image without alt text in ${rel}.`);
  for (const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(script[1]); } catch (error) { fail(`Invalid JSON-LD in ${rel}: ${error.message}`); }
  }
  for (const link of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = link[1];
    if (/^(?:https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    const clean = href.split(/[?#]/)[0];
    if (!clean) continue;
    const target = resolve(dirname(path), clean);
    if (!existsSync(target)) fail(`Broken local link in ${rel}: ${href}`);
  }
}

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const library = readFileSync(join(root, "library.html"), "utf8");
const home = readFileSync(join(root, "index.html"), "utf8");
const libraryCards = (library.match(/<a\b[^>]*\bdata-guide\b/g) || []).length;
if (libraryCards < batch.pages.length) fail(`Library must expose at least the current batch; found ${libraryCards} cards for ${batch.pages.length} pages.`);
const sitemapEntries = (sitemap.match(/<url>/g) || []).length;
if (sitemapEntries < batch.pages.length) fail(`Sitemap must expose at least the current batch; found ${sitemapEntries} entries for ${batch.pages.length} pages.`);
for (const page of batch.pages) {
  const path = join(root, page.slug);
  if (!existsSync(path)) { fail(`Missing generated page: ${page.slug}`); continue; }
  const html = readFileSync(path, "utf8");
  const title = match(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const canonical = `${siteUrl}/${page.slug}`;
  const main = match(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const words = text(main).split(/\s+/).filter(Boolean).length;
  const internalArticleLinks = [...main.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((item) => item[1]).filter((href) => !/^(?:https?:|mailto:|tel:|#)/i.test(href));
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((item) => JSON.parse(item[1]));
  if (!title.startsWith(page.title)) fail(`Title mismatch in ${page.slug}.`);
  if (description.length < 100 || description.length > 165) fail(`Meta description length out of range in ${page.slug}: ${description.length}.`);
  if (h1s.length !== 1 || text(h1s[0]?.[1] || "") !== page.title) fail(`Expected one matching H1 in ${page.slug}.`);
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) fail(`Canonical mismatch in ${page.slug}.`);
  if (!html.includes(`<meta property="og:url" content="${canonical}">`)) fail(`Open Graph URL mismatch in ${page.slug}.`);
  if (!schemas.some((schema) => schema["@type"] === "Article") || !schemas.some((schema) => schema["@type"] === "FAQPage")) fail(`Required Article and FAQ schema missing in ${page.slug}.`);
  const articleSchema = schemas.find((schema) => schema["@type"] === "Article");
  if (articleSchema?.datePublished !== batch.generatedAt || articleSchema?.dateModified !== batch.generatedAt) fail(`Article schema date mismatch in ${page.slug}.`);
  if (words < 900) fail(`Page is not substantial enough (${words} words): ${page.slug}.`);
  if (new Set(internalArticleLinks).size < 3) fail(`Fewer than 3 meaningful internal links in ${page.slug}.`);
  if ((main.match(/<img\b/gi) || []).length !== 0) fail(`Daily page must remain intentionally image-free: ${page.slug}.`);
  if ((main.match(/class="daily-sources"/g) || []).length !== 1) fail(`Source panel missing in ${page.slug}.`);
  if (!library.includes(`href="${page.slug}"`) || !home.includes(`href="${page.slug}"`)) fail(`Discovery surface missing ${page.slug}.`);
  if (!sitemap.includes(`<loc>${canonical}</loc>`) || !sitemap.includes(`<lastmod>${batch.generatedAt}</lastmod>`)) fail(`Sitemap entry missing or stale for ${page.slug}.`);
  const department = page.department;
  if (!["style.html", "grooming.html", "fitness.html", "life.html"].includes(department)) fail(`Invalid department in manifest for ${page.slug}: ${department}.`);
  if (!readFileSync(join(root, department), "utf8").includes(`href="${page.slug}"`)) fail(`Department surface ${department} is missing ${page.slug}.`);

  const commercialLinks = [...html.matchAll(/<a\b[^>]*data-commercial-link=["']true["'][^>]*>/gi)];
  const expectedCommercialLinks = Number(page.affiliateLinksExpected || 0);
  if (commercialLinks.length !== expectedCommercialLinks) fail(`Expected ${expectedCommercialLinks} commerce links in ${page.slug}; found ${commercialLinks.length}.`);
  for (const link of commercialLinks) {
    for (const token of ["sponsored", "nofollow", "noopener", "noreferrer"]) if (!new RegExp(`rel=["'][^"']*\\b${token}\\b`, "i").test(link[0])) fail(`Commerce link in ${page.slug} is missing rel=${token}.`);
    if (!link[0].includes("tag=beautifulmensclub-20")) fail(`Commerce link in ${page.slug} is missing the approved affiliate tag.`);
  }
  if (expectedCommercialLinks > 0 && !html.includes("As an Amazon Associate I earn from qualifying purchases")) fail(`Affiliate disclosure missing from ${page.slug}.`);
}

const revenuePath = join(root, "garment-steamer-buying-guide.html");
if (existsSync(revenuePath)) {
  const revenue = readFileSync(revenuePath, "utf8");
  const commercialLinks = [...revenue.matchAll(/<a\b[^>]*data-commercial-link=["']true["'][^>]*>/gi)];
  if (commercialLinks.length > 0) {
    if (commercialLinks.length !== 3) fail(`Expected exactly 3 steamer commerce links after injection; found ${commercialLinks.length}.`);
    for (const link of commercialLinks) {
      for (const token of ["sponsored", "nofollow", "noopener", "noreferrer"]) if (!new RegExp(`rel=["'][^"']*\\b${token}\\b`, "i").test(link[0])) fail(`Commerce link missing rel=${token}.`);
      if (!link[0].includes("tag=beautifulmensclub-20")) fail("Commerce link is missing the approved affiliate tag.");
    }
    if (!revenue.includes("As an Amazon Associate I earn from qualifying purchases")) fail("Affiliate disclosure missing from revenue page.");
  }
}
for (const slug of ["dandruff-vs-dry-scalp-guide.html", "home-emergency-document-file.html", "two-account-bill-system.html", "mens-dress-shoe-fit-guide.html", "home-fire-extinguisher-guide.html", "how-to-order-wine-at-a-restaurant.html", "mens-dry-hands-care-guide.html", "overnight-guest-room-checklist.html", "day-hike-planning-guide.html", "home-power-outage-plan.html", "strength-training-warm-up-guide.html", "weeknight-kitchen-closing-shift.html", "deodorant-vs-antiperspirant-for-men.html", "hotel-room-arrival-check.html", "emergency-fund-system.html", "office-chair-setup-guide.html", "mens-foot-care-routine.html", "how-to-give-a-toast.html", "home-inventory-insurance-system.html", "indoor-rowing-machine-setup-technique-guide.html", "credit-freeze-guide.html", "how-to-introduce-people.html", "home-blood-pressure-monitor-guide.html", "carbon-monoxide-alarm-plan.html", "resistance-band-buying-safety-guide.html", "home-wifi-security-checklist.html", "home-fire-escape-plan.html", "good-houseguest-checklist.html"]) {
  const html = readFileSync(join(root, slug), "utf8");
  if (/data-commercial-link=["']true/i.test(html)) fail(`Non-commercial daily page contains affiliate links: ${slug}.`);
}

if (failures.length) {
  console.error(`Publication audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Publication audit passed: ${htmlFiles.length} HTML files, ${batch.pages.length} daily pages for ${batch.generatedAt}, unique metadata, valid schema, local links, discovery surfaces, sitemap, accessibility and affiliate rules.`);
