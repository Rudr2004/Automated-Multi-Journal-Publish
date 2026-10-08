// Section 01: article details (title, type, research area, abstract, keywords).
import { useId } from 'react'
import { journal } from '../../../../config/journals'
import { ABSTRACT_MAX_WORDS, ABSTRACT_MIN_WORDS, LIMITS, wordCount } from '../../../../core/lib/submission'
import { parseKeywords } from '../../../../core/lib/validators'
import { ARTICLE_TYPES, type ArticleType } from '../../../../core/types'
import { Field, fieldInput } from '../../components/form/Field'
import { cx } from '../../components/primitives'
import { Section, type SectionProps } from './shared'

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
    <Section n={1} id="details" title="Article details" text="As they should appear in the published record.">
      <Field label="Manuscript title" name="title" required error={errors.title} counter={`${form.title.length} / ${LIMITS.title}`} hint="Use the full title, without abbreviations where possible.">
        <input className={fieldInput(errors.title)} value={form.title} maxLength={LIMITS.title} autoComplete="off" placeholder="e.g. Seismic retrofit of masonry school buildings using ferrocement jackets"
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value.replace(/\s{2,}/g, ' ') }))} onBlur={() => setForm((f) => ({ ...f, title: f.title.trim() }))} />
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <fieldset aria-describedby={errors.articleType ? errId : undefined}>
          <legend className="mb-1.5 text-sm font-semibold text-abyss-900">Article type <span className="text-red-700" aria-hidden="true">*</span></legend>
          <div className="space-y-2">
            {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t) => {
              const checked = form.articleType === t
              return (
                <label key={t} className={cx('flex min-h-[44px] cursor-pointer items-start gap-3 rounded-ctl border p-3 focus-within:ring-2 focus-within:ring-azure-600/50',
                  checked ? 'border-cobalt-700 bg-azure-50' : errors.articleType ? 'border-red-700 bg-red-50' : 'border-abyss-200 bg-white hover:border-abyss-400')}>
                  <input type="radio" name="articleType" value={t} checked={checked} aria-invalid={errors.articleType ? true : undefined}
                    onChange={() => setForm((f) => ({ ...f, articleType: t as ArticleType }))} className="mt-1 h-4 w-4 shrink-0 accent-cobalt-700" />
                  <span><span className="block text-[15px] font-semibold text-abyss-900">{t}</span><span className="block text-[13px] leading-snug text-steel-600">{TYPE_NOTES[t]}</span></span>
                </label>
              )
            })}
          </div>
          {errors.articleType && <p id={errId} role="alert" className="mt-1.5 text-[13px] font-semibold text-red-700">{errors.articleType}</p>}
        </fieldset>

        <Field label="Research area" name="subject" required error={errors.subject} hint="Editors use this to route your paper to the right section.">
          <select className={fieldInput(errors.subject)} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}>
            <option value="">Select an area</option>
            {journal.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <div>
        <Field label="Abstract" name="abstract" required error={errors.abstract} hint={`${ABSTRACT_MIN_WORDS} to ${ABSTRACT_MAX_WORDS} words. State the objective, method, main results and conclusion.`}>
          <textarea rows={9} className={cx(fieldInput(errors.abstract), 'leading-relaxed')} value={form.abstract}
            onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))} onBlur={() => setForm((f) => ({ ...f, abstract: f.abstract.trim() }))} />
        </Field>
        <p aria-live="polite" className={cx('mt-1 text-right text-[13px] font-semibold tabular-nums', bad ? 'text-red-700' : 'text-steel-600')}>{words} / {ABSTRACT_MAX_WORDS} words</p>
      </div>

      <div>
        <Field label="Keywords" name="keywords" required error={errors.keywords} hint="3 to 8 keywords, separated by commas.">
          <input className={fieldInput(errors.keywords)} value={form.keywords} maxLength={300} autoComplete="off" placeholder="e.g. structural health monitoring, finite element model, retrofit"
            onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />
        </Field>
        {kw.length > 0 && (
          <ul aria-label="Keyword preview" className="mt-2 flex flex-wrap gap-1.5">
            {kw.slice(0, 12).map((k, i) => <li key={`${k}-${i}`} className="rounded-ctl border border-abyss-200 bg-abyss-50 px-2 py-1 text-xs font-medium text-steel-700">{k}</li>)}
          </ul>
        )}
      </div>
    </Section>
  )
}
