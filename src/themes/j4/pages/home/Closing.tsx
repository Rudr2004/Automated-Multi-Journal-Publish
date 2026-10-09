// Closing sections: the editors' note and email-alerts form (SubscribeBand), then the final call to action on a blueprint band (FinalCta).
import { useState, type FormEvent } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import * as validate from '../../../../core/lib/validators'
import { Button, ButtonLink } from '../../components/Button'
import { Container, Label } from '../../components/primitives'
import { useToast } from '../../components/Toast'
import { Send, Submit, Track } from '../../icons'

export function SubscribeBand({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
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
    <section aria-labelledby="home-alerts" className="border-y border-abyss-200 bg-white py-10">
      <Container className="grid items-center gap-6 lg:grid-cols-[1fr_28rem]">
        <div>
          <Label className="text-cobalt-700">Email alerts</Label>
          <h2 id="home-alerts" className="mt-1.5 font-serif4 text-2xl font-semibold tracking-tight text-abyss-900">New-issue alerts from {journal.shortName}</h2>
          <p className="mt-1 text-sm text-steel-600">One short email when each monthly issue is published. Unsubscribe at any time.</p>
        </div>
        <form onSubmit={submit} noValidate aria-label="Email alerts">
          <div className="flex gap-2">
            <label htmlFor="j4-home-news" className="sr-only">Email address</label>
            <input id="j4-home-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@institution.edu" aria-invalid={!!error} aria-describedby={error ? 'j4-home-news-err' : undefined}
              className="h-11 min-w-0 flex-1 rounded-ctl border border-abyss-300 bg-white px-3.5 text-sm text-abyss-900 placeholder:text-steel-500 focus:border-azure-600 focus:outline-none focus:ring-4 focus:ring-azure-600/15 focus-visible:!outline-none" />
            <Button type="submit" disabled={busy} className="h-11"><Send className="h-4 w-4" aria-hidden="true" /> {busy ? 'Subscribing…' : 'Subscribe'}</Button>
          </div>
          {error && <p id="j4-home-news-err" role="alert" className="mt-2 text-xs font-medium text-red-700">{error}</p>}
        </form>
      </Container>
    </section>
  )
}

export function FinalCta() {
  return (
    <section aria-labelledby="home-cta" className="relative isolate overflow-hidden bg-abyss-900 py-14 text-white sm:py-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <img src="/journals/j4/images/cta-circuit.svg" alt="" width={420} height={260} className="pointer-events-none absolute -right-6 top-1/2 -z-10 hidden h-auto w-[26rem] -translate-y-1/2 opacity-80 lg:block" />
      <Container>
        <Label className="text-azure-300">Publish with {journal.shortName}</Label>
        <h2 id="home-cta" className="mt-2 max-w-2xl font-serif4 text-[1.75rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.25rem]">Ready to submit your engineering research?</h2>
        <p className="mt-3 max-w-xl text-base text-abyss-200">No account needed. Upload your manuscript, receive a Paper ID by email, and follow every stage online.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to={paths.submit} variant="cta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          <ButtonLink to={paths.track} variant="onDark"><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</ButtonLink>
        </div>
      </Container>
    </section>
  )
}
