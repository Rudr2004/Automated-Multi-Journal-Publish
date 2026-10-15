import { journal } from '../../../../config/journals'
// Section A: manuscript classification and abstract (title, type, research area, abstract, keywords).
import { ABSTRACT_MAX_WORDS, ABSTRACT_MIN_WORDS, LIMITS, wordCount } from '../../../../core/lib/submission'
import { parseKeywords } from '../../../../core/lib/validators'
import { J5_SUBJECTS } from '../../../../config/journals/specializations'
import { branchesFor } from '../../../../core/lib/branches'
import { cx } from '../../components/primitives'
import { Fld, Section, inp, type SectionProps } from './shared'

const J5_ARTICLE_TYPES = ['Research Article', 'Review Article', 'Systematic Review', 'Case Study', 'Survey Paper', 'Conference Paper'] as const

export function DetailsSection({ form, errors, setForm }: SectionProps) {
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
        <Fld label="Article Type" name="articleType" required error={errors.articleType}>
          <select className={inp(errors.articleType)} value={form.articleType} onChange={(e) => setForm((f) => ({ ...f, articleType: e.target.value }))}>
            <option value="">Select an article type</option>
            {J5_ARTICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Fld>

        <Fld label="Subject" name="subject" required error={errors.subject} hint="Editors use this to route your paper to the right section.">
          <select className={inp(errors.subject)} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value, branch: '' }))}>
            <option value="">Select a subject</option>
            {J5_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Fld>
        {branchesFor(form.subject).length > 0 && (
          <Fld label="Specialization" name="branch" required error={errors.branch} hint={`A specialization within ${form.subject}.`}>
            <select className={inp(errors.branch)} value={form.branch} onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}>
              <option value="">Select a specialization</option>
              {branchesFor(form.subject).map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Fld>
        )}
      </div>

      {journal.collectAbstract !== false && <>
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
      </>}
    </Section>
  )
}
