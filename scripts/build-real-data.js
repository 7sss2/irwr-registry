// Phase 2 of 2: transforms scripts/real-records-extracted.js (compact source
// facts) into the final IRWR_RECORDS schema and writes js/data.js.
// One-off build script — run with `node scripts/build-real-data.js`, not
// wired into the site build.js pipeline (that ships the generated file).
const fs = require('fs');
const path = require('path');

const extracted = require('./real-records-extracted.js');

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
  Finland: 'FIN', France: 'FRA', Germany: 'DEU', 'Great Britain': 'GBR', Greece: 'GRC',
  Guatemala: 'GTM', Hungary: 'HUN', Iceland: 'ISL', India: 'IND', Indonesia: 'IDN',
  Israel: 'ISR', Italy: 'ITA', Jamaica: 'JAM', Japan: 'JPN', Kazakhstan: 'KAZ',
  Kenya: 'KEN', Latvia: 'LVA', Mexico: 'MEX', Netherlands: 'NLD', Nigeria: 'NGA',
  Norway: 'NOR', Portugal: 'PRT', Russia: 'RUS', 'Saudi Arabia': 'SAU', Singapore: 'SGP',
  'South Africa': 'ZAF', 'South Korea': 'KOR', Spain: 'ESP', Sweden: 'SWE',
  Switzerland: 'CHE', Taiwan: 'TWN', Turkey: 'TUR', UAE: 'ARE', UK: 'GBR',
  USA: 'USA', Ukraine: 'UKR', 'United Kingdom': 'GBR',
};
function countryCode(country) {
  return ISO3[country] || '';
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

let id = 0;
const records = [];
CATEGORY_ORDER.forEach((slug) => {
  extracted[slug].forEach((r) => {
    id += 1;
    const irwrId = `IRWR-${String(id).padStart(5, '0')}`;
    records.push({
      id: irwrId,
      title: r.title,
      category: r.category,
      holderName: r.holderName,
      country: r.country,
      countryCode: countryCode(r.country),
      date: r.date,
      status: 'verified',
      description: `${r.description} Originally recognized by GBR (Global Best of Records). Registered in IRWR under ID ${irwrId}.`,
      photoSeed: `irwr-${slug}-${slugify(r.title)}`.slice(0, 60),
      featured: false,
    });
  });
});

// Pick one strong, recognizable record per pinned category as featured.
const FEATURED_PICKS = {
  sport: 'Fastest 100 Meter Sprint',
  culture: null, // filled by first record found below if not matched by title
  education: null,
  cooking: null,
};
function markFeatured(slug, matchTitle) {
  const pool = records.filter((r) => r.category === slug);
  const pick = (matchTitle && pool.find((r) => r.title === matchTitle)) || pool[0];
  if (pick) pick.featured = true;
}
['sport', 'culture', 'education', 'cooking'].forEach((slug) => markFeatured(slug, FEATURED_PICKS[slug]));

const out = `(function () {
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

fs.writeFileSync(path.join(__dirname, '..', 'js', 'data.js'), out);
console.log(`Wrote js/data.js: ${records.length} records across ${CATEGORY_ORDER.length} categories.`);
