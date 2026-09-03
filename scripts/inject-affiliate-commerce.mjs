import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const tag = "beautifulmensclub-20";
const markerStart = "<!-- BMC AFFILIATE COMMERCE -->";
const markerEnd = "<!-- END BMC AFFILIATE COMMERCE -->";
const skipDirectories = new Set([".git", "node_modules", ".wrangler"]);

const catalog = {
  electricShavers: [
    ["mens foil electric shaver", "Foil electric shavers", "Compare head width, pivot control, dry-or-wet permissions, cleaning method and replacement-foil support for the exact model."],
    ["mens rotary electric shaver", "Rotary electric shavers", "Compare head movement, grip, washable-parts instructions, travel lock and model-specific replacement-head availability."],
    ["mens beard trimmer adjustable guards", "Adjustable beard trimmers", "Choose a trimmer when controlled stubble or beard length matters more than a close shave; verify the usable guard range and cleaning instructions."],
  ],
  adjustableDumbbells: [
    ["dial adjustable dumbbells pair home gym", "Dial adjustable dumbbells", "Compare the full load sequence, dimensions, cradle access, current manual and recall status for the exact model."],
    ["selector pin block adjustable dumbbells pair", "Selectorized block dumbbells", "Confirm handle geometry, model-specific expansion compatibility, selector engagement and manufacturer handling rules."],
    ["plate loaded adjustable dumbbell handles collars", "Plate-loaded dumbbell handles", "Verify plate-hole diameter, sleeve length, collar system and clearance for your planned movements."],
  ],
  raincoat: [
    ["mens waterproof trench coat rain", "Men’s waterproof trench coats", "Verify the exact garment’s weather claim, seam construction, layer fit, length and care label."],
    ["mens waterproof mac raincoat", "Men’s waterproof macs", "Look for a clean silhouette with documented protection, secure closures and room for real weekday layers."],
    ["mens waterproof technical shell jacket", "Men’s technical rain shells", "Compare intended use, hood control, ventilation, seam construction, dimensions and model-specific care."],
  ],
  steamer: [
    ["handheld garment steamer removable tank", "Handheld garment steamers", "Compare filled weight, tank access, steam controls, storage and the exact model manual."],
    ["dual voltage travel garment steamer", "Travel garment steamers", "Verify dual voltage on the exact model; a plug adapter alone does not convert voltage."],
    ["standing garment steamer clothes", "Standing garment steamers", "Compare base stability, hose reach, tank handling, parts support and the space it occupies."],
  ],
  style: [
    ["mens wooden suit hangers wide shoulder", "Wooden hangers", "Use fewer, sturdier hangers that support jackets and keep shirts from collapsing."],
    ["garment steamer travel handheld", "Handheld garment steamer", "A fast answer for wrinkles when the ironing board is not coming out."],
    ["cedar shoe trees men", "Cedar shoe trees", "They help footwear dry, hold shape and make a smaller shoe rotation last longer."],
    ["shoe care kit leather men", "Leather shoe-care kit", "A brush, neutral conditioner and appropriate polish cover most basic maintenance."],
    ["reusable lint roller clothes", "Reusable lint brush", "Keep one by the door for the final thirty-second check."],
  ],
  grooming: [
    ["mens beard trimmer adjustable waterproof", "Adjustable beard trimmer", "Look for useful guard lengths, easy cleaning and a battery indicator you can trust."],
    ["safety razor shaving kit men", "Simple shaving setup", "Choose the system that makes a clean, repeatable shave easiest for your skin."],
    ["gentle facial cleanser men fragrance free", "Gentle facial cleanser", "A basic cleanser should leave skin clean without turning the routine into a chemistry set."],
    ["mens face moisturizer spf 30", "Daily moisturizer with SPF", "One dependable morning step is easier to repeat than a crowded shelf."],
    ["matte hair clay men", "Matte hair product", "Start with a small amount and add only where shape or control is needed."],
    ["mens manicure nail grooming kit", "Compact nail kit", "The unglamorous maintenance kit that quietly does real work."],
  ],
  fitness: [
    ["resistance bands set handles workout", "Resistance-band set", "Useful for warmups, travel and progressive work without filling a room."],
    ["adjustable dumbbells pair home gym", "Adjustable dumbbells", "Compare adjustment speed, usable range, footprint and warranty before buying."],
    ["exercise mat thick nonslip", "Non-slip training mat", "Enough grip and space for floor work beats elaborate branding."],
    ["pull up bar doorway no screws", "Doorway pull-up bar", "Confirm door-frame compatibility and installation requirements first."],
    ["insulated shaker bottle stainless", "Training bottle", "A bottle that cleans easily and does not leak is the one that gets used."],
  ],
  life: [
    ["mens toiletry bag dopp kit water resistant", "Travel dopp kit", "A compact layout makes the everyday routine portable without packing the bathroom."],
    ["hardcover notebook professional men", "Everyday notebook", "Use it for commitments, decisions and the thoughts that should not stay in your head."],
    ["watch box organizer men", "Watch and essentials organizer", "Give everyday carry a fixed landing place instead of losing it around the house."],
    ["travel cable organizer electronics", "Cable organizer", "Keep chargers and adapters together so travel friction does not begin at the outlet."],
  ],
  skin: [
    ["gentle facial cleanser men fragrance free", "Gentle facial cleanser", "A basic cleanser should leave skin clean without turning the routine into a chemistry set."],
    ["mens face moisturizer spf 30", "Daily moisturizer with SPF", "One dependable morning step is easier to repeat than a crowded shelf."],
    ["fragrance free face moisturizer men", "Simple nighttime moisturizer", "Choose a formula your skin tolerates well enough to use consistently."],
  ],
  fragrance: [
    ["mens cologne discovery sample set", "Fragrance discovery set", "Wear one sample at a time and judge the dry-down before buying a full bottle."],
    ["refillable travel perfume atomizer", "Travel atomizer", "Carry a small amount without dragging the full bottle through every trip."],
    ["unscented deodorant men", "Unscented deodorant", "Keeps the base routine from fighting with the fragrance you chose."],
  ],
  shoes: [
    ["cedar shoe trees men", "Cedar shoe trees", "They help footwear dry, hold shape and make a smaller shoe rotation last longer."],
    ["shoe care kit leather men", "Leather shoe-care kit", "A brush, neutral conditioner and appropriate polish cover most basic maintenance."],
    ["long handle shoe horn men", "Long shoe horn", "Protects heel counters and makes maintained shoes easier to put on."],
  ],
  mobility: [
    ["resistance bands set mobility stretching", "Mobility bands", "A few useful resistance levels cover warmups and controlled range work."],
    ["high density foam roller", "Foam roller", "Choose a manageable density and use it as a tool, not a punishment."],
    ["exercise mat thick nonslip", "Non-slip training mat", "Enough grip and space for floor work beats elaborate branding."],
  ],
  sleep: [
    ["contoured sleep mask blackout", "Blackout sleep mask", "A comfortable light seal is more useful than decorative padding."],
    ["white noise machine bedroom", "White-noise machine", "Consistent sound can make a noisy room easier to manage."],
    ["sunrise alarm clock dimmable", "Sunrise alarm clock", "Compare light controls and a fully dimmable display before buying."],
  ],
};

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function amazonUrl(query) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${tag}`;
}

function chooseCatalog(path, text) {
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(text)?.[1] || "";
  const haystack = `${path} ${title}`.toLowerCase();
  if (/shoe|loafer|boot|sneaker/.test(haystack)) return catalog.shoes;
  if (/skin|face routine|sunscreen/.test(haystack)) return catalog.skin;
  if (/fragrance|smell|scent|cologne/.test(haystack)) return catalog.fragrance;
  if (/mobility|flexibility/.test(haystack)) return catalog.mobility;
  if (/sleep|recovery/.test(haystack)) return catalog.sleep;
  if (/groom|shav|beard|skin|hair|fragrance|razor|smell|scent|cologne/.test(haystack)) return catalog.grooming.slice(0, 3);
  if (/fitness|workout|strength|training|gym|posture|conditioning|mobility|recovery|sleep/.test(haystack)) return catalog.fitness.slice(0, 3);
  if (/style|wardrobe|shirt|trouser|suit|shoe|jacket|clothing|tailor/.test(haystack)) return catalog.style.slice(0, 3);
  return catalog.life.slice(0, 3);
}

function productsFor(path, text) {
  const normalized = path.replaceAll("\\", "/").toLowerCase();
  if (normalized === "electric-shaver-buying-guide.html") return catalog.electricShavers;
  if (normalized === "two-account-bill-system.html" || normalized === "mens-dress-shoe-fit-guide.html") return null;
  if (normalized === "adjustable-dumbbells-buying-guide.html") return catalog.adjustableDumbbells;
  if (normalized === "mens-raincoat-buying-guide.html") return catalog.raincoat;
  if (normalized === "dinner-party-timing-plan.html") return null;
  if (normalized === "garment-steamer-buying-guide.html") return catalog.steamer;
  if (normalized === "dandruff-vs-dry-scalp-guide.html" || normalized === "home-emergency-document-file.html") return null;
  if (normalized === "style.html") return catalog.style;
  if (normalized === "grooming.html") return catalog.grooming;
  if (normalized === "fitness.html") return catalog.fitness;
  if (normalized === "life.html") return catalog.life;
  if (normalized === "index.html") return [catalog.style[1], catalog.grooming[0], catalog.fitness[0], catalog.life[1]];
  if (normalized.startsWith("guides/")) return chooseCatalog(normalized, text);
  const nonRevenue = new Set(["404.html", "about.html", "join.html", "library.html", "privacy.html", "standards.html"]);
  if (normalized.endsWith(".html") && !nonRevenue.has(normalized)) return chooseCatalog(normalized, text);
  return null;
}

function moduleHtml(products) {
  const cards = products.map(([query, title, note]) => `
      <a class="commerce-card" href="${escapeHtml(amazonUrl(query))}" target="_blank" rel="sponsored nofollow noopener noreferrer" data-commercial-link="true" data-affiliate-active="true" data-affiliate-network="amazon" data-affiliate-tag="${tag}">
        <span>COMPARE ON AMAZON</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(note)}</p><b>See current options →</b>
      </a>`).join("");
  return `${markerStart}
  <section class="commerce-module section" aria-labelledby="bmc-commerce-heading">
    <p class="section-tag">THE EDITED KIT</p>
    <h2 id="bmc-commerce-heading">Useful things. Better reasons.</h2>
    <p class="commerce-intro">Product categories chosen to solve a defined problem. Compare specifications, fit and current reviews before spending.</p>
    <p class="affiliate-disclosure"><strong>Paid links:</strong> As an Amazon Associate I earn from qualifying purchases. You pay no additional cost.</p>
    <div class="commerce-grid">${cards}
    </div>
  </section>
  ${markerEnd}`;
}

function htmlFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (skipDirectories.has(entry)) continue;
    const path = resolve(directory, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...htmlFiles(path));
    else if (entry.toLowerCase().endsWith(".html")) files.push(path);
  }
  return files;
}

let pages = 0;
let links = 0;
for (const file of htmlFiles(root)) {
  const path = relative(root, file).replaceAll("\\", "/");
  const original = readFileSync(file, "utf8");
  const cleaned = original.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "");
  const products = productsFor(path, cleaned);
  if (!products) continue;
  if (!/<\/main>/i.test(cleaned)) throw new Error(`Missing </main> in ${path}`);
  const depth = path.split("/").length - 1;
  const stylesheet = `<link rel="stylesheet" href="${"../".repeat(depth)}affiliate-commerce.css">`;
  const withStyles = cleaned.includes("affiliate-commerce.css") ? cleaned : cleaned.replace(/<\/head>/i, `${stylesheet}</head>`);
  const next = withStyles.replace(/<\/main>/i, `${moduleHtml(products)}\n</main>`);
  writeFileSync(file, next);
  pages += 1;
  links += products.length;
}

console.log(`Beautiful Men's Club affiliate commerce: ${pages} revenue page(s), ${links} tagged link(s), tag=${tag}`);
