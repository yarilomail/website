import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetWind4(),
    presetTypography(),
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
