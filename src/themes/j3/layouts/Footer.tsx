// Footer after the Academic Editorial & Press reference: a discipline strip, a brand block with four link columns (Editorial policies, For authors, Discoverability,
// Legal & colophon), the issue-alerts card and the legal line. "Reviewer login" stays a small link at the very bottom.
import { useState, type FormEvent } from 'react'
import { journal, logoSrc, visibleLogos } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { J3_SUBJECTS } from '../../../config/journals/specializations'
import { branchesFor } from '../../../core/lib/branches'
import * as validate from '../../../core/lib/validators'
import { AppLink } from '../../../core/router'
import { onDark } from '../components/primitives'
import { useToast } from '../components/Toast'
import { ArrowUp, Send } from '../icons'

const head = 'font-jakarta text-sm font-bold uppercase tracking-[0.06em] text-white'
const link = 'font-inter text-[13px] text-night-200 transition-colors hover:text-white hover:underline'
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
    <form onSubmit={submit} noValidate aria-label="Email alerts" className="rounded-tile border border-white/15 bg-white/5 p-5">
      <label htmlFor="j3-news" className="font-jakarta text-sm font-bold uppercase tracking-[0.06em] text-white"><span aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-ember-500" />Subscribe to issue alerts</label>
      <p className="mt-1 font-inter text-sm text-night-200">One short message when a monthly issue is published. No spam.</p>
      <div className="mt-3 flex gap-2">
        <input id="j3-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'j3-news-err' : undefined}
          className="min-w-0 flex-1 rounded-tile border border-white/30 bg-white/10 px-4 py-2.5 font-inter text-sm text-white placeholder:text-night-300 focus:border-white focus:outline-none focus:ring-2 focus:ring-ember-400" />
        <button type="submit" disabled={busy} aria-label="Subscribe" className="inline-flex items-center justify-center gap-2 rounded-tile bg-ember-500 px-5 py-2.5 font-jakarta text-xs font-bold text-night-900 transition-colors hover:bg-ember-400 disabled:opacity-60">
          <Send className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{busy ? 'Subscribing…' : 'Subscribe'}</span>
        </button>
      </div>
      {error && <p id="j3-news-err" role="alert" className="mt-2 font-inter text-xs font-semibold text-ember-300">{error}</p>}
    </form>
  )
}

export function Footer({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const logos = visibleLogos()
  const policies: [string, string][] = [
    ['Peer Review Process', paths.policy('peer-review')], ['Publication Ethics', paths.policy('publication-ethics')], ['Plagiarism Policy', paths.policy('plagiarism')],
    ['Open Access Statement', paths.policy('open-access')], ['Copyright & Licensing', paths.policy('copyright-licensing')], ['Digital Archiving', paths.policy('archiving')],
  ]
  const authors: [string, string][] = [
    ['Submit Manuscript', paths.submit], ['Track My Paper', paths.track], ['Author Guidelines', paths.policy('author-guidelines')], ['Submission Process', paths.forAuthors('submission-process')],
    ['APC & Payment', paths.forAuthors('apc-payment')], ['Article Templates', paths.forAuthors('templates')], ['Become a Reviewer', paths.forAuthors('become-a-reviewer')],
  ]
  const discover: [string, string][] = [
    ['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues], ['Editorial Board', paths.editorialBoard], ['Search the Archive', paths.search('')],
    ['Indexing', paths.about('indexing')], ['Verify a Certificate', paths.verify()],
  ]
  const legal: [string, string][] = [['Privacy Notice', paths.policy('privacy')], ['Contact Secretariat', paths.about('contact')], ['About the Journal', paths.about('journal-information')], ['Aims & Scope', paths.about('aims-scope')]]
  const col = (title: string, label: string, rows: [string, string][]) => (
    <nav aria-label={label}>
      <h2 className={head}>{title}</h2>
      <ul className="mt-4 space-y-2.5">{rows.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
    </nav>
  )
  return (
    <footer className={`bg-night-900 text-white ${onDark}`}>
      {/* 1. Disciplines */}
      <div className="border-b border-white/10">
        <nav aria-label="Browse articles by discipline" className={`${wrap} py-8`}>
          <h2 className={`${head} flex items-center gap-2`}><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />Browse articles by discipline</h2>
          <ul className="mt-5 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {J3_SUBJECTS.map((s) => (
              <li key={s}>
                <AppLink to={paths.search(s)} className="font-jakarta text-sm font-bold text-white hover:underline">{s}</AppLink>
                <ul className="mt-2 space-y-1.5">
                  {branchesFor(s).filter((b) => b !== 'Others').slice(0, 7).map((b) => <li key={b}><AppLink to={paths.search(b)} className="font-inter text-[13px] text-night-100 hover:text-white hover:underline">{b}</AppLink></li>)}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 2. Brand block and columns */}
      <div className={`${wrap} grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]`}>
        <div>
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex items-start gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-tile bg-white p-1"><img src="/journals/j3/logo.png" alt={`${journal.shortName} logo`} width={56} height={56} className="max-h-full max-w-full object-contain" /></span>
            <span className="min-w-0">
              <span className="block font-jakarta text-base font-bold leading-snug">{journal.name}</span>
              <span className="mt-0.5 block font-inter text-xs text-night-200">Published by {journal.publisher}</span>
            </span>
          </AppLink>
          <p className="mt-4 font-inter text-[13px] leading-relaxed text-night-200">{journal.mission}</p>
          <dl className="mt-4 space-y-1 font-inter text-xs text-night-200">
            <div><dt className="inline font-semibold text-white">Frequency: </dt><dd className="inline">{journal.frequency}</dd></div>
            <div><dt className="inline font-semibold text-white">E-ISSN: </dt><dd className="inline tabular-nums">{journal.issnOnline}</dd> <span aria-hidden="true">&bull;</span> <dt className="inline font-semibold text-white">DOI prefix: </dt><dd className="inline tabular-nums">{journal.doiPrefix}</dd></div>
            <div><dt className="inline font-semibold text-white">Licence: </dt><dd className="inline">{journal.licence.name} open access</dd></div>
            <div><dt className="inline font-semibold text-white">Email: </dt><dd className="inline"><a href={`mailto:${journal.email}`} className="underline hover:text-white">{journal.email}</a></dd></div>
            <div><dt className="font-semibold text-white">Postal address:</dt><dd><address className="not-italic">{journal.address}</address></dd></div>
          </dl>
        </div>
        {col('Editorial policies', 'Editorial policies', policies)}
        {col('For authors', 'For authors', authors)}
        {col('Discoverability', 'Discoverability', discover)}
        {col('Legal & colophon', 'Legal and colophon', legal)}
      </div>

      {/* 3. Subscribe and identifiers */}
      <div className={`${wrap} grid items-start gap-6 pb-10 lg:grid-cols-[1.4fr_4fr]`}>
        <div aria-hidden="true" className="hidden lg:block" />
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <Newsletter onSubscribe={onSubscribe} />
          {logos.length > 0 && (
            <div className="md:min-w-[16rem]">
              <p className={head}>Identified by</p>
              <ul className="mt-3 flex flex-wrap items-center gap-2">
                {logos.map((l) => (
                  <li key={l.id}>
                    <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="flex h-10 items-center rounded-tile bg-white px-3 hover:ring-2 hover:ring-ember-400">
                      {l.file ? <img src={logoSrc(l.file)} alt={l.name} className="max-h-6 w-auto" /> : <span className="font-jakarta text-sm font-semibold text-night-900">{l.name}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 4. Legal line */}
      <div className="border-t border-white/10">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 font-inter text-xs text-night-200`}>
          <p>&copy; {new Date().getFullYear()} {journal.publisher}. Published under open access {journal.licence.name}.</p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <AppLink to={paths.reviewerLogin} className="hover:text-white hover:underline">Reviewer login</AppLink>
            <a href="#main" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }) }} className="inline-flex items-center gap-1 hover:text-white hover:underline">Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /></a>
          </p>
        </div>
      </div>
    </footer>
  )
}
