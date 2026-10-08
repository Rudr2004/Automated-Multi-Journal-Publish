import { useMemo, useState } from 'react'
import { EDITOR_ROLES, type EditorProfile, type EditorRole } from '../../../mock-data/journals/j1'
import { Avatar } from '../components/Avatar'
import { EditorCard, ProfileLinks } from '../components/EditorCard'
import { inputClass } from '../components/form'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Container, EmptyState } from '../components/primitives'
import { Tabs } from '../components/Tabs'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'

const TAB_LABEL: Record<EditorRole, string> = {
  'Editor-in-Chief': 'Editor-in-Chief', 'Managing Editor': 'Managing Editor', 'Associate Editor': 'Associate Editors',
  'Editorial Board': 'Editorial Board', 'Review Board': 'Review Board',
}

export function EditorialBoardPage({ editors }: { editors: EditorProfile[] }) {
  const [country, setCountry] = useState('')
  const [selected, setSelected] = useState<EditorProfile | null>(null)
  const countries = useMemo(() => [...new Set(editors.map((e) => e.country))].sort(), [editors])

  const tabs = EDITOR_ROLES.map((role) => {
    const list = editors.filter((e) => e.role === role && (!country || e.country === country))
    return {
      id: role.toLowerCase().replace(/\W+/g, '-'),
      label: `${TAB_LABEL[role]} (${list.length})`,
      content: list.length
        ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((e) => <EditorCard key={e.id} editor={e} onView={setSelected} />)}</div>
        : <EmptyState title="No members to show" hint={country ? `There are no ${TAB_LABEL[role].toLowerCase()} from ${country}. Try another country.` : 'Members will be listed here.'} />,
    }
  })

  return (
    <>
      <PageHeader crumbs={[{ label: 'Home', to: paths.home }, { label: 'Editorial Board' }]} title="Editorial Board"
        subtitle={`${journal.name} is guided by researchers from ${countries.length} countries who volunteer their expertise to keep peer review rigorous, fair and timely.`} />
      <Container className="mt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-2xl text-ink-muted">Our editors and reviewers are selected for subject expertise and a record of integrity. They declare conflicts of interest and follow COPE guidance in every decision.</p>
          <div className="w-full sm:w-64">
            <label htmlFor="country" className="mb-1.5 block text-sm font-medium">Filter by country</label>
            <select id="country" className={inputClass()} value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">All countries</option>
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <Tabs label="Board roles" tabs={tabs} />
      </Container>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} photo={selected.photo} size="lg" />
              <div><p className="font-semibold text-navy">{selected.role}</p><p className="text-sm">{selected.designation}</p><p className="text-sm text-ink-muted">{selected.institution}, {selected.country}</p></div>
            </div>
            <p className="mt-5 text-sm leading-relaxed">{selected.fullBio}</p>
            <h3 className="mt-5 text-sm font-semibold text-navy">Research areas</h3>
            <ul className="mt-2 flex flex-wrap gap-2">{selected.areas.map((a) => <li key={a} className="rounded border border-line bg-mist px-3 py-1 text-xs font-medium text-navy">{a}</li>)}</ul>
            <div className="mt-5"><ProfileLinks links={selected.links} /></div>
          </div>
        )}
      </Modal>
    </>
  )
}
