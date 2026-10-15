// "Recommend this Article": the reader sends a link to the article to a colleague or librarian. The send is simulated in the prototype.
import { useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { articleUrl } from '../../../core/lib/articleLink'
import * as validate from '../../../core/lib/validators'
import type { ArticleFull } from '../../../core/types'
import { Button } from './Button'
import { Field, inputCls } from './FieldKit'
import { ModalDialog } from './ModalDialog'
import { useToast } from './Toast'

export function RecommendDialog({ article, open, onClose }: { article: ArticleFull; open: boolean; onClose: () => void }) {
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
    toast(`Recommendation sent to ${to.trim()} (simulated).`, 'success')
    close()
  }
  return (
    <ModalDialog open={open} onClose={close} title="Recommend this Article" size="md">
      <form onSubmit={submit} noValidate className="space-y-4">
        <p className="text-sm text-graphite-700">Send a link to <strong className="text-graphite-900">{article.title}</strong> ({journal.shortName}, {articleUrl(article.paperId).replace(/^https?:\/\//, '')}) to a colleague, supervisor or librarian.</p>
        <Field label="Recipient's email" name="recommend-to" required error={error}>
          <input type="email" data-autofocus className={inputCls(error)} value={to} maxLength={120} autoComplete="off" onChange={(e) => { setTo(e.target.value.replace(/\s/g, '')); setError('') }} />
        </Field>
        <Field label="Message (optional)" name="recommend-note" counter={`${note.length} / 300`}>
          <textarea rows={3} className={inputCls()} value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Why do you think this article is useful?" />
        </Field>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Send recommendation"}</Button>
        </div>
      </form>
    </ModalDialog>
  )
}
