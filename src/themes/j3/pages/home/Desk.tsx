// Full-width bands of the home page after the reference: the dark Author's desk (submit calls to action plus a Track form that opens the track page),
// the indexing directories and academic resources, the editorial and reviewer appointment calls, and the purple closing call to action.
import { useState, type FormEvent } from 'react'
import { journal, logoSrc, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import * as validate from '../../../../core/lib/validators'
import { AppLink, useRouter } from '../../../../core/router'
import { onDark } from '../../components/primitives'
import { FactCheck, OpenInNew, Submit, Track } from '../../icons'
import { btnOrange, linkCls, panel, SquareHead, wrapCls } from './bits'

function TrackForm() {
  const { navigate } = useRouter()
  const [id, setId] = useState('')
  const [email, setEmail] = useState('')
  const [errs, setErrs] = useState<{ id?: string; email?: string }>({})
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { id: validate.paperId(id) || undefined, email: validate.email(email) || undefined }
    setErrs(next)
    if (next.id || next.email) return
    navigate(`${paths.track}?id=${id.trim().toUpperCase()}&email=${encodeURIComponent(email.trim().toLowerCase())}`)
  }
  const field = 'mt-1.5 w-full rounded-tile border border-white/30 bg-white/10 px-3 py-2.5 font-inter text-sm text-white placeholder:text-iris-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-ember-400'
  return (
    <form onSubmit={submit} noValidate aria-labelledby="desk-track" className="rounded-tile border border-white/20 bg-white/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="desk-track" className="flex items-center gap-2 font-jakarta text-[13px] font-bold uppercase tracking-[0.06em] text-white"><Track className="h-5 w-5 text-ember-400" aria-hidden="true" />Track submission status</h3>
        <span className="font-mono text-[11px] text-ember-200">Live manuscript portal</span>
      </div>
      <p className="mt-3 font-inter text-[13px] leading-relaxed text-iris-100">Check the live workflow station of your paper (editorial triage, review, revision, proofing).</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="desk-pid" className="font-jakarta text-xs font-semibold text-white">Paper ID</label>
          <input id="desk-pid" value={id} onChange={(e) => setId(e.target.value)} placeholder={`e.g. ${journal.paperIdPrefix}2026000123`} autoComplete="off" aria-invalid={!!errs.id} aria-describedby={errs.id ? 'desk-pid-err' : undefined} className={field} />
          {errs.id && <p id="desk-pid-err" role="alert" className="mt-1 font-inter text-xs font-semibold text-ember-200">{errs.id}</p>}
        </div>
        <div>
          <label htmlFor="desk-mail" className="font-jakarta text-xs font-semibold text-white">Corresponding author email</label>
          <input id="desk-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="author@institution.edu" autoComplete="email" aria-invalid={!!errs.email} aria-describedby={errs.email ? 'desk-mail-err' : undefined} className={field} />
          {errs.email && <p id="desk-mail-err" role="alert" className="mt-1 font-inter text-xs font-semibold text-ember-200">{errs.email}</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <AppLink to={paths.policy('copyright-licensing')} className="inline-flex items-center gap-2 font-inter text-[13px] text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"><FactCheck className="h-4 w-4 text-ember-400" aria-hidden="true" />Copyright &amp; licence terms</AppLink>
        <button type="submit" className="rounded-tile bg-iris-700 px-5 py-2.5 font-jakarta text-[13px] font-semibold text-white transition-colors hover:bg-iris-600 focus-visible:outline-white">Track Paper</button>
      </div>
    </form>
  )
}

export function AuthorsDesk() {
  return (
    <section aria-labelledby="home-desk" className={`mt-16 bg-night-900 text-white ${onDark}`}>
      <div className={`${wrapCls} grid gap-10 py-12 lg:grid-cols-2 lg:gap-12`}>
        <div>
          <p className="flex items-center gap-2.5 font-jakarta text-[12px] font-bold uppercase tracking-[0.08em]"><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />Author&rsquo;s desk</p>
          <h2 id="home-desk" className="mt-4 font-jakarta text-[2rem] font-bold leading-[1.15] tracking-[-0.01em] sm:text-[2.25rem]">Submit your scholarly investigation for peer review</h2>
          <p className="mt-4 max-w-xl font-inter text-base leading-relaxed text-iris-100">{journal.shortName} welcomes original research, reviews and short communications on design, the arts, media, culture and development. Every accepted paper receives an open access licence and a permanent Crossref DOI.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AppLink to={paths.submit} className={btnOrange}><Submit className="h-4 w-4" aria-hidden="true" />Submit Manuscript Online</AppLink>
            <AppLink to={paths.forAuthors('submission-process')} className="inline-flex items-center justify-center rounded-tile border border-white/40 px-4 py-2.5 font-jakarta text-[13px] font-semibold text-white transition-colors hover:bg-white/10">Submission process</AppLink>
          </div>
        </div>
        <TrackForm />
      </div>
    </section>
  )
}

export function Directories() {
  const logos = visibleLogos()
  const guides: [string, string, string, string][] = [
    ['Author guidelines', 'Article types, formatting and the declarations every submission needs.', 'Guidelines', paths.policy('author-guidelines')],
    ['Peer review', 'How editors and reviewers assess papers, and what authors can expect.', 'Peer review', paths.policy('peer-review')],
    ['Publication ethics', 'Standards for authors, reviewers and editors, including similarity checks.', 'Ethics', paths.policy('publication-ethics')],
  ]
  return (
    <section aria-label="Indexing and academic resources" className={`${wrapCls} mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12`}>
      <div>
        <SquareHead title="Verified indexing directories & archival depositories" />
        <p className="font-inter text-sm leading-relaxed text-night-700">The articles published in {journal.shortName} are systematically indexed, deposited and persistently discoverable across major global bibliographic services:</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {logos.map((l) => (
            <li key={l.id} className="flex flex-col rounded-tile border border-j3paper-rule bg-j3paper-cool p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  {l.file && <img src={logoSrc(l.file)} alt="" loading="lazy" className="h-5 w-auto max-w-[3.25rem] shrink-0 object-contain" />}
                  <span className="truncate font-jakarta text-[13px] font-bold text-night-900">{l.name}</span>
                </span>
                <span className="shrink-0 rounded-tile bg-j3valid-100 px-1.5 py-0.5 font-jakarta text-[9px] font-bold uppercase text-j3valid-800">{l.status}</span>
              </div>
              <p className="mt-1.5 flex-1 font-inter text-[11px] leading-snug text-mauve-600">{l.description}</p>
              <a href={l.verifyUrl} target="_blank" rel="noreferrer" className={`${linkCls} mt-2 inline-flex items-center gap-1 text-[11px] font-semibold`}>Verify Link <OpenInNew className="h-3 w-3" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <SquareHead title="Academic resources & research guides" />
        <ul className="grid gap-3">
          {guides.map(([t, d, tag, to]) => (
            <li key={t} className={`${panel} p-4`}>
              <span className="rounded-tile bg-j3paper-deep px-2 py-0.5 font-jakarta text-[10px] font-bold uppercase tracking-[0.06em] text-iris-800">{tag}</span>
              <h3 className="mt-2 font-jakarta text-[15px] font-semibold text-night-900">{t}</h3>
              <p className="mt-1 font-inter text-xs leading-relaxed text-mauve-600">{d}</p>
              <AppLink to={to} className={`${linkCls} mt-3 inline-block text-xs`}>Read more &rarr;</AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Appointments() {
  const cards: [string, string, string, string, string][] = [
    ['Academic appointment call', 'Call for editorial board members & associate editors', `${journal.shortName} is expanding its editorial board across design, the arts, media, heritage and development studies. Candidates should hold an earned doctorate or equivalent standing and an active publication record.`, 'Meet the editorial board', paths.editorialBoard],
    ['Peer scrutiny council', 'Register as a peer review member', 'Reviewers keep the journal fair. Apply to review for the journal and receive a certificate that anyone can verify with its QR code.', 'Apply to become a reviewer', paths.forAuthors('become-a-reviewer')],
  ]
  return (
    <section aria-label="Appointments" className={`${wrapCls} mt-14`}>
      <div className={`${panel} grid divide-y divide-j3paper-rule md:grid-cols-2 md:divide-x md:divide-y-0`}>
        {cards.map(([k, t, d, cta, to]) => (
          <div key={t} className="p-6 sm:p-8">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.08em] text-iris-700">{k}</p>
            <h3 className="mt-3 font-jakarta text-xl font-semibold leading-snug text-night-900">{t}</h3>
            <p className="mt-3 font-inter text-[13px] leading-relaxed text-night-700">{d}</p>
            <AppLink to={to} className={`${linkCls} mt-4 inline-block`}>{cta} &rarr;</AppLink>
          </div>
        ))}
      </div>
    </section>
  )
}

export function SubmitBand() {
  return (
    <section aria-labelledby="home-ready" className={`mt-14 bg-iris-700 text-white ${onDark}`}>
      <div className={`${wrapCls} flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-9`}>
        <div className="min-w-0">
          <h2 id="home-ready" className="font-jakarta text-[1.75rem] font-bold leading-tight tracking-[-0.01em] sm:text-[2rem]">Ready to submit your research to {journal.shortName}?</h2>
          <p className="mt-2 font-inter text-sm text-iris-100">Benefit from thorough peer review, open access dissemination under {journal.licence.name} and permanent archiving.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AppLink to={paths.policy('author-guidelines')} className="inline-flex items-center justify-center rounded-tile border border-white/60 px-5 py-2.5 font-jakarta text-[13px] font-semibold text-white transition-colors hover:bg-white/10">View Author Guidelines</AppLink>
          <AppLink to={paths.submit} className="inline-flex items-center justify-center gap-2 rounded-tile bg-white px-5 py-2.5 font-jakarta text-[13px] font-semibold text-iris-800 transition-colors hover:bg-j3paper-deep"><Submit className="h-4 w-4" aria-hidden="true" />Submit Manuscript Online</AppLink>
        </div>
      </div>
    </section>
  )
}
