import { ARTICLE_TYPES, SUBJECTS, type ArticleType } from '../../../../mock-data/journals/j1'
import { FileDropzone } from '../../components/FileDropzone'
import { Field, inputClass } from '../../components/form'
import { ABSTRACT_MAX_WORDS, ACCEPTED_EXT, LIMITS, MAX_FILE_MB, validateFile, wordCount } from '../../../../core/lib/submission'
import type { StepProps } from './types'

export function StepManuscript({ form, errors, onChange }: StepProps) {
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => onChange({ ...form, [k]: v })
  const words = wordCount(form.abstract)
  return (
    <div className="space-y-5">
      <Field label="Manuscript title" name="title" required error={errors.title} counter={`${form.title.length} / ${LIMITS.title}`}>
        <input className={inputClass(errors.title)} value={form.title} maxLength={LIMITS.title} placeholder="Full title of your manuscript"
          onChange={(e) => set('title', e.target.value.replace(/\s{2,}/g, ' '))} onBlur={() => set('title', form.title.trim())} />
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
          <select className={inputClass(errors.subject)} value={form.subject} onChange={(e) => set('subject', e.target.value)}>
            <option value="">Select…</option>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-navy">Manuscript file <span className="text-danger" aria-hidden>*</span></span>
        <FileDropzone title="Drag and drop your manuscript file here" value={form.file} onChange={(f) => set('file', f)} validate={validateFile} accept={ACCEPTED_EXT.join(',')}
          hint={`Word files only (${ACCEPTED_EXT.join(', ')}), up to ${MAX_FILE_MB} MB.`} error={errors.file} />
      </div>
    </div>
  )
}
