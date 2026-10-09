// Deep-wine footer: the journal lockup and alerts form, link columns (research areas, authors, journal), a compact specification line, and publisher details.
// "Editorial login" is a small link at the very bottom.
import { useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { AppLink } from '../../../core/router'
import { areas } from '../components/areas'
import { Button } from '../components/Button'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { OrnamentRule } from '../components/signature'
import { Send } from '../icons'
import { Logo } from './Header'

const head = 'text-xs font-semibold uppercase tracking-[0.08em] text-ochre-300'
const link = 'text-sm text-bordeaux-200 hover:text-white hover:underline'

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
      <label htmlFor="j5-news" className={head}>New-issue alerts</label>
      <p className="mt-2 text-sm text-bordeaux-200">One short email when each monthly issue is published.</p>
      <div className="mt-3 flex gap-2">
        <input id="j5-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'j5-news-err' : undefined}
          className="min-w-0 flex-1 rounded border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-bordeaux-200 focus:border-ochre-400 focus:outline-none focus:ring-4 focus:ring-ochre-400/20 focus-visible:!outline-none" />
        <Button type="submit" variant="onDarkCta" disabled={busy} aria-label="Subscribe"><Send className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{busy ? 'Subscribing…' : 'Subscribe'}</span></Button>
      </div>
      {error && <p id="j5-news-err" role="alert" className="mt-2 text-xs font-medium text-red-300">{error}</p>}
    </form>
  )
}

export function Footer({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const spec: [string, string][] = [['ISSN (Online)', journal.issnOnline], ['DOI prefix', journal.doiPrefix], ['Licence', journal.licence.name], ['Frequency', journal.frequency]]
  return (
    <footer className="bg-bordeaux-900 text-white">
      <Container className="grid gap-10 pb-10 pt-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1.3fr_1fr_1fr]">
        <div>
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex items-center gap-3">
            <Logo size={56} tile />
            <span className="font-newsreader text-lg font-semibold leading-snug">{journal.name}</span>
          </AppLink>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bordeaux-200">{journal.mission}</p>
        </div>
        <nav aria-label="Research areas">
          <p className={head}>Research areas</p>
          <ul className="mt-4 space-y-2.5">{areas.map((a) => <li key={a.id}><AppLink to={paths.search(a.name)} className={link}>{a.name}</AppLink></li>)}</ul>
        </nav>
        <nav aria-label="For authors">
          <p className={head}>For authors</p>
          <ul className="mt-4 space-y-2.5">
            {[['Submit Manuscript', paths.submit], ['Track My Paper', paths.track], ['Author Guidelines', paths.policy('author-guidelines')], ['APC & Payment', paths.forAuthors('apc-payment')], ['Verify a Certificate', paths.verify()]].map(([l, to]) => <li key={to}><AppLink to={to} className={link}>{l}</AppLink></li>)}
          </ul>
        </nav>
        <nav aria-label="The journal">
          <p className={head}>The journal</p>
          <ul className="mt-4 space-y-2.5">
            {[['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues], ['Editorial Board', paths.editorialBoard], ['Aims & Scope', paths.about('aims-scope')], ['Indexing', paths.about('indexing')], ['Contact', paths.about('contact')]].map(([l, to]) => <li key={to}><AppLink to={to} className={link}>{l}</AppLink></li>)}
          </ul>
        </nav>
      </Container>

      <Container><OrnamentRule tone="dark" /></Container>
      {/* Specification line and alerts */}
      <div className="mt-10 border-t border-white/10 bg-black/20">
        <Container className="grid gap-8 py-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded border border-white/10 bg-white/10 sm:grid-cols-4">
            {spec.map(([k, v]) => (
              <div key={k} className="bg-bordeaux-900 px-4 py-3"><dt className="text-xs text-bordeaux-200">{k}</dt><dd className="mt-0.5 text-sm font-semibold tabular-nums text-white">{v}</dd></div>
            ))}
          </dl>
          <Newsletter onSubscribe={onSubscribe} />
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container className="grid gap-4 py-6 text-xs text-bordeaux-200 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-1.5">
            <p>© {new Date().getFullYear()} {journal.publisher}. Articles are open access under {journal.licence.name}.</p>
            <address className="not-italic">{journal.address}</address>
          </div>
          <p className="flex flex-wrap items-center gap-4 text-sm">
            <a href={`mailto:${journal.email}`} className="hover:text-white hover:underline">{journal.email}</a>
            <AppLink to={paths.policy('privacy')} className="hover:text-white hover:underline">Privacy</AppLink>
            <AppLink to={paths.editorialLogin} className="hover:text-white hover:underline">Editorial login</AppLink>
          </p>
        </Container>
      </div>
    </footer>
  )
}
