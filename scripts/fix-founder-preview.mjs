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
  'src="assets/images/subash.png"',
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
