import { IndexedStrip } from '../components/IndexLogos'
import { Container } from '../components/primitives'
import { AppLink } from '../../../core/router'
import { ArrowUp, Mail, MessageCircle } from '../components/uiIcons'
import { journal, visibleLogos } from '../../../config/journals/j1'
import { policyLinks } from '../../../config/navigation'
import { paths } from '../../../config/routes'

const link = 'text-[13px] font-medium text-[#B4C6F2] hover:text-white hover:underline'
const heading = 'mb-3 text-xs font-bold uppercase tracking-wider text-white'
const FOOTER_LOGOS = 8
const POLICY_SLUGS = ['peer-review', 'publication-ethics', 'plagiarism', 'open-access', 'ai-policy', 'retraction']

export function SiteFooter() {
  const indexing = visibleLogos().filter((l) => ['scholar', 'openalex', 'semantic', 'worldcat', 'zenodo', 'researchgate'].includes(l.id))
  const policies = POLICY_SLUGS.map((s) => policyLinks.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p)
  const authors = [
    ['Author Guidelines', paths.policy('author-guidelines')], ['Submission Process', paths.forAuthors('submission-process')],
    ['Article Templates', paths.forAuthors('templates')], ['APC & Payment', paths.forAuthors('apc-payment')],
    ['Track My Paper', paths.track], ['Certificate Verification', paths.verify()],
  ] as const
  const archives = [
    ['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues], ['Editorial Board', paths.editorialBoard],
    ['Aims & Scope', paths.about('aims-scope')], ['Journal Information', paths.about('journal-information')], ['Contact', paths.about('contact')],
  ] as const
  const total = visibleLogos().length
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="mt-12 bg-navy-900 text-white">
      <Container className="pt-10 pb-2">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold sm:text-[1.75rem]">Browse journals by subject</h2>
          <button type="button" onClick={toTop} className="inline-flex items-center gap-1 text-sm font-semibold text-[#B4C6F2] hover:text-white">Back to top <ArrowUp className="h-4 w-4" aria-hidden /></button>
        </div>
        <ul className="columns-1 gap-x-8 sm:columns-2 lg:columns-4">
          {journal.subjectIndex.map((s) => (
            <li key={s} className="break-inside-avoid border-b border-white/10">
              <AppLink to={paths.search(s)} className="block py-1.5 text-[13px] font-semibold text-white hover:text-[#B4C6F2] hover:underline">{s}</AppLink>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-8 border-t border-white/15 pt-8">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(4,1fr)_1.35fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/journals/j1/logo.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded bg-white p-0.5" />
              <p className="font-serif text-lg font-bold">{journal.shortName}</p>
            </div>
            <p className="mt-3 text-[13px] font-semibold leading-snug text-white">{journal.name}</p>
            <div className="mt-3 space-y-1 text-xs text-[#B4C6F2]">
              <div>Online ISSN: <span className="inline font-semibold tabular-nums text-white">{journal.issnOnline}</span></div>
              <div>Crossref DOI: <span className="inline font-semibold tabular-nums text-white">{journal.doiPrefix}</span></div>
              <div>Licence: <span className="inline font-semibold text-white">{journal.licence.name}</span></div>
              <div>Frequency: <span className="inline font-semibold text-white">{journal.frequency}</span></div>
            </div>
          </div>
          <nav aria-label="Indexing and access">
            <h2 className={heading}>Indexing &amp; access</h2>
            <ul className="space-y-1.5">
              {indexing.map((l) => <li key={l.id}><a href={l.verifyUrl} target="_blank" rel="noopener noreferrer" className={link}>{l.name}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
              <li><AppLink to={paths.about('indexing')} className={link}>All indexing details →</AppLink></li>
            </ul>
          </nav>
          <nav aria-label="Journal policies">
            <h2 className={heading}>Journal policies</h2>
            <ul className="space-y-1.5">
              {policies.map((p) => <li key={p.to}><AppLink to={p.to} className={link}>{p.label}</AppLink></li>)}
              <li><AppLink to={paths.policy('publication-charges')} className={link}>All policies →</AppLink></li>
            </ul>
          </nav>
          <nav aria-label="Author resources">
            <h2 className={heading}>Author resources</h2>
            <ul className="space-y-1.5">{authors.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
          </nav>
          <nav aria-label="Explore the journal">
            <h2 className={heading}>Explore the journal</h2>
            <ul className="space-y-1.5">{archives.map(([l, to]) => <li key={l}><AppLink to={to} className={link}>{l}</AppLink></li>)}</ul>
          </nav>
          <div>
            <h2 className={heading}>Editorial office</h2>
            <p className="text-[13px] font-semibold leading-snug text-white">{journal.publisher}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#B4C6F2]">{journal.address}</p>
            <ul className="mt-3 space-y-1.5 text-xs text-[#B4C6F2]">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" aria-hidden /><a href={`mailto:${journal.email}`} className="font-semibold text-white hover:underline">{journal.email}</a></li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 shrink-0" aria-hidden />WhatsApp: {journal.whatsapp}</li>
            </ul>
          </div>
        </div>
      </Container>

      {total > 0 && (
        <Container className="mt-8 border-t border-white/15 pt-5">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className={`${heading} mb-0`}>Indexed and verified</h2>
            <AppLink to={paths.about('indexing')} className={link}>{total > FOOTER_LOGOS ? `All ${total} listings →` : 'Indexing details →'}</AppLink>
          </div>
          <IndexedStrip look="footer" limit={FOOTER_LOGOS} />
          <p className="mt-2 text-xs text-[#B4C6F2]">Select a logo to see what the listing means and to verify it on the index’s own website.</p>
        </Container>
      )}

      <Container className="mt-8 border-t border-white/15 pb-6 pt-5">
        <div className="flex flex-wrap items-start justify-between gap-4 text-xs text-[#B4C6F2]">
          <div className="max-w-3xl space-y-1">
            <p>© {new Date().getFullYear()} {journal.name} ({journal.shortName}). Published by {journal.publisher}, {journal.publisherCity}.</p>
            <p className="font-semibold text-white">All research articles are licensed under the Creative Commons Attribution 4.0 International Licence (CC BY 4.0). {journal.badges.cope ? 'This journal follows COPE core practices and principles of transparency.' : ''}</p>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <AppLink to={paths.policy('privacy')} className="hover:text-white hover:underline">Privacy Policy</AppLink>
            <button type="button" onClick={toTop} className="inline-flex items-center gap-1 text-white hover:underline">Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden /></button>
          </div>
        </div>
      </Container>
    </footer>
  )
}
