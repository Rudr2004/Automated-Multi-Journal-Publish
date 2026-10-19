// "APC & Payment" body for J4, laid out like the client's APC prototype (INR 1,000 + 18% GST): a hero line, a payment card (price summary + the
// pay form with "Who is paying?"), what is included, how it works, institutional payment with bank details, and the FAQ. Authors outside India
// see the same breakup in US dollars without GST. Amounts come from `journal.apc`.
import { useState, type FormEvent, type ReactNode } from 'react'
import {
  MdOutlineAccountBalance, MdOutlineArchive, MdOutlineBalance, MdOutlineBolt, MdOutlineCheckCircle, MdOutlineEditNote, MdOutlineExpandMore, MdOutlineGppGood,
  MdOutlineLink, MdOutlineLock, MdOutlineLockOpen, MdOutlinePayments, MdOutlineSearch, MdOutlineSupportAgent, MdOutlineVerified, MdOutlineWorkspacePremium,
} from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatNumber } from '../../../core/lib/format'
import { idExample } from '../../../core/lib/manuscriptId'
import * as validate from '../../../core/lib/validators'
import { AppLink, useRouter } from '../../../core/router'
import { cx } from '../components/primitives'
import { useToast } from '../components/Toast'

const pane = 'rounded-pane border border-abyss-200 bg-white p-5 shadow-hair sm:p-7'
const inr = (n: number) => `₹${formatNumber(n)}`
const usd = (n: number) => `US$${formatNumber(n)}`
const field = 'block min-h-11 w-full rounded-ctl border border-abyss-300 bg-white px-3 text-sm text-abyss-900 placeholder:text-steel-500 focus:border-azure-600 focus:outline-none focus:ring-2 focus:ring-azure-600/25'
const lab = 'mb-1 mt-3 block text-xs font-semibold text-abyss-800'

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
]

export const APC_TOC_J4 = [
  { id: 'apc-fee', label: 'Pay the publication fee' }, { id: 'apc-included', label: 'What is included' }, { id: 'apc-how', label: 'How it works' },
  { id: 'apc-institution', label: 'Institutional payment' }, { id: 'apc-faq', label: 'Frequently asked questions' },
]

type Payer = 'individual' | 'institution'
type Where = 'india' | 'abroad'

function Seg<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: [T, string][]; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded-ctl border border-abyss-200 bg-abyss-50 p-1">
      {options.map(([v, t]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}
          className={cx('min-h-10 flex-1 rounded px-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600', value === v ? 'bg-white text-cobalt-700 shadow-hair' : 'text-steel-600 hover:text-abyss-900')}>{t}</button>
      ))}
    </div>
  )
}

function PayCard() {
  const { apc } = journal
  const { navigate } = useRouter()
  const toast = useToast()
  const [payer, setPayer] = useState<Payer>('individual')
  const [where, setWhere] = useState<Where>('india')
  const [method, setMethod] = useState<'online' | 'bank'>('online')
  const [v, setV] = useState({ mid: '', name: '', email: '', gstin: '', org: '', dept: '', addr: '', po: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }))
  const india = where === 'india'
  const gst = india ? Math.round((apc.inr * apc.gstPercent) / 100) : 0
  const base = india ? apc.inr : apc.usd
  const total = base + gst
  const money = india ? inr : usd
  const proforma = payer === 'institution' && method === 'bank'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    const mid = validate.paperId(v.mid.trim().toUpperCase()); if (mid) next.mid = mid
    if (!v.name.trim()) next.name = payer === 'institution' ? 'Enter the contact person’s name.' : 'Enter your full name.'
    const mail = validate.email(v.email); if (mail) next.email = mail
    if (india && v.gstin.trim() && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v.gstin.trim().toUpperCase())) next.gstin = 'GSTIN has 15 characters, e.g. 24AABCE4821F1Z5.'
    if (payer === 'institution') {
      if (!v.org.trim()) next.org = 'Enter the institution name.'
      if (!v.addr.trim()) next.addr = 'Enter the billing address.'
    }
    setErr(next)
    if (Object.keys(next).length) return
    const id = v.mid.trim().toUpperCase()
    if (proforma) {
      toast(`Proforma invoice request noted for ${id} (${money(total)}). The editorial office replies by email.`, 'success')
      return
    }
    navigate(`${paths.track}?id=${encodeURIComponent(id)}&email=${encodeURIComponent(v.email.trim())}`)
  }
  const aria = (k: string) => ({ 'aria-invalid': !!err[k], 'aria-describedby': err[k] ? `apc-${k}-e` : undefined })

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Price summary */}
      <aside aria-label="Payment summary" className="self-start rounded-pane border border-sky-200 bg-sky-50/50 p-5">
        <h3 className="font-serif4 text-base font-bold text-[#0b2545]">Payment summary</h3>
        <div className="mt-2"><Seg<Where> label="Author location" value={where} onChange={setWhere} options={[['india', 'Author in India'], ['abroad', 'Outside India']]} /></div>
        <p className="mt-4 font-serif4 text-4xl font-bold text-[#0b2545]">{money(total)}</p>
        <p className="text-sm text-steel-700">total, per article{india ? '' : ', no GST'}</p>
        <dl className="mt-4 divide-y divide-sky-100 text-sm">
          <div className="flex justify-between py-2"><dt className="text-abyss-700">Publication fee (APC)</dt><dd className="font-semibold tabular-nums">{money(base)}.00</dd></div>
          {india
            ? <div className="flex justify-between py-2"><dt className="text-abyss-700">GST @ {apc.gstPercent}%</dt><dd className="font-semibold tabular-nums">{inr(gst)}.00</dd></div>
            : <div className="flex justify-between py-2"><dt className="text-abyss-700">GST</dt><dd className="font-semibold">Not charged</dd></div>}
          <div className="flex justify-between py-2"><dt className="font-bold text-abyss-900">Total payable</dt><dd className="font-bold tabular-nums text-cobalt-700">{money(total)}.00</dd></div>
        </dl>
        <ul className="mt-4 space-y-1.5 text-xs text-abyss-700">
          <li className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />Includes the Crossref DOI and a certificate for every author.</li>
          <li className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />No per-page fees, no extra cost for colour figures.</li>
        </ul>
        <p className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-steel-700">
          <span className="inline-flex items-center gap-1 rounded border border-abyss-200 bg-white px-2 py-0.5"><MdOutlineLock className="h-3.5 w-3.5" aria-hidden="true" />Secure payment</span>
          {['UPI', 'Cards', 'Net banking'].map((t) => <span key={t} className="rounded border border-abyss-200 bg-white px-2 py-0.5">{t}</span>)}
        </p>
      </aside>

      {/* Pay form */}
      <form onSubmit={submit} noValidate aria-label="Pay the article processing charge" className="rounded-pane border border-abyss-200 p-5">
        <h3 className="font-serif4 text-base font-bold text-[#0b2545]">Who is paying?</h3>
        <div className="mt-2"><Seg<Payer> label="Payer type" value={payer} onChange={setPayer} options={[['individual', 'Individual author'], ['institution', 'Institution or funder']]} /></div>

        <label htmlFor="apc-mid" className={lab}>Manuscript ID</label>
        <input id="apc-mid" value={v.mid} onChange={set('mid')} placeholder={`e.g. ${idExample}`} autoComplete="off" className={field} {...aria('mid')} />
        {err.mid && <p id="apc-mid-e" role="alert" className="mt-1 text-xs font-medium text-red-700">{err.mid}</p>}
        <label htmlFor="apc-name" className={lab}>{payer === 'institution' ? 'Contact person name' : 'Corresponding author name'}</label>
        <input id="apc-name" value={v.name} onChange={set('name')} placeholder={payer === 'institution' ? 'Contact person name' : 'Full name'} autoComplete="name" className={field} {...aria('name')} />
        {err.name && <p id="apc-name-e" role="alert" className="mt-1 text-xs font-medium text-red-700">{err.name}</p>}
        <label htmlFor="apc-email" className={lab}>Email</label>
        <input id="apc-email" type="email" value={v.email} onChange={set('email')} placeholder="name@university.edu" autoComplete="email" className={field} {...aria('email')} />
        {err.email && <p id="apc-email-e" role="alert" className="mt-1 text-xs font-medium text-red-700">{err.email}</p>}
        {india && (
          <>
            <label htmlFor="apc-gstin" className={lab}>{payer === 'institution' ? 'Institution GSTIN (for tax invoice)' : 'GSTIN (optional, for business invoice)'}</label>
            <input id="apc-gstin" value={v.gstin} onChange={(e) => setV((s) => ({ ...s, gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15) }))} placeholder="15-character GSTIN" maxLength={15} autoComplete="off" className={cx(field, 'font-mono')} {...aria('gstin')} />
            {err.gstin && <p id="apc-gstin-e" role="alert" className="mt-1 text-xs font-medium text-red-700">{err.gstin}</p>}
          </>
        )}
        {payer === 'institution' && (
          <>
            <label htmlFor="apc-org" className={lab}>Institution / organisation name</label>
            <input id="apc-org" value={v.org} onChange={set('org')} placeholder="Name as it should appear on the invoice" autoComplete="organization" className={field} {...aria('org')} />
            {err.org && <p id="apc-org-e" role="alert" className="mt-1 text-xs font-medium text-red-700">{err.org}</p>}
            <label htmlFor="apc-dept" className={lab}>Department (optional)</label>
            <input id="apc-dept" value={v.dept} onChange={set('dept')} placeholder="Department or cost centre" className={field} />
            <label htmlFor="apc-addr" className={lab}>Billing address</label>
            <input id="apc-addr" value={v.addr} onChange={set('addr')} placeholder="Address, city, state, PIN" autoComplete="street-address" className={field} {...aria('addr')} />
            {err.addr && <p id="apc-addr-e" role="alert" className="mt-1 text-xs font-medium text-red-700">{err.addr}</p>}
            <label htmlFor="apc-po" className={lab}>Purchase order / reference no. (optional)</label>
            <input id="apc-po" value={v.po} onChange={set('po')} placeholder="PO or sanction number" className={field} />
            <label htmlFor="apc-method" className={lab}>Payment method</label>
            <select id="apc-method" value={method} onChange={(e) => setMethod(e.target.value as 'online' | 'bank')} className={field}>
              <option value="online">Pay online now (UPI / card / net banking)</option>
              <option value="bank">Bank transfer against proforma invoice</option>
            </select>
          </>
        )}
        <button type="submit" className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-ctl bg-cobalt-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-2">
          <MdOutlinePayments className="h-5 w-5" aria-hidden="true" />{proforma ? 'Request proforma invoice' : 'Proceed to secure payment'}
        </button>
        <p className="mt-2 text-center text-xs text-steel-600">{proforma ? 'We email a proforma invoice with bank details. A GST tax invoice is issued after payment is confirmed.' : 'Available only for accepted manuscripts. A GST invoice is emailed after payment.'}</p>
      </form>
    </div>
  )
}

export function ApcPaymentJ4() {
  const { apc } = journal
  const [open, setOpen] = useState<number | null>(0)
  const FAQ: [string, string][] = [
    ['Can my institution or funder pay instead of me?', "Yes. Choose \"Institution or funder\" in the payment form and enter the institution's billing details. The tax invoice will be issued in its name."],
    ['Can we pay by bank transfer against a purchase order?', 'Yes. Select "Bank transfer" to request a proforma invoice. After payment, email the transaction reference to the editorial office so it can be matched to the manuscript.'],
    ['When do I need to pay?', 'Only after your manuscript is accepted. You will receive a payment link by email along with the acceptance notification.'],
    ['Is GST included?', `No. GST at ${apc.gstPercent}% is added on top for authors in India (${inr(Math.round((apc.inr * apc.gstPercent) / 100))}), so the total payable is ${inr(apc.inr + Math.round((apc.inr * apc.gstPercent) / 100))}. A GST-compliant invoice is issued after payment. Authors outside India pay ${usd(apc.usd)} with no GST.`],
    ['Which payment methods are accepted?', 'UPI, debit and credit cards, net banking and wallets through our secure payment gateway.'],
    ['Does the fee cover all authors?', 'Yes. The fee is per article, regardless of the number of authors, and every author receives a certificate.'],
    ['Can I get a fee waiver?', 'Waivers may be considered for authors with genuine financial hardship. Write to the editorial office before payment with a short request.'],
    ['What is the refund policy?', 'Once the article is published online, the fee is non-refundable. If a payment fails or is charged twice, the amount is refunded to the original payment method.'],
  ]
  return (
    <>
      <section aria-labelledby="apc-fee" className={pane}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-cobalt-700"><MdOutlineVerified className="h-4 w-4" aria-hidden="true" />Open Access • Peer-Reviewed</span>
        <h2 id="apc-fee" className="mt-3 scroll-mt-28 font-serif4 text-2xl font-bold text-[#0b2545] sm:text-3xl">Article Processing Charge (APC)</h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-abyss-800">One simple, transparent fee of <strong className="text-cobalt-700">{inr(apc.inr)} + {apc.gstPercent}% GST</strong> per accepted article ({usd(apc.usd)} for authors outside India, no GST). No hidden charges, no per-page fees, no extra cost for colour figures.</p>
        <p className="mb-6 mt-4 flex gap-3 rounded-ctl border-l-4 border-azure-600 bg-azure-50 p-4 text-sm text-abyss-800"><MdOutlineVerified className="mt-0.5 h-5 w-5 shrink-0 text-cobalt-700" aria-hidden="true" /><span><strong>Pay only after acceptance.</strong> Submission and peer review are free. The APC is charged only if your manuscript is accepted, and the decision is based purely on academic merit, never on payment.</span></p>
        <PayCard />
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
        <div className="mt-4 rounded-pane bg-sky-50 p-4 text-sm text-abyss-800">
          <p className="font-bold">Bank details (for transfers)</p>
          <p className="mt-1">The editorial office shares the account details with the proforma invoice. Please quote the Manuscript ID as the payment reference.</p>
        </div>
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
        <p className="mt-4 text-sm text-steel-700">Questions about payment? Contact the editorial office at <a className="font-semibold text-cobalt-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>. <AppLink to={paths.policy('refund')} className="font-semibold text-cobalt-700 underline">Refund Policy</AppLink></p>
      </section>
    </>
  )
}
