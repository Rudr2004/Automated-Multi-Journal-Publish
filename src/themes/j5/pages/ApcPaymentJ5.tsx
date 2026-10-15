// "APC & Payment" body for J5 (IJFRD, wine and ochre): three payment routes with price breakup, what the charge covers, how it works, institutional notes and FAQ.
// Amounts come from journal.apc.
import { useState } from 'react'
import { MdOutlineAccountBalance, MdOutlineCheckCircle, MdOutlineCreditCard, MdOutlineExpandMore, MdOutlinePayments, MdOutlinePublic, MdOutlineVerified } from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { APC_INCLUDED, APC_INSTITUTION_NOTES, APC_STEPS, apcFaq } from '../../../core/lib/apcContent'
import { formatNumber } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { cx } from '../components/primitives'

const inr = (n: number) => `₹${formatNumber(n)}`
const usd = (n: number) => `US$${formatNumber(n)}`
const card = 'scroll-mt-28 rounded border border-[#E6DCD0] bg-white p-6 shadow-sm sm:p-8'
const btn = 'inline-flex h-11 w-full items-center justify-center gap-2 rounded px-4 font-work text-sm font-bold'

export const APC_TOC_J5 = [
  { id: 'apc-options', label: 'Payment options' }, { id: 'apc-included', label: 'What the charge covers' }, { id: 'apc-how', label: 'How it works' },
  { id: 'apc-institution', label: 'Institutional payment' }, { id: 'apc-faq', label: 'Frequently asked questions' },
]

function Head({ id, n, title }: { id: string; n: number; title: string }) {
  return (
    <div className="mb-5 border-b border-[#E6DCD0] pb-3">
      <p className="mb-1 flex items-center gap-2 font-work text-xs font-bold uppercase tracking-wider text-wine-800"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-wine-700" />Section {n}</p>
      <h2 id={id} className="scroll-mt-28 font-newsreader text-xl font-semibold text-obsidian-900 sm:text-2xl">{n}. {title}</h2>
    </div>
  )
}

function Route({ icon, tag, title, who, rows, methods, note, cta, wide }: {
  icon: React.ReactNode; tag: string; title: string; who: string; rows: { l: string; v: string; strong?: boolean }[]; methods: string[]; note?: string; cta: React.ReactNode; wide?: boolean
}) {
  return (
    <article className={cx('flex flex-col rounded border border-[#E6DCD0] bg-white', wide && 'lg:col-span-2')}>
      <header className="flex items-start gap-3 border-b border-[#E6DCD0] bg-[#F4EEE6] p-4">
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-wine-800 text-white">{icon}</span>
        <div><p className="font-work text-[11px] font-bold uppercase tracking-wider text-wine-800">{tag}</p><h3 className="font-newsreader text-lg font-semibold text-obsidian-900">{title}</h3><p className="font-work text-sm text-obsidian-600">{who}</p></div>
      </header>
      <div className={cx('grid flex-1 gap-6 p-4', wide && 'md:grid-cols-2')}>
        <div>
          <h4 className="font-work text-[11px] font-bold uppercase tracking-wider text-obsidian-600">Price breakup</h4>
          <dl className="mt-1 divide-y divide-[#E6DCD0]">
            {rows.map((r) => (
              <div key={r.l} className={cx('flex items-baseline justify-between gap-4 py-2', r.strong && 'border-t-2 border-wine-800 pt-3')}>
                <dt className={cx('font-work text-sm', r.strong ? 'font-bold text-obsidian-900' : 'text-obsidian-700')}>{r.l}</dt>
                <dd className={cx('tabular-nums', r.strong ? 'font-newsreader text-xl font-bold text-wine-800' : 'font-work text-sm font-semibold text-obsidian-900')}>{r.v}</dd>
              </div>
            ))}
          </dl>
          {note && <p className="mt-2 font-work text-xs leading-relaxed text-obsidian-600">{note}</p>}
        </div>
        <div className="flex flex-col">
          <h4 className="font-work text-[11px] font-bold uppercase tracking-wider text-obsidian-600">Ways to pay</h4>
          <ul className="mt-2 space-y-2">{methods.map((m) => <li key={m} className="flex gap-2 font-work text-sm text-obsidian-800"><MdOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />{m}</li>)}</ul>
          <div className="mt-auto pt-5">{cta}</div>
        </div>
      </div>
    </article>
  )
}

export function ApcPaymentJ5() {
  const { apc } = journal
  const gst = Math.round((apc.inr * apc.gstPercent) / 100)
  const total = apc.inr + gst
  const [open, setOpen] = useState<number | null>(0)
  const faq = apcFaq(apc.gstPercent)
  const pay = <AppLink to={paths.track} className={cx(btn, 'bg-wine-800 text-white hover:bg-wine-900')}><MdOutlinePayments className="h-5 w-5" aria-hidden="true" />Pay with your Manuscript ID</AppLink>
  return (
    <>
      <section aria-labelledby="apc-options" className={card}>
        <Head id="apc-options" n={1} title="Payment options" />
        <p className="mb-5 font-work text-[15px] leading-relaxed text-obsidian-700">There is no fee to submit or to be reviewed. After acceptance, choose the route that fits you. The charge is the same for every paper; only the currency and the invoice differ.</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <Route icon={<MdOutlineCreditCard className="h-6 w-6" />} tag="Standard payment" title="Author in India" who="You pay the charge yourself."
            rows={[{ l: 'Article processing charge (APC)', v: inr(apc.inr) }, { l: `CGST (${apc.gstPercent / 2}%)`, v: inr(gst / 2) }, { l: `SGST (${apc.gstPercent / 2}%)`, v: inr(gst / 2) }, { l: 'Total payable', v: inr(total), strong: true }]}
            note={`Authors in other states pay IGST of ${apc.gstPercent}% (${inr(gst)}) instead, so the total is the same.`}
            methods={['UPI, debit or credit card and net banking, paid online', 'Bank transfer or UPI, then upload the payment proof', 'GST invoice emailed after payment']} cta={pay} />
          <Route icon={<MdOutlineAccountBalance className="h-6 w-6" />} tag="Institutional payment" title="Institution, university or guide pays" who="Paid on your behalf, with the invoice in its name."
            rows={[{ l: 'Article processing charge (APC)', v: inr(apc.inr) }, { l: `GST (${apc.gstPercent}%)`, v: inr(gst) }, { l: 'Total payable', v: inr(total), strong: true }]}
            note="Send the institution's name, address and GSTIN to the editorial office before you pay."
            methods={['Pay online by UPI, card or net banking', 'Bank transfer against a proforma invoice (NEFT, RTGS or IMPS)', "GST invoice in the institution's name"]}
            cta={<a href={`mailto:${journal.email}?subject=${encodeURIComponent('Institutional payment for APC')}`} className={cx(btn, 'border border-[#E6DCD0] bg-white text-wine-800 hover:border-wine-700')}>Request a proforma invoice</a>} />
          <Route wide icon={<MdOutlinePublic className="h-6 w-6" />} tag="Foreign national payment" title="Author outside India" who="Paid in US dollars, with no GST."
            rows={[{ l: 'Article processing charge (APC)', v: usd(apc.usd) }, { l: 'GST', v: 'Not charged' }, { l: 'Total payable', v: usd(apc.usd), strong: true }]}
            note="Your bank may add its own foreign-transaction fee."
            methods={['International debit or credit card, paid online in USD', 'Bank transfer in USD, then upload the payment proof', 'Receipt emailed after payment']} cta={pay} />
        </div>
      </section>

      <section aria-labelledby="apc-included" className={card}>
        <Head id="apc-included" n={2} title="What the charge covers" />
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
        <p className="mt-4 border-l-4 border-wine-700 bg-[#F4EEE6] p-4 font-work text-sm text-obsidian-800"><strong>Pay only after acceptance.</strong> Submission and peer review are free, and the decision is based purely on academic merit, never on payment.</p>
      </section>

      <section aria-labelledby="apc-institution" className={card}>
        <Head id="apc-institution" n={4} title="Institutional payment" />
        <p className="mb-3 font-work text-[15px] leading-relaxed text-obsidian-700">Universities, colleges, research labs, funding agencies and companies can pay the APC on behalf of their authors, with a GST tax invoice issued in the institution&apos;s name.</p>
        <ul className="space-y-2 font-work text-sm text-obsidian-800">{APC_INSTITUTION_NOTES.map((t) => <li key={t} className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />{t}</li>)}</ul>
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
      </section>
    </>
  )
}
