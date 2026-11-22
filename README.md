# Money.me

A mobile-first personal finance experience, designed by Ish Singh.

**Open the app:** https://ishsinghdes.github.io/money.me/

The same page works on mobile and desktop. On desktop, choose Desktop showcase for the five-screen presentation: Splash, Home, Insights, Forecast and Profile.

## Open locally

Open `index.html` or `Money.me.html` directly in a modern browser. Both files contain the app, styles and discovery artwork, with no installation required.

## Development

```sh
npm --prefix app install
npm run dev
npm test
npm run build
```

The React + TypeScript source lives in `app/src`. Building regenerates the two standalone HTML files in the repository root. GitHub Pages serves the root of `main`.

## Interaction

Pan the honeycomb, tap to select, double tap or use the contextual card for details. Add, edit and disable services through bottom sheets. Explore spending as a list or doughnut, inspect dated cash forecasts, and adjust monthly cost reductions. The clock resets local changes and returns to welcome.

Financial records are fictional and stored only in the browser. No bank, inbox, screen-time feed or external AI service is connected. The welcome email can be edited; Continue does not authenticate or send it anywhere.

## Assets and attribution

Discovery artwork sources are recorded in `app/public/discovery/sources.json`. Merchant marks identify example services; they do not indicate partnerships. The spending chart is an original SVG implementation with interaction inspiration from the [Highcharts pie with legend example](https://www.highcharts.com/demo/highcharts/pie-legend).

Designed with love, designed with a heart, by Ish.
