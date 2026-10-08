// Light footer: discipline links, authors' links, newsletter and publisher information. "Editorial login" is a small link at the very bottom.
import { useState, type FormEvent } from 'react'
import { journal, doiFor } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { AppLink } from '../../../core/router'
import { Button } from '../components/Button'
import { disciplines } from '../components/discipline'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Send } from '../icons'

const colHead = 'font-display text-sm font-semibold text-graphite-800'
const link = 'text-sm text-graphite-600 hover:text-accent-700 hover:underline'

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
      <p className="mt-1 text-sm text-graphite-600">One short email when each monthly issue is published.</p>
      <div className="mt-3 flex gap-2">
        <input id="j2-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'j2-news-err' : undefined}
          className="min-w-0 flex-1 rounded-soft border border-graphite-300 bg-white px-3 py-2.5 text-sm text-graphite-800 placeholder:text-graphite-500 focus:border-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-700/30" />
        <Button type="submit" variant="primary" disabled={busy} aria-label="Subscribe"><Send className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{busy ? 'Subscribing…' : 'Subscribe'}</span></Button>
      </div>
      {error && <p id="j2-news-err" role="alert" className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </form>
  )
}

export function Footer({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  return (
    <footer className="border-t border-graphite-200 bg-white">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex items-center gap-4">
            <img src="/journals/j2/logo-badge.png" alt={`${journal.shortName} logo`} width={65} height={84} className="h-[84px] w-auto shrink-0" />
            <span className="min-w-0">
              <span className="block font-display text-lg font-semibold leading-snug text-brand-900">{journal.name}</span>
              <span className="mt-1 block text-xs font-medium text-graphite-600">ISSN (Online) {journal.issnOnline}</span>
            </span>
          </AppLink>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-graphite-600">{journal.mission}</p>
          <p className="mt-3 text-xs text-graphite-600">DOI prefix {journal.doiPrefix} · {journal.licence.name}</p>
        </div>
        <nav aria-label="Disciplines">
          <p className={colHead}>Disciplines</p>
          <ul className="mt-3 space-y-2">{disciplines.map((d) => <li key={d.id}><AppLink to={paths.search(d.name)} className={link}>{d.name}</AppLink></li>)}</ul>
        </nav>
        <nav aria-label="For authors">
          <p className={colHead}>For authors</p>
          <ul className="mt-3 space-y-2">
            {[['Submit Manuscript', paths.submit], ['Track My Paper', paths.track], ['Author Guidelines', paths.policy('author-guidelines')], ['APC & Payment', paths.forAuthors('apc-payment')], ['Verify a Certificate', paths.verify()], ['Indexing', paths.about('indexing')], ['Contact', paths.about('contact')]].map(([l, to]) => <li key={to}><AppLink to={to} className={link}>{l}</AppLink></li>)}
          </ul>
        </nav>
        <div className="space-y-8">
          <Newsletter onSubscribe={onSubscribe} />
          <div>
            <p className={colHead}>Publisher</p>
            <address className="mt-2 text-sm not-italic text-graphite-600">{journal.address}</address>
          </div>
        </div>
      </Container>
      <div className="border-t border-graphite-200 bg-graphite-50">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 text-xs text-graphite-600">
          <p>© {new Date().getFullYear()} {journal.publisher}. Articles are open access under {journal.licence.name}. Example DOI: {doiFor(`${journal.paperIdPrefix}2026000045`)}</p>
          <p className="flex items-center gap-4">
            <AppLink to={paths.policy('privacy')} className="hover:text-accent-700 hover:underline">Privacy</AppLink>
            <AppLink to={paths.editorialLogin} className="hover:text-accent-700 hover:underline">Editorial login</AppLink>
          </p>
        </Container>
      </div>
    </footer>
  )
}
