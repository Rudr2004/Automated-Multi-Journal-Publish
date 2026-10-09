import { MdOutlineEventAvailable } from 'react-icons/md'
import { journal } from '../../../../config/journals/j1'
import { formatDate } from '../../../../core/lib/format'
import { ARTICLE_TYPES, SUBJECTS, type ArticleType } from '../../../../mock-data/journals/j1'
import { FileDropzone } from '../../components/FileDropzone'
import { Field, inputClass } from '../../components/form'
import { ABSTRACT_MAX_WORDS, ACCEPTED_EXT, LIMITS, MAX_FILE_MB, validateFile, wordCount } from '../../../../core/lib/submission'
import { branchesFor } from '../../../../core/lib/branches'
import type { StepProps } from './types'

/** Read-only radio-card showing the issue a new submission is considered for (from journal.nextIssue). */
function TargetIssue() {
  const { label, deadline } = journal.nextIssue
  const text = label.replace(/\s+—\s+(.*)$/, ' ($1)')
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-navy">Target publication issue</legend>
      <label className="flex flex-wrap items-center gap-3 rounded border-2 border-scholar bg-scholar-soft px-4 py-3">
        <input type="radio" name="targetIssue" checked readOnly className="h-4 w-4 shrink-0 accent-scholar" />
        <span className="min-w-0 flex-1 text-sm font-semibold text-navy">Current regular issue — {text}</span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-[#C4D9EE] bg-white px-2 py-0.5 text-xs font-bold text-scholar">
          <MdOutlineEventAvailable className="h-4 w-4" aria-hidden />Closing {formatDate(deadline.slice(0, 10))}
        </span>
      </label>
    </fieldset>
  )
}

export function StepManuscript({ form, errors, onChange }: StepProps) {
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => onChange({ ...form, [k]: v })
  const branches = branchesFor(form.subject)
  const words = wordCount(form.abstract)
  return (
    <div className="space-y-5">
      <TargetIssue />
      <Field label="Manuscript title" name="title" required error={errors.title} counter={`${form.title.length} / ${LIMITS.title} chars`}
        hint="Ensure the title matches the exact title printed on page 1 of your manuscript.">
        <textarea rows={2} className={`${inputClass(errors.title)} resize-y font-serif text-[1.0625rem] font-bold leading-snug text-navy`} value={form.title} maxLength={LIMITS.title} placeholder="Full title of your manuscript"
          onChange={(e) => set('title', e.target.value.replace(/\s+/g, ' ').replace(/^\s/, ''))} onBlur={() => set('title', form.title.trim())} />
      </Field>
      <Field label="Abstract" name="abstract" required error={errors.abstract} counter={`${words} / ${ABSTRACT_MAX_WORDS} words`}>
        <textarea rows={8} className={inputClass(errors.abstract)} value={form.abstract} onChange={(e) => set('abstract', e.target.value)} onBlur={() => set('abstract', form.abstract.trim())} />
      </Field>
      <Field label="Keywords" name="keywords" required error={errors.keywords} hint="3 to 8 keywords, separated by commas.">
        <input className={inputClass(errors.keywords)} value={form.keywords} maxLength={300} placeholder="e.g. composites, graphene, tensile strength" onChange={(e) => set('keywords', e.target.value)} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Article type" name="articleType" required error={errors.articleType}>
          <select className={inputClass(errors.articleType)} value={form.articleType} onChange={(e) => set('articleType', e.target.value as ArticleType | '')}>
            <option value="">Select…</option>
            {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Subject area" name="subject" required error={errors.subject}>
          <select className={inputClass(errors.subject)} value={form.subject} onChange={(e) => onChange({ ...form, subject: e.target.value, branch: '' })}>
            <option value="">Select…</option>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        {branches.length > 0 && (
          <div className="sm:col-span-2">
            <Field label="Branch" name="branch" required error={errors.branch} hint={`A branch of ${form.subject}.`}>
              <select className={inputClass(errors.branch)} value={form.branch} onChange={(e) => set('branch', e.target.value)}>
                <option value="">Select a branch…</option>
                {branches.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
          </div>
        )}
      </div>
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-navy">Manuscript file <span className="text-danger" aria-hidden>*</span></span>
        <FileDropzone title="Drag and drop your manuscript file here" value={form.file} onChange={(f) => set('file', f)} validate={validateFile} accept={ACCEPTED_EXT.join(',')}
          hint={`Word files only (${ACCEPTED_EXT.join(', ')}), up to ${MAX_FILE_MB} MB.`} error={errors.file} />
      </div>
    </div>
  )
}
