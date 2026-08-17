import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pagesA } from "./expansion-two-pages-a.mjs";
import { pagesB } from "./expansion-two-pages-b.mjs";

const root = process.cwd();
const siteUrl = "https://beautifulmensclub.com";
const pages = [...pagesA, ...pagesB];
const esc = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

function render(page) {
  const canonical = `${siteUrl}/${page.slug}`;
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: page.title, description: page.description, url: canonical, dateModified: "2026-08-17", author: { "@type": "Organization", name: "Beautiful Men's Club Editorial" }, publisher: { "@type": "Organization", name: "Beautiful Men's Club" } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const sections = page.sections.map(([heading, paragraphs]) => `<section class="article-section"><h2>${esc(heading)}</h2>${paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`).join("");
  const checklist = page.checklist.map((item) => `<li>${esc(item)}</li>`).join("");
  const faq = page.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  return `<!doctype html><html lang="en" class="article-page"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)} — Beautiful Men's Club</title><meta name="description" content="${esc(page.description)}"><meta name="author" content="Beautiful Men's Club Editorial"><meta name="theme-color" content="#09090b"><meta name="color-scheme" content="dark"><meta property="og:type" content="article"><meta property="og:site_name" content="Beautiful Men's Club"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><link rel="canonical" href="${canonical}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="manifest" href="site.webmanifest"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css"><style>.bmc-guide{max-width:920px;margin:auto;padding:150px 24px 90px}.bmc-guide .lead{font-size:1.28rem;line-height:1.75;color:var(--muted,#c9c9ce)}.bmc-guide .article-section{padding:25px 0;border-bottom:1px solid rgba(255,255,255,.12)}.bmc-guide h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.2rem);margin-bottom:18px}.bmc-guide p,.bmc-guide li{line-height:1.78}.guide-checklist{border:1px solid rgba(255,255,255,.18);padding:28px;margin:36px 0}.bmc-faq details{padding:18px 0;border-bottom:1px solid rgba(255,255,255,.12)}.bmc-faq summary{cursor:pointer;font-weight:700}.guide-kicker{letter-spacing:.18em;color:#d7b56d;font-size:.78rem;font-weight:700}.guide-back{display:inline-block;margin-top:30px}</style><script type="application/ld+json">${JSON.stringify(articleSchema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head><body><a class="skip-link" href="#main">Skip to content</a><div class="grain" aria-hidden="true"></div><div class="reading-progress" aria-hidden="true"><span></span></div><header class="site-header"><a class="brand" href="index.html" aria-label="Beautiful Men's Club home"><span>B</span><b>BEAUTIFUL MEN'S CLUB</b></a><button class="menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">MENU</button><nav id="site-nav" aria-label="Primary navigation"><a href="index.html#edit">The Edit</a><a href="style.html">Style</a><a href="grooming.html">Grooming</a><a href="fitness.html">Fitness</a><a href="life.html">Life</a><a href="library.html">Library</a><a href="standards.html">Standards</a><a href="join.html" class="nav-cta">Join</a></nav></header><main id="main"><article class="bmc-guide"><p class="guide-kicker">${esc(page.category)} · BMC FIELD MANUAL</p><h1>${esc(page.title)}</h1><p class="lead">${esc(page.lead)}</p>${sections}<section class="guide-checklist"><h2>The working checklist</h2><ul>${checklist}</ul></section><section class="bmc-faq"><h2>Frequently asked questions</h2>${faq}</section><a class="button ghost guide-back" href="library.html">← Back to the library</a></article></main><footer class="site-footer"><div class="footer-brand"><a class="brand" href="index.html"><span>B</span><b>BEAUTIFUL MEN'S CLUB</b></a><p>Look sharp. Live well. Keep your word.</p></div><div class="footer-links"><a href="style.html">Style</a><a href="grooming.html">Grooming</a><a href="fitness.html">Fitness</a><a href="life.html">Life</a><a href="library.html">Library</a></div><div class="footer-meta"><a href="mailto:hello@beautifulmensclub.com">hello@beautifulmensclub.com</a><p>© <span id="year"></span> Beautiful Men's Club.</p></div></footer><script src="script.js"></script></body></html>`;
}

function upsert(path, marker, block) {
  const full = join(root, path);
  let html = readFileSync(full, "utf8");
  const start = `<!-- ${marker} START -->`;
  const end = `<!-- ${marker} END -->`;
  const wrapped = `${start}${block}${end}`;
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  html = pattern.test(html) ? html.replace(pattern, wrapped) : html.replace("</main>", `${wrapped}</main>`);
  writeFileSync(full, html);
}

for (const page of pages) writeFileSync(join(root, page.slug), render(page));
const cards = pages.map((page) => `<a class="library-card" href="${page.slug}" data-category="${esc(page.category.toLowerCase())}"><span>${esc(page.category)}</span><h3>${esc(page.title)}</h3><p>${esc(page.description)}</p><b>READ THE GUIDE →</b></a>`).join("");
upsert("library.html", "BMC EXPANSION TWO", `<section class="section"><div class="section-head"><p class="section-tag">NEW FIELD MANUALS</p><h2>Ten systems that make the man easier to run.</h2><p>Clothes, grooming, movement, recovery, conversation and travel—built as repeatable practices, not product lists.</p></div><div class="library-grid">${cards}</div></section>`);
const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
for (const page of pages) {
  const loc = `${siteUrl}/${page.slug}`;
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  sitemap = sitemap.replace(new RegExp(`<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>\\s*`, "g"), "");
}
sitemap = sitemap.replace("</urlset>", `${pages.map((page) => `<url><loc>${siteUrl}/${page.slug}</loc><lastmod>2026-08-17</lastmod><changefreq>monthly</changefreq><priority>0.76</priority></url>`).join("")}</urlset>`);
writeFileSync(sitemapPath, sitemap);
console.log(`Generated ${pages.length} additional Beautiful Men's Club guides.`);
