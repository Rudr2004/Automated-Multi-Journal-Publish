// APC & payment mini-calculator built from journal.apc: India (INR + GST) or outside India (USD, no GST), for one to five articles.
import { useState } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import { ButtonLink } from '../../components/Button'
import { cx } from '../../components/primitives'
import { ArrowRight, Submit } from '../../icons'
import { HomeSection } from './HomeHead'

type Region = 'in' | 'intl'

export function ApcCalculator() {
  const { apc } = journal
  const [region, setRegion] = useState<Region>('in')
  const [count, setCount] = useState(1)
  const base = (region === 'in' ? apc.inr : apc.usd) * count
  const gst = region === 'in' ? Math.round((base * apc.gstPercent) / 100) : 0
  const sym = region === 'in' ? '₹' : 'US$'
  const row = 'flex items-baseline justify-between gap-3 py-2.5 tabular-nums'
  const opt = (id: Region, title: string, note: string) => (
    <label key={id} className={cx('flex cursor-pointer items-start gap-3 rounded border p-3 transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-wine-800', region === id ? 'border-wine-800 bg-wine-50' : 'border-obsidian-200 bg-white hover:border-wine-800')}>
      <input type="radio" name="apc-region" value={id} checked={region === id} onChange={() => setRegion(id)} className="mt-1 h-4 w-4 accent-wine-800" />
      <span><span className="block text-sm font-semibold text-obsidian-900">{title}</span><span className="block text-xs text-obsidian-600">{note}</span></span>
    </label>
  )
  return (
    <HomeSection id="apc-title" label="APC & payment" title="Know the charge before you submit" text="The article processing charge is due only after acceptance. Nothing is charged at submission or during review." bg="bg-[#FBF8F4]"
      action={<AppLink to={paths.forAuthors('apc-payment')} className="inline-flex items-center gap-1 text-sm font-semibold text-wine-800 hover:underline">Full payment details <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>}>
      <div className="grid gap-6 rounded border border-wine-800/20 bg-white p-5 sm:p-6 lg:grid-cols-2 lg:gap-10">
        <form onSubmit={(e) => e.preventDefault()} aria-label="APC calculator" className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-wine-800">Corresponding author based in</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {opt('in', 'India', `₹${formatNumber(apc.inr)} + ${apc.gstPercent}% GST`)}
              {opt('intl', 'Outside India', `US$${formatNumber(apc.usd)}, no GST`)}
            </div>
          </fieldset>
          <div>
            <p id="apc-count" className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-wine-800">Number of articles</p>
            <div role="group" aria-labelledby="apc-count" className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" aria-pressed={count === n} onClick={() => setCount(n)} className={cx('h-10 w-10 rounded border text-sm font-semibold tabular-nums transition-colors duration-150', count === n ? 'border-wine-800 bg-wine-800 text-white' : 'border-obsidian-300 bg-white text-obsidian-900 hover:border-wine-800 hover:text-wine-800')}>{n}</button>
              ))}
            </div>
          </div>
          <p className="font-serif4 text-[15px] leading-relaxed text-obsidian-600">Need a waiver? Request it with your submission; the editor-in-chief decides separately from the review.</p>
        </form>
        <div aria-live="polite" className="rounded border border-wine-800/20 bg-[#FBF8F4] p-5">
          <dl className="divide-y divide-wine-800/10 text-sm">
            <div className={row}><dt className="text-obsidian-700">APC × {count}</dt><dd className="font-semibold text-obsidian-900">{sym}{formatNumber(base)}</dd></div>
            {region === 'in' && <div className={row}><dt className="text-obsidian-700">GST at {apc.gstPercent}%</dt><dd className="font-semibold text-obsidian-900">₹{formatNumber(gst)}</dd></div>}
            <div className={cx(row, 'items-center pt-4')}><dt className="font-newsreader text-lg font-semibold text-obsidian-900">Total payable</dt><dd className="font-newsreader text-2xl font-semibold text-wine-800">{sym}{formatNumber(base + gst)}</dd></div>
          </dl>
          <ButtonLink to={paths.submit} className="mt-5 w-full"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
        </div>
      </div>
    </HomeSection>
  )
}
