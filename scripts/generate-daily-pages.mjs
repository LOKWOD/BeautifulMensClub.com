import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dailyBatch } from "./daily-pages-2026-09-03.mjs";

const root = process.cwd();
const siteUrl = "https://beautifulmensclub.com";
const displayDate = dailyBatch.displayDate;
const assetVersion = dailyBatch.assetVersion || dailyBatch.date;
const esc = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

function render(page) {
  const canonical = `${siteUrl}/${page.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    url: canonical,
    datePublished: dailyBatch.date,
    dateModified: dailyBatch.date,
    articleSection: page.category,
    author: { "@type": "Organization", name: "Beautiful Men's Club Editorial" },
    publisher: { "@type": "Organization", name: "Beautiful Men's Club", url: siteUrl }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }))
  };
  const sections = page.sections.map((section) => `<section class="daily-section"><h2>${esc(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}</section>`).join("");
  const takeaways = page.takeaways.map((item) => `<li>${esc(item)}</li>`).join("");
  const faq = page.faq.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("");
  const related = page.related.map(([title, href]) => `<a href="${esc(href)}"><span>RELATED GUIDE</span><b>${esc(title)}</b></a>`).join("");
  const sources = page.sources.map(([title, href, note]) => `<li><a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a><span>${esc(note)}</span></li>`).join("");
  return `<!doctype html>
<html lang="en" class="article-page"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title)} — Beautiful Men's Club</title><meta name="description" content="${esc(page.description)}"><meta name="author" content="Beautiful Men's Club Editorial"><meta name="theme-color" content="#09090b"><meta name="color-scheme" content="dark">
<meta property="og:type" content="article"><meta property="og:site_name" content="Beautiful Men's Club"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta property="article:published_time" content="${dailyBatch.date}"><meta property="article:modified_time" content="${dailyBatch.date}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="manifest" href="site.webmanifest"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css">
<style>.daily-guide{max-width:960px;margin:auto;padding:150px 24px 90px}.daily-guide .kicker,.daily-related span{letter-spacing:.17em;color:#d7b56d;font-size:.76rem;font-weight:700}.daily-guide h1{font-family:'Playfair Display',serif;font-size:clamp(3rem,7vw,6rem);line-height:.98;margin:.28em 0}.daily-guide .dek{max-width:810px;font-size:1.28rem;line-height:1.72;color:#c9c9ce}.daily-meta{color:#aaaab2;margin:22px 0 42px}.daily-takeaways{border:1px solid rgba(215,181,109,.38);padding:28px;margin:30px 0 48px}.daily-takeaways h2,.daily-section h2,.daily-faq h2,.daily-sources h2,.daily-related h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.7rem)}.daily-section{padding:32px 0;border-top:1px solid rgba(255,255,255,.12)}.daily-guide p,.daily-guide li{line-height:1.78;color:#d8d8dc}.daily-guide li+li{margin-top:.55rem}.daily-faq details{padding:17px 0;border-bottom:1px solid rgba(255,255,255,.12)}.daily-faq summary{font-weight:700;cursor:pointer}.daily-related,.daily-sources{margin-top:48px}.daily-related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.daily-related a{display:flex;flex-direction:column;gap:10px;padding:22px;border:1px solid rgba(255,255,255,.16);text-decoration:none}.daily-sources li{display:grid;gap:2px;margin-bottom:12px}.daily-sources span{font-size:.92rem;color:#aaaab2}.daily-actions{display:flex;gap:16px;flex-wrap:wrap;margin-top:38px}@media(max-width:760px){.daily-related-grid{grid-template-columns:1fr}.daily-guide{padding-top:120px}}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head>
<body data-section="${esc(page.category.toLowerCase())}"><a class="skip-link" href="#main">Skip to content</a><div class="grain" aria-hidden="true"></div><div class="reading-progress" aria-hidden="true"><span></span></div><header class="site-header"><a class="brand" href="index.html" aria-label="Beautiful Men's Club home"><span>B</span><b>BEAUTIFUL MEN'S CLUB</b></a><button class="menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">MENU</button><nav id="site-nav" aria-label="Primary navigation"><a href="index.html#edit">The Edit</a><a href="style.html">Style</a><a href="grooming.html">Grooming</a><a href="fitness.html">Fitness</a><a href="life.html">Life</a><a href="library.html">Library</a><a href="standards.html">Standards</a><a href="join.html" class="nav-cta">Join</a></nav></header>
<main id="main"><article class="daily-guide"><p class="kicker">${esc(page.category)} · BMC FIELD MANUAL</p><h1>${esc(page.title)}</h1><p class="dek">${esc(page.dek)}</p><p class="daily-meta"><strong>Published ${displayDate}.</strong> ${esc(page.notice || "Independent editorial guidance.")}</p><section class="daily-takeaways"><h2>The useful answer</h2><ul>${takeaways}</ul></section>${sections}<section class="daily-faq"><h2>Frequently asked questions</h2>${faq}</section><section class="daily-related"><h2>Keep going</h2><div class="daily-related-grid">${related}</div></section><section class="daily-sources"><h2>Sources and further reading</h2><p>Claims checked against these official or professional sources on ${displayDate}.</p><ul>${sources}</ul></section><div class="daily-actions"><a class="button ghost" href="${esc(page.department)}">Browse ${esc(page.category.toLowerCase())}</a><a class="button ghost" href="library.html">Back to the library</a></div></article></main>
<footer class="site-footer"><div class="footer-brand"><a class="brand" href="index.html"><span>B</span><b>BEAUTIFUL MEN'S CLUB</b></a><p>Look sharp. Live well. Keep your word.</p></div><div class="footer-links"><a href="style.html">Style</a><a href="grooming.html">Grooming</a><a href="fitness.html">Fitness</a><a href="life.html">Life</a><a href="library.html">Library</a></div><div class="footer-meta"><a href="mailto:hello@beautifulmensclub.com">hello@beautifulmensclub.com</a><p>© <span id="year"></span> Beautiful Men's Club.</p></div></footer><script src="script.js?v=${assetVersion}"></script></body></html>`;
}

function upsert(path, marker, block) {
  const full = join(root, path);
  let html = readFileSync(full, "utf8");
  const start = `<!-- ${marker} START -->`;
  const end = `<!-- ${marker} END -->`;
  const wrapped = `${start}\n${block}\n${end}`;
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  html = pattern.test(html) ? html.replace(pattern, wrapped) : html.replace("</main>", `${wrapped}\n</main>`);
  writeFileSync(full, html);
}

for (const page of dailyBatch.pages) writeFileSync(join(root, page.slug), render(page));

const cards = dailyBatch.pages.map((page) => `<a class="library-card" href="${page.slug}" data-guide data-category="${page.category.toLowerCase()}" data-title="${esc(page.title)}" data-keywords="${esc(page.searchIntent)}"><small>${page.category} · NEW FIELD MANUAL</small><h2>${esc(page.title)}</h2><p>${esc(page.description)}</p><b>Read the guide →</b></a>`).join("");
upsert("library.html", `BMC DAILY ${dailyBatch.date}`, `<section class="section" id="${esc(dailyBatch.libraryId)}"><div class="section-head"><p class="section-tag">${esc(dailyBatch.libraryTag)}</p><h2>${esc(dailyBatch.libraryTitle)}</h2><p>${esc(dailyBatch.libraryIntro)}</p></div><div class="guide-library">${cards}</div></section>`);

for (const page of dailyBatch.pages) {
  const card = `<section class="section"><div class="section-head"><p class="section-tag">NEW FIELD MANUAL</p><h2>${esc(page.title)}</h2><p>${esc(page.description)}</p><a class="button outline" href="${page.slug}">Read the guide →</a></div></section>`;
  upsert(page.department, `BMC DAILY ${page.slug}`, card);
}

upsert("index.html", `BMC DAILY ${dailyBatch.date}`, `<section class="section"><div class="section-head split-head"><div><p class="section-tag">NEW FIELD MANUALS</p><h2>${esc(dailyBatch.homeTitle)}</h2></div><p class="section-intro">${esc(dailyBatch.homeIntro)}</p></div><div class="cards">${dailyBatch.pages.map((page, index) => `<article class="card reveal"><div class="card-number">0${index + 1} / ${page.category}</div><div class="card-body"><span>${esc(page.searchIntent.toUpperCase())}</span><h3>${esc(page.title)}</h3><p>${esc(page.description)}</p><a href="${page.slug}">Read the field manual →</a></div></article>`).join("")}</div></section>`);

let library = readFileSync(join(root, "library.html"), "utf8");
const libraryCount = (library.match(/<a\b[^>]*\bdata-guide\b/g) || []).length;
const countWords = libraryCount === 49 ? "forty-nine" : String(libraryCount);
library = library
  .replace(/\d+ PRACTICAL GUIDES/g, `${libraryCount} PRACTICAL GUIDES`)
  .replace(/Search \d+ practical men's guides/gi, `Search ${libraryCount} practical men's guides`)
  .replace(/Search (?:\d+|[a-z-]+) practical guides/gi, `Search ${libraryCount} practical guides`)
  .replace(/(?:Twenty-seven|Forty-six|Forty-nine|\d+) useful guides/gi, `${countWords[0].toUpperCase()}${countWords.slice(1)} useful guides`)
  .replace(/>\d+ guides</g, `>${libraryCount} guides<`)
  .replace(/Updated August 2026/g, "Updated September 2026");
writeFileSync(join(root, "library.html"), library);

let home = readFileSync(join(root, "index.html"), "utf8");
home = home.replace(/Search (?:twenty-seven|forty-six|forty-nine|\d+) practical guides/gi, `Search ${countWords} practical guides`);
writeFileSync(join(root, "index.html"), home);

let sharedScript = readFileSync(join(root, "script.js"), "utf8");
sharedScript = sharedScript.replace(/browse \d+ practical guides/gi, `browse ${libraryCount} practical guides`);
writeFileSync(join(root, "script.js"), sharedScript);

for (const path of ["index.html", "library.html", ...new Set(dailyBatch.pages.map((page) => page.department))]) {
  const full = join(root, path);
  const html = readFileSync(full, "utf8").replace(/script\.js(?:\?v=[^"']*)?/g, `script.js?v=${assetVersion}`);
  writeFileSync(full, html);
}

const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
for (const page of dailyBatch.pages) {
  const loc = `${siteUrl}/${page.slug}`;
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  sitemap = sitemap.replace(new RegExp(`<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>\\s*`, "g"), "");
}
const entries = dailyBatch.pages.map((page) => `<url><loc>${siteUrl}/${page.slug}</loc><lastmod>${dailyBatch.date}</lastmod><changefreq>monthly</changefreq><priority>0.82</priority></url>`).join("");
sitemap = sitemap.replace("</urlset>", `${entries}</urlset>`);
writeFileSync(sitemapPath, sitemap);

writeFileSync(join(root, "publication-manifest.json"), `${JSON.stringify({ generatedAt: dailyBatch.date, site: siteUrl, pages: dailyBatch.pages.map(({ slug, title, category, department, searchIntent, affiliateLinksExpected }) => ({ slug, title, category, department, searchIntent, affiliateLinksExpected })) }, null, 2)}\n`);
console.log(`Generated ${dailyBatch.pages.length} daily Beautiful Men's Club guides and refreshed discovery surfaces.`);
