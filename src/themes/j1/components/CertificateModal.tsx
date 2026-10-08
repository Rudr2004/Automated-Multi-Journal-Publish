import { useState } from 'react'
import { Button } from './Button'
import { CertificateCard, certificateNumber, certificateUrl, type CertificateData } from './CertificateCard'
import { CopyButton } from './ArticleParts'
import { Modal } from './Modal'
import { Printer } from './uiIcons'

/** Shows one certificate per author. "Print / Save as PDF" prints only the certificate (see print styles in index.css). */
export function CertificateModal({ open, onClose, paper }: {
  open: boolean; onClose: () => void
  paper: { paperId: string; title: string; publishedAt: string; authors: string[]; volume?: number; issue?: number }
}) {
  const [i, setI] = useState(0)
  const author = paper.authors[i] ?? paper.authors[0]
  const number = certificateNumber(paper.paperId, i)
  const data: CertificateData = { author, paperId: paper.paperId, title: paper.title, publishedAt: paper.publishedAt, volume: paper.volume, issue: paper.issue }

  return (
    <Modal open={open} onClose={onClose} title="Author certificate" size="xl">
      {paper.authors.length > 1 && (
        <div role="tablist" aria-label="Choose author" className="mb-4 flex flex-wrap gap-1.5">
          {paper.authors.map((a, k) => (
            <button key={a} role="tab" aria-selected={k === i} type="button" onClick={() => setI(k)}
              className={`rounded border px-3 py-1 text-xs font-semibold ${k === i ? 'border-navy bg-navy text-white' : 'border-line text-ink-muted hover:border-navy hover:text-navy'}`}>{a}</button>
          ))}
        </div>
      )}
      <CertificateCard data={data} number={number} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden />Print / Save as PDF</Button>
        <CopyButton text={certificateUrl(number)} label="Copy verification link" />
      </div>
    </Modal>
  )
}
