# 1Touch IT Domain and Personal Portfolio Restoration

## Goal

Split the current combined website into two clear properties:

- `www.1touchit.com.au` — 1Touch IT business website
- `nareshadhikari.com.au` — Naresh Adhikari personal portfolio and resume

The only public business email should be `support@1touchit.com.au`.

## Preserved source snapshots

- Current 1Touch IT source: `main`
- Business migration work: `migration/1touchit-domain`
- Recovered personal portfolio baseline: `restore/personal-portfolio-2026-03-22`
- Personal baseline commit: `51d81ce2e1df256d2357a21f9a377bc5b54ee4d0`

Do not reset or force-push `main`. Do not delete either preservation branch.

## Phase 1 — Prepare the 1Touch IT business website

Work only on `migration/1touchit-domain`.

1. Set the canonical business hostname to `https://www.1touchit.com.au/`.
2. Replace every `https://nareshadhikari.com.au` business-site reference in:
   - Open Graph metadata
   - Twitter metadata
   - JSON-LD structured data
   - sitemap and robots configuration
3. Replace every displayed and linked personal email with `support@1touchit.com.au`.
4. Verify the Web3Forms access key sends submissions to `support@1touchit.com.au`. Changing visible HTML text alone does not change the Web3Forms delivery mailbox.
5. Replace the embedded founder/resume portal with a simple external link to `https://nareshadhikari.com.au` after the personal site is deployed.
6. Keep HomeLife Hub links pointing to `https://homelifehub.com.au`.
7. Test navigation, mobile layout, images, contact form, favicon, social preview and sitemap.

Already prepared on this branch:

- `CNAME` → `www.1touchit.com.au`
- `robots.txt` → new business sitemap
- `sitemap.xml` → business root only

## Phase 2 — Create a separate personal-site repository

Create a new private repository, recommended name: `Naresh-Personal-Website`.

Copy the complete tree from `restore/personal-portfolio-2026-03-22` into its `main` branch. Do not copy the 1Touch IT business version.

Update the restored content before deployment:

1. Keep Home, About, Skills, Education/Certifications, Experience and Contact.
2. Refresh current role, years of experience, certifications and project links.
3. Add HomeLife Hub and 1Touch IT under Projects / Ventures.
4. Link 1Touch IT to `https://www.1touchit.com.au`.
5. Decide whether the personal contact should show a personal email, LinkedIn only, or a contact form. Do not show the business support address as the main personal identity unless intentionally desired.
6. Replace outdated resume images with a current accessible resume page or PDF.
7. Set personal metadata, structured data, sitemap, favicon and canonical URL to `https://nareshadhikari.com.au/`.

## Phase 3 — Configure GitHub Pages and DNS

Before changing DNS, add and verify both domains in GitHub account Settings → Pages to reduce domain-takeover risk.

### 1Touch IT

In the business repository Pages settings, set custom domain:

`www.1touchit.com.au`

At the DNS provider:

- `CNAME` record: host `www` → `iamnarace.github.io`
- Configure the apex `1touchit.com.au` using the GitHub Pages apex records shown in current GitHub documentation, so it redirects to `www.1touchit.com.au`.
- Do not use wildcard DNS records.

### Personal site

In the new personal repository Pages settings, set custom domain:

`nareshadhikari.com.au`

At the DNS provider:

- Keep or update the apex records to the GitHub Pages values.
- Add `CNAME` host `www` → `iamnarace.github.io` so `www.nareshadhikari.com.au` redirects correctly.

Enable **Enforce HTTPS** on both repositories after GitHub issues the certificates.

## Phase 4 — Safe cutover order

1. Finish and preview the business migration branch.
2. Deploy and validate the new personal repository on its temporary GitHub Pages URL.
3. Configure and verify `1touchit.com.au` in GitHub before adding its DNS records.
4. Point `www.1touchit.com.au` and the apex domain to the business site.
5. Confirm HTTPS, form delivery to `support@1touchit.com.au`, metadata and redirects.
6. Configure `nareshadhikari.com.au` on the new personal repository.
7. Move the old domain DNS to the personal repository.
8. Verify both sites from phone and desktop.
9. Merge the business migration branch only after all branch checks pass.

## Acceptance checklist

### Business site

- [ ] `https://www.1touchit.com.au` loads over HTTPS
- [ ] `https://1touchit.com.au` redirects correctly
- [ ] No business metadata references `nareshadhikari.com.au`
- [ ] Only `support@1touchit.com.au` is displayed for business contact
- [ ] Contact-form test arrives at `support@1touchit.com.au`
- [ ] Sitemap and robots use the 1Touch IT domain
- [ ] Personal resume link opens `nareshadhikari.com.au`

### Personal site

- [ ] `https://nareshadhikari.com.au` loads over HTTPS
- [ ] Site is clearly a personal portfolio, not an IT-service sales site
- [ ] Resume and professional history are current
- [ ] HomeLife Hub and 1Touch IT are linked as projects/ventures
- [ ] No old 1Touch business forms or sales metadata remain

## Rollback

If the 1Touch IT cutover fails, restore the previous DNS records for `nareshadhikari.com.au`; `main` has not been rewritten and the recovered personal snapshot remains protected on its restore branch.
