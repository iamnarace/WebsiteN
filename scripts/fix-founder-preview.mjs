import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(scriptDir, '..');
const indexPath = join(root, 'dist', 'index.html');

let html = readFileSync(indexPath, 'utf8');

const portraitSource = 'src="assets/images/subash-thapa-founder.jpg"';
if (!html.includes(portraitSource)) {
  throw new Error('Could not locate Subash portrait reference');
}
html = html.replace(
  portraitSource,
  'src="assets/images/subash.png?v=2"',
);

const linkedinPath = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.56 20.452h3.555V9H3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

html = html.replace(
  /<svg class="icon (icon-sm|icon-md)" aria-hidden="true"><use href="#i-linkedin"><\/use><\/svg>/g,
  (_, sizeClass) => `<svg class="linkedin-brand-icon ${sizeClass}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="${linkedinPath}"></path></svg>`,
);

if (!html.includes('linkedin-brand-icon')) {
  throw new Error('LinkedIn brand icon replacement did not run');
}

writeFileSync(indexPath, html, 'utf8');
console.log('Founder portrait and LinkedIn brand icons prepared in dist output');

splitRoutes(html);

function splitRoutes(source) {
  const markers = [
    ['home', '<!-- ===== HOME ===== -->', '<!-- ===== PRODUCT ===== -->'],
    ['product', '<!-- ===== PRODUCT ===== -->', '<!-- ===== SERVICES ===== -->'],
    ['services', '<!-- ===== SERVICES ===== -->', '<!-- ===== ABOUT ===== -->'],
    ['about', '<!-- ===== ABOUT ===== -->', '<!-- ===== CONTACT ===== -->'],
    ['contact', '<!-- ===== CONTACT ===== -->', '</main>'],
  ];
  const prefixEnd = source.indexOf('<!-- ===== HOME ===== -->');
  const footerAt = source.indexOf('<footer>');
  if (prefixEnd < 0 || footerAt < 0) throw new Error('Could not split routes: missing page markers');
  const prefix = source.slice(0, prefixEnd);
  const footer = `\n</main>\n${source.slice(footerAt)}`;
  const pages = {
    home: {
      file: 'index.html',
      title: '1Touch IT | Professional IT Support in Sydney',
      canonical: 'https://www.1touchit.com.au/',
    },
    about: {
      file: 'about.html',
      title: 'About | 1Touch IT | Professional IT Support in Sydney',
      canonical: 'https://www.1touchit.com.au/about',
    },
    services: {
      file: 'services.html',
      title: 'Services | 1Touch IT | Professional IT Support in Sydney',
      canonical: 'https://www.1touchit.com.au/services',
    },
    product: {
      file: 'product.html',
      title: 'HomeLife Hub | 1Touch IT',
      canonical: 'https://www.1touchit.com.au/product',
    },
    contact: {
      file: 'contact.html',
      title: 'Contact | 1Touch IT | Professional IT Support in Sydney',
      canonical: 'https://www.1touchit.com.au/contact',
    },
  };

  for (const [id, start, end] of markers) {
    const from = source.indexOf(start);
    const to = source.indexOf(end);
    if (from < 0 || to < 0 || to <= from) throw new Error(`Could not split routes: missing ${id}`);
    let block = source.slice(from, to);
    block = block.replace(`id="page-${id}" class="page"`, `id="page-${id}" class="page active"`);
    const meta = pages[id];
    let doc = `${prefix}${block}${footer}`;
    doc = doc.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
    if (!doc.includes('rel="canonical"')) {
      doc = doc.replace('</title>', `</title>\n<link rel="canonical" href="${meta.canonical}">`);
    }
    doc = doc.replace(
      '<meta property="og:url" content="https://www.1touchit.com.au/">',
      `<meta property="og:url" content="${meta.canonical}">`,
    );
    writeFileSync(join(root, 'dist', meta.file), doc, 'utf8');
  }
  console.log('Route pages written: /, /about, /services, /product, /contact');
}
