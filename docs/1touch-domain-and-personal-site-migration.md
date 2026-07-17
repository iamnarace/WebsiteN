# 1Touch IT Domain and Personal Portfolio Restoration

## Final architecture

- `www.1touchit.com.au` — 1Touch IT business website
- `nareshadhikari.com.au` — Naresh Adhikari personal portfolio and resume
- GitHub repositories remain private.
- Vercel hosts both websites as separate projects.
- The only public business mailbox is `support@1touchit.com.au`.

## Preserved source

### Business

- Repository: `iamnarace/WebsiteN`
- Current live baseline: `main`
- Prepared migration branch: `migration/1touchit-domain`
- Review PR: `#4`

### Personal portfolio

- New private repository: `iamnarace/Naresh-Personal-Website`
- Recovered source branch: `restore/personal-portfolio-2026-03-22`
- Baseline commit: `51d81ce2e1df256d2357a21f9a377bc5b54ee4d0`

Do not delete the restore branch until both websites are deployed and verified.

## Business migration completed

The migration branch now:

- uses `https://www.1touchit.com.au/` in Open Graph, social-image and JSON-LD business URLs
- displays and links only `support@1touchit.com.au`
- sends founder-background links to `https://nareshadhikari.com.au`
- removes the embedded founder resume and standalone `resume.html`
- removes GitHub Pages `CNAME` and deployment workflow
- updates `robots.txt` and `sitemap.xml`
- includes `vercel.json` with basic security headers
- keeps HomeLife Hub links on `https://homelifehub.com.au`

## Business Vercel deployment

1. Import `iamnarace/WebsiteN` into Vercel.
2. Framework preset: `Other`.
3. Root directory: repository root.
4. Leave build command and output directory empty.
5. Use PR `#4` or branch `migration/1touchit-domain` as the preview.
6. Test desktop, mobile, images, navigation and contact form.
7. Merge PR `#4` only after the preview passes.
8. Confirm production deploys from `main`.
9. Add `1touchit.com.au` and `www.1touchit.com.au` in Vercel.
10. Set `www.1touchit.com.au` as primary and redirect the apex domain to `www`.
11. Copy Vercel's exact DNS records into VentraIP.
12. Keep the existing `nareshadhikari.com.au` DNS unchanged until the 1Touch IT site works over HTTPS.

## Populate the personal repository

The new private repository currently contains only documentation. The connected GitHub tool cannot clone a complete historical binary tree between repositories, so this source-transfer command must be run locally.

Use **PowerShell**:

```powershell
git clone https://github.com/iamnarace/WebsiteN.git
cd WebsiteN
git checkout restore/personal-portfolio-2026-03-22
git remote add personal https://github.com/iamnarace/Naresh-Personal-Website.git
git fetch personal main
$expected = (git ls-remote personal refs/heads/main).Split()[0]
git push personal HEAD:main --force-with-lease="main:$expected"
```

The explicit lease prevents accidental overwrite if the destination changes after it is fetched. Replacing its placeholder history is intentional.

## Personal-site preparation

Before attaching `nareshadhikari.com.au`:

1. Verify Home, About, Skills, Education/Certifications, Experience and Contact.
2. Refresh the current role, certifications and professional summary.
3. Add HomeLife Hub and 1Touch IT under Projects or Ventures.
4. Link 1Touch IT to `https://www.1touchit.com.au`.
5. Decide whether the personal phone number should remain public.
6. Replace outdated resume screenshots with the current resume.
7. Test or replace the recovered EmailJS configuration.
8. Add personal metadata, sitemap and Vercel configuration.

## Personal Vercel deployment

1. Import `iamnarace/Naresh-Personal-Website` into Vercel.
2. Framework preset: `Other`.
3. Root directory: repository root.
4. Leave build command and output directory empty.
5. Review the temporary Vercel URL.
6. Add `nareshadhikari.com.au` and `www.nareshadhikari.com.au`.
7. Set the apex domain as primary and redirect `www` to it.
8. Copy Vercel's exact DNS records into VentraIP.

## Contact forms

### 1Touch IT

The business form uses Web3Forms. Changing visible HTML does not change the destination mailbox for the access key.

Manual verification:

1. Sign in to Web3Forms.
2. Confirm the embedded access key belongs to you.
3. Set or recreate delivery to `support@1touchit.com.au`.
4. Submit a real test from the Vercel preview.
5. Confirm receipt and reply-to behaviour.

### Personal website

The recovered personal portfolio uses EmailJS. Test or replace its service, template and public key before publishing the form.

## Safe cutover order

1. Populate and preview the personal repository.
2. Preview PR `#4` in Vercel.
3. Test the 1Touch IT form and mobile layout.
4. Merge PR `#4`.
5. Attach and verify the 1Touch IT domains.
6. Update 1Touch IT DNS in VentraIP.
7. Attach the personal domains to the personal Vercel project.
8. Move the existing personal-domain DNS in VentraIP.
9. Verify both sites on desktop and mobile.
10. Keep the recovery branch until both sites are stable.

## Acceptance checklist

### 1Touch IT

- [ ] `https://www.1touchit.com.au` loads over HTTPS
- [ ] `https://1touchit.com.au` redirects to `www`
- [ ] only `support@1touchit.com.au` is displayed
- [ ] form submissions arrive at the support mailbox
- [ ] metadata, sitemap and robots use the business domain
- [ ] founder link opens `nareshadhikari.com.au`
- [ ] no resume route remains

### Personal website

- [ ] `https://nareshadhikari.com.au` loads over HTTPS
- [ ] the site is clearly a personal portfolio
- [ ] resume and experience are current
- [ ] HomeLife Hub and 1Touch IT are linked as ventures/projects
- [ ] public contact details have been reviewed
- [ ] no 1Touch IT sales form or business metadata remains

## Rollback

The business `main` branch has not been overwritten. If a cutover fails, keep or restore the existing VentraIP DNS while correcting Vercel. The recovered personal snapshot remains protected on `restore/personal-portfolio-2026-03-22`.
