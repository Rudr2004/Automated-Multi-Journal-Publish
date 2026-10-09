// Optional profile picture for the primary author: round preview, upload and remove. The picture stays in the browser (prototype).
import { useId, useRef, useState } from 'react'
import { PHOTO_ACCEPT, PHOTO_MAX_MB, readPhoto, validatePhoto } from '../../../core/lib/photo'
import type { AuthorPhoto } from '../../../core/lib/submission'
import { Button } from './Button'
import { Trash } from './pageIcons'

export function ProfilePhotoField({ value, onChange, error }: { value: AuthorPhoto | null; onChange: (photo: AuthorPhoto | null) => void; error?: string }) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [problem, setProblem] = useState('')
  const [busy, setBusy] = useState(false)
  const message = problem || error
  const pick = async (file?: File) => {
    if (!file) return
    const bad = validatePhoto(file)
    if (bad) { setProblem(bad); return }
    setProblem(''); setBusy(true)
    try { onChange(await readPhoto(file)) } catch (e) { setProblem((e as Error).message) } finally { setBusy(false); if (input.current) input.current.value = '' }
  }
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-panel border border-graphite-200 bg-white p-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-graphite-200 bg-graphite-50">
        {value
          ? <img src={value.dataUrl} alt="Your profile picture" className="h-full w-full object-cover" />
          : <svg viewBox="0 0 24 24" className="h-9 w-9 text-graphite-300" fill="currentColor" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.25c-3.1 0-9 1.55-9 4.65V21h18v-2.1c0-3.1-5.9-4.65-9-4.65Z" /></svg>}
      </div>
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-sm font-medium text-graphite-800">Profile picture <span className="font-normal text-graphite-600">(optional)</span></label>
        <p className="mt-0.5 text-sm text-graphite-600">A clear head-and-shoulders photo for your author profile. JPG, PNG or WebP, up to {PHOTO_MAX_MB} MB.</p>
        {value && <p className="mt-1 break-all text-xs text-graphite-700">{value.name} · {(value.size / 1024).toFixed(0)} KB</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          <input ref={input} id={id} name="author.photo" type="file" accept={PHOTO_ACCEPT} className="sr-only" onChange={(e) => void pick(e.target.files?.[0])} />
          <Button variant="outline" onClick={() => input.current?.click()} disabled={busy}>{busy ? 'Reading…' : value ? 'Change picture' : 'Upload picture'}</Button>
          {value && <Button variant="outline" onClick={() => { setProblem(''); onChange(null) }}><Trash className="h-4 w-4" aria-hidden="true" />Remove</Button>}
        </div>
        {message && <p role="alert" className="mt-2 text-sm font-medium text-red-700">{message}</p>}
      </div>
    </div>
  )
}
