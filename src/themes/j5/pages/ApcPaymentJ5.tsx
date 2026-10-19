// "APC & Payment" body for J5 (IJFRD, wine and ochre), laid out like the client's APC prototype: a headline, a payment card (price summary with a
// location switch + the pay form with "Who is paying?"), what the fee includes, how it works, institutional payment and the FAQ.
// Authors outside India see the same breakup in US dollars without GST. Amounts come from journal.apc.
import { useState, type FormEvent } from 'react'
import { MdOutlineAccountBalance, MdOutlineCheckCircle, MdOutlineExpandMore, MdOutlineLock, MdOutlinePayments, MdOutlineVerified } from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { APC_INCLUDED, APC_INSTITUTION_NOTES, APC_STEPS, apcFaq } from '../../../core/lib/apcContent'
import { formatNumber } from '../../../core/lib/format'
import { idExample } from '../../../core/lib/manuscriptId'
import * as validate from '../../../core/lib/validators'
import { AppLink, useRouter } from '../../../core/router'
import { cx } from '../components/primitives'
import { useToast } from '../components/Toast'

const inr = (n: number) => `₹${formatNumber(n)}`
const usd = (n: number) => `US$${formatNumber(n)}`
const card = 'scroll-mt-28 rounded border border-[#E6DCD0] bg-white p-5 shadow-sm sm:p-8'
const field = 'block min-h-11 w-full rounded border border-[#CDBFB0] bg-white px-3 font-work text-sm text-obsidian-900 placeholder:text-obsidian-500 focus:border-wine-700 focus:outline-none focus:ring-2 focus:ring-wine-700/25'
const lab = 'mb-1 mt-3 block font-work text-xs font-bold text-obsidian-800'

export const APC_TOC_J5 = [
  { id: 'apc-options', label: 'Pay the publication fee' }, { id: 'apc-included', label: 'What is included' }, { id: 'apc-how', label: 'How it works' },
  { id: 'apc-institution', label: 'Institutional payment' }, { id: 'apc-faq', label: 'Frequently asked questions' },
]

function Head({ id, n, title }: { id: string; n: number; title: string }) {
  return (
    <div className="mb-5 border-b border-[#E6DCD0] pb-3">
      <p className="mb-1 flex items-center gap-2 font-work text-xs font-bold uppercase tracking-wider text-wine-800"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-wine-700" />Section {n}</p>
      <h2 id={id} className="scroll-mt-28 font-newsreader text-xl font-semibold text-obsidian-900 sm:text-2xl">{title}</h2>
    </div>
  )
}

type Payer = 'individual' | 'institution'
type Where = 'india' | 'abroad'

function Seg<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: [T, string][]; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded border border-[#E6DCD0] bg-[#F4EEE6] p-1">
      {options.map(([v, t]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}
          className={cx('min-h-10 flex-1 rounded px-2 font-work text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700', value === v ? 'bg-white text-wine-800 shadow-sm' : 'text-obsidian-600 hover:text-obsidian-900')}>{t}</button>
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
    if (proforma) { toast(`Proforma invoice request noted for ${id} (${money(total)}). The editorial office replies by email.`, 'success'); return }
    navigate(`${paths.track}?id=${encodeURIComponent(id)}&email=${encodeURIComponent(v.email.trim())}`)
  }
  const aria = (k: string) => ({ 'aria-invalid': !!err[k], 'aria-describedby': err[k] ? `apc-${k}-e` : undefined })
  const msg = (k: string) => err[k] && <p id={`apc-${k}-e`} role="alert" className="mt-1 font-work text-xs font-medium text-red-700">{err[k]}</p>

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside aria-label="Payment summary" className="self-start rounded border border-[#E6DCD0] bg-[#F4EEE6] p-5">
        <h3 className="font-newsreader text-lg font-semibold text-obsidian-900">Payment summary</h3>
        <div className="mt-2"><Seg<Where> label="Author location" value={where} onChange={setWhere} options={[['india', 'Author in India'], ['abroad', 'Outside India']]} /></div>
        <p className="mt-4 font-newsreader text-4xl font-bold text-wine-800">{money(total)}</p>
        <p className="font-work text-sm text-obsidian-600">total, per article{india ? '' : ', no GST'}</p>
        <dl className="mt-4 divide-y divide-[#E0D3C3] font-work text-sm">
          <div className="flex justify-between py-2"><dt className="text-obsidian-700">Publication fee (APC)</dt><dd className="font-semibold tabular-nums text-obsidian-900">{money(base)}.00</dd></div>
          {india
            ? <div className="flex justify-between py-2"><dt className="text-obsidian-700">GST @ {apc.gstPercent}%</dt><dd className="font-semibold tabular-nums text-obsidian-900">{inr(gst)}.00</dd></div>
            : <div className="flex justify-between py-2"><dt className="text-obsidian-700">GST</dt><dd className="font-semibold text-obsidian-900">Not charged</dd></div>}
          <div className="flex justify-between border-t-2 border-wine-800 py-2"><dt className="font-bold text-obsidian-900">Total payable</dt><dd className="font-bold tabular-nums text-wine-800">{money(total)}.00</dd></div>
        </dl>
        <ul className="mt-4 space-y-1.5 font-work text-xs text-obsidian-700">
          <li className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />Includes the Crossref DOI and a certificate for every author.</li>
          <li className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />No per-page fees, no extra cost for colour figures.</li>
        </ul>
        <p className="mt-4 flex flex-wrap items-center gap-1.5 font-work text-[11px] font-medium text-obsidian-700">
          <span className="inline-flex items-center gap-1 rounded border border-[#E6DCD0] bg-white px-2 py-0.5"><MdOutlineLock className="h-3.5 w-3.5" aria-hidden="true" />Secure payment</span>
          {['UPI', 'Cards', 'Net banking'].map((t) => <span key={t} className="rounded border border-[#E6DCD0] bg-white px-2 py-0.5">{t}</span>)}
        </p>
      </aside>

      <form onSubmit={submit} noValidate aria-label="Pay the article processing charge" className="rounded border border-[#E6DCD0] p-5">
        <h3 className="font-newsreader text-lg font-semibold text-obsidian-900">Who is paying?</h3>
        <div className="mt-2"><Seg<Payer> label="Payer type" value={payer} onChange={setPayer} options={[['individual', 'Individual author'], ['institution', 'Institution or funder']]} /></div>

        <label htmlFor="apc-mid" className={lab}>Manuscript ID</label>
        <input id="apc-mid" value={v.mid} onChange={set('mid')} placeholder={`e.g. ${idExample}`} autoComplete="off" className={field} {...aria('mid')} />{msg('mid')}
        <label htmlFor="apc-name" className={lab}>{payer === 'institution' ? 'Contact person name' : 'Corresponding author name'}</label>
        <input id="apc-name" value={v.name} onChange={set('name')} placeholder={payer === 'institution' ? 'Contact person name' : 'Full name'} autoComplete="name" className={field} {...aria('name')} />{msg('name')}
        <label htmlFor="apc-email" className={lab}>Email</label>
        <input id="apc-email" type="email" value={v.email} onChange={set('email')} placeholder="name@university.edu" autoComplete="email" className={field} {...aria('email')} />{msg('email')}
        {india && (
          <>
            <label htmlFor="apc-gstin" className={lab}>{payer === 'institution' ? 'Institution GSTIN (for tax invoice)' : 'GSTIN (optional, for business invoice)'}</label>
            <input id="apc-gstin" value={v.gstin} onChange={(e) => setV((s) => ({ ...s, gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15) }))} placeholder="15-character GSTIN" maxLength={15} autoComplete="off" className={cx(field, 'font-mono')} {...aria('gstin')} />{msg('gstin')}
          </>
        )}
        {payer === 'institution' && (
          <>
            <label htmlFor="apc-org" className={lab}>Institution / organisation name</label>
            <input id="apc-org" value={v.org} onChange={set('org')} placeholder="Name as it should appear on the invoice" autoComplete="organization" className={field} {...aria('org')} />{msg('org')}
            <label htmlFor="apc-dept" className={lab}>Department (optional)</label>
            <input id="apc-dept" value={v.dept} onChange={set('dept')} placeholder="Department or cost centre" className={field} />
            <label htmlFor="apc-addr" className={lab}>Billing address</label>
            <input id="apc-addr" value={v.addr} onChange={set('addr')} placeholder="Address, city, state, PIN" autoComplete="street-address" className={field} {...aria('addr')} />{msg('addr')}
            <label htmlFor="apc-po" className={lab}>Purchase order / reference no. (optional)</label>
            <input id="apc-po" value={v.po} onChange={set('po')} placeholder="PO or sanction number" className={field} />
            <label htmlFor="apc-method" className={lab}>Payment method</label>
            <select id="apc-method" value={method} onChange={(e) => setMethod(e.target.value as 'online' | 'bank')} className={field}>
              <option value="online">Pay online now (UPI / card / net banking)</option>
              <option value="bank">Bank transfer against proforma invoice</option>
            </select>
          </>
        )}
        <button type="submit" className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-wine-800 px-4 font-work text-sm font-bold text-white transition-colors hover:bg-wine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2">
          <MdOutlinePayments className="h-5 w-5" aria-hidden="true" />{proforma ? 'Request proforma invoice' : 'Proceed to secure payment'}
        </button>
        <p className="mt-2 text-center font-work text-xs text-obsidian-600">{proforma ? 'We email a proforma invoice with bank details. A GST tax invoice is issued after payment is confirmed.' : 'Available only for accepted manuscripts. A GST invoice is emailed after payment.'}</p>
      </form>
    </div>
  )
}

export function ApcPaymentJ5() {
  const { apc } = journal
  const [open, setOpen] = useState<number | null>(0)
  const faq = apcFaq(apc.gstPercent)
  return (
    <>
      <section aria-labelledby="apc-options" className={card}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E6DCD0] bg-[#F4EEE6] px-3 py-1 font-work text-xs font-semibold text-wine-800"><MdOutlineVerified className="h-4 w-4" aria-hidden="true" />Open Access • Peer-Reviewed</span>
        <h2 id="apc-options" className="mt-3 scroll-mt-28 font-newsreader text-2xl font-semibold text-obsidian-900 sm:text-3xl">Article Processing Charge (APC)</h2>
        <p className="mt-2 max-w-3xl font-work text-[15px] leading-relaxed text-obsidian-700">One simple, transparent fee of <strong className="text-wine-800">{inr(apc.inr)} + {apc.gstPercent}% GST</strong> per accepted article ({usd(apc.usd)} for authors outside India, no GST). No hidden charges, no per-page fees, no extra cost for colour figures.</p>
        <p className="mb-6 mt-4 border-l-4 border-wine-700 bg-[#F4EEE6] p-4 font-work text-sm text-obsidian-800"><strong>Pay only after acceptance.</strong> Submission and peer review are free, and the decision is based purely on academic merit, never on payment.</p>
        <PayCard />
      </section>

      <section aria-labelledby="apc-included" className={card}>
        <Head id="apc-included" n={2} title="What is included in your publication fee" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {APC_INCLUDED.map(([t, d]) => (
            <li key={t} className="flex gap-3 rounded border border-[#E6DCD0] bg-[#F4EEE6] p-4"><MdOutlineVerified className="mt-0.5 h-5 w-5 shrink-0 text-wine-800" aria-hidden="true" /><span><strong className="block font-newsreader text-base text-obsidian-900">{t}</strong><span className="font-work text-sm leading-relaxed text-obsidian-700">{d}</span></span></li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="apc-how" className={card}>
        <Head id="apc-how" n={3} title="How it works" />
        <ol className="grid gap-3 sm:grid-cols-4">
          {APC_STEPS.map((t, i) => <li key={t} className="rounded border border-[#E6DCD0] bg-white p-4"><span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-wine-800 font-work text-sm font-bold text-white">{i + 1}</span><p className="mt-2 font-work text-sm font-semibold text-obsidian-900">{t}</p></li>)}
        </ol>
      </section>

      <section aria-labelledby="apc-institution" className={card}>
        <Head id="apc-institution" n={4} title="Institutional payment" />
        <p className="mb-4 flex gap-3 font-work text-[15px] leading-relaxed text-obsidian-700"><MdOutlineAccountBalance className="mt-1 h-6 w-6 shrink-0 text-wine-800" aria-hidden="true" />Universities, colleges, research labs, funding agencies and companies can pay the APC on behalf of their authors, with a GST tax invoice issued in the institution&apos;s name.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded border border-[#E6DCD0] p-4"><h3 className="font-newsreader text-base font-semibold text-obsidian-900">Option 1: Pay online</h3><p className="mt-1 font-work text-sm text-obsidian-700">Pay instantly by UPI, card or net banking using the institution&apos;s payment details. Best for quick publication.</p></div>
          <div className="rounded border border-[#E6DCD0] p-4"><h3 className="font-newsreader text-base font-semibold text-obsidian-900">Option 2: Bank transfer</h3><p className="mt-1 font-work text-sm text-obsidian-700">Request a proforma invoice, pay by NEFT, RTGS or IMPS, then email the transaction reference. Suitable for purchase-order based payments.</p></div>
        </div>
        <ul className="mt-4 space-y-2 font-work text-sm text-obsidian-800">{APC_INSTITUTION_NOTES.map((t) => <li key={t} className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />{t}</li>)}</ul>
        <a href={`mailto:${journal.email}?subject=${encodeURIComponent('Institutional payment for APC')}`} className="mt-5 inline-flex min-h-11 items-center rounded border border-wine-800 px-4 font-work text-sm font-bold text-wine-800 hover:bg-[#F4EEE6]">Request a proforma invoice</a>
      </section>

      <section aria-labelledby="apc-faq" className={card}>
        <Head id="apc-faq" n={5} title="Frequently asked questions" />
        <ul className="divide-y divide-[#E6DCD0] rounded border border-[#E6DCD0]">
          {faq.map(([q, a], i) => (
            <li key={q}>
              <h3><button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-work text-sm font-semibold text-obsidian-900 hover:bg-[#F4EEE6]">{q}<MdOutlineExpandMore className={cx('h-5 w-5 shrink-0 text-wine-800 transition-transform', open === i && 'rotate-180')} aria-hidden="true" /></button></h3>
              {open === i && <p className="px-4 pb-4 font-work text-sm leading-relaxed text-obsidian-700">{a}</p>}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-work text-sm text-obsidian-700">Questions about payment? Contact the editorial office at <a className="font-semibold text-wine-800 underline" href={`mailto:${journal.email}`}>{journal.email}</a>. <AppLink to={paths.policy('refund')} className="font-semibold text-wine-800 underline">Refund Policy</AppLink></p>
      </section>
    </>
  )
}
