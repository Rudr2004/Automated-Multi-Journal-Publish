import { useState, type FormEvent } from 'react'
import type { ArticleSummary, J1HomeData } from '../../../mock-data/journals/j1'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { ApcCalculator } from '../components/ApcCalculator'
import { ArticleEntry } from '../components/ArticleEntry'
import { Avatar } from '../components/Avatar'
import { Button, ButtonLink } from '../components/Button'
import { CoverStack } from '../components/CoverStack'
import { CountUp } from '../components/CountUp'
import { CfpCard, LeftSidebar, ResourcesRow, RightSidebar } from '../components/HomeSidebars'
import { IndexedStrip } from '../components/IndexLogos'
import { Badge, Container, Panel } from '../components/primitives'
import { ProcessStepper } from '../components/ProcessStepper'
import { AppLink } from '../../../core/router'
import { Tabs } from '../components/Tabs'
import { Testimonials } from '../components/Testimonials'
import { useToast } from '../components/Toast'
import { TrustLedger } from '../components/TrustLedger'
import { FilePlus2, LockOpen } from '../components/uiIcons'
import { formatDate, formatMonthYear } from '../../../core/lib/format'
import * as validate from '../../../core/lib/validators'

interface Props {
  data: J1HomeData
  onSubscribe: (email: string) => Promise<void>
}

const PATH = [
  { title: 'Scope', text: 'Check the subject areas and article types we publish.', to: paths.about('aims-scope'), cta: 'Aims & scope' },
  { title: 'Guidelines', text: 'Formatting, declarations and templates.', to: paths.policy('author-guidelines'), cta: 'Read guidelines' },
  { title: 'APC', text: 'Shown upfront and paid only after acceptance.', to: paths.apc, cta: 'Calculator' },
  { title: 'Submit', text: 'About ten minutes. No account needed.', to: paths.submit, cta: '' },
]

function Subscribe({ onSubscribe }: { onSubscribe: Props['onSubscribe'] }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = validate.email(email)
    if (problem) { setError(problem); return }
    setError(''); setBusy(true)
    try { await onSubscribe(email); toast('Subscribed. You will receive issue alerts by email.'); setEmail('') }
    catch { toast('Could not subscribe. Please try again.', 'error') }
    finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} noValidate className="grid gap-3 border border-line bg-paper p-5 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <h2 className="font-serif text-xl font-semibold text-navy">Subscribe to issue alerts</h2>
        <p className="mt-1 text-sm text-ink-muted">Receive the monthly digest with DOIs as soon as a new issue is final. No account needed; unsubscribe anytime.</p>
      </div>
      <div className="grid gap-2 sm:w-[22rem] sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="alert-email" className="sr-only">Email address</label>
          <input id="alert-email" type="email" value={email} maxLength={120} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'alert-email-err' : undefined}
            onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setError('') }}
            className="h-11 w-full rounded border border-line bg-white px-3 text-sm outline-none focus:border-scholar focus:ring-2 focus:ring-scholar/20" />
          {error && <p id="alert-email-err" role="alert" className="mt-1 text-xs font-medium text-danger">{error}</p>}
        </div>
        <Button type="submit" loading={busy}>Subscribe</Button>
      </div>
    </form>
  )
}

function Masthead({ data }: { data: J1HomeData }) {
  const stats = journal.heroStats.filter((s) => s.show)
  return (
    <section aria-labelledby="masthead-h" className="border border-line bg-paper"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(20,40,75,0.045) 0 1px, transparent 1px 22px)' }}>
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <CoverStack issues={data.recentIssues} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="open"><LockOpen className="mr-1 h-3 w-3" aria-hidden />Open Access</Badge>
            <Badge tone="index">{journal.frequency} publication</Badge>
            <Badge tone="index">{formatMonthYear(data.currentIssue.month)}</Badge>
          </div>
          <h2 id="masthead-h" className="mt-3 font-serif text-[1.625rem] font-semibold leading-tight tracking-tight text-navy sm:text-[1.875rem]">Advancing multidisciplinary academic research and trends</h2>
          <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ink">{journal.mission}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink to={paths.submit} variant="submit"><FilePlus2 className="h-4 w-4" aria-hidden />Submit Manuscript</ButtonLink>
            <ButtonLink to={paths.policy('author-guidelines')} variant="outline">Author Guidelines</ButtonLink>
          </div>
        </div>
      </div>
      <dl className="grid grid-cols-2 divide-line border-t border-line bg-white sm:grid-cols-4 sm:divide-x">
        {stats.map((s) => (
          <div key={s.id} className="border-b border-line px-5 py-3.5 sm:border-b-0">
            <dd className="font-serif text-2xl font-semibold text-navy"><CountUp value={s.value} /></dd>
            <dt className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

function ArticlesPanel({ data }: { data: J1HomeData }) {
  const stack = (items: ArticleSummary[]) => <div>{items.slice(0, 5).map((a) => <ArticleEntry key={a.paperId} article={a} />)}</div>
  const ci = data.currentIssue
  return (
    <Panel title="Current Issue Scholarly Articles" aside={`Vol ${ci.volume}, Issue ${ci.issue}`}>
      <p className="-mt-1 mb-3 text-sm text-ink-muted">{formatMonthYear(ci.month)} · {ci.articleCount} articles</p>
      <Tabs label="Article collections" tabs={[
        { id: 'latest', label: 'Latest', content: stack(data.latest) },
        { id: 'read', label: 'Most Read', content: stack(data.mostRead) },
        { id: 'choice', label: 'Editor’s Choice', content: stack(data.editorsChoice) },
      ]} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm font-semibold">
        <AppLink to={paths.currentIssue} className="text-scholar hover:underline">View the full table of contents ({ci.articleCount} articles) →</AppLink>
        <AppLink to={paths.pastIssues} className="text-scholar hover:underline">Browse past issues →</AppLink>
      </div>
    </Panel>
  )
}

/** Four-step "publish with us" path: scope → guidelines → APC → submit. */
function AuthorPath() {
  return (
    <Panel title={`Publish With ${journal.shortName}`} aside="4 steps">
      <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {PATH.map((s, i) => (
          <li key={s.title} className="flex min-w-0 flex-col bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">{i + 1}</span>
              <p className="font-serif text-base font-semibold leading-tight text-navy">{s.title}</p>
            </div>
            <p className="mt-2 text-xs leading-snug text-ink-muted">{s.text}</p>
            {/* The action row sits at the bottom of every cell, so the four steps line up. */}
            <div className="mt-auto pt-4">
              {s.cta
                ? <AppLink to={s.to} className="inline-flex h-9 items-center whitespace-nowrap text-sm font-semibold text-scholar hover:underline">{s.cta} →</AppLink>
                : <ButtonLink to={s.to} variant="submit" size="sm" className="w-full">Submit now</ButtonLink>}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

function MoreFromJournal({ data }: { data: J1HomeData }) {
  return (
    <Panel title="More From the Journal" aside="Recognition, guidance and author voices">
      <Tabs label="More from the journal" tabs={[
        {
          id: 'recognition', label: 'Recognition',
          content: (
            <ul className="grid gap-4 md:grid-cols-2">
              {data.awards.map((a) => (
                <li key={a.kind} className="border border-line border-l-[3px] border-l-[#B8892B] bg-paper p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A6620]">{a.kind} · {a.period}</p>
                  <p className="mt-1 font-serif text-base font-semibold leading-snug text-navy">{a.title}</p>
                  <p className="mt-1.5 text-sm text-ink">Recipient: {a.recipient}</p>
                  <p className="mt-1 text-xs leading-snug text-ink-muted">{a.reason}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'guidance', label: 'Guidance',
          content: (
            <ul className="grid gap-px border border-line bg-line md:grid-cols-3">
              {data.perspectives.map((p) => (
                <li key={p.title} className="bg-white">
                  <AppLink to={p.to} className="block h-full p-4 hover:bg-paper">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-scholar">{p.tag}</span>
                    <span className="mt-1 block font-serif text-base font-semibold leading-snug text-navy">{p.title}</span>
                    <span className="mt-1 block text-xs leading-snug text-ink-muted">{p.text}</span>
                  </AppLink>
                </li>
              ))}
            </ul>
          ),
        },
        { id: 'voices', label: 'Author voices', content: <Testimonials items={data.testimonials} /> },
      ]} />
    </Panel>
  )
}

// Sidebars stay in view while the main column scrolls, so the sides never look empty on wide screens.
const STICKY = 'xl:sticky xl:top-16 xl:max-h-[calc(100vh-5rem)] xl:self-start xl:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

export function HomePage({ data, onSubscribe }: Props) {
  const cfp = data.callForPapers
  return (
    <Container className="mt-6">
      <div className="grid items-start gap-6 xl:grid-cols-[250px_minmax(0,1fr)_280px]">
        <aside aria-label="Journal updates" className={`order-2 grid content-start gap-4 md:grid-cols-2 xl:order-1 xl:block xl:space-y-4 ${STICKY}`}><LeftSidebar data={data} /></aside>

        <div className="order-1 min-w-0 space-y-6 xl:order-2">
          <Masthead data={data} />
          <div className="xl:hidden"><CfpCard /></div>

          <ArticlesPanel data={data} />

          <Panel title="Aims, Scope & Research Domains" aside="Subject taxonomy">
            <p className="text-[0.9375rem] leading-relaxed text-ink">The journal provides an open access forum for high-impact contributions in theoretical formulation, design methodology, empirical study and applied practice.</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Research domains">
              {journal.subjects.map((s) => <li key={s}><AppLink to={paths.search(s)} className="inline-block rounded-sm border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-navy hover:border-scholar hover:text-scholar">{s}</AppLink></li>)}
            </ul>
          </Panel>

          <AuthorPath />

          <section id="apc-payment" aria-labelledby="apc-h" className="scroll-mt-24">
            <Panel title="APC & Payment" aside={<AppLink to={paths.forAuthors('apc-payment')} className="text-scholar hover:underline">Full details →</AppLink>}>
              <h4 id="apc-h" className="sr-only">APC calculator</h4>
              <ApcCalculator />
            </Panel>
          </section>

          <Panel title={`Why Publish With ${journal.shortName}`} aside="Our commitments"><TrustLedger /></Panel>

          <Panel title="Verified Indexing & Abstracting" aside={<AppLink to={paths.about('indexing')} className="text-scholar hover:underline">Verify our presence ↗</AppLink>}>
            <IndexedStrip look="strip" limit={8} />
            <p className="mt-2 text-xs text-ink-muted">Select a logo to see what the listing means and to verify it on the index’s own website.</p>
          </Panel>

          <Panel title="Manuscript Lifecycle & Editorial Timeline" aside="Select a stage"><ProcessStepper /></Panel>

          <Panel title="Editorial Board Leadership" aside={<AppLink to={paths.editorialBoard} className="text-scholar hover:underline">View all members →</AppLink>}>
            <p className="-mt-1 mb-3 text-sm text-ink-muted">Distinguished faculty overseeing peer-review integrity.</p>
            <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
              {data.leadership.map((e) => (
                <li key={e.id} className="flex items-center gap-3 bg-white p-3">
                  <Avatar name={e.name} photo={e.photo} size="md" />
                  <div className="min-w-0"><p className="font-serif text-base font-semibold leading-snug text-navy">{e.name}</p><p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">{e.role}</p><p className="truncate text-xs text-ink-muted">{e.institution}</p></div>
                </li>
              ))}
            </ul>
          </Panel>

          <MoreFromJournal data={data} />
        </div>

        <aside aria-label="Author tools" className={`order-3 grid content-start gap-4 md:grid-cols-2 xl:block xl:space-y-4 ${STICKY}`}><RightSidebar /></aside>
      </div>

      {/* Full-width finish: nothing here sits next to an empty column. */}
      <div className="mt-6 space-y-6">
        <ResourcesRow />
        <Subscribe onSubscribe={onSubscribe} />
        <section className="bg-navy p-6 text-white sm:p-8" aria-labelledby="cta-h">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">Submissions open</p>
              <h2 id="cta-h" className="mt-1 font-serif text-2xl font-semibold leading-snug sm:text-[1.75rem]">Ready to publish your research in {cfp.issueName.split(' — ')[0]}?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy-100">Submit today for editor-led evaluation. The next issue closes on {formatDate(cfp.deadline.slice(0, 10))}, with a first decision in about {cfp.avgReviewDays} days.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to={paths.submit} variant="submit" size="lg">Submit Manuscript</ButtonLink>
              <ButtonLink to={paths.apc} variant="outline-light" size="lg">Check APC</ButtonLink>
            </div>
          </div>
        </section>
      </div>
    </Container>
  )
}
