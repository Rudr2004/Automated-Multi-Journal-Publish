// Index of every page and key demo state in the active journal's prototype.
import { Link } from 'react-router-dom'
import { journal } from '../config/journals'
import { STAGES } from '../core/types'
import type { PrototypeDemo } from './demo'
import { policyLinks } from '../config/navigation'
import { paths } from '../config/routes'

type Item = [label: string, to: string, note?: string]
interface Section { title: string; items: Item[] }

const buildSections = ({ trackedPapers, articleIds, pastIssue }: PrototypeDemo): Section[] => {
  const P = journal.paperIdPrefix
  const trackStates: Item[] = [...trackedPapers]
  .sort((a, b) => a.stageIndex - b.stageIndex)
  .map((p) => [`Stage ${p.stageIndex + 1}: ${STAGES[p.stageIndex].label}${p.stageIndex === 4 ? (p.payment === 'verifying' ? ' · UPI proof being verified' : ' · payment due') : ''}`, `${paths.track}?id=${p.paperId}&email=${encodeURIComponent(p.email)}`, p.paperId])

  return [
  { title: 'Main pages', items: [
    ['Home', paths.home], ['Current Issue', paths.currentIssue], ['Past Issues', paths.pastIssues],
    [`Past issue (Vol ${pastIssue[0]}, Issue ${pastIssue[1]})`, paths.issue(pastIssue[0], pastIssue[1])], ['Editorial Board', paths.editorialBoard],
  ] },
  { title: 'Article page', items: [
    ['Article — research article', paths.article(articleIds[0])], ['Article — review article', paths.article(articleIds[1])],
    ['Article — editorial', paths.article(articleIds[2])], ['Article — article not found', paths.article(`${P}0000000000`)],
  ] },
  { title: 'Submit & track', items: [
    ['Submit Manuscript (form)', paths.submit], ['Submission success screen', `${paths.submit}?state=success`], ...trackStates,
    ['Track — paper not found', `${paths.track}?id=${P}2026009999&email=nobody@example.com`],
    ['Track — Paper ID from another journal', `${paths.track}?id=XYZ2026000001&email=demo@example.com`],
    ['Track — empty form', paths.track],
  ] },
  { title: 'Search & verification', items: [
    ['Search results', paths.search('graphene')], ['Search — empty state', paths.search('zzzzqq')],
    ['Certificate — valid', paths.verify(`${P}-CERT-${articleIds[0]}`)], ['Certificate — invalid', paths.verify(`${P}-CERT-0000`)], ['Certificate — blank form', paths.verify()],
  ] },
  { title: 'Policies', items: policyLinks.map((p) => [p.label, p.to] as Item) },
  { title: 'For Authors & About', items: [
    ['Submission Process', paths.forAuthors('submission-process')], ['Article Templates', paths.forAuthors('templates')], ['APC & Payment', paths.forAuthors('apc-payment')],
    ['Become a Reviewer', paths.forAuthors('become-a-reviewer')], ['Journal Information', paths.about('journal-information')], ['Aims & Scope', paths.about('aims-scope')], ['Indexing', paths.about('indexing')], ['Contact', paths.about('contact')],
    ['APC section on Home', paths.apc], ['404 page', `${paths.home}/does-not-exist`],
  ] },
]
}

export default function PrototypeIndex({ demo }: { demo: PrototypeDemo }) {
  const sections = buildSections(demo)
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <h1 className="font-serif text-3xl font-semibold text-navy">Prototype index</h1>
      <p className="mt-2 text-ink-muted">{journal.name} · every page and key state. Demo OTP code: <code>123456</code>.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {sections.map((s) => (
          <section key={s.title} className="rounded-card border border-line bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-navy">{s.title}</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {s.items.map(([label, to, note]) => (
                <li key={label + to}><Link to={to} className="text-navy-600 hover:underline">{label}</Link>{note && <span className="ml-2 text-xs text-ink-muted">{note}</span>}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
