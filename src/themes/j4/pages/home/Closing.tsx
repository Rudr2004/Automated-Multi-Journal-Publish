// Pre-footer banner: a deep-navy card with the TOC-alert subscribe form on the left and the "publish with us" actions on the right.
import { useState, type FormEvent } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import * as validate from '../../../../core/lib/validators'
import { ButtonLink } from '../../components/Button'
import { LibraryBooks, MailUnread, NotifyActive, Publish, UploadFile } from '../../components/refIconsJ4'
import { useToast } from '../../components/Toast'

export function PreFooter({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
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
    <section aria-label="Alerts and submission" className="rounded-[12px] border border-slate-800 bg-gradient-to-r from-[#0b2545] via-[#0f3460] to-[#071527] p-6 text-white shadow-[0_1px_3px_rgba(15,23,42,0.2)] md:p-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="min-w-0 space-y-3 lg:col-span-6 lg:border-r lg:border-slate-700/80 lg:pr-8">
          <h2 className="flex items-center gap-2 font-serif4 text-base font-bold text-white md:text-lg"><MailUnread className="h-5 w-5 text-sky-400" aria-hidden="true" />Subscribe to TOC Alerts</h2>
          <p className="text-xs leading-relaxed text-slate-300">Receive the Table of Contents, special issue invitations and call-for-papers notifications from {journal.shortName} straight to your inbox each {journal.frequency === 'Monthly' ? 'month' : 'issue'}.</p>
          <form onSubmit={submit} noValidate aria-label="Email alerts" className="pt-1">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="j4-home-news" className="sr-only">Email address</label>
              <input id="j4-home-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Enter institutional email..." aria-invalid={!!error} aria-describedby={error ? 'j4-home-news-err' : undefined}
                className="min-w-0 flex-1 rounded border border-slate-600 bg-slate-800/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus-visible:!outline-none" />
              <button type="submit" disabled={busy} className="flex shrink-0 items-center justify-center gap-1.5 rounded bg-cobalt-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cobalt-800 disabled:opacity-60"><NotifyActive className="h-4 w-4" aria-hidden="true" />{busy ? 'Subscribing…' : 'Subscribe Free'}</button>
            </div>
            {error && <p id="j4-home-news-err" role="alert" className="mt-2 text-xs font-medium text-red-300">{error}</p>}
          </form>
          <p className="text-[10px] text-slate-400">No spam. You may unsubscribe at any time.</p>
        </div>
        <div className="min-w-0 space-y-3 lg:col-span-6 lg:pl-4">
          <h2 className="flex items-center gap-2 font-serif4 text-base font-bold text-white md:text-lg"><Publish className="h-5 w-5 text-sky-400" aria-hidden="true" />Ready to Publish Your Research?</h2>
          <p className="text-xs leading-relaxed text-slate-300">Join our growing community of authors and researchers. Benefit from structured peer review, no account to create and permanent Crossref DOIs.</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <ButtonLink to={paths.submit} variant="cta" className="px-5 !text-xs"><UploadFile className="h-4 w-4" aria-hidden="true" /> Submit Paper Online</ButtonLink>
            <ButtonLink to={paths.pastIssues} variant="onDark" className="!border-slate-600 !bg-slate-800 px-4 !text-xs !text-slate-200 hover:!bg-slate-700"><LibraryBooks className="h-4 w-4" aria-hidden="true" /> Browse Archive Catalog</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
