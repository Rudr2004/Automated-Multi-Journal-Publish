// Main-column sections of the home page after the reference: 02 Aims & editorial scope (with the subject disciplines), 04 Submission-to-publication timeline,
// 05 Ethical compliance & scholarly principles (journal.trustLedger) and 06 Editorial board (HomeData.leadership).
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { EditorProfile } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { initials, labelCls, linkCls, panel, SquareHead } from './bits'

export function Aims() {
  return (
    <section aria-labelledby="home-aims">
      <SquareHead id="home-aims" n="02" title="Aims & editorial scope" />
      <p className="font-inter text-[17px] leading-[1.65] text-night-700">The <em>{journal.name}</em> ({journal.shortName}) is a {journal.frequency.toLowerCase()} open access journal. {journal.mission.replace(/^IJCSD is a monthly open access journal /, 'It is a journal ')}</p>
      <p className="mt-5 font-jakarta text-[11px] font-bold uppercase tracking-[0.06em] text-night-900">Designated subject disciplines:</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {journal.subjects.map((s) => <li key={s}><AppLink to={paths.search(s)} className="inline-block rounded-tile border border-j3paper-rule bg-j3paper-cool px-3 py-1.5 font-inter text-[13px] font-medium text-iris-800 transition-colors hover:border-iris-700 hover:bg-j3paper-deep">{s}</AppLink></li>)}
      </ul>
      <p className="mt-4"><AppLink to={paths.about('aims-scope')} className={linkCls}>Read the full aims and scope &rarr;</AppLink></p>
    </section>
  )
}

const steps: [string, string][] = [
  ['Submission & triage', 'Editor checks scope, format and similarity before review.'],
  ['Peer review', 'Assigned to expert reviewers who report in writing.'],
  ['Editorial decision', 'Acceptance, minor revision or major revision, with reasons.'],
  ['Author proofing', 'Typesetting, bibliography checks and author sign-off.'],
  ['DOI & publication', 'Open access release with a permanent Crossref DOI.'],
]

export function Timeline() {
  return (
    <section aria-labelledby="home-flow">
      <SquareHead id="home-flow" n="04" title="From submission to publication timeline" />
      <ol className={`${panel} grid divide-y divide-j3paper-rule sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x`}>
        {steps.map(([t, d], i) => (
          <li key={t} className={cx('p-4', i === steps.length - 1 && 'bg-j3paper-cool')}>
            <span aria-hidden="true" className={cx('inline-flex h-6 w-6 items-center justify-center rounded-tile font-jakarta text-xs font-bold tabular-nums text-white', i === steps.length - 1 ? 'bg-night-900' : 'bg-iris-700')}>{i + 1}</span>
            <h3 className="mt-3 font-jakarta text-sm font-semibold leading-snug text-night-900">{t}</h3>
            <p className="mt-1.5 font-inter text-xs leading-relaxed text-mauve-600">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Principles() {
  return (
    <section aria-labelledby="home-principles">
      <SquareHead id="home-principles" n="05" title="Ethical compliance & scholarly principles" />
      <ul className={`${panel} grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2`}>
        {journal.trustLedger.map((t) => (
          <li key={t.id}>
            <h3 className="font-jakarta text-base font-semibold text-night-900">{t.title}</h3>
            <p className="mt-2 font-inter text-[13px] leading-relaxed text-night-700">{t.text}</p>
            <AppLink to={t.to} className={`${linkCls} mt-2 inline-block text-xs`}>Read more &rarr;</AppLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Board({ editors }: { editors: EditorProfile[] }) {
  if (!editors.length) return null
  const shades = ['bg-night-900', 'bg-iris-700', 'bg-mauve-700', 'bg-night-800']
  return (
    <section aria-labelledby="home-board">
      <SquareHead id="home-board" n="06" title="Editorial board & section chairs" aside={<AppLink to={paths.editorialBoard} className={linkCls}>Full editorial board &rarr;</AppLink>} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {editors.slice(0, 4).map((e, i) => (
          <li key={e.id} className={`${panel} flex items-center gap-4 p-4`}>
            {e.photo
              ? <img src={e.photo} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-tile object-cover" />
              : <span aria-hidden="true" className={cx('flex h-14 w-14 shrink-0 items-center justify-center rounded-tile font-jakarta text-base font-bold text-white', shades[i % shades.length])}>{initials(e.name)}</span>}
            <div className="min-w-0">
              <p className="font-jakarta text-[15px] font-semibold text-night-900">{e.name}</p>
              <p className={`${labelCls} mt-0.5 normal-case tracking-normal text-iris-700`}>{e.role}{e.areas[0] ? ` • ${e.areas[0]}` : ''}</p>
              <p className="font-inter text-xs text-mauve-600">{e.institution} &bull; {e.country}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
