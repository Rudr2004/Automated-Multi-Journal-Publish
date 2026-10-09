// Home sidebars. Left: call for papers with countdown, notices, policy shortcuts. Right: track-paper quick form, downloads, indexing verifier, author rights.
// Both are sticky rails, so they stay in view beside the long article column.
import type { ComponentType, ReactNode } from 'react'
import { journal, logoSrc, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { CallForPapers } from '../../../../core/types'
import { ButtonLink } from '../../components/Button'
import { CountdownJ5 } from '../../components/CountdownJ5'
import { Bell, Description, EventNote, FolderZip, OpenInNew, QrCode, Rights } from '../../components/homeIconsJ5'
import { StickyRailJ5 } from '../../components/StickyRailJ5'
import { TrackQuickFormJ5 } from '../../components/TrackQuickFormJ5'
import { Label, RuledMotif } from '../../components/primitives'
import { ArrowRight, Book, FactCheck, Shield, Submit, Track, type IconProps } from '../../icons'

const card = 'rounded border border-obsidian-200 bg-white'

function Card({ title, icon: Icon, id, children, aside }: { title: string; icon?: ComponentType<IconProps>; id: string; children: ReactNode; aside?: string }) {
  return (
    <section aria-labelledby={id} className={card}>
      <h2 id={id} className="flex items-center gap-2 border-b border-obsidian-200 bg-[#FBF8F4] px-4 py-2.5 font-newsreader text-base font-semibold text-obsidian-900">
        {Icon && <Icon className="h-5 w-5 text-wine-800" aria-hidden="true" />}{title}
        {aside && <span className="ml-auto text-xs font-semibold text-obsidian-600">{aside}</span>}
      </h2>
      <div className="p-4">{children}</div>
    </section>
  )
}

function CallCard({ cfp }: { cfp: CallForPapers }) {
  const [issueName] = cfp.issueName.split(' — ')
  return (
    <section aria-labelledby="j5-cfp" className="relative isolate overflow-hidden rounded bg-bordeaux-900 p-4 text-white">
      <RuledMotif orbits={false} />
      <Label className="text-ochre-300">Call for papers</Label>
      <h2 id="j5-cfp" className="mt-1.5 font-newsreader text-xl font-semibold leading-tight">Submit to {issueName}</h2>
      <p className="mt-1 text-[13px] text-bordeaux-100">Submission window closes {formatDate(cfp.deadline.slice(0, 10))}</p>
      <div className="mt-3"><CountdownJ5 deadline={cfp.deadline} /></div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded border border-white/15 bg-white/5 p-2"><dt className="text-bordeaux-200">First decision</dt><dd className="mt-0.5 font-semibold tabular-nums">~{cfp.avgReviewDays} days</dd></div>
        <div className="rounded border border-white/15 bg-white/5 p-2"><dt className="text-bordeaux-200">Publication</dt><dd className="mt-0.5 font-semibold tabular-nums">{formatDate(cfp.expectedPublication)}</dd></div>
      </dl>
      <ButtonLink to={paths.submit} variant="onDarkCta" className="mt-3 w-full"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
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
    <StickyRailJ5 label="Call for papers and notices" className="space-y-4">
      <CallCard cfp={cfp} />
      {notices.length > 0 && (
        <Card id="j5-notices" title="Notices" icon={Bell}>
          <ul className="divide-y divide-obsidian-100">
            {notices.slice(0, 3).map((n) => (
              <li key={n.date} className="py-2.5 first:pt-0 last:pb-0">
                <p className="text-xs font-semibold tabular-nums text-wine-800">{formatDate(n.date)}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-obsidian-700">{n.text}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card id="j5-policies" title="Policies" icon={Shield}>
        <ul className="-my-1 divide-y divide-obsidian-100 text-sm">
          {POLICIES.map(([label, to, Icon]) => (
            <li key={label}><AppLink to={to} className="flex items-center justify-between gap-2 py-2.5 font-medium text-obsidian-900 hover:text-wine-800">{label}<Icon className="h-4 w-4 shrink-0 text-obsidian-500" aria-hidden="true" /></AppLink></li>
          ))}
        </ul>
      </Card>
    </StickyRailJ5>
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
    <StickyRailJ5 label="Author tools" className="space-y-4">
      <Card id="j5-track" title="Track My Paper" icon={Track} aside="No login">
        <TrackQuickFormJ5 />
      </Card>
      <Card id="j5-downloads" title="Author downloads" icon={Description}>
        <ul className="space-y-2">
          {DOWNLOADS.map(([title, note, to, Icon]) => (
            <li key={title}>
              <AppLink to={to} className="flex items-center gap-3 rounded border border-obsidian-200 p-2.5 hover:border-wine-800 hover:bg-[#FBF8F4]">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-wine-50 text-wine-800"><Icon className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-obsidian-900">{title}</span><span className="block text-xs text-obsidian-600">{note}</span></span>
                <ArrowRight className="h-4 w-4 shrink-0 text-obsidian-500" aria-hidden="true" />
              </AppLink>
            </li>
          ))}
        </ul>
      </Card>
      {logos.length > 0 && (
        <Card id="j5-index" title="Indexing verifier" icon={EventNote} aside={`${logos.length} active`}>
          <ul className="space-y-2">
            {logos.map((l) => (
              <li key={l.id}>
                <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded border border-obsidian-200 px-3 py-2 hover:border-wine-800">
                  <span className="flex h-7 w-10 shrink-0 items-center justify-center">{l.file ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" /> : <span className="text-[10px] font-bold text-obsidian-900">{l.name.slice(0, 5)}</span>}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-obsidian-900">{l.name}</span><span className="block text-xs text-obsidian-600">{l.status}</span></span>
                  <OpenInNew className="h-4 w-4 shrink-0 text-obsidian-500" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card id="j5-rights" title="Author rights" icon={Rights}>
        <p className="font-serif4 text-[15px] leading-relaxed text-obsidian-700">Authors keep their copyright. Every article is published under {journal.licence.name}. Accepted authors sign the copyright form online with an email OTP, from the tracking page.</p>
        <AppLink to={paths.policy('copyright-licensing')} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-wine-800 hover:underline">Read the licensing policy <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
      </Card>
    </StickyRailJ5>
  )
}
