import { useMemo, useState } from 'react'
import { EDITOR_ROLES, type EditorProfile, type EditorRole } from '../../../mock-data/journals/j1'
import { Avatar } from '../components/Avatar'
import { EditorCard, EditorRow, ProfileLinks, RoleLabel } from '../components/EditorCard'
import { inputClass } from '../components/form'
import { Modal } from '../components/Modal'
import { PageHead, RailTitle } from '../components/PageHead'
import { WithAwardsRail } from '../components/WithAwardsRail'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'

const LEADERSHIP: EditorRole[] = ['Editor-in-Chief', 'Managing Editor', 'Associate Editor']
const DIRECTORY: EditorRole[] = ['Editorial Board', 'Review Board']
const GROUP_LABEL: Record<EditorRole, string> = {
  'Editor-in-Chief': 'Editor-in-Chief', 'Managing Editor': 'Managing Editor', 'Associate Editor': 'Associate Editors',
  'Editorial Board': 'Editorial Board', 'Review Board': 'Review Board',
}
const GROUP_NOTE: Partial<Record<EditorRole, string>> = {
  'Editorial Board': 'Subject experts who handle manuscripts and advise on journal policy.',
  'Review Board': 'Reviewers who evaluate submissions in their specialist areas.',
}
const slugOf = (s: string) => s.toLowerCase().replace(/\W+/g, '-')

export function EditorialBoardPage({ editors }: { editors: EditorProfile[] }) {
  const [country, setCountry] = useState('')
  const [term, setTerm] = useState('')
  const [selected, setSelected] = useState<EditorProfile | null>(null)
  const countries = useMemo(() => [...new Set(editors.map((e) => e.country))].sort(), [editors])
  const institutions = useMemo(() => new Set(editors.map((e) => e.institution)).size, [editors])

  const needle = term.trim().toLowerCase()
  const visible = useMemo(() => editors.filter((e) =>
    (!country || e.country === country) &&
    (!needle || [e.name, e.institution, e.designation, ...e.areas].some((v) => v.toLowerCase().includes(needle)))), [editors, country, needle])
  const leaders = EDITOR_ROLES.filter((r) => LEADERSHIP.includes(r)).flatMap((r) => visible.filter((e) => e.role === r))
  const filtered = !!country || !!needle

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  const railLinks = [
    { id: 'board-leadership', label: 'Editorial leadership', n: leaders.length },
    ...DIRECTORY.map((r) => ({ id: `board-${slugOf(r)}`, label: GROUP_LABEL[r], n: visible.filter((e) => e.role === r).length })),
  ]
  const stats: [string, number][] = [['Members', editors.length], ['Countries', countries.length], ['Institutions', institutions]]

  return (
    <>
      <PageHead crumbs={[{ label: 'Home', to: paths.home }, { label: 'Editorial Board' }]} eyebrow={journal.shortName} title="Editorial Board"
        subtitle="Researchers who volunteer their expertise to keep peer review rigorous, fair and timely. Editors declare conflicts of interest and follow COPE guidance in every decision."
        aside={(
          <dl className="flex gap-6 sm:border-l sm:border-line sm:pl-6">
            {stats.map(([k, v]) => (
              <div key={k} className="flex flex-col-reverse"><dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{k}</dt><dd className="font-serif text-2xl font-semibold tabular-nums text-navy">{v}</dd></div>
            ))}
          </dl>
        )} />

      <WithAwardsRail className="mt-8 pb-4"><div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside aria-label="Filter the board" className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <RailTitle>Find a member</RailTitle>
            <div>
              <label htmlFor="board-term" className="mb-1.5 block text-[13px] font-semibold text-ink">Name, institution or topic</label>
              <input id="board-term" type="search" className={inputClass()} value={term} placeholder="e.g. microplastics" autoComplete="off" onChange={(e) => setTerm(e.target.value)} />
            </div>
            <div>
              <label htmlFor="country" className="mb-1.5 block text-[13px] font-semibold text-ink">Filter by country</label>
              <select id="country" className={inputClass()} value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">All countries</option>
                {countries.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            {filtered && (
              <button type="button" onClick={() => { setCountry(''); setTerm('') }} className="text-[13px] font-semibold text-scholar hover:underline">Clear filters</button>
            )}
          </form>
          <nav aria-label="Board sections" className="hidden lg:block">
            <RailTitle>On this page</RailTitle>
            <ul className="mt-1">
              {railLinks.map((l) => (
                <li key={l.id} className="border-b border-line last:border-b-0">
                  <button type="button" onClick={() => jump(l.id)} className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-ink hover:text-scholar">
                    {l.label}<span className="min-w-6 rounded-sm bg-paper px-1.5 text-center text-xs font-semibold tabular-nums text-ink-muted">{l.n}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 space-y-10" aria-live="polite">
          <section id="board-leadership" aria-labelledby="h-leadership" className="scroll-mt-24">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
              <h2 id="h-leadership" className="font-serif text-[1.375rem] font-semibold text-navy">Editorial leadership</h2>
              <p className="text-[13px] text-ink-muted">Editor-in-Chief, Managing Editor and Associate Editors · <span className="tabular-nums">{leaders.length}</span></p>
            </div>
            {leaders.length
              ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{leaders.map((e) => <EditorCard key={e.id} editor={e} onView={setSelected} />)}</div>
              : <p className="rounded border border-dashed border-line bg-paper p-5 text-sm text-ink-muted">{filtered ? 'No editors match the current filters.' : 'Editors will be listed here.'}</p>}
          </section>

          {DIRECTORY.map((role) => {
            const list = visible.filter((e) => e.role === role)
            return (
              <section key={role} id={`board-${slugOf(role)}`} aria-labelledby={`h-${slugOf(role)}`} className="scroll-mt-24">
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
                  <h2 id={`h-${slugOf(role)}`} className="font-serif text-[1.375rem] font-semibold text-navy">{GROUP_LABEL[role]} <span className="ml-1 text-base font-normal tabular-nums text-ink-muted">({list.length})</span></h2>
                  <p className="text-[13px] text-ink-muted">{GROUP_NOTE[role]}</p>
                </div>
                {list.length ? (
                  <>
                    <div aria-hidden className="hidden border-b border-line px-1 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-muted md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.1fr)_180px] md:gap-x-4">
                      <span>Member</span><span>Institution</span><span>Research areas</span><span>Profiles</span>
                    </div>
                    <ul>{list.map((e) => <EditorRow key={e.id} editor={e} onView={setSelected} />)}</ul>
                  </>
                ) : (
                  <p className="mt-3 rounded border border-dashed border-line bg-paper p-5 text-sm text-ink-muted">
                    {filtered ? `No ${GROUP_LABEL[role].toLowerCase()} members match the current filters.` : 'Members will be listed here.'}
                  </p>
                )}
              </section>
            )
          })}
        </div>
      </div></WithAwardsRail>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} photo={selected.photo} size="lg" />
              <div><RoleLabel role={selected.role} /><p className="mt-1 text-sm">{selected.designation}</p><p className="text-sm text-ink-muted">{selected.institution}, {selected.country}</p></div>
            </div>
            <p className="mt-5 text-sm leading-relaxed">{selected.fullBio}</p>
            <h3 className="mt-5 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Research areas</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">{selected.areas.map((a) => <li key={a} className="rounded-sm border border-line bg-paper px-2 py-0.5 text-xs font-medium text-navy">{a}</li>)}</ul>
            <div className="mt-5"><ProfileLinks links={selected.links} /></div>
          </div>
        )}
      </Modal>
    </>
  )
}
