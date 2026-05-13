/* =========================================================================
   77 MARINE — DATA
   ------------------------------------------------------------------------
   Editable content. Updating an image or copy here changes the site
   without touching markup. KHA namespace is retained for backwards-compat
   with templates; SEVEN77 is an alias.
   ========================================================================= */

window.KHA = window.KHA || {};
window.SEVEN77 = window.SEVEN77 || window.KHA;

/* ---------- Boat models -------------------------------------------------
   Each model carries an Arabic-rooted name reflecting Gulf maritime
   heritage, alongside a clean English class descriptor and full spec.
   Categories: patrol | leisure | fishing | utility | passenger | commercial
   ----------------------------------------------------------------------- */
window.KHA.models = [
  {
    id: "77m-shaheen-32",
    name: "Shaheen 32",
    subtitle: "Patrol · Rapid Response",
    arabic: "شاهين",
    meaning: "The Arabian falcon — speed, precision, command of the sky.",
    category: "patrol",
    categoryLabel: "Patrol / Security",
    length: "9.7 m",
    capacity: "8 personnel",
    use: "Coast guard, security, rapid response",
    description:
      "High-strength fiberglass patrol hull engineered for sustained Gulf operations. Deep-V planing geometry, hardened deck, and command-grade systems integration.",
    image: "assets/images/boats/patrol-zahir-action.jpg",
  },
  {
    id: "77m-saqr-44",
    name: "Saqr 44",
    subtitle: "Patrol · Offshore Command",
    arabic: "صقر",
    meaning: "The hunting falcon — endurance, range, unwavering focus.",
    category: "patrol",
    categoryLabel: "Patrol / Security",
    length: "13.4 m",
    capacity: "14 personnel",
    use: "Government deployment, offshore patrol",
    description:
      "Reinforced composite construction with a long-range patrol configuration. FLIR-ready electrical bay, navigation suite integration, and operational endurance for extended Gulf missions.",
    image: "assets/images/boats/patrol-police-foredeck.jpg",
  },
  {
    id: "77m-lulu-28",
    name: "Lulu 28",
    subtitle: "Leisure · Day Cruiser",
    arabic: "لؤلؤة",
    meaning: "Pearl — the original treasure of the Gulf, refined and rare.",
    category: "leisure",
    categoryLabel: "Leisure",
    length: "8.5 m",
    capacity: "10 guests",
    use: "Private day cruising, coastal touring",
    description:
      "Refined fiberglass day cruiser with marine-grade finishes, a clean owner-driven layout, and a hull tuned for stable Gulf cruising and quiet running.",
    image: "assets/images/boats/leisure-burj-khalifa.jpg",
  },
  {
    id: "77m-dabran-38",
    name: "Dabran 38",
    subtitle: "Leisure · Premium Cruiser",
    arabic: "الدبران",
    meaning: "The Pleiades-companion star — guidance for Arab navigators since antiquity.",
    category: "leisure",
    categoryLabel: "Leisure",
    length: "11.6 m",
    capacity: "12 guests",
    use: "Premium leisure, charter, hospitality",
    description:
      "Custom interior fit-out with quilted upholstery, teak detailing, and generous beam. The composite hull is tuned for stable Gulf cruising and overnight capability.",
    image: "assets/images/boats/leisure-anchored-shallows.jpg",
  },
  {
    id: "77m-sanbooq-26",
    name: "Sanbooq 26",
    subtitle: "Fishing · Sport / Inshore",
    arabic: "سنبوق",
    meaning: "The classic Gulf pearling craft — a heritage name for a modern fishing platform.",
    category: "fishing",
    categoryLabel: "Fishing",
    length: "7.9 m",
    capacity: "6 anglers",
    use: "Sport fishing, inshore / offshore",
    description:
      "Self-bailing fiberglass deck, rod-ready layout, raised T-top, and a hull designed for chop and long days at sea. Built for serious sport and commercial fishing.",
    image: "assets/images/boats/fishing-zahir-planing.jpg",
  },
  {
    id: "77m-baggara-30",
    name: "Baggara 30",
    subtitle: "Utility · Workboat",
    arabic: "بقارة",
    meaning: "A traditional Gulf cargo and pearling dhow — built for work, not show.",
    category: "utility",
    categoryLabel: "Utility",
    length: "9.1 m",
    capacity: "8 + payload",
    use: "Crew transfer, port operations, support",
    description:
      "Workboat-grade composite hull built for heavy duty cycles, continuous operational use, and configurable deck layouts for cargo, dive, or crew-transfer missions.",
    image: "assets/images/boats/model-white-dp4130.jpg",
  },
  {
    id: "77m-bahar-42",
    name: "Bahar 42",
    subtitle: "Passenger · Transport",
    arabic: "بحر",
    meaning: "Sea — the open horizon, the connecting line between every emirate.",
    category: "passenger",
    categoryLabel: "Passenger / Transport",
    length: "12.8 m",
    capacity: "24 passengers",
    use: "Marina transfer, tourism, crew shuttle",
    description:
      "Comfort-tuned cabin layout, low-noise hull, climate-ready interior, and durable composite finish for daily passenger and crew-shuttle service across Gulf routes.",
    image: "assets/images/boats/model-foredeck-skyline.jpg",
  },
  {
    id: "77m-bateel-50",
    name: "Bateel 50",
    subtitle: "Commercial · Custom Mission",
    arabic: "بطيل",
    meaning: "A deep-sea voyaging dhow — engineered for distance and serious work.",
    category: "commercial",
    categoryLabel: "Custom Commercial",
    length: "15.2 m",
    capacity: "Configurable",
    use: "Survey, supply, dive, custom mission",
    description:
      "Mission-built composite platform. Configured to your operational specification from the keel up — survey, supply, dive support, or bespoke commercial mission.",
    image: "assets/images/boats/model-blue-trailer.jpg",
  },
];

window.KHA.modelCategories = [
  { id: "all", label: "All Boats" },
  { id: "patrol", label: "Patrol" },
  { id: "leisure", label: "Leisure" },
  { id: "fishing", label: "Fishing" },
  { id: "utility", label: "Utility" },
  { id: "passenger", label: "Passenger" },
  { id: "commercial", label: "Commercial" },
];

/* ---------- Services ---------------------------------------------------- */
window.KHA.services = [
  {
    num: "01",
    title: "Custom Boat Manufacturing",
    body: "Fiberglass boats built to client specification — patrol, leisure, fishing, commercial, government.",
  },
  {
    num: "02",
    title: "Fiberglass Fabrication",
    body: "Marine-grade composite layup, hand-finished hulls, structural reinforcement, and quality-controlled molds.",
  },
  {
    num: "03",
    title: "Boat Maintenance",
    body: "Scheduled and emergency maintenance programs that keep your fleet operational across Gulf conditions.",
  },
  {
    num: "04",
    title: "Refits & Upgrades",
    body: "Hull refinishing, deck rework, electrical re-commissioning, layout reconfiguration, and full re-fit-out.",
  },
  {
    num: "05",
    title: "Hull Repair",
    body: "Structural fiberglass and gelcoat repair, impact damage assessment, lamination correction, and water-ingress recovery.",
  },
  {
    num: "06",
    title: "Marine Electrical",
    body: "Wiring inspections, navigation electronics, lighting, communications, and 12/24V system support.",
  },
  {
    num: "07",
    title: "Mechanical Coordination",
    body: "Engine, drive, steering, and fuel-system coordination with trusted mechanical partners.",
  },
  {
    num: "08",
    title: "Fleet Support",
    body: "Multi-vessel maintenance and uptime programs for government, commercial, and operational fleets.",
  },
  {
    num: "09",
    title: "Marine Consultation",
    body: "Hull selection, design review, build planning, and long-term operational guidance for marine programs.",
  },
  {
    num: "10 · Upon Request",
    title: "Steel Vessel Production",
    body: "Regional coastal and offshore projects continue to drive demand for steel vessels such as landing crafts, barges, and support craft. A production-focused model enables scalable delivery of durable, project-ready marine assets for infrastructure and logistics operations.",
  },
];

/* ---------- Maintenance items ------------------------------------------ */
window.KHA.maintenance = [
  { title: "Preventive Maintenance", body: "Scheduled inspection and service plans calibrated to your operational cycle." },
  { title: "Hull Inspection", body: "Above and below the waterline assessment of fiberglass integrity, stress points, and finish condition." },
  { title: "Fiberglass Repair", body: "Composite repair, lamination correction, and reinforcement where loads concentrate." },
  { title: "Gelcoat Repair", body: "Surface restoration to original finish standard — colour, gloss, and protection." },
  { title: "Detailing", body: "Hull, deck, and interior detailing for owner-grade presentation and protective finish." },
  { title: "Electrical Systems", body: "Inspection and recommissioning of 12/24V systems, lighting, navigation, and communications." },
  { title: "Mechanical Coordination", body: "Engine, drive, and steering checks coordinated with mechanical partners." },
  { title: "Annual Service Plans", body: "Year-long programs covering scheduled service, inspections, and priority response." },
  { title: "Emergency Response", body: "Rapid assessment and response for unscheduled marine events and damage." },
  { title: "Fleet Maintenance", body: "Operational uptime programs for government, commercial, and patrol fleets." },
];

/* ---------- Stats ------------------------------------------------------- */
window.KHA.stats = [
  { num: "20+", label: "Years on Gulf Waters" },
  { num: "300+", label: "Vessels Delivered" },
  { num: "7", label: "Emirates Served" },
  { num: "24/7", label: "Marine Support" },
];

/* ---------- Elite client logos ----------------------------------------- */
window.KHA.clients = [
  { name: "Dubai Police", file: "assets/logos/clients/dubai-police-logo-black.png" },
  { name: "UAE Civil Defense", file: "assets/logos/clients/Dubai-civil-defense-logo-black.png" },
  { name: "ADNOC", file: "assets/logos/clients/adnoc-logo-black.png" },
  { name: "Government of Dubai", file: "assets/logos/clients/dubai-government-logo-black.png" },
  { name: "UAE Coast Guard", file: "assets/logos/clients/coast-guards-logo-black.png" },
  { name: "Abu Dhabi Ports", file: "assets/logos/clients/abudhabi-ports-logo-black.png" },
];

/* ---------- Projects / case studies ------------------------------------ */
window.KHA.projects = [
  {
    title: "Government Patrol Fleet Build",
    tag: "Patrol",
    body: "Multi-vessel fiberglass patrol program for sustained Gulf operations — switch panels, FLIR-ready electrical, hardened decks.",
    image: "assets/images/boats/patrol-switch-panel.jpg",
  },
  {
    title: "Premium Leisure Build",
    tag: "Leisure",
    body: "Custom-spec fiberglass leisure vessel with quilted upholstery, teak deck, and Gulf-tuned hull profile.",
    image: "assets/images/boats/showcase-evening-bow.jpg",
  },
  {
    title: "Manufacturing — Hull Programme",
    tag: "Manufacturing",
    body: "Composite hull build from molded layup through scaffold-finishing, mold release, and surface preparation.",
    image: "assets/images/boats/manufacturing-hull-construction.jpg",
  },
  {
    title: "Interior & Fit-Out",
    tag: "Refit",
    body: "Full interior fit-out: custom cabinetry, refrigeration, teak flooring, and electrical recommissioning.",
    image: "assets/images/boats/manufacturing-cabin-fitout.jpg",
  },
  {
    title: "Cockpit & Helm Integration",
    tag: "Systems",
    body: "Triple-display Garmin navigation, Mercury engine controls, and command-grade cockpit layout for offshore use.",
    image: "assets/images/boats/showcase-cockpit-garmin.jpg",
  },
  {
    title: "Fleet Delivery & Sea Trial",
    tag: "Delivery",
    body: "Quad-engine commercial platform delivered with full sea-trial, owner training, and ongoing service plan.",
    image: "assets/images/boats/power-mercury-wake.jpg",
  },
];

/* ---------- FAQs (used on Contact / Maintenance) ----------------------- */
window.KHA.faqs = [
  { q: "Where is 77 Marine based?", a: "Our facilities are located in the United Arab Emirates, serving clients across the Gulf and beyond." },
  { q: "Do you build custom boats?", a: "Yes — every 77 Marine project starts with a consultation and is engineered to operational and aesthetic specification." },
  { q: "What materials do you use?", a: "Marine-grade fiberglass and composite materials selected for Gulf temperature, salinity, and load conditions." },
  { q: "Do you support government and commercial fleets?", a: "Yes — patrol, security, port, and commercial fleets are a core focus of our work." },
  { q: "Can you maintain boats not built by 77 Marine?", a: "Yes — our maintenance, fiberglass repair, and refit services are open to vessels of all manufacturers." },
  { q: "How do I request a quote?", a: "Use the contact form, WhatsApp us directly, or call. We respond to inquiries within one working day." },
];

/* ---------- Process timeline ------------------------------------------- */
window.KHA.process = [
  { num: "01", title: "Consultation", body: "We begin with operational, aesthetic, and budget alignment — establishing what the vessel must do." },
  { num: "02", title: "Design & Hull Planning", body: "Hull selection, layout planning, and engineering review tailored to mission profile." },
  { num: "03", title: "Mold & Fiberglass Prep", body: "Mold preparation, surface readiness, and gelcoat application under controlled conditions." },
  { num: "04", title: "Composite Layup", body: "Hand-finished fiberglass layup with marine-grade resin systems and quality control at every layer." },
  { num: "05", title: "Structural Reinforcement", body: "Reinforcement at stress points, stringers, transom, and load-bearing bulkheads." },
  { num: "06", title: "Systems & Fit-Out", body: "Electrical, mechanical, deck hardware, interior, and finish work." },
  { num: "07", title: "Finishing", body: "Surface fairing, paint, gelcoat finish, and presentation-grade detailing." },
  { num: "08", title: "Quality Inspection", body: "Multi-stage inspection — hull integrity, systems function, sea trial." },
  { num: "09", title: "Delivery & Support", body: "Hand-over, owner training, and continuing maintenance and service support." },
];
