// "APC & Payment" page body for J2 (JIMRT). Each payment route is a "fee ticket": a coloured stub with the route number and the total payable, a
// perforated edge, and a body with the price ledger, the ways to pay and the action. The three tickets come in the order: standard (India),
// institutional, foreign national. Below: what the fee includes, a four-step timeline and the FAQ.
// Every amount comes from `journal.apc`; the actions (track page with the Manuscript ID, proforma by email) are the existing ones.
import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  MdOutlineAccountBalance, MdOutlineCheckCircle, MdOutlineCreditCard, MdOutlineExpandMore, MdOutlineLock, MdOutlinePayments, MdOutlinePublic,
  MdOutlineReceiptLong, MdOutlineSchool, MdOutlineVerified,
} from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { APC_INCLUDED, APC_INSTITUTION_NOTES, APC_STEPS, apcFaq } from '../../../../core/lib/apcContent'
import { formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import { cx } from '../../components/primitives'

const inr = (n: number) => `₹${formatNumber(n)}`
const usd = (n: number) => `US$${formatNumber(n)}`

// Warm paper surface and ink lines: deliberately different from the cool white cards used elsewhere on the site.
const paper = 'bg-[#FBF7EE]'
const rule = 'border-[#E4DAC4]'
const cta = 'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-soft px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-700'

type Row = { label: string; value: string; strong?: boolean }

function Ticket({ n, tag, title, who, icon, stub, total, totalNote, rows, note, methods, extra, action }: {
  n: number; tag: string; title: string; who: string; icon: ReactNode; stub: string; total: string; totalNote: string
  rows: Row[]; note?: string; methods: string[]; extra?: ReactNode; action: ReactNode
}) {
  return (
    <article aria-labelledby={`apc-route-${n}`} className={cx('overflow-hidden rounded-sheet border bg-white shadow-card md:grid md:grid-cols-[250px_1fr]', rule)}>
      {/* Stub */}
      <div className={cx('relative flex flex-col justify-between gap-6 p-6 text-white md:border-r-2 md:border-dashed md:border-white/40', stub)}>
        <div>
          <span aria-hidden="true" className="font-display text-6xl font-bold leading-none text-white/25">0{n}</span>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">{tag}</p>
          <h3 id={`apc-route-${n}`} className="mt-1 font-display text-xl font-bold leading-snug">{title}</h3>
          <p className="mt-1 text-sm text-white/80">{who}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">Total payable</p>
          <p className="font-display text-4xl font-bold leading-tight tabular-nums">{total}</p>
          <p className="mt-0.5 text-xs text-white/80">{totalNote}</p>
        </div>
        <span aria-hidden="true" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 md:right-5">{icon}</span>
      </div>

      {/* Body */}
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-graphite-600">Price breakup</h4>
          <dl className="mt-2">
            {rows.map((r) => (
              <div key={r.label} className={cx('flex items-baseline justify-between gap-4 border-b border-dotted py-2.5', rule, r.strong && 'border-b-0 border-t-2 border-solid border-t-graphite-800 pt-3')}>
                <dt className={cx('text-sm', r.strong ? 'font-bold text-graphite-900' : 'text-graphite-700')}>{r.label}</dt>
                <dd className={cx('text-right tabular-nums', r.strong ? 'font-display text-xl font-bold text-brand-800' : 'text-sm font-semibold text-graphite-900')}>{r.value}</dd>
              </div>
            ))}
          </dl>
          {note && <p className="mt-2 text-xs leading-relaxed text-graphite-600">{note}</p>}
        </div>
        <div className="flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-graphite-600">Ways to pay</h4>
          <ul className="mt-2 space-y-2">
            {methods.map((m) => <li key={m} className="flex gap-2.5 text-sm text-graphite-800"><MdOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />{m}</li>)}
          </ul>
          <div className="mt-auto pt-5">{action}</div>
        </div>
        {extra && <div className="lg:col-span-2">{extra}</div>}
      </div>
    </article>
  )
}

function SectionLabel({ id, kicker, title, text }: { id: string; kicker: string; title: string; text?: string }) {
  return (
    <header>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">{kicker}</p>
      <h2 id={id} className="mt-1 scroll-mt-28 font-display text-2xl font-bold tracking-tight text-graphite-900 sm:text-3xl">{title}</h2>
      {text && <p className="mt-2 max-w-3xl text-[1.0625rem] leading-relaxed text-graphite-700">{text}</p>}
    </header>
  )
}

export function ApcPayment() {
  const { apc } = journal
  const gst = Math.round((apc.inr * apc.gstPercent) / 100)
  const half = gst / 2
  const total = apc.inr + gst
  const faq = apcFaq(apc.gstPercent)
  const [open, setOpen] = useState<number | null>(0)
  const [notes, setNotes] = useState(false)
  const pay = (label: string, tone: string) => (
    <AppLink to={paths.track} className={cx(cta, tone)}><MdOutlinePayments className="h-5 w-5" aria-hidden="true" />{label}</AppLink>
  )

  return (
    <>
      {/* Intro band */}
      <section aria-label="Fee summary" className="overflow-hidden rounded-sheet bg-brand-900 text-white shadow-card">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-100"><MdOutlineLock className="h-3.5 w-3.5" aria-hidden="true" />Pay only after acceptance</p>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl">One fee per accepted article. Nothing to pay to submit or to be reviewed.</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-100">The decision is based on academic merit alone. After acceptance, pick the route below that matches who is paying.</p>
          </div>
          <ol className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            {[['01', 'Author in India'], ['02', 'Institution'], ['03', 'Outside India']].map(([k, v]) => (
              <li key={k}><a href={`#apc-route-${Number(k)}`} className="block rounded-soft border border-white/25 bg-white/10 px-2 py-3 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <span className="block font-display text-xl font-bold text-brand-200">{k}</span>{v}
              </a></li>
            ))}
          </ol>
        </div>
      </section>

      {/* Three routes */}
      <section aria-labelledby="apc-options" className="space-y-5">
        <SectionLabel id="apc-options" kicker="Payment options" title="Choose how the fee is paid" text="The charge is the same for every paper; only the currency and the invoice differ." />
        <div className="space-y-5">
          <Ticket n={1} tag="Standard APC payment" title="Individual author in India" who="You pay the charge yourself." icon={<MdOutlineCreditCard className="h-5 w-5" aria-hidden="true" />}
            stub="bg-brand-800" total={inr(total)} totalNote={`${inr(apc.inr)} + ${apc.gstPercent}% GST`}
            rows={[
              { label: 'Article processing charge (APC)', value: inr(apc.inr) },
              { label: `CGST (${apc.gstPercent / 2}%)`, value: inr(half) },
              { label: `SGST (${apc.gstPercent / 2}%)`, value: inr(half) },
              { label: 'Total payable', value: inr(total), strong: true },
            ]}
            note={`CGST and SGST apply within Karnataka; authors in other states pay IGST of ${apc.gstPercent}% (${inr(gst)}) instead, so the total is the same.`}
            methods={['UPI, debit or credit card and net banking, paid online', 'Bank transfer or UPI to our account, then upload the payment proof', 'GST invoice emailed after payment']}
            action={pay('Pay with your Manuscript ID', 'bg-brand-800 text-white hover:bg-brand-900')} />

          <Ticket n={2} tag="Institutional payment" title="University, college or institution" who="Your institution or research guide pays on your behalf." icon={<MdOutlineAccountBalance className="h-5 w-5" aria-hidden="true" />}
            stub="bg-accent-800" total={inr(total)} totalNote={`${inr(apc.inr)} + ${apc.gstPercent}% GST, invoiced to the institution`}
            rows={[
              { label: 'Article processing charge (APC)', value: inr(apc.inr) },
              { label: `GST (${apc.gstPercent}%)`, value: inr(gst) },
              { label: 'Total payable', value: inr(total), strong: true },
            ]}
            note="The tax invoice is raised in the institution's name. Send its name, address and GSTIN to the editorial office before you pay."
            methods={['Option 1: pay online by UPI, card or net banking with the institution’s details', 'Option 2: bank transfer (NEFT, RTGS or IMPS) against a proforma invoice, then email the transaction reference', 'GST invoice in the institution’s name']}
            action={<a href={`mailto:${journal.email}?subject=${encodeURIComponent('Institutional payment for APC')}`} className={cx(cta, 'border-2 border-accent-800 bg-white text-accent-800 hover:bg-accent-50')}><MdOutlineReceiptLong className="h-5 w-5" aria-hidden="true" />Request a proforma invoice</a>}
            extra={(
              <div className={cx('rounded-soft border', rule, paper)}>
                <button type="button" aria-expanded={notes} onClick={() => setNotes((v) => !v)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold text-graphite-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700">
                  Invoice and billing options
                  <MdOutlineExpandMore className={cx('h-5 w-5 shrink-0 text-accent-800 transition-transform', notes && 'rotate-180')} aria-hidden="true" />
                </button>
                {notes && <ul className="space-y-2 px-4 pb-4 text-sm text-graphite-800">{APC_INSTITUTION_NOTES.map((t) => <li key={t} className="flex gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" aria-hidden="true" />{t}</li>)}</ul>}
              </div>
            )} />

          <Ticket n={3} tag="Foreign national payment" title="Author outside India" who="Paid in US dollars, with no GST." icon={<MdOutlinePublic className="h-5 w-5" aria-hidden="true" />}
            stub="bg-graphite-800" total={usd(apc.usd)} totalNote="Per article, no GST"
            rows={[
              { label: 'Article processing charge (APC)', value: usd(apc.usd) },
              { label: 'GST', value: 'Not charged' },
              { label: 'Total payable', value: usd(apc.usd), strong: true },
            ]}
            note="Includes the Crossref DOI and a certificate for every author, the same as for authors in India. Your bank may add its own foreign-transaction fee."
            methods={['International debit or credit card, paid online in USD', 'Bank transfer in USD, then upload the payment proof', 'Receipt emailed after payment']}
            action={pay('Pay with your Manuscript ID', 'bg-graphite-800 text-white hover:bg-graphite-900')} />
        </div>
        <p className="flex items-center gap-2 text-xs text-graphite-600"><MdOutlineLock className="h-4 w-4 text-brand-700" aria-hidden="true" />Payments go through a secure payment gateway. UPI, cards and net banking are accepted.</p>
      </section>

      {/* What the fee includes */}
      <section aria-labelledby="apc-included" className={cx('space-y-5 rounded-sheet border p-5 sm:p-8', rule, paper)}>
        <SectionLabel id="apc-included" kicker="What you get" title="Included in the fee" text="One charge covers everything from review to a permanent, citable article. There are no extra fees for the DOI or the certificates." />
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {APC_INCLUDED.map(([t, d]) => (
            <li key={t} className="flex gap-3 border-b border-dotted border-[#CDBE9C] pb-4">
              <MdOutlineVerified className="mt-0.5 h-6 w-6 shrink-0 text-brand-700" aria-hidden="true" />
              <span><strong className="block font-display text-base font-bold text-graphite-900">{t}</strong><span className="text-sm leading-relaxed text-graphite-700">{d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <section aria-labelledby="apc-how" className="space-y-5">
        <SectionLabel id="apc-how" kicker="How it works" title="From submission to publication" />
        <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
          <span aria-hidden="true" className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-0.5 bg-brand-200 max-md:block md:left-[12%] md:right-[12%] md:top-5 md:h-0.5 md:w-auto" />
          {APC_STEPS.map((t, i) => (
            <li key={t} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              <span aria-hidden="true" className={cx('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base font-bold', i === 2 ? 'bg-cta-700 text-white' : 'bg-brand-800 text-white')}>{i + 1}</span>
              <p className="pt-1.5 text-sm font-semibold leading-snug text-graphite-900 md:pt-0">{t}</p>
            </li>
          ))}
        </ol>
        <aside role="note" className="rounded-soft border-l-4 border-cta-700 bg-cta-50 p-4 text-sm text-graphite-800">
          <strong className="font-display text-graphite-900">Waivers and refunds.</strong> Request a waiver with your submission; the editor-in-chief decides it separately from the review. Refunds apply to duplicate payments or if a paper cannot be published, see the <AppLink to={paths.policy('refund')} className="font-semibold text-accent-800 underline">Refund Policy</AppLink>.
        </aside>
      </section>

      {/* FAQ */}
      <section aria-labelledby="apc-faq" className="space-y-4">
        <SectionLabel id="apc-faq" kicker="Questions" title="Frequently asked questions" />
        <ul className={cx('divide-y overflow-hidden rounded-sheet border bg-white', rule, 'divide-[#E4DAC4]')}>
          {faq.map(([q, a], i) => (
            <li key={q}>
              <h3><button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-display text-[15px] font-semibold text-graphite-900 hover:bg-[#FBF7EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-700">
                {q}<MdOutlineExpandMore className={cx('h-5 w-5 shrink-0 text-accent-800 transition-transform', open === i && 'rotate-180')} aria-hidden="true" />
              </button></h3>
              {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-graphite-700">{a}</p>}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <AppLink to={paths.submit} className="inline-flex items-center gap-2 rounded-soft bg-cta-700 px-5 py-3 text-sm font-bold text-white hover:bg-cta-800">Submit your manuscript</AppLink>
          <a href={`mailto:${journal.email}`} className="inline-flex items-center gap-2 rounded-soft border-2 border-brand-800 bg-white px-5 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50"><MdOutlineSchool className="h-5 w-5" aria-hidden="true" />Ask about payment</a>
        </div>
      </section>
    </>
  )
}
