// Deep-emerald footer: browse-by-discipline columns, contact, identifiers, email alerts, policy / explore / resource link lists and the
// copyright bar. "Editorial login" is a small link at the very bottom. Only facts from the journal config are shown.
import { useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { policyLinks } from '../../../config/navigation'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { AppLink } from '../../../core/router'
import { disciplines } from '../components/discipline'
import { ArrowUpIcon } from '../components/homeIcons'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Send } from '../icons'
import { LogoTile } from '../components/BrandBlock'

const colHead = 'font-display text-base font-bold text-white'
const eyebrow = 'text-xs font-semibold uppercase tracking-wider text-brand-200'
const link = 'text-sm text-brand-100 hover:text-white hover:underline'
const ring = 'focus-visible:!outline-white'

function Newsletter({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const msg = validate.email(email)
    setError(msg)
    if (msg) return
    setBusy(true)
    try { await onSubscribe(email.trim()); toast('Subscribed. Issue alerts will arrive by email.'); setEmail('') } catch { setError('Could not subscribe. Please try again.') } finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} noValidate aria-label="Email alerts">
      <label htmlFor="j2-news" className={colHead}>Get new-issue alerts</label>
      <p className="mt-1.5 text-sm text-brand-100">One short email when each monthly issue is published.</p>
      <div className="mt-3 flex gap-2">
        <input id="j2-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'j2-news-err' : undefined}
          className="min-w-0 flex-1 rounded-soft border border-brand-300/50 bg-white px-3 py-2.5 text-sm text-graphite-800 placeholder:text-graphite-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/60" />
        <button type="submit" disabled={busy} aria-label="Subscribe" className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-soft bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60 ${ring}`}>
          <Send className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{busy ? 'Subscribing…' : 'Subscribe'}</span>
        </button>
      </div>
      {error && <p id="j2-news-err" role="alert" className="mt-1.5 rounded bg-white px-2 py-1 text-xs font-medium text-danger">{error}</p>}
    </form>
  )
}

const slug = (s: string) => policyLinks.find((p) => p.slug === s)!
const policyCol = ['peer-review', 'publication-ethics', 'plagiarism', 'retraction', 'refund'].map(slug).map((p) => ({ label: p.label, to: p.to }))
const exploreCol: [string, string][] = [['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues], ['Editorial Board', paths.editorialBoard], ['Indexing', paths.about('indexing')], ['Aims & Scope', paths.about('aims-scope')]]
const authorCol: [string, string][] = [['Submit Manuscript', paths.submit], ['Track My Paper', paths.track], ['Author Guidelines', paths.policy('author-guidelines')], ['Become a Reviewer', paths.forAuthors('become-a-reviewer')], ['Verify a Certificate', paths.verify()]]

export function Footer({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-brand-800 text-brand-100">
      <Container className="py-12">
        <p className={eyebrow}>Browse articles by discipline</p>
        <nav aria-label="Disciplines" className="mt-4">
          <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {disciplines.map((d) => <li key={d.id}><AppLink to={paths.search(d.name)} className={`${link} ${ring}`}>{d.name}</AppLink></li>)}
          </ul>
        </nav>

        <div className="mt-10 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className={`flex items-center gap-4 ${ring}`}>
              <LogoTile className="h-20 w-20" />
              <span className="min-w-0 font-display text-lg font-bold leading-snug text-white">{journal.name}</span>
            </AppLink>
            <h2 className={`${colHead} mt-6`}>Contact Editorial Office</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div><dt className="inline font-semibold text-white">Editorial Email: </dt><dd className="inline"><a href={`mailto:${journal.email}`} className="hover:text-white hover:underline">{journal.email}</a></dd></div>
              <div><dt className="inline font-semibold text-white">Publisher: </dt><dd className="inline">{journal.publisher}</dd></div>
              <div><dt className="inline font-semibold text-white">Postal Address: </dt><dd className="inline">{journal.address}</dd></div>
            </dl>
          </div>
          <div>
            <h2 className={colHead}>Identifiers &amp; Licence</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div><dt className="inline font-semibold text-white">Online ISSN: </dt><dd className="inline">{journal.issnOnline}</dd></div>
              <div><dt className="inline font-semibold text-white">Crossref DOI Prefix: </dt><dd className="inline">{journal.doiPrefix}</dd></div>
              <div><dt className="inline font-semibold text-white">Licensing: </dt><dd className="inline">{journal.licence.name} open access</dd></div>
              <div><dt className="inline font-semibold text-white">Frequency: </dt><dd className="inline">{journal.frequency}</dd></div>
            </dl>
          </div>
          <Newsletter onSubscribe={onSubscribe} />
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-3">
          <nav aria-label="Editorial policies">
            <h2 className={colHead}>Editorial Policies</h2>
            <ul className="mt-3 space-y-2">{policyCol.map((l) => <li key={l.to}><AppLink to={l.to} className={`${link} ${ring}`}>{l.label}</AppLink></li>)}</ul>
          </nav>
          <nav aria-label="Explore the journal">
            <h2 className={colHead}>Explore Journal</h2>
            <ul className="mt-3 space-y-2">{exploreCol.map(([l, to]) => <li key={to}><AppLink to={to} className={`${link} ${ring}`}>{l}</AppLink></li>)}</ul>
          </nav>
          <nav aria-label="Community resources">
            <h2 className={colHead}>For Authors &amp; Reviewers</h2>
            <ul className="mt-3 space-y-2">{authorCol.map(([l, to]) => <li key={to}><AppLink to={to} className={`${link} ${ring}`}>{l}</AppLink></li>)}</ul>
          </nav>
        </div>
      </Container>

      <div className="border-t border-white/15 bg-brand-900">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5 text-xs text-brand-100">
          <div>
            <p>© {year} {journal.name} ({journal.shortName}). ISSN {journal.issnOnline}.</p>
            <p className="mt-1">Published by {journal.publisher}. Articles are open access under {journal.licence.name}.</p>
          </div>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <AppLink to={paths.policy('privacy')} className={`hover:text-white hover:underline ${ring}`}>Privacy</AppLink>
            <AppLink to={paths.editorialLogin} className={`hover:text-white hover:underline ${ring}`}>Editorial login</AppLink>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })} className={`inline-flex items-center gap-1 font-semibold text-white hover:underline ${ring}`}>Back to top <ArrowUpIcon className="h-4 w-4" aria-hidden="true" /></button>
          </p>
        </Container>
      </div>
    </footer>
  )
}
