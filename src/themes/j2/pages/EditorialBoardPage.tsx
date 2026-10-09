// Journal 2 editorial board: filters, profile grid and a right slide-in profile drawer.
import { useEffect, useMemo, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { EDITOR_ROLES, type EditorProfile, type EditorRole } from '../../../core/types'
import { PageHeader, PillTag } from '../components/PageHeader'
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

const LEADERS: EditorRole[] = ['Editor-in-Chief', 'Managing Editor']

function LeaderCard({ e, onOpen }: { e: EditorProfile; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-haspopup="dialog" aria-label={`View profile of ${e.name}`}
      className={cx('flex h-full w-full flex-col rounded-sheet border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-white p-5 text-left shadow-card transition-shadow hover:border-accent-700 hover:shadow-soft sm:p-6', focusRing)}>
      <span className="flex items-center gap-4">
        <Portrait editor={e} size="lg" />
        <span className="min-w-0">
          <span className="inline-block rounded-full bg-brand-800 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{e.role}</span>
          <span className="mt-2 block font-display text-xl font-bold leading-snug text-graphite-900">{e.name}</span>
        </span>
      </span>
      <span className="mt-4 block text-sm font-semibold text-graphite-800">{e.designation}</span>
      <span className="block text-sm text-graphite-600">{e.institution}, {e.country}</span>
      <span className="mt-3 block text-sm leading-relaxed text-graphite-700">{e.shortBio}</span>
      <span className="mt-3 flex flex-wrap gap-1.5">{e.areas.map((a) => <Tag key={a} tone="brand">{a}</Tag>)}</span>
      <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-accent-700">View full profile<I.ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
    </button>
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
  const unfiltered = role === 'All' && !country && !needle
  const leaders = unfiltered ? editors.filter((e) => LEADERS.includes(e.role)) : []
  const directory = unfiltered && leaders.length ? editors.filter((e) => !LEADERS.includes(e.role)) : filtered

  return (
    <>
      <PageHeader crumbs={['Editorial Board']} tag={<PillTag icon={<I.Verified className="h-3.5 w-3.5" aria-hidden="true" />}>Peer-Reviewed Journal</PillTag>} title="Editorial Board"
        text={`${journal.shortName} is guided by ${editors.length} researchers from ${countries.length} countries. They are chosen for subject expertise, declare conflicts of interest and keep peer review rigorous, fair and timely.`}
        aside={(
          <dl className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-panel border border-brand-200 bg-white px-5 py-3"><dt className="text-[11px] font-bold uppercase tracking-wider text-graphite-600">Members</dt><dd className="font-display text-2xl font-bold tabular-nums text-brand-800">{editors.length}</dd></div>
            <div className="rounded-panel border border-brand-200 bg-white px-5 py-3"><dt className="text-[11px] font-bold uppercase tracking-wider text-graphite-600">Countries</dt><dd className="font-display text-2xl font-bold tabular-nums text-brand-800">{countries.length}</dd></div>
          </dl>
        )} />

      {leaders.length > 0 && (
        <Container className="pt-8">
          <h2 className="border-b-2 border-brand-800 pb-2 font-display text-lg font-bold uppercase tracking-wide text-brand-800">Editorial leadership</h2>
          <ul className="mt-5 grid gap-5 md:grid-cols-2">
            {leaders.map((e) => <li key={e.id}><LeaderCard e={e} onOpen={() => setSelected(e)} /></li>)}
          </ul>
        </Container>
      )}

      <Container className="pb-10 pt-8">
        <h2 className="border-b-2 border-brand-800 pb-2 font-display text-lg font-bold uppercase tracking-wide text-brand-800">{unfiltered ? 'Board directory' : 'Directory'}</h2>
        <div className="mt-5 rounded-panel border border-graphite-200 bg-white p-4 shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="Filter by role" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
              {chips.map((r) => {
                const on = role === r
                return (
                  <button key={r} type="button" aria-pressed={on} onClick={() => setRole(r)}
                    className={cx('shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors', focusRing,
                      on ? 'border-brand-800 bg-brand-800 text-white' : 'border-graphite-300 bg-white text-graphite-700 hover:border-accent-700 hover:text-accent-700')}>
                    {r} <span className={cx('tabular-nums', on ? 'text-white/90' : 'text-graphite-600')}>({count(r)})</span>
                  </button>
                )
              })}
            </div>
            <div className="grid gap-3 sm:grid-cols-[3fr_2fr] lg:w-[36rem]">
              <div>
                <label htmlFor="j2-eb-search" className="sr-only">Search by name, area or institution</label>
                <div className="relative">
                  <I.Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite-500" aria-hidden="true" />
                  <input id="j2-eb-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, area, institution"
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
        </div>

        <p role="status" className="mt-4 text-sm text-graphite-700">Showing <strong className="tabular-nums text-graphite-900">{filtered.length}</strong> of {editors.length} members</p>

        <div className="mt-3">
          {filtered.length === 0
            ? <EmptyState title="No members match these filters" text="Try another role or country, or clear the search." action={<button type="button" onClick={clear} className={cx('rounded-soft border border-accent-700 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-50', focusRing)}>Clear filters</button>} />
            : (
              <div className="overflow-hidden rounded-panel border border-graphite-200 bg-white shadow-card">
                <div aria-hidden="true" className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,2.4fr)_minmax(0,1.6fr)_7rem] gap-4 border-b border-graphite-200 bg-brand-50 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 md:grid">
                  <span>Member</span><span>Position and institution</span><span>Areas of expertise</span><span className="text-right">Profile</span>
                </div>
                <ul className="divide-y divide-graphite-100">
                  {directory.map((e) => (
                    <li key={e.id}>
                      <button type="button" onClick={() => setSelected(e)} aria-haspopup="dialog" aria-label={`View profile of ${e.name}`}
                        className={cx('grid w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-brand-50/60 focus-visible:bg-brand-50 md:grid-cols-[minmax(0,2.2fr)_minmax(0,2.4fr)_minmax(0,1.6fr)_7rem] md:items-center md:gap-4 md:px-5', focusRing)}>
                        <span className="flex items-center gap-3">
                          <Portrait editor={e} size="md" />
                          <span className="min-w-0">
                            <span className="block font-display text-base font-bold leading-snug text-graphite-900">{e.name}</span>
                            <span className="mt-1 inline-block"><Tag tone={roleTone(e.role)}>{e.role}</Tag></span>
                          </span>
                        </span>
                        <span className="block text-sm">
                          <span className="block font-medium text-graphite-800">{e.designation}</span>
                          <span className="block text-graphite-600">{e.institution}, {e.country}</span>
                        </span>
                        <span className="flex flex-wrap gap-1.5">{e.areas.slice(0, 3).map((a) => <Tag key={a} tone="neutral">{a}</Tag>)}</span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-accent-700 md:justify-end">View profile<I.ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </Container>

      {selected && <ProfileDrawer editor={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
