import { FileText, UploadCloud, X } from './uiIcons'
import { useId, useRef, useState, type DragEvent } from 'react'

export interface PickedFile { name: string; size: number }

const formatSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

/** Drag-and-drop file picker. Validation is delegated to `validate` (returns an error message or ''). */
export function FileDropzone({ value, onChange, validate, accept, hint, error }: {
  value: PickedFile | null
  onChange: (f: PickedFile | null) => void
  validate: (f: PickedFile) => string
  accept: string
  hint: string
  error?: string
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [localError, setLocalError] = useState('')
  const shown = localError || error

  const pick = (file?: File) => {
    if (!file) return
    const f = { name: file.name, size: file.size }
    const err = validate(f)
    setLocalError(err)
    if (!err) onChange(f)
  }
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]) }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 rounded-card border border-oa/40 bg-oa-soft p-4">
          <FileText className="h-6 w-6 shrink-0 text-oa" aria-hidden />
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{value.name}</p><p className="text-xs text-ink-muted">{formatSize(value.size)}</p></div>
          <button type="button" onClick={() => { onChange(null); setLocalError('') }} aria-label="Remove file" className="rounded p-1.5 text-ink-muted hover:bg-white"><X className="h-4 w-4" aria-hidden /></button>
        </div>
      ) : (
        <div onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
          className={`rounded-card border-2 border-dashed p-8 text-center transition-colors ${over ? 'border-navy bg-navy-50' : shown ? 'border-danger bg-red-50' : 'border-line bg-mist'}`}>
          <UploadCloud className="mx-auto h-8 w-8 text-navy-500" aria-hidden />
          <p className="mt-2 text-sm"><label htmlFor={id} className="cursor-pointer font-semibold text-navy-600 underline">Choose a file</label> or drag and drop it here</p>
          <p className="mt-1 text-xs text-ink-muted">{hint}</p>
          <input id={id} ref={input} type="file" accept={accept} className="sr-only" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </div>
      )}
      {shown && <p role="alert" className="mt-1 text-xs font-medium text-danger">{shown}</p>}
    </div>
  )
}
