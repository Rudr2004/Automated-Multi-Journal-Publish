import { Download } from './uiIcons'
import { useState } from 'react'
import type { ArticleFull } from '../../../mock-data/journals/j1'
import { CITATION_STYLES, citationFilename, formatCitation, type CitationStyle } from '../../../core/lib/cite'
import { downloadText } from '../../../core/lib/clipboard'
import { CopyButton } from './ArticleParts'
import { Modal } from './Modal'

export function CiteModal({ article, open, onClose }: { article: ArticleFull; open: boolean; onClose: () => void }) {
  const [style, setStyle] = useState<CitationStyle>('apa')
  const text = formatCitation(article, style)
  const mono = style === 'bibtex' || style === 'ris'
  return (
    <Modal open={open} onClose={onClose} title="Cite this Article">
      <p className="mb-3 text-sm text-ink-muted">Choose a format, then copy it or download a file for your reference manager.</p>
      <div role="tablist" aria-label="Citation style" className="flex flex-wrap gap-1.5">
        {CITATION_STYLES.map((s) => (
          <button key={s.id} role="tab" aria-selected={style === s.id} onClick={() => setStyle(s.id)}
            className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${style === s.id ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-scholar hover:bg-scholar-soft'}`}>{s.label}</button>
        ))}
      </div>
      <pre role="tabpanel" className={`mt-4 max-h-64 overflow-auto whitespace-pre-wrap break-words border border-line border-l-[3px] border-l-navy bg-paper p-4 text-sm leading-relaxed ${mono ? 'font-mono text-xs' : 'font-sans'}`}>{text}</pre>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton text={text} label="Copy citation" />
        <button type="button" onClick={() => downloadText(citationFilename(article, style), text)}
          className="inline-flex items-center gap-1.5 rounded border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-navy hover:border-scholar hover:bg-scholar-soft">
          <Download className="h-3.5 w-3.5" aria-hidden />Download .{citationFilename(article, style).split('.')[1]}
        </button>
      </div>
    </Modal>
  )
}
