import { useEffect, useState } from 'react'
import { ButtonLink } from './Button'
import { Modal } from './Modal'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'

/** Exit-intent call-for-papers popup. Never mount this on the Article page. Shown once per session. */
export function ExitIntent() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('j1-exit-intent') === '1' } catch { /* storage unavailable */ }
    if (seen) return
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return
      setOpen(true)
      try { sessionStorage.setItem('j1-exit-intent', '1') } catch { /* ignore */ }
      document.removeEventListener('mouseleave', onLeave)
    }
    document.addEventListener('mouseleave', onLeave)
    return () => document.removeEventListener('mouseleave', onLeave)
  }, [])
  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Call for Papers is open">
      <p className="text-sm text-ink">{journal.name} is accepting manuscripts for the next issue. No account needed — you receive a Paper ID instantly.</p>
      <div className="mt-5 flex gap-3">
        <ButtonLink to={paths.submit} variant="submit">Submit Manuscript</ButtonLink>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-medium text-ink-muted hover:text-navy">Maybe later</button>
      </div>
    </Modal>
  )
}
