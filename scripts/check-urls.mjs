// Fails when a built page links to a page of this site without .html: every
// page but the home page (/) is served and indexed under its .html URL.
// Usage: check-urls.mjs <site dir>

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ASSET = /\.(html|svg|ico|png|webp|jpg|css|js|txt|xml|json)$/
const dir = process.argv[2]
const bad = []
for (const f of readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.html'))) {
  for (const [, href] of readFileSync(join(dir, f), 'utf8').matchAll(/\shref="([^"]*)"/g)) {
    const path = href.replace(/^https:\/\/yarilomail\.org(?=\/)/, '').split(/[?#]/)[0]
    if (!path.startsWith('/') || path.startsWith('//') || path.endsWith('/') || ASSET.test(path)) continue
    bad.push(`${f}: ${href}`)
  }
}
for (const b of bad) console.log(b)
if (bad.length) {
  console.error(`${bad.length} link(s) to a page without .html`)
  process.exit(1)
}
console.log('every link to a page of this site ends in .html')
