# Portfolio

Personal portfolio website.

## Changelog

### 2026-04-15
- Finished porting the first case study by renaming the page to `rbg-usability-study.html` and updating project links.
- Reworked the RBG case study layout and styling for final polish, including responsive TLDR cards and clearer hero heading contrast.
- Replaced results placeholders with production images and tuned per-section image sizing/centering behavior for better readability.

### 2026-04-14
- Refactored from a single-file prototype into a modular structure: `index.html`, `styles.css`, and `scripts/` modules.
- Restored the interactive Three.js suitcase as the primary hero focal point.
- Added data-driven content architecture via `scripts/data.js` for reusable project metadata.
- Moved scene rendering and interaction logic into `scripts/suitcase-scene.js`.
- Ported Framer content structure into coded sections for intro, work, about, and contact.
- Applied a hybrid visual system that blends warm brown hero tones with green brand accents.
- Removed the floating hero intro overlay to keep the suitcase unobstructed.
- Added a dedicated RBG case study page at `rbg-usability-study.html` with reusable styles in `case-study.css`.
- Mapped the RBG project card link to the new case study page from `scripts/data.js`.
- Matched the case study content structure to the Framer version and kept each major section as a standalone card.
- Added metric chips and clearly labeled image placeholders for easy asset replacement.
- Shifted the portfolio and case-study theme to an off-white/beige base while preserving brown/green accents.
- Improved text contrast and border visibility for readability across the light theme.
