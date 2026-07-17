import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(scriptDir, '..');
const dist = join(root, 'dist');
const excluded = new Set(['.git', '.github', 'dist', 'docs', 'node_modules', 'scripts', 'tests']);

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const name of readdirSync(root)) {
  if (excluded.has(name) || name === 'vercel.json') continue;
  const source = join(root, name);
  const target = join(dist, name);
  if (statSync(source).isDirectory()) cpSync(source, target, { recursive: true });
  else copyFileSync(source, target);
}

const indexPath = join(dist, 'index.html');
let html = readFileSync(indexPath, 'utf8');
const original = html;

function replaceOnce(pattern, replacement, label) {
  const next = html.replace(pattern, replacement);
  if (next === html) throw new Error(`Could not update ${label}`);
  html = next;
}

replaceOnce(
  /  "founder": \{\n    "@type": "Person",\n    "name": "Naresh Adhikari"\n  \},/,
  `  "founder": [
    {
      "@type": "Person",
      "name": "Naresh Adhikari",
      "sameAs": "https://www.linkedin.com/in/iamnarace/"
    },
    {
      "@type": "Person",
      "name": "Subash Thapa",
      "sameAs": "https://www.linkedin.com/in/subash-thapa-264528210/"
    }
  ],`,
  'founder structured data',
);

replaceOnce(
  `  "sameAs": [
    "https://www.linkedin.com/in/iamnarace/",
    "https://homelifehub.com.au"
  ]`,
  `  "sameAs": [
    "https://www.linkedin.com/in/iamnarace/",
    "https://www.linkedin.com/in/subash-thapa-264528210/",
    "https://homelifehub.com.au"
  ]`,
  'organisation links',
);

const founderCss = `

/* ABOUT + FOUNDERS */
.about-hero{padding-bottom:1.6rem}
.about-hero .container{text-align:center}
.about-hero-title{max-width:1120px;margin:0 auto;font-size:clamp(2.65rem,5.35vw,5rem);line-height:1.04;letter-spacing:-.045em}
.about-title-line{display:block}
.about-company{max-width:1080px;margin:0 auto}
.about-company-intro{max-width:820px;margin:0 auto 3.5rem;text-align:center}
.about-company-intro h2{font-size:clamp(2rem,3.35vw,3.15rem);margin-bottom:1.25rem}
.about-company-intro p{max-width:760px;margin:0 auto 1.25rem;font-size:1.02rem}
.about-company-intro .qblock{max-width:720px;margin:2rem auto 0;text-align:left}
.founders-section{padding-top:.75rem;border-top:1px solid var(--line)}
.founders-heading{text-align:center;max-width:700px;margin:2.75rem auto 2rem}
.founders-heading .eyebrow{margin-bottom:.8rem}
.founders-heading h2{font-size:clamp(2rem,3vw,2.8rem);margin-bottom:.8rem}
.founders-heading p{max-width:620px;margin:0 auto;color:var(--ink2);font-size:1rem}
.founders-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem;align-items:stretch}
.founder-card{display:grid;grid-template-columns:minmax(160px,.78fr) minmax(0,1.22fr);gap:1.45rem;align-items:center;background:linear-gradient(145deg,#fff,#fbfbff);border:1px solid var(--line);border-radius:28px;padding:1.35rem;box-shadow:0 16px 38px rgba(18,24,40,.06);transition:transform .25s var(--ease-gentle),box-shadow .25s ease}
.founder-card:hover{transform:translateY(-4px);box-shadow:0 22px 48px rgba(18,24,40,.1)}
.founder-photo{width:100%;aspect-ratio:4/5;object-fit:cover;object-position:center top;border-radius:21px;background:var(--paper);border:1px solid var(--line)}
.founder-content{min-width:0}
.founder-role{display:inline-flex;align-items:center;padding:.38rem .72rem;margin-bottom:.8rem;border-radius:999px;background:var(--lilac);color:var(--lilacD);font-size:.72rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase}
.founder-content h3{font-size:clamp(1.45rem,2.1vw,2rem);margin-bottom:.3rem}
.founder-focus{color:var(--indigo);font-weight:700;font-size:.9rem;margin-bottom:.85rem}
.founder-card .founder-bio{color:var(--ink2);font-size:.94rem;line-height:1.65;margin:0 0 1rem;max-width:none}
.founder-tags{display:flex;flex-wrap:wrap;gap:.45rem;margin-bottom:1.1rem}
.founder-tags span{padding:.35rem .65rem;border-radius:999px;background:var(--paper);border:1px solid var(--line2);font-size:.72rem;font-weight:700;color:var(--ink2)}
.founder-link{display:inline-flex;align-items:center;gap:.5rem;color:#0A66C2;font-weight:700;font-size:.88rem}
.founder-link:hover{color:var(--indigo)}
@media (min-width:769px){.about-title-line{white-space:nowrap}}
@media (max-width:980px){
  .founder-card{grid-template-columns:1fr}
  .founder-photo{max-height:360px;object-position:center 22%}
}
@media (max-width:768px){
  .about-hero-title{font-size:clamp(2.45rem,11vw,3.65rem)}
  .about-title-line{white-space:normal}
  .founders-grid{grid-template-columns:1fr}
  .founder-card{grid-template-columns:145px minmax(0,1fr)}
  .founder-photo{max-height:none}
}
@media (max-width:560px){
  .section-panel{padding:1.35rem}
  .founder-card{grid-template-columns:1fr;padding:1rem}
  .founder-photo{max-height:440px}
  .about-company-intro{text-align:left}
  .about-company-intro .qblock{margin-left:0}
}
`;
replaceOnce('\n/* FAQ */', `${founderCss}\n/* FAQ */`, 'founder styling');

const aboutStart = html.indexOf('<!-- ===== ABOUT ===== -->');
const aboutEnd = html.indexOf('<!-- ===== CONTACT ===== -->');
if (aboutStart < 0 || aboutEnd < 0 || aboutEnd <= aboutStart) throw new Error('Could not locate About page');

const newAbout = `<!-- ===== ABOUT ===== -->
<div id="page-about" class="page">
  <div class="phero about-hero">
    <div class="container">
      <div class="eyebrow" style="margin-bottom:1.1rem">&#9670; About 1Touch IT</div>
      <h1 class="about-hero-title">
        <span class="about-title-line">Business-first support with a</span>
        <span class="about-title-line grad-text">founder-led approach</span>
      </h1>
    </div>
  </div>
  <section class="block" style="padding-top:1.25rem">
    <div class="container">
      <div class="about-company reveal section-panel">
        <div class="about-company-intro">
          <h2>Built for homes and small businesses that want clear, reliable help</h2>
          <p>1Touch IT delivers practical support without lock-in contracts, confusing jargon or faceless call-centre handoffs. Technology help should be clear, honest, useful and easy to access when people genuinely need it.</p>
          <p>Across home technology, small-business systems and digital projects, the focus stays on practical outcomes: improve reliability, reduce frustration, protect what matters and recommend only what is genuinely useful.</p>
          <div class="qblock">“Clear communication. Honest recommendations. Reliable solutions. Personal service.”</div>
        </div>
        <div class="founders-section" id="founders">
          <div class="founders-heading">
            <div class="eyebrow">Meet the Founders</div>
            <h2>Two practical perspectives, one service standard</h2>
            <p>1Touch IT combines hands-on technical delivery with a shared commitment to straightforward advice, dependable support and thoughtful technology decisions.</p>
          </div>
          <div class="founders-grid">
            <article class="founder-card reveal">
              <img class="founder-photo" src="assets/images/naresh-profile.png" alt="Naresh Adhikari, co-founder of 1Touch IT" loading="lazy" decoding="async">
              <div class="founder-content">
                <span class="founder-role">Co-founder</span>
                <h3>Naresh Adhikari</h3>
                <div class="founder-focus">Technical Strategy &amp; Solutions</div>
                <p class="founder-bio">Naresh brings experience across IT support, Microsoft 365, cloud systems, networking and end-user technology. He focuses on practical architecture, clear troubleshooting and solutions that remain useful after the immediate issue is fixed.</p>
                <div class="founder-tags"><span>Microsoft 365</span><span>Cloud &amp; Systems</span><span>Service Delivery</span></div>
                <a class="founder-link" href="https://www.linkedin.com/in/iamnarace/" target="_blank" rel="noopener"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-linkedin"></use></svg>View Naresh on LinkedIn</a>
              </div>
            </article>
            <article class="founder-card reveal">
              <img class="founder-photo" src="assets/images/subash-thapa-founder.jpg" alt="Subash Thapa, co-founder of 1Touch IT" loading="lazy" decoding="async">
              <div class="founder-content">
                <span class="founder-role">Co-founder</span>
                <h3>Subash Thapa</h3>
                <div class="founder-focus">IT Operations &amp; Client Support</div>
                <p class="founder-bio">Subash brings a customer-focused IT background with experience supporting workplace technology and a foundation in Microsoft 365, Azure administration and networking. He helps keep delivery practical, approachable and aligned with real client needs.</p>
                <div class="founder-tags"><span>IT Support</span><span>Microsoft 365</span><span>Networking</span></div>
                <a class="founder-link" href="https://www.linkedin.com/in/subash-thapa-264528210/" target="_blank" rel="noopener"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-linkedin"></use></svg>View Subash on LinkedIn</a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

`;
html = html.slice(0, aboutStart) + newAbout + html.slice(aboutEnd);

html = html.replace(
  'Work with one experienced IT professional who explains the problem clearly and stays focused on the result.',
  'Work directly with a small founder-led team that explains the problem clearly and stays focused on the result.',
);
html = html.replace(
  'Founder-led support backed by a Bachelor of IT plus CCNA, Azure, Microsoft 365, AWS and ITIL certifications.',
  'Practical support shaped by hands-on IT operations, Microsoft 365, networking, cloud and customer-facing service experience.',
);
html = html.replace('If I diagnose a software or hardware issue', 'If we diagnose a software or hardware issue');
html = html.replace('Yes. I offer evening and weekend availability', 'Yes. We offer evening and weekend availability');

replaceOnce(
  /<div class="fcol"><h4>Connect<\/h4>.*?<\/div>/s,
  `<div class="fcol"><h4>Connect</h4><button type="button" class="footer-action" onclick="go('about','founders')">Meet the Founders</button><a href="https://www.linkedin.com/in/iamnarace/" target="_blank" rel="noopener" class="ficon-link"><span class="footer-mark" aria-hidden="true"><svg class="icon icon-sm"><use href="#i-linkedin"></use></svg></span>Naresh on LinkedIn</a><a href="https://www.linkedin.com/in/subash-thapa-264528210/" target="_blank" rel="noopener" class="ficon-link"><span class="footer-mark" aria-hidden="true"><svg class="icon icon-sm"><use href="#i-linkedin"></use></svg></span>Subash on LinkedIn</a><a href="mailto:support@1touchit.com.au" class="ficon-link"><span class="footer-mark" aria-hidden="true"><svg class="icon icon-sm"><use href="#i-mail"></use></svg></span>Email 1Touch IT</a><span>ABN 28 579 398 740</span><span>HomeLife Hub is a product developed by 1Touch IT.</span></div>`,
  'footer founder links',
);

replaceOnce(
  /<div class="social">\s*<a href="https:\/\/www\.linkedin\.com\/in\/iamnarace\/".*?<\/div>/s,
  `<div class="social">
        <a href="https://www.linkedin.com/in/iamnarace/" target="_blank" rel="noopener" aria-label="Naresh Adhikari on LinkedIn"><svg class="icon icon-md" aria-hidden="true"><use href="#i-linkedin"></use></svg></a>
        <a href="https://www.linkedin.com/in/subash-thapa-264528210/" target="_blank" rel="noopener" aria-label="Subash Thapa on LinkedIn"><svg class="icon icon-md" aria-hidden="true"><use href="#i-linkedin"></use></svg></a>
        <a href="mailto:support@1touchit.com.au" aria-label="Email 1Touch IT"><svg class="icon icon-md" aria-hidden="true"><use href="#i-mail"></use></svg></a>
      </div>`,
  'footer social links',
);

if (html === original) throw new Error('No HTML changes were produced');

const imageData = readFileSync(join(root, 'scripts', 'subash-thapa-founder-web.b64'), 'utf8').trim();
const imagePath = join(dist, 'assets', 'images', 'subash-thapa-founder.jpg');
mkdirSync(resolve(imagePath, '..'), { recursive: true });
writeFileSync(imagePath, Buffer.from(imageData, 'base64'));
writeFileSync(indexPath, html.replace(/\r\n/g, '\n'), 'utf8');

console.log('Static two-founder site generated in dist/');
