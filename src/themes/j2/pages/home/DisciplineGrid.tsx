// "Explore by discipline": icon tiles that open the articles in that discipline.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { DisciplineIcon, disciplines } from '../../components/discipline'
import { Container, SectionHeading } from '../../components/primitives'
import { ArrowRight } from '../../icons'

const BLURB: Record<string, string> = {
  engineering: 'Structures, machines, energy and manufacturing',
  computing: 'AI, data, software and networks',
  life: 'Health, biotechnology and the biomedical sciences',
  environment: 'Climate, water, ecosystems and cities',
  physical: 'Materials, chemistry and physics',
  social: 'Education, policy, society and culture',
  business: 'Finance, enterprise, markets and management',
  agriculture: 'Crops, food systems and rural livelihoods',
}

export function DisciplineGrid() {
  return (
    <section aria-labelledby="disciplines-title" className="bg-accent-50/60 py-14 sm:py-20">
      <Container>
        <SectionHeading id="disciplines-title" eyebrow="Disciplines" title="One journal, every field" text="Browse published research by discipline, or submit work that crosses several." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map((d) => (
            <li key={d.id}>
              <AppLink to={paths.search(d.name)} className="group flex h-full flex-col gap-4 rounded-panel border border-graphite-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-soft motion-reduce:transform-none">
                <DisciplineIcon discipline={d} size="lg" />
                <div>
                  <p className="font-display text-lg font-semibold leading-snug text-graphite-800">{d.name}</p>
                  <p className="mt-1 text-sm text-graphite-600">{BLURB[d.id]}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-accent-700">View articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
              </AppLink>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
