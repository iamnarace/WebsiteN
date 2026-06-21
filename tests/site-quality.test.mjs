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
