import { IndexedStrip } from '../components/IndexLogos'
import { Container } from '../components/primitives'
import { AppLink } from '../../../core/router'
import { ArrowUp, Globe, Mail, MapPin, MessageCircle, Rss } from '../components/uiIcons'
import { journal, visibleLogos } from '../../../config/journals/j1'
import { policyLinks } from '../../../config/navigation'
import { paths } from '../../../config/routes'

const link = 'text-sm text-navy-100 hover:text-white hover:underline'
const heading = 'mb-3 text-xs font-semibold uppercase tracking-wider text-white'
const social = { rss: Rss, mail: Mail, web: Globe } as const
const FOOTER_LOGOS = 8

export function SiteFooter() {
  const quick = [
    ['Home', paths.home], ['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues], ['Editorial Board', paths.editorialBoard],
    ['Aims & Scope', paths.about('aims-scope')], ['Contact', paths.about('contact')],
  ] as const
  const authors = [
    ['Author Guidelines', paths.policy('author-guidelines')], ['Submission Process', paths.forAuthors('submission-process')],
    ['Article Templates', paths.forAuthors('templates')], ['APC & Payment', paths.forAuthors('apc-payment')],
    ['Track My Paper', paths.track], ['Certificate Verification', paths.verify()],
  ] as const
  const total = visibleLogos().length

  return (
    <footer className="mt-12 bg-navy text-white">
      <section aria-labelledby="browse-h" className="border-b border-white/15 bg-navy-900">
        <Container className="py-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="browse-h" className="font-serif text-xl font-semibold">Browse by subject</h2>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1 text-sm text-navy-100 hover:text-white">Back to top <ArrowUp className="h-4 w-4" aria-hidden /></button>
          </div>
          <ul className="columns-1 gap-x-8 sm:columns-2 lg:columns-4">
            {journal.subjectIndex.map((s) => (
              <li key={s} className="break-inside-avoid border-t border-white/15">
                <AppLink to={paths.search(s)} className="block py-2 font-serif text-[0.9375rem] font-semibold text-[#A9C2FF] hover:text-white hover:underline">{s}</AppLink>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-xl font-semibold leading-snug">{journal.name}</p>
          <p className="mt-1 text-sm font-semibold text-navy-200">{journal.shortName} · ISSN (Online) {journal.issnOnline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy-100">{journal.mission}</p>
          <ul className="mt-4 flex gap-2">
            {journal.follow.map((f) => {
              const Icon = social[f.id as keyof typeof social]
              return <li key={f.id}><a href={f.href} aria-label={f.label} className="flex h-9 w-9 items-center justify-center rounded border border-white/30 hover:border-white hover:bg-white/10"><Icon className="h-4 w-4" aria-hidden /></a></li>
            })}
          </ul>
        </div>
        <nav aria-label="Quick links"><h2 className={heading}>Quick links</h2><ul className="space-y-2">{quick.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul></nav>
        <nav aria-label="For authors"><h2 className={heading}>For authors</h2><ul className="space-y-2">{authors.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul></nav>
        <nav aria-label="Policies">
          <h2 className={heading}>Policies</h2>
          <ul className="space-y-2">
            {policyLinks.slice(0, 6).map((p) => <li key={p.to}><AppLink to={p.to} className={link}>{p.label}</AppLink></li>)}
            <li><AppLink to={paths.policy('publication-ethics')} className={link}>All policies →</AppLink></li>
          </ul>
        </nav>
      </Container>

      {total > 0 && (
        <div className="border-t border-white/15">
          <Container className="py-6">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className={`${heading} mb-0`}>Indexed and verified</h2>
              <AppLink to={paths.about('indexing')} className={link}>{total > FOOTER_LOGOS ? `All ${total} listings →` : 'Indexing details →'}</AppLink>
            </div>
            <IndexedStrip look="footer" limit={FOOTER_LOGOS} />
            <p className="mt-2 text-xs text-navy-200">Select a logo to see what the listing means and to verify it on the index’s own website.</p>
          </Container>
        </div>
      )}

      <div className="border-t border-white/15">
        <Container className="grid gap-5 py-6 text-sm text-navy-100 md:grid-cols-2">
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" aria-hidden /><a href={`mailto:${journal.email}`} className="hover:text-white">{journal.email}</a></li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 shrink-0" aria-hidden />WhatsApp: {journal.whatsapp}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{journal.address}</li>
          </ul>
          <p className="md:text-right">
            Published by <strong className="font-semibold text-white">{journal.publisher}</strong>,<br />{journal.publisherCity}
          </p>
        </Container>
      </div>

      <div className="border-t border-white/15 bg-navy-900">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-navy-100">
          <span>Open Access · {journal.licence.name} · DOI prefix {journal.doiPrefix} · © {new Date().getFullYear()} {journal.publisher}. All rights reserved.</span>
          {/* <span className="flex items-center gap-4">
            <AppLink to={paths.editorialLogin} className="hover:text-white hover:underline">Editorial login</AppLink>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1 hover:text-white">Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden /></button>
          </span> */}
        </Container>
      </div>
    </footer>
  )
}
