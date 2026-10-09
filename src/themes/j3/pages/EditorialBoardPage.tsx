// Journal 3 editorial board in the Academic Prestige style: leadership feature, editor cards, a directory table and neutral governance statements.
import { Fragment, useId, useMemo, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { EDITOR_ROLES, type EditorProfile, type EditorRole } from '../../../core/types'
import { AcButton, AcLabel, AcPanel, AcSectionHead, AcTag, acInput } from '../components/AcademicUi'
import { Container, cx } from '../components/primitives'
import * as I from '../icons'

const initials = (name: string) => name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
const HEADINGS: Record<EditorRole, string> = {
  'Editor-in-Chief': 'Executive editorial leadership', 'Managing Editor': 'Managing editorial office', 'Associate Editor': 'Associate editors', 'Editorial Board': 'Editorial board directory', 'Review Board': 'Review board directory',
}
const NOTES: Partial<Record<EditorRole, string>> = {
  'Editor-in-Chief': 'Final authority on manuscript decisions',
  'Associate Editor': 'Handle peer review and reviewer assignments',
}

function Portrait({ editor, className }: { editor: EditorProfile; className: string }) {
  const [failed, setFailed] = useState(false)
  return editor.photo && !failed
    ? <img src={editor.photo} alt={`Portrait of ${editor.name}`} loading="lazy" onError={() => setFailed(true)} className={cx('shrink-0 border border-mauve-100 bg-[#F8FAFC] object-cover', className)} />
    : <span aria-hidden="true" className={cx('flex shrink-0 items-center justify-center bg-iris-700 font-jakarta text-[2rem] font-semibold text-white', className)}>{initials(editor.name)}</span>
}

function Links({ editor }: { editor: EditorProfile }) {
  const links = [
    { key: 'orcid', label: 'ORCID', href: editor.links.orcid }, { key: 'scholar', label: 'Google Scholar', href: editor.links.scholar },
    { key: 'scopus', label: 'Scopus', href: editor.links.scopus }, { key: 'wos', label: 'Web of Science', href: editor.links.wos },
  ].filter((l) => l.href)
  if (links.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label={`Research profiles of ${editor.name}`}>
      {links.map((l) => (
        <li key={l.key}>
          <a href={l.href} target="_blank" rel="noreferrer" className={cx('inline-flex items-center gap-1.5 font-inter text-sm font-semibold hover:underline hover:underline-offset-4', l.key === 'orcid' ? 'text-[#047857]' : 'text-iris-700')}>
            {l.key === 'orcid' && <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center rounded-full bg-[#047857] text-[9px] font-bold text-white">iD</span>}
            {l.label}<I.ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function Areas({ editor }: { editor: EditorProfile }) {
  if (editor.areas.length === 0) return null
  return <ul className="flex flex-wrap gap-2" aria-label="Areas of expertise">{editor.areas.map((a) => <li key={a}><AcTag>{a}</AcTag></li>)}</ul>
}

/** Expandable full profile, used by cards and directory rows. */
function Profile({ editor }: { editor: EditorProfile }) {
  return (
    <div className="space-y-4">
      <p className="font-jakarta text-[1.0625rem] leading-[1.7] text-mauve-700">{editor.fullBio}</p>
      <Areas editor={editor} />
      <Links editor={editor} />
    </div>
  )
}

function Lead({ editor }: { editor: EditorProfile }) {
  return (
    <article className="grid gap-6 border border-mauve-100 bg-white p-5 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:p-8">
      <div>
        <Portrait editor={editor} className="h-44 w-44 sm:h-52 sm:w-44" />
        <p className="mt-2 w-44 bg-iris-700 py-1 text-center font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-white">{editor.role}</p>
      </div>
      <div className="min-w-0">
        <h3 className="font-jakarta text-[1.75rem] font-semibold leading-tight text-iris-700 sm:text-[2rem]">{editor.name}</h3>
        <p className="mt-1 font-inter text-base font-semibold text-ember-700">{editor.designation}</p>
        <p className="font-inter text-sm text-mauve-600">{editor.institution}, {editor.country}</p>
        <div className="mt-4"><Profile editor={editor} /></div>
      </div>
    </article>
  )
}

function Card({ editor, open, onToggle }: { editor: EditorProfile; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className={cx('flex flex-col border bg-white p-5', open ? 'border-iris-700 sm:col-span-2 lg:col-span-3' : 'border-mauve-100')}>
      <div className="flex gap-4">
        <Portrait editor={editor} className="h-16 w-16 !text-xl" />
        <div className="min-w-0">
          <AcLabel className="!text-ember-700">{editor.role}</AcLabel>
          <h3 className="mt-0.5 font-jakarta text-[1.25rem] font-semibold leading-snug text-iris-700">{editor.name}</h3>
          <p className="font-inter text-sm text-mauve-600">{editor.institution}, {editor.country}</p>
        </div>
      </div>
      <p className="mt-3 font-inter text-sm font-semibold text-night-700">{editor.designation}</p>
      {!open && <p className="mt-1 font-inter text-sm leading-relaxed text-mauve-700">{editor.shortBio}</p>}
      <div id={`${id}-p`} hidden={!open} className="mt-3"><Profile editor={editor} /></div>
      <button type="button" aria-expanded={open} aria-controls={`${id}-p`} onClick={onToggle}
        className="mt-4 self-end font-inter text-xs font-semibold uppercase tracking-[0.08em] text-iris-700 hover:text-ember-700">
        {open ? 'Hide profile' : 'Full bio'} <span aria-hidden="true">{open ? '−' : '→'}</span><span className="sr-only"> for {editor.name}</span>
      </button>
    </li>
  )
}

function Directory({ people, openId, setOpenId, label }: { people: EditorProfile[]; openId: string | null; setOpenId: (id: string | null) => void; label: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left font-inter">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr className="border-b-2 border-iris-700">
            {['Name', 'Affiliation', 'Country', 'Profile'].map((h) => <th key={h} scope="col" className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map((e) => {
            const open = openId === e.id
            return (
              <Fragment key={e.id}>
                <tr className="border-b border-mauve-100 align-top">
                  <th scope="row" className="px-3 py-4 font-jakarta text-[1.0625rem] font-semibold text-iris-700">{e.name}<span className="block font-inter text-sm font-normal text-mauve-600">{e.designation}</span></th>
                  <td className="px-3 py-4 text-sm text-night-700">{e.institution}</td>
                  <td className="px-3 py-4 text-sm text-night-700">{e.country}</td>
                  <td className="px-3 py-4">
                    <button type="button" aria-expanded={open} onClick={() => setOpenId(open ? null : e.id)} className="text-xs font-semibold uppercase tracking-[0.08em] text-iris-700 hover:text-ember-700">
                      {open ? 'Hide' : 'View'}<span className="sr-only"> profile of {e.name}</span>
                    </button>
                  </td>
                </tr>
                {open && <tr className="border-b border-mauve-100 bg-[#F8FAFC]"><td colSpan={4} className="px-3 py-5"><div className="max-w-3xl"><Profile editor={e} /></div></td></tr>}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const GOVERNANCE: { title: string; text: string; slug: string }[] = [
  { title: 'Independent decisions', text: 'Editorial decisions are made on the scholarly merit of a submission, following peer review.', slug: 'peer-review' },
  { title: 'Conflicts of interest', text: 'Editors and reviewers are expected to declare competing interests and step back from submissions where they have one.', slug: 'publication-ethics' },
  { title: 'Ethics and corrections', text: 'Concerns about published work are handled under the journal’s publication ethics policy.', slug: 'publication-ethics' },
]

export function EditorialBoardPage({ editors }: { editors: EditorProfile[] }) {
  const [role, setRole] = useState<EditorRole | 'All'>('All')
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState<string | null>(null) // only one profile is open at a time
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
      <header className="border-b border-mauve-100 bg-[#F8FAFC]">
        <Container className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 font-inter text-sm text-mauve-600">
              <li><AppLink to={paths.home} className="hover:text-ember-700 hover:underline">Home</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li aria-current="page" className="font-semibold text-night-700">Editorial Board</li>
            </ol>
          </nav>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div>
              <AcLabel className="!text-ember-700">{journal.shortName} · Editorial directory and governance</AcLabel>
              <h1 className="mt-3 font-jakarta text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-[1.1] text-iris-700">Editorial Board &amp; Governance</h1>
              <p className="mt-5 max-w-3xl font-jakarta text-lg leading-relaxed text-night-700">
                {editors.length} researchers and practitioners from {countries} {countries === 1 ? 'country' : 'countries'} guide {journal.name}. They are chosen for subject expertise and are expected to keep peer review fair, timely and free of conflicts of interest.
              </p>
            </div>
            <AcPanel>
              <AcLabel>Editorial office</AcLabel>
              <p className="mt-3 font-inter text-sm text-mauve-600">Publisher</p>
              <p className="font-inter text-sm font-semibold text-night-700">{journal.publisher}</p>
              <p className="mt-3 font-inter text-sm text-mauve-600">Enquiries</p>
              <a href={`mailto:${journal.email}`} className="font-inter text-sm font-semibold text-iris-700 underline underline-offset-4 hover:text-ember-700">{journal.email}</a>
              <p className="mt-3 font-inter text-sm text-mauve-600">ISSN (online)</p>
              <p className="font-inter text-sm font-semibold text-night-700">{journal.issnOnline}</p>
            </AcPanel>
          </div>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by role" className="flex flex-wrap gap-2">
            {chips.map((r) => {
              const on = role === r
              return (
                <button key={r} type="button" aria-pressed={on} onClick={() => setRole(r)}
                  className={cx('whitespace-nowrap border px-3 py-2 font-inter text-xs font-semibold uppercase tracking-[0.06em] transition-colors', on ? 'border-iris-700 bg-iris-700 text-white' : 'border-mauve-100 bg-[#F8FAFC] text-night-700 hover:border-iris-700')}>
                  {r} <span className={on ? 'text-white/85' : 'text-mauve-600'}>({count(r)})</span>
                </button>
              )
            })}
          </div>
          <div className="lg:w-[22rem]">
            <label htmlFor="j3-eb-search" className="sr-only">Search by name, area or institution</label>
            <div className="relative">
              <I.Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-mauve-600" aria-hidden="true" />
              <input id="j3-eb-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, area or institution" className={cx(acInput, '!py-2.5 !pl-10')} />
            </div>
          </div>
        </div>

        <p role="status" className="mt-5 font-inter text-sm text-mauve-600">Showing {filtered.length} of {editors.length} members</p>

        <div className="mt-8 space-y-14">
          {filtered.length === 0
            ? (
              <div className="border border-mauve-100 bg-[#F8FAFC] p-10 text-center">
                <p className="font-jakarta text-lg font-semibold text-iris-700">No members match these filters</p>
                <p className="mt-1 font-inter text-sm text-mauve-700">Try another role, or clear the search.</p>
                <AcButton tone="outline" className="mt-4" onClick={clear}>Clear filters</AcButton>
              </div>
            )
            : groups.map((g) => {
              const hid = `j3-role-${g.role.replace(/\W+/g, '-')}`
              const asTable = g.role === 'Editorial Board' || g.role === 'Review Board'
              return (
                <section key={g.role} aria-labelledby={hid}>
                  <AcSectionHead id={hid} title={HEADINGS[g.role]} note={NOTES[g.role] ?? `${g.people.length} ${g.people.length === 1 ? 'member' : 'members'}`} />
                  <div className="mt-6">
                    {g.role === 'Editor-in-Chief' ? <div className="space-y-5">{g.people.map((e) => <Lead key={e.id} editor={e} />)}</div>
                      : asTable ? <Directory people={g.people} openId={openId} setOpenId={setOpenId} label={HEADINGS[g.role]} />
                        : <ul className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">{g.people.map((e) => <Card key={e.id} editor={e} open={openId === e.id} onToggle={() => setOpenId(openId === e.id ? null : e.id)} />)}</ul>}
                  </div>
                </section>
              )
            })}
        </div>

        <section aria-labelledby="j3-gov" className="mt-16 border-t border-mauve-100 pt-10">
          <AcLabel className="!text-ember-700">Editorial governance</AcLabel>
          <h2 id="j3-gov" className="mt-2 font-jakarta text-[1.75rem] font-semibold text-iris-700">How the board works</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {GOVERNANCE.map((s) => (
              <li key={s.title} className="border border-mauve-100 bg-white p-5">
                <h3 className="font-jakarta text-lg font-semibold text-iris-700">{s.title}</h3>
                <p className="mt-2 font-inter text-sm leading-relaxed text-mauve-700">{s.text}</p>
                <AppLink to={paths.policy(s.slug)} className="mt-3 inline-block font-inter text-xs font-semibold uppercase tracking-[0.08em] text-iris-700 hover:text-ember-700">Read the policy <span aria-hidden="true">→</span></AppLink>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  )
}
