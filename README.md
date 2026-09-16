# Corporate Banking Website

A static, multi-page front-end for a corporate banking site — home page, business finance enquiry form, and a quarterly newsletter page. Built with plain HTML, CSS and JavaScript (no frameworks, no build step).

## Pages

- `index.html` — Home page
- `pages/enquiry.html` — Business finance application / enquiry form
- `pages/newsLetter.html` — Quarterly briefing / newsletter

## Project structure

```
├── index.html
├── pages/
│   ├── enquiry.html
│   └── newsLetter.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── typography.css
│   ├── layout.css
│   ├── components.css
│   ├── responsive.css
│   └── pages/          # page-specific styles
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── forms.js
│   ├── validation.js
│   ├── enquiry.js
│   ├── goal-selector.js
│   ├── loan-calculator.js
│   ├── signatories.js
│   ├── components/
│   └── carousel/       # logo carousel (uses Embla Carousel)
└── assets/              # images and icons
```

## Running locally

This is a static site, so any local server works. For example:

run in server using
npx serve

Then open `http://localhost:8000` in your browser.

Or gothrough it https://raeeznazar.github.io/corporateBanking.io/

You can also just open `index.html` directly in a browser, though some features may behave better when served over HTTP.

## Notes

- The logo carousel depends on the vendored Embla Carousel scripts under `js/carousel/vendor/`.
- Styles are split by concern (reset, variables, typography, layout, components, responsive) plus per-page overrides in `css/pages/`.
