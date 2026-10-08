// Journal 2 editorial board: filters, profile grid and a right slide-in profile drawer.
import { useEffect, useMemo, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { EDITOR_ROLES, type EditorProfile, type EditorRole } from '../../../core/types'
import { cx, Container, EmptyState, Tag } from '../components/primitives'
import * as I from '../icons'

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 focus-visible:ring-offset-2'
const initials = (name: string) => name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

function Portrait({ editor, size }: { editor: EditorProfile; size: 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false)
  const box = size === 'lg' ? 'h-24 w-24 text-2xl' : 'h-16 w-16 text-lg'
  return editor.photo && !failed
    ? <img src={editor.photo} alt="" loading="lazy" onError={() => setFailed(true)} className={cx('shrink-0 rounded-full bg-graphite-100 object-cover ring-2 ring-white', box)} />
    : <span aria-hidden="true" className={cx('flex shrink-0 items-center justify-center rounded-full bg-brand-800 font-display font-bold text-white ring-2 ring-white', box)}>{initials(editor.name)}</span>
}

const roleTone = (r: EditorRole) => (r === 'Editor-in-Chief' || r === 'Managing Editor' ? 'brand' : 'accent') as 'brand' | 'accent'

function ProfileDrawer({ editor, onClose }: { editor: EditorProfile; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const [shown, setShown] = useState(false)
  const titleId = 'j2-editor-title'

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setShown(true))
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = [...panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      else if (!panel.current.contains(document.activeElement)) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      opener?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const links = [
    { key: 'orcid', label: 'ORCID', href: editor.links.orcid },
    { key: 'scholar', label: 'Google Scholar', href: editor.links.scholar },
    { key: 'scopus', label: 'Scopus', href: editor.links.scopus },
    { key: 'wos', label: 'Web of Science', href: editor.links.wos },
  ].filter((l) => l.href)

  return (
    <div className="fixed inset-0 z-[60]">
      <div aria-hidden="true" onClick={onClose} className={cx('absolute inset-0 bg-graphite-900/50 motion-safe:transition-opacity motion-safe:duration-200', shown ? 'opacity-100' : 'opacity-0')} />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={cx('absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-drawer motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out', shown ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between border-b border-graphite-200 px-5 py-3">
          <p className="text-sm font-semibold text-graphite-600">Editor profile</p>
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close profile" className={cx('rounded-soft p-2 text-graphite-700 hover:bg-graphite-100', focusRing)}><I.Close className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          <div className="flex items-center gap-4">
            <Portrait editor={editor} size="lg" />
            <div className="min-w-0">
              <h2 id={titleId} className="font-display text-xl font-bold leading-tight text-graphite-800">{editor.name}</h2>
              <div className="mt-1.5"><Tag tone={roleTone(editor.role)}>{editor.role}</Tag></div>
            </div>
          </div>
          <p className="mt-5 font-medium text-graphite-800">{editor.designation}</p>
          <p className="flex items-start gap-1.5 text-sm text-graphite-600"><I.Location className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{editor.institution}, {editor.country}</p>

          <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-graphite-600">Biography</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite-700">{editor.fullBio}</p>

          <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-graphite-600">Areas of expertise</h3>
          <ul className="mt-2 flex flex-wrap gap-2">{editor.areas.map((a) => <li key={a}><Tag tone="neutral">{a}</Tag></li>)}</ul>

          {links.length > 0 && (
            <>
              <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-graphite-600">Research profiles</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {links.map((l) => (
                  <li key={l.key}>
                    <a href={l.href} target="_blank" rel="noreferrer" className={cx('inline-flex items-center gap-1.5 rounded-soft border border-accent-700 px-3 py-1.5 text-sm font-semibold text-accent-700 hover:bg-accent-50', focusRing)}>
                      {l.label}<I.OpenInNew className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function EditorialBoardPage({ editors }: { editors: EditorProfile[] }) {
  const [role, setRole] = useState<EditorRole | 'All'>('All')
  const [country, setCountry] = useState('')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<EditorProfile | null>(null)
  const countries = useMemo(() => [...new Set(editors.map((e) => e.country))].sort(), [editors])

  const needle = q.trim().toLowerCase()
  const filtered = useMemo(() => editors.filter((e) =>
    (role === 'All' || e.role === role) && (!country || e.country === country) &&
    (!needle || [e.name, e.institution, e.designation, ...e.areas].some((s) => s.toLowerCase().includes(needle)))), [editors, role, country, needle])
  const count = (r: EditorRole | 'All') => (r === 'All' ? editors.length : editors.filter((e) => e.role === r).length)
  const chips: (EditorRole | 'All')[] = ['All', ...EDITOR_ROLES]
  const clear = () => { setRole('All'); setCountry(''); setQ('') }

  return (
    <>
      <header className="border-b border-graphite-200 bg-gradient-to-b from-brand-50 to-white">
        <Container className="pb-8 pt-6 sm:pt-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-graphite-600">
              <li><AppLink to={paths.home} className={cx('rounded-chip hover:text-accent-700 hover:underline', focusRing)}>Home</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li aria-current="page" className="font-medium text-graphite-800">Editorial Board</li>
            </ol>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-graphite-800 sm:text-4xl">Editorial Board</h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-graphite-600">
            {journal.shortName} is guided by {editors.length} researchers from {countries.length} countries. They are chosen for subject expertise, declare conflicts of interest and keep peer review rigorous, fair and timely.
          </p>
        </Container>
      </header>

      <Container className="mt-6 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div role="group" aria-label="Filter by role" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {chips.map((r) => {
              const on = role === r
              return (
                <button key={r} type="button" aria-pressed={on} onClick={() => setRole(r)}
                  className={cx('shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors', focusRing,
                    on ? 'border-accent-700 bg-accent-700 text-white' : 'border-graphite-300 bg-white text-graphite-700 hover:border-accent-700 hover:text-accent-700')}>
                  {r} <span className={on ? 'text-white/85' : 'text-graphite-600'}>({count(r)})</span>
                </button>
              )
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[30rem]">
            <div>
              <label htmlFor="j2-eb-search" className="sr-only">Search by name, area or institution</label>
              <div className="relative">
                <I.Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite-500" aria-hidden="true" />
                <input id="j2-eb-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, area or institution"
                  className="block w-full rounded-soft border border-graphite-300 bg-white py-2.5 pl-10 pr-3 text-base text-graphite-800 placeholder:text-graphite-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-700" />
              </div>
            </div>
            <div>
              <label htmlFor="j2-eb-country" className="sr-only">Filter by country</label>
              <select id="j2-eb-country" value={country} onChange={(e) => setCountry(e.target.value)}
                className="block w-full rounded-soft border border-graphite-300 bg-white px-3 py-2.5 text-base text-graphite-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-700">
                <option value="">All countries</option>{countries.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <p role="status" className="mt-4 text-sm text-graphite-600">Showing {filtered.length} of {editors.length} members</p>

        <div className="mt-4">
          {filtered.length === 0
            ? <EmptyState title="No members match these filters" text="Try another role or country, or clear the search." action={<button type="button" onClick={clear} className={cx('rounded-soft border border-accent-700 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-50', focusRing)}>Clear filters</button>} />
            : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((e) => (
                  <li key={e.id}>
                    <button type="button" onClick={() => setSelected(e)} aria-haspopup="dialog" aria-label={`View profile of ${e.name}`}
                      className={cx('flex h-full w-full flex-col rounded-panel border border-graphite-200 bg-white p-5 text-left shadow-card transition-shadow hover:border-accent-700 hover:shadow-soft', focusRing)}>
                      <span className="flex items-center gap-4">
                        <Portrait editor={e} size="md" />
                        <span className="min-w-0">
                          <span className="block font-display text-lg font-semibold leading-snug text-graphite-800">{e.name}</span>
                          <span className="mt-1 inline-block"><Tag tone={roleTone(e.role)}>{e.role}</Tag></span>
                        </span>
                      </span>
                      <span className="mt-3 block text-sm font-medium text-graphite-700">{e.designation}</span>
                      <span className="block text-sm text-graphite-600">{e.institution}, {e.country}</span>
                      <span className="mt-3 flex flex-wrap gap-1.5">{e.areas.slice(0, 3).map((a) => <Tag key={a} tone="neutral">{a}</Tag>)}</span>
                      <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-accent-700">View profile<I.ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </Container>

      {selected && <ProfileDrawer editor={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
