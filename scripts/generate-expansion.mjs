import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const siteUrl = "https://beautifulmensclub.com";

const pages = [
  {
    slug: "capsule-wardrobe.html",
    title: "The Men's Capsule Wardrobe That Actually Works",
    category: "STYLE",
    description: "Build a compact men's wardrobe that covers work, weekends, dinners and travel without buying a closet full of near-duplicates.",
    lead: "A good capsule wardrobe is not a minimalist stunt. It is a system: fewer pieces, better fit, repeatable combinations and almost no panic when an invitation appears.",
    sections: [
      ["Start with the life you actually live", ["Count the days you spend at work, at home, outside, traveling and attending social events. Your wardrobe should serve that calendar, not the version of yourself advertised by a brand campaign.", "A man who works in a casual office and spends weekends with children needs a different ratio of tailoring, knitwear and washable layers than someone who wears a suit four days a week."]],
      ["Build around dependable neutrals", ["Navy, charcoal, white, cream, brown and olive combine easily and age well. They let texture, fit and one stronger accent do the visual work.", "The point is not to dress without color. It is to make sure most new purchases connect to at least three things you already own."]],
      ["Buy the hard-to-fit pieces first", ["Jackets, trousers and shoes determine proportion and comfort. Get those right before collecting shirts and accessories. A tailor can refine sleeve and trouser length, but cannot rescue every shoulder or rise problem.", "Try every piece sitting, walking and reaching—not just standing still in front of a mirror."]],
      ["Create uniforms, not identical outfits", ["A reliable formula might be Oxford shirt, textured knit, dark trouser and loafer; another might be structured T-shirt, overshirt, dark denim and clean sneaker. The formula stays familiar while fabric and color change.", "Photograph combinations that work. A small private outfit album is more useful than buying another shirt because you forgot what pairs well."]]
    ],
    checklist: ["Navy or charcoal jacket", "Two well-cut trousers", "Dark straight-leg denim", "One chino in khaki or olive", "White and light-blue shirts", "Two knit layers", "Structured white and dark T-shirts", "Brown leather shoe", "Clean low-profile sneaker", "Weather-capable boot", "Simple belt and watch", "Coat that covers the clothes beneath it"],
    faq: [
      ["How many pieces should a capsule wardrobe have?", "There is no magic number. Start with enough to cover a normal week and build around repeatable combinations rather than an arbitrary limit."],
      ["Should every item be expensive?", "No. Spend more where fit, construction and repeated wear matter. Basic T-shirts and seasonal pieces can be modest if the fabric and fit are right."],
      ["Can black be the main neutral?", "Yes, especially in an urban or creative wardrobe, but navy, charcoal and brown often combine more easily for everyday menswear."],
      ["How often should the capsule be reviewed?", "Review it at the change of season. Repair, tailor, clean and remove pieces that no longer fit your life before buying replacements."]
    ]
  },
  {
    slug: "mens-skincare-routine.html",
    title: "A Simple Men's Skincare Routine",
    category: "GROOMING",
    description: "A practical men's skincare routine built around cleansing, moisturizing, sun protection and consistency rather than a shelf full of products.",
    lead: "The best routine is the one you can repeat without turning the bathroom into a laboratory. Clean gently, moisturize appropriately, protect exposed skin from the sun and add only what solves a real problem.",
    sections: [
      ["Morning: protect and leave", ["Rinse or use a gentle cleanser if needed, apply a moisturizer suited to your skin and finish with broad-spectrum sun protection on exposed areas. Give products a moment to settle before dressing.", "A complicated seven-step sequence is not automatically better. Irritation often comes from stacking too many active products too quickly."]],
      ["Evening: remove the day", ["Clean off sweat, sunscreen, dirt and styling products without scrubbing aggressively. Use lukewarm water and pat dry. Apply moisturizer while the skin is still slightly damp.", "Men who shave may need to adjust cleanser and moisturizer choices around irritation, ingrown hairs or dryness."]],
      ["Add one targeted product at a time", ["When addressing a specific concern, introduce one product, follow its instructions and give the routine time before judging it. Adding several products at once makes it difficult to identify what helped or caused irritation.", "Patch testing and professional guidance are wise when skin is reactive or a condition is persistent."]],
      ["Your habits show up on your face", ["Sleep, hydration, smoking, stress, sun exposure and consistent hygiene affect appearance more than luxury packaging. Clean pillowcases, fresh towels and washed phone screens are unglamorous but useful.", "Persistent rashes, painful acne, changing lesions or other concerning symptoms deserve evaluation by a qualified clinician."]]
    ],
    checklist: ["Gentle cleanser", "Fragrance-tolerable moisturizer", "Broad-spectrum sunscreen", "Clean razor and shaving medium", "Fresh face towels", "Lip protection for cold or sun", "One targeted product only when needed", "Consistent routine for several weeks"],
    faq: [
      ["Do men need different skincare products?", "Not necessarily. Skin type, sensitivity and the specific concern matter more than marketing categories."],
      ["How often should I wash my face?", "Many people do well with gentle cleansing once or twice daily, adjusted for sweat, work conditions and skin tolerance."],
      ["Should moisturizer be used on oily skin?", "Often yes, but a lighter non-comedogenic formula may feel better. Oily skin can still become irritated or dehydrated."],
      ["When should I see a dermatologist?", "Seek professional care for persistent, painful, rapidly changing or concerning skin problems rather than continuing to experiment indefinitely."]
    ]
  },
  {
    slug: "smell-good-all-day.html",
    title: "How to Smell Good All Day Without Overdoing It",
    category: "GROOMING",
    description: "A complete system for clean clothes, body care, fragrance placement and grooming habits that help a man smell good without filling the room.",
    lead: "Smelling good starts before fragrance. Clean skin, dry clothes, fresh shoes and a controlled application beat a cloud of expensive cologne every time.",
    sections: [
      ["Fix the foundation", ["Shower as needed for your activity level, dry thoroughly and wear genuinely clean clothes. Sweat trapped in synthetic fabric, damp towels and neglected shoes can overpower any fragrance.", "Use antiperspirant or deodorant according to your needs and product directions. Rotate and air shoes rather than wearing the same damp pair daily."]],
      ["Laundry is part of grooming", ["Do not overload the washer, leave wet clothes sitting or store garments before they are fully dry. Clean collars, undershirts and outerwear on a schedule appropriate to wear.", "Fragrance boosters cannot rescue fabric that is holding old odor. Occasionally inspect gym bags, coats, hats and car upholstery—the overlooked places that carry scent back onto clean clothes."]],
      ["Apply fragrance with restraint", ["One to three sprays is enough for many modern fragrances, depending on strength. Apply to skin or clothing only as directed, and avoid rubbing wrists together.", "The goal is for someone close to notice, not for the elevator to remember you after you leave."]],
      ["Match fragrance to setting", ["Lighter citrus, aromatic and clean woods tend to fit warm weather and daytime. Denser amber, spice and leather can work in colder conditions or evening, but strength still matters.", "Workplaces, airplanes, restaurants and medical settings reward restraint. Consider fragrance-free days when others cannot easily move away."]]
    ],
    checklist: ["Clean skin and completely dry clothing", "Fresh undershirt when appropriate", "Antiperspirant or deodorant used correctly", "Shoes rotated and aired", "Outerwear and gym bag checked", "One fragrance—not competing scented layers", "Controlled sprays away from other people", "Travel-size hygiene backup for long days"],
    faq: [
      ["Where should fragrance be applied?", "Common choices include the neck, upper chest or wrists, but follow the product directions and use a light hand."],
      ["Why does my cologne disappear quickly?", "Skin type, weather, concentration and nose fatigue all matter. Do not keep adding sprays simply because you stop noticing it."],
      ["Can fragrance be sprayed on clothing?", "Some people do, but test first because oils or alcohol can mark fabric. Skin application usually develops more naturally."],
      ["How can shoes be kept fresh?", "Let them dry fully, rotate pairs, use clean socks and address persistent moisture or odor rather than covering it."]
    ]
  },
  {
    slug: "strength-after-40.html",
    title: "Strength Training After 40: A Sustainable System",
    category: "FITNESS",
    description: "A practical strength-training framework for men over 40 focused on repeatable sessions, recovery, movement quality and long-term progress.",
    lead: "Training after 40 is not about proving you can still survive the workout you did at 22. It is about building strength you can use, recovering well enough to return and keeping joints, work and family life in the equation.",
    sections: [
      ["Choose repeatable movements", ["Build around squat, hinge, push, pull, carry and trunk-stability patterns that fit your current ability and equipment. The exact exercise matters less than safe technique, appropriate range and progressive loading.", "A qualified coach can help when pain, old injuries or uncertainty make exercise selection difficult."]],
      ["Leave room for the next session", ["Most sets do not need to end in failure. Stopping with one to three solid repetitions in reserve often supports better technique and recovery.", "Consistency over months beats occasional heroic sessions followed by soreness, schedule disruption or injury."]],
      ["Progress one variable at a time", ["Add a little weight, a repetition, a set or better control—not all of them at once. Keep a simple log so progress is based on evidence rather than memory.", "When sleep or stress is poor, maintaining the session with reduced volume may be smarter than forcing a personal record."]],
      ["Recovery is training", ["Protein intake, total nutrition, sleep, walking, hydration and rest days influence adaptation. Warm-ups should prepare the movements you will perform rather than becoming a separate exhausting workout.", "New chest pain, severe shortness of breath, dizziness or significant joint pain should not be treated as normal training discomfort; seek appropriate medical guidance."]]
    ],
    checklist: ["Two to four strength sessions per week", "Movement-specific warm-up", "Log weights, reps and discomfort", "Use controlled technique", "Keep most sets short of failure", "Walk or move on non-lifting days", "Protect sleep where possible", "Reduce load when recovery is poor"],
    faq: [
      ["Is it too late to begin strength training?", "Many adults can improve strength later in life, but starting level, health history and exercise selection should be appropriate to the individual."],
      ["How long should a workout take?", "A focused 35–60 minute session is enough for many people when exercises and rest periods are planned."],
      ["Should cardio be included?", "Yes. Strength and aerobic fitness serve different purposes and can be combined across the week."],
      ["What if an exercise hurts?", "Stop and evaluate the movement. Substitute a tolerable pattern and seek qualified medical or coaching help for persistent or significant pain."]
    ]
  },
  {
    slug: "posture-and-presence.html",
    title: "Better Posture, Stronger Presence",
    category: "LIFE",
    description: "Improve how you stand, sit, walk and enter a room through practical posture, breathing, clothing and attention habits.",
    lead: "Presence is not a performance of dominance. It is the visible result of being upright, prepared, attentive and comfortable enough to stop fidgeting with yourself.",
    sections: [
      ["Stack, do not stiffen", ["Think ears over shoulders, ribs over pelvis and weight balanced through the feet. Good posture is organized, not rigid. A military brace held all day becomes fatigue and tension.", "Change positions regularly. The best posture is often the next comfortable, well-supported posture rather than one frozen shape."]],
      ["Train the positions you need", ["Rows, carries, hinges, split squats and upper-back work can support posture, but strength alone does not replace awareness. Practice standing during conversations and walking without looking down at a phone.", "Desk setup should reduce the need to crane the neck or reach constantly."]],
      ["Use clothing to reinforce proportion", ["Correct jacket shoulders, trouser rise and shirt length make the body look more balanced. Clothes that are too tight encourage self-conscious adjustment; oversized pieces can collapse the silhouette.", "A tailor can often create more visible improvement than another month of shopping."]],
      ["Attention is the final layer", ["Make eye contact appropriate to the setting, listen through the end of a sentence and allow a small pause before responding. Speak clearly enough that others do not have to lean in.", "Confidence is more believable when it makes the room easier for other people, not when it demands the room's attention."]]
    ],
    checklist: ["Feet planted rather than constantly shifting", "Shoulders relaxed and ribs not flared", "Phone raised instead of neck folded", "Chair and screen adjusted", "Clothes tailored at shoulders and length", "Slow exhale before speaking", "Hands still when listening", "Walk at a deliberate natural pace"],
    faq: [
      ["Can posture be fixed by one exercise?", "Usually no. Strength, mobility, work setup, habits and individual anatomy all contribute."],
      ["Should shoulders be pulled back all day?", "No. Aim for a relaxed, organized position rather than forcing the shoulder blades together continuously."],
      ["Does better posture make a man look taller?", "Balanced alignment and well-fitted clothing can create a longer, cleaner visual line, even though actual height does not change."],
      ["What if posture causes pain?", "Persistent pain deserves assessment by a qualified health professional rather than repeated self-correction through discomfort."]
    ]
  },
  {
    slug: "first-date-style.html",
    title: "The First-Date Style Guide for Men",
    category: "STYLE",
    description: "What to wear on a first date for coffee, dinner, drinks or an activity—without looking underdressed, overdressed or costumed.",
    lead: "The objective is not to unveil a new character. Dress like the most considered version of yourself, one level sharper than an ordinary outing and appropriate to the actual plan.",
    sections: [
      ["Match the setting first", ["Coffee and a walk call for clean casual clothes; a reservation restaurant may require trousers, a collared shirt and a jacket. An activity date needs movement, weather protection and shoes that can do the job.", "Check the venue before getting dressed. Uncertainty is not an excuse for either gym clothes or a three-piece suit."]],
      ["Fit and condition beat novelty", ["Wear clothing you have already tested. A new jacket that pulls, shoes that blister or a shirt that needs constant adjustment will steal attention.", "Clean footwear, trimmed nails, fresh breath and lint-free clothing are noticed more than a conspicuous label."]],
      ["Use one point of interest", ["A textured jacket, excellent watch, rich knit, interesting shoe or restrained fragrance is enough. Several statement pieces compete and can feel like audition clothing.", "Keep colors connected and let one detail carry personality."]],
      ["Prepare for the practical details", ["Consider temperature changes, walking distance and whether outerwear will be checked. Carry only what fits neatly in pockets or a simple bag.", "Arrive early enough that you are not sweaty, rushed or making the other person wait. Good style includes the way the evening is handled."]]
    ],
    checklist: ["Venue checked", "Clothes already worn and comfortable", "Shoes clean and appropriate", "Grooming handled without over-fragrance", "Weather layer included", "Wallet and phone kept unobtrusive", "One personal detail", "Arrive a few minutes early"],
    faq: [
      ["Should a blazer be worn on a first date?", "Wear one when the setting supports it and you feel natural in it. An unstructured jacket can elevate dinner or drinks without looking formal."],
      ["Are sneakers acceptable?", "Clean, simple sneakers work for many casual dates. Athletic trainers usually look less intentional unless the activity requires them."],
      ["How much fragrance is appropriate?", "Use less than you think. The person should notice it only at conversational distance."],
      ["What color is safest?", "Navy, charcoal, white, cream, olive and brown are easy to combine and photograph well in most lighting."]
    ]
  }
];

const esc = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

function render(page) {
  const canonical = `${siteUrl}/${page.slug}`;
  const sections = page.sections.map(([heading, paragraphs]) => `<section class="bmc-expansion-section"><h2>${esc(heading)}</h2>${paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`).join("");
  const checklist = page.checklist.map((item) => `<li>${esc(item)}</li>`).join("");
  const faq = page.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: page.title, description: page.description, url: canonical, dateModified: "2026-08-17", author: { "@type": "Organization", name: "Beautiful Men's Club Editorial" }, publisher: { "@type": "Organization", name: "Beautiful Men's Club" } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return `<!doctype html><html lang="en" class="article-page"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)} — Beautiful Men's Club</title><meta name="description" content="${esc(page.description)}"><meta name="author" content="Beautiful Men's Club Editorial"><meta name="theme-color" content="#09090b"><meta name="color-scheme" content="dark"><meta property="og:type" content="article"><meta property="og:site_name" content="Beautiful Men's Club"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><link rel="canonical" href="${canonical}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="manifest" href="site.webmanifest"><link rel="stylesheet" href="styles.css"><style>.bmc-expansion{max-width:920px;margin:auto;padding:150px 24px 90px}.bmc-expansion .kicker{letter-spacing:.18em;font-size:.75rem;color:#d5ad63}.bmc-expansion h1{font-family:'Playfair Display',serif;font-size:clamp(3rem,8vw,6.5rem);line-height:.94;margin:.35em 0}.bmc-expansion .deck{font-size:1.25rem;line-height:1.7;color:#c9c9cf;max-width:760px}.bmc-expansion-section{padding:30px 0;border-top:1px solid rgba(255,255,255,.12)}.bmc-expansion-section h2{font-family:'Playfair Display',serif;font-size:2rem}.bmc-expansion-section p,.bmc-expansion li,.bmc-expansion details{line-height:1.75;color:#d8d8dc}.bmc-expansion .check-panel{padding:28px;border:1px solid rgba(213,173,99,.35);margin:35px 0}.bmc-expansion details{padding:16px 0;border-bottom:1px solid rgba(255,255,255,.1)}.bmc-expansion summary{font-weight:700;cursor:pointer;color:#fff}.bmc-expansion .return{display:inline-block;margin-top:38px;color:#d5ad63}</style><script type="application/ld+json">${JSON.stringify(articleSchema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head><body><a class="skip-link" href="#main">Skip to content</a><div class="grain" aria-hidden="true"></div><header class="site-header"><a class="brand" href="index.html"><span>B</span><b>BEAUTIFUL MEN'S CLUB</b></a><button class="menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">MENU</button><nav id="site-nav" aria-label="Primary navigation"><a href="index.html#edit">The Edit</a><a href="style.html">Style</a><a href="grooming.html">Grooming</a><a href="fitness.html">Fitness</a><a href="life.html">Life</a><a href="library.html">Library</a><a href="standards.html">Standards</a><a href="join.html" class="nav-cta">Join</a></nav></header><main id="main"><article class="bmc-expansion"><p class="kicker">${esc(page.category)} · PRACTICAL GUIDE</p><h1>${esc(page.title)}</h1><p class="deck">${esc(page.lead)}</p><p><strong>Updated August 17, 2026.</strong></p>${sections}<section class="check-panel"><h2>The working checklist</h2><ul class="check-list">${checklist}</ul></section><section class="bmc-expansion-section"><h2>Frequently asked questions</h2>${faq}</section><a class="return" href="library.html">← Back to the BMC library</a></article></main><footer class="site-footer"><div class="footer-brand"><a class="brand" href="index.html"><span>B</span><b>BEAUTIFUL MEN'S CLUB</b></a><p>Look sharp. Live well. Keep your word.</p></div><div class="footer-links"><a href="style.html">Style</a><a href="grooming.html">Grooming</a><a href="fitness.html">Fitness</a><a href="life.html">Life</a><a href="library.html">Library</a></div><div class="footer-meta"><a href="mailto:hello@beautifulmensclub.com">hello@beautifulmensclub.com</a><p>© <span id="year"></span> Beautiful Men's Club.</p></div></footer><script src="script.js"></script></body></html>`;
}

function upsert(path, marker, block) {
  const full = join(root, path);
  let html = readFileSync(full, "utf8");
  const start = `<!-- ${marker} START -->`;
  const end = `<!-- ${marker} END -->`;
  const wrapped = `${start}${block}${end}`;
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  if (pattern.test(html)) html = html.replace(pattern, wrapped);
  else html = html.replace("</main>", `${wrapped}</main>`);
  writeFileSync(full, html);
}

for (const page of pages) {
  const full = join(root, page.slug);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, render(page));
}

const libraryBlock = `<section class="section" id="new-guides"><div class="section-head"><p class="section-tag">THE NEW FIELD MANUALS</p><h2>Six guides worth saving.</h2><p>Specific systems for clothes, grooming, strength and presence—written to be used, not admired once and forgotten.</p></div><div class="library-grid">${pages.map((page) => `<a class="library-card" href="${page.slug}" data-guide data-category="${esc(page.category.toLowerCase())}" data-title="${esc(page.title)}" data-keywords="${esc(page.description)}"><span>${esc(page.category)}</span><h3>${esc(page.title)}</h3><p>${esc(page.description)}</p><b>Read guide →</b></a>`).join("")}</div></section>`;
upsert("library.html", "BMC EXPANSION", libraryBlock);

const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
for (const page of pages) {
  const loc = `${siteUrl}/${page.slug}`;
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  sitemap = sitemap.replace(new RegExp(`<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>\\s*`, "g"), "");
}
const entries = pages.map((page) => `<url><loc>${siteUrl}/${page.slug}</loc><lastmod>2026-08-17</lastmod><changefreq>monthly</changefreq><priority>0.74</priority></url>`).join("");
sitemap = sitemap.replace("</urlset>", `${entries}</urlset>`);
writeFileSync(sitemapPath, sitemap);

console.log(`Generated ${pages.length} new Beautiful Men's Club guides and refreshed the library and sitemap.`);
