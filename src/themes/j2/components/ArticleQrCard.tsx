// Article page, sidebar: a QR code that opens this article on a phone. Download gives a PNG for slides, posters or print.
import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { articleUrl } from '../../../core/lib/articleLink'
import { Download } from '../icons'

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
    <section aria-labelledby="qr-h" className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card">
      <h2 id="qr-h" className="font-display text-xs font-bold uppercase tracking-[0.12em] text-brand-900">Scan to open on your phone</h2>
      <div className="mt-3 flex items-center gap-4">
        <div ref={box} className="shrink-0 rounded-soft border border-graphite-200 bg-white p-2">
          <QRCodeCanvas value={url} size={112} level="M" fgColor="#064E3B" bgColor="#FFFFFF" role="img" aria-label={`QR code that opens article ${paperId}`} />
        </div>
        <div className="min-w-0 text-sm leading-snug text-graphite-700">
          <p>Point your phone camera at the code to open this article directly.</p>
          <p className="mt-1.5 break-all font-mono text-xs text-graphite-800">{paperId}</p>
        </div>
      </div>
      <button type="button" onClick={save} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-soft border border-graphite-300 bg-white px-3 text-sm font-semibold text-graphite-800 hover:border-accent-700 hover:text-accent-800">
        <Download className="h-4 w-4" aria-hidden="true" />Download QR code (PNG)
      </button>
    </section>
  )
}
