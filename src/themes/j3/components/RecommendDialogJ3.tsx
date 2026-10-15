// "Recommend this paper": sends a link to the article to a colleague or librarian (simulated in the prototype).
import { useState, type FormEvent } from 'react'
import { articleUrl } from '../../../core/lib/articleLink'
import * as validate from '../../../core/lib/validators'
import type { ArticleFull } from '../../../core/types'
import { Button } from './Button'
import { J3Field, j3Input } from './J3Field'
import { J3Modal } from './J3Modal'
import { useToast } from './Toast'

export function RecommendDialogJ3({ article, open, onClose }: { article: ArticleFull; open: boolean; onClose: () => void }) {
  const toast = useToast()
  const [to, setTo] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const close = () => { setTo(''); setNote(''); setError(''); onClose() }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const msg = validate.email(to)
    setError(msg)
    if (msg) return
    setBusy(true)
    await new Promise((r) => setTimeout(r, 500))
    setBusy(false)
    toast(`Recommendation sent to ${to.trim()} (simulated).`)
    close()
  }
  return (
    <J3Modal open={open} onClose={close} title="Recommend this paper" size="md">
      <form onSubmit={submit} noValidate className="space-y-4">
        <p className="font-inter text-sm text-night-700">Send a link to <strong className="text-night-900">{article.title}</strong> ({articleUrl(article.paperId).replace(/^https?:\/\//, '')}) to a colleague, supervisor or librarian.</p>
        <J3Field label="Recipient email" name="recommend-to" required error={error}>
          <input type="email" className={j3Input(error)} value={to} maxLength={120} autoComplete="off" onChange={(e) => { setTo(e.target.value.replace(/\s/g, '')); setError('') }} />
        </J3Field>
        <J3Field label="Message" name="recommend-note" optional counter={`${note.length} / 300`}>
          <textarea rows={3} className={j3Input()} value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Why do you think this paper is useful?" />
        </J3Field>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send recommendation'}</Button>
        </div>
      </form>
    </J3Modal>
  )
}
