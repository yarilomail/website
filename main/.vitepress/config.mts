import { defineConfig } from 'vitepress'

import UnoCSS from 'unocss/vite'
import unoConfig from './unocss.config.mts'

const hostname = 'https://yarilomail.org'
const description =
  'YariloMail is an open-source, high-performance mail server speaking IMAP, POP3, JMAP, Submission and SIEVE, with built-in full-text search — a drop-in replacement for your current mail stack.'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'YariloMail | Open-source IMAP mail server',
  description,
  lang: 'en-US',
  base: '/',
  cleanUrls: true,
  metaChunk: true,
  // lastUpdated is intentionally off: it shells out to `git`, which is not
  // present in the Docker build stage (no git binary, .git not in context).

  sitemap: {
    hostname,
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#e0701a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'YariloMail' }],
    ['meta', { property: 'og:title', content: 'YariloMail | Open-source IMAP mail server' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: hostname }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  transformPageData(pageData) {
    // Per-page canonical link for clean, duplicate-free indexing.
    const canonical = `${hostname}/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '.html')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonical }])
  },

  themeConfig: {
    nav: [
      { text: 'Documentation', link: 'https://github.com/yarilomail' },
      { text: 'Support', link: '/support' },
      { text: 'Security', link: '/security' },
      { text: 'GitHub', link: 'https://github.com/yarilomail' },
    ],
  },

  vite: {
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    server: {
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      UnoCSS(unoConfig),
    ],
  },
})
