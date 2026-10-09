// Drag-and-drop file picker for Journal 5 (IJFRD). Only name and size are kept (nothing is uploaded in the prototype).
import { useId, useState, type DragEvent } from 'react'
import { Close } from '../../icons'
import { cx } from '../primitives'

export interface PickedFile { name: string; size: number }
export const formatSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

export function FileDrop({ name, value, onChange, validate, accept, hint, error, describedBy, tag = 'DOC' }: {
  name: string; value: PickedFile | null; onChange: (f: PickedFile | null) => void
  validate: (f: PickedFile) => string; accept: string; hint: string; error?: string; describedBy?: string; tag?: string
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
  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 rounded border border-wine-700 bg-ochre-50 p-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-wine-800 text-[11px] font-bold tracking-wide text-white">{tag}</span>
          <div className="min-w-0 flex-1">
            <p className="break-all text-sm font-semibold text-obsidian-900">{value.name}</p>
            <p className="text-[13px] tabular-nums text-obsidian-600">{formatSize(value.size)}</p>
          </div>
          <button type="button" onClick={() => { onChange(null); setLocal('') }} aria-label={`Remove ${value.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-obsidian-600 hover:bg-white hover:text-obsidian-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700"><Close className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      ) : (
        <label htmlFor={id} onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
          className={cx('block cursor-pointer rounded border border-dashed p-6 text-center transition-colors focus-within:ring-2 focus-within:ring-wine-700/30',
            over ? 'border-ochre-600 bg-ochre-50' : shown ? 'border-red-700 bg-red-50' : 'border-obsidian-400 bg-[#F4EEE6] hover:border-wine-700')}>
          <span className="block text-[15px] text-obsidian-900"><span className="font-semibold text-wine-700 underline">Choose a file</span> or drag it here</span>
          <span className="mt-1 block text-[13px] text-obsidian-600">{hint}</span>
          <input id={id} name={name} type="file" accept={accept} className="sr-only" aria-invalid={shown ? true : undefined} aria-describedby={described}
            onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
      )}
      {shown && <p id={errId} role="alert" className="mt-1.5 text-[13px] font-semibold text-red-700">{shown}</p>}
    </div>
  )
}
