// Footer, as in the reference: a deep-wine academic footer with a table-of-contents alert band (email form, validated), a six-column grid
// (contact, indexing, policies, identifiers, quick navigation) and a legal bar. There is no login link.
import { useState, type FormEvent } from 'react'
import { journal, logoSrc, visibleLogos } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { J5_SUBJECTS } from '../../../config/journals/specializations'
import { branchesFor } from '../../../core/lib/branches'
import * as validate from '../../../core/lib/validators'
import { AppLink } from '../../../core/router'
import { ForwardToInbox } from '../components/homeIconsJ5'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Logo } from './Header'

const head = 'mb-2 font-work text-xs font-bold uppercase tracking-wider text-amber-200'
const link = 'transition hover:text-amber-300 hover:underline'

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
    <form onSubmit={submit} noValidate aria-label="Table of contents alerts" className="w-full md:w-auto">
      <div className="flex w-full items-center gap-2">
        <label htmlFor="j5-news" className="sr-only">Your institutional email address</label>
        <input id="j5-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Your institutional email address..." aria-invalid={!!error} aria-describedby={error ? 'j5-news-err' : undefined}
          className="w-full rounded bg-white px-4 py-2.5 font-work text-xs text-[#141b2b] placeholder:text-obsidian-500 focus:outline-none focus:ring-4 focus:ring-amber-400/40 md:w-72" />
        <button type="submit" disabled={busy} className="shrink-0 rounded bg-amber-400 px-5 py-2.5 font-work text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:bg-amber-300 disabled:opacity-60">{busy ? 'Subscribing…' : 'Subscribe'}</button>
      </div>
      {error && <p id="j5-news-err" role="alert" className="mt-2 text-xs font-medium text-amber-200">{error}</p>}
    </form>
  )
}

export function Footer({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const logos = visibleLogos()
  const policies: [string, string][] = [
    ['Peer Review Process', paths.policy('peer-review')], ['Publication Ethics', paths.policy('publication-ethics')], ['Plagiarism Policy', paths.policy('plagiarism')],
    ['Copyright & CC BY 4.0', paths.policy('copyright-licensing')], ['Refund & Cancellation', paths.policy('refund')], ['Data Policy', paths.policy('data')], ['Privacy Policy', paths.policy('privacy')],
  ]
  const nav: [string, string][] = [
    ['Home Overview', paths.home], ['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues], ['Manuscript Submission', paths.submit],
    ['Track Paper Status', paths.track], ['Editorial Board', paths.editorialBoard], ['Verify a Certificate', paths.verify()], ['Reviewer Login', paths.reviewerLogin],
  ]
  const ids: [string, string][] = [
    ['ISSN', journal.issnOnline], ['Crossref DOI', journal.doiPrefix], ['Frequency', journal.frequency], ['Format', 'Online'],
    ['SJIF Impact Factor', journal.sjifImpactFactor ?? ''], ['License', journal.licence.name],
  ]
  return (
    <footer id="contact-us" className="w-full border-t-4 border-wine-800 bg-[#51020b] pb-10 pt-14 text-white">
      <Container>
        {/* Table of contents dispatch band */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded border border-wine-800 bg-[#6b1e2f] p-6 shadow-md md:flex-row">
          <div className="max-w-xl">
            <div className="mb-1 flex items-center gap-2 font-work text-xs uppercase tracking-wider text-amber-300"><ForwardToInbox className="h-[18px] w-[18px]" aria-hidden="true" /><span>Table of Contents (TOC) Dispatch Service</span></div>
            <h2 className="font-newsreader text-xl font-semibold text-white">Subscribe to Monthly Table of Contents Alerts</h2>
            <p className="mt-1 font-work text-xs text-[#e1e8fd]">Receive an email whenever a new monthly issue of {journal.shortName} is published online.</p>
          </div>
          <Newsletter onSubscribe={onSubscribe} />
        </div>

        {/* Browse by subject: each subject area with its first specializations (from the submission sheet) */}
        <nav aria-label="Browse articles by discipline" className="mb-12 border-b border-wine-800/80 pb-10">
          <h3 className={head}>Browse articles by discipline</h3>
          <ul className="mt-3 grid gap-x-8 gap-y-8 font-work text-xs sm:grid-cols-2 lg:grid-cols-4">
            {J5_SUBJECTS.map((sub) => (
              <li key={sub}>
                <AppLink to={paths.search(sub)} className="text-sm font-bold text-white hover:underline">{sub}</AppLink>
                <ul className="mt-2 space-y-1.5 text-[#e1e8fd]">
                  {branchesFor(sub).filter((b) => !b.startsWith('Other')).slice(0, 7).map((b) => <li key={b}><AppLink to={paths.search(b)} className={link}>{b}</AppLink></li>)}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mb-12 grid grid-cols-1 gap-8 font-work text-xs md:grid-cols-2 lg:grid-cols-7">
          <div className="space-y-3 lg:col-span-2">
            <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex items-center gap-2">
              <Logo size={32} tile className="h-8 w-8" />
              <span className="font-work text-sm font-bold uppercase tracking-wider text-amber-200">{journal.shortName} Journal</span>
            </AppLink>
            <p className="leading-relaxed text-[#e1e8fd]"><strong>{journal.name}</strong><br />{journal.address.replace(`${journal.publisher}, `, '')}</p>
            <div className="space-y-1 text-[#f4f5fc]">
              <p><strong>Official Email:</strong> <a className="text-amber-200 hover:underline" href={`mailto:${journal.email}`}>{journal.email}</a></p>
              <p><strong>Official Portal:</strong> <span className="text-amber-200">https://{journal.domain}</span></p>
            </div>
          </div>
          <nav aria-label="Indexing and databases" className="space-y-2 lg:col-span-2">
            <h3 className={head}>Indexing &amp; Databases</h3>
            <ul className="grid grid-cols-3 gap-1.5">
              {logos.map((l) => (
                <li key={l.id}><a href={l.verifyUrl} target="_blank" rel="noreferrer" title={`${l.status}. Verify on ${l.name}`} className="flex h-8 items-center justify-center rounded bg-white px-1.5 hover:ring-2 hover:ring-amber-300">
                  {l.file ? <img src={logoSrc(l.file)} alt={l.name} loading="lazy" className="max-h-5 w-auto max-w-full object-contain" /> : <span className="text-[11px] font-bold text-obsidian-800">{l.name}</span>}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a></li>
              ))}
            </ul>
            <p className="pt-1"><AppLink to={paths.about('indexing')} className={link}>All indexing details</AppLink></p>
          </nav>
          <nav aria-label="Journal policies" className="space-y-2">
            <h3 className={head}>Journal Policies</h3>
            <ul className="space-y-1.5 text-[#e1e8fd]">{policies.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
          </nav>
          <div className="space-y-2">
            <h3 className={head}>Identifiers</h3>
            <ul className="space-y-1.5 text-[#e1e8fd]">{ids.map(([k, v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}</ul>
          </div>
          <nav aria-label="Quick navigation" className="space-y-2">
            <h3 className={head}>Quick Navigation</h3>
            <ul className="space-y-1.5 text-[#e1e8fd]">{nav.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-wine-800/80 pt-8 text-center font-work text-xs text-[#e1e8fd] md:flex-row md:text-left">
          <p>{journal.shortName} is a peer-reviewed, open access journal. Articles are published under the <strong>Creative Commons Attribution 4.0 International License ({journal.licence.name})</strong>.</p>
          <p className="font-medium text-[#e1e8fd]">© {new Date().getFullYear()} {journal.name} ({journal.shortName}).</p>
        </div>
      </Container>
    </footer>
  )
}
