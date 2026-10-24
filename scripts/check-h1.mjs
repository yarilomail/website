// Fails when a built page (other than 404.html) does not have exactly one <h1>.
// Usage: check-h1.mjs <site dir>

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = process.argv[2]
const bad = []
for (const f of readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.html') && f !== '404.html')) {
  const n = readFileSync(join(dir, f), 'utf8').match(/<h1[\s>]/g)?.length ?? 0
  if (n !== 1) bad.push(`${f}: ${n} <h1>`)
}
for (const b of bad) console.log(b)
if (bad.length) {
  console.error(`${bad.length} page(s) without exactly one <h1>`)
  process.exit(1)
}
console.log('every page has one <h1>')
