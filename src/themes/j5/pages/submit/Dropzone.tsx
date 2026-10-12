// Manuscript dropzone in the reference style (lavender panel, round cloud badge). Only name and size are kept (nothing is uploaded in the prototype).
import { useId, useState, type DragEvent } from 'react'
import { formatSize, type PickedFile } from '../../components/form/FileDrop'
import { cx } from '../../components/primitives'
import { Cancel, Doc, Upload } from './mi'

export function Dropzone({ name, value, onChange, validate, accept, hint, error, describedBy }: {
  name: string; value: PickedFile | null; onChange: (f: PickedFile | null) => void
  validate: (f: PickedFile) => string; accept: string; hint: string; error?: string; describedBy?: string
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
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-[#DCE2F7] p-3.5 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <Doc className="h-6 w-6 shrink-0 text-wine-900" aria-hidden="true" />
            <div className="flex min-w-0 flex-col">
              <span className="break-all font-work text-xs font-bold text-[#141B2B]">{value.name}</span>
              <span className="font-work text-xs tabular-nums text-[#564241]">{formatSize(value.size)} · Ready to submit</span>
            </div>
          </div>
          <button type="button" onClick={() => { onChange(null); setLocal('') }} aria-label={`Remove ${value.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-red-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-800"><Cancel className="h-6 w-6" aria-hidden="true" /></button>
        </div>
      ) : (
        <label htmlFor={id} onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
          className={cx('flex cursor-pointer flex-col items-center justify-center rounded-xl p-8 text-center shadow-inner transition-colors focus-within:ring-2 focus-within:ring-wine-800/40',
            over ? 'bg-[#E9EDFF] ring-2 ring-wine-800/40' : shown ? 'bg-red-50 ring-1 ring-red-700' : 'bg-[#F1F3FF] hover:bg-[#E9EDFF]')}>
          <span aria-hidden="true" className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-wine-800/10 text-wine-900"><Upload className="h-8 w-8" /></span>
          <span className="font-newsreader text-xl font-semibold leading-7 text-[#141B2B]">Click to browse or drag &amp; drop manuscript</span>
          <span className="mt-1 max-w-md font-serif4 text-[15px] leading-6 text-[#564241]">{hint}</span>
          <input id={id} name={name} type="file" accept={accept} className="sr-only" aria-invalid={shown ? true : undefined} aria-describedby={described}
            onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
      )}
      {shown && <p id={errId} role="alert" className="font-work text-[13px] font-semibold text-red-700">{shown}</p>}
    </div>
  )
}
