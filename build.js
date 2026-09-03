const fs = require('fs');
const path = require('path');
const root = __dirname;

const partials = {};
for (const name of ['header', 'footer', 'marquee', 'ruler']) {
  partials[name] = fs.readFileSync(path.join(root, 'src/partials', `${name}.html`), 'utf8');
}
const shell = fs.readFileSync(path.join(root, 'src/shell.html'), 'utf8');

const pages = [
  { slug: 'index',      src: 'home.html',       title: 'Home',            page: 'home',       scripts: ['home.js', 'hero3d.js'] },
  { slug: 'records',    src: 'records.html',    title: 'World Records',   page: 'records',    scripts: ['records.js'] },
  { slug: 'holders',    src: 'holders.html',    title: 'Record Holders',  page: 'holders',    scripts: ['holders.js'] },
  { slug: 'countries',  src: 'countries.html',  title: 'Countries',       page: 'countries',  scripts: ['countries.js', 'globe3d.js'] },
  { slug: 'categories', src: 'categories.html', title: 'Categories',      page: 'categories', scripts: ['categoryIcons3d.js'] },
  { slug: 'search',     src: 'search.html',     title: 'Search',         page: 'search',      scripts: ['search.js'] },
  { slug: 'verify',     src: 'verify.html',     title: 'Verify a Record', page: 'verify',     scripts: ['verify.js'] },
  { slug: 'archive',    src: 'archive.html',    title: 'Archive',         page: 'archive',    scripts: ['archive.js'] },
  { slug: 'about',      src: 'about.html',      title: 'About IRWR',      page: 'about',      scripts: ['about.js'] },
  { slug: 'admin',      src: 'admin.html',      title: 'GBR Admin',       page: 'admin',      scripts: [] },
];

function fill(str, map) {
  return str.replace(/{{(\w+)}}/g, (m, key) => (key in map ? map[key] : m));
}

function build() {
  for (const p of pages) {
    const bodyPath = path.join(root, 'src/pages', p.src);
    if (!fs.existsSync(bodyPath)) continue;
    const body = fs.readFileSync(bodyPath, 'utf8');
    const scripts = p.scripts.map((s) => `<script src="js/${s}"></script>`).join('\n');
    let html = fill(shell, {
      TITLE: p.title,
      PAGE: p.page,
      HEADER: partials.header,
      FOOTER: partials.footer,
      BODY: body,
      PAGE_SCRIPTS: scripts,
    });
    html = fill(html, { MARQUEE: partials.marquee, RULER: partials.ruler });
    fs.writeFileSync(path.join(root, `${p.slug}.html`), html);
    console.log('built', `${p.slug}.html`);
  }
}

if (require.main === module) build();
module.exports = { build, fill, pages };
