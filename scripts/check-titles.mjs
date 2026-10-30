// Fails when a built page's <title> is longer than search results show.
// Usage: check-titles.mjs <site dir>

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const MAX = 70
const dir = process.argv[2]
const bad = []
for (const f of readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.html'))) {
  const title = readFileSync(join(dir, f), 'utf8').match(/<title>([^<]*)<\/title>/)?.[1]
  if (title === undefined) bad.push(`${f}: no <title>`)
  else if (title.length > MAX) bad.push(`${f}: ${title.length} chars: ${title}`)
}
for (const b of bad) console.log(b)
if (bad.length) {
  console.error(`${bad.length} page(s) without a title of at most ${MAX} characters`)
  process.exit(1)
}
console.log(`every page title is at most ${MAX} characters`)
