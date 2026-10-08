// Deterministic ORCID iDs for the mock authors, so the same person has the same iD in article lists and on article pages.
const hash = (s: string) => s.split('').reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7)

/** ORCID iD for a name, or undefined for the (few) authors without one. */
export function orcidFor(name: string): string | undefined {
  const h = hash(name)
  if (h % 4 === 3) return undefined
  const part = (k: number) => String(1000 + ((h >>> k) % 8999))
  return `0000-000${h % 10}-${part(3)}-${part(7)}`
}
