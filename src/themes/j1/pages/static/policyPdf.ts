// Builds a simple, valid multi-page PDF of a static page's text (Helvetica, Latin-1 only), so "Download PDF" works without a backend.
import type { StaticBlock, StaticPageData } from '../../../../mock-data/journals/j1'
import { journal } from '../../../../config/journals/j1'
import { formatDate } from '../../../../core/lib/format'

const ascii = (s: string) => s.replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, '...').replace(/[•·]/g, '-').replace(/[^\x20-\x7E]/g, '?')
const esc = (s: string) => ascii(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

interface Line { text: string; size: number; bold?: boolean; gap?: number; indent?: number }

function wrap(text: string, max: number): string[] {
  const out: string[] = []
  let line = ''
  for (const w of ascii(text).split(/\s+/).filter(Boolean)) {
    if ((line + ' ' + w).trim().length > max) { out.push(line); line = w } else line = (line + ' ' + w).trim()
  }
  if (line) out.push(line)
  return out
}

function blockLines(b: StaticBlock): Line[] {
  const L: Line[] = []
  const para = (t: string, size = 10, indent = 0, bold = false) => wrap(t, Math.floor(98 - indent / 5)).forEach((x, i) => L.push({ text: x, size, indent, bold, gap: i === 0 ? 3 : 0 }))
  switch (b.type) {
    case 'in-brief': L.push({ text: b.title, size: 12, bold: true, gap: 8 }); b.items.forEach((it, i) => para(`${i + 1}. ${it.title}: ${it.text}`)); break
    case 'card-grid': b.items.forEach((it) => para(`${it.mark ? it.mark + '. ' : ''}${it.title}: ${it.text}`, 10, 10)); break
    case 'icon-list': b.items.forEach((it) => para(`- ${it.title}: ${it.text}`, 10, 10)); break
    case 'ordered-steps': if (b.title) L.push({ text: b.title, size: 11, bold: true, gap: 6 }); b.items.forEach((it, i) => para(`${i + 1}. ${it.title}${it.text ? ': ' + it.text : ''}${it.meta ? ' (' + it.meta + ')' : ''}`, 10, 10)); break
    case 'table': if (b.caption) L.push({ text: ascii(b.caption), size: 10, bold: true, gap: 6 }); L.push({ text: b.head.join('  |  '), size: 9.5, bold: true, gap: 2 }); b.rows.forEach((r) => para(r.join('  |  '), 9.5, 10)); break
    case 'callout': para(`${b.title}: ${b.text}`, 10, 10, false); break
    case 'faq-accordion': L.push({ text: b.title, size: 12, bold: true, gap: 8 }); b.items.forEach((f) => { para(`Q. ${f.q}`, 10, 0, true); para(f.a, 10, 10) }); break
    case 'steps': L.push({ text: b.title, size: 12, bold: true, gap: 8 }); b.items.forEach((it, i) => para(`${i + 1}. ${it.title}: ${it.text}`)); break
    case 'faq': L.push({ text: b.title, size: 12, bold: true, gap: 8 }); b.items.forEach((f) => { para(`Q. ${f.q}`, 10, 0, true); para(f.a, 10, 10) }); break
    default: break
  }
  return L
}

export function buildPolicyPdf(page: StaticPageData): Blob {
  const lines: Line[] = [
    { text: journal.name, size: 9 },
    { text: `ISSN ${journal.issnOnline} - ${journal.licence.name}`, size: 8.5, gap: 6 },
    ...wrap(page.title, 46).map((t) => ({ text: t, size: 19, bold: true, gap: 6 })),
    { text: `Version ${page.meta?.version ?? '1.0'} - Last updated ${formatDate(page.updated)} - ${page.meta?.authority ?? 'Editorial Office'}`, size: 9, gap: 4 },
    ...wrap(page.intro, 98).map((t, i) => ({ text: t, size: 10.5, gap: i === 0 ? 10 : 0 })),
  ]
  page.sections.forEach((s, i) => {
    lines.push({ text: `${i + 1}.0  ${ascii(s.heading)}`, size: 13, bold: true, gap: 14 })
    s.paragraphs?.forEach((p) => wrap(p, 98).forEach((t, k) => lines.push({ text: t, size: 10, gap: k === 0 ? 4 : 0 })))
    s.blocks?.forEach((b) => lines.push(...blockLines(b)))
    s.list?.forEach((x) => wrap(x, 92).forEach((t, k) => lines.push({ text: (k === 0 ? '- ' : '  ') + t, size: 10, indent: 10, gap: k === 0 ? 3 : 0 })))
    if (s.callout) wrap(`${s.callout.title}: ${s.callout.text}`, 90).forEach((t, k) => lines.push({ text: t, size: 9.5, indent: 10, gap: k === 0 ? 6 : 0 }))
  })
  ;(page.blocks ?? []).forEach((b) => lines.push(...blockLines(b)))
  lines.push({ text: `Contact: ${journal.email}`, size: 9, gap: 18 })

  // Paginate.
  const pages: string[][] = [[]]
  let y = 800
  for (const l of lines) {
    y -= l.size * 1.4 + (l.gap ?? 0)
    if (y < 56) { pages.push([]); y = 800 - l.size * 1.4 }
    if (l.text) pages[pages.length - 1].push(`BT /${l.bold ? 'F2' : 'F1'} ${l.size} Tf ${(56 + (l.indent ?? 0)).toFixed(0)} ${y.toFixed(1)} Td (${esc(l.text)}) Tj ET`)
  }

  const objs: string[] = ['<< /Type /Catalog /Pages 2 0 R >>', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>']
  const kids: number[] = []
  pages.forEach((ops) => {
    const stream = ops.join('\n')
    const contentId = objs.length + 2
    kids.push(objs.length + 1)
    objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`)
    objs.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
  })
  objs[1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(' ')}] /Count ${kids.length} >>`

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const xref = pdf.length
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

export function downloadPolicyPdf(page: StaticPageData) {
  const url = URL.createObjectURL(buildPolicyPdf(page))
  const a = document.createElement('a')
  a.href = url
  a.download = `${journal.shortName}-${page.slug}.pdf`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
