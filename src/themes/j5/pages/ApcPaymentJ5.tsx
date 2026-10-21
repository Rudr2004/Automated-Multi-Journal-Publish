// "APC & Payment" body for J5 (IJFRD, wine and ochre), laid out like the client's APC prototype but with the three payment routes shown side by side:
// 01 standard (author in India), 02 institutional, 03 foreign national (USD). Picking a route sets the pay form below it. Then: what the fee includes,
// how it works, institutional payment and the FAQ. Amounts come from journal.apc.
import { useState, type FormEvent, type ReactNode } from 'react'
import {
  MdOutlineAccountBalance, MdOutlineCheckCircle, MdOutlineCreditCard, MdOutlineExpandMore, MdOutlineLock, MdOutlinePayments, MdOutlinePublic, MdOutlineVerified,
} from 'react-icons/md'
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

type Route = 'india' | 'institution' | 'abroad'

/** Three payment routes, side by side in this order; picking one sets the pay form below. */
function RouteCards({ route, onPick }: { route: Route; onPick: (r: Route) => void }) {
  const { apc } = journal
  const gst = Math.round((apc.inr * apc.gstPercent) / 100)
  const total = apc.inr + gst
  const cards: { id: Route; n: string; tag: string; title: string; who: string; icon: ReactNode; big: string; rows: [string, string][]; note: string }[] = [
    { id: 'india', n: '01', tag: 'Standard APC payment', title: 'Author in India', who: 'Individual authors pay the charge themselves.', icon: <MdOutlineCreditCard className="h-6 w-6" aria-hidden="true" />, big: inr(total),
      rows: [['APC', inr(apc.inr)], [`CGST (${apc.gstPercent / 2}%)`, inr(gst / 2)], [`SGST (${apc.gstPercent / 2}%)`, inr(gst / 2)]], note: `Other states: IGST ${apc.gstPercent}% (${inr(gst)}), same total.` },
    { id: 'institution', n: '02', tag: 'Institutional payment', title: 'University or institution', who: 'Colleges, universities and research bodies. Invoice in the institution’s name.', icon: <MdOutlineAccountBalance className="h-6 w-6" aria-hidden="true" />, big: inr(total),
      rows: [['APC', inr(apc.inr)], [`GST (${apc.gstPercent}%)`, inr(gst)]], note: 'Pay online, or by bank transfer against a proforma invoice.' },
    { id: 'abroad', n: '03', tag: 'Foreign national payment', title: 'Author outside India', who: 'International authors pay in US dollars.', icon: <MdOutlinePublic className="h-6 w-6" aria-hidden="true" />, big: usd(apc.usd),
      rows: [['APC', usd(apc.usd)], ['GST', 'Not charged']], note: 'Includes the Crossref DOI and a certificate for every author.' },
  ]
  return (
    <ul className="grid gap-4 lg:grid-cols-3" aria-label="Payment options">
      {cards.map((c) => {
        const on = route === c.id
        return (
          <li key={c.id}>
            <button type="button" aria-pressed={on} onClick={() => onPick(c.id)}
              className={cx('flex h-full w-full flex-col overflow-hidden rounded border-2 bg-white text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2', on ? 'border-wine-800 shadow-md' : 'border-[#E6DCD0] hover:border-wine-700')}>
              <span className={cx('flex min-h-[5.75rem] items-start gap-3 p-4', on ? 'bg-wine-800 text-white' : 'bg-[#F4EEE6] text-obsidian-900')}>
                <span aria-hidden="true" className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded', on ? 'bg-white/15' : 'bg-wine-800 text-white')}>{c.icon}</span>
                <span className="min-w-0">
                  <span className={cx('block font-work text-[11px] font-bold uppercase tracking-wider', on ? 'text-[#F5C9A8]' : 'text-wine-800')}>{c.n} · {c.tag}</span>
                  <span className="block font-newsreader text-lg font-semibold leading-snug">{c.title}</span>
                </span>
              </span>
              <span className="flex flex-1 flex-col p-4">
                <span className="font-work text-xs text-obsidian-600">{c.who}</span>
                <span className="mt-3 font-newsreader text-4xl font-bold tabular-nums text-wine-800">{c.big}</span>
                <span className="font-work text-xs text-obsidian-600">total payable, per article</span>
                <span className="mt-3 block divide-y divide-[#EADFD2] border-y border-[#EADFD2] font-work text-sm">
                  {c.rows.map(([k, v]) => <span key={k} className="flex justify-between py-1.5"><span className="text-obsidian-700">{k}</span><span className="font-semibold tabular-nums text-obsidian-900">{v}</span></span>)}
                </span>
                <span className="mt-2 font-work text-xs leading-relaxed text-obsidian-600">{c.note}</span>
                <span className={cx('mt-auto inline-flex items-center gap-1.5 pt-3 font-work text-xs font-bold uppercase tracking-wider', on ? 'text-wine-800' : 'text-obsidian-600')}>
                  {on ? <><MdOutlineCheckCircle className="h-4 w-4" aria-hidden="true" />Selected</> : 'Select this option'}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function PayForm({ route }: { route: Route }) {
  const { apc } = journal
  const { navigate } = useRouter()
  const toast = useToast()
  const [method, setMethod] = useState<'online' | 'bank'>('online')
  const [v, setV] = useState({ mid: '', name: '', email: '', gstin: '', org: '', dept: '', addr: '', po: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }))
  const india = route !== 'abroad'
  const inst = route === 'institution'
  const gst = india ? Math.round((apc.inr * apc.gstPercent) / 100) : 0
  const total = (india ? apc.inr : apc.usd) + gst
  const money = india ? inr : usd
  const proforma = inst && method === 'bank'
  const label = route === 'india' ? 'Standard APC payment · Author in India' : inst ? 'Institutional payment' : 'Foreign national payment · Author outside India'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    const mid = validate.paperId(v.mid.trim().toUpperCase()); if (mid) next.mid = mid
    if (!v.name.trim()) next.name = inst ? 'Enter the contact person’s name.' : 'Enter your full name.'
    const mail = validate.email(v.email); if (mail) next.email = mail
    if (india && v.gstin.trim() && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v.gstin.trim().toUpperCase())) next.gstin = 'GSTIN has 15 characters, e.g. 24AABCE4821F1Z5.'
    if (inst) {
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
    <form onSubmit={submit} noValidate aria-label="Pay the article processing charge" className="overflow-hidden rounded border border-[#E6DCD0] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6DCD0] bg-[#F4EEE6] px-5 py-3">
        <div><p className="font-work text-[11px] font-bold uppercase tracking-wider text-wine-800">Your payment</p><h3 className="font-newsreader text-lg font-semibold text-obsidian-900">{label}</h3></div>
        <p className="text-right"><span className="block font-work text-[11px] uppercase tracking-wider text-obsidian-600">Total payable</span><span className="font-newsreader text-2xl font-bold tabular-nums text-wine-800">{money(total)}</span></p>
      </div>
      <div className="grid gap-x-5 p-5 sm:grid-cols-2">
        <div>
          <label htmlFor="apc-mid" className={lab}>Manuscript ID</label>
          <input id="apc-mid" value={v.mid} onChange={set('mid')} placeholder={`e.g. ${idExample}`} autoComplete="off" className={field} {...aria('mid')} />{msg('mid')}
        </div>
        <div>
          <label htmlFor="apc-name" className={lab}>{inst ? 'Contact person name' : 'Corresponding author name'}</label>
          <input id="apc-name" value={v.name} onChange={set('name')} placeholder="Full name" autoComplete="name" className={field} {...aria('name')} />{msg('name')}
        </div>
        <div>
          <label htmlFor="apc-email" className={lab}>Email</label>
          <input id="apc-email" type="email" value={v.email} onChange={set('email')} placeholder="name@university.edu" autoComplete="email" className={field} {...aria('email')} />{msg('email')}
        </div>
        {india && (
          <div>
            <label htmlFor="apc-gstin" className={lab}>{inst ? 'Institution GSTIN (for tax invoice)' : 'GSTIN (optional, for business invoice)'}</label>
            <input id="apc-gstin" value={v.gstin} onChange={(e) => setV((s) => ({ ...s, gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15) }))} placeholder="15-character GSTIN" maxLength={15} autoComplete="off" className={cx(field, 'font-mono')} {...aria('gstin')} />{msg('gstin')}
          </div>
        )}
        {inst && (
          <>
            <div>
              <label htmlFor="apc-org" className={lab}>Institution / organisation name</label>
              <input id="apc-org" value={v.org} onChange={set('org')} placeholder="Name as it should appear on the invoice" autoComplete="organization" className={field} {...aria('org')} />{msg('org')}
            </div>
            <div>
              <label htmlFor="apc-dept" className={lab}>Department (optional)</label>
              <input id="apc-dept" value={v.dept} onChange={set('dept')} placeholder="Department or cost centre" className={field} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="apc-addr" className={lab}>Billing address</label>
              <input id="apc-addr" value={v.addr} onChange={set('addr')} placeholder="Address, city, state, PIN" autoComplete="street-address" className={field} {...aria('addr')} />{msg('addr')}
            </div>
            <div>
              <label htmlFor="apc-po" className={lab}>Purchase order / reference no. (optional)</label>
              <input id="apc-po" value={v.po} onChange={set('po')} placeholder="PO or sanction number" className={field} />
            </div>
            <div>
              <label htmlFor="apc-method" className={lab}>Payment method</label>
              <select id="apc-method" value={method} onChange={(e) => setMethod(e.target.value as 'online' | 'bank')} className={field}>
                <option value="online">Pay online now (UPI / card / net banking)</option>
                <option value="bank">Bank transfer against proforma invoice</option>
              </select>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 border-t border-[#E6DCD0] bg-[#FBF7F1] px-5 py-4">
        <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-wine-800 px-6 font-work text-sm font-bold text-white transition-colors hover:bg-wine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2">
          <MdOutlinePayments className="h-5 w-5" aria-hidden="true" />{proforma ? 'Request proforma invoice' : 'Proceed to secure payment'}
        </button>
        <p className="min-w-0 flex-1 font-work text-xs text-obsidian-600">
          <span className="mb-1 flex flex-wrap items-center gap-1.5 font-medium text-obsidian-700"><MdOutlineLock className="h-3.5 w-3.5" aria-hidden="true" />Secure payment · UPI · Cards · Net banking</span>
          {proforma ? 'We email a proforma invoice with bank details. A GST tax invoice is issued after payment is confirmed.' : 'Available only for accepted manuscripts. A GST invoice is emailed after payment.'}
        </p>
      </div>
    </form>
  )
}

export function ApcPaymentJ5() {
  const { apc } = journal
  const [open, setOpen] = useState<number | null>(0)
  const [route, setRoute] = useState<Route>('india')
  const faq = apcFaq(apc.gstPercent)
  return (
    <>
      <section aria-labelledby="apc-options" className="overflow-hidden rounded border border-[#E6DCD0] bg-white shadow-sm">
        <div className="bg-wine-800 px-5 py-7 text-white sm:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-work text-[11px] font-bold uppercase tracking-wider text-[#F5C9A8]"><MdOutlineVerified className="h-4 w-4" aria-hidden="true" />Open Access • Peer-Reviewed</span>
          <h2 id="apc-options" className="mt-3 scroll-mt-28 font-newsreader text-3xl font-semibold sm:text-4xl">Article Processing Charge (APC)</h2>
          <p className="mt-2 max-w-3xl font-work text-[15px] leading-relaxed text-white/85">One simple, transparent fee of <strong className="text-white">{inr(apc.inr)} + {apc.gstPercent}% GST</strong> per accepted article ({usd(apc.usd)} for authors outside India, no GST). No hidden charges, no per-page fees, no extra cost for colour figures.</p>
          <p className="mt-4 inline-flex items-start gap-2 rounded border border-white/25 bg-white/10 px-4 py-2.5 font-work text-sm"><MdOutlineLock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span><strong>Pay only after acceptance.</strong> Submission and peer review are free, and the decision is based purely on academic merit, never on payment.</span></p>
        </div>
        <div className="space-y-6 p-5 sm:p-8">
          <div>
            <h3 className="font-newsreader text-xl font-semibold text-obsidian-900">1. Choose how the fee is paid</h3>
            <p className="mt-1 font-work text-sm text-obsidian-600">The charge is the same for every paper; only the currency and the invoice differ.</p>
          </div>
          <RouteCards route={route} onPick={setRoute} />
          <div>
            <h3 className="mb-3 font-newsreader text-xl font-semibold text-obsidian-900">2. Enter your details</h3>
            <PayForm key={route} route={route} />
          </div>
        </div>
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
