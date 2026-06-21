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
  assert.match(html, /href="favicon\.svg"/);
  assert.match(html, /assets\/images\/social-share\.png/);
  for (const path of ['favicon.svg', 'assets/images/social-share.png', 'robots.txt', 'sitemap.xml']) {
    assert.ok(exists(path), `${path} missing`);
  }
  assert.ok(statSync(join(root, 'assets/images/social-share.png')).size > 10_000);
  assert.match(readText('robots.txt'), /Sitemap: https:\/\/nareshadhikari\.com\.au\/sitemap\.xml/);
  assert.match(readText('sitemap.xml'), /<loc>https:\/\/nareshadhikari\.com\.au\/<\/loc>/);
});

test('large portraits use responsive AVIF and WebP sources', () => {
  const html = readText('index.html');
  for (const name of ['naresh-profile', 'aboutme']) {
    for (const width of [320, 640, 960]) {
      for (const format of ['avif', 'webp']) {
        const path = `assets/images/optimized/${name}-${width}.${format}`;
        assert.ok(exists(path), `${path} missing`);
        assert.ok(statSync(join(root, path)).size < 450_000, `${path} too large`);
      }
    }
    assert.match(html, new RegExp(`optimized/${name}-320\\.avif`));
    assert.match(html, new RegExp(`optimized/${name}-640\\.webp`));
  }
  assert.match(html, /<picture class="hcard-picture">/);
  assert.match(html, /<picture class="portrait-picture">/);
  assert.match(html, /width="1673" height="2048"/);
  assert.match(html, /width="1536" height="1024"/);
});

test('interactive elements expose semantic controls and state', () => {
  const html = readText('index.html');
  assert.doesNotMatch(html, /<a(?![^>]*href=)[^>]*onclick=/);
  assert.match(html, /class="hamburger"[^>]*aria-expanded="false"[^>]*aria-controls="mm"/);
  assert.match(html, /<button[^>]*class="tcard home/);
  assert.match(html, /class="faq-q"[^>]*aria-expanded="false"[^>]*aria-controls="faq-panel-1"/);
  for (const id of ['fname', 'fphone', 'femail', 'fsuburb', 'fcat', 'fdetails', 'ftime']) {
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
