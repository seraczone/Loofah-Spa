export type Category = "Laser" | "Skincare" | "Injectables" | "Wellness" | "Hair" | "Body";

export interface Service {
  slug: string;
  name: string;
  category: Category;
  duration: string;
  downtime: string;
  priceFrom: number; // NGN
  shortDesc: string;
  longDesc: string;
  benefits: string[];
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  image: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const SERVICES: Service[] = [
  {
    slug: "laser-hair-removal",
    name: "Laser Hair Removal",
    category: "Laser",
    duration: "30–60 min",
    downtime: "0 days",
    priceFrom: 25000,
    shortDesc: "FDA-cleared diode technology for permanent hair reduction across all skin tones.",
    longDesc:
      "Our medical-grade diode laser targets the hair follicle without damaging surrounding skin — safe for melanin-rich complexions and effective on the face, underarms, bikini, legs and back.",
    benefits: [
      "Safe for all Fitzpatrick skin types",
      "Permanent hair reduction in 6–8 sessions",
      "Smoother, ingrown-free skin",
      "No downtime — return to routine immediately",
    ],
    steps: [
      { title: "Consultation", body: "Skin assessment and patch test." },
      { title: "Preparation", body: "Area is cleansed and cooling gel applied." },
      { title: "Treatment", body: "Diode laser pulses target each follicle." },
      { title: "Aftercare", body: "Soothing serum and SPF protocol." },
    ],
    faqs: [
      { q: "How many sessions will I need?", a: "Most clients see lasting results in 6–8 sessions, spaced 4–6 weeks apart." },
      { q: "Is it painful?", a: "Our diode platform has integrated cooling — most clients describe a warm flick sensation." },
      { q: "Is it safe for dark skin?", a: "Yes. The 808nm diode wavelength is the gold standard for melanin-rich skin." },
    ],
    image: img("photo-1570172619644-dfd03ed5d881"),
  },
  {
    slug: "hydra-glow-facial",
    name: "Hydra Glow Facial",
    category: "Skincare",
    duration: "60 min",
    downtime: "0 days",
    priceFrom: 35000,
    shortDesc: "Multi-step hydradermabrasion ritual that cleanses, exfoliates and infuses radiance.",
    longDesc:
      "A signature six-step facial that combines vortex extraction, gentle peel, and antioxidant serum infusion for an immediate luminous finish.",
    benefits: ["Instant radiance", "Deep pore cleansing", "Plumped hydration", "Even tone"],
    steps: [
      { title: "Cleanse & exfoliate", body: "Removes dead cells and surface debris." },
      { title: "Acid peel", body: "Loosens impurities painlessly." },
      { title: "Vortex extraction", body: "Deep-cleans pores without squeezing." },
      { title: "Serum infusion", body: "Antioxidants, peptides and HA delivered deep." },
    ],
    faqs: [
      { q: "How often should I do it?", a: "Monthly is ideal for sustained glow." },
      { q: "Can I wear makeup after?", a: "Yes — your skin will look its best bare though." },
    ],
    image: img("photo-1616394584738-fc6e612e71b9"),
  },
  {
    slug: "chemical-peels",
    name: "Chemical Peels",
    category: "Skincare",
    duration: "45 min",
    downtime: "1–3 days",
    priceFrom: 30000,
    shortDesc: "Customised acid resurfacing for tone, texture and clarity.",
    longDesc:
      "Mandelic, glycolic and TCA blends formulated for African skin — addressing pigmentation, acne and dullness without compromising the barrier.",
    benefits: ["Fades pigmentation", "Smooths texture", "Reduces acne", "Brightens tone"],
    steps: [
      { title: "Skin diagnosis", body: "Choose the appropriate acid blend." },
      { title: "Application", body: "Acid is layered to controlled depth." },
      { title: "Neutralise", body: "Stop the acid and soothe the skin." },
      { title: "Repair", body: "Barrier-restoring mask and SPF." },
    ],
    faqs: [
      { q: "Will I peel visibly?", a: "Light flaking for 2–3 days; medium peels may show more." },
      { q: "Safe for melanin-rich skin?", a: "Yes — our protocols are formulated specifically for it." },
    ],
    image: img("photo-1612870258635-a7e6db5e09c5"),
  },
  {
    slug: "microneedling",
    name: "Microneedling",
    category: "Skincare",
    duration: "75 min",
    downtime: "1–2 days",
    priceFrom: 60000,
    shortDesc: "Collagen induction therapy for scars, pores and skin firmness.",
    longDesc:
      "Microscopic channels stimulate the skin's healing cascade, building new collagen and elastin over the following weeks.",
    benefits: ["Reduces acne scars", "Tightens pores", "Improves firmness", "Evens tone"],
    steps: [
      { title: "Numb", body: "Topical anaesthetic for comfort." },
      { title: "Needle", body: "Sterile cartridge creates micro-channels." },
      { title: "Infuse", body: "Growth factor or HA serum delivered deep." },
      { title: "Recover", body: "Calming mask and SPF." },
    ],
    faqs: [
      { q: "How many sessions?", a: "3–6 sessions, 4 weeks apart, for transformative results." },
    ],
    image: img("photo-1570172619644-dfd03ed5d881"),
  },
  {
    slug: "acne-treatment",
    name: "Acne Treatment Programme",
    category: "Skincare",
    duration: "60 min",
    downtime: "0 days",
    priceFrom: 40000,
    shortDesc: "Multi-modal protocol combining extractions, LED and clinical actives.",
    longDesc:
      "A six-week clinical programme designed to clear active acne and prevent scarring on Nigerian skin.",
    benefits: ["Clears active breakouts", "Reduces oil", "Calms inflammation", "Prevents scarring"],
    steps: [
      { title: "Diagnose", body: "Identify acne type and triggers." },
      { title: "Clear", body: "Deep-cleanse, extract, peel." },
      { title: "Calm", body: "Blue/red LED therapy." },
      { title: "Maintain", body: "Personalised home routine." },
    ],
    faqs: [{ q: "How fast will I see results?", a: "Most clients see significant clearing by week 4." }],
    image: img("photo-1556228720-195a672e8a03"),
  },
  {
    slug: "tattoo-removal",
    name: "Laser Tattoo Removal",
    category: "Laser",
    duration: "30 min",
    downtime: "3–5 days",
    priceFrom: 35000,
    shortDesc: "Q-switched laser fragments ink for the body to clear naturally.",
    longDesc:
      "Multi-wavelength Q-switched platform safely removes black, red, green and blue inks across all skin tones.",
    benefits: ["All ink colours", "Safe for dark skin", "Minimal scarring", "Faster fade"],
    steps: [
      { title: "Patch test", body: "Confirm settings for your skin." },
      { title: "Treat", body: "Pulses fragment the ink." },
      { title: "Heal", body: "Skin lightens over 6–8 weeks." },
    ],
    faqs: [{ q: "How many sessions?", a: "6–10 depending on ink density and colours." }],
    image: img("photo-1611689342806-0863700ce1e4"),
  },
  {
    slug: "lipolysis",
    name: "Laser Lipolysis (Body Contouring)",
    category: "Body",
    duration: "60 min",
    downtime: "1 day",
    priceFrom: 80000,
    shortDesc: "Non-invasive fat reduction and skin tightening for sculpted contours.",
    longDesc:
      "Targeted thermal energy disrupts fat cells while stimulating collagen for firmer, smoother contours.",
    benefits: ["Targeted fat reduction", "Skin tightening", "No surgery", "Smoother contour"],
    steps: [
      { title: "Map", body: "Mark treatment zones." },
      { title: "Treat", body: "Apply controlled heat." },
      { title: "Drain", body: "Lymphatic massage." },
    ],
    faqs: [{ q: "When will I see results?", a: "Visible from 2 weeks; final at 6–8 weeks." }],
    image: img("photo-1571019613454-1cb2f99b2d8b"),
  },
  {
    slug: "stretch-mark-treatment",
    name: "Stretch Mark Treatment",
    category: "Body",
    duration: "60 min",
    downtime: "1–2 days",
    priceFrom: 55000,
    shortDesc: "Microneedling + RF protocol that restores texture and tone.",
    longDesc: "Combines microneedling with topical actives to remodel scar tissue and restore even pigmentation.",
    benefits: ["Smooths texture", "Evens tone", "Improves firmness", "Safe on melanin"],
    steps: [
      { title: "Numb", body: "Topical anaesthetic." },
      { title: "Treat", body: "Micro-channels + actives." },
      { title: "Heal", body: "Recovery balm and sun protection." },
    ],
    faqs: [{ q: "How many sessions?", a: "4–6 sessions for transformative results." }],
    image: img("photo-1559599101-f09722fb4948"),
  },
  {
    slug: "botox",
    name: "Botox & Anti-Wrinkle",
    category: "Injectables",
    duration: "30 min",
    downtime: "0 days",
    priceFrom: 90000,
    shortDesc: "Refined neuromodulator placement for a rested, natural finish.",
    longDesc: "Conservative dosing strategy that smooths expression lines while preserving natural movement.",
    benefits: ["Softens fine lines", "Lifts brow", "Slims jaw (masseter)", "Long-lasting"],
    steps: [
      { title: "Consult", body: "Discuss goals and map muscles." },
      { title: "Inject", body: "Precise micro-doses." },
      { title: "Review", body: "Two-week top-up if needed." },
    ],
    faqs: [{ q: "How long does it last?", a: "3–4 months on average." }],
    image: img("photo-1512290923902-8a9f81dc236c"),
  },
  {
    slug: "mesotherapy",
    name: "Mesotherapy",
    category: "Injectables",
    duration: "45 min",
    downtime: "1 day",
    priceFrom: 70000,
    shortDesc: "Vitamin & HA cocktails delivered into the dermis for deep glow.",
    longDesc: "Customised mesotherapy infusions hydrate, brighten and rejuvenate from within.",
    benefits: ["Deep hydration", "Brighter tone", "Plumper skin", "Improved elasticity"],
    steps: [
      { title: "Cleanse", body: "Prep the skin." },
      { title: "Infuse", body: "Micro-injections of cocktail." },
      { title: "Mask", body: "Calming finish." },
    ],
    faqs: [{ q: "How many sessions?", a: "4 sessions, 2 weeks apart, then quarterly." }],
    image: img("photo-1515377905703-c4788e51af15"),
  },
  {
    slug: "prp-hair",
    name: "PRP Hair Therapy",
    category: "Hair",
    duration: "75 min",
    downtime: "0 days",
    priceFrom: 120000,
    shortDesc: "Your own platelets stimulate dormant follicles for thicker hair.",
    longDesc: "Platelet-rich plasma is concentrated from your blood and injected into the scalp to revive follicles.",
    benefits: ["Thicker hair", "Reduced shedding", "Natural — uses your own cells", "No downtime"],
    steps: [
      { title: "Draw", body: "Small blood sample." },
      { title: "Spin", body: "Concentrate platelets." },
      { title: "Inject", body: "Targeted scalp delivery." },
    ],
    faqs: [{ q: "How many sessions?", a: "3 sessions monthly, then maintenance every 6 months." }],
    image: img("photo-1559599076-9c61d8e1b77c"),
  },
  {
    slug: "iv-therapy",
    name: "IV Infusion Therapy",
    category: "Wellness",
    duration: "45 min",
    downtime: "0 days",
    priceFrom: 50000,
    shortDesc: "Vitamin and antioxidant drips for energy, immunity and glow.",
    longDesc: "Physician-formulated IV cocktails delivered in our private wellness lounge.",
    benefits: ["Boosts energy", "Strengthens immunity", "Glow from within", "Hydrates"],
    steps: [
      { title: "Consult", body: "Choose the right blend." },
      { title: "Infuse", body: "Relax in our recliner." },
      { title: "Recover", body: "Light snack and water." },
    ],
    faqs: [{ q: "How often?", a: "Most clients enjoy a monthly drip." }],
    image: img("photo-1582719478250-c89cae4dc85b"),
  },
  {
    slug: "wellness-massage",
    name: "Wellness Massage",
    category: "Wellness",
    duration: "60 / 90 min",
    downtime: "0 days",
    priceFrom: 30000,
    shortDesc: "Swedish, deep-tissue and aromatherapy rituals.",
    longDesc: "A bespoke massage in our candle-lit suite, tailored to your tension map.",
    benefits: ["Releases tension", "Improves circulation", "Calms nervous system", "Better sleep"],
    steps: [
      { title: "Welcome", body: "Foot bath and aromatherapy choice." },
      { title: "Massage", body: "Tailored pressure throughout." },
      { title: "Rest", body: "Tea ceremony to close." },
    ],
    faqs: [{ q: "Couple's option?", a: "Yes — our suite is designed for two." }],
    image: img("photo-1544161515-4ab6ce6db874"),
  },
  {
    slug: "manicure-pedicure",
    name: "Luxury Mani & Pedicure",
    category: "Wellness",
    duration: "75 min",
    downtime: "0 days",
    priceFrom: 18000,
    shortDesc: "Sterile, ritualistic nail care with premium polishes and gels.",
    longDesc: "Heated bowls, hand massage, and gel options that last weeks.",
    benefits: ["Hospital-grade sterility", "Long-lasting finish", "Hand & foot massage", "Premium polish"],
    steps: [
      { title: "Soak", body: "Warm aromatic bowl." },
      { title: "Shape", body: "Cuticle and shape work." },
      { title: "Polish", body: "Regular or gel finish." },
    ],
    faqs: [{ q: "Do you have men's options?", a: "Yes — clear-finish executive treatments available." }],
    image: img("photo-1604654894610-df63bc536371"),
  },
  {
    slug: "facial-brightening",
    name: "Facial Brightening Ritual",
    category: "Skincare",
    duration: "75 min",
    downtime: "0 days",
    priceFrom: 45000,
    shortDesc: "Pigmentation-fading protocol crafted for African skin.",
    longDesc: "Layered actives — kojic, vitamin C, tranexamic — fade dark spots and even tone safely.",
    benefits: ["Fades dark spots", "Even tone", "Luminous finish", "Barrier-safe"],
    steps: [
      { title: "Prep", body: "Cleanse and exfoliate." },
      { title: "Brighten", body: "Active mask and serum infusion." },
      { title: "Protect", body: "SPF and aftercare." },
    ],
    faqs: [{ q: "Is it safe long-term?", a: "Yes — we use barrier-safe, dermatologist-approved actives." }],
    image: img("photo-1583241800698-9c2e3624f0b3"),
  },
  {
    slug: "vaginal-rejuvenation",
    name: "Laser Vaginal Rejuvenation",
    category: "Laser",
    duration: "30 min",
    downtime: "1–2 days",
    priceFrom: 150000,
    shortDesc: "Discreet, doctor-led intimate wellness with proven results.",
    longDesc: "Non-surgical laser rejuvenation that improves tone, lubrication and confidence.",
    benefits: ["Improves tone", "Restores comfort", "Confidential care", "No surgery"],
    steps: [
      { title: "Consult", body: "Private medical assessment." },
      { title: "Treat", body: "Brief, comfortable procedure." },
      { title: "Recover", body: "Light aftercare." },
    ],
    faqs: [{ q: "Is it confidential?", a: "Absolutely — discreet entry, female practitioners, sealed records." }],
    image: img("photo-1532926381893-7542290edf1d"),
  },
];

export const CATEGORIES: ("All" | Category)[] = [
  "All", "Laser", "Skincare", "Injectables", "Wellness", "Hair", "Body",
];

export const formatNGN = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
