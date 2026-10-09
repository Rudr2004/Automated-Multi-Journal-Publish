// Article page, right rail: a QR code that opens this article on a phone. Download gives a PNG for slides, posters or print.
import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { articleUrl } from '../../../core/lib/articleLink'
import { Download } from './uiIcons'

export function ArticleQrCard({ paperId }: { paperId: string }) {
  const url = articleUrl(paperId)
  const box = useRef<HTMLDivElement>(null)
  const save = () => {
    const canvas = box.current?.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${paperId}-qr.png`
    a.click()
  }
  return (
    <section aria-labelledby="qr-title" className="border border-line bg-white p-4">
      <h2 id="qr-title" className="border-b border-line pb-2 text-xs font-bold uppercase tracking-[0.12em] text-navy">Scan to open on your phone</h2>
      <div className="mt-3 flex items-center gap-4">
        <div ref={box} className="shrink-0 border border-line bg-white p-2">
          <QRCodeCanvas value={url} size={112} level="M" fgColor="#14284B" bgColor="#FFFFFF" role="img" aria-label={`QR code that opens article ${paperId}`} />
        </div>
        <div className="min-w-0 text-[13px] leading-snug text-ink-muted">
          <p>Point your phone camera at the code to open this article directly.</p>
          <p className="mt-1.5 break-all font-mono text-[11px] text-ink">{paperId}</p>
        </div>
      </div>
      <button type="button" onClick={save} className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded border border-line bg-white px-3 text-xs font-semibold text-navy hover:border-scholar hover:bg-scholar-soft">
        <Download className="h-4 w-4" aria-hidden />Download QR code (PNG)
      </button>
    </section>
  )
}
