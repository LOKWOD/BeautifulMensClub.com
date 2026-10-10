import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const tag = "beautifulmensclub-20";
const markerStart = "<!-- BMC AFFILIATE COMMERCE -->";
const markerEnd = "<!-- END BMC AFFILIATE COMMERCE -->";
const skipDirectories = new Set([".git", "node_modules", ".wrangler"]);

const catalog = {
  hairStylingProducts: [
    ["mens matte hair clay", "Matte hair clays", "Compare the desired finish and hold with the exact ingredient declaration, directions, net contents, seller, sealed condition and return restrictions; a category name is not a standardized performance grade."],
    ["mens hair styling paste cream", "Hair styling pastes and creams", "Match the exact formula to hair length, density, texture and the intended amount of movement, then verify directions, warnings, fragrance, package size, seller and returns."],
    ["mens water based pomade", "Water-based hair pomades", "Check the maker's stated finish, hold and washout directions on the exact container, then compare ingredient label, net contents, seller and return terms without treating 'water-based' as a complete formula description."],
  ],
  undershirts: [
    ["mens v neck undershirt", "Men’s V-neck undershirts", "Compare neckline depth and width, shoulder and sleeve measurements, body length, exact fiber percentages, care instructions, pack count, seller and return terms."],
    ["mens crew neck undershirt", "Men’s crew-neck undershirts", "Check that the collar is meant to be visible or fully covered, then verify garment measurements, seam profile, color, fiber label, care and exact package."],
    ["mens moisture wicking undershirt", "Performance-fabric undershirts", "Verify the exact fiber composition and maker claims, then compare fit, opacity, seams, care, package variation and return restrictions without assuming one fabric suits every climate."],
  ],
  waterFlossers: [
    ["countertop water flosser adjustable pressure", "Countertop water flossers", "Compare the lowest controllable pressure, reservoir and hose handling, exact included tips, model-specific cleaning instructions, electrical label, seller and return terms."],
    ["cordless water flosser adjustable pressure", "Cordless water flossers", "Check filled weight, grip, refill access, pressure controls, charge and voltage label, water-resistance limits, exact-model manual and replacement-tip support."],
    ["water flosser replacement tips compatible model", "Model-specific replacement tips", "Match the complete handle model to the maker’s compatibility chart, then verify the tip identifier, intended use, pack contents, seller and replacement guidance."],
  ],
  polos: [
    ["mens pique polo shirt", "Men’s piqué polo shirts", "Compare finished garment measurements, exact fiber percentages, knit weight, collar and placket construction, care label, seller and return terms."],
    ["mens cotton jersey polo shirt", "Men’s jersey polo shirts", "Check shoulder, chest, sleeve, hem and length measurements, full fiber disclosure, opacity, recovery, sewn-in care and the exact selected variation."],
    ["mens long sleeve polo shirt", "Men’s long-sleeve polo shirts", "Match sleeve and cuff dimensions to the intended layer, then verify the knit, collar behavior, garment length, care instructions, seller and returns."],
  ],
  slippers: [
    ["mens closed back slippers rubber sole", "Closed-back men’s slippers", "Compare the exact size chart, heel retention, interior measurements, upper and lining disclosure, sole construction, care instructions, intended surfaces, seller and return terms."],
    ["mens backless house slippers indoor", "Backless men’s house slippers", "Match quick entry to the actual floor and route, then verify toe room, instep fit, sole flex, upper and lining materials, cleaning method and return restrictions."],
    ["mens indoor outdoor slippers", "Indoor-outdoor men’s slippers", "Confirm the exact model permits the planned outdoor use, then check tread, edge coverage, water limits, cleaning, sock-and-insert fit, seller and return window."],
  ],
  noseEarTrimmers: [
    ["mens nose ear hair trimmer washable head", "Nose and ear trimmers with guarded washable heads", "Verify the exact permitted zones, cutter housing, rinse limits, drying steps, power source, replacement-head support, warranty and seller terms."],
    ["mens nose trimmer eyebrow attachment guards", "Detail trimmers with documented eyebrow guards", "Confirm that the exact model includes the shown brow combs and states their usable lengths, permitted areas, cleaning method and replacement identifiers."],
    ["mens nose ear trimmer replaceable head travel lock", "Travel-ready nose and ear trimmers", "Check the protective cap, travel lock, battery chemistry, current travel rules, replacement-head availability, exact manual and return policy."],
  ],
  scarves: [
    ["mens wool scarf winter", "Men’s wool and wool-blend scarves", "Compare finished dimensions, exact fiber percentages, weave, edge construction, sewn-in care instructions, seller and return terms."],
    ["mens cashmere scarf", "Men’s cashmere and specialty-wool scarves", "Verify the exact specialty-fiber percentage, country of origin, dimensions, construction, care requirements and seller rather than trusting a luxury-style product title."],
    ["mens cotton scarf lightweight", "Lightweight cotton and cotton-blend scarves", "Check the complete fiber label, length, width, weave density, intended season, colorfastness instructions, care label and return window."],
  ],
  bodyGroomers: [
    ["mens body groomer adjustable guards wet dry", "Body groomers with adjustable guards", "Verify the exact permitted body zones, guard range, wet-or-dry instructions, cleaning method, replacement heads, warranty and seller terms."],
    ["mens body trimmer sensitive areas guards", "Body trimmers with zone-specific guards", "Check that the exact model and attachment expressly authorize the planned area, then compare guard retention, handling, cleaning and parts support."],
    ["mens body groomer replacement blade available", "Body groomers with replaceable cutting heads", "Confirm the exact replacement-head identifier and current support before buying; a similar-looking foil or cutter is not proof of compatibility."],
  ],
  casualJackets: [
    ["mens field jacket casual", "Men’s field jackets", "Compare finished measurements, layer room, pocket layout, shell and lining materials, weather limits, exact care guidance, seller and return terms."],
    ["mens harrington jacket", "Men’s Harrington-style jackets", "Check collar and hem construction, garment measurements, lining, closure quality, intended conditions, care instructions and the exact seller."],
    ["mens chore jacket", "Men’s chore jackets", "Compare shoulder and chest movement, straight-hem length, pocket depth, complete fiber disclosure, seam construction, cleaning and returns."],
  ],
  ties: [
    ["mens silk necktie solid", "Solid silk neckties", "Compare maximum width, total length, exact fiber disclosure, weave, construction, color accuracy, maker care guidance, seller and return terms."],
    ["mens grenadine silk tie", "Textured grenadine-style ties", "Verify the exact weave and fiber content rather than relying on the style name, then check dimensions, snag risk, construction and returns."],
    ["mens wool knit tie", "Textured wool and knit ties", "Match the fiber, texture, width, end shape and knot bulk to the season, collar, lapels and care routine you actually use."],
  ],
  workBags: [
    ["mens laptop briefcase work bag", "Men’s laptop briefcases", "Compare documented internal laptop-sleeve dimensions, loaded carry comfort, handle and strap attachment, closures, materials, care and return terms."],
    ["mens work backpack laptop professional", "Professional work backpacks", "Match the exact laptop and commute, then verify strap range, back structure, device protection, weather limits, hardware and warranty support."],
    ["mens messenger bag laptop work", "Men’s messenger work bags", "Check usable device dimensions, shoulder-strap geometry, closure control, access, lining, stress-point reinforcement and the seller’s exact return policy."],
  ],
  eyeglasses: [
    ["hard eyeglass case protective", "Protective hard eyeglass cases", "Match the interior dimensions and closure to the exact frame; a case should protect the lenses without squeezing the bridge or temples."],
    ["microfiber eyeglass lens cleaning cloth", "Microfiber lens-cleaning cloths", "Choose washable cloths intended for optical lenses, keep them free of grit and follow the lens maker's cleaning directions."],
    ["eyeglass repair kit precision screws nose pads", "Basic eyeglass repair kits", "Use only compatible screws or pads for minor maker-approved service; alignment, cracked frames and loose lenses belong with a qualified optician."],
  ],
  hairClippers: [
    ["mens hair clippers adjustable taper lever guards", "Hair clippers with a documented guard system", "Compare the exact blade range, taper control, guard measurements, hand fit, cleaning instructions, replacement parts, warranty and seller terms."],
    ["cordless hair clippers mens haircut kit", "Cordless hair-clipper kits", "Verify runtime, charge behavior, included guard sizes, charger label, blade maintenance, battery-service route and the exact model manual."],
    ["corded hair clippers mens haircut", "Corded hair clippers", "Compare blade and guard compatibility, cord length and strain relief, grip, lubrication instructions, replacement support and return terms."],
  ],
  watches: [
    ["mens quartz watch", "Men's quartz watches", "Compare case width, lug-to-lug length, thickness, strap range, exact movement instructions, warranty and seller terms."],
    ["mens solar watch", "Men's solar-powered watches", "Verify the exact charging guidance, case dimensions, water-resistance instructions, service support and authorized seller."],
    ["mens automatic watch", "Men's mechanical watches", "Compare fit, caliber, stated accuracy range, power reserve, service route, water-resistance instructions and return terms."],
  ],
  umbrellas: [
    ["compact travel umbrella automatic", "Compact commuter umbrellas", "Compare closed length, weight, opening sequence, handle control and exact wind-test evidence."],
    ["mens stick umbrella automatic", "Full-length walking umbrellas", "Compare canopy measurement, shaft length, grip, tips, frame joints and repair support."],
    ["vented golf umbrella", "Wide vented umbrellas", "Compare real open size, carry burden, crowd clearance, vent construction and return terms."],
  ],
  wallets: [
    ["mens slim bifold wallet leather", "Slim bifold wallets", "Compare the exact filled dimensions, card and bill layout, leather disclosure, edge construction, seller and return terms."],
    ["mens slim card holder wallet", "Slim card-holder wallets", "Match the stated slot capacity to your edited daily load, then check access, retention, material disclosure and filled pocket fit."],
    ["mens zip wallet card cash", "Zipped card-and-cash wallets", "Verify the closed dimensions, zipper path, interior layout, materials, hardware, currency fit and exact seller details."],
  ],
  dressSocks: [
    ["mens over the calf dress socks", "Over-the-calf dress socks", "Compare the maker's size chart, height, full fiber percentages, toe construction, care label and exact seller terms."],
    ["mens crew socks lightweight", "Lightweight everyday crew socks", "Match thickness to the shoe volume, then check heel placement, cuff comfort, seam construction, laundering and return restrictions."],
    ["mens wool boot socks lightweight", "Lightweight wool-blend boot socks", "Verify the exact fiber blend, cushion zones, height, shoe fit, care directions and the conditions the manufacturer actually claims."],
  ],
  layering: [
    ["mens merino wool base layer long sleeve", "Merino-wool base layers", "Compare exact fiber percentages, garment measurements, care instructions and the weight that fits your actual activity level."],
    ["mens lightweight fleece jacket midlayer", "Lightweight fleece midlayers", "Choose enough warmth for the job without crowding the shoulders and sleeves of the outer layer."],
    ["mens waterproof breathable rain shell jacket", "Waterproof rain shells", "Verify the exact model's weather claim, seam construction, hood controls, layer room, care instructions and return terms."],
  ],
  safetyRazor: [
    ["double edge safety razor men closed comb", "Double-edge safety razors", "Compare head geometry, blade alignment, handle grip, loading instructions, materials and replacement-blade compatibility."],
    ["double edge razor blade sampler pack", "Double-edge blade samplers", "Use a small sampler to compare compatible blades without committing to a bulk pack before you know what suits the razor and your skin."],
    ["sensitive skin shaving cream fragrance free", "Shaving creams for a lubricated shave", "Choose a formula your skin tolerates and use enough water and lubrication to reduce needless scraping and repeated passes."],
  ],
  winterBoots: [
    ["mens waterproof leather winter boots", "Men's waterproof leather winter boots", "Verify exact-model fit, membrane or seam construction, insulation placement, outsole claims, care directions, seller and return terms."],
    ["mens insulated snow boots", "Men's insulated snow boots", "Compare sock-and-footbed fit, shaft height, liner design, weight, drying instructions and the limits of any temperature claim."],
    ["mens waterproof winter hiking boots", "Men's waterproof winter hiking boots", "Check last shape, heel control, usable tread, water-resistance disclosure, intended terrain, current seller and return window."],
  ],
  gloves: [
    ["mens leather gloves touchscreen insulated", "Men’s leather commuter gloves", "Check the maker’s hand measurements, lining and shell disclosure, cuff dimensions, exact weather claim, touchscreen construction, care instructions and return terms."],
    ["mens waterproof insulated gloves touchscreen", "Weather-protective insulated gloves", "Compare complete-glove weather claims, insulation and bulk, grip, cuff closure, touchscreen fit, exact use limits and current seller terms."],
    ["mens wool gloves touchscreen", "Men’s wool and wool-blend gloves", "Verify fiber percentages, lining, hand measurements, fingertip construction, care label, device compatibility and the seller’s return policy."],
  ],
  chinos: [
    ["mens straight fit chino pants", "Men's straight-fit chinos", "Compare the exact waist, rise, seat, thigh, knee, hem, inseam, fiber percentages, care label, seller and return terms."],
    ["mens athletic fit chino pants", "Men's athletic-fit chinos", "Verify where the extra room is placed, then compare the actual taper, rise, stretch content, care directions and finished measurements."],
    ["mens tapered chino pants", "Men's tapered chinos", "Check the upper-block measurements before judging the taper, and match the hem opening to the shoes and dress level you intend to wear."],
  ],
  nailCare: [
    ["stainless steel fingernail clipper sharp curved", "Fingernail clippers", "Compare jaw size, edge alignment, lever grip, protective storage, cleaning directions, exact seller and return terms."],
    ["washable glass nail file fingernails case", "Washable fingernail files", "Check usable size, surface condition, edge finish, cleaning instructions and whether the protective case actually fits."],
    ["soft bristle nail brush hand cleaning", "Soft nail brushes", "Choose a controllable brush that can dry fully; use it for ordinary surface cleaning rather than digging beneath painful or lifted nails."],
  ],
  dressShirts: [
    ["mens white dress shirt long sleeve", "Men's white dress shirts", "Compare the exact garment measurements, collar structure, opacity, fiber percentages, care instructions, seller and return terms."],
    ["mens oxford cloth button down shirt", "Men's Oxford-cloth button-down shirts", "Check collar roll, fabric weight, garment measurements, intended tuck length, sewn-in care label and current seller details."],
    ["mens non iron dress shirt", "Men's easy-care dress shirts", "Verify what the maker means by non-iron, then compare fiber content, finish disclosure, fit, care directions and return restrictions."],
  ],
  hairDryers: [
    ["hair dryer adjustable heat speed cool shot concentrator", "Hair dryers with separate heat and speed controls", "Compare the electrical label, integral protective plug, airflow and heat controls, included concentrator, intake access, exact manual and return terms."],
    ["compact hair dryer diffuser concentrator attachments", "Compact dryers with useful attachments", "Verify the exact-model diffuser and concentrator fit, weight, storage dimensions, voltage, cord, protective device and cleaning instructions."],
    ["dual voltage travel hair dryer folding", "Dual-voltage travel hair dryers", "Confirm the voltage range on the exact electrical label and manual; a plug adapter alone does not convert voltage or make bathroom use safe."],
  ],
  underwear: [
    ["mens cotton boxer briefs", "Men's cotton boxer briefs", "Compare rise, inseam, pouch and seam layout, exact fiber percentages, waistband construction, care instructions and return restrictions."],
    ["mens cotton briefs", "Men's cotton briefs", "Check the rise, seat coverage, leg opening, fly design, fiber label, care requirements and exact seller terms."],
    ["mens woven boxers", "Men's woven boxers", "Compare rise, seat volume, side seams, fly construction, fabric label and the room available beneath your intended trousers."],
  ],
  jeans: [
    ["mens straight fit jeans", "Men's straight-fit jeans", "Compare rise, seat, thigh, knee, hem opening, fiber percentages, care instructions and exact-garment measurements."],
    ["mens athletic fit jeans", "Men's athletic-fit jeans", "Look for documented room through the seat and thigh, then verify the actual taper, rise, stretch content and return terms."],
    ["mens relaxed fit jeans", "Men's relaxed-fit jeans", "Check where the extra ease is placed, how the leg falls over your footwear and whether the finished dimensions match a pair you own."],
  ],
  belts: [
    ["mens leather dress belt", "Men's leather dress belts", "Verify the exact strap width, maker's sizing method, material disclosure, buckle construction and return terms."],
    ["mens casual leather belt", "Men's casual leather belts", "Compare loop fit, strap composition, edge treatment, hole spacing, hardware attachment and current seller details."],
    ["mens braided belt", "Men's braided belts", "Check the weave material, stretch, usable adjustment points, buckle width and compatibility with the trousers you actually wear."],
  ],
  electricToothbrushes: [
    ["electric toothbrush soft bristles pressure sensor timer", "Electric toothbrushes with pressure feedback", "Compare soft-bristled head options, the pressure signal, timer behavior, charging setup, exact-model instructions and return terms."],
    ["electric toothbrush replacement heads soft bristle", "Soft replacement brush heads", "Verify the exact handle-and-head compatibility chart, seller, bristle type, pack count and recurring cost before ordering."],
    ["ventilated electric toothbrush travel case", "Ventilated toothbrush travel cases", "Match the case to the exact handle and head, and let the brush dry before enclosing it for travel."],
  ],
  overcoats: [
    ["mens wool overcoat knee length", "Men's knee-length wool overcoats", "Verify fiber percentages, garment measurements over your real layers, construction, care instructions and return terms."],
    ["mens single breasted wool overcoat", "Men's single-breasted overcoats", "Compare closed-front fit, coat length, lining, pocket construction and the exact weather claims for each garment."],
    ["mens double breasted wool overcoat", "Men's double-breasted overcoats", "Check chest overlap, button position, seated comfort, layer room and alteration limits before buying."],
  ],
  sweaters: [
    ["mens merino wool crewneck sweater", "Men's merino-wool sweaters", "Verify the exact fiber percentages, garment measurements, knit weight, sewn-in care instructions and return terms."],
    ["mens lambswool crewneck sweater", "Men's lambswool sweaters", "Compare fiber labels, texture, layer fit, rib recovery, care demands and the seller's exact-item photographs."],
    ["mens cotton crewneck sweater", "Men's cotton sweaters", "Check the fiber label, garment measurements, knit density, laundering instructions and expected use in your climate."],
  ],
  walkingPads: [
    ["under desk walking pad treadmill", "Under-desk walking pads", "Compare usable belt dimensions, user limit, intended speed range, controls, electrical requirements and the exact model manual."],
    ["folding walking pad treadmill handrail", "Folding walking pads with handrails", "Verify deployed footprint, rail locking, safety key, walking-versus-running modes and manufacturer-approved storage orientation."],
    ["treadmill equipment mat walking pad", "Walking-pad equipment mats", "Match the mat to the machine footprint and floor type; a mat may protect a surface but cannot guarantee quiet operation."],
  ],
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
  sunscreen: [
    ["broad spectrum sunscreen spf 30 face fragrance free", "Broad-spectrum face sunscreens", "Compare the exact Drug Facts label, SPF, broad-spectrum status, active ingredients, directions, expiration, seller and return terms."],
    ["broad spectrum water resistant sunscreen spf 30 body", "Water-resistant body sunscreens", "Verify the exact 40- or 80-minute water-resistance statement, application directions, package size, warnings and seller."],
    ["broad spectrum sunscreen stick spf 30", "Broad-spectrum sunscreen sticks", "Check SPF, broad-spectrum and water-resistance labeling; a convenient format still requires complete, even application as directed."],
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
  if (normalized === "mens-hair-styling-product-guide.html") return catalog.hairStylingProducts;
  if (normalized === "auto-insurance-renewal-review-checklist.html" || normalized === "wall-art-hanging-plan.html") return null;
  if (normalized === "mens-undershirt-buying-guide.html") return catalog.undershirts;
  if (normalized === "stationary-exercise-bike-buying-setup-guide.html" || normalized === "checking-account-fee-overdraft-review-checklist.html") return null;
  if (normalized === "mens-water-flosser-buying-guide.html") return catalog.waterFlossers;
  if (normalized === "portable-space-heater-buying-safety-plan.html" || normalized === "flight-delay-cancellation-checklist.html") return null;
  if (normalized === "mens-polo-shirt-buying-guide.html") return catalog.polos;
  if (normalized === "medicine-cabinet-inventory-storage-disposal-plan.html" || normalized === "calendar-invite-etiquette-guide.html") return null;
  if (normalized === "mens-slipper-buying-guide.html") return catalog.slippers;
  if (normalized === "cardio-intensity-talk-test-guide.html" || normalized === "roadside-emergency-kit-breakdown-plan.html") return null;
  if (normalized === "mens-nose-ear-hair-trimmer-buying-guide.html") return catalog.noseEarTrimmers;
  if (normalized === "home-dehumidifier-buying-moisture-plan.html" || normalized === "contractor-estimate-comparison-checklist.html") return null;
  if (normalized === "mens-scarf-buying-guide.html") return catalog.scarves;
  if (normalized === "clothes-dryer-vent-safety-plan.html" || normalized === "hospital-visit-etiquette-guide.html") return null;
  if (normalized === "mens-body-groomer-buying-guide.html") return catalog.bodyGroomers;
  if (normalized === "refrigerator-freezer-food-safety-plan.html" || normalized === "coffee-brewing-ratio-guide.html") return null;
  if (normalized === "mens-casual-jacket-buying-guide.html") return catalog.casualJackets;
  if (normalized === "power-strip-extension-cord-safety-guide.html" || normalized === "how-to-give-constructive-feedback.html") return null;
  if (normalized === "mens-tie-buying-guide.html") return catalog.ties;
  if (normalized === "strength-training-rest-period-guide.html" || normalized === "debt-collection-contact-checklist.html") return null;
  if (normalized === "mens-fragrance-buying-guide.html") return catalog.fragrance;
  if (normalized === "portable-generator-safety-plan.html" || normalized === "how-to-write-a-thank-you-note.html") return null;
  if (normalized === "mens-gloves-buying-guide.html") return catalog.gloves;
  if (normalized === "home-flood-cleanup-first-48-hours.html" || normalized === "how-to-resign-professionally.html") return null;
  if (normalized === "mens-sunscreen-buying-guide.html") return catalog.sunscreen;
  if (normalized === "post-workout-soreness-recovery-guide.html" || normalized === "how-to-host-a-game-night.html") return null;
  if (normalized === "mens-work-bag-buying-guide.html") return catalog.workBags;
  if (normalized === "home-first-aid-kit-inventory-plan.html" || normalized === "how-to-split-a-restaurant-bill.html") return null;
  if (normalized === "mens-eyeglasses-buying-guide.html") return catalog.eyeglasses;
  if (normalized === "home-smoke-alarm-plan.html" || normalized === "digital-account-recovery-plan.html") return null;
  if (normalized === "mens-hair-clipper-buying-guide.html") return catalog.hairClippers;
  if (normalized === "workout-hydration-heat-plan.html" || normalized === "consumer-complaint-resolution-playbook.html") return null;
  if (normalized === "mens-watch-buying-guide.html") return catalog.watches;
  if (normalized === "home-ladder-buying-safety-guide.html" || normalized === "how-to-ask-for-a-raise.html") return null;
  if (normalized === "mens-umbrella-buying-guide.html") return catalog.umbrellas;
  if (normalized === "hearing-protection-earplugs-earmuffs-guide.html" || normalized === "how-to-decline-an-invitation.html") return null;
  if (normalized === "mens-wallet-buying-guide.html") return catalog.wallets;
  if (normalized === "home-water-shutoff-leak-plan.html" || normalized === "how-to-apologize-and-repair.html") return null;
  if (normalized === "mens-socks-buying-guide.html") return catalog.dressSocks;
  if (normalized === "home-radon-test-guide.html" || normalized === "funeral-wake-etiquette-guide.html") return null;
  if (normalized === "mens-fall-layering-guide.html") return catalog.layering;
  if (normalized === "safety-razor-buying-guide.html") return catalog.safetyRazor;
  if (normalized === "home-emergency-kit-rotation-checklist.html") return null;
  if (normalized === "mens-winter-boot-buying-guide.html") return catalog.winterBoots;
  if (normalized === "home-fire-escape-plan.html" || normalized === "good-houseguest-checklist.html") return null;
  if (normalized === "mens-chino-buying-guide.html") return catalog.chinos;
  if (normalized === "resistance-band-buying-safety-guide.html" || normalized === "home-wifi-security-checklist.html") return null;
  if (normalized === "mens-fingernail-care-guide.html") return catalog.nailCare;
  if (normalized === "home-blood-pressure-monitor-guide.html" || normalized === "carbon-monoxide-alarm-plan.html") return null;
  if (normalized === "mens-dress-shirt-buying-guide.html") return catalog.dressShirts;
  if (normalized === "credit-freeze-guide.html" || normalized === "how-to-introduce-people.html") return null;
  if (normalized === "mens-hair-dryer-buying-guide.html") return catalog.hairDryers;
  if (normalized === "home-inventory-insurance-system.html" || normalized === "indoor-rowing-machine-setup-technique-guide.html") return null;
  if (normalized === "mens-underwear-buying-guide.html") return catalog.underwear;
  if (normalized === "mens-foot-care-routine.html" || normalized === "how-to-give-a-toast.html") return null;
  if (normalized === "mens-jeans-fit-buying-guide.html") return catalog.jeans;
  if (normalized === "emergency-fund-system.html" || normalized === "office-chair-setup-guide.html") return null;
  if (normalized === "mens-belt-buying-guide.html") return catalog.belts;
  if (normalized === "deodorant-vs-antiperspirant-for-men.html" || normalized === "hotel-room-arrival-check.html") return null;
  if (normalized === "electric-toothbrush-buying-guide.html") return catalog.electricToothbrushes;
  if (normalized === "strength-training-warm-up-guide.html" || normalized === "weeknight-kitchen-closing-shift.html") return null;
  if (normalized === "mens-overcoat-buying-guide.html") return catalog.overcoats;
  if (normalized === "day-hike-planning-guide.html" || normalized === "home-power-outage-plan.html") return null;
  if (normalized === "mens-sweater-buying-guide.html") return catalog.sweaters;
  if (normalized === "mens-dry-hands-care-guide.html" || normalized === "overnight-guest-room-checklist.html") return null;
  if (normalized === "walking-pad-buying-guide.html") return catalog.walkingPads;
  if (normalized === "home-fire-extinguisher-guide.html" || normalized === "how-to-order-wine-at-a-restaurant.html") return null;
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
  if (!products) {
    if (cleaned !== original) writeFileSync(file, cleaned);
    continue;
  }
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
