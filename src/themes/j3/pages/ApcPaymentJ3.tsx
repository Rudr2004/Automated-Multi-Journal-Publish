// "APC & Payment" page body for J3: three payment routes (standard, institutional, foreign national) with the price breakup, what the charge covers and
// how paying works, in the J3 card style. Every amount comes from `journal.apc`, so the page never disagrees with the rest of the site.
import type { ReactNode } from 'react'
import {
  MdCheckCircleOutline, MdOutlineAccountBalance, MdOutlineCreditCard, MdOutlineEditNote, MdOutlineLink, MdOutlineLockOpen, MdOutlinePayments, MdOutlinePublic,
  MdOutlineReceiptLong, MdOutlineVerified, MdOutlineWorkspacePremium,
} from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatNumber } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { cx } from '../components/primitives'

const panel = 'border border-j3paper-rule bg-white'
const inr = (n: number) => `₹${formatNumber(n)}`
const usd = (n: number) => `US$${formatNumber(n)}`
const btn = 'inline-flex h-11 w-full items-center justify-center gap-2 rounded-tile px-4 font-inter text-sm font-bold transition-colors'

function Head({ id, n, title, text }: { id: string; n: number; title: string; text?: string }) {
  return (
    <div className="border-b border-j3paper-rule pb-3">
      <h2 id={id} className="flex scroll-mt-28 items-center gap-2.5 font-jakarta text-base font-bold uppercase tracking-[0.05em] text-night-900"><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />{n}. {title}</h2>
      {text && <p className="mt-2 max-w-3xl font-inter text-[15px] leading-relaxed text-mauve-700">{text}</p>}
    </div>
  )
}

function Route({ icon, tag, title, who, rows, methods, note, cta, wide }: {
  icon: ReactNode; tag: string; title: string; who: string
  rows: { label: string; value: string; strong?: boolean }[]
  methods: string[]; note?: string; cta: ReactNode; wide?: boolean
}) {
  return (
    <article className={cx(panel, 'flex flex-col', wide && 'lg:col-span-2')}>
      <header className="flex items-start gap-3 border-b border-j3paper-rule bg-j3paper-cool p-4">
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center bg-iris-700 text-white">{icon}</span>
        <div className="min-w-0">
          <p className="font-inter text-[10px] font-bold uppercase tracking-[0.12em] text-ember-700">{tag}</p>
          <h3 className="font-jakarta text-lg font-bold leading-snug text-night-900">{title}</h3>
          <p className="font-inter text-[13px] text-mauve-600">{who}</p>
        </div>
      </header>
      <div className={cx('grid flex-1 gap-6 p-4', wide && 'md:grid-cols-2')}>
        <div>
          <h4 className="font-inter text-[11px] font-bold uppercase tracking-[0.1em] text-mauve-600">Price breakup</h4>
          <dl className="mt-1 divide-y divide-j3paper-rule">
            {rows.map((r) => (
              <div key={r.label} className={cx('flex items-baseline justify-between gap-4 py-2', r.strong && 'border-t-2 border-iris-700 pt-3')}>
                <dt className={cx('font-inter text-sm', r.strong ? 'font-bold text-night-900' : 'text-mauve-700')}>{r.label}</dt>
                <dd className={cx('text-right tabular-nums', r.strong ? 'font-jakarta text-xl font-bold text-iris-700' : 'font-inter text-sm font-semibold text-night-900')}>{r.value}</dd>
              </div>
            ))}
          </dl>
          {note && <p className="mt-2 font-inter text-xs leading-relaxed text-mauve-600">{note}</p>}
        </div>
        <div className="flex flex-col">
          <h4 className="font-inter text-[11px] font-bold uppercase tracking-[0.1em] text-mauve-600">Ways to pay</h4>
          <ul className="mt-2 space-y-2">
            {methods.map((m) => <li key={m} className="flex gap-2.5 font-inter text-sm text-night-900"><MdCheckCircleOutline className="mt-0.5 h-5 w-5 shrink-0 text-j3valid-700" aria-hidden="true" />{m}</li>)}
          </ul>
          <div className="mt-auto pt-5">{cta}</div>
        </div>
      </div>
    </article>
  )
}

const INCLUDED: [ReactNode, string, string][] = [
  [<MdOutlineVerified key="a" className="h-6 w-6" />, 'Peer review and editorial handling', 'Screening, expert review and a decision with written reasons.'],
  [<MdOutlineLink key="b" className="h-6 w-6" />, 'Permanent Crossref DOI', 'Registered for your article so citations never break.'],
  [<MdOutlineWorkspacePremium key="c" className="h-6 w-6" />, 'Certificate for every author', 'One certificate per author, with a QR code that opens your article.'],
  [<MdOutlineLockOpen key="d" className="h-6 w-6" />, `Open access hosting (${journal.licence.name})`, 'Free for everyone to read, share and reuse; authors keep their copyright.'],
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

export const APC_TOC = [{ id: 'apc-options', label: 'Payment options' }, { id: 'apc-included', label: 'What the charge covers' }, { id: 'apc-how', label: 'How payment works' }]

export function ApcPaymentJ3() {
  const { apc } = journal
  const gst = Math.round((apc.inr * apc.gstPercent) / 100)
  const total = apc.inr + gst
  const track = <AppLink to={paths.track} className={cx(btn, 'bg-iris-700 text-white hover:bg-iris-800')}><MdOutlinePayments className="h-5 w-5" aria-hidden="true" /> Pay with your Paper ID</AppLink>
  return (
    <>
      <section aria-labelledby="apc-options" className={cx(panel, 'p-4 sm:p-6')}>
        <Head id="apc-options" n={1} title="Payment options" text="There is no fee to submit or to be reviewed. After acceptance, choose the route that fits you. The charge is the same for every paper; only the currency and the invoice differ." />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Route icon={<MdOutlineCreditCard className="h-6 w-6" />} tag="Standard payment" title="Author in India" who="You pay the charge yourself."
            rows={[
              { label: 'Article processing charge (APC)', value: inr(apc.inr) },
              { label: `CGST (${apc.gstPercent / 2}%)`, value: inr(gst / 2) },
              { label: `SGST (${apc.gstPercent / 2}%)`, value: inr(gst / 2) },
              { label: 'Total payable', value: inr(total), strong: true },
            ]}
            note={`Authors in other states pay IGST of ${apc.gstPercent}% (${inr(gst)}) instead, so the total is the same.`}
            methods={['UPI, debit or credit card and net banking, paid online', 'Bank transfer or UPI, then upload the payment proof', 'GST invoice emailed after payment']} cta={track} />
          <Route icon={<MdOutlineAccountBalance className="h-6 w-6" />} tag="Institutional payment" title="Institution, university or guide pays" who="Your institution or research guide pays on your behalf."
            rows={[
              { label: 'Article processing charge (APC)', value: inr(apc.inr) },
              { label: `GST (${apc.gstPercent}%)`, value: inr(gst) },
              { label: 'Total payable', value: inr(total), strong: true },
            ]}
            note="The invoice is raised in the institution's name. Send its name, address and GSTIN to the editorial office before you pay."
            methods={['Bank transfer from the institution, with the Paper ID as the reference', 'Upload the transfer proof on the tracking page', 'GST invoice in the institution’s name']}
            cta={<a href={`mailto:${journal.email}?subject=${encodeURIComponent('Institutional payment for APC')}`} className={cx(btn, 'border border-j3paper-rule bg-white text-iris-700 hover:border-iris-700')}>Send institution details</a>} />
          <Route wide icon={<MdOutlinePublic className="h-6 w-6" />} tag="Foreign national payment" title="Author outside India" who="Paid in US dollars, with no GST."
            rows={[
              { label: 'Article processing charge (APC)', value: usd(apc.usd) },
              { label: 'GST', value: 'Not charged' },
              { label: 'Total payable', value: usd(apc.usd), strong: true },
            ]}
            note="Your bank may add its own foreign-transaction fee."
            methods={['International debit or credit card, paid online in USD', 'Bank transfer in USD, then upload the payment proof', 'Receipt emailed after payment']} cta={track} />
        </div>
      </section>

      <section aria-labelledby="apc-included" className={cx(panel, 'p-4 sm:p-6')}>
        <Head id="apc-included" n={2} title="What the charge covers" text="One charge covers everything from review to a permanent, citable article. There are no extra fees for the DOI or the certificates." />
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {INCLUDED.map(([icon, title, text]) => (
            <li key={title} className="border border-j3paper-rule bg-j3paper-cool p-4">
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center bg-white text-iris-700 ring-1 ring-j3paper-rule">{icon}</span>
              <h3 className="mt-3 font-jakarta text-base font-bold text-night-900">{title}</h3>
              <p className="mt-1 font-inter text-sm leading-relaxed text-mauve-700">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="apc-how" className={cx(panel, 'p-4 sm:p-6')}>
        <Head id="apc-how" n={3} title="How payment works" />
        <ol className="mt-5 space-y-4">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center bg-iris-700 font-jakarta text-sm font-bold text-white">{i + 1}</span>
              <p className="min-w-0 font-inter text-[15px] leading-relaxed text-mauve-700"><strong className="block font-jakarta text-base font-bold text-night-900">{t}</strong>{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 border-l-4 border-ember-500 bg-j3paper-cool p-4 font-inter text-sm text-mauve-700"><strong className="font-jakarta text-night-900">Waivers and refunds.</strong> Request a waiver with your submission; the editor-in-chief decides it separately from the review. Refunds apply to duplicate payments or if a paper cannot be published, see the <AppLink to={paths.policy('refund')} className="font-semibold text-iris-700 underline">Refund Policy</AppLink>.</p>
      </section>
    </>
  )
}
