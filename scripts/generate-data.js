const fs = require('fs');
const path = require('path');

// Seeded PRNG (mulberry32) — deterministic so re-running the generator
// reproduces the exact same js/data.js, which keeps the dataset stable
// across machines and lets tests assert on structure without pinning content.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// All names, countries, and phrases below are invented — no real person,
// organization, or place-specific record from any reference material.
const COUNTRIES = [
  { name: 'United Arab Emirates', code: 'UAE', cities: ['Abu Dhabi', 'Dubai'] },
  { name: 'Kazakhstan', code: 'KAZ', cities: ['Almaty', 'Astana'] },
  { name: 'Turkey', code: 'TUR', cities: ['Istanbul', 'Ankara'] },
  { name: 'Netherlands', code: 'NLD', cities: ['Amsterdam', 'Rotterdam'] },
  { name: 'Japan', code: 'JPN', cities: ['Tokyo', 'Osaka'] },
  { name: 'Brazil', code: 'BRA', cities: ['São Paulo', 'Rio de Janeiro'] },
  { name: 'South Africa', code: 'ZAF', cities: ['Cape Town', 'Johannesburg'] },
  { name: 'Canada', code: 'CAN', cities: ['Toronto', 'Vancouver'] },
  { name: 'Kenya', code: 'KEN', cities: ['Nairobi', 'Mombasa'] },
  { name: 'Philippines', code: 'PHL', cities: ['Manila', 'Cebu'] },
  { name: 'Germany', code: 'DEU', cities: ['Berlin', 'Munich'] },
  { name: 'Nigeria', code: 'NGA', cities: ['Lagos', 'Abuja'] },
  { name: 'Norway', code: 'NOR', cities: ['Oslo', 'Bergen'] },
  { name: 'Slovenia', code: 'SVN', cities: ['Ljubljana', 'Maribor'] },
  { name: 'Poland', code: 'POL', cities: ['Warsaw', 'Kraków'] },
  { name: 'Mexico', code: 'MEX', cities: ['Mexico City', 'Guadalajara'] },
  { name: 'India', code: 'IND', cities: ['New Delhi', 'Mumbai'] },
  { name: 'Indonesia', code: 'IDN', cities: ['Jakarta', 'Bandung'] },
  { name: 'Egypt', code: 'EGY', cities: ['Cairo', 'Alexandria'] },
  { name: 'Argentina', code: 'ARG', cities: ['Buenos Aires', 'Córdoba'] },
];
const FIRST_NAMES = ['Aida','Bekzat','Carlos','Dana','Erik','Fatima','Giulia','Hassan','Ines','Jarrah','Kenji','Lerato','Mateus','Nadia','Omar','Petra','Quang','Rania','Sami','Tessa','Umar','Vera','Wiremu','Yasmin','Zane'];
const LAST_NAMES = ['Abenov','Baptiste','Castillo','Demir','Esposito','Fernandes','Gatsby','Haugen','Ionescu','Janse','Kariuki','Lindqvist','Moreno','Nkosi','Okafor','Petrov','Quintero','Rahman','Sultanov','Tanaka','Uzun','Vargas','Wibowo','Yerlanov','Zeleny'];
const ORG_PREFIXES = ['Meridian','Riverside','Highline','Coastal','Rift Valley','Old Quarter','Blue Shield','Clearpath','Cape Tide','Northgate','Sahara','Monsoon','Ironpeak','Golden Delta','Silverline'];
const ORG_SUFFIXES = ['Collective','Guild','Cooperative','Society','Response Team','Alliance','Crew','Trust','Corps','Workshop'];

const CATEGORY_BANKS = {
  sport: { label: 'Sport',
    actions: ['Fastest completion of', 'Longest unbroken run of', 'Most repetitions in', 'Highest verified score in', 'Longest continuous', 'Most consecutive', 'Farthest distance covered in', 'Quickest recorded time in'],
    subjects: ['a solo desert ultramarathon', 'an indoor rowing marathon', 'a treadmill relay by a team of four', 'a stair-climbing ascent', 'an open-water relay swim', 'a blindfolded via ferrata climb', 'a static plank hold', 'a one-hour free-throw session'],
    unit: 'km', min: 3, max: 600 },
  economy: { label: 'Economy',
    actions: ['Fastest completion of', 'Largest single-day total in', 'Longest continuously operating', 'Most participants recorded in', 'Highest verified turnover from', 'Quickest audited result in', 'Largest crowdfunded total for', 'Most efficient recorded run of'],
    subjects: ['a city-wide micro-loan disbursement drive', 'a crowdfunded artisan market launch', 'a family-owned trading house', 'a small-business registration sprint', 'a cooperative savings scheme', 'a community investment fund drive', 'a farmers-market turnover day', 'a national trade-fair booth rotation'],
    unit: '$K', min: 50, max: 5000 },
  culture: { label: 'Culture',
    actions: ['Longest continuous', 'Largest collaborative', 'Most instruments featured in', 'Widest documented', 'Most participants in', 'Longest unbroken', 'Most elaborate recorded', 'Largest single-session'],
    subjects: ['hand-inked calligraphy scroll', 'ceremonial carpet weaving project', 'folk-instrument solo performance', 'community sand mural', 'traditional dance relay', 'poetry recitation marathon', 'puppet theatre production', 'street-mural collaboration'],
    unit: 'metres', min: 20, max: 900 },
  education: { label: 'Education',
    actions: ['Fastest completion of', 'Longest unbroken chain of', 'Largest simultaneous', 'Most participants in', 'Highest verified score in', 'Quickest recorded result in', 'Most consecutive correct answers in', 'Largest single-session'],
    subjects: ['a 1,000-piece jigsaw puzzle, team of two', 'a mental-arithmetic relay', 'a spelling bee', 'a public-speaking marathon', 'a memory-recall challenge', 'a coding hackathon sprint', 'a chess-simul exhibition', 'a language-immersion bootcamp'],
    unit: 'participants', min: 2, max: 9000 },
  transport: { label: 'Transport',
    actions: ['Longest solo', 'Fastest relay completion of', 'Longest continuous', 'Most parcels delivered in', 'Farthest distance covered by', 'Quickest recorded circuit in', 'Most efficient recorded run of', 'Longest unsupported'],
    subjects: ['bicycle journey without repeating a road', 'electric cargo-bike delivery relay', 'human-powered river boat journey', 'solar-vehicle endurance drive', 'cross-country rail-trail hike', 'hot-air balloon distance flight', 'electric-scooter delivery circuit', 'sail-powered coastal crossing'],
    unit: 'km', min: 15, max: 2500 },
  cooking: { label: 'Cooking',
    actions: ['Heaviest home-grown', 'Largest single-batch', 'Fastest full-service completion of', 'Most portions served in', 'Longest continuous', 'Most elaborate recorded', 'Largest collaborative', 'Quickest plating time for'],
    subjects: ['vegetable weighed at harvest', 'communal flatbread bake', 'seven-course tasting menu, single chef', 'street-food festival serving line', 'traditional stew simmered overnight', 'wedding-cake construction', 'spice-market blend competition', 'communal rice dish for a festival'],
    unit: 'kg', min: 20, max: 900 },
  architecture: { label: 'Architecture',
    actions: ['Tallest structure built from', 'Largest community-built', 'Fastest assembly of', 'Widest single-span', 'Largest rooftop', 'Most efficient recorded build of', 'Longest continuous construction of', 'Largest volunteer-built'],
    subjects: ['reclaimed timber', 'earthen dome', 'modular emergency shelter village', 'pedestrian footbridge', 'community garden by area', 'mudbrick water tower', 'bamboo scaffolding pavilion', 'floating dock structure'],
    unit: 'sq. metres', min: 100, max: 6000 },
  military: { label: 'Military',
    actions: ['Longest continuously maintained', 'Fastest humanitarian assembly of', 'Largest area cleared in', 'Most efficient recorded operation of', 'Longest unbroken', 'Largest coordinated', 'Quickest recorded deployment of', 'Most extensive recorded'],
    subjects: ['ceremonial guard rotation', 'field-hospital assembly exercise', 'humanitarian demining operation', 'disaster-relief logistics drop', 'peacekeeping training rotation', 'search-and-rescue training exercise', 'humanitarian supply-convoy relay', 'coastal-patrol training rotation'],
    unit: 'hectares', min: 5, max: 120 },
  humanbody: { label: 'Human Body',
    actions: ['Most consecutive days of', 'Longest supervised', 'Fastest recorded recitation in', 'Highest verified count in', 'Longest continuous', 'Most repetitions in', 'Quickest recorded result in', 'Longest documented'],
    subjects: ['a verified daily 10km walk', 'a static breath-hold, supervised', 'a memory-recitation challenge', 'a supervised cold-exposure session', 'a continuous meditation sit', 'a supervised fasting period', 'a hearing-range test', 'a flexibility demonstration'],
    unit: 'days', min: 1, max: 1500 },
  extreme: { label: 'Extreme',
    actions: ['Longest tightrope walk between', 'Deepest recorded descent by', 'Longest unsupported crossing of', 'Fastest unassisted crossing of', 'Highest recorded ascent of', 'Longest continuous exposure during', 'Most extreme recorded conditions during', 'Farthest distance covered during'],
    subjects: ['two mountain peaks', 'a civilian cave-survey team', 'a desert on foot', 'a frozen strait on skis', 'a technical rock face without ropes', 'a polar trek', 'a volcanic-rim traverse', 'a whitewater river descent'],
    unit: 'km', min: 5, max: 500 },
};

const RECORDS_PER_CATEGORY = 35;
const PENDING_SHARE = 0.15;
const FEATURED_CATEGORIES = ['culture', 'sport', 'education', 'cooking'];
let idCounter = 401;
const records = [];

Object.keys(CATEGORY_BANKS).forEach((slug) => {
  const bank = CATEGORY_BANKS[slug];
  const combos = [];
  bank.actions.forEach((a) => bank.subjects.forEach((s) => combos.push(`${a} ${s}`)));
  const chosen = shuffle(combos).slice(0, RECORDS_PER_CATEGORY);

  chosen.forEach((rawTitle, i) => {
    const country = pick(COUNTRIES);
    const city = pick(country.cities);
    const isOrg = rand() < 0.35;
    const holderName = isOrg ? `${pick(ORG_PREFIXES)} ${pick(ORG_SUFFIXES)}` : `${pick(FIRST_NAMES)[0]}. ${pick(LAST_NAMES)}`;
    const status = rand() < PENDING_SHARE ? 'pending' : 'verified';
    const value = randInt(bank.min, bank.max);
    const date = `${pick(['2025', '2026'])}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`;
    const statusClause = status === 'verified'
      ? 'Certified by an independent IRWR review panel.'
      : 'Currently under review by an independent IRWR panel.';
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

    records.push({
      id: `IRWR-00${idCounter++}`,
      title,
      category: slug,
      holderName,
      country: country.name,
      countryCode: country.code,
      date,
      status,
      description: `${holderName} (${country.name}) set this record — ${rawTitle}, measuring ${value} ${bank.unit} — on ${date} in ${city}, ${country.name}. ${statusClause}`,
      photoSeed: `irwr-${slug}-${slugify(rawTitle)}-${i}`.slice(0, 60),
      featured: FEATURED_CATEGORIES.includes(slug) && i === 0,
    });
  });
});

const CATEGORIES = Object.keys(CATEGORY_BANKS).map((slug) => ({ slug, label: CATEGORY_BANKS[slug].label }));

const output = `(function () {
  const IRWR_RECORDS = ${JSON.stringify(records, null, 2)};

  const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

  function byId(id) { return IRWR_RECORDS.find((r) => r.id === id); }
  function byCategory(slug) { return IRWR_RECORDS.filter((r) => r.category === slug); }
  function groupBy(key) {
    const map = {};
    IRWR_RECORDS.forEach((r) => { (map[r[key]] = map[r[key]] || []).push(r); });
    return map;
  }
  function filterRecords(records, { category, country, status, query } = {}) {
    return records.filter((r) =>
      (!category || r.category === category) &&
      (!country || r.country === country) &&
      (!status || r.status === status) &&
      (!query || matchesQuery(r, query))
    );
  }
  function matchesQuery(r, query) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [r.title, r.holderName, r.country, r.category, r.id].some((f) => String(f).toLowerCase().includes(q));
  }
  function searchRecords(records, query) { return filterRecords(records, { query }); }
  function paginate(array, page, pageSize) {
    const totalPages = Math.max(1, Math.ceil(array.length / pageSize));
    const p = Math.min(Math.max(1, page), totalPages);
    const start = (p - 1) * pageSize;
    return { items: array.slice(start, start + pageSize), page: p, totalPages };
  }

  const scope = typeof window !== 'undefined' ? window : globalThis;
  scope.IRWR_RECORDS = IRWR_RECORDS;
  scope.IRWR = scope.IRWR || {};
  Object.assign(scope.IRWR, { CATEGORIES, byId, byCategory, groupBy, filterRecords, searchRecords, paginate });
})();
`;

fs.writeFileSync(path.join(__dirname, '..', 'js', 'data.js'), output);
console.log(`Generated ${records.length} records into js/data.js`);
