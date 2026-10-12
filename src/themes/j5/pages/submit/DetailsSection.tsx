// Section A: manuscript classification and abstract (title, type, research area, abstract, keywords).
import { useId } from 'react'
import { journal } from '../../../../config/journals'
import { ABSTRACT_MAX_WORDS, ABSTRACT_MIN_WORDS, LIMITS, wordCount } from '../../../../core/lib/submission'
import { parseKeywords } from '../../../../core/lib/validators'
import { ARTICLE_TYPES, type ArticleType } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { Fld, Section, inp, type SectionProps } from './shared'

const TYPE_NOTES: Record<string, string> = {
  'Research Article': 'Original study with method, results and discussion.',
  'Review Article': 'Critical synthesis of existing work on one topic.',
  'Short Communication': 'Brief report of a focused, timely result.',
}

export function DetailsSection({ form, errors, setForm }: SectionProps) {
  const errId = useId()
  const words = wordCount(form.abstract)
  const kw = parseKeywords(form.keywords)
  const bad = words > 0 && (words < ABSTRACT_MIN_WORDS || words > ABSTRACT_MAX_WORDS)
  return (
    <Section letter="A" id="details" title="Manuscript Classification & Abstract" note="Step 1 of 4">
      <Fld label="Manuscript Full Title" name="title" required error={errors.title} counter={`${form.title.length} / ${LIMITS.title} characters`} hint="Use the full title, without abbreviations where possible.">
        <input className={inp(errors.title)} value={form.title} maxLength={LIMITS.title} autoComplete="off" placeholder="e.g. Seismic retrofit of masonry school buildings using ferrocement jackets"
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value.replace(/\s{2,}/g, ' ') }))} onBlur={() => setForm((f) => ({ ...f, title: f.title.trim() }))} />
      </Fld>

      <div className="grid gap-5 md:grid-cols-2">
        <fieldset aria-describedby={errors.articleType ? errId : undefined}>
          <legend className="mb-1.5 font-work text-[13px] font-semibold tracking-[0.02em] text-[#141B2B]">Article Classification <span className="text-red-700" aria-hidden="true">*</span></legend>
          <div className="space-y-2">
            {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t) => {
              const checked = form.articleType === t
              return (
                <label key={t} className={cx('flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border p-3 shadow-sm focus-within:ring-2 focus-within:ring-wine-800/30',
                  checked ? 'border-wine-800 bg-[#F1F3FF]' : errors.articleType ? 'border-red-700 bg-red-50' : 'border-[#DCC0BE]/60 bg-white hover:border-[#897270]')}>
                  <input type="radio" name="articleType" value={t} checked={checked} aria-invalid={errors.articleType ? true : undefined}
                    onChange={() => setForm((f) => ({ ...f, articleType: t as ArticleType }))} className="mt-1 h-4 w-4 shrink-0 accent-wine-800" />
                  <span><span className="block font-serif4 text-[15px] font-semibold text-[#141B2B]">{t}</span><span className="block font-work text-xs leading-[18px] text-[#564241]">{TYPE_NOTES[t]}</span></span>
                </label>
              )
            })}
          </div>
          {errors.articleType && <p id={errId} role="alert" className="mt-1.5 font-work text-[13px] font-semibold text-red-700">{errors.articleType}</p>}
        </fieldset>

        <Fld label="Primary Academic Track / Field" name="subject" required error={errors.subject} hint="Editors use this to route your paper to the right section.">
          <select className={inp(errors.subject)} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}>
            <option value="">Select an area</option>
            {journal.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Fld>
      </div>

      <div>
        <Fld label="Abstract" name="abstract" required error={errors.abstract} hint={`${ABSTRACT_MIN_WORDS} to ${ABSTRACT_MAX_WORDS} words. State the objective, method, main results and conclusion.`}>
          <textarea rows={9} className={inp(errors.abstract, 'leading-relaxed')} value={form.abstract}
            onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))} onBlur={() => setForm((f) => ({ ...f, abstract: f.abstract.trim() }))} />
        </Fld>
        <p aria-live="polite" className={cx('mt-1 text-right font-work text-xs font-semibold tabular-nums', bad ? 'text-red-700' : 'text-[#564241]')}>{words} / {ABSTRACT_MAX_WORDS} words</p>
      </div>

      <div>
        <Fld label="Keywords" name="keywords" required error={errors.keywords} hint="3 to 8 keywords, separated by commas.">
          <input className={inp(errors.keywords)} value={form.keywords} maxLength={300} autoComplete="off" placeholder="e.g. structural health monitoring, finite element model, retrofit"
            onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />
        </Fld>
        {kw.length > 0 && (
          <ul aria-label="Keyword preview" className="mt-2 flex flex-wrap gap-1.5">
            {kw.slice(0, 12).map((k, i) => <li key={`${k}-${i}`} className="rounded border border-[#DCC0BE]/40 bg-[#F1F3FF] px-2 py-1 font-work text-xs font-medium text-[#141B2B]">{k}</li>)}
          </ul>
        )}
      </div>
    </Section>
  )
}
