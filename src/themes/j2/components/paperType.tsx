// Colour coding for paper types and small author avatar, shared by the issue, archive and article pages.
// Every text/background pair is >= 4.5:1 (checked against the tinted background).
import { portraitFor } from '../../../mock-data/shared/portraits'

export interface TypeTone { fg: string; bg: string; border: string; bar: string }
const TONES: Record<string, TypeTone> = {
  'Research Article': { fg: '#065F46', bg: '#ECFDF5', border: '#A7F3D0', bar: '#059669' },
  'Review Article': { fg: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE', bar: '#2563EB' },
  'Short Communication': { fg: '#7C2D12', bg: '#FFF7ED', border: '#FED7AA', bar: '#EA580C' },
  Editorial: { fg: '#6B21A8', bg: '#FAF5FF', border: '#E9D5FF', bar: '#9333EA' },
}
export const typeTone = (type: string): TypeTone => TONES[type] ?? { fg: '#374151', bg: '#F3F4F6', border: '#E5E7EB', bar: '#6B7280' }

export function TypePill({ type }: { type: string }) {
  const t = typeTone(type)
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: t.fg, backgroundColor: t.bg, borderColor: t.border }}>
      {type}
    </span>
  )
}

const initialsOf = (name: string) => name.replace(/^(Dr|Prof)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()

/** Round author photo (from the shared portrait set) with an initials fallback. */
export function Avatar({ name, photo, size = 28 }: { name: string; photo?: string; size?: number }) {
  const src = photo ?? portraitFor(name)
  const style = { width: size, height: size }
  return src
    ? <img src={src} alt="" loading="lazy" style={style} className="shrink-0 rounded-full bg-brand-50 object-cover ring-2 ring-white" />
    : <span aria-hidden="true" style={{ ...style, fontSize: size * 0.4 }} className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-800 ring-2 ring-white">{initialsOf(name)}</span>
}
