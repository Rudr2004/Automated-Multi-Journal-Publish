// "APC & Payment" body for J1 (Scholar Navy): three payment routes with price breakup, what the charge covers, how it works, institutional notes and FAQ.
// Amounts come from journal.apc.
import { useState } from 'react'
import { MdOutlineAccountBalance, MdOutlineCheckCircle, MdOutlineCreditCard, MdOutlineExpandMore, MdOutlinePayments, MdOutlinePublic, MdOutlineVerified } from 'react-icons/md'
import { journal } from '../../../../config/journals/j1'
import { paths } from '../../../../config/routes'
import { APC_INCLUDED, APC_INSTITUTION_NOTES, APC_STEPS, apcFaq } from '../../../../core/lib/apcContent'
import { formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

const inr = (n: number) => `₹${formatNumber(n)}`
const usd = (n: number) => `US$${formatNumber(n)}`
const card = 'border border-line bg-white'
const btn = 'inline-flex h-11 w-full items-center justify-center gap-2 border px-4 text-sm font-bold'

export const APC_OUTLINE_J1 = [
  { id: 'sec-1', label: 'Payment options' }, { id: 'sec-2', label: 'What the charge covers' }, { id: 'sec-3', label: 'How it works' },
  { id: 'sec-4', label: 'Institutional payment' }, { id: 'faq-section', label: 'Frequently Asked Questions' },
]

function Title({ n, children }: { n: number; children: string }) {
  return <h2 className="flex items-center gap-3 font-serif text-xl font-semibold text-navy"><span aria-hidden="true" className="flex h-7 min-w-[1.75rem] items-center justify-center bg-navy px-1.5 font-sans text-xs font-bold text-white">{n}</span>{children}</h2>
}

function Route({ icon, tag, title, who, rows, methods, note, cta, wide }: {
  icon: React.ReactNode; tag: string; title: string; who: string; rows: { l: string; v: string; strong?: boolean }[]; methods: string[]; note?: string; cta: React.ReactNode; wide?: boolean
}) {
  return (
    <article className={cx(card, 'flex flex-col', wide && 'lg:col-span-2')}>
      <header className="flex items-start gap-3 border-b border-line bg-mist p-4">
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy text-white">{icon}</span>
        <div><p className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">{tag}</p><h3 className="font-serif text-lg font-semibold text-navy">{title}</h3><p className="text-sm text-ink-muted">{who}</p></div>
      </header>
      <div className={cx('grid flex-1 gap-6 p-4', wide && 'md:grid-cols-2')}>
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Price breakup</h4>
          <dl className="mt-1 divide-y divide-line">
            {rows.map((r) => (
              <div key={r.l} className={cx('flex items-baseline justify-between gap-4 py-2', r.strong && 'border-t-2 border-navy pt-3')}>
                <dt className={cx('text-sm', r.strong ? 'font-bold text-navy' : 'text-ink-muted')}>{r.l}</dt>
                <dd className={cx('tabular-nums', r.strong ? 'font-serif text-xl font-bold text-navy' : 'text-sm font-semibold text-ink')}>{r.v}</dd>
              </div>
            ))}
          </dl>
          {note && <p className="mt-2 text-xs leading-relaxed text-ink-muted">{note}</p>}
        </div>
        <div className="flex flex-col">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Ways to pay</h4>
          <ul className="mt-2 space-y-2">{methods.map((m) => <li key={m} className="flex gap-2 text-sm text-ink"><MdOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-oa" aria-hidden />{m}</li>)}</ul>
          <div className="mt-auto pt-5">{cta}</div>
        </div>
      </div>
    </article>
  )
}

export function ApcPaymentJ1() {
  const { apc } = journal
  const gst = Math.round((apc.inr * apc.gstPercent) / 100)
  const total = apc.inr + gst
  const [open, setOpen] = useState<number | null>(0)
  const faq = apcFaq(apc.gstPercent)
  const pay = <AppLink to={paths.track} className={cx(btn, 'border-navy bg-navy text-white hover:bg-navy-900')}><MdOutlinePayments className="h-5 w-5" aria-hidden />Pay with your Manuscript ID</AppLink>
  return (
    <>
      <section id="sec-1" className="scroll-mt-24 space-y-4">
        <Title n={1}>Payment options</Title>
        <p className="text-base leading-[1.75] text-ink">There is no fee to submit or to be reviewed. After acceptance, choose the route that fits you. The charge is the same for every paper; only the currency and the invoice differ.</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <Route icon={<MdOutlineCreditCard className="h-6 w-6" />} tag="Standard payment" title="Author in India" who="You pay the charge yourself."
            rows={[{ l: 'Article processing charge (APC)', v: inr(apc.inr) }, { l: `CGST (${apc.gstPercent / 2}%)`, v: inr(gst / 2) }, { l: `SGST (${apc.gstPercent / 2}%)`, v: inr(gst / 2) }, { l: 'Total payable', v: inr(total), strong: true }]}
            note={`Authors in other states pay IGST of ${apc.gstPercent}% (${inr(gst)}) instead, so the total is the same.`}
            methods={['UPI, debit or credit card and net banking, paid online', 'Bank transfer or UPI, then upload the payment proof', 'GST invoice emailed after payment']} cta={pay} />
          <Route icon={<MdOutlineAccountBalance className="h-6 w-6" />} tag="Institutional payment" title="Institution, university or guide pays" who="Paid on your behalf, with the invoice in its name."
            rows={[{ l: 'Article processing charge (APC)', v: inr(apc.inr) }, { l: `GST (${apc.gstPercent}%)`, v: inr(gst) }, { l: 'Total payable', v: inr(total), strong: true }]}
            note="Send the institution's name, address and GSTIN to the editorial office before you pay."
            methods={['Pay online by UPI, card or net banking', 'Bank transfer against a proforma invoice (NEFT, RTGS or IMPS)', "GST invoice in the institution's name"]}
            cta={<a href={`mailto:${journal.email}?subject=${encodeURIComponent('Institutional payment for APC')}`} className={cx(btn, 'border-line bg-white text-navy hover:border-scholar')}>Request a proforma invoice</a>} />
          <Route wide icon={<MdOutlinePublic className="h-6 w-6" />} tag="Foreign national payment" title="Author outside India" who="Paid in US dollars, with no GST."
            rows={[{ l: 'Article processing charge (APC)', v: usd(apc.usd) }, { l: 'GST', v: 'Not charged' }, { l: 'Total payable', v: usd(apc.usd), strong: true }]}
            note="Includes the Crossref DOI and a certificate for every author, the same as for authors in India. Your bank may add its own foreign-transaction fee."
            methods={['International debit or credit card, paid online in USD', 'Bank transfer in USD, then upload the payment proof', 'Receipt emailed after payment']} cta={pay} />
        </div>
      </section>

      <section id="sec-2" className="scroll-mt-24 space-y-4 border-t border-line pt-6">
        <Title n={2}>What the charge covers</Title>
        <ul className="grid gap-3 sm:grid-cols-2">
          {APC_INCLUDED.map(([t, d]) => (
            <li key={t} className="flex gap-3 border border-line bg-mist p-4"><MdOutlineVerified className="mt-0.5 h-5 w-5 shrink-0 text-scholar" aria-hidden /><span><strong className="block font-serif text-base text-navy">{t}</strong><span className="text-sm leading-relaxed text-ink-muted">{d}</span></span></li>
          ))}
        </ul>
      </section>

      <section id="sec-3" className="scroll-mt-24 space-y-4 border-t border-line pt-6">
        <Title n={3}>How it works</Title>
        <ol className="grid gap-3 sm:grid-cols-4">
          {APC_STEPS.map((t, i) => <li key={t} className="border border-line bg-white p-4"><span aria-hidden="true" className="flex h-8 w-8 items-center justify-center bg-scholar text-sm font-bold text-white">{i + 1}</span><p className="mt-2 text-sm font-semibold text-navy">{t}</p></li>)}
        </ol>
        <p className="border-l-4 border-scholar bg-scholar-soft p-4 text-sm text-ink"><strong className="text-navy">Pay only after acceptance.</strong> Submission and peer review are free, and the decision is based purely on academic merit, never on payment.</p>
      </section>

      <section id="sec-4" className="scroll-mt-24 space-y-4 border-t border-line pt-6">
        <Title n={4}>Institutional payment</Title>
        <p className="text-base leading-[1.75] text-ink">Universities, colleges, research labs, funding agencies and companies can pay the APC on behalf of their authors, with a GST tax invoice issued in the institution&apos;s name.</p>
        <ul className="space-y-2 text-sm text-ink">{APC_INSTITUTION_NOTES.map((t) => <li key={t} className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-oa" aria-hidden />{t}</li>)}</ul>
      </section>

      <section id="faq-section" className="scroll-mt-24 space-y-4 border-t border-line pt-6">
        <h2 className="font-serif text-xl font-semibold text-navy">Frequently Asked Questions</h2>
        <ul className="divide-y divide-line border border-line">
          {faq.map(([q, a], i) => (
            <li key={q}>
              <h3><button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-navy hover:bg-mist">{q}<MdOutlineExpandMore className={cx('h-5 w-5 shrink-0 text-scholar transition-transform', open === i && 'rotate-180')} aria-hidden /></button></h3>
              {open === i && <p className="px-4 pb-4 text-sm leading-relaxed text-ink-muted">{a}</p>}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
