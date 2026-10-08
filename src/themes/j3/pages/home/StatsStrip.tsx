// Stats strip under the hero: facts about the service, taken from the journal config. A column is hidden when its value is empty or switched off.
import { journal } from '../../../../config/journals'
import { CountUp } from '../../components/CountUp'
import { Container } from '../../components/primitives'

export function StatsStrip() {
  const stats = journal.heroStats.filter((s) => s.show && s.value)
  if (!stats.length) return null
  return (
    <section aria-label={`${journal.shortName} at a glance`} className="pb-4">
      <Container>
        <dl className="grid grid-cols-2 divide-mauve-100 rounded-block bg-white py-2 shadow-lift3 ring-1 ring-mauve-100 sm:grid-cols-3 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:divide-x" style={{ ['--cols' as string]: stats.length }}>
          {stats.map((s) => (
            <div key={s.id} className="px-5 py-5 text-center">
              <dd className="font-jakarta text-[1.75rem] font-extrabold leading-none tracking-tight text-night-900 lg:text-[2rem]"><CountUp value={s.value} /></dd>
              <dt className="mt-2 font-jakarta text-sm font-bold text-iris-700">{s.label}</dt>
              {s.caption && <p className="mt-0.5 text-xs text-mauve-600">{s.caption}</p>}
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
