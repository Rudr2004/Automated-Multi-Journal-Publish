// Drag-and-drop file picker for Journal 4. Only name and size are kept (nothing is uploaded in the prototype).
import { useId, useState, type DragEvent } from 'react'
import { Close } from '../../icons'
import { CheckCircle, CloudUpload, Description } from '../../pages/submit/mi'
import { cx } from '../primitives'

export interface PickedFile { name: string; size: number }
export const formatSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

export function FileDrop({ name, value, onChange, validate, accept, hint, error, describedBy, tag = 'DOC', look = 'default' }: {
  name: string; value: PickedFile | null; onChange: (f: PickedFile | null) => void
  validate: (f: PickedFile) => string; accept: string; hint: string; error?: string; describedBy?: string; tag?: string
  /** 'ref' = the manuscript-form reference look (sky dashed zone with cloud icon, slate file card). */
  look?: 'default' | 'ref'
}) {
  const id = useId()
  const errId = `${id}-e`
  const [over, setOver] = useState(false)
  const [local, setLocal] = useState('')
  const shown = local || error
  const pick = (file?: File) => {
    if (!file) return
    const f = { name: file.name, size: file.size }
    const err = validate(f)
    setLocal(err)
    if (!err) onChange(f)
  }
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]) }
  const described = [describedBy, shown ? errId : ''].filter(Boolean).join(' ') || undefined
  if (look === 'ref') {
    return (
      <div className="space-y-2">
        <label htmlFor={id} onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
          className={cx('block cursor-pointer space-y-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors focus-within:ring-2 focus-within:ring-sky-600/50',
            over ? 'border-sky-600 bg-sky-50' : shown ? 'border-red-700 bg-red-50' : 'border-sky-300 bg-sky-50/30 hover:border-sky-600 hover:bg-sky-50/60')}>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700 shadow-sm"><CloudUpload className="h-6 w-6" aria-hidden="true" /></span>
          <span className="block text-xs font-bold text-[#0b2545]">{value ? 'Replace the manuscript file: drag a new file here, or ' : 'Drag & drop manuscript file here, or '}<span className="text-sky-700 underline">browse files</span></span>
          <span className="mt-0.5 block text-[11px] text-slate-600">{hint}</span>
          <input id={id} name={name} type="file" accept={accept} className="sr-only" aria-invalid={shown ? true : undefined} aria-describedby={described}
            onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        {value && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-100 text-blue-700"><Description className="h-5 w-5" /></span>
              <div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-800">{value.name}</p><p className="font-mono text-[10px] text-slate-600">{formatSize(value.size)} • Selected on this device</p></div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800"><CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />File accepted</span>
              <button type="button" onClick={() => { onChange(null); setLocal('') }} aria-label={`Remove ${value.name}`} className="flex h-11 w-11 items-center justify-center rounded text-slate-500 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:h-8 sm:w-8"><Close className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </div>
        )}
        {shown && <p id={errId} role="alert" className="mt-1.5 text-xs font-semibold text-red-700">{shown}</p>}
      </div>
    )
  }
  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 rounded-ctl border border-cobalt-700 bg-azure-50 p-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-abyss-900 text-[11px] font-bold tracking-wide text-white">{tag}</span>
          <div className="min-w-0 flex-1">
            <p className="break-all text-sm font-semibold text-abyss-900">{value.name}</p>
            <p className="text-[13px] tabular-nums text-steel-600">{formatSize(value.size)}</p>
          </div>
          <button type="button" onClick={() => { onChange(null); setLocal('') }} aria-label={`Remove ${value.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl text-steel-600 hover:bg-white hover:text-abyss-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600"><Close className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      ) : (
        <label htmlFor={id} onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
          className={cx('block cursor-pointer rounded-ctl border border-dashed p-6 text-center transition-colors focus-within:ring-2 focus-within:ring-azure-600/50',
            over ? 'border-azure-600 bg-azure-50' : shown ? 'border-red-700 bg-red-50' : 'border-abyss-400 bg-abyss-50 hover:border-cobalt-700')}>
          <span className="block text-[15px] text-abyss-900"><span className="font-semibold text-cobalt-700 underline">Choose a file</span> or drag it here</span>
          <span className="mt-1 block text-[13px] text-steel-600">{hint}</span>
          <input id={id} name={name} type="file" accept={accept} className="sr-only" aria-invalid={shown ? true : undefined} aria-describedby={described}
            onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
      )}
      {shown && <p id={errId} role="alert" className="mt-1.5 text-[13px] font-semibold text-red-700">{shown}</p>}
    </div>
  )
}
