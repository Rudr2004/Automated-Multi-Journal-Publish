// Section A: article track and metadata (research area, branch, type, title, abstract, keywords).
import { journal } from '../../../../config/journals'
import { branchesFor } from '../../../../core/lib/branches'
import { ABSTRACT_MAX_WORDS, ABSTRACT_MIN_WORDS, LIMITS, wordCount } from '../../../../core/lib/submission'
import { parseKeywords } from '../../../../core/lib/validators'
import { ARTICLE_TYPES, type ArticleType } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { AccountTree, ArticleIcon, Category, Info, TitleIcon } from './mi'
import { RField, Section, refInput, type SectionProps } from './shared'

const TYPE_NOTES: Record<string, string> = {
  'Research Article': 'Original study with method, results and discussion.',
  'Review Article': 'Critical synthesis of existing work on one topic.',
  'Short Communication': 'Brief report of a focused, timely result.',
}
const ic = 'h-3.5 w-3.5 text-sky-600'

export function DetailsSection({ form, errors, setForm }: SectionProps) {
  const words = wordCount(form.abstract)
  const kw = parseKeywords(form.keywords)
  const bad = words > 0 && (words < ABSTRACT_MIN_WORDS || words > ABSTRACT_MAX_WORDS)
  const branches = branchesFor(form.subject)
  const selectCls = (e?: string) => cx(refInput(e), 'pr-8')
  return (
    <Section letter="A" id="details" title="Article Track & Metadata" text="Select subject discipline and provide core indexing information." chip="Step 1 of 4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RField label="Primary Subject Area" name="subject" required error={errors.subject} icon={<AccountTree className={ic} aria-hidden="true" />}>
          <select className={selectCls(errors.subject)} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value, branch: '' }))}>
            <option value="">Select a research area</option>
            {journal.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </RField>
        {branches.length > 0 ? (
          <RField label="Academic Stream / Discipline" name="branch" required error={errors.branch} icon={<Category className={ic} aria-hidden="true" />}>
            <select className={selectCls(errors.branch)} value={form.branch} onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}>
              <option value="">Select a branch</option>
              {branches.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </RField>
        ) : (
          <RField label="Manuscript Type" name="articleType" required error={errors.articleType} icon={<ArticleIcon className={ic} aria-hidden="true" />}>
            <select className={selectCls(errors.articleType)} value={form.articleType} onChange={(e) => setForm((f) => ({ ...f, articleType: e.target.value as ArticleType | '' }))}>
              <option value="">Select a manuscript type</option>
              {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </RField>
        )}
      </div>

      {branches.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RField label="Manuscript Type" name="articleType" required error={errors.articleType} icon={<ArticleIcon className={ic} aria-hidden="true" />}>
            <select className={selectCls(errors.articleType)} value={form.articleType} onChange={(e) => setForm((f) => ({ ...f, articleType: e.target.value as ArticleType | '' }))}>
              <option value="">Select a manuscript type</option>
              {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </RField>
        </div>
      )}
      <p className="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-600">
        <Info className="h-3.5 w-3.5 shrink-0 text-sky-600" aria-hidden="true" />
        {TYPE_NOTES[form.articleType] ?? 'Editors use the research area and type to route your paper to the right section.'}
      </p>

      <RField label="Article Title" name="title" required error={errors.title} counter={`${form.title.length} / ${LIMITS.title} chars`} icon={<TitleIcon className={ic} aria-hidden="true" />}
        hint="Hint: Use the full title, without vague abbreviations. Mathematical symbols or LaTeX formulas are preserved.">
        <textarea rows={2} className={cx(refInput(errors.title), 'resize-y font-serif4 font-semibold leading-snug text-slate-900')} value={form.title} maxLength={LIMITS.title} autoComplete="off"
          placeholder="e.g. Seismic retrofit of masonry school buildings using ferrocement jackets"
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value.replace(/\s+/g, ' ').replace(/^\s/, '') }))} onBlur={() => setForm((f) => ({ ...f, title: f.title.trim() }))} />
      </RField>

      <RField label="Abstract" name="abstract" required error={errors.abstract} counter={`${words} / ${ABSTRACT_MAX_WORDS} words`}
        hint={`${ABSTRACT_MIN_WORDS} to ${ABSTRACT_MAX_WORDS} words. State the objective, method, main results and conclusion.`}>
        <textarea rows={8} className={cx(refInput(errors.abstract), 'resize-y leading-relaxed', bad && 'border-red-700')} value={form.abstract}
          onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))} onBlur={() => setForm((f) => ({ ...f, abstract: f.abstract.trim() }))} />
      </RField>

      <div>
        <RField label="Keywords" name="keywords" required error={errors.keywords} hint="3 to 8 keywords, separated by commas.">
          <input className={refInput(errors.keywords)} value={form.keywords} maxLength={300} autoComplete="off" placeholder="e.g. structural health monitoring, finite element model, retrofit"
            onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />
        </RField>
        {kw.length > 0 && (
          <ul aria-label="Keyword preview" className="mt-2 flex flex-wrap gap-1.5">
            {kw.slice(0, 12).map((k, i) => <li key={`${k}-${i}`} className="rounded border border-sky-100 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800">{k}</li>)}
          </ul>
        )}
      </div>
    </Section>
  )
}
