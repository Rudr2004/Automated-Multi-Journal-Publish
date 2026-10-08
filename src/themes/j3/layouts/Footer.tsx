// Dark footer in four parts: the journal lockup with the new-issue alerts form, the link columns, an "identified by" strip, and the legal line.
// "Editorial login" is a small link at the very bottom.
import { useState, type FormEvent } from 'react'
import { doiFor, journal, logoSrc, visibleLogos } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { AppLink } from '../../../core/router'
import { Button } from '../components/Button'
import { Container } from '../components/primitives'
import { themes } from '../components/themes'
import { useToast } from '../components/Toast'
import { OpenAccess, Send, Verified } from '../icons'

const head = 'font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-ember-400'
const link = 'text-sm text-night-100 hover:text-white hover:underline'

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
      <label htmlFor="j3-news" className="font-jakarta text-base font-bold text-white">Get each new issue by email</label>
      <p className="mt-1 text-sm text-night-200">One short message when a monthly issue is published. No spam.</p>
      <div className="mt-3 flex gap-2">
        <input id="j3-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'j3-news-err' : undefined}
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white placeholder:text-night-300 focus:border-ember-400 focus:outline-none focus:ring-4 focus:ring-ember-400/20 focus-visible:!outline-none" />
        <Button type="submit" variant="cta" disabled={busy} aria-label="Subscribe" className="py-2.5"><Send className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{busy ? 'Subscribing…' : 'Subscribe'}</span></Button>
      </div>
      {error && <p id="j3-news-err" role="alert" className="mt-2 text-xs font-semibold text-ember-300">{error}</p>}
    </form>
  )
}

export function Footer({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const logos = visibleLogos()
  const columns: { title: string; links: [string, string][] }[] = [
    { title: 'Read', links: [['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues], ['Editorial Board', paths.editorialBoard], ['Search the archive', paths.search('')]] },
    { title: 'For authors', links: [['Submit Manuscript', paths.submit], ['Track My Paper', paths.track], ['Author Guidelines', paths.policy('author-guidelines')], ['APC & Payment', paths.forAuthors('apc-payment')], ['Verify a Certificate', paths.verify()]] },
    { title: 'The journal', links: [['Aims & Scope', paths.about('aims-scope')], ['Peer Review', paths.policy('peer-review')], ['Publication Ethics', paths.policy('publication-ethics')], ['Indexing', paths.about('indexing')], ['Contact', paths.about('contact')]] },
  ]
  return (
    <footer className="bg-night-900 text-white">
      {/* 1. Lockup and alerts */}
      <Container className="grid items-center gap-8 pb-10 pt-14 lg:grid-cols-[1fr_auto] lg:gap-12">
        <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex items-center gap-4">
          <img src="/journals/j3/logo.png" alt={`${journal.shortName} logo`} width={72} height={72} className="h-[72px] w-[72px] shrink-0" />
          <span className="min-w-0">
            <span className="block font-jakarta text-xl font-extrabold leading-snug tracking-tight">{journal.name}</span>
            <span className="mt-1 block text-sm text-night-200">ISSN (Online) {journal.issnOnline} · DOI prefix {journal.doiPrefix} · Monthly</span>
          </span>
        </AppLink>
        <Newsletter onSubscribe={onSubscribe} />
      </Container>

      {/* 2. Links */}
      <div className="border-t border-white/10">
        <Container className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.1fr]">
          <p className="max-w-xs text-sm leading-relaxed text-night-200 sm:col-span-2 lg:col-span-1">{journal.mission}</p>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className={head}>{c.title}</p>
              <ul className="mt-4 space-y-2.5">{c.links.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
            </nav>
          ))}
          <nav aria-label="Collections">
            <p className={head}>Collections</p>
            <ul className="mt-4 space-y-2.5">{themes.slice(0, 5).map((t) => <li key={t.id}><AppLink to={paths.search(t.name)} className={link}>{t.name}</AppLink></li>)}
              <li><AppLink to={paths.currentIssue} className="text-sm font-semibold text-ember-400 hover:underline">All {themes.length} collections →</AppLink></li></ul>
          </nav>
        </Container>
      </div>

      {/* 3. Identified by */}
      <div className="border-t border-white/10 bg-night-800/60">
        <Container className="flex flex-wrap items-center gap-x-8 gap-y-4 py-6">
          <p className="font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-night-200">Identified by</p>
          <ul className="flex flex-wrap items-center gap-3">
            {logos.map((l) => (
              <li key={l.id}>
                <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="flex h-10 items-center rounded-full bg-white px-4 hover:ring-2 hover:ring-ember-400">
                  {l.file ? <img src={logoSrc(l.file)} alt={l.name} className="max-h-6 w-auto" /> : <span className="font-jakarta text-sm font-extrabold text-night-900">{l.name}</span>}
                </a>
              </li>
            ))}
          </ul>
          <ul className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-night-100">
            <li className="inline-flex items-center gap-1.5"><OpenAccess className="h-4 w-4 text-ember-400" aria-hidden="true" /> Open access · {journal.licence.name}</li>
            <li className="inline-flex items-center gap-1.5"><Verified className="h-4 w-4 text-ember-400" aria-hidden="true" /> Crossref DOI for every paper</li>
          </ul>
        </Container>
      </div>

      {/* 4. Legal */}
      <div className="border-t border-white/10">
        <Container className="grid gap-6 py-6 text-xs text-night-300 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-1.5">
            <p>© {new Date().getFullYear()} {journal.publisher}. Articles are open access under {journal.licence.name}. Example DOI: {doiFor(`${journal.paperIdPrefix}2026000078`)}</p>
            <address className="not-italic">{journal.address}</address>
          </div>
          <p className="flex items-center gap-4 text-sm">
            <a href={`mailto:${journal.email}`} className="hover:text-white hover:underline">{journal.email}</a>
            <AppLink to={paths.policy('privacy')} className="hover:text-white hover:underline">Privacy</AppLink>
            <AppLink to={paths.editorialLogin} className="hover:text-white hover:underline">Editorial login</AppLink>
          </p>
        </Container>
      </div>
    </footer>
  )
}
