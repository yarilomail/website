// Renders a news post's social card (1200x630 PNG) from its frontmatter:
//   node scripts/og-card.mjs main/news/<post>.md
// Needs rsvg-convert and IBM Plex Sans visible to fontconfig; on macOS also set
// PANGOCAIRO_BACKEND=fontconfig, or pango picks the font through CoreText.
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { basename, join } from 'node:path'

const post = process.argv[2]
if (!post) throw new Error('usage: node scripts/og-card.mjs main/news/<post>.md')
const fm = Object.fromEntries(
  readFileSync(post, 'utf8').split('---')[1].trim().split('\n')
    .map((l) => l.match(/^(\w+):\s*"?(.*?)"?\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]),
)
const [head, ...rest] = fm.title.split(':')
const sub = rest.join(':').trim()
const release = /^YariloMail \d+\.\d+\.\d+/.test(head)

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Greedy wrap by characters: IBM Plex Sans SemiBold at 46 px fits about 40.
function wrap(text, max) {
  const lines = ['']
  for (const w of text.split(' ')) {
    const l = lines[lines.length - 1]
    if (l && (l + ' ' + w).length > max) lines.push(w)
    else lines[lines.length - 1] = l ? l + ' ' + w : w
  }
  return lines
}
const subLines = sub ? wrap(sub, 40).slice(0, 3) : []
const logo = readFileSync('main/public/favicon.svg').toString('base64')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf6ee"/>
  <rect x="0" y="0" width="16" height="630" fill="#e0701a"/>
  <image x="80" y="64" width="72" height="72" href="data:image/svg+xml;base64,${logo}"/>
  <text x="168" y="114" font-family="IBM Plex Sans" font-size="40" fill="#1e293b"><tspan font-weight="700">Yarilo</tspan><tspan font-weight="400">Mail</tspan></text>
  <text x="80" y="232" font-family="IBM Plex Sans" font-weight="600" font-size="26" letter-spacing="4" fill="#e0701a">${release ? 'RELEASE' : 'NEWS'}</text>
  <text x="80" y="${sub ? 318 : 330}" font-family="IBM Plex Sans" font-weight="700" font-size="${sub ? 76 : 68}" fill="#1e293b">${esc(head)}</text>
  ${subLines.map((l, i) => `<text x="80" y="${390 + i * 58}" font-family="IBM Plex Sans" font-weight="600" font-size="46" fill="#475569">${esc(l)}</text>`).join('\n  ')}
  <rect x="80" y="546" width="1040" height="2" fill="#e8dcc6"/>
  <text x="80" y="590" font-family="IBM Plex Sans" font-weight="400" font-size="26" fill="#64748b">${esc(fm.date)}</text>
  <text x="1120" y="590" text-anchor="end" font-family="IBM Plex Sans" font-weight="600" font-size="26" fill="#64748b">yarilomail.org</text>
</svg>`

const out = join('main/public/news', basename(post, '.md') + '.png')
writeFileSync(out, execFileSync('rsvg-convert', ['-w', '1200', '-h', '630', '-f', 'png'], { input: svg }))
console.log(out)
