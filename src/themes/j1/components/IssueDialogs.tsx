import { useRef, useState, type FormEvent } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import type { ArticleFull, ArticleSummary, IssueSummary } from '../../../mock-data/journals/j1'
import { api } from '../../../core/api'
import { articleUrl } from '../../../core/lib/articleLink'
import { copyText } from '../../../core/lib/clipboard'
import * as validate from '../../../core/lib/validators'
import { formatMonthYear } from '../../../core/lib/format'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { CopyButton } from './ArticleParts'
import { Button } from './Button'
import { CiteModal } from './CiteModal'
import { Field, inputClass } from './form'
import { Modal } from './Modal'
import { useToast } from './Toast'
import { Download, FormatQuote, Loader2, QrCode, Share2 } from './uiIcons'

export const issueBtn =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded border border-line bg-white px-3 text-[13px] font-semibold text-navy transition-colors hover:border-scholar hover:bg-scholar-soft disabled:cursor-wait disabled:opacity-70'

/** Cite button: loads the full article record on click (loading state), then opens the existing CiteModal. */
export function CiteArticleButton({ article, className = issueBtn }: { article: ArticleSummary; className?: string }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [full, setFull] = useState<ArticleFull | null>(null)
  const [open, setOpen] = useState(false)
  const click = async () => {
    if (full) { setOpen(true); return }
    setLoading(true)
    try {
      const a = await api.getArticle(article.paperId)
      if (!a) throw new Error('missing')
      setFull(a); setOpen(true)
    } catch { toast('Could not load the citation. Please try again.', 'error') }
    finally { setLoading(false) }
  }
  return (
    <>
      <button type="button" onClick={click} disabled={loading} aria-busy={loading || undefined} className={className}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <FormatQuote className="h-4 w-4" aria-hidden />}Cite
        <span className="sr-only"> {article.title}</span>
      </button>
      {full && <CiteModal article={full} open={open} onClose={() => setOpen(false)} />}
    </>
  )
}

export function ShareArticleButton({ article, className = `${issueBtn} w-9 px-0` }: { article: ArticleSummary; className?: string }) {
  const toast = useToast()
  const share = async () => toast((await copyText(articleUrl(article.paperId))) ? 'Article link copied to clipboard.' : 'Could not copy. Copy the address from the browser bar instead.')
  return <button type="button" onClick={share} aria-label={`Copy link to ${article.title}`} title="Copy link" className={className}><Share2 className="h-4 w-4" aria-hidden /></button>
}

export function QrArticleButton({ article }: { article: ArticleSummary }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const url = articleUrl(article.paperId)
  const save = () => {
    const canvas = box.current?.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png'); a.download = `${article.paperId}-qr.png`; a.click()
  }
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={issueBtn}><QrCode className="h-4 w-4" aria-hidden />QR<span className="sr-only"> code for this article</span></button>
      <Modal open={open} onClose={() => setOpen(false)} title="Scan to open this article">
        <div className="flex flex-col items-center gap-3">
          <div ref={box} className="border border-line bg-white p-3">
            <QRCodeCanvas value={url} size={200} level="M" fgColor="#14284B" bgColor="#FFFFFF" role="img" aria-label={`QR code that opens article ${article.paperId}`} />
          </div>
          <p className="break-all text-center font-mono text-xs text-ink">{url}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" onClick={save}><Download className="h-4 w-4" aria-hidden />Download QR (PNG)</Button>
            <CopyButton text={url} label="Copy link" />
          </div>
        </div>
      </Modal>
    </>
  )
}

export function CiteIssueButton({ issue }: { issue: IssueSummary }) {
  const [open, setOpen] = useState(false)
  const text = `${journal.name} (${formatMonthYear(issue.month)}). Volume ${issue.volume}, Issue ${issue.issue}. ISSN ${journal.issnOnline}. https://doi.org/${issue.doi}`
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}><FormatQuote className="h-4 w-4" aria-hidden />Cite this Issue</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Cite this Issue">
        <p className="mb-3 text-sm text-ink-muted">Use this reference when citing the issue as a whole. To cite a single paper, use the Cite button on the article.</p>
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words border border-line border-l-[3px] border-l-navy bg-paper p-4 font-sans text-sm leading-relaxed">{text}</pre>
        <div className="mt-4"><CopyButton text={text} label="Copy citation" /></div>
      </Modal>
    </>
  )
}
export function SubscribeIssueButton() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validate.email(email)
    setError(err)
    if (err) return
    setBusy(true)
    try { await api.subscribe(email.trim().toLowerCase()); toast('Subscribed. You will receive issue alerts by email.'); setOpen(false); setEmail('') }
    catch { toast('Could not subscribe. Please try again.', 'error') }
    finally { setBusy(false) }
  }
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Subscribe to Monthly Issue</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Subscribe to Monthly Issue">
        <form onSubmit={submit} noValidate className="space-y-3">
          <p className="text-sm text-ink-muted">Receive the monthly issue digest with DOIs as soon as a new issue is final. No account needed; unsubscribe anytime.</p>
          <Field label="Email" name="issue-sub-email" required error={error}>
            <input type="email" className={inputClass(error)} value={email} maxLength={120} autoComplete="email" placeholder="you@institution.edu"
              onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setError('') }} />
          </Field>
          <Button type="submit" loading={busy} className="w-full">Subscribe</Button>
        </form>
      </Modal>
    </>
  )
}

export const issueHref = (i: Pick<IssueSummary, 'volume' | 'issue' | 'isCurrent'>) => (i.isCurrent ? paths.currentIssue : paths.issue(i.volume, i.issue))
