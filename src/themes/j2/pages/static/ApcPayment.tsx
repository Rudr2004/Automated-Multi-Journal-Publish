// "APC & Payment" page body for J2: three payment routes (standard, institutional, foreign national) with the price breakup, what the charge
// covers, and how paying works. Every amount comes from the journal config (`journal.apc`), so the page never disagrees with the rest of the site.
import type { ReactNode } from 'react'
import {
  MdOutlineAccountBalance, MdOutlineCreditCard, MdOutlineEditNote, MdOutlinePayments, MdOutlinePublic, MdOutlineReceiptLong, MdOutlineSchool, MdOutlineVerified,
} from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import { buttonClass } from '../../components/Button'
import { cx } from '../../components/primitives'
import * as I from '../../icons'

const card = 'rounded-sheet border border-graphite-200 bg-white shadow-card'
const h2cls = 'scroll-mt-28 font-display text-2xl font-bold tracking-tight text-brand-800'

const inr = (n: number) => `₹${formatNumber(n)}`
const usd = (n: number) => `US$${formatNumber(n)}`

function SectionHead({ id, n, title, text }: { id: string; n: number; title: string; text?: string }) {
  return (
    <div className="border-b border-graphite-200 pb-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className={h2cls}>{n}. {title}</h2>
        <span className="shrink-0 text-xs font-medium tabular-nums text-graphite-600">Section {String(n).padStart(2, '0')}</span>
      </div>
      {text && <p className="mt-2 max-w-3xl text-[1.0625rem] leading-relaxed text-graphite-700">{text}</p>}
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cx('flex items-baseline justify-between gap-4 py-2', strong && 'border-t-2 border-brand-800 pt-3')}>
      <dt className={cx('text-sm', strong ? 'font-bold text-graphite-900' : 'text-graphite-700')}>{label}</dt>
      <dd className={cx('text-right tabular-nums', strong ? 'font-display text-xl font-bold text-brand-800' : 'text-sm font-semibold text-graphite-900')}>{value}</dd>
    </div>
  )
}

function Route({ icon, tag, title, who, rows, methods, note, cta, wide }: {
  icon: ReactNode; tag: string; title: string; who: string
  rows: { label: string; value: string; strong?: boolean }[]
  methods: string[]; note?: string; cta: ReactNode; wide?: boolean
}) {
  return (
    <article className={cx(card, 'flex flex-col overflow-hidden', wide && 'lg:col-span-2')}>
      <header className="flex items-start gap-3 border-b border-graphite-200 bg-brand-50/70 p-5">
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel bg-brand-800 text-white">{icon}</span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-700">{tag}</p>
          <h3 className="font-display text-xl font-bold leading-snug text-graphite-900">{title}</h3>
          <p className="mt-0.5 text-sm text-graphite-700">{who}</p>
        </div>
      </header>
      <div className={cx('grid flex-1 gap-6 p-5', wide && 'md:grid-cols-2')}>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-graphite-600">Price breakup</h4>
          <dl className="mt-1 divide-y divide-graphite-100">{rows.map((r) => <Row key={r.label} {...r} />)}</dl>
          {note && <p className="mt-2 text-xs leading-relaxed text-graphite-600">{note}</p>}
        </div>
        <div className="flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-graphite-600">Ways to pay</h4>
          <ul className="mt-2 space-y-2">
            {methods.map((m) => <li key={m} className="flex gap-2.5 text-sm text-graphite-800"><I.TaskDone className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />{m}</li>)}
          </ul>
          <div className="mt-auto pt-5">{cta}</div>
        </div>
      </div>
    </article>
  )
}

const INCLUDED: [ReactNode, string, string][] = [
  [<MdOutlineVerified key="a" className="h-6 w-6" />, 'Peer review and editorial handling', 'Screening, expert review and a decision with written reasons.'],
  [<I.LinkIcon key="b" className="h-6 w-6" />, 'Permanent Crossref DOI', 'Registered for your article so that citations never break.'],
  [<I.Award key="c" className="h-6 w-6" />, 'Certificate for every author', 'One certificate per author, with a QR code that opens your article.'],
  [<I.OpenAccess key="d" className="h-6 w-6" />, `Open access hosting (${journal.licence.name})`, 'Free for everyone to read, share and reuse; authors keep their copyright.'],
  [<MdOutlineReceiptLong key="e" className="h-6 w-6" />, 'Invoice and receipt', 'A GST invoice for Indian authors and a receipt for every payment.'],
  [<MdOutlineEditNote key="f" className="h-6 w-6" />, 'Language, layout and proof checks', 'Production checks before the final article is published.'],
]

const STEPS: [string, string][] = [
  ['Your paper is accepted', 'Nothing is charged when you submit or while the paper is under review.'],
  ['Sign the copyright form', 'You complete it online with an email one-time code from the tracking page.'],
  ['Pay the APC', 'Open Track My Paper with your Paper ID and email, and choose Pay APC.'],
  ['Payment is confirmed', 'Online payments are confirmed automatically. Bank transfer or UPI proof is checked by the editorial office, usually within two working days.'],
  ['Invoice, then publication', 'Your invoice or receipt is emailed. The article is published with its DOI in the next monthly issue.'],
]

export function ApcPayment() {
  const { apc } = journal
  const gst = Math.round((apc.inr * apc.gstPercent) / 100)
  const half = gst / 2
  const total = apc.inr + gst
  const trackCta = <AppLink to={paths.track} className={cx(buttonClass('primary'), 'w-full justify-center')}><MdOutlinePayments className="h-5 w-5" aria-hidden="true" /> Pay with your Paper ID</AppLink>

  return (
    <>
      <section aria-labelledby="apc-options" className={cx(card, 'p-5 sm:p-8')}>
        <SectionHead id="apc-options" n={1} title="Payment options"
          text="There is no fee to submit or to be reviewed. After acceptance, choose the route that fits you. The charge is the same for every paper; only the currency and the invoice differ." />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Route icon={<MdOutlineCreditCard className="h-6 w-6" />} tag="Standard payment" title="Author in India" who="You pay the charge yourself."
            rows={[
              { label: 'Article processing charge (APC)', value: inr(apc.inr) },
              { label: `CGST (${apc.gstPercent / 2}%)`, value: inr(half) },
              { label: `SGST (${apc.gstPercent / 2}%)`, value: inr(half) },
              { label: 'Total payable', value: inr(total), strong: true },
            ]}
            note={`CGST and SGST apply within Karnataka; authors in other states pay IGST of ${apc.gstPercent}% (${inr(gst)}) instead, so the total is the same.`}
            methods={['UPI, debit or credit card and net banking, paid online', 'Bank transfer or UPI to our account, then upload the payment proof', 'GST invoice emailed after payment']}
            cta={trackCta} />
          <Route icon={<MdOutlineAccountBalance className="h-6 w-6" />} tag="Institutional payment" title="Institution, university or guide pays" who="Your institution or research guide pays on your behalf."
            rows={[
              { label: 'Article processing charge (APC)', value: inr(apc.inr) },
              { label: `GST (${apc.gstPercent}%)`, value: inr(gst) },
              { label: 'Total payable', value: inr(total), strong: true },
            ]}
            note="The invoice is raised in the institution's name. Send its name, address and GSTIN to the editorial office before you pay."
            methods={['Bank transfer from the institution, with the Paper ID as the reference', 'Upload the transfer proof on the tracking page; the office confirms it', 'GST invoice in the institution’s name']}
            cta={<a href={`mailto:${journal.email}?subject=${encodeURIComponent('Institutional payment for APC')}`} className={cx(buttonClass('outline'), 'w-full justify-center')}><I.Email className="h-5 w-5" aria-hidden="true" /> Send institution details</a>} />
          <Route wide icon={<MdOutlinePublic className="h-6 w-6" />} tag="Foreign national payment" title="Author outside India" who="Paid in US dollars, with no GST."
            rows={[
              { label: 'Article processing charge (APC)', value: usd(apc.usd) },
              { label: 'GST', value: 'Not charged' },
              { label: 'Total payable', value: usd(apc.usd), strong: true },
            ]}
            note="Authors outside India are charged in US dollars. Your bank may add its own foreign-transaction fee."
            methods={['International debit or credit card, paid online in USD', 'Bank transfer in USD, then upload the payment proof', 'Receipt emailed after payment']}
            cta={trackCta} />
        </div>
      </section>

      <section aria-labelledby="apc-included" className={cx(card, 'p-5 sm:p-8')}>
        <SectionHead id="apc-included" n={2} title="What the charge covers" text="One charge covers everything from review to a permanent, citable article. There are no extra fees for the DOI or the certificates." />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {INCLUDED.map(([icon, title, text]) => (
            <li key={title} className="rounded-panel border border-brand-200 bg-brand-50/60 p-4">
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-soft bg-white text-brand-800 ring-1 ring-brand-200">{icon}</span>
              <h3 className="mt-3 font-display text-base font-bold text-graphite-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-graphite-700">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="apc-how" className={cx(card, 'p-5 sm:p-8')}>
        <SectionHead id="apc-how" n={3} title="How payment works" />
        <ol className="mt-6 space-y-4">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="flex gap-4">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-800 font-display text-sm font-bold text-white">{i + 1}</span>
              <p className="min-w-0 pt-0.5 text-[1.0625rem] leading-relaxed text-graphite-700"><strong className="block font-display text-base font-bold text-graphite-900">{title}</strong>{text}</p>
            </li>
          ))}
        </ol>
        <aside role="note" className="mt-6 flex gap-3 rounded-panel border-l-4 border-accent-700 bg-accent-50 p-4">
          <I.Info className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" />
          <div className="text-sm text-graphite-700">
            <p className="font-display font-semibold text-graphite-800">Waivers and refunds</p>
            <p className="mt-0.5">Request a waiver with your submission; the editor-in-chief decides it separately from the review. Refunds apply to duplicate payments or if a paper cannot be published, see the <AppLink to={paths.policy('refund')} className="font-semibold text-accent-800 underline">Refund Policy</AppLink>.</p>
          </div>
        </aside>
        <div className="mt-6 flex flex-wrap gap-3">
          <AppLink to={paths.submit} className={buttonClass('primary')}><I.Submit className="h-5 w-5" aria-hidden="true" /> Submit your manuscript</AppLink>
          <a href={`mailto:${journal.email}`} className={buttonClass('outline')}><MdOutlineSchool className="h-5 w-5" aria-hidden="true" /> Ask about payment</a>
        </div>
      </section>
    </>
  )
}
