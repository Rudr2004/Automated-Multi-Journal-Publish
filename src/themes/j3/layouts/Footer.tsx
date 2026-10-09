// Navy footer after the reference: an issue-alerts band, four columns (About, For Authors, Editorial & Governance, Compliance & Licensing),
// an "identified by" strip and the legal line. "Editorial login" is a small link at the very bottom.
import { useState, type FormEvent } from 'react'
import { doiFor, journal, logoSrc, visibleLogos } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { AppLink } from '../../../core/router'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { OpenAccess, Send, Verified } from '../icons'

const head = 'font-jakarta text-lg font-semibold text-iris-100'
const link = 'font-inter text-sm text-night-200 transition-colors hover:text-white hover:underline'
const wrap = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

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
    <form onSubmit={submit} noValidate aria-label="Email alerts" className="w-full max-w-md">
      <label htmlFor="j3-news" className="font-jakarta text-lg font-semibold text-white">Get each new issue by email</label>
      <p className="mt-1 font-inter text-sm text-night-200">One short message when a monthly issue is published. No spam.</p>
      <div className="mt-3 flex gap-2">
        <input id="j3-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'j3-news-err' : undefined}
          className="min-w-0 flex-1 border border-white/30 bg-white/10 px-4 py-2.5 font-inter text-sm text-white placeholder:text-night-300 focus:border-white focus:outline-none focus:ring-2 focus:ring-ember-400" />
        <button type="submit" disabled={busy} aria-label="Subscribe" className="inline-flex items-center justify-center gap-2 bg-ember-500 px-5 py-2.5 font-inter text-xs font-semibold uppercase tracking-[0.06em] text-night-900 transition-colors hover:bg-ember-400 disabled:opacity-60">
          <Send className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{busy ? 'Subscribing…' : 'Subscribe'}</span>
        </button>
      </div>
      {error && <p id="j3-news-err" role="alert" className="mt-2 font-inter text-xs font-semibold text-ember-300">{error}</p>}
    </form>
  )
}

export function Footer({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const logos = visibleLogos()
  const about: [string, string][] = [['Publisher', journal.publisher], ['Frequency', journal.frequency], ['E-ISSN', journal.issnOnline], ['DOI prefix', journal.doiPrefix]]
  const authors: [string, string][] = [
    ['Submit Manuscript', paths.submit], ['Track My Paper', paths.track], ['Author Guidelines', paths.policy('author-guidelines')], ['Submission Process', paths.forAuthors('submission-process')],
    ['APC & Payment', paths.forAuthors('apc-payment')], ['Article Templates', paths.forAuthors('templates')], ['Become a Reviewer', paths.forAuthors('become-a-reviewer')], ['Verify a Certificate', paths.verify()],
  ]
  const governance: [string, string][] = [
    ['Editorial Board', paths.editorialBoard], ['Peer Review', paths.policy('peer-review')], ['Publication Ethics', paths.policy('publication-ethics')], ['Plagiarism Policy', paths.policy('plagiarism')],
    ['Copyright & Licensing', paths.policy('copyright-licensing')], ['Indexing', paths.about('indexing')], ['Contact', paths.about('contact')],
  ]
  const badges = [journal.badges.peerReviewed && 'Peer Reviewed', journal.badges.openAccess && 'Open Access', journal.licence.name, 'Crossref DOI'].filter(Boolean) as string[]
  return (
    <footer className="bg-night-900 text-white">
      {/* 1. Lockup and alerts */}
      <div className="border-b border-white/10">
        <div className={`${wrap} grid items-center gap-8 py-10 lg:grid-cols-[1fr_auto] lg:gap-12`}>
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex items-center gap-4">
            <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center bg-white p-1.5"><img src="/journals/j3/logo.png" alt={`${journal.shortName} logo`} width={72} height={72} className="max-h-full max-w-full object-contain" /></span>
            <span className="min-w-0">
              <span className="block font-jakarta text-xl font-semibold leading-snug">{journal.name}</span>
              <span className="mt-1 block font-inter text-sm text-night-200">E-ISSN {journal.issnOnline} · DOI prefix {journal.doiPrefix} · {journal.frequency}</span>
            </span>
          </AppLink>
          <Newsletter onSubscribe={onSubscribe} />
        </div>
      </div>

      {/* 2. Columns */}
      <div className={`${wrap} grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4`}>
        <div>
          <h2 className={head}>About {journal.shortName}</h2>
          <p className="mt-3 font-inter text-sm leading-relaxed text-night-200">{journal.mission}</p>
          <dl className="mt-4 space-y-1 font-inter text-sm text-night-200">
            {about.map(([k, v]) => <div key={k} className="flex flex-wrap gap-x-2"><dt className="text-night-300">{k}:</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <nav aria-label="For authors and reviewers">
          <h2 className={head}>For Authors &amp; Reviewers</h2>
          <ul className="mt-3 space-y-2">{authors.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
        </nav>
        <nav aria-label="Editorial and governance">
          <h2 className={head}>Editorial &amp; Governance</h2>
          <ul className="mt-3 space-y-2">{governance.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
        </nav>
        <div>
          <h2 className={head}>Compliance &amp; Licensing</h2>
          <p className="mt-3 font-inter text-sm leading-relaxed text-night-200">All articles are published open access under the Creative Commons Attribution 4.0 International ({journal.licence.name}) licence, which permits distribution and reuse with attribution. Authors keep their copyright.</p>
          <ul className="mt-4 flex flex-wrap gap-2">{badges.map((b) => <li key={b} className="bg-iris-600 px-2 py-1 font-inter text-[11px] font-semibold uppercase tracking-wider text-iris-100">{b}</li>)}</ul>
          <AppLink to={paths.about('indexing')} className="mt-4 inline-block font-inter text-sm font-semibold text-ember-300 hover:underline">Indexing and identifiers →</AppLink>
        </div>
      </div>

      {/* 3. Identified by */}
      <div className="border-t border-white/10 bg-night-800">
        <div className={`${wrap} flex flex-wrap items-center gap-x-8 gap-y-4 py-5`}>
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-night-200">Identified by</p>
          <ul className="flex flex-wrap items-center gap-3">
            {logos.map((l) => (
              <li key={l.id}>
                <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="flex h-10 items-center bg-white px-4 hover:ring-2 hover:ring-ember-400">
                  {l.file ? <img src={logoSrc(l.file)} alt={l.name} className="max-h-6 w-auto" /> : <span className="font-jakarta text-sm font-semibold text-night-900">{l.name}</span>}
                </a>
              </li>
            ))}
          </ul>
          <ul className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2 font-inter text-sm text-night-100">
            <li className="inline-flex items-center gap-1.5"><OpenAccess className="h-4 w-4 text-ember-300" aria-hidden="true" /> Open access · {journal.licence.name}</li>
            <li className="inline-flex items-center gap-1.5"><Verified className="h-4 w-4 text-ember-300" aria-hidden="true" /> Crossref DOI for every paper</li>
          </ul>
        </div>
      </div>

      {/* 4. Legal */}
      <div className="border-t border-white/10 bg-iris-800">
        <Container className="grid max-w-[1360px] gap-4 py-5 font-inter text-xs text-night-200 md:grid-cols-[1fr_auto] md:items-start lg:px-10">
          <div className="space-y-1.5">
            <p>© {new Date().getFullYear()} {journal.publisher}. Articles are open access under {journal.licence.name}. E-ISSN {journal.issnOnline}. Example DOI: {doiFor(`${journal.paperIdPrefix}2026000078`)}</p>
            <address className="not-italic">{journal.address}</address>
          </div>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <a href={`mailto:${journal.email}`} className="hover:text-white hover:underline">{journal.email}</a>
            <AppLink to={paths.policy('privacy')} className="hover:text-white hover:underline">Privacy</AppLink>
            <AppLink to={paths.editorialLogin} className="hover:text-white hover:underline">Editorial login</AppLink>
          </p>
        </Container>
      </div>
    </footer>
  )
}
