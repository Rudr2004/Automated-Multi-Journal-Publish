// "APC & Payment" body for J4, built from the client's APC prototype (INR 1,000 + 18% GST): fee summary, what is included, how it works, institutional
// payment and FAQ, in the J4 card style. Amounts come from `journal.apc`.
import { useState, type ReactNode } from 'react'
import {
  MdOutlineAccountBalance, MdOutlineArchive, MdOutlineBalance, MdOutlineBolt, MdOutlineCheckCircle, MdOutlineEditNote, MdOutlineExpandMore, MdOutlineGppGood,
  MdOutlineLink, MdOutlineLockOpen, MdOutlinePayments, MdOutlineSearch, MdOutlineSupportAgent, MdOutlineVerified, MdOutlineWorkspacePremium,
} from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatNumber } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { cx } from '../components/primitives'

const pane = 'rounded-pane border border-abyss-200 bg-white p-5 shadow-hair sm:p-7'
const inr = (n: number) => `₹${formatNumber(n)}`

function Head({ id, n, title }: { id: string; n: number; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-abyss-200 pb-3">
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-ctl border border-sky-200 bg-sky-50 font-mono text-sm font-bold text-cobalt-700">{String(n).padStart(2, '0')}</span>
      <h2 id={id} className="scroll-mt-28 font-serif4 text-xl font-bold text-[#0b2545]">{title}</h2>
    </div>
  )
}

const INCLUDED: [ReactNode, string, string][] = [
  [<MdOutlineWorkspacePremium key="1" />, 'Certificate for every author', 'Individual digital publication certificate for each co-author, with title, journal, volume and issue.'],
  [<MdOutlineLink key="2" />, 'DOI via Crossref', 'A permanent, citable DOI registered through Crossref for your article.'],
  [<MdOutlineArchive key="3" />, 'Permanent archiving', 'Your published article is preserved long term, so it stays accessible.'],
  [<MdOutlineBolt key="4" />, 'Fast online publication', 'Published online within 24 hours of acceptance.'],
  [<MdOutlineLockOpen key="5" />, 'Open access visibility', 'Free to read and download worldwide, with no paywall for readers.'],
  [<MdOutlineEditNote key="6" />, 'Professional typesetting', 'Your manuscript is formatted into a clean, journal-standard PDF and web (HTML) version.'],
  [<MdOutlineSearch key="7" />, 'Discoverability', 'Metadata prepared for Google Scholar and other academic search tools.'],
  [<MdOutlineGppGood key="8" />, 'Plagiarism screening', 'Similarity check carried out before publication.'],
  [<MdOutlineBalance key="9" />, 'You keep your copyright', 'Authors retain copyright. Articles are published under an open licence.'],
  [<MdOutlineSupportAgent key="10" />, 'Author support', 'Help from the editorial office by email until your article is live.'],
]

const STEPS = ['Submit your manuscript', 'Peer review and editorial decision', 'Pay the APC, only after acceptance', 'Article published online with DOI']

const NOTES = [
  "Invoice issued in the institution's name with GSTIN, billing address and purchase order number, if provided.",
  'If your institution deducts TDS, please mention it when requesting the invoice and share the TDS certificate afterwards.',
  'Paying for several articles? Contact the editorial office for a consolidated invoice.',
  'Publication follows acceptance and payment confirmation. Payment never influences the editorial decision.',
  'Please quote the Manuscript ID as the payment reference.',
]

export const APC_TOC_J4 = [
  { id: 'apc-fee', label: 'Publication fee' }, { id: 'apc-included', label: 'What is included' }, { id: 'apc-how', label: 'How it works' },
  { id: 'apc-institution', label: 'Institutional payment' }, { id: 'apc-faq', label: 'Frequently asked questions' },
]

export function ApcPaymentJ4() {
  const { apc } = journal
  const gst = Math.round((apc.inr * apc.gstPercent) / 100)
  const [open, setOpen] = useState<number | null>(0)
  const FAQ: [string, string][] = [
    ['Can my institution or funder pay instead of me?', "Yes. Choose \"Institution or funder\" when you pay and enter the institution's billing details. The tax invoice will be issued in its name."],
    ['Can we pay by bank transfer against a purchase order?', 'Yes. Select "Bank transfer" to request a proforma invoice. After payment, email the transaction reference to the editorial office so it can be matched to the manuscript.'],
    ['When do I need to pay?', 'Only after your manuscript is accepted. You will receive a payment link by email along with the acceptance notification.'],
    ['Is GST included?', `No. GST at ${apc.gstPercent}% is added on top. A GST-compliant invoice is issued after payment.`],
    ['Which payment methods are accepted?', 'UPI, debit and credit cards, net banking and wallets through our secure payment gateway.'],
    ['Does the fee cover all authors?', 'Yes. The fee is per article, regardless of the number of authors, and every author receives a certificate.'],
    ['Can I get a fee waiver?', 'Waivers may be considered for authors with genuine financial hardship. Write to the editorial office before payment with a short request.'],
    ['What is the refund policy?', 'Once the article is published online, the fee is non-refundable. If a payment fails or is charged twice, the amount is refunded to the original payment method.'],
  ]
  return (
    <>
      <section aria-labelledby="apc-fee" className={pane}>
        <Head id="apc-fee" n={1} title="Article processing charge" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <p className="text-lg leading-relaxed text-abyss-800">One simple, transparent fee of <strong className="text-cobalt-700">{inr(apc.inr)} + {apc.gstPercent}% GST</strong> per accepted article. No hidden charges, no per-page fees, no extra cost for colour figures.</p>
            <p className="mt-4 flex gap-3 rounded-ctl border-l-4 border-azure-600 bg-azure-50 p-4 text-sm text-abyss-800"><MdOutlineVerified className="mt-0.5 h-5 w-5 shrink-0 text-cobalt-700" aria-hidden="true" /><span><strong>Pay only after acceptance.</strong> Submission and peer review are free. The APC is charged only if your manuscript is accepted, and the decision is based purely on academic merit, never on payment.</span></p>
            <p className="mt-4 text-sm text-steel-700">Authors outside India pay US${apc.usd} (no GST).</p>
          </div>
          <aside aria-label="Payment summary" className="rounded-pane border border-sky-200 bg-sky-50/50 p-5">
            <p className="font-serif4 text-4xl font-bold text-[#0b2545]">{inr(apc.inr + gst)}</p>
            <p className="text-sm text-steel-700">total, per article</p>
            <dl className="mt-4 divide-y divide-sky-100 text-sm">
              <div className="flex justify-between py-2"><dt className="text-abyss-700">Publication fee (APC)</dt><dd className="font-semibold tabular-nums">{inr(apc.inr)}.00</dd></div>
              <div className="flex justify-between py-2"><dt className="text-abyss-700">GST @ {apc.gstPercent}%</dt><dd className="font-semibold tabular-nums">{inr(gst)}.00</dd></div>
              <div className="flex justify-between py-2"><dt className="font-bold text-abyss-900">Total payable</dt><dd className="font-bold tabular-nums text-cobalt-700">{inr(apc.inr + gst)}.00</dd></div>
            </dl>
            <AppLink to={paths.track} className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-ctl bg-cobalt-700 px-4 text-sm font-semibold text-white hover:bg-cobalt-800"><MdOutlinePayments className="h-5 w-5" aria-hidden="true" />Pay with your Manuscript ID</AppLink>
            <p className="mt-2 text-xs text-steel-600">Available only for accepted manuscripts. A GST invoice is emailed after payment. UPI · Cards · Net banking.</p>
          </aside>
        </div>
      </section>

      <section aria-labelledby="apc-included" className={pane}>
        <Head id="apc-included" n={2} title="What is included in your publication fee" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {INCLUDED.map(([icon, t, d]) => (
            <li key={t} className="flex gap-3 rounded-pane border border-abyss-200 bg-abyss-50/60 p-4">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-white text-xl text-cobalt-700 ring-1 ring-sky-200">{icon}</span>
              <span className="min-w-0"><strong className="block font-serif4 text-base text-[#0b2545]">{t}</strong><span className="text-sm leading-relaxed text-abyss-700">{d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="apc-how" className={pane}>
        <Head id="apc-how" n={3} title="How it works" />
        <ol className="grid gap-3 sm:grid-cols-4">
          {STEPS.map((t, i) => (
            <li key={t} className="rounded-pane border border-sky-200 bg-sky-50/50 p-4">
              <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-cobalt-700 text-sm font-bold text-white">{i + 1}</span>
              <p className="mt-2 text-sm font-semibold text-abyss-900">{t}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="apc-institution" className={pane}>
        <Head id="apc-institution" n={4} title="Institutional payment" />
        <p className="mb-4 flex gap-3 text-abyss-800"><MdOutlineAccountBalance className="mt-1 h-6 w-6 shrink-0 text-cobalt-700" aria-hidden="true" />Universities, colleges, research labs, funding agencies and companies can pay the APC on behalf of their authors, with a GST tax invoice issued in the institution&apos;s name.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-pane border border-abyss-200 p-4"><h3 className="font-serif4 text-base font-bold text-[#0b2545]">Option 1: Pay online</h3><p className="mt-1 text-sm text-abyss-700">Pay instantly by UPI, card or net banking using the institution&apos;s payment details. Best for quick publication.</p></div>
          <div className="rounded-pane border border-abyss-200 p-4"><h3 className="font-serif4 text-base font-bold text-[#0b2545]">Option 2: Bank transfer</h3><p className="mt-1 text-sm text-abyss-700">Request a proforma invoice, pay by NEFT, RTGS or IMPS, then email the transaction reference. Suitable for purchase-order based payments.</p></div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-abyss-700">
          {NOTES.map((t) => <li key={t} className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />{t}</li>)}
        </ul>
        <a href={`mailto:${journal.email}?subject=${encodeURIComponent('Institutional payment for APC')}`} className="mt-5 inline-flex min-h-11 items-center rounded-ctl border border-cobalt-700 px-4 text-sm font-semibold text-cobalt-700 hover:bg-sky-50">Request a proforma invoice</a>
      </section>

      <section aria-labelledby="apc-faq" className={pane}>
        <Head id="apc-faq" n={5} title="Frequently asked questions" />
        <ul className="divide-y divide-abyss-200 rounded-pane border border-abyss-200">
          {FAQ.map(([q, a], i) => (
            <li key={q}>
              <h3><button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-abyss-900 hover:bg-abyss-50">
                {q}<MdOutlineExpandMore className={cx('h-5 w-5 shrink-0 text-cobalt-700 transition-transform', open === i && 'rotate-180')} aria-hidden="true" />
              </button></h3>
              {open === i && <p className="px-4 pb-4 text-sm leading-relaxed text-abyss-700">{a}</p>}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-steel-700">Questions about payment? Contact the editorial office at <a className="font-semibold text-cobalt-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>.</p>
      </section>
    </>
  )
}
