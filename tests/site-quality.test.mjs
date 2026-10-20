import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readText = (path) => readFileSync(join(root, path), 'utf8');
const exists = (path) => existsSync(join(root, path));

test('public metadata assets and crawl files exist', () => {
  const html = readText('index.html');
  assert.match(html, /href="assets\/images\/1touch-it-logo-icon\.png"/);
  assert.match(html, /assets\/images\/top-band-logo\.png/);
  assert.match(html, /assets\/images\/social-share\.png/);
  for (const path of ['assets/images/1touch-it-logo-icon.png', 'assets/images/top-band-logo.png', 'assets/images/social-share.png', 'robots.txt', 'sitemap.xml']) {
    assert.ok(exists(path), `${path} missing`);
  }
  assert.ok(statSync(join(root, 'assets/images/social-share.png')).size > 10_000);
  assert.match(readText('robots.txt'), /Sitemap: https:\/\/www\.1touchit\.com\.au\/sitemap\.xml/);
  assert.match(readText('sitemap.xml'), /<loc>https:\/\/www\.1touchit\.com\.au\/<\/loc>/);
});

test('founder imagery remains optional while responsive image assets stay available', () => {
  const html = readText('index.html');
  for (const name of ['naresh-profile', 'aboutme']) {
    for (const width of [320, 640, 960]) {
      for (const format of ['avif', 'webp']) {
        const path = `assets/images/optimized/${name}-${width}.${format}`;
        assert.ok(exists(path), `${path} missing`);
        assert.ok(statSync(join(root, path)).size < 450_000, `${path} too large`);
      }
    }
  }
  assert.match(html, /Direct, personal support/);
  assert.match(html, /With an experienced IT professional/);
  assert.match(html, /assets\/images\/top-band-logo\.png/);
  assert.doesNotMatch(html, /hcard-picture/);
});

test('interactive elements expose semantic controls and state', () => {
  const html = readText('index.html');
  assert.doesNotMatch(html, /<a(?![^>]*href=)[^>]*onclick=/);
  assert.match(html, /class="hamburger"[^>]*aria-expanded="false"[^>]*aria-controls="mm"/);
  assert.match(html, /<button[^>]*class="tcard home/);
  assert.match(html, /class="faq-q"[^>]*aria-expanded="false"[^>]*aria-controls="faq-panel-1"/);
  for (const id of ['fname', 'fphone', 'femail', 'fsuburb', 'fcat', 'fdetails', 'fcontactmethod', 'ftime']) {
    assert.match(html, new RegExp(`<label for="${id}"`));
  }
});

test('Gentle Flow and reduced-motion paths are present', () => {
  const html = readText('index.html');
  const patterns = [
    /--motion-fast:\s*160ms/,
    /--motion-page:\s*360ms/,
    /classList\.add\('is-leaving'\)/,
    /aria-current/,
    /:focus-visible/,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)/,
    /scroll-behavior:\s*auto/,
    /animation-duration:\s*\.01ms/,
  ];
  patterns.forEach((pattern) => assert.match(html, pattern));
});

test('home contains two useful local guides', () => {
  const html = readText('index.html');
  assert.match(html, /id="helpful-guides"/);
  assert.match(html, /How to troubleshoot slow or unreliable Wi-Fi at home/);
  assert.match(html, /Microsoft 365 security essentials for small businesses/);
  assert.equal((html.match(/class="guide-card reveal"/g) || []).length, 2);
  assert.match(html, /id="guide-panel-wifi"/);
  assert.match(html, /id="guide-panel-m365"/);
});

test('homepage merges preferred local sections in the requested order', () => {
  const html = readText('index.html');
  const order = [
    'Our Triple-Freedom Promise',
    'Practical technology support for real life and business',
    'Getting help is refreshingly simple',
    'Why 1Touch IT',
    'Everything at home, in one place',
    'Helpful Local Guides',
    'Trusted Locally',
    'Need practical help with your technology?',
  ];
  let lastIndex = -1;
  for (const marker of order) {
    const currentIndex = html.indexOf(marker);
    assert.notEqual(currentIndex, -1, `${marker} missing`);
    assert.ok(currentIndex > lastIndex, `${marker} out of order`);
    lastIndex = currentIndex;
  }
});

test('confirmed artifacts are removed and audit exists', () => {
  for (const path of ['favicon.svg.txt', 'social-share.svg.txt', 'README.md.txt', 'README-UPDATE.txt']) {
    assert.equal(exists(path), false, `${path} should be removed`);
  }
  assert.ok(exists('docs/asset-audit.md'));
  assert.match(readText('docs/asset-audit.md'), /Unreferenced candidates/);
});
