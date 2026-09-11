const fs = require('fs');
const path = require('path');
const root = __dirname;

const partials = {};
for (const name of ['header', 'footer', 'marquee', 'ruler']) {
  partials[name] = fs.readFileSync(path.join(root, 'src/partials', `${name}.html`), 'utf8');
}
const shell = fs.readFileSync(path.join(root, 'src/shell.html'), 'utf8');

const pages = [
  { slug: 'index',      src: 'home.html',       title: 'Home',            page: 'home',       scripts: ['home.js', 'hero3d.js'],
    preload: 'images/hero-library.jpg',
    description: 'IRWR is the International Register World Record — a verified, source-cited registry of world records spanning sport, science, culture, and more.' },
  { slug: 'records',    src: 'records.html',    title: 'World Records',   page: 'records',    scripts: ['records.js'],
    description: 'Browse every verified world record in the IRWR registry, filterable by category, from sport and architecture to human body and extreme feats.' },
  { slug: 'holders',    src: 'holders.html',    title: 'Record Holders',  page: 'holders',    scripts: ['holders.js'],
    description: 'Meet the people, teams, and organizations behind IRWR-verified world records, with their full record history.' },
  { slug: 'countries',  src: 'countries.html',  title: 'Countries',       page: 'countries',  scripts: ['countries.js', 'globe3d.js'], threeJs: true,
    description: 'Explore IRWR world records by country of origin on an interactive globe.' },
  { slug: 'categories', src: 'categories.html', title: 'Categories',      page: 'categories', scripts: [],
    description: 'Browse IRWR world records by category: sport, economy, culture, education, transport, cooking, architecture, military, human body, and extreme.' },
  { slug: 'search',     src: 'search.html',     title: 'Search',         page: 'search',      scripts: ['search.js'],
    description: 'Search the IRWR registry for a specific world record, holder, or country.' },
  { slug: 'verify',     src: 'verify.html',     title: 'Verify a Record', page: 'verify',     scripts: ['verify.js'],
    description: 'Verify the authenticity of an IRWR world record certificate by its registry ID.' },
  { slug: 'archive',    src: 'archive.html',    title: 'Archive',         page: 'archive',    scripts: ['archive.js'],
    description: 'A full sortable archive of every record in the IRWR registry.' },
  { slug: 'about',      src: 'about.html',      title: 'About IRWR',      page: 'about',      scripts: ['about.js'],
    description: 'Learn how the International Register World Record verifies and documents world records.' },
  { slug: 'admin',      src: 'admin.html',      title: 'GBR Admin',       page: 'admin',      scripts: [],
    description: 'IRWR internal administration.' },
];

const DEFAULT_DESCRIPTION = 'IRWR — International Register World Record. A verified, source-cited registry of world records.';

function fill(str, map) {
  return str.replace(/{{(\w+)}}/g, (m, key) => (key in map ? map[key] : m));
}

// Minifies css/*.css -> css/*.min.css and js/*.js -> js/*.min.js (including the
// generated js/data.js, which is plain JS - always minified from whatever
// scripts/build-real-data.js most recently wrote). Falls back to leaving only
// unminified files in place if terser/clean-css aren't installed (e.g. `npm install`
// was never run) so a bare-bones `node build.js` still produces a working site —
// build() below always prefers a `.min` file when one exists on disk.
async function minifyAssets() {
  let CleanCSS; let terser;
  try {
    CleanCSS = require('clean-css');
    terser = require('terser');
  } catch (e) {
    console.log('minify: terser/clean-css not installed, skipping (run `npm install` to enable)');
    return;
  }

  const cssDir = path.join(root, 'css');
  for (const name of fs.readdirSync(cssDir)) {
    if (!name.endsWith('.css') || name.endsWith('.min.css')) continue;
    const src = fs.readFileSync(path.join(cssDir, name), 'utf8');
    const out = new CleanCSS({ level: 2 }).minify(src);
    if (out.errors.length) { console.error('minify css error', name, out.errors); continue; }
    fs.writeFileSync(path.join(cssDir, name.replace(/\.css$/, '.min.css')), out.styles);
    console.log('minified', name);
  }

  const jsDir = path.join(root, 'js');
  for (const name of fs.readdirSync(jsDir)) {
    if (!name.endsWith('.js') || name.endsWith('.min.js')) continue;
    const src = fs.readFileSync(path.join(jsDir, name), 'utf8');
    const result = await terser.minify(src, { compress: true, mangle: true });
    if (result.error) { console.error('minify js error', name, result.error); continue; }
    fs.writeFileSync(path.join(jsDir, name.replace(/\.js$/, '.min.js')), result.code);
    console.log('minified', name);
  }
}

// Prefers name.min.ext over name.ext when the minified file exists on disk.
function minPath(dir, name) {
  const minName = name.replace(/\.(js|css)$/, '.min.$1');
  return fs.existsSync(path.join(root, dir, minName)) ? minName : name;
}

function build() {
  const cssLinks = ['tokens.css', 'base.css', 'pages.css']
    .map((name) => `<link rel="stylesheet" href="css/${minPath('css', name)}">`)
    .join('\n');
  const coreScripts = ['data.js', 'main.js']
    .map((name) => `<script src="js/${minPath('js', name)}" defer></script>`)
    .join('\n');
  // three.js (118KB) is only pulled in on pages that do real WebGL work (currently
  // just the interactive countries globe) - everywhere else relies on CSS/SVG for
  // decorative motion, so most pages never pay for the library at all.
  const threeScript = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" integrity="sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu" crossorigin="anonymous" defer></script>';

  for (const p of pages) {
    const bodyPath = path.join(root, 'src/pages', p.src);
    if (!fs.existsSync(bodyPath)) continue;
    const body = fs.readFileSync(bodyPath, 'utf8');
    const scripts = p.scripts.map((s) => `<script src="js/${minPath('js', s)}" defer></script>`).join('\n');
    let html = fill(shell, {
      TITLE: p.title,
      PAGE: p.page,
      DESCRIPTION: p.description || DEFAULT_DESCRIPTION,
      URL_PATH: p.slug === 'index' ? '' : `${p.slug}.html`,
      CSS_LINKS: cssLinks,
      PRELOAD: p.preload ? `<link rel="preload" as="image" href="${p.preload}" fetchpriority="high">` : '',
      THREE_SCRIPT: p.threeJs ? threeScript : '',
      CORE_SCRIPTS: coreScripts,
      HEADER: partials.header,
      FOOTER: partials.footer,
      BODY: body,
      PAGE_SCRIPTS: scripts,
    });
    html = fill(html, { MARQUEE: partials.marquee, RULER: partials.ruler });
    fs.writeFileSync(path.join(root, `${p.slug}.html`), html);
    console.log('built', `${p.slug}.html`);
  }

  buildSitemap();
}

// admin.html is excluded - it's marked noindex (see _headers) since it's an
// internal-only stub with no real function, not a page search engines
// should list.
const SITE_ORIGIN = 'https://irwr-registry.com';
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => p.slug !== 'admin')
    .map((p) => {
      const loc = p.slug === 'index' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${p.slug}.html`;
      return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
  console.log('built sitemap.xml');
}

async function main() {
  await minifyAssets();
  build();
}

if (require.main === module) main();
module.exports = { build, minifyAssets, fill, pages };
