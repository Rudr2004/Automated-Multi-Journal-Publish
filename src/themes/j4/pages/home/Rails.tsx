// Home sidebars. Left: call for papers with countdown, notices, policy shortcuts. Right: track-paper quick form, downloads, indexing verifier, author rights.
// Both are sticky rails, so they stay in view beside the long article column.
import type { ComponentType, ReactNode } from 'react'
import { journal, logoSrc, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { CallForPapers } from '../../../../core/types'
import { ButtonLink } from '../../components/Button'
import { CountdownJ4 } from '../../components/CountdownJ4'
import { Bell, Description, EventNote, FolderZip, OpenInNew, QrCode, Rights } from '../../components/homeIconsJ4'
import { StickyRailJ4 } from '../../components/StickyRailJ4'
import { TrackQuickFormJ4 } from '../../components/TrackQuickFormJ4'
import { Label } from '../../components/primitives'
import { ArrowRight, Book, FactCheck, Shield, Submit, Track, type IconProps } from '../../icons'

const card = 'rounded-pane border border-abyss-200 bg-white shadow-hair'

function Card({ title, icon: Icon, id, children, aside }: { title: string; icon?: ComponentType<IconProps>; id: string; children: ReactNode; aside?: string }) {
  return (
    <section aria-labelledby={id} className={card}>
      <h2 id={id} className="flex items-center gap-2 border-b border-abyss-200 bg-abyss-50 px-4 py-2.5 font-serif4 text-base font-semibold text-abyss-900">
        {Icon && <Icon className="h-5 w-5 text-cobalt-700" aria-hidden="true" />}{title}
        {aside && <span className="ml-auto text-xs font-semibold text-steel-600">{aside}</span>}
      </h2>
      <div className="p-4">{children}</div>
    </section>
  )
}

function CallCard({ cfp }: { cfp: CallForPapers }) {
  const [issueName] = cfp.issueName.split(' — ')
  return (
    <section aria-labelledby="j4-cfp" className="relative isolate overflow-hidden rounded-pane bg-abyss-900 p-4 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom_left,black,transparent_80%)]" />
      <Label className="text-azure-300">Call for papers</Label>
      <h2 id="j4-cfp" className="mt-1.5 font-serif4 text-xl font-semibold leading-tight">Submit to {issueName}</h2>
      <p className="mt-1 text-[13px] text-abyss-200">Submission window closes {formatDate(cfp.deadline.slice(0, 10))}</p>
      <div className="mt-3"><CountdownJ4 deadline={cfp.deadline} /></div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-ctl border border-white/15 bg-white/5 p-2"><dt className="text-abyss-300">First decision</dt><dd className="mt-0.5 font-semibold tabular-nums">~{cfp.avgReviewDays} days</dd></div>
        <div className="rounded-ctl border border-white/15 bg-white/5 p-2"><dt className="text-abyss-300">Publication</dt><dd className="mt-0.5 font-semibold tabular-nums">{formatDate(cfp.expectedPublication)}</dd></div>
      </dl>
      <ButtonLink to={paths.submit} variant="cta" className="mt-3 w-full"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
      <ButtonLink to={paths.track} variant="onDark" className="mt-2 w-full"><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</ButtonLink>
    </section>
  )
}

const POLICIES: [string, string, ComponentType<IconProps>][] = [
  ['Peer review process', paths.policy('peer-review'), Shield], ['Publication ethics', paths.policy('publication-ethics'), FactCheck],
  ['Plagiarism policy', paths.policy('plagiarism'), FactCheck], ['Verify a certificate', paths.verify(), QrCode],
]

export function LeftRail({ cfp, notices }: { cfp: CallForPapers; notices: { date: string; text: string }[] }) {
  return (
    <StickyRailJ4 label="Call for papers and notices" className="space-y-4">
      <CallCard cfp={cfp} />
      {notices.length > 0 && (
        <Card id="j4-notices" title="Notices" icon={Bell}>
          <ul className="divide-y divide-abyss-100">
            {notices.slice(0, 3).map((n) => (
              <li key={n.date} className="py-2.5 first:pt-0 last:pb-0">
                <p className="text-xs font-semibold tabular-nums text-cobalt-700">{formatDate(n.date)}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-steel-700">{n.text}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card id="j4-policies" title="Policies" icon={Shield}>
        <ul className="-my-1 divide-y divide-abyss-100 text-sm">
          {POLICIES.map(([label, to, Icon]) => (
            <li key={label}><AppLink to={to} className="flex items-center justify-between gap-2 py-2.5 font-medium text-abyss-900 hover:text-cobalt-700">{label}<Icon className="h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" /></AppLink></li>
          ))}
        </ul>
      </Card>
    </StickyRailJ4>
  )
}

const DOWNLOADS: [string, string, string, ComponentType<IconProps>][] = [
  ['Manuscript template', 'Word and LaTeX', paths.forAuthors('templates'), Description],
  ['Author guidelines', 'Format and ethics checklist', paths.policy('author-guidelines'), Book],
  ['APC and payment', 'Charges, GST and receipts', paths.forAuthors('apc-payment'), FolderZip],
]

export function RightRail() {
  const logos = visibleLogos()
  return (
    <StickyRailJ4 label="Author tools" className="space-y-4">
      <Card id="j4-track" title="Track My Paper" icon={Track} aside="No login">
        <TrackQuickFormJ4 />
      </Card>
      <Card id="j4-downloads" title="Author downloads" icon={Description}>
        <ul className="space-y-2">
          {DOWNLOADS.map(([title, note, to, Icon]) => (
            <li key={title}>
              <AppLink to={to} className="flex items-center gap-3 rounded-ctl border border-abyss-200 p-2.5 hover:border-cobalt-700 hover:bg-azure-50">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-ctl bg-azure-100 text-cobalt-700"><Icon className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-abyss-900">{title}</span><span className="block text-xs text-steel-600">{note}</span></span>
                <ArrowRight className="h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" />
              </AppLink>
            </li>
          ))}
        </ul>
      </Card>
      {logos.length > 0 && (
        <Card id="j4-index" title="Indexing verifier" icon={EventNote} aside={`${logos.length} active`}>
          <ul className="space-y-2">
            {logos.map((l) => (
              <li key={l.id}>
                <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-ctl border border-abyss-200 px-3 py-2 hover:border-cobalt-700">
                  <span className="flex h-7 w-10 shrink-0 items-center justify-center">{l.file ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" /> : <span className="text-[10px] font-bold text-abyss-900">{l.name.slice(0, 5)}</span>}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-abyss-900">{l.name}</span><span className="block text-xs text-steel-600">{l.status}</span></span>
                  <OpenInNew className="h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card id="j4-rights" title="Author rights" icon={Rights}>
        <p className="text-[13px] leading-relaxed text-steel-700">Authors keep their copyright. Every article is published under {journal.licence.name}. Accepted authors sign the copyright form online with an email OTP, from the tracking page.</p>
        <AppLink to={paths.policy('copyright-licensing')} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cobalt-700 hover:underline">Read the licensing policy <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
      </Card>
    </StickyRailJ4>
  )
}
