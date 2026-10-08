// Journal 3 editorial board: a magazine masthead. People are listed by role; a row expands in place to show the profile.
import { useId, useMemo, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { EDITOR_ROLES, type EditorProfile, type EditorRole } from '../../../core/types'
import { Button } from '../components/Button'
import { Container, cx, EmptyState, Kicker, Pill } from '../components/primitives'
import * as I from '../icons'

const initials = (name: string) => name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
const HEADINGS: Record<EditorRole, string> = {
  'Editor-in-Chief': 'Editor-in-Chief', 'Managing Editor': 'Managing Editor', 'Associate Editor': 'Associate Editors', 'Editorial Board': 'Editorial Board', 'Review Board': 'Review Board',
}

function Portrait({ editor }: { editor: EditorProfile }) {
  const [failed, setFailed] = useState(false)
  const box = 'h-28 w-28 sm:h-36 sm:w-36'
  return editor.photo && !failed
    ? <img src={editor.photo} alt={`Portrait of ${editor.name}`} loading="lazy" onError={() => setFailed(true)} className={cx('shrink-0 rounded-block bg-iris-100 object-cover', box)} />
    : <span aria-hidden="true" className={cx('flex shrink-0 items-center justify-center rounded-block bg-iris-700 font-jakarta text-[2rem] font-extrabold text-white', box)}>{initials(editor.name)}</span>
}

function Row({ editor, open, onToggle }: { editor: EditorProfile; open: boolean; onToggle: () => void }) {
  const id = useId()
  const links = [
    { key: 'orcid', label: 'ORCID', href: editor.links.orcid }, { key: 'scholar', label: 'Google Scholar', href: editor.links.scholar },
    { key: 'scopus', label: 'Scopus', href: editor.links.scopus }, { key: 'wos', label: 'Web of Science', href: editor.links.wos },
  ].filter((l) => l.href)
  return (
    <li className={cx('border-b border-mauve-100 transition-colors', open && 'bg-iris-50')}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-panel`} id={`${id}-btn`} onClick={onToggle}
          className="group flex w-full items-center justify-between gap-4 px-2 py-5 text-left sm:px-4 sm:py-6">
          <span className="grid min-w-0 flex-1 gap-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-baseline md:gap-8">
            <span className={cx('break-words font-jakarta text-[1.625rem] font-extrabold leading-[1.1] tracking-tight transition-colors sm:text-[1.75rem]', open ? 'text-iris-700' : 'text-night-900 group-hover:text-iris-700')}>{editor.name}</span>
            <span className="block text-base text-mauve-700 md:text-right"><span className="font-semibold text-mauve-800">{editor.institution}</span><span className="block text-sm">{editor.country}</span></span>
          </span>
          <span aria-hidden="true" className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors', open ? 'bg-iris-700 text-white' : 'bg-iris-100 text-iris-800 group-hover:bg-iris-200')}>
            <I.ChevronDown className={cx('h-6 w-6 motion-safe:transition-transform', open && 'rotate-180')} />
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} hidden={!open} className="px-2 pb-8 sm:px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          <Portrait editor={editor} />
          <div className="min-w-0 max-w-3xl">
            <p className="font-jakarta text-lg font-bold text-night-900">{editor.designation}</p>
            <p className="mt-0.5 text-sm text-mauve-700">{editor.role}</p>
            <p className="mt-4 text-[1.0625rem] leading-[1.75] text-mauve-800">{editor.fullBio}</p>
            {editor.areas.length > 0 && (
              <>
                <p className="mt-5 font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-mauve-700">Areas of expertise</p>
                <ul className="mt-2 flex flex-wrap gap-2">{editor.areas.map((a) => <li key={a}><Pill>{a}</Pill></li>)}</ul>
              </>
            )}
            {links.length > 0 && (
              <>
                <p className="mt-5 font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-mauve-700">Research profiles</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {links.map((l) => (
                    <li key={l.key}>
                      <a href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border-2 border-iris-700 px-4 py-1.5 font-jakarta text-sm font-bold text-iris-700 hover:bg-iris-100">
                        {l.label}<I.ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export function EditorialBoardPage({ editors }: { editors: EditorProfile[] }) {
  const [role, setRole] = useState<EditorRole | 'All'>('All')
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState<string | null>(null) // only one row is open at a time
  const countries = useMemo(() => new Set(editors.map((e) => e.country)).size, [editors])

  const needle = q.trim().toLowerCase()
  const filtered = useMemo(() => editors.filter((e) =>
    (role === 'All' || e.role === role) && (!needle || [e.name, e.institution, e.country, e.designation, ...e.areas].some((s) => s.toLowerCase().includes(needle)))), [editors, role, needle])
  const groups = EDITOR_ROLES.map((r) => ({ role: r, people: filtered.filter((e) => e.role === r) })).filter((g) => g.people.length > 0)
  const count = (r: EditorRole | 'All') => (r === 'All' ? editors.length : editors.filter((e) => e.role === r).length)
  const chips: (EditorRole | 'All')[] = ['All', ...EDITOR_ROLES.filter((r) => count(r) > 0)]
  const clear = () => { setRole('All'); setQ('') }

  return (
    <>
      <header className="bg-iris-50">
        <Container className="pb-12 pt-8 sm:pb-16 sm:pt-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-mauve-700">
              <li><AppLink to={paths.home} className="rounded-full hover:text-iris-700 hover:underline">Home</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li aria-current="page" className="font-semibold text-night-900">Editorial Board</li>
            </ol>
          </nav>
          <Kicker className="mt-8 text-iris-700">Masthead</Kicker>
          <h1 className="mt-3 font-jakarta text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-tight text-night-900">The people behind {journal.shortName}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-mauve-700 sm:text-xl sm:leading-relaxed">
            {editors.length} researchers and practitioners from {countries} {countries === 1 ? 'country' : 'countries'} guide the journal. They are chosen for subject expertise, declare conflicts of interest and keep peer review fair and timely.
          </p>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by role" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {chips.map((r) => {
              const on = role === r
              return (
                <button key={r} type="button" aria-pressed={on} onClick={() => setRole(r)}
                  className={cx('shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-jakarta text-sm font-bold transition-colors', on ? 'bg-iris-700 text-white' : 'bg-iris-50 text-night-900 hover:bg-iris-100')}>
                  {r} <span className={on ? 'text-white/85' : 'text-mauve-700'}>({count(r)})</span>
                </button>
              )
            })}
          </div>
          <div className="lg:w-[22rem]">
            <label htmlFor="j3-eb-search" className="sr-only">Search by name, area or institution</label>
            <div className="relative">
              <I.Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mauve-600" aria-hidden="true" />
              <input id="j3-eb-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, area or institution"
                className="block w-full rounded-full border-2 border-mauve-200 bg-white py-3 pl-12 pr-4 text-base text-night-900 placeholder:text-mauve-500 hover:border-iris-300 focus:border-iris-700 focus:ring-4 focus:ring-iris-700/15 focus-visible:!outline-none" />
            </div>
          </div>
        </div>

        <p role="status" className="mt-5 text-sm text-mauve-700">Showing {filtered.length} of {editors.length} members</p>

        <div className="mt-6">
          {filtered.length === 0
            ? <EmptyState title="No members match these filters" text="Try another role, or clear the search." action={<Button variant="outline" onClick={clear}>Clear filters</Button>} />
            : groups.map((g) => (
              <section key={g.role} aria-labelledby={`j3-role-${g.role.replace(/\W+/g, '-')}`} className="mb-14 last:mb-0">
                <h2 id={`j3-role-${g.role.replace(/\W+/g, '-')}`} className="flex items-baseline gap-3 border-b-2 border-night-900 pb-3 font-jakarta text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-night-900 sm:text-[2.125rem]">
                  {HEADINGS[g.role]}<span className="font-jakarta text-base font-bold text-mauve-700" aria-label={`${g.people.length} members`}>{g.people.length}</span>
                </h2>
                <ul>
                  {g.people.map((e) => <Row key={e.id} editor={e} open={openId === e.id} onToggle={() => setOpenId(openId === e.id ? null : e.id)} />)}
                </ul>
              </section>
            ))}
        </div>
      </Container>
    </>
  )
}
