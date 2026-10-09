// Edit-submission and author-certificate dialogs of the Journal 5 (IJFRD) console.
import { useEffect, useState, type FormEvent } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { ACCEPTED_EXT, MAX_FILE_MB, validateFile } from '../../../../core/lib/submission'
import { AppLink } from '../../../../core/router'
import { Button } from '../../components/Button'
import { Field, Spinner, fieldInput } from '../../components/form/Field'
import { FileDrop, type PickedFile } from '../../components/form/FileDrop'
import { Modal } from '../../components/form/Modal'

/** Edit submission (unlocked by OTP): change the title or replace the manuscript file. Only possible before the decision. */
export function EditDialog({ open, onClose, title, onSave }: { open: boolean; onClose: () => void; title: string; onSave: (title: string, file: PickedFile | null) => Promise<void> }) {
  const [value, setValue] = useState(title)
  const [file, setFile] = useState<PickedFile | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (open) { setValue(title); setFile(null); setError(''); setBusy(false) } }, [open, title])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    const t = value.trim()
    if (t.length < 10) { setError('The title is too short (minimum 10 characters).'); return }
    if (t.length > 250) { setError('The title is too long (maximum 250 characters).'); return }
    setBusy(true)
    try { await onSave(t, file) } finally { setBusy(false) }
  }
  return (
    <Modal open={open} onClose={onClose} title="Edit your submission" size="lg">
      <form onSubmit={save} noValidate className="space-y-4">
        <Field label="Manuscript title" name="title" required error={error}>
          <input className={fieldInput(error)} value={value} maxLength={250} data-autofocus onChange={(e) => { setValue(e.target.value); setError('') }} />
        </Field>
        <div>
          <span id="edit-file-label" className="mb-1.5 block text-sm font-semibold text-obsidian-900">Replace manuscript file <span className="font-normal text-obsidian-600">(optional)</span></span>
          <FileDrop name="editFile" value={file} onChange={setFile} validate={validateFile} accept={ACCEPTED_EXT.join(',')} hint={`Word files only, up to ${MAX_FILE_MB} MB.`} describedBy="edit-file-label" />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" className="min-h-[44px]" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="cta" className="min-h-[44px]" disabled={busy} aria-busy={busy}>{busy && <Spinner />}{busy ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </form>
    </Modal>
  )
}

/** Author certificate summary (shown after OTP). */
export function CertDialog({ open, onClose, paperId, title, authors, publishedAt }: { open: boolean; onClose: () => void; paperId: string; title: string; authors: string[]; publishedAt: string }) {
  return (
    <Modal open={open} onClose={onClose} title="Author certificate" size="lg">
      <div className="rounded border border-obsidian-300 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-wine-700">Certificate of publication</p>
        <p className="mt-2 font-newsreader text-xl font-semibold leading-snug text-obsidian-900">{title}</p>
        <dl className="mt-4 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-obsidian-600">Authors</dt><dd className="font-semibold">{authors.join(', ')}</dd>
          <dt className="text-obsidian-600">Journal</dt><dd className="font-semibold">{journal.name}</dd>
          <dt className="text-obsidian-600">Paper ID</dt><dd className="font-semibold tabular-nums">{paperId}</dd>
          <dt className="text-obsidian-600">DOI</dt><dd className="break-all font-semibold">{doiFor(paperId)}</dd>
          <dt className="text-obsidian-600">Published</dt><dd className="font-semibold">{formatDate(publishedAt)}</dd>
        </dl>
      </div>
      <p className="mt-3 text-sm text-obsidian-700">Anyone can confirm this certificate on the <AppLink to={paths.verify()} className="font-semibold text-wine-700 underline">verification page</AppLink>.</p>
      <div className="mt-4 flex justify-end"><Button variant="outline" className="min-h-[44px]" onClick={onClose}>Close</Button></div>
    </Modal>
  )
}
