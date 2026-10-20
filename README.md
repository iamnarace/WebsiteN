# 1Touch IT website

Source code for the static marketing website of **1Touch IT**, an IT-support business serving Greater Sydney. The site presents home and small-business IT services, websites and digital solutions, local how-to guides, and a short preview of the HomeLife Hub product.

The canonical site URL configured in the page metadata is `https://www.1touchit.com.au/`.

> **Status: active.** Content and structure change through pull requests; see the open and closed PRs for design and migration history.

## Tech stack

- Static HTML, CSS and JavaScript (no framework).
- Node.js build scripts in `scripts/` that generate the site into `dist/`; Python scripts for responsive image generation.
- `vercel.json` with the build command and basic security headers (`X-Content-Type-Options`, `Referrer-Policy`, and others).

## Build and test

Requires Node.js (no npm dependencies).

```sh
node scripts/build-two-founder-site.mjs && node scripts/fix-founder-preview.mjs   # writes dist/
node --test tests/site-quality.test.mjs                                            # 7 tests
```

The responsive-image scripts (`scripts/build_responsive_images.py`, `scripts/build_public_assets.py`) need Python and image libraries and are only required when source images change.

## Project structure

| Path | Purpose |
|---|---|
| `index.html`, `experience/`, `projects/`, `404.html` | Site pages |
| `assets/` | CSS, JavaScript and images (including optimised AVIF/WebP variants) |
| `scripts/` | Build and asset tooling |
| `tests/` | Site-quality checks (metadata, assets, responsive images, content) |
| `docs/` | Migration notes and acceptance checklists |

## Deployment

Configured for Vercel through `vercel.json`. Merging to `main` is expected to trigger a production deployment, so review changes before merging.

## Privacy and security

- The site contains business contact details that are intentionally public. Do not add personal or customer data to this repository.
- Images include photographs of people; do not reuse them without permission.
- No secrets are stored in the repository.

## Licence

No licence has been selected, so default copyright applies. Contact the owner before reusing code or content.
