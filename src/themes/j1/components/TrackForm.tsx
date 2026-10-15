import { useRef, useState, type FormEvent } from 'react'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { Button } from './Button'
import { Field, inputClass } from './form'
import { useRouter } from '../../../core/router'
import { idExample, idMaxLength, normalizeId } from '../../../core/lib/manuscriptId'

/** Manuscript ID + email form that opens Track My Paper with the result already loaded. Used in the header popover and the Home sidebar. */
export function TrackForm({ idPrefix = 'trk', submitLabel = 'Track', onDone, firstRef }: {
  idPrefix?: string; submitLabel?: string; onDone?: () => void; firstRef?: React.RefObject<HTMLInputElement>
}) {
  const { navigate } = useRouter()
  const [paperId, setPaperId] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ paperId?: string; email?: string }>({})
  const own = useRef<HTMLInputElement>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { paperId: validate.paperId(paperId) || undefined, email: validate.email(email) || undefined }
    setErrors(next)
    if (next.paperId || next.email) return
    onDone?.()
    navigate(`${paths.track}?id=${normalizeId(paperId.trim())}&email=${encodeURIComponent(email.trim().toLowerCase())}`)
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <Field label="Manuscript ID" name={`${idPrefix}-paper`} required error={errors.paperId}>
        <input ref={firstRef ?? own} className={inputClass(errors.paperId)} value={paperId} maxLength={idMaxLength} autoComplete="off" spellCheck={false} placeholder={idExample}
          onChange={(e) => { setPaperId(normalizeId(e.target.value)); setErrors((x) => ({ ...x, paperId: undefined })) }} />
      </Field>
      <Field label="Email" name={`${idPrefix}-email`} required error={errors.email}>
        <input type="email" className={inputClass(errors.email)} value={email} maxLength={120} autoComplete="email" placeholder="you@institution.edu"
          onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} />
      </Field>
      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  )
}
