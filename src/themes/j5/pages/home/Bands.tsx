// Two full-width bands of the home page, as in the reference: the Journal Xplore query band (search bar and three quick-browse filters)
// and the Scholarly Recognition row (two cards). No award has been announced for this journal, so the cards say so instead of naming winners.
import { useId } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { useRouter } from '../../../../core/router'
import { ArchiveSearch } from '../../components/ArchiveSearch'
import { MilitaryTech, Psychology } from '../../components/homeIconsJ5'
import { Container } from '../../components/primitives'
import { Award } from '../../icons'

const select = 'w-full rounded border border-[#dcc0be] bg-white p-2 font-work text-xs text-[#141b2b] focus:border-wine-800 focus:outline-none'
const lab = 'mb-1 block font-work text-[11px] uppercase text-[#564241]'
const TYPES = ['Research Article', 'Review Article', 'Short Communication', 'Editorial']

export function XploreBand() {
  const { navigate } = useRouter()
  const id = useId()
  return (
    <section aria-labelledby="j5-xplore" className="border-y border-[#dcc0be] bg-[#f4f5fc] px-0 py-10">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <div aria-hidden="true" className="j5-double-rule mb-3" />
            <h2 id="j5-xplore" className="mb-1 font-newsreader text-2xl font-semibold text-[#141b2b]">{journal.shortName} Xplore: Scholarly Archive Query</h2>
            <p className="font-serif4 text-xs text-[#564241] sm:text-sm">Search published articles by keyword, author, title, DOI or Paper ID.</p>
          </div>
          <div className="space-y-4">
            <ArchiveSearch variant="band" placeholder={`Search by keyword, author name, DOI ${journal.doiPrefix}, Paper ID or subject...`} />
            <div className="grid grid-cols-1 gap-3 font-work text-xs sm:grid-cols-3">
              <div>
                <label htmlFor={`${id}-d`} className={lab}>Research Area</label>
                <select id={`${id}-d`} defaultValue="" onChange={(e) => e.target.value && navigate(paths.search(e.target.value))} className={select}>
                  <option value="">All research areas</option>
                  {journal.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor={`${id}-y`} className={lab}>Publication Year</label>
                <select id={`${id}-y`} defaultValue="" onChange={(e) => e.target.value && navigate(e.target.value)} className={select}>
                  <option value="">Choose a volume</option>
                  <option value={paths.currentIssue}>Current volume</option>
                  <option value={paths.pastIssues}>All volumes</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${id}-t`} className={lab}>Document Category</label>
                <select id={`${id}-t`} defaultValue="" onChange={(e) => e.target.value && navigate(paths.search(e.target.value))} className={select}>
                  <option value="">All document types</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function Recognition() {
  const cards = [
    { Icon: MilitaryTech, kicker: 'Best Paper Recognition', title: 'To be announced by the Editorial Board', chip: 'Not yet announced', text: 'No award has been conferred yet. When the Editorial Board confirms a recognition, the winning paper and its DOI will be listed here.', foot: [`${journal.shortName} Volume 1`, 'Announced by the Editorial Board'] },
    { Icon: Psychology, kicker: 'Reviewer Acknowledgement', title: 'Thanking the reviewers who sustain the journal', chip: 'Coming soon', text: 'Reviewers who complete timely, constructive reports will be acknowledged by name, with their consent, once the first reviewing cycle closes.', foot: ['Reviewer pool open', 'Apply on the reviewer page'] },
  ]
  return (
    <section aria-labelledby="j5-recog" className="py-10">
      <Container>
        <div className="mb-6 border-b border-obsidian-200 pb-2">
          <div aria-hidden="true" className="j5-double-rule mb-2" />
          <div className="flex items-center justify-between gap-3">
            <h2 id="j5-recog" className="flex items-center gap-2 font-newsreader text-xl font-semibold text-[#141b2b] sm:text-2xl"><Award className="h-6 w-6 text-amber-600" aria-hidden="true" /><span>{journal.shortName} Scholarly Recognition</span></h2>
            <span className="font-work text-xs uppercase text-[#564241]">Honours</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map(({ Icon, kicker, title, chip, text, foot }) => (
            <div key={kicker} className="relative flex flex-col justify-between overflow-hidden rounded border-2 border-amber-300/80 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-1.5 font-work text-xs font-bold uppercase text-amber-800"><Icon className="h-[18px] w-[18px]" aria-hidden="true" /><span>{kicker}</span></div>
                  <h3 className="font-newsreader text-lg font-bold text-[#141b2b]">{title}</h3>
                </div>
                <span className="shrink-0 rounded border border-amber-300 bg-amber-100 px-2 py-0.5 font-work text-[10px] font-bold uppercase text-amber-900">{chip}</span>
              </div>
              <p className="mb-3 font-work text-xs text-[#564241]">{text}</p>
              <div className="flex items-center justify-between gap-2 border-t border-obsidian-200 pt-3 font-work text-xs text-[#564241]"><span>{foot[0]}</span><span className="font-medium text-emerald-700">{foot[1]}</span></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
