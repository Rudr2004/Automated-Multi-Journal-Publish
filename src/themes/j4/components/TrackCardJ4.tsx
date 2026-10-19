// Sidebar "Track Manuscript Status" card, one design for every J4 page that shows it: a dark navy panel with an orange accent bar and
// an orange action button. Manuscript ID + email are validated, then the tracking page opens with both filled in. No login.
import { useId, useState, type FormEvent } from 'react'
import { MdOutlineArrowForward, MdOutlineLock, MdOutlineManageSearch } from 'react-icons/md'
import { paths } from '../../../config/routes'
import { idExample } from '../../../core/lib/manuscriptId'
import * as validate from '../../../core/lib/validators'
import { useRouter } from '../../../core/router'

const input = 'block w-full rounded border border-white/20 bg-white px-3 py-2 text-xs text-abyss-900 placeholder:text-slate-500 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50'

export function TrackCardJ4() {
  const { navigate } = useRouter()
  const id = useId()
  const [pid, setPid] = useState('')
  const [mail, setMail] = useState('')
  const [err, setErr] = useState({ pid: '', mail: '' })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { pid: validate.paperId(pid.trim().toUpperCase()), mail: validate.email(mail) }
    setErr(next)
    if (next.pid || next.mail) return
    navigate(`${paths.track}?id=${encodeURIComponent(pid.trim().toUpperCase())}&email=${encodeURIComponent(mail.trim())}`)
  }
  const label = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-300'
  return (
    <section aria-labelledby={`${id}-h`} id="track-manuscript-sidebar" className="overflow-hidden rounded-xl border border-abyss-800 bg-[#0B2545] text-white shadow-hair">
      <span aria-hidden="true" className="block h-1.5 bg-gold" />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold text-abyss-900"><MdOutlineManageSearch className="h-6 w-6" /></span>
          <div className="min-w-0">
            <h2 id={`${id}-h`} className="font-serif4 text-base font-bold leading-tight">Track Manuscript Status</h2>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-300"><MdOutlineLock className="h-3.5 w-3.5" aria-hidden="true" />No login needed</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-300">Enter your Manuscript ID and the corresponding author email to see where your paper is in peer review.</p>
        <form onSubmit={submit} noValidate className="mt-4 space-y-3">
          <div>
            <label htmlFor={`${id}-p`} className={label}>Manuscript ID</label>
            <input id={`${id}-p`} value={pid} onChange={(e) => setPid(e.target.value)} placeholder={`e.g. ${idExample}`} autoComplete="off" aria-invalid={!!err.pid} aria-describedby={err.pid ? `${id}-pe` : undefined} className={input} />
            {err.pid && <p id={`${id}-pe`} role="alert" className="mt-1 rounded bg-white px-2 py-1 text-xs font-medium text-red-700">{err.pid}</p>}
          </div>
          <div>
            <label htmlFor={`${id}-m`} className={label}>Corresponding author email</label>
            <input id={`${id}-m`} type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="author@university.edu" autoComplete="email" aria-invalid={!!err.mail} aria-describedby={err.mail ? `${id}-me` : undefined} className={input} />
            {err.mail && <p id={`${id}-me`} role="alert" className="mt-1 rounded bg-white px-2 py-1 text-xs font-medium text-red-700">{err.mail}</p>}
          </div>
          <button type="submit" className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded bg-gold px-3 py-2 text-sm font-bold text-abyss-900 transition-colors hover:bg-[#F59A1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2545]">
            Check Status<MdOutlineArrowForward className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  )
}
