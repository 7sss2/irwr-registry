import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

execSync('node build.js', { cwd: process.cwd() });

const slugs = ['index', 'records', 'holders', 'countries', 'categories', 'search', 'verify', 'archive', 'about', 'admin'];
for (const slug of slugs) {
  assert.ok(existsSync(`${slug}.html`), `${slug}.html was not generated`);
  const html = readFileSync(`${slug}.html`, 'utf8');
  assert.ok(!html.includes('{{'), `${slug}.html has an unfilled {{...}} placeholder`);
  assert.ok(html.includes('<header id="siteHeader">'), `${slug}.html is missing the shared header`);
  assert.ok(html.includes('<footer>'), `${slug}.html is missing the shared footer`);
}

console.log('build.test.mjs: all checks passed');
