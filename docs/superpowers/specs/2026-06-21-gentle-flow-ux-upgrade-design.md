# Gentle Flow UX Upgrade

Date: 2026-06-21
Status: Approved design direction; awaiting final written-spec review

## Objective

Improve the website's motion, interaction quality, accessibility, performance, search-engine essentials, and useful local content without redesigning it. Preserve the existing visual identity: colours, typography, section order, copy hierarchy, card shapes, imagery style, and four-view single-document structure.

## Design Direction

Use the approved **Gentle Flow** interaction style:

- Calm page-view transitions using short opacity and vertical-settle movement.
- Subtle section reveals as content enters the viewport.
- Clear active navigation feedback.
- Restrained hover and focus feedback for cards, links, buttons, and controls.
- No dramatic parallax, cursor-following effects, scroll hijacking, or layout changes.
- Motion must stop or simplify when the visitor requests reduced motion.

The experience should feel polished, responsive, professional, and lightweight. Motion must support orientation and feedback rather than decoration.

## Scope

### UX and motion

- Refine the existing `go()` view transition without changing the current navigation model.
- Use one shared easing curve and a small motion-duration scale.
- Reveal meaningful content groups, not every individual text line.
- Add active and hover states that do not cause layout shift.
- Preserve immediate response for keyboard and touch input.
- Maintain the existing desktop and mobile layout.

### Broken assets and crawlability

- Supply a working favicon and update the favicon reference to an existing asset.
- Supply a 1200×630 social-share image at the path referenced by Open Graph and Twitter metadata.
- Add `robots.txt` that permits normal crawling and identifies the sitemap.
- Add `sitemap.xml` for the canonical public URLs that currently exist. Internal JavaScript views will not be represented as separate URLs until the later routing upgrade.

### Performance

- Convert the large profile and about images to WebP and AVIF.
- Generate practical responsive widths and use `<picture>`, `srcset`, `sizes`, explicit dimensions, and appropriate loading hints.
- Keep a reliable fallback format.
- Audit legacy assets and produce a list of files that appear unused.
- Remove only assets proven unreferenced by repository code and verified not to be required by current pages. Uncertain files remain untouched.
- Avoid adding a framework, animation library, or other runtime dependency.

### Accessibility

- Replace anchor elements without `href` with semantic buttons when they trigger in-page application behaviour.
- Convert clickable service cards into keyboard-operable semantic controls without changing their appearance.
- Convert FAQ questions to buttons with `aria-expanded` and `aria-controls`.
- Associate every visible form label with its input using matching `for` and `id` values.
- Add `aria-expanded` and `aria-controls` to mobile navigation.
- Add visible `:focus-visible` treatment that matches the current palette.
- Add a complete `prefers-reduced-motion: reduce` path for animation, transitions, smooth scrolling, marquees, and auto-moving certification content.
- Improve coral-button text contrast while preserving the coral brand colour, using dark ink text where required.
- Preserve meaningful image alternative text and hide decorative icons from assistive technology.

### Helpful local guides

Add a compact **Helpful Local Guides** section in the home view after the trust/education content and before the final contact call-to-action. It will use the existing card language and contain two substantive, locally relevant guides:

1. **How to troubleshoot slow or unreliable Wi-Fi at home** — practical checks, router placement, interference, mesh considerations, NBN handoff checks, restart guidance, and when professional diagnosis is appropriate.
2. **Microsoft 365 security essentials for small businesses** — multifactor authentication, separate admin accounts, update hygiene, mailbox forwarding checks, phishing awareness, device protection, backups, and a simple review checklist.

Each guide will be concise enough for the current single-document website and expandable with a semantic disclosure control. A third guide about choosing a computer repair provider is deferred to the next content upgrade. Separate article URLs are also deferred until real routing is introduced.

## Technical Structure

The site remains static HTML, CSS, and vanilla JavaScript.

- Existing page markup stays in `index.html`.
- Shared visual tokens remain in the existing CSS custom properties.
- Motion behaviour is implemented with CSS classes and the existing JavaScript navigation/reveal logic.
- Progressive enhancement is required: content remains readable and controls remain usable if JavaScript fails.
- Reusable behaviours are small named JavaScript functions for view navigation, mobile-menu state, FAQ/guide disclosure, and reveal observation.
- No external data flow, storage, or backend is introduced.

## State and Interaction Flow

1. A visitor activates a navigation control.
2. The current view exits using a short Gentle Flow transition.
3. `go()` sets the requested view active, updates active navigation state, closes the mobile menu, and moves focus or scroll position appropriately.
4. Relevant content groups enter through the shared reveal observer.
5. FAQ and guide buttons independently update their expanded state and associated panel visibility.
6. Reduced-motion visitors receive immediate state changes with motion and smooth scrolling disabled.

## Error and Fallback Behaviour

- Optimized images retain fallback sources and dimensions to prevent broken content and layout shifts.
- Missing optional image formats fall through to WebP or the original compatible image.
- JavaScript-enhanced content starts in a readable baseline state.
- Disclosure controls use deterministic IDs so assistive relationships remain valid.
- The contact form's existing access-key guard remains unchanged unless testing reveals that accessibility changes affect submission.

## Validation

Automated checks will verify:

- Required public files and referenced assets exist.
- No navigation action anchors remain without `href`.
- FAQ, guide, service-card, and mobile-menu controls expose required semantic attributes.
- Form labels target real controls.
- Reduced-motion CSS covers the animation and transition families used by the page.
- Responsive image markup contains expected formats, dimensions, and source candidates.
- Open Graph/Twitter metadata points to the supplied social image.
- Guide headings and content are present.

Browser validation will cover desktop and mobile widths, keyboard-only navigation, focus visibility, mobile-menu state, FAQ/guide disclosure, view transitions, reduced-motion emulation, image loading, and absence of console errors. A link/asset check will verify local references, while Lighthouse or equivalent audits will be used as supporting evidence for performance and accessibility rather than as the sole acceptance criterion.

## Acceptance Criteria

- The site is recognizably the same design and content structure.
- Gentle Flow motion is noticeable but restrained, with no scroll hijacking or heavy runtime dependency.
- Every issue explicitly listed in the approved scope is addressed or documented with a concrete blocker.
- The profile and about images are materially smaller and responsive.
- Keyboard and reduced-motion users can operate all navigation, cards, disclosures, and form controls.
- Favicon, social preview, robots, and sitemap requests resolve to valid files.
- Two useful local guides fit naturally into the home experience.
- Existing contact, services, about, resume, and external-link behaviour continues to work.

## Deferred Work

- Real URLs for each internal view or section.
- A third article about choosing a computer repair provider.
- Deleting uncertain legacy assets.
- Framework migration, content-management system, or visual redesign.
