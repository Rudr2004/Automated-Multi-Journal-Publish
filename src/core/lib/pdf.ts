// Minimal client-side PDF generator, so prototype "PDF" links download a real, valid PDF (no network, no library).
import { doiFor, journal } from '../../config/journals'
import { formatDate } from './format'

export interface PdfArticle {
  paperId: string; title: string; authors: string[]; abstract: string
  volume: number; issue: number; pages: string; publishedAt: string
}

/** PDF base fonts only cover Latin-1, so typographic characters are mapped to plain ones. */
const ascii = (s: string) =>
  s.replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, '...').replace(/[^\x20-\x7E]/g, '?')
const esc = (s: string) => ascii(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

function wrap(text: string, max: number): string[] {
  const out: string[] = []
  let line = ''
  for (const w of ascii(text).split(/\s+/)) {
    if ((line + ' ' + w).trim().length > max) { out.push(line); line = w } else line = (line + ' ' + w).trim()
  }
  if (line) out.push(line)
  return out
}

export function buildArticlePdf(a: PdfArticle): Blob {
  const lines: { text: string; size: number; bold?: boolean; gap?: number }[] = [
    { text: journal.name, size: 10 },
    { text: `Open Access · ${journal.licence.name} · ISSN ${journal.issnOnline}`, size: 9, gap: 14 },
    ...wrap(a.title, 52).map((t) => ({ text: t, size: 18, bold: true })),
    { text: a.authors.join(', '), size: 11, gap: 10 },
    { text: `Volume ${a.volume}, Issue ${a.issue}, pp. ${a.pages} · Published ${formatDate(a.publishedAt)}`, size: 9 },
    { text: `DOI: https://doi.org/${doiFor(a.paperId)}`, size: 9, gap: 18 },
    { text: 'Abstract', size: 13, bold: true },
    ...wrap(a.abstract, 95).map((t) => ({ text: t, size: 10.5 })),
    { text: '', size: 10, gap: 14 },
    { text: 'Prototype PDF generated in the browser. The production site serves the typeset article PDF.', size: 8 },
  ]

  let y = 790
  const ops: string[] = []
  for (const l of lines) {
    y -= l.size * 1.45 + (l.gap ?? 0)
    if (l.text) ops.push(`BT /${l.bold ? 'F2' : 'F1'} ${l.size} Tf 56 ${y.toFixed(1)} Td (${esc(l.text)}) Tj ET`)
  }
  const stream = ops.join('\n')

  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 6 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const xref = pdf.length
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

/** Saves the generated PDF as {Paper ID}.pdf. */
export function downloadArticlePdf(a: PdfArticle) {
  const url = URL.createObjectURL(buildArticlePdf(a))
  const link = document.createElement('a')
  link.href = url
  link.download = `${a.paperId}.pdf`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
