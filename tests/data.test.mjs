import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(readFileSync('js/data.js', 'utf8'), sandbox);
const { IRWR_RECORDS, IRWR } = sandbox.window;

assert.equal(IRWR_RECORDS.length, 350, 'expected 350 records (35 per category)');
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
assert.ok(countries.size >= 15 && countries.size <= 20, `expected 15-20 distinct countries, got ${countries.size}`);

const featured = IRWR_RECORDS.filter((r) => r.featured);
assert.equal(featured.length, 4, 'expected exactly 4 featured records');
assert.deepEqual(new Set(featured.map((r) => r.category)), new Set(['culture', 'sport', 'education', 'cooking']));

assert.equal(IRWR.byId('IRWR-00401').id, 'IRWR-00401');
assert.equal(IRWR.byId('IRWR-99999'), undefined);

expectedSlugs.forEach((slug) => assert.equal(IRWR.byCategory(slug).length, 35, `${slug} should have 35 records`));

const byCountry = IRWR.groupBy('country');
assert.equal(Object.values(byCountry).reduce((sum, arr) => sum + arr.length, 0), 350);

const catFiltered = IRWR.filterRecords(IRWR_RECORDS, { category: 'culture' });
assert.equal(catFiltered.length, 35);
assert.ok(catFiltered.every((r) => r.category === 'culture'));

const queryFiltered = IRWR.searchRecords(IRWR_RECORDS, 'kazakhstan');
assert.ok(queryFiltered.length >= 1);
assert.ok(queryFiltered.every((r) => r.country.toLowerCase().includes('kazakhstan')));

const idFiltered = IRWR.searchRecords(IRWR_RECORDS, 'IRWR-00401');
assert.equal(idFiltered.length, 1);
assert.equal(idFiltered[0].id, 'IRWR-00401');

const page1 = IRWR.paginate(IRWR_RECORDS, 1, 10);
assert.equal(page1.items.length, 10);
assert.equal(page1.totalPages, 35);
const lastPage = IRWR.paginate(IRWR_RECORDS, 35, 10);
assert.equal(lastPage.items.length, 10);
const pageOverflow = IRWR.paginate(IRWR_RECORDS, 99, 10);
assert.equal(pageOverflow.page, 35, 'page number clamps to last valid page');

console.log('data.test.mjs: all checks passed');
