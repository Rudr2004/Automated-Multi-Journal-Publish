// Drag-and-drop file picker. Only name and size are kept (the prototype never uploads anything).
import { useId, useState, type DragEvent } from 'react'
import { Close } from '../icons'
import { FileIcon, Upload } from './pageIcons'
import { cx } from './primitives'

export interface PickedFile { name: string; size: number }
export const formatSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

export function FileDrop({ name, value, onChange, validate, accept, hint, error, describedBy }: {
  name: string; value: PickedFile | null; onChange: (f: PickedFile | null) => void
  validate: (f: PickedFile) => string; accept: string; hint: string; error?: string; describedBy?: string
}) {
  const id = useId()
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

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 rounded-panel border border-brand-200 bg-brand-50 p-4">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-soft bg-white text-brand-800 shadow-card"><FileIcon className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1"><p className="break-all text-sm font-semibold text-graphite-800">{value.name}</p><p className="text-xs text-graphite-600">{formatSize(value.size)}</p></div>
          <button type="button" onClick={() => { onChange(null); setLocal('') }} aria-label={`Remove ${value.name}`} className="rounded-chip p-1.5 text-graphite-600 hover:bg-white"><Close className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      ) : (
        <label htmlFor={id} onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
          className={cx('block cursor-pointer rounded-sheet border-2 border-dashed p-6 text-center transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-700 sm:p-8',
            over ? 'border-accent-700 bg-accent-50' : shown ? 'border-red-700 bg-red-50/40' : 'border-brand-300 bg-brand-50/50 hover:border-accent-700')}>
          <Upload aria-hidden="true" className="mx-auto h-10 w-10 text-brand-800" />
          <span className="mt-2 block text-sm text-graphite-700"><span className="font-semibold text-accent-700 underline">Choose a file</span> or drag and drop it here</span>
          <span className="mt-1 block text-xs text-graphite-600">{hint}</span>
          <input id={id} name={name} type="file" accept={accept} className="sr-only" aria-invalid={shown ? true : undefined} aria-describedby={describedBy}
            onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
      )}
      {shown && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{shown}</p>}
    </div>
  )
}
