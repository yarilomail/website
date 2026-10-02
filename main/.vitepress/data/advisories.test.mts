import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filterAdvisories, type Advisory } from './advisories.mts'

const list: Advisory[] = [
  { id: 'CVE-2026-0001', date: '2026-03-09', severity: 'low', summary: 'IMAP literal parsing', link: '#' },
  { id: 'CVE-2026-0002', date: '2026-11-02', severity: 'high', summary: 'Auth bypass in SASL', link: '#' },
  { id: 'CVE-2026-0010', date: '2026-10-30', severity: 'moderate', summary: 'Memory growth on IMAP SEARCH', link: '#' },
  { id: 'CVE-2026-0011', date: '2026-10-05', severity: 'critical', summary: 'Remote code execution in LMTP', link: '#' },
]

const ids = (query: string, severity: Parameters<typeof filterAdvisories>[2]) =>
  filterAdvisories(list, query, severity).map((a) => a.id)

test('all, newest first across one- and two-digit months', () => {
  assert.deepEqual(ids('', 'all'), ['CVE-2026-0002', 'CVE-2026-0010', 'CVE-2026-0011', 'CVE-2026-0001'])
})

test('severity only', () => {
  assert.deepEqual(ids('', 'high'), ['CVE-2026-0002'])
  assert.deepEqual(ids('', 'critical'), ['CVE-2026-0011'])
})

test('id query is case-insensitive and a prefix matches several', () => {
  assert.deepEqual(ids('cve-2026-001', 'all'), ['CVE-2026-0010', 'CVE-2026-0011'])
})

test('summary query', () => {
  assert.deepEqual(ids('imap', 'all'), ['CVE-2026-0010', 'CVE-2026-0001'])
})

test('query and severity combine', () => {
  assert.deepEqual(ids('imap', 'low'), ['CVE-2026-0001'])
})

test('no match', () => {
  assert.deepEqual(ids('imap', 'high'), [])
})

test('whitespace-only query matches everything', () => {
  assert.deepEqual(ids('  ', 'moderate'), ['CVE-2026-0010'])
})

test('input list is not reordered', () => {
  const before = list.map((a) => a.id)
  filterAdvisories(list, '', 'all')
  assert.deepEqual(list.map((a) => a.id), before)
})
