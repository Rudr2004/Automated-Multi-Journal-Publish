// Compact "Track My Paper" form for sidebars: Paper ID + email, validated, then opens the tracking page with both filled in. No login.
import { useId, useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { useRouter } from '../../../core/router'
import { Button } from './Button'
import { Track } from '../icons'
import { ManageSearch } from './refIconsJ4'

const input = 'h-10 w-full rounded-ctl border border-abyss-300 bg-white px-3 text-sm text-abyss-900 placeholder:text-steel-500 focus:border-azure-600 focus:outline-none focus:ring-4 focus:ring-azure-600/15 focus-visible:!outline-none'

/** `ref` is the compact home-sidebar look from the reference (small mono inputs on a slate-50 fill, full-width sky button). */
const refInput = 'block w-full rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-500 focus:border-azure-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azure-600/20 focus-visible:!outline-none'

export function TrackQuickFormJ4({ variant = 'default' }: { variant?: 'default' | 'ref' }) {
  const ref = variant === 'ref'
  const { navigate } = useRouter()
  const id = useId()
  const [pid, setPid] = useState('')
  const [mail, setMail] = useState('')
  const [err, setErr] = useState<{ pid: string; mail: string }>({ pid: '', mail: '' })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { pid: validate.paperId(pid.trim().toUpperCase()), mail: validate.email(mail) }
    setErr(next)
    if (next.pid || next.mail) return
    navigate(`${paths.track}?id=${encodeURIComponent(pid.trim().toUpperCase())}&email=${encodeURIComponent(mail.trim())}`)
  }
  return (
    <form onSubmit={submit} noValidate className={ref ? 'space-y-2.5' : 'space-y-3'}>
      <div>
        <label htmlFor={`${id}-p`} className={ref ? 'mb-1 block text-[11px] font-medium text-slate-600' : 'text-xs font-semibold text-abyss-800'}>{ref ? 'Manuscript ID' : 'Paper ID'}</label>
        <input id={`${id}-p`} value={pid} onChange={(e) => setPid(e.target.value)} placeholder={`${ref ? 'e.g. ' : ''}${journal.paperIdPrefix}2026000112`} autoComplete="off" aria-invalid={!!err.pid} aria-describedby={err.pid ? `${id}-pe` : undefined} className={ref ? `${refInput} font-mono` : `${input} mt-1 tabular-nums`} />
        {err.pid && <p id={`${id}-pe`} role="alert" className="mt-1 text-xs font-medium text-red-700">{err.pid}</p>}
      </div>
      <div>
        <label htmlFor={`${id}-m`} className={ref ? 'mb-1 block text-[11px] font-medium text-slate-600' : 'text-xs font-semibold text-abyss-800'}>{ref ? 'Corresponding Author Email' : 'Email used to submit'}</label>
        <input id={`${id}-m`} type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder={ref ? 'author@university.edu' : 'you@institution.edu'} autoComplete="email" aria-invalid={!!err.mail} aria-describedby={err.mail ? `${id}-me` : undefined} className={ref ? refInput : `${input} mt-1`} />
        {err.mail && <p id={`${id}-me`} role="alert" className="mt-1 text-xs font-medium text-red-700">{err.mail}</p>}
      </div>
      {ref
        ? <Button type="submit" variant="cta" className="w-full !rounded !px-3 !py-1.5 !text-xs"><ManageSearch className="h-4 w-4" aria-hidden="true" /> Check Status</Button>
        : <Button type="submit" variant="inverted" className="w-full"><Track className="h-4 w-4" aria-hidden="true" /> Check status</Button>}
    </form>
  )
}
