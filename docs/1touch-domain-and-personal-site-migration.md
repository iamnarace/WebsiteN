# 1Touch IT Domain and Personal Portfolio Restoration

## Final architecture

- `www.1touchit.com.au` — 1Touch IT business website
- `nareshadhikari.com.au` — Naresh Adhikari personal portfolio and resume
- GitHub repositories remain private.
- Vercel hosts both public websites as two separate projects.
- The only public business mailbox is `support@1touchit.com.au`.

## Why Vercel

Vercel can deploy private GitHub repositories, creates preview deployments for branches and pull requests, manages HTTPS, and allows each website to have its own custom domain. GitHub remains the source-control system; Vercel is the hosting platform.

## Preserved source

### Business

- Repository: `iamnarace/WebsiteN`
- Current live baseline: `main`
- Prepared migration branch: `migration/1touchit-domain`

### Personal portfolio

- New private repository: `iamnarace/Naresh-Personal-Website`
- Recovered source branch: `restore/personal-portfolio-2026-03-22` in `iamnarace/WebsiteN`
- Recovered baseline commit: `51d81ce2e1df256d2357a21f9a377bc5b54ee4d0`

Do not delete the restore branch until the personal repository has been populated, deployed and verified.

## Business migration completed in GitHub

The `migration/1touchit-domain` branch now:

- Uses `https://www.1touchit.com.au/` in business Open Graph metadata.
- Uses the new domain in social images and JSON-LD structured data.
- Displays and links only `support@1touchit.com.au` for business contact.
- Links founder-background actions to `https://nareshadhikari.com.au`.
- Removes the embedded founder resume page.
- Removes the standalone `resume.html` business route.
- Removes GitHub Pages `CNAME` and Pages deployment workflow.
- Uses a business-only `robots.txt` and `sitemap.xml`.
- Includes `vercel.json` with basic security headers.
- Keeps HomeLife Hub links pointed to `https://homelifehub.com.au`.

## Business deployment workflow

1. Review the draft pull request from `migration/1touchit-domain` into `main`.
2. In Vercel, create a project by importing `iamnarace/WebsiteN` from GitHub.
3. Keep the repository private.
4. Framework preset: `Other`.
5. Root directory: repository root.
6. Build command: leave empty.
7. Output directory: leave empty.
8. Use the migration branch preview to inspect the complete site before merging.
9. After review, merge the pull request into `main`.
10. Confirm Vercel production deploys from `main`.
11. Add both domains in the Vercel project:
    - `1touchit.com.au`
    - `www.1touchit.com.au`
12. Set `www.1touchit.com.au` as the primary domain and redirect the apex domain to `www`.
13. Copy the exact DNS records shown by Vercel into the VentraIP DNS manager.
14. Do not remove the current `nareshadhikari.com.au` DNS until the 1Touch IT deployment is working over HTTPS.

## Personal repository population

The new repository is private and currently contains only its initial README. The GitHub connector cannot perform a cross-repository binary-tree clone, so this is the one source-transfer step that must be completed through GitHub Importer or local Git.

Preferred local Git method:

```bash
git clone https://github.com/iamnarace/WebsiteN.git
cd WebsiteN
git checkout restore/personal-portfolio-2026-03-22
git remote add personal https://github.com/iamnarace/Naresh-Personal-Website.git
git push personal restore/personal-portfolio-2026-03-22:main --force-with-lease
```

The destination repository currently has only a placeholder README, so replacing its `main` history with the recovered portfolio is intentional. Confirm the source branch name before running the push.

## Personal-site preparation

Before attaching `nareshadhikari.com.au`:

1. Verify Home, About, Skills, Education/Certifications, Experience and Contact.
2. Refresh current role, certifications and professional summary.
3. Add HomeLife Hub and 1Touch IT under Projects or Ventures.
4. Link 1Touch IT to `https://www.1touchit.com.au`.
5. Review whether the personal phone number should remain public.
6. Replace outdated resume screenshots with the current resume.
7. Check that any EmailJS contact-form configuration is still valid.
8. Add personal metadata, social image, sitemap and `vercel.json`.

## Personal deployment workflow

1. In Vercel, create another project by importing `iamnarace/Naresh-Personal-Website`.
2. Framework preset: `Other`.
3. Root directory: repository root.
4. Build command and output directory: leave empty.
5. Review the temporary Vercel deployment URL.
6. Add:
   - `nareshadhikari.com.au`
   - `www.nareshadhikari.com.au`
7. Set `nareshadhikari.com.au` as the primary domain.
8. Copy the exact DNS records provided by Vercel into VentraIP.
9. Redirect `www.nareshadhikari.com.au` to the apex domain.

## Contact-form requirement

The business form uses Web3Forms. Changing the visible email address does not change the destination mailbox for the existing Web3Forms access key.

Manual verification required:

1. Sign in to Web3Forms.
2. Confirm that the access key embedded in the website belongs to you.
3. Set or recreate its delivery address as `support@1touchit.com.au`.
4. Submit a real test through the Vercel preview.
5. Confirm receipt and reply-to behaviour.

The personal portfolio uses EmailJS in the recovered baseline. Test or replace that configuration before publishing the personal contact form.

## Safe cutover order

1. Populate and privately preview the personal repository.
2. Preview the 1Touch IT migration branch in Vercel.
3. Test the business form and mobile layout.
4. Merge the 1Touch IT migration pull request.
5. Attach `1touchit.com.au` and `www.1touchit.com.au` in Vercel.
6. Update 1Touch IT DNS in VentraIP and confirm HTTPS.
7. Attach `nareshadhikari.com.au` to the personal Vercel project.
8. Move the existing personal-domain DNS in VentraIP.
9. Verify both domains on desktop and mobile.
10. Keep the recovery branch until both sites have been stable and verified.

## Acceptance checklist

### 1Touch IT

- [ ] `https://www.1touchit.com.au` loads over HTTPS
- [ ] `https://1touchit.com.au` redirects to `www`
- [ ] Only `support@1touchit.com.au` is displayed
- [ ] Form submissions arrive at `support@1touchit.com.au`
- [ ] Metadata, sitemap and robots use the 1Touch IT domain
- [ ] Founder link opens `nareshadhikari.com.au`
- [ ] No resume route remains on the business site

### Personal website

- [ ] `https://nareshadhikari.com.au` loads over HTTPS
- [ ] Site is clearly a personal portfolio
- [ ] Resume and experience are current
- [ ] HomeLife Hub and 1Touch IT are linked as ventures/projects
- [ ] Contact method has been reviewed for privacy
- [ ] No 1Touch IT sales form or business metadata remains

## Rollback

The current business `main` branch has not been overwritten. If the cutover fails, leave or restore the existing VentraIP DNS while correcting the Vercel project. The recovered personal snapshot remains protected on `restore/personal-portfolio-2026-03-22`.
