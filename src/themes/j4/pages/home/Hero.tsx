// Home hero: dark slate with a faint blueprint grid, the serif journal title, trust badges, an issue-metadata card, and a search bar that overlaps the bottom edge.
import type { ComponentType } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { ArchiveSearch } from '../../components/ArchiveSearch'
import { ButtonLink } from '../../components/Button'
import { Container, Label } from '../../components/primitives'
import { ArrowRight, Calendar, LinkIcon, OpenAccess, Shield, Verified, type IconProps } from '../../icons'

/** Trust badges. Peer review, open access and the DOI are real today; the other two stay off until the client confirms them in the config. */
function badges(): { icon: ComponentType<IconProps>; label: string }[] {
  const b = journal.badges
  return [
    b.peerReviewed && { icon: Verified, label: 'Peer reviewed' },
    b.openAccess && { icon: OpenAccess, label: `Open access · ${journal.licence.name}` },
    { icon: LinkIcon, label: 'Crossref DOI' },
    { icon: Calendar, label: `${journal.frequency} issues` },
    b.doubleBlind && { icon: Shield, label: 'Double-blind review' },
    b.cope && { icon: Shield, label: 'COPE compliant' },
  ].filter(Boolean) as { icon: ComponentType<IconProps>; label: string }[]
}

export function Hero({ issue }: { issue: IssueSummary }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate bg-abyss-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_72%_30%,black,transparent_72%)]" />
      </div>
      <Container className="grid items-start gap-8 pb-16 pt-9 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14 lg:pb-[4.5rem]">
        <div>
          <Label className="text-azure-300">Open access · Engineering and management</Label>
          <h1 id="hero-title" className="mt-3 max-w-3xl font-serif4 font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(34px,3.8vw,54px)' }}>{journal.name}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-abyss-200 sm:text-[1.0625rem]">{journal.mission}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {badges().map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-ctl border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] font-medium text-abyss-100"><Icon className="h-4 w-4 text-azure-300" aria-hidden="true" />{label}</li>
            ))}
          </ul>
        </div>

        <aside aria-label="Current issue" className="rounded-pane border border-white/15 bg-abyss-800/80 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-azure-300">Current issue</Label>
            <span className="rounded-ctl bg-azure-400/15 px-2 py-0.5 text-xs font-semibold text-azure-300">Open access</span>
          </div>
          <p className="mt-3 font-serif4 text-[1.75rem] font-semibold leading-tight">Volume {issue.volume}, Issue {issue.issue}</p>
          <p className="text-sm text-abyss-300">{formatMonthYear(issue.publishedAt)}</p>
          <dl className="mt-4 divide-y divide-white/10 border-y border-white/10 text-sm tabular-nums">
            {[['Published', formatDate(issue.publishedAt)], ['Articles', String(issue.articleCount)], ['Issue DOI', issue.doi], ['ISSN (Online)', journal.issnOnline]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 py-2"><dt className="text-abyss-300">{k}</dt><dd className="min-w-0 truncate font-medium text-white">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-4 flex items-center justify-between gap-3">
            <ButtonLink to={paths.currentIssue} variant="light">View issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
            <AppLink to={paths.pastIssues} className="text-sm font-medium text-azure-300 hover:text-white hover:underline">Past issues</AppLink>
          </div>
        </aside>
      </Container>

      <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2">
        <Container><ArchiveSearch /></Container>
      </div>
    </section>
  )
}
