// Deep-navy academic footer: About (lockup, mission, ISSN and licence), Quick Links, Policies & Ethics and the Editorial Office, then a legal strip.
// The email-alert form sits above the columns on every page except home (home carries it in its pre-footer banner). "Editorial login" is a small link at the bottom.
import { useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { AppLink, useRouter } from '../../../core/router'
import { Button } from '../components/Button'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Send } from '../icons'
import { Verified } from '../components/refIconsJ4'
import { Logo } from './Header'

const head = 'font-serif4 text-sm font-bold text-white'
const link = 'transition-colors hover:text-white'

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
      <label htmlFor="j4-news" className="text-xs font-semibold uppercase tracking-[0.08em] text-azure-300">New-issue alerts</label>
      <p className="mt-2 text-sm text-abyss-300">One short email when each monthly issue is published.</p>
      <div className="mt-3 flex gap-2">
        <input id="j4-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'j4-news-err' : undefined}
          className="min-w-0 flex-1 rounded border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-abyss-400 focus:border-azure-400 focus:outline-none focus:ring-4 focus:ring-azure-400/20 focus-visible:!outline-none" />
        <Button type="submit" variant="cta" disabled={busy} aria-label="Subscribe"><Send className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{busy ? 'Subscribing…' : 'Subscribe'}</span></Button>
      </div>
      {error && <p id="j4-news-err" role="alert" className="mt-2 text-xs font-medium text-red-300">{error}</p>}
    </form>
  )
}

export function Footer({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const { pathname } = useRouter()
  const onHome = pathname === paths.home || pathname === `${paths.home}/`
  const quick: [string, string][] = [['Journal Details', paths.about('journal-information')], ['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues], ['Aims and Scope', paths.about('aims-scope')], ['Editorial Board', paths.editorialBoard],
    ['Author Guidelines', paths.policy('author-guidelines')], ['Manuscript Template', paths.forAuthors('templates')], ['Article Processing Charges', paths.forAuthors('apc-payment')], ['Track My Paper', paths.track], ['Verify a Certificate', paths.verify()]]
  const policies: [string, string][] = [['Peer Review Policy', paths.policy('peer-review')], ['Publication Ethics', paths.policy('publication-ethics')], ['Plagiarism Policy', paths.policy('plagiarism')], ['Open Access Policy', paths.policy('open-access')],
    ['Copyright & Licensing', paths.policy('copyright-licensing')], ['Archiving & Preservation', paths.policy('archiving')], ['Indexing', paths.about('indexing')]]
  return (
    <footer className="mt-12 w-full border-t border-slate-800 bg-[#0b2545] text-slate-300">
      {!onHome && (
        <div className="border-b border-slate-700/60 bg-[#071527]/60">
          <Container className="grid gap-8 py-8 lg:grid-cols-[1fr_24rem] lg:items-start">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-pane border border-white/10 bg-white/10 sm:grid-cols-4">
              {([['ISSN (Online)', journal.issnOnline], ['DOI prefix', journal.doiPrefix], ['Licence', journal.licence.name], ['Frequency', journal.frequency]] as [string, string][]).map(([k, v]) => (
                <div key={k} className="bg-[#0b2545] px-4 py-3"><dt className="text-xs text-slate-300">{k}</dt><dd className="mt-0.5 text-sm font-semibold tabular-nums text-white">{v}</dd></div>
              ))}
            </dl>
            <Newsletter onSubscribe={onSubscribe} />
          </Container>
        </div>
      )}
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 border-b border-slate-700/60 pb-8 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex items-center gap-2 text-white">
              <Logo size={32} tile />
              <span className="font-serif4 text-base font-bold">{journal.shortName}</span>
            </AppLink>
            <p className="leading-relaxed text-slate-400">{journal.name} is dedicated to the rigorous scholarly dissemination of original, peer-reviewed engineering research and engineering management scholarship.</p>
            <div className="space-y-0.5 font-mono text-slate-400">
              <div className="text-amber-300">ISSN: {journal.issnOnline} (Online)</div>
              <div className="text-sky-300">Licensed under {journal.licence.name} International</div>
            </div>
          </div>
          <nav aria-label="Quick links" className="space-y-3">
            <h2 className={head}>Quick Links</h2>
            <ul className="space-y-1.5 text-slate-400">{quick.map(([l, to]) => <li key={to + l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
          </nav>
          <nav aria-label="Policies and ethics" className="space-y-3">
            <h2 className={head}>Policies &amp; Ethics</h2>
            <ul className="space-y-1.5 text-slate-400">{policies.map(([l, to]) => <li key={to}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
          </nav>
          <div className="space-y-3">
            <h2 className={head}>Editorial Office</h2>
            <address className="leading-relaxed text-slate-400 not-italic">
              <strong className="font-semibold">{journal.name}</strong><br />
              {journal.address}<br />
              E-mail: <a href={`mailto:${journal.email}`} className="text-sky-400 hover:underline">{journal.email}</a><br />
              Web: <span className="text-sky-400">https://{journal.domain}/</span>
            </address>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-sky-300"><Verified className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />Crossref DOI on every article</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {journal.name} ({journal.shortName}). All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <AppLink to={paths.policy('privacy')} className="hover:text-white">Privacy Policy</AppLink>
            <span aria-hidden="true">•</span>
            <AppLink to={paths.about('contact')} className="hover:text-white">Contact</AppLink>
            <span aria-hidden="true">•</span>
            <AppLink to={paths.editorialLogin} className="hover:text-white">Editorial login</AppLink>
          </p>
        </div>
      </Container>
    </footer>
  )
}
