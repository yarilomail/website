import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
} from 'unocss'

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
        // Body copy: 17px with looser leading, headings at 700 not 800.
        'font-size': '17px',
        'line-height': '1.75',
        'color': '#3b4451',
        'h1, h2, h3': { 'font-weight': '700', 'letter-spacing': '-0.01em', 'color': 'var(--ink)' },
        'h1': { 'font-size': '2.25em' },
        'h2': { 'font-size': '1.5em', 'margin-top': '2em' },
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
  // Same type scale as the prose pages, for the Vue-built pages.
  shortcuts: {
    'type-body': 'text-[17px] leading-[1.75] text-[#3b4451]',
    'type-h1': 'text-[38.25px] leading-[1.1111] font-bold tracking-[-0.01em] text-ink',
    'type-h2': 'text-[25.5px] leading-[1.3333] font-bold tracking-[-0.01em] text-ink',
    'type-h3': 'text-[21.25px] leading-snug font-bold tracking-[-0.01em]',
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
      ink: '#1f2933',
    },
    fontFamily: {
      sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      base: '16px',
    },
  },
})
