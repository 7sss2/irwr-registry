// Phase 2 of 2: transforms scripts/real-records-extracted.js (compact source
// facts) into the final IRWR_RECORDS schema and writes js/data.js.
// One-off build script — run with `node scripts/build-real-data.js`, not
// wired into the site build.js pipeline (that ships the generated file).
const fs = require('fs');
const path = require('path');

const extracted = require('./real-records-extracted.js');

// Maps a subset of IRWR IDs to a real photo verified to depict that specific
// record (sourced from the GBR PDF book and globalbestrecords.org's own
// per-category pages — see docs/superpowers/ ledger for the extraction and
// verification method). Records not in this map have no verified real photo
// and fall back to their picsum.photos placeholder at render time.
const PHOTO_MANIFEST = require('./photo-manifest.json');

const CATEGORY_ORDER = ['sport', 'economy', 'culture', 'education', 'transport', 'cooking', 'architecture', 'military', 'humanbody', 'extreme'];
const CATEGORIES = [
  { slug: 'sport', label: 'Sport' },
  { slug: 'economy', label: 'Economy' },
  { slug: 'culture', label: 'Culture' },
  { slug: 'education', label: 'Education' },
  { slug: 'transport', label: 'Transport' },
  { slug: 'cooking', label: 'Cooking' },
  { slug: 'architecture', label: 'Architecture' },
  { slug: 'military', label: 'Military' },
  { slug: 'humanbody', label: 'Human Body' },
  { slug: 'extreme', label: 'Extreme' },
];

// Best-effort ISO3 lookup. Combo ("X / Y"), historical, and non-country
// entries ("International") intentionally map to '' — no page reads
// countryCode yet (reserved for the future globe task).
const ISO3 = {
  Argentina: 'ARG', Australia: 'AUS', Belarus: 'BLR', Brazil: 'BRA', Canada: 'CAN',
  China: 'CHN', Colombia: 'COL', Croatia: 'HRV', Denmark: 'DNK', Estonia: 'EST',
  Finland: 'FIN', France: 'FRA', Germany: 'DEU', Greece: 'GRC',
  Guatemala: 'GTM', Hungary: 'HUN', Iceland: 'ISL', India: 'IND', Indonesia: 'IDN',
  Israel: 'ISR', Italy: 'ITA', Jamaica: 'JAM', Japan: 'JPN', Kazakhstan: 'KAZ',
  Kenya: 'KEN', Latvia: 'LVA', Mexico: 'MEX', Netherlands: 'NLD', Nigeria: 'NGA',
  Norway: 'NOR', Portugal: 'PRT', Russia: 'RUS', 'Saudi Arabia': 'SAU', Singapore: 'SGP',
  'South Africa': 'ZAF', 'South Korea': 'KOR', Spain: 'ESP', Sweden: 'SWE', 'United Kingdom': 'GBR',
  Switzerland: 'CHE', Taiwan: 'TWN', Turkey: 'TUR', UAE: 'ARE',
  USA: 'USA', Ukraine: 'UKR',
};
function countryCode(country) {
  return ISO3[country] || '';
}

// The source book refers to the UK inconsistently ("UK", "Great Britain",
// "United Kingdom") — normalize to one canonical name so Countries/Archive
// group them together instead of splitting one country into three rows.
const COUNTRY_ALIASES = { 'Great Britain': 'United Kingdom', UK: 'United Kingdom' };
function canonicalCountry(country) {
  return COUNTRY_ALIASES[country] || country;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Records added later from globalbestrecords.org/news. Appended after the
// book records so existing IDs (and the photo manifest keyed on them) never shift.
const newsRecords = require('./news-records-extracted.js');

let id = 0;
const records = [];
const sources = CATEGORY_ORDER.flatMap((slug) => extracted[slug]).concat(newsRecords);
sources.forEach((r) => {
  const slug = r.category;
  id += 1;
  const irwrId = `IRWR-${String(id).padStart(5, '0')}`;
  records.push({
    id: irwrId,
    title: r.title,
    category: r.category,
    holderName: r.holderName,
    country: canonicalCountry(r.country),
    countryCode: countryCode(canonicalCountry(r.country)),
    date: r.date,
    status: 'verified',
    description: `${r.description} Originally recognized by GBR (Global Best of Records). Registered in IRWR under ID ${irwrId}.`,
    photoSeed: `irwr-${slug}-${slugify(r.title)}`.slice(0, 60),
    photo: PHOTO_MANIFEST[irwrId] || null,
    featured: false,
  });
});

// 8 records filed under 'education' are word-for-word duplicates of facts
// already recorded under 'humanbody' (IRWR-00272..00279) — the source book's
// combined "Education, Science, Medicine, Digital Technologies" chapter
// briefly previews these 8 facts (Jeanne Calment, Robert Wadlow, John Brower
// Minnoch, Edward O'Bara, Timothy Ray Brown, Bella Hunter, Kecubi, the
// Chicago hospital team) before the dedicated "Human Body With Patients"
// chapter covers each in full. Extraction picked both up as separate
// records. Removing the education-side echoes so each real-world fact has
// exactly one IRWR entry. IDs are NOT renumbered afterward — IRWR-00148
// through IRWR-00155 are retired rather than shifting every later record.
const EDUCATION_HUMANBODY_DUPES = new Set([
  'IRWR-00148', 'IRWR-00149', 'IRWR-00150', 'IRWR-00151',
  'IRWR-00152', 'IRWR-00153', 'IRWR-00154', 'IRWR-00155',
]);
const removed = records.filter((r) => EDUCATION_HUMANBODY_DUPES.has(r.id));
const dedupedRecords = records.filter((r) => !EDUCATION_HUMANBODY_DUPES.has(r.id));
console.log(`Removed ${removed.length} education/humanbody duplicate records:`);
removed.forEach((r) => console.log(`  ${r.id} ${r.title}`));

// Pick one strong, recognizable record per pinned category as featured.
const FEATURED_PICKS = {
  sport: 'Fastest 100 Meter Sprint',
  culture: null, // filled by first record found below if not matched by title
  education: null,
  cooking: null,
};
function markFeatured(slug, matchTitle) {
  const pool = dedupedRecords.filter((r) => r.category === slug);
  const pick = (matchTitle && pool.find((r) => r.title === matchTitle)) || pool[0];
  if (pick) pick.featured = true;
}
['sport', 'culture', 'education', 'cooking'].forEach((slug) => markFeatured(slug, FEATURED_PICKS[slug]));

const out = `(function () {
  const IRWR_RECORDS = ${JSON.stringify(dedupedRecords, null, 2)};

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

fs.writeFileSync(path.join(__dirname, '..', 'js', 'data.js'), out);
console.log(`Wrote js/data.js: ${dedupedRecords.length} records across ${CATEGORY_ORDER.length} categories.`);
