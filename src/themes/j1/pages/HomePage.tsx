import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { MdOutlineEditNote, MdOutlineInfo, MdOutlineMailOutline, MdOutlineWorkspacePremium } from 'react-icons/md'
import type { ArticleSummary, J1HomeData } from '../../../mock-data/journals/j1'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { ApcCalculator } from '../components/ApcCalculator'
import { Avatar } from '../components/Avatar'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { Button } from '../components/Button'
import { CountUp } from '../components/CountUp'
import { CfpCard, LeftSidebar, RightSidebar } from '../components/HomeSidebars'
import { IndexedStrip } from '../components/IndexLogos'
import { IssueCover } from '../components/IssueCover'
import { Card, PortalArticle, Tag } from '../components/PortalParts'
import { Container } from '../components/primitives'
import { ProcessStepper } from '../components/ProcessStepper'
import { StickyRail } from '../components/StickyRail'
import { Testimonials } from '../components/Testimonials'
import { TrustIcon } from '../components/icons'
import { AppLink, useRouter } from '../../../core/router'
import { useToast } from '../components/Toast'
import { LockOpen, Search } from '../components/uiIcons'
import { formatDate, formatMonthYear } from '../../../core/lib/format'
import * as validate from '../../../core/lib/validators'

interface Props {
  data: J1HomeData
  onSubscribe: (email: string) => Promise<void>
}

/** Names inside an award recipient string such as "Dr. A and Dr. B" or "Prof. C (University)". */
const recipientNames = (r: string) => r.replace(/\([^)]*\)/g, '').split(/\s+and\s+|,/).map((n) => n.trim()).filter(Boolean)

const PERSPECTIVE_ART = ['/journals/j1/images/persp-ai.svg', '/journals/j1/images/persp-doi.svg', '/journals/j1/images/persp-impact.svg']

const NAVY_BTN = 'inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded bg-navy px-5 text-sm font-bold text-white hover:bg-navy-900'
const OUTLINE_BTN = 'inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded border border-line bg-white px-5 text-sm font-bold text-navy hover:bg-mist'

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
    <form onSubmit={submit} noValidate className="grid gap-4 rounded border border-[#C4D9EE] bg-scholar-soft p-4 sm:p-5 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-navy"><MdOutlineMailOutline className="h-5 w-5 text-scholar" aria-hidden />Subscribe to Alerts</h2>
        <p className="mt-1 text-sm text-ink-muted">Receive the monthly digest with DOIs as soon as a new issue is final. No account needed; unsubscribe anytime.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto] md:w-[24rem]">
        <div>
          <label htmlFor="alert-email" className="sr-only">Email address</label>
          <input id="alert-email" type="email" value={email} maxLength={120} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'alert-email-err' : undefined}
            onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setError('') }}
            className="h-11 w-full rounded border border-line bg-white px-3 text-sm outline-none focus:border-scholar focus:ring-2 focus:ring-scholar/20" />
          {error && <p id="alert-email-err" role="alert" className="mt-1 text-xs font-medium text-danger">{error}</p>}
        </div>
        <Button type="submit" loading={busy} className="!bg-navy hover:!bg-navy-900">Subscribe</Button>
      </div>
    </form>
  )
}

/** Hero of the centre column: current-issue cover, badges, headline, call-to-action buttons, search and the journal's key figures. */
function Hero({ data }: { data: J1HomeData }) {
  const { navigate } = useRouter()
  const [q, setQ] = useState('')
  const stats = journal.heroStats.filter((s) => s.show)
  const ci = data.currentIssue
  const go = (e: FormEvent) => { e.preventDefault(); const t = q.trim(); if (t) navigate(paths.search(t)) }
  return (
    <section aria-labelledby="hero-h" className="overflow-hidden rounded border border-line bg-paper">
      <div className="grid gap-5 p-4 sm:grid-cols-[auto_1fr] sm:gap-6 sm:p-6">
        <AppLink to={paths.currentIssue} aria-label={`Open Volume ${ci.volume}, Issue ${ci.issue} (current issue)`} className="mx-auto block w-[132px] self-start border border-navy-700 sm:mx-0 sm:mt-2">
          <IssueCover volume={ci.volume} issue={ci.issue} month={ci.month} className="block h-auto w-full" />
        </AppLink>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-sm border border-[#FCD8A5] bg-[#FFF7EB] px-2 py-0.5 text-xs font-semibold text-[#8A4B00]"><LockOpen className="h-3.5 w-3.5" aria-hidden />Open Access</span>
            <span className="inline-flex items-center rounded-sm border border-line bg-white px-2 py-0.5 text-xs font-semibold text-navy">{journal.frequency} Publication</span>
            <span className="inline-flex items-center rounded-sm border border-line bg-white px-2 py-0.5 text-xs font-semibold text-navy">{formatMonthYear(ci.month)}</span>
          </div>
          <h1 id="hero-h" className="mt-3 font-serif text-[1.875rem] font-semibold leading-[1.15] tracking-tight text-navy sm:text-[2.25rem] sm:leading-[1.2]">Advancing multidisciplinary academic research and trends</h1>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted sm:text-base">{journal.mission}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <AppLink to={paths.submit} className={NAVY_BTN}><MdOutlineEditNote className="h-5 w-5" aria-hidden />Submit Manuscript</AppLink>
            <AppLink to={paths.policy('author-guidelines')} className={OUTLINE_BTN}>Author Guidelines</AppLink>
          </div>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 sm:px-6">
        <form role="search" onSubmit={go} className="flex">
          <label htmlFor="hero-search" className="sr-only">Search articles, authors, keywords or DOI</label>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-l border border-line bg-white px-3 focus-within:border-scholar focus-within:ring-2 focus-within:ring-scholar/20">
            <Search className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden />
            <input id="hero-search" value={q} onChange={(e) => setQ(e.target.value)} maxLength={160} autoComplete="off" placeholder={`Search articles, authors, keywords, DOI (e.g., ${journal.doiPrefix}/${journal.paperIdPrefix}…)`}
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted" />
          </div>
          <button type="submit" className="h-[46px] shrink-0 rounded-r bg-scholar px-4 text-sm font-bold text-white hover:bg-scholar-dark sm:px-5">Search<span className="hidden sm:inline"> Journal</span></button>
        </form>
        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-muted">
          Try searching:
          {journal.subjects.slice(0, 3).map((s, i) => (
            <span key={s}><AppLink to={paths.search(s)} className="text-scholar hover:underline">{s}</AppLink>{i < 2 ? ',' : ''}</span>
          ))}
        </p>
      </div>
      <dl className="grid grid-cols-2 border-t border-line bg-white sm:grid-cols-4 sm:divide-x sm:divide-line">
        {stats.map((s) => (
          <div key={s.id} className="border-b border-line px-4 py-3 sm:border-b-0 sm:px-5">
            <dd className="font-serif text-2xl font-semibold tabular-nums text-navy"><CountUp value={s.value} /></dd>
            <dt className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-ink-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** "Verified indexing & abstracting repositories": small caps title and the index logo tiles. */
function Indexing() {
  return (
    <section aria-labelledby="idx-h" className="rounded border border-line bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="idx-h" className="text-xs font-bold uppercase tracking-wider text-ink-muted">Verified indexing &amp; abstracting repositories</h2>
        <AppLink to={paths.about('indexing')} className="inline-flex items-center gap-1 text-xs font-semibold text-scholar hover:underline">Verify our presence<span aria-hidden>↗</span></AppLink>
      </div>
      <IndexedStrip look="strip" limit={8} />
      <p className="mt-2 text-xs text-ink-muted">Select a logo to see what the listing means and to verify it on the index’s own website.</p>
    </section>
  )
}

/** Journal facts as a table with a navy label column. */
function JournalOverview() {
  const linked = (k: string, v: string) =>
    k === 'Email' ? <a href={`mailto:${v}`} className="font-medium text-scholar hover:underline">{v}</a>
      : k === 'Website' ? <a href={`https://${v}`} className="font-medium text-scholar hover:underline">{v}</a> : v
  return (
    <section aria-labelledby="info-h" className="overflow-hidden rounded border border-navy bg-white">
      <header className="flex items-center justify-between gap-3 bg-navy px-4 py-3 sm:px-5">
        <h2 id="info-h" className="flex items-center gap-2 font-serif text-[1.1875rem] font-bold text-white sm:text-[1.3125rem]"><MdOutlineInfo className="h-5 w-5 shrink-0 text-navy-200" aria-hidden />Journal Information &amp; Overview</h2>
        <span className="shrink-0 rounded-sm border border-[#FBD28D] bg-[#FFF7EB] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8A4B00]">Official Metadata</span>
      </header>
      <dl>
        {journal.info.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7.5rem_1fr] border-t border-line first:border-t-0 sm:grid-cols-[10rem_1fr]">
            <dt className="bg-navy px-3 py-3 text-sm font-bold text-white sm:px-4">{k}</dt>
            <dd className={`min-w-0 break-words px-3 py-3 text-sm text-ink sm:px-4 ${['ISSN', 'Starting Year'].includes(k) ? 'font-mono tabular-nums' : ''}`}>{linked(k, v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Segmented tabs (Latest / Most Read / Editor's Choice) in the header of the articles list. Arrow keys move between tabs. */
function ArticlesList({ data }: { data: J1HomeData }) {
  const ci = data.currentIssue
  const uid = useId()
  const tabs: { id: string; label: string; items: ArticleSummary[] }[] = [
    { id: 'latest', label: 'Latest', items: data.latest }, { id: 'read', label: 'Most Read', items: data.mostRead }, { id: 'choice', label: 'Editor’s Choice', items: data.editorsChoice },
  ]
  const [active, setActive] = useState('latest')
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const onKey = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1
    const next = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (next < 0) return
    e.preventDefault(); setActive(tabs[next].id); refs.current[tabs[next].id]?.focus()
  }
  const current = tabs.find((t) => t.id === active)!
  return (
    <section aria-labelledby="articles-h" className="overflow-hidden rounded border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-mist px-4 py-3 sm:px-5">
        <div>
          <h2 id="articles-h" className="font-serif text-[1.1875rem] font-bold leading-snug text-navy sm:text-[1.3125rem]">Current Issue Scholarly Articles</h2>
          <p className="text-sm text-ink-muted">Volume {String(ci.volume).padStart(2, '0')}, Issue {String(ci.issue).padStart(2, '0')} ({formatMonthYear(ci.month)}) · {ci.articleCount} articles</p>
        </div>
        <div role="tablist" aria-label="Article collections" className="flex overflow-hidden rounded border border-line bg-white p-0.5">
          {tabs.map((t, i) => (
            <button key={t.id} ref={(el) => { refs.current[t.id] = el }} role="tab" id={`${uid}-t-${t.id}`} aria-selected={active === t.id} aria-controls={`${uid}-p`} tabIndex={active === t.id ? 0 : -1}
              onClick={() => setActive(t.id)} onKeyDown={(e) => onKey(e, i)}
              className={`whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-bold transition-colors ${active === t.id ? 'bg-navy text-white' : 'text-ink-muted hover:text-navy'}`}>{t.label}</button>
          ))}
        </div>
      </header>
      <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t-${active}`}>
        {current.items.slice(0, 5).map((a) => <PortalArticle key={a.paperId} article={a} />)}
      </div>
      <AppLink to={paths.currentIssue} className="block border-t border-[#C4D9EE] bg-scholar-soft px-4 py-3 text-center text-[13px] font-bold text-navy hover:bg-[#DCE8F8]">
        View Full Volume {ci.volume} Issue {ci.issue} Table of Contents ({ci.articleCount} Articles) →
      </AppLink>
      <p className="border-t border-line px-4 py-2.5 text-center text-xs"><AppLink to={paths.pastIssues} className="font-semibold text-scholar hover:underline">Browse past issues →</AppLink></p>
    </section>
  )
}

export function HomePage({ data, onSubscribe }: Props) {
  const cfp = data.callForPapers
  return (
    <Container className="py-6">
      <div className="grid items-start gap-6 xl:grid-cols-[clamp(280px,23vw,330px)_minmax(0,1fr)_clamp(280px,23vw,330px)]">
        <div className="order-1 min-w-0 space-y-6 xl:order-2">
          <Hero data={data} />
          <div className="xl:hidden"><CfpCard /></div>
          <Indexing />

          <Card size="main" title="Aims, Scope & Research Domains" aside="Subject taxonomy" headingId="aims-h">
            <img src="/journals/j1/images/aims-disciplines.svg" alt="Six research areas (materials, environment, computing, biotechnology, energy and public health) connected around the journal" width={800} height={170} loading="lazy" className="mb-4 h-auto w-full rounded border border-line" />
            <p className="text-[0.9375rem] leading-relaxed text-ink">The journal provides an open access forum for high-impact contributions in theoretical formulation, design methodology, empirical study and applied practice.</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Research domains">
              {journal.subjects.map((s) => <li key={s}><AppLink to={paths.search(s)} className="inline-block rounded border border-scholar/60 bg-white px-3 py-1.5 text-xs font-semibold text-scholar hover:bg-scholar-soft">{s}</AppLink></li>)}
            </ul>
          </Card>

          <Card size="main" title={`Why Scholars Publish With ${journal.shortName}`} headingId="why-h">
            <ul className="grid gap-3 sm:grid-cols-2">
              {journal.trustLedger.map((t, i, all) => (
                <li key={t.id} className={`rounded border border-line bg-paper p-4 ${all.length % 2 === 1 && i === all.length - 1 ? 'sm:col-span-2' : ''}`}>
                  <p className="flex items-center gap-2 font-serif text-base font-bold text-navy"><TrustIcon name={t.icon} className="h-5 w-5 shrink-0 text-scholar" aria-hidden />{t.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{t.text}</p>
                  <AppLink to={t.to} className="mt-2 inline-block text-xs font-semibold text-scholar hover:underline">Learn more<span className="sr-only"> about {t.title}</span> →</AppLink>
                </li>
              ))}
            </ul>
          </Card>

          <JournalOverview />

          <Card size="main" title="Manuscript Lifecycle & Editorial Timeline" aside={<span className="text-[11px] font-bold uppercase tracking-wider text-scholar">Select a stage</span>} headingId="life-h"><ProcessStepper /></Card>

          <ArticlesList data={data} />

          <Card size="main" title="Editorial Board Leadership" subtitle="Distinguished faculty overseeing peer-review integrity." aside={<AppLink to={paths.editorialBoard} className="text-xs font-bold text-scholar hover:underline">View all members →</AppLink>} headingId="board-h">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.leadership.map((e) => (
                <li key={e.id} className="flex flex-col items-center rounded border border-line bg-paper p-3 text-center">
                  <Avatar name={e.name} photo={e.photo} size="sm" />
                  <p className="mt-2 text-[13px] font-bold leading-snug text-navy">{e.name}</p>
                  <p className="text-xs font-semibold text-scholar">{e.role}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">{e.institution}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card size="main" title="Academic Recognition & Excellence Program" subtitle="Monthly awards adjudicated by the Senior Editorial Committee." icon={MdOutlineWorkspacePremium} headingId="awards-h">
            <ul className="grid gap-3 md:grid-cols-2">
              {data.awards.map((a) => (
                <li key={a.kind} className="rounded border border-line bg-paper p-4">
                  <div className="flex items-center justify-between gap-2"><Tag tone="amber">{a.kind}</Tag><span className="text-xs text-ink-muted">{a.period}</span></div>
                  <p className="mt-2.5 font-serif text-base font-bold leading-snug text-navy">{a.title}</p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-scholar">
                    <span className="flex -space-x-1.5" aria-hidden>
                      {recipientNames(a.recipient).map((n) => <Avatar key={n} name={n} photo={portraitFor(n)} size="xs" />)}
                    </span>
                    <span>Recipient: {a.recipient}</span>
                  </p>
                  <p className="mt-1 text-xs leading-snug text-ink-muted">{a.reason}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card size="main" title="Editorial Guidelines & Perspectives" aside="Author resources" headingId="persp-h">
            <ul className="grid gap-3 md:grid-cols-3">
              {data.perspectives.map((p, i) => (
                <li key={p.title}>
                  <AppLink to={p.to} className="block h-full overflow-hidden rounded border border-line bg-white hover:border-scholar">
                    <img src={PERSPECTIVE_ART[i % PERSPECTIVE_ART.length]} alt="" aria-hidden="true" width={400} height={120} loading="lazy" className="h-20 w-full border-b border-line object-cover" />
                    <span className="block p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-scholar">{p.tag}</span>
                    <span className="mt-1 block text-sm font-bold leading-snug text-navy">{p.title}</span>
                    <span className="mt-1.5 block text-xs leading-snug text-ink-muted">{p.text}</span>
                    </span>
                  </AppLink>
                </li>
              ))}
            </ul>
          </Card>

          <section id="apc-payment" className="scroll-mt-24">
            <Card size="main" title="APC & Payment" aside={<AppLink to={paths.forAuthors('apc-payment')} className="text-xs font-semibold text-scholar hover:underline">Full details →</AppLink>} headingId="apc-h">
              <ApcCalculator />
            </Card>
          </section>

          <Card size="main" title="Author Voices" aside="What authors say" headingId="voices-h"><Testimonials items={data.testimonials} /></Card>

          <Subscribe onSubscribe={onSubscribe} />

          <section className="relative isolate overflow-hidden rounded bg-navy p-5 text-white sm:p-7" aria-labelledby="cta-h">
            <img src="/journals/j1/images/cta-network.svg" alt="" aria-hidden="true" width={360} height={250} loading="lazy" className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden h-full w-[38%] object-cover opacity-80 [mask-image:linear-gradient(to_left,black_55%,transparent)] sm:block" />
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="min-w-0 max-w-md">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#FBD28D]">Submissions open</p>
                <h2 id="cta-h" className="mt-1.5 font-serif text-2xl font-semibold leading-snug">Ready to Publish Your Research in {cfp.issueName.split(' — ')[0]}?</h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-100">Submit today for editor-led evaluation. The next issue closes on {formatDate(cfp.deadline.slice(0, 10))}, with a first decision in about {cfp.avgReviewDays} days.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <AppLink to={paths.submit} className="inline-flex h-12 items-center justify-center rounded bg-scholar px-6 text-sm font-bold text-white hover:bg-scholar-dark">Submit Manuscript</AppLink>
                <AppLink to={paths.apc} className="inline-flex h-12 items-center justify-center rounded border border-white/60 px-6 text-sm font-bold text-white hover:bg-white/10">Check APC</AppLink>
              </div>
            </div>
          </section>
        </div>

        <StickyRail label="Journal updates" className="order-2 grid content-start gap-4 md:grid-cols-2 xl:order-1 xl:block xl:space-y-4"><LeftSidebar data={data} /></StickyRail>
        <StickyRail label="Author tools" className="order-3 grid content-start gap-4 md:grid-cols-2 xl:block xl:space-y-4"><RightSidebar /></StickyRail>
      </div>
    </Container>
  )
}
