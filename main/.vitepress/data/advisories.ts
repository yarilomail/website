export type Severity = 'high' | 'moderate' | 'low'

export interface Advisory {
  id: string
  date: string
  severity: Severity
  summary: string
  link: string
}

export const severities: Severity[] = ['high', 'moderate', 'low']

// Newest first; matches the query against the CVE id and the summary.
export function filterAdvisories(
  list: Advisory[],
  query: string,
  severity: Severity | 'all',
): Advisory[] {
  const q = query.trim().toLowerCase()
  return list
    .filter((a) => severity === 'all' || a.severity === severity)
    .filter((a) => !q || a.id.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
