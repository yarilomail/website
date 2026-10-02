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
        // Load the real weights used across the UI (600/700/800) so headings
        // are not faux-bolded from the 400 face.
        sans: [{ name: 'Inter', weights: ['400', '500', '600', '700', '800'] }],
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
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      base: '16px',
    },
  },
})
