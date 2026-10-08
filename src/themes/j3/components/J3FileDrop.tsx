// Drag-and-drop file picker for Journal 3. Only name and size are kept (nothing is uploaded in the prototype).
import { useId, useState, type DragEvent } from 'react'
import { Close } from '../icons'
import { cx } from './primitives'

export interface J3PickedFile { name: string; size: number }
export const formatSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

export function J3FileDrop({ name, value, onChange, validate, accept, hint, error, describedBy }: {
  name: string; value: J3PickedFile | null; onChange: (f: J3PickedFile | null) => void
  validate: (f: J3PickedFile) => string; accept: string; hint: string; error?: string; describedBy?: string
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
        <div className="flex items-center gap-3 rounded-tile border-2 border-iris-700 bg-iris-50 p-4">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-iris-700 font-jakarta text-xs font-extrabold text-white">DOC</span>
          <div className="min-w-0 flex-1"><p className="truncate font-jakarta text-sm font-bold text-night-900">{value.name}</p><p className="text-sm text-mauve-700">{formatSize(value.size)}</p></div>
          <button type="button" onClick={() => { onChange(null); setLocal('') }} aria-label={`Remove ${value.name}`} className="rounded-full p-2 text-mauve-700 hover:bg-white"><Close className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      ) : (
        <label htmlFor={id} onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
          className={cx('block cursor-pointer rounded-block border-2 border-dashed p-6 text-center transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-iris-700 sm:p-8',
            over ? 'border-iris-700 bg-iris-100' : shown ? 'border-red-700 bg-red-50' : 'border-iris-300 bg-iris-50 hover:border-iris-700')}>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-iris-700 text-2xl font-bold text-white" aria-hidden="true">+</span>
          <span className="mt-3 block text-base text-night-900"><span className="font-jakarta font-bold text-iris-700 underline">Choose a file</span> or drag it here</span>
          <span className="mt-1 block text-sm text-mauve-700">{hint}</span>
          <input id={id} name={name} type="file" accept={accept} className="sr-only" aria-invalid={shown ? true : undefined} aria-describedby={describedBy}
            onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
      )}
      {shown && <p role="alert" className="mt-1.5 text-sm font-semibold text-red-700">{shown}</p>}
    </div>
  )
}
