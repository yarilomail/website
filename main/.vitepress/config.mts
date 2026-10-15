import { defineConfig } from 'vitepress'

import UnoCSS from 'unocss/vite'
import unoConfig from './unocss.config.mts'

const hostname = 'https://yarilomail.org'
// Site-wide fallback; every page sets its own `description` in frontmatter.
// Keep under ~155 characters, or search results cut it.
const description =
  'YariloMail is an open-source mail server in Go for Kubernetes: IMAP, POP3, LMTP, JMAP, ManageSieve and Submission, with built-in full-text search.'

// Schema.org JSON-LD. The Organization @id is shared with doc.yarilomail.org,
// which links its pages to the same entity.
const orgId = `${hostname}/#organization`
const organization = {
  '@type': 'Organization',
  '@id': orgId,
  name: 'YariloMail',
  alternateName: 'Yarilo',
  url: `${hostname}/`,
  logo: `${hostname}/apple-touch-icon.png`,
  sameAs: ['https://github.com/yarilomail', 'https://github.com/yarilomail/yarilo'],
}

// Home page graph. softwareVersion is left out on purpose: it would go stale
// with every release. No offers or ratings: nothing backs them.
const homeGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    organization,
    {
      '@type': 'WebSite',
      '@id': `${hostname}/#website`,
      url: `${hostname}/`,
      name: 'YariloMail',
      alternateName: 'Yarilo',
      description,
      inLanguage: 'en-US',
      publisher: { '@id': orgId },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${hostname}/#software`,
      name: 'YariloMail',
      alternateName: 'Yarilo',
      description,
      url: `${hostname}/`,
      applicationCategory: 'CommunicationApplication',
      applicationSubCategory: 'Mail server',
      operatingSystem: 'Linux, Kubernetes',
      downloadUrl: 'https://github.com/yarilomail/yarilo/releases',
      license: 'https://www.gnu.org/licenses/agpl-3.0.html',
      isAccessibleForFree: true,
      image: `${hostname}/og.png`,
      publisher: { '@id': orgId },
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': `${hostname}/#source`,
      name: 'yarilo',
      codeRepository: 'https://github.com/yarilomail/yarilo',
      programmingLanguage: 'Go',
      runtimePlatform: 'Kubernetes',
      license: 'https://www.gnu.org/licenses/agpl-3.0.html',
      targetProduct: { '@id': `${hostname}/#software` },
    },
  ],
}

// News frontmatter dates read "11 Oct 2026"; schema.org wants ISO 8601.
function isoDate(date: string): string | undefined {
  const ms = Date.parse(`${date} UTC`)
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString().slice(0, 10)
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // Page titles render as "<page> | YariloMail"; the home page sets its own
  // full title with titleTemplate: false.
  title: 'YariloMail',
  titleTemplate: ':title | YariloMail',
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
    // SVG first for browsers that support it; .ico covers the rest (and is
    // fetched from the root anyway). apple-touch-icon is the iOS home screen.
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['meta', { name: 'theme-color', content: '#e0701a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'YariloMail' }],
    // og:title, og:description and og:url are per page: see transformPageData.
    // Social preview. Absolute URL is required — crawlers do not resolve
    // relative paths.
    ['meta', { property: 'og:image', content: `${hostname}/og.png` }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'A user connecting a laptop and phone to the YariloMail cloud over IMAP, POP3, SIEVE, Submission and JMAP' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${hostname}/og.png` }],
  ],

  transformPageData(pageData) {
    // Per-page canonical link for clean, duplicate-free indexing. Must match
    // cleanUrls and the sitemap: extensionless, no .html.
    const canonical = `${hostname}/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    // Open Graph tags mirror the page's own <title> and meta description,
    // so a shared news link previews as that post, not as the home page.
    const fm = pageData.frontmatter
    const title = fm.titleTemplate === false || !fm.title
      ? fm.title || 'YariloMail'
      : `${fm.title} | YariloMail`
    const desc = fm.description || description
    fm.head ??= []
    fm.head.push(
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
    )

    let graph: object | undefined
    if (pageData.relativePath === 'index.md') {
      graph = homeGraph
    } else if (pageData.relativePath.startsWith('news/')) {
      graph = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${canonical}#article`,
        mainEntityOfPage: canonical,
        headline: fm.title,
        description: desc,
        datePublished: fm.date ? isoDate(fm.date) : undefined,
        image: `${hostname}/og.png`,
        author: organization,
        publisher: { '@id': orgId },
        inLanguage: 'en-US',
      }
    }
    if (graph) {
      fm.head.push(['script', { type: 'application/ld+json' }, JSON.stringify(graph)])
    }
  },

  themeConfig: {
    nav: [
      { text: 'Documentation', link: 'https://doc.yarilomail.org/' },
      { text: 'Releases', link: 'https://github.com/yarilomail/yarilo/releases' },
      { text: 'Support', link: '/support' },
      { text: 'Security', link: '/security' },
      { text: 'GitHub', link: 'https://github.com/yarilomail/yarilo' },
    ],
  },

  vite: {
    build: {
      // esbuild's CSS minifier drops the & in nested selectors (space-y-*).
      cssMinify: 'lightningcss',
    },
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
