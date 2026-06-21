# Gentle Flow UX Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the current WebsiteN design while adding Gentle Flow interaction polish, fixing broken assets, improving responsive-image performance and accessibility, and adding two useful local guides.

**Architecture:** Keep the static `index.html` application and its four in-document views. Add focused build/audit scripts under `scripts/`, Node built-in regression tests under `tests/`, and small semantic/CSS/JavaScript changes inside `index.html`; add no framework or runtime dependency.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node.js `node:test`, Python 3 with Pillow 12.2, GitHub Pages.

## Global Constraints

- Preserve existing colours, typography, section order, copy hierarchy, card shapes, imagery style, and four-view structure.
- Use restrained opacity/vertical-settle movement; no scroll hijacking, parallax, cursor-following, framework, animation library, backend, or external state.
- Content and controls must remain usable if JavaScript fails.
- Disable or simplify all motion for `prefers-reduced-motion: reduce`.
- Delete only files proven unused; defer real internal URLs and the third article.

## File Map

- Modify `index.html`: metadata, responsive images, semantic controls, Gentle Flow CSS/JavaScript, and guides.
- Create `tests/site-quality.test.mjs`: static regression checks for every listed defect.
- Create `scripts/build_public_assets.py`: favicon and 1200×630 social-share image.
- Create `scripts/build_responsive_images.py`: AVIF/WebP variants.
- Create `scripts/audit_unused_assets.mjs` and `docs/asset-audit.md`: safe legacy-asset inventory.
- Create `robots.txt`, `sitemap.xml`, `favicon.svg`, social image, and responsive variants.
- Remove only `favicon.svg.txt`, `social-share.svg.txt`, `README.md.txt`, and `README-UPDATE.txt` after confirming no runtime references.

---

### Task 1: Public assets and crawlability

**Files:**
- Create: `tests/site-quality.test.mjs`
- Create: `scripts/build_public_assets.py`
- Create: `favicon.svg`, `assets/images/social-share.png`, `robots.txt`, `sitemap.xml`
- Modify: `index.html:5-24`

**Interfaces:** Produces `readText(path)` and `exists(path)` test helpers plus all public metadata files.

- [ ] **Step 1: Write the failing public-asset test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readText = path => readFileSync(join(root, path), 'utf8');
const exists = path => existsSync(join(root, path));

test('public metadata assets and crawl files exist', () => {
  const html = readText('index.html');
  assert.match(html, /href="favicon\.svg"/);
  assert.match(html, /assets\/images\/social-share\.png/);
  for (const path of ['favicon.svg', 'assets/images/social-share.png', 'robots.txt', 'sitemap.xml']) assert.ok(exists(path), `${path} missing`);
  assert.ok(statSync(join(root, 'assets/images/social-share.png')).size > 10_000);
  assert.match(readText('robots.txt'), /Sitemap: https:\/\/nareshadhikari\.com\.au\/sitemap\.xml/);
  assert.match(readText('sitemap.xml'), /<loc>https:\/\/nareshadhikari\.com\.au\/<\/loc>/);
});
```

- [ ] **Step 2: Run and verify RED**

```powershell
& 'C:\Users\NareshAdmin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-quality.test.mjs
```

Expected: FAIL on missing public files.

- [ ] **Step 3: Create `scripts/build_public_assets.py`**

```python
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).resolve().parents[1]

def font(size, bold=False):
    names = ["C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf", "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"]
    for name in names:
        try: return ImageFont.truetype(name, size)
        except OSError: pass
    return ImageFont.load_default()

image = Image.new("RGB", (1200, 630), "#FAFAF8")
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((70, 65, 1130, 565), 42, fill="#FFFFFF", outline="#E2DFD7", width=3)
draw.rounded_rectangle((105, 105, 215, 215), 26, fill="#4F46E5")
draw.text((132, 122), "NA", font=font(38, True), fill="white")
draw.text((105, 270), "Naresh Adhikari", font=font(60, True), fill="#0B0B0F")
draw.text((105, 350), "Professional IT & Systems Support", font=font(38, True), fill="#4F46E5")
draw.text((105, 415), "Sydney homes and small businesses", font=font(28), fill="#3A3A44")
draw.rounded_rectangle((105, 485, 420, 530), 18, fill="#FF6B4A")
draw.text((130, 494), "No Fix, No Fee", font=font(22, True), fill="#20100C")
(ROOT / "assets/images").mkdir(parents=True, exist_ok=True)
image.save(ROOT / "assets/images/social-share.png", optimize=True)
(ROOT / "favicon.svg").write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#4F46E5"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs><rect width="64" height="64" rx="15" fill="url(#g)"/><path d="M19 45V19l26 26V19" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="19" cy="19" r="4" fill="#FF6B4A"/></svg>''', encoding="utf-8")
```

- [ ] **Step 4: Generate assets and create crawl files**

```powershell
& 'C:\Users\NareshAdmin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts/build_public_assets.py
```

`robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://nareshadhikari.com.au/sitemap.xml
```

`sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://nareshadhikari.com.au/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://nareshadhikari.com.au/resume.html</loc><changefreq>yearly</changefreq><priority>0.5</priority></url>
</urlset>
```

- [ ] **Step 5: Run tests; expect 1 pass, 0 fail**

- [ ] **Step 6: Commit**

```powershell
git add tests scripts favicon.svg assets/images/social-share.png robots.txt sitemap.xml index.html
git commit -m "fix: restore public metadata assets"
```

---

### Task 2: Responsive profile and about images

**Files:**
- Modify: `tests/site-quality.test.mjs`, `index.html:407,660,770`
- Create: `scripts/build_responsive_images.py`
- Create: `assets/images/optimized/{naresh-profile,aboutme}-{320,640,960}.{avif,webp}`

**Interfaces:** Consumes the two PNG originals and produces deterministic responsive variants and `<picture>` markup.

- [ ] **Step 1: Append the failing test**

```js
test('large portraits use responsive AVIF and WebP sources', () => {
  const html = readText('index.html');
  for (const name of ['naresh-profile', 'aboutme']) {
    for (const width of [320, 640, 960]) for (const format of ['avif', 'webp']) {
      const path = `assets/images/optimized/${name}-${width}.${format}`;
      assert.ok(exists(path), `${path} missing`);
      assert.ok(statSync(join(root, path)).size < 450_000, `${path} too large`);
    }
    assert.match(html, new RegExp(`optimized/${name}-320\\.avif`));
    assert.match(html, new RegExp(`optimized/${name}-640\\.webp`));
  }
  assert.match(html, /<picture class="hcard-picture">/);
  assert.match(html, /<picture class="portrait-picture">/);
  assert.match(html, /width="1673" height="2048"/);
  assert.match(html, /width="1536" height="1024"/);
});
```

- [ ] **Step 2: Run and verify RED** — expected first missing optimized file.

- [ ] **Step 3: Create the generator**

```python
from pathlib import Path
from PIL import Image, ImageOps
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/images/optimized"
OUT.mkdir(parents=True, exist_ok=True)
for name in ("naresh-profile", "aboutme"):
    with Image.open(ROOT / f"assets/images/{name}.png") as source:
        rgb = ImageOps.exif_transpose(source).convert("RGB")
        for width in (320, 640, 960):
            height = round(rgb.height * width / rgb.width)
            resized = rgb.resize((width, height), Image.Resampling.LANCZOS)
            resized.save(OUT / f"{name}-{width}.webp", "WEBP", quality=78, method=6)
            resized.save(OUT / f"{name}-{width}.avif", "AVIF", quality=55, speed=6)
```

- [ ] **Step 4: Generate variants**

```powershell
& 'C:\Users\NareshAdmin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts/build_responsive_images.py
```

- [ ] **Step 5: Replace all three image locations with `<picture>`**

Hero avatar:

```html
<picture class="hcard-picture"><source type="image/avif" srcset="assets/images/optimized/naresh-profile-320.avif 320w, assets/images/optimized/naresh-profile-640.avif 640w" sizes="46px"><source type="image/webp" srcset="assets/images/optimized/naresh-profile-320.webp 320w, assets/images/optimized/naresh-profile-640.webp 640w" sizes="46px"><img src="assets/images/naresh-profile.png" width="1673" height="2048" alt="Naresh Adhikari" decoding="async" fetchpriority="high"></picture>
```

Large portrait pattern, using `aboutme` names for the About view and `naresh-profile` names for Resume:

```html
<picture class="portrait-picture"><source type="image/avif" srcset="assets/images/optimized/naresh-profile-320.avif 320w, assets/images/optimized/naresh-profile-640.avif 640w, assets/images/optimized/naresh-profile-960.avif 960w" sizes="(max-width:900px) 100vw, 40vw"><source type="image/webp" srcset="assets/images/optimized/naresh-profile-320.webp 320w, assets/images/optimized/naresh-profile-640.webp 640w, assets/images/optimized/naresh-profile-960.webp 960w" sizes="(max-width:900px) 100vw, 40vw"><img src="assets/images/naresh-profile.png" width="1673" height="2048" alt="Naresh Adhikari" loading="lazy" decoding="async"></picture>
```

For the About image, use the same source structure with `aboutme` filenames and fallback dimensions `width="1536" height="1024"`. Extend `.hcard-av` and `.pframe` image selectors to include `picture` while retaining current crop/radius.

- [ ] **Step 6: Run tests; expect 2 passes, 0 fail**

- [ ] **Step 7: Commit**

```powershell
git add tests scripts assets/images/optimized index.html
git commit -m "perf: serve responsive portrait images"
```

---

### Task 3: Semantic controls and form relationships

**Files:** Modify `tests/site-quality.test.mjs`, `index.html:357-377,448-470,709-730,738-744,912-918`.

**Interfaces:** Produces semantic `data-view` buttons, `toggleMenu(force)`, `toggleDisclosure(button)`, label relationships, and ARIA state.

- [ ] **Step 1: Append failing test**

```js
test('interactive elements expose semantic controls and state', () => {
  const html = readText('index.html');
  assert.doesNotMatch(html, /<a(?![^>]*href=)[^>]*onclick=/);
  assert.match(html, /class="hamburger"[^>]*aria-expanded="false"[^>]*aria-controls="mm"/);
  assert.match(html, /<button[^>]*class="tcard home/);
  assert.match(html, /class="faq-q"[^>]*aria-expanded="false"[^>]*aria-controls="faq-panel-1"/);
  for (const id of ['fname','fphone','femail','fsuburb','fcat','fdetails','ftime']) assert.match(html, new RegExp(`<label for="${id}"`));
});
```

- [ ] **Step 2: Run and verify RED** — expected anchor/ARIA/label failure.

- [ ] **Step 3: Convert in-document actions to buttons**

Use `<button type="button" class="nav-action" data-view="services" onclick="go('services')">How We Help</button>` for nav/footer/brand actions. Keep external and email links as anchors. Use `<button type="button" class="tcard home" onclick="go('services','home-services')">…</button>` for service cards.

```css
.nav-action,.footer-action{border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.nav-links .nav-action{padding:.55rem 1rem;border-radius:100px;font-size:.9rem;color:var(--ink2);font-weight:500}
.nav-links .nav-action:hover,.nav-links .nav-action[aria-current="page"]{background:var(--paper);color:var(--ink)}
.tcard,.faq-q{width:100%;text-align:left;color:inherit;font:inherit}
```

- [ ] **Step 4: Convert FAQs and connect form labels**

FAQ IDs run from `faq-button-1`/`faq-panel-1` through `faq-button-6`/`faq-panel-6`:

```html
<div class="faq reveal"><button type="button" class="faq-q" id="faq-button-1" aria-expanded="false" aria-controls="faq-panel-1" onclick="toggleDisclosure(this)">What does "No Fix, No Fee" actually mean?<span class="ic" aria-hidden="true">+</span></button><div class="faq-a" id="faq-panel-1" role="region" aria-labelledby="faq-button-1" hidden><div>If I diagnose a software or hardware issue and it turns out to be genuinely unfixable, you pay nothing for the diagnostic work. You only ever pay when there's a real, working result.</div></div></div>
```

Add matching `for` values to all seven existing labels.

- [ ] **Step 5: Implement semantic state**

Set hamburger `aria-expanded="false" aria-controls="mm"`; set mobile menu `hidden`.

```js
function toggleMenu(force){
  const menu=document.getElementById('mm'),trigger=document.querySelector('.hamburger');
  const open=typeof force==='boolean'?force:trigger.getAttribute('aria-expanded')!=='true';
  trigger.setAttribute('aria-expanded',String(open));
  trigger.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  menu.hidden=!open;
}
function toggleDisclosure(button){
  const panel=document.getElementById(button.getAttribute('aria-controls'));
  const open=button.getAttribute('aria-expanded')==='true';
  button.setAttribute('aria-expanded',String(!open));
  panel.hidden=open;
  button.closest('.faq,.guide-card')?.classList.toggle('open',!open);
}
```

- [ ] **Step 6: Run tests; expect 3 passes, 0 fail**

- [ ] **Step 7: Commit**

```powershell
git add tests/site-quality.test.mjs index.html
git commit -m "fix: make site controls accessible"
```

---

### Task 4: Gentle Flow and reduced motion

**Files:** Modify `tests/site-quality.test.mjs`, `index.html:29-350,937-987`.

**Interfaces:** Consumes Task 3 state controls; produces `setActiveView(id)`, `motionReduced`, page classes, focus treatment, and reduced-motion CSS.

- [ ] **Step 1: Append failing test**

```js
test('Gentle Flow and reduced-motion paths are present', () => {
  const html=readText('index.html');
  for (const pattern of [/--motion-fast:\s*160ms/,/--motion-page:\s*360ms/,/classList\.add\('is-leaving'\)/,/aria-current/,/:focus-visible/,/@media\s*\(prefers-reduced-motion:\s*reduce\)/,/scroll-behavior:\s*auto/,/animation-duration:\s*\.01ms/]) assert.match(html,pattern);
});
```

- [ ] **Step 2: Run and verify RED** — expected missing motion tokens.

- [ ] **Step 3: Add tokens and states**

```css
:root{--motion-fast:160ms;--motion-base:260ms;--motion-page:360ms;--ease-gentle:cubic-bezier(.16,1,.3,1)}
.page{display:none;opacity:0;transform:translateY(8px)}
.page.active{display:block;animation:page-enter var(--motion-page) var(--ease-gentle) both}
.page.is-leaving{display:block;animation:page-leave var(--motion-fast) ease both}
@keyframes page-enter{to{opacity:1;transform:none}}@keyframes page-leave{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-4px)}}
.reveal{opacity:0;transform:translateY(18px);transition:opacity var(--motion-page) var(--ease-gentle),transform var(--motion-page) var(--ease-gentle)}
.reveal.in{opacity:1;transform:none}:focus-visible{outline:3px solid var(--indigo);outline-offset:4px}.btn-coral,.submit-btn{color:#20100C}
```

- [ ] **Step 4: Replace `go()` and add active state**

```js
const motionReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function setActiveView(id){document.querySelectorAll('[data-view]').forEach(control=>control.dataset.view===id?control.setAttribute('aria-current','page'):control.removeAttribute('aria-current'))}
function go(id,target){
  const current=document.querySelector('.page.active'),next=document.getElementById(`page-${id}`);
  if(!next||current===next)return;
  const activate=()=>{
    current?.classList.remove('active','is-leaving');next.classList.add('active');setActiveView(id);toggleMenu(false);
    const destination=target?document.getElementById(target):next;
    destination?.scrollIntoView({behavior:motionReduced.matches?'auto':'smooth',block:'start'});
    const heading=next.querySelector('h1,h2');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});initReveal();
  };
  if(motionReduced.matches||!current)activate();else{current.classList.add('is-leaving');window.setTimeout(activate,160)}
}
setActiveView('home');
```

- [ ] **Step 5: Add complete reduced-motion path**

```css
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}.sb,.hcard,.mq-track,.cert-track,.pill .dot{animation:none!important;transform:none!important}.reveal,.page{opacity:1;transform:none}}
```

- [ ] **Step 6: Run tests; expect 4 passes, 0 fail**

- [ ] **Step 7: Commit**

```powershell
git add tests/site-quality.test.mjs index.html
git commit -m "feat: add Gentle Flow interaction polish"
```

---

### Task 5: Helpful Local Guides

**Files:** Modify `tests/site-quality.test.mjs`, `index.html:180-280,530-552`.

**Interfaces:** Consumes `toggleDisclosure`; produces `#helpful-guides` and two semantic disclosures.

- [ ] **Step 1: Append failing guide test**

```js
test('home contains two useful local guides',()=>{const html=readText('index.html');assert.match(html,/id="helpful-guides"/);assert.match(html,/How to troubleshoot slow or unreliable Wi-Fi at home/);assert.match(html,/Microsoft 365 security essentials for small businesses/);assert.equal((html.match(/class="guide-card reveal"/g)||[]).length,2);assert.match(html,/id="guide-panel-wifi"/);assert.match(html,/id="guide-panel-m365"/)});
```

- [ ] **Step 2: Run and verify RED** — expected missing `#helpful-guides`.

- [ ] **Step 3: Add guide CSS**

```css
.guide-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem}.guide-card{background:#fff;border:1px solid var(--line);border-radius:var(--r);overflow:hidden;transition:transform var(--motion-base) var(--ease-gentle),box-shadow var(--motion-base) ease}.guide-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.06)}.guide-toggle{width:100%;padding:2rem;border:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit}.guide-toggle h3{font-size:1.35rem;margin:.8rem 0}.guide-toggle p,.guide-panel{color:var(--ink2)}.guide-panel{padding:0 2rem 2rem}.guide-panel h4{margin:1.2rem 0 .5rem}.guide-panel ul{padding-left:1.2rem}@media(max-width:768px){.guide-grid{grid-template-columns:1fr}}
```

- [ ] **Step 4: Insert section between Testimonials and CTA**

```html
<section class="block" id="helpful-guides"><div class="container"><div class="shead reveal"><div class="eyebrow">◆ Helpful Local Guides</div><h2>Practical advice before you book support</h2><p>Clear steps for common Sydney home and small-business technology problems.</p></div><div class="guide-grid">
<article class="guide-card reveal"><button type="button" class="guide-toggle" id="guide-button-wifi" aria-expanded="false" aria-controls="guide-panel-wifi" onclick="toggleDisclosure(this)"><span class="eyebrow">Home Wi-Fi</span><h3>How to troubleshoot slow or unreliable Wi-Fi at home</h3><p>Seven practical checks before replacing your router or calling your provider.</p></button><div class="guide-panel" id="guide-panel-wifi" role="region" aria-labelledby="guide-button-wifi" hidden><h4>Start with the connection</h4><p>Test beside the router, compare Wi-Fi with a wired connection if possible, then restart the NBN box and router once.</p><h4>Check placement and interference</h4><ul><li>Use an open, central, elevated position.</li><li>Avoid metal cabinets, microwaves, thick masonry, and crowded power boards.</li><li>Use 5 GHz nearby and 2.4 GHz farther away.</li></ul><h4>Know when mesh helps</h4><p>Mesh can help larger or multi-storey homes, but cannot repair weak NBN service. If wired speed is healthy but rooms have dead zones, a measured Wi-Fi survey is the useful next step.</p></div></article>
<article class="guide-card reveal"><button type="button" class="guide-toggle" id="guide-button-m365" aria-expanded="false" aria-controls="guide-panel-m365" onclick="toggleDisclosure(this)"><span class="eyebrow">Small Business Security</span><h3>Microsoft 365 security essentials for small businesses</h3><p>A practical baseline that reduces account takeover, phishing, and avoidable data loss.</p></button><div class="guide-panel" id="guide-panel-m365" role="region" aria-labelledby="guide-button-m365" hidden><h4>Protect identities first</h4><ul><li>Require multifactor authentication for every user.</li><li>Use separate everyday and administrator accounts.</li><li>Review sign-ins, forwarding rules, and inactive accounts.</li></ul><h4>Protect devices and information</h4><ul><li>Keep Windows, browsers, Office, and security tools updated.</li><li>Use encryption, screen locks, and managed endpoint protection.</li><li>Maintain an independent backup for critical cloud data.</li></ul><h4>Make phishing reportable</h4><p>Give staff a simple way to report suspicious messages. Review users, devices, sharing links, mailbox rules, and recovery details quarterly.</p></div></article>
</div></div></section>
```

- [ ] **Step 5: Run tests; expect 5 passes, 0 fail**

- [ ] **Step 6: Commit**

```powershell
git add tests/site-quality.test.mjs index.html
git commit -m "feat: add local IT help guides"
```

---

### Task 6: Legacy audit and final verification

**Files:** Create `scripts/audit_unused_assets.mjs`, `docs/asset-audit.md`; modify tests; delete four confirmed artifacts; repair earlier files only if verification finds defects.

**Interfaces:** Produces a report only; never automatically deletes candidates.

- [ ] **Step 1: Append failing cleanup test**

```js
test('confirmed artifacts are removed and audit exists',()=>{for(const path of ['favicon.svg.txt','social-share.svg.txt','README.md.txt','README-UPDATE.txt'])assert.equal(exists(path),false,`${path} should be removed`);assert.ok(exists('docs/asset-audit.md'));assert.match(readText('docs/asset-audit.md'),/Unreferenced candidates/)});
```

- [ ] **Step 2: Run and verify RED** — expected artifact/report failure.

- [ ] **Step 3: Create read-only scanner**

```js
import { readdirSync,readFileSync,statSync,writeFileSync } from 'node:fs';import { extname,join,relative } from 'node:path';import { fileURLToPath } from 'node:url';
const root=join(fileURLToPath(new URL('..',import.meta.url))),textExt=new Set(['.html','.css','.js','.json','.md','.txt','.xml']),ignore=new Set(['.git','.superpowers']);
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{if(ignore.has(entry.name))return[];const path=join(dir,entry.name);return entry.isDirectory()?walk(path):[path]})}
const files=walk(root),corpus=files.filter(path=>textExt.has(extname(path).toLowerCase())).map(path=>readFileSync(path,'utf8')).join('\n');
const candidates=files.filter(path=>relative(root,path).replaceAll('\\','/').startsWith('assets/')).filter(path=>{const rel=relative(root,path).replaceAll('\\','/');return!corpus.includes(rel)&&!corpus.includes(rel.replace(/^assets\//,''))}).sort((a,b)=>statSync(b).size-statSync(a).size);
const lines=['# Asset Audit','','Generated by `node scripts/audit_unused_assets.mjs`.','','## Unreferenced candidates','','Candidates only; not automatically deleted.','',...candidates.map(path=>`- \`${relative(root,path).replaceAll('\\','/')}\` — ${(statSync(path).size/1024).toFixed(1)} KB`),'','## Confirmed removed artifacts','','- `favicon.svg.txt` — replaced by `favicon.svg`.','- `social-share.svg.txt` — replaced by production PNG.','- `README.md.txt` — duplicate export.','- `README-UPDATE.txt` — obsolete handoff note.'];writeFileSync(join(root,'docs','asset-audit.md'),`${lines.join('\n')}\n`);
```

- [ ] **Step 4: Generate report and remove only confirmed files**

```powershell
& 'C:\Users\NareshAdmin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/audit_unused_assets.mjs
Remove-Item -LiteralPath favicon.svg.txt,social-share.svg.txt,README.md.txt,README-UPDATE.txt
```

Read the report; do not delete listed candidates.

- [ ] **Step 5: Run static verification**

```powershell
& 'C:\Users\NareshAdmin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-quality.test.mjs
git diff --check
```

Expected: 6 tests pass, 0 fail; no whitespace errors.

- [ ] **Step 6: Start local server and verify browser**

```powershell
& 'C:\Users\NareshAdmin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4173
```

Using the in-app Browser, verify at 1440×900 and 390×844: unchanged visual identity; Home/Services/About/Resume/Contact transitions; active nav; heading focus; keyboard operation; mobile-menu ARIA state; FAQ and guide disclosures; responsive-image loading; no horizontal overflow; no console errors. Emulate reduced motion and confirm smooth scrolling, blobs, float, marquee, and certification motion stop. Confirm HTTP 200 for `/favicon.svg`, `/assets/images/social-share.png`, `/robots.txt`, and `/sitemap.xml`.

- [ ] **Step 7: Re-run tests after repairs**

Expected: 6 tests pass, 0 fail; `git diff --check` silent.

- [ ] **Step 8: Commit**

```powershell
git add tests scripts docs/asset-audit.md index.html assets/images favicon.svg robots.txt sitemap.xml
git add -u -- favicon.svg.txt social-share.svg.txt README.md.txt README-UPDATE.txt
git commit -m "chore: verify Gentle Flow website upgrade"
```

## Final Requirements Checklist

- [ ] Design identity and four-view structure remain intact.
- [ ] Favicon, social image, robots, and sitemap resolve.
- [ ] Profile/about images use responsive AVIF/WebP and explicit dimensions.
- [ ] Navigation, cards, FAQs, guides, mobile menu, and form labels are semantic and keyboard-operable.
- [ ] Gentle Flow, active navigation, focus visibility, contrast, and reduced motion are verified.
- [ ] Two local guides appear before the home CTA.
- [ ] Only four proven artifacts are removed; uncertain assets remain listed.
- [ ] Static tests, browser checks, HTTP asset checks, and console inspection are clean.
