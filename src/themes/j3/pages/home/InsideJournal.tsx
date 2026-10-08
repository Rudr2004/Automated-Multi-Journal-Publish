// "Inside IJCSD": the review process, open access, DOI and certificates, from the journal config, shown as a stepped timeline.
// On desktop the steps zig-zag down a centre line; on phones they stack beside a line on the left.
import type { ComponentType } from 'react'
import { journal } from '../../../../config/journals'
import { AppLink } from '../../../../core/router'
import { Container, cx, SectionTitle } from '../../components/primitives'
import { Award, LinkIcon, OpenAccess, Review, type IconProps } from '../../icons'

const ICONS: Record<string, ComponentType<IconProps>> = { review: Review, oa: OpenAccess, doi: LinkIcon, cert: Award }

type Item = (typeof journal.trustLedger)[number]

function StepCard({ item, step, align }: { item: Item; step: number; align: 'left' | 'right' }) {
  const Icon = ICONS[item.id] ?? Review
  return (
    <div className={cx('relative rounded-block bg-iris-50 p-6 sm:p-7', align === 'left' ? 'md:mr-4' : 'md:ml-4')}>
      {/* Small arrow pointing at the centre line. */}
      <span aria-hidden="true" className={cx('absolute top-7 hidden h-4 w-4 rotate-45 bg-iris-50 md:block', align === 'left' ? '-right-2' : '-left-2')} />
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-iris-700 text-white"><Icon className="h-6 w-6" /></span>
        <div>
          <p className="font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-iris-700">Step {step}</p>
          <h3 className="font-jakarta text-xl font-extrabold leading-tight text-night-900">{item.title}</h3>
        </div>
      </div>
      <p className="mt-4 text-base text-mauve-700">{item.text}</p>
      <AppLink to={item.to} className="mt-4 inline-block font-jakarta text-sm font-bold text-iris-700 hover:underline">Learn more →</AppLink>
    </div>
  )
}

export function InsideJournal() {
  const items = journal.trustLedger
  return (
    <section aria-labelledby="inside-title" className="py-16 sm:py-24">
      <Container>
        <SectionTitle id="inside-title" kicker={`Inside ${journal.shortName}`} title="How we publish" />
        <ol className="relative">
          {items.map((item, i) => {
            const left = i % 2 === 0
            return (
              <li key={item.id} className={cx('relative pb-8 pl-16 last:pb-0 md:grid md:grid-cols-[1fr_4rem_1fr] md:items-start md:pl-0', i > 0 && 'md:-mt-12')}>
                {/* Connector from this step's circle down to the next one (none after the last step), on the left on phones and in the centre on desktop. */}
                {i < items.length - 1 && <span aria-hidden="true" className="absolute left-6 top-[44px] h-full w-0.5 -translate-x-1/2 bg-iris-200 md:left-1/2 md:top-6 md:h-[calc(100%-3rem)]" />}
                <span aria-hidden="true" className="absolute left-6 top-5 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-night-900 font-jakarta text-base font-extrabold text-white ring-8 ring-white md:static md:col-start-2 md:row-start-1 md:mx-auto md:translate-x-0">{i + 1}</span>
                <div className={cx('md:row-start-1', left ? 'md:col-start-1' : 'md:col-start-3')}><StepCard item={item} step={i + 1} align={left ? 'left' : 'right'} /></div>
              </li>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
