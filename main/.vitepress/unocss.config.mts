import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
} from 'unocss'

// One type scale for prose (em, via cssExtend) and the Vue pages (px shortcuts).
const ink = '#1f2933'
const body = { px: 17, leading: 1.75, color: '#3b4451' }
const heading = { weight: 700, tracking: '-0.01em' }
const headings = {
  h1: { em: 2.25, leading: 1.1111111 },
  h2: { em: 1.5, leading: 1.3333333 },
  h3: { em: 1.25, leading: 1.375 },
}
const headingPx = (h: keyof typeof headings) => `${body.px * headings[h].em}px`

// Base-size rules the typography preset emits as invalid :where(> ...);
// layered after it so they win over .prose :where(p) by order.
const notProse = ':not(:where([class~="not-prose"],[class~="not-prose"] *))'
const proseChildRules: [string, string][] = [
  ['> :first-child', 'margin-top:0'],
  ['> :last-child', 'margin-bottom:0'],
  ['> ul > li p', 'margin-top:0.75em;margin-bottom:0.75em'],
  ['> ul > li > p:first-child', 'margin-top:1.25em'],
  ['> ul > li > p:last-child', 'margin-bottom:1.25em'],
  ['> ol > li > p:first-child', 'margin-top:1.25em'],
  ['> ol > li > p:last-child', 'margin-bottom:1.25em'],
]

export default defineConfig({
  presets: [
    presetAttributify(),
    presetWind4(),
    presetTypography({
      // Invalid as emitted; null drops them, proseChildRules restores them.
      cssExtend: {
        '> :first-child': null,
        '> :last-child': null,
        '> ul > li p': null,
        '> ul > li > p:first-child': null,
        '> ul > li > p:last-child': null,
        '> ol > li > p:first-child': null,
        '> ol > li > p:last-child': null,
        'font-size': `${body.px}px`,
        'line-height': `${body.leading}`,
        'color': body.color,
        'h1, h2, h3': { 'font-weight': `${heading.weight}`, 'letter-spacing': heading.tracking, 'color': ink },
        'h1': { 'font-size': `${headings.h1.em}em`, 'line-height': `${headings.h1.leading}` },
        'h2': { 'font-size': `${headings.h2.em}em`, 'line-height': `${headings.h2.leading}`, 'margin-top': '2em' },
        'h3': { 'font-size': `${headings.h3.em}em`, 'line-height': `${headings.h3.leading}` },
      },
    }),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        // Real faces for the UI weights so headings are not faux-bolded;
        // Plex stops at 700, so font-extrabold renders with the 700 face.
        sans: [{ name: 'IBM Plex Sans', weights: ['400', '500', '600', '700'] }],
      },
    }),
  ],
  layers: { 'prose-children': -19 },
  preflights: [{
    layer: 'prose-children',
    getCSS: () => proseChildRules
      .map(([sel, decl]) => `.prose :where(.prose ${sel})${notProse}{${decl}}`)
      .join('\n'),
  }],
  shortcuts: {
    'type-body': `text-[${body.px}px] leading-[${body.leading}] text-[${body.color}]`,
    'type-h1': `text-[${headingPx('h1')}] leading-[${headings.h1.leading}] font-[${heading.weight}] tracking-[${heading.tracking}] text-ink`,
    'type-h2': `text-[${headingPx('h2')}] leading-[${headings.h2.leading}] font-[${heading.weight}] tracking-[${heading.tracking}] text-ink`,
    'type-h3': `text-[${headingPx('h3')}] leading-[${headings.h3.leading}] font-[${heading.weight}] tracking-[${heading.tracking}]`,
  },
  rules: [
    ['max-w-8xl', { 'max-width': '90rem' }],
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      // yarilomail palette — warm "sun" accent (Yarylo) over deep slate ink.
      brand: '#e0701a',
      branddark: '#b8560f',
      ink,
    },
    fontFamily: {
      sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      base: '16px',
    },
  },
})
