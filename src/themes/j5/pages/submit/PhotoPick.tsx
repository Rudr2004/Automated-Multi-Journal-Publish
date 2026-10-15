// Optional profile picture: round preview with an upload / change / remove control. Nothing is uploaded in the prototype.
import { useId, useRef, useState } from 'react'
import { PHOTO_ACCEPT, PHOTO_MAX_MB, readPhoto, validatePhoto } from '../../../../core/lib/photo'
import type { AuthorPhoto } from '../../../../core/lib/submission'
import { PersonI, Trash } from './mi'

export function PhotoPick({ value, onChange, name, label = 'Profile Photo', compact }: { value: AuthorPhoto | null; onChange: (p: AuthorPhoto | null) => void; name: string; label?: string; compact?: boolean }) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const pick = async (file?: File) => {
    if (!file) return
    const bad = validatePhoto(file)
    if (bad) { setMsg(bad); return }
    setBusy(true); setMsg('')
    try { onChange(await readPhoto(file)) } catch (e) { setMsg(e instanceof Error ? e.message : 'Could not read this picture.') } finally { setBusy(false); if (input.current) input.current.value = '' }
  }
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-[#DCC0BE] bg-[#F9F9FF] p-3">
      <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#E9EDFF] text-wine-800 shadow-sm ${compact ? 'h-14 w-14' : 'h-20 w-20'}`}>
        {value ? <img src={value.dataUrl} alt="Selected profile picture" className="h-full w-full object-cover" /> : <PersonI className="h-8 w-8" aria-hidden="true" />}
      </div>
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="font-work text-[13px] font-semibold text-[#141B2B]">{label} <span className="font-normal text-[#564241]">(Optional)</span></label>
        <p className="font-work text-xs text-[#564241]">JPG, PNG or WebP, up to {PHOTO_MAX_MB} MB.</p>
        {value && <p className="break-all font-work text-xs text-[#141B2B]">{value.name}</p>}
        <div className="mt-1.5 flex flex-wrap gap-2">
          <input ref={input} id={id} name={name} type="file" accept={PHOTO_ACCEPT} className="sr-only" onChange={(e) => void pick(e.target.files?.[0])} />
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="inline-flex min-h-[36px] items-center rounded border border-wine-800 bg-white px-3 font-work text-xs font-bold text-wine-800 hover:bg-[#F4F5FC]">{busy ? 'Reading…' : value ? 'Change photo' : 'Upload photo'}</button>
          {value && <button type="button" onClick={() => onChange(null)} className="inline-flex min-h-[36px] items-center gap-1 rounded px-2 font-work text-xs font-semibold text-red-700 hover:bg-[#E9EDFF]"><Trash className="h-4 w-4" aria-hidden="true" />Remove</button>}
        </div>
        {msg && <p role="alert" className="mt-1 font-work text-xs font-semibold text-red-700">{msg}</p>}
      </div>
    </div>
  )
}
