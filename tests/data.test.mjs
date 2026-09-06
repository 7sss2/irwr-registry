import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(readFileSync('js/data.js', 'utf8'), sandbox);
const { IRWR_RECORDS, IRWR } = sandbox.window;

assert.equal(IRWR_RECORDS.length, 295, 'expected 295 real GBR-sourced records (303 minus 8 education/humanbody duplicates)');
assert.equal(IRWR.CATEGORIES.length, 10, 'expected 10 categories');
const expectedSlugs = ['sport','economy','culture','education','transport','cooking','architecture','military','humanbody','extreme'];
// Array.from() below normalizes the array to this module's realm before
// comparing: Node's assert/strict deepEqual checks prototype identity, and
// an array produced by .map()/.sort() on a vm.createContext() object carries
// that sandbox's Array prototype, which fails reference-equality against a
// same-realm array even when every element matches. Unrelated to dataset
// content — see task-4-report.md for the isolated repro.
assert.deepEqual(Array.from(IRWR.CATEGORIES.map((c) => c.slug)).sort(), [...expectedSlugs].sort(), 'category slugs must match spec exactly');

const ids = IRWR_RECORDS.map((r) => r.id);
assert.equal(new Set(ids).size, ids.length, 'record ids must be unique');

const countries = new Set(IRWR_RECORDS.map((r) => r.country));
assert.ok(countries.size >= 40, `expected 40+ distinct countries from real GBR records, got ${countries.size}`);

const featured = IRWR_RECORDS.filter((r) => r.featured);
assert.equal(featured.length, 4, 'expected exactly 4 featured records');
assert.deepEqual(new Set(featured.map((r) => r.category)), new Set(['culture', 'sport', 'education', 'cooking']));

assert.equal(IRWR.byId('IRWR-00001').id, 'IRWR-00001');
assert.equal(IRWR.byId('IRWR-99999'), undefined);

const expectedCounts = { sport: 30, economy: 36, culture: 53, education: 42, transport: 40, cooking: 13, architecture: 30, military: 19, humanbody: 8, extreme: 24 };
expectedSlugs.forEach((slug) => assert.equal(IRWR.byCategory(slug).length, expectedCounts[slug], `${slug} should have ${expectedCounts[slug]} records`));

// Every record must carry its GBR provenance, not imply IRWR's own discovery.
assert.ok(IRWR_RECORDS.every((r) => r.status === 'verified'), 'all real records are GBR-recognized and IRWR-registered');
assert.ok(IRWR_RECORDS.every((r) => r.description.includes('Originally recognized by GBR')), 'description must credit GBR as the original source');

const byCountry = IRWR.groupBy('country');
assert.equal(Object.values(byCountry).reduce((sum, arr) => sum + arr.length, 0), 295);

const catFiltered = IRWR.filterRecords(IRWR_RECORDS, { category: 'culture' });
assert.equal(catFiltered.length, 53);
assert.ok(catFiltered.every((r) => r.category === 'culture'));

const queryFiltered = IRWR.searchRecords(IRWR_RECORDS, 'kazakhstan');
assert.ok(queryFiltered.length >= 1);
assert.ok(queryFiltered.every((r) => r.country.toLowerCase().includes('kazakhstan')));

const idFiltered = IRWR.searchRecords(IRWR_RECORDS, 'IRWR-00001');
assert.equal(idFiltered.length, 1);
assert.equal(idFiltered[0].id, 'IRWR-00001');

const page1 = IRWR.paginate(IRWR_RECORDS, 1, 10);
assert.equal(page1.items.length, 10);
assert.equal(page1.totalPages, 30);
const lastPage = IRWR.paginate(IRWR_RECORDS, 30, 10);
assert.equal(lastPage.items.length, 5);
const pageOverflow = IRWR.paginate(IRWR_RECORDS, 99, 10);
assert.equal(pageOverflow.page, 30, 'page number clamps to last valid page');

console.log('data.test.mjs: all checks passed');
