// The three content cards of the home column: About the Journal, Aims and Scope (vision / mission / aim, research areas, manuscript formats)
// and the Official Journal Details table. Text comes from the journal config; nothing here claims an index, rating or membership the journal does not hold.
import type { ComponentType, ReactNode } from 'react'
import { journal } from '../../../../config/journals'
import { Eye as Visibility, Explore, LibraryBooks, Mail, PublicIcon } from '../../components/homeIconsJ5'
import { cx } from '../../components/primitives'
import { Computational, Development, Earth, Industrial, Maths, Physics, Track, type IconProps } from '../../icons'
import { Description, Language } from '../../components/homeIconsJ5'

const card = 'rounded border border-[#dcc0be] bg-white p-6 shadow-sm sm:p-8'
const Rule = () => <div aria-hidden="true" className="j5-double-rule mb-3" />
const kicker = 'font-work text-xs font-bold uppercase tracking-wider'

export function AboutJournal() {
  return (
    <section aria-labelledby="j5-about" className={card}>
      <Rule />
      <div className="mb-2 flex items-center gap-2"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-wine-800" /><span className={cx(kicker, 'text-wine-800')}>About the Journal</span></div>
      <h2 id="j5-about" className="mb-4 font-newsreader text-2xl font-semibold leading-tight text-[#141b2b]">{journal.name} ({journal.shortName})</h2>
      <div className="space-y-3.5 font-serif4 text-sm leading-relaxed text-[#564241]">
        <p>The <strong>{journal.name} ({journal.shortName})</strong> is an international, peer-reviewed, open access, {journal.frequency.toLowerCase()} journal published from {journal.publisherCity}. It offers a dependable platform for the prompt publication of rigorous fundamental research and the development that follows from it.</p>
        <p>Every article is free to read, share and reuse under <strong>{journal.licence.name}</strong>, and authors keep their copyright.</p>
        <p>Papers are screened by an editor and reviewed by experts against a published checklist. {journal.shortName} publishes its ethics, plagiarism and conflict-of-interest policies, and registers every article with a permanent <strong>Crossref DOI</strong> under the prefix {journal.doiPrefix}.</p>
      </div>
    </section>
  )
}

const frame: [ComponentType<IconProps>, string, string, string, string][] = [
  [Visibility, 'Journal Vision', 'A trusted open access home for fundamental research and the development that follows from it, free for every reader.', 'text-wine-800', 'Open Foundations'],
  [Explore, 'Journal Mission', journal.mission, 'text-[#9b4500]', 'Rigorous and Open'],
  [Track, 'Core Aim', 'To publish original research articles, review articles and short communications across the nine research areas of the journal.', 'text-emerald-800', 'Nine Research Areas'],
]
const FORMATS = ['Original Research Articles', 'Systematic Review Articles', 'Rapid Communications', 'Case Studies', 'Theoretical Notes']
// The six faculties of the journal's scope, as in the design reference.
const FACULTIES: [string, string, ComponentType<IconProps>][] = [
  ['Engineering & Emerging Technologies', 'Micro- & Nano-Electro-Mechanical Systems (MEMS), Sustainable Energy Storage & Battery Kinetics, Autonomous Robotics, Cyber-Physical Systems, Advanced Metallurgy, and Structural Aerospace Composites.', Industrial],
  ['Management & Leadership Studies', 'Technological Innovation Management, Organizational Leadership, Quantitative Economics, Supply Chain Systems, Digital Society Governance, and Public Technology Policy Frameworks.', Development],
  ['Science (Pure & Applied Sciences)', 'Condensed Matter & Topological Materials, Quantum Optics, High Energy Physics, Inorganic & Organic Chemistry, Supramolecular Synthesis, Nanotechnology, and Non-Equilibrium Thermodynamics.', Physics],
  ['Arts & Humanities', 'Epistemology & Philosophy of Science, Visual & Digital Culture, Aesthetics, Cultural Heritage Informatics, Historical Studies, and Creative Interdisciplinary Expression.', Earth],
  ['Social Science', 'Epistemology & Sociology of Knowledge, Cognitive Science, Quantitative Economics, Behavioral Studies, Public Policy, and Global Sustainable Development.', Maths],
  ['Multidisciplinary & Interdisciplinary Studies', 'Cross-disciplinary Methodologies, Complex Systems, Data Science Applications, AI Ethics & Society, Climate Informatics, and Emerging Frontier Studies.', Computational],
]

export function AimsScope() {
  return (
    <section aria-labelledby="j5-aims" className={card}>
      <Rule />
      <div className="mb-2 flex items-center justify-between gap-2 border-b border-obsidian-200 pb-2">
        <div className="flex items-center gap-2"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#9b4500]" /><span className={cx(kicker, 'text-[#9b4500]')}>Journal Charter &amp; Scope</span></div>
        <span className="hidden rounded border border-[#dcc0be] bg-[#f4f5fc] px-2 py-0.5 font-work text-[11px] uppercase tracking-wider text-[#564241] sm:inline">Peer-Reviewed Journal</span>
      </div>
      <h2 id="j5-aims" className="mb-3 font-newsreader text-2xl font-semibold leading-tight text-[#141b2b] sm:text-3xl">Aim, Vision, Mission &amp; Research Scope</h2>
      <p className="mb-6 font-serif4 text-sm leading-relaxed text-[#564241]">{journal.shortName} works to a simple charter: rigorous peer review, open access for every reader, and a permanent, verifiable record of each published article.</p>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {frame.map(([Icon, title, text, tone, foot]) => (
          <div key={title} className="flex flex-col justify-between rounded border border-[#dcc0be] bg-[#f4f5fc] p-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-wine-800"><Icon className="h-5 w-5" aria-hidden="true" /><h3 className="font-newsreader text-base font-bold text-[#141b2b]">{title}</h3></div>
              <p className="font-work text-xs leading-relaxed text-[#564241]">{text}</p>
            </div>
            <div className={cx('mt-3 border-t border-[#dcc0be]/60 pt-2 font-work text-[10px] font-semibold uppercase tracking-widest', tone)}>{foot}</div>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2"><Industrial className="h-[18px] w-[18px] text-wine-800" aria-hidden="true" /><h3 className="font-newsreader text-lg font-bold text-[#141b2b]">Comprehensive Multidisciplinary Disciplines &amp; Scope</h3></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FACULTIES.map(([name, text, Icon]) => (
            <div key={name} className="rounded border border-[#dcc0be] bg-[#f4f5fc] p-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 font-newsreader text-sm font-bold text-wine-800"><Icon className="h-[17px] w-[17px]" aria-hidden="true" /><span>{name}</span></h4>
              <p className="font-work text-xs leading-relaxed text-[#564241]">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-3 rounded border border-[#dcc0be] bg-[#f4f5fc]/50 p-4 font-work text-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-[#141b2b]"><LibraryBooks className="h-[18px] w-[18px] text-[#9b4500]" aria-hidden="true" /><span className="font-work text-xs font-semibold uppercase tracking-wider text-wine-800">Accepted Manuscript Formats:</span></div>
        <ul className="flex flex-wrap items-center gap-2 text-[#564241]">
          {FORMATS.map((f, i) => <li key={f} className="flex items-center gap-2">{i > 0 && <span aria-hidden="true" className="text-[#dcc0be]">•</span>}<span className="rounded border border-[#dcc0be] bg-white px-2.5 py-0.5 font-medium text-[#141b2b]">{f}</span></li>)}
        </ul>
      </div>
    </section>
  )
}

const th = 'w-1/3 border-r border-[#dcc0be] px-4 py-3 text-left align-top font-semibold text-wine-800 sm:w-1/4'

export function JournalDetails() {
  const rows: [string, ReactNode][] = [
    ...journal.info.filter(([k]) => k !== 'Email' && k !== 'Website' && k !== 'Address' && k !== 'Licence' && k !== 'Publication Format' && k !== 'Starting Year').map(([k, v]) => [k, k === 'Publisher' ? 'IJFRD Journal' : k === 'Subject' ? 'Multidisciplinary Subjects' : v] as [string, ReactNode]),
    ['Publication Format', <span key="pf" className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1 font-semibold text-emerald-800"><PublicIcon className="h-4 w-4" aria-hidden="true" /> Online</span><span className="text-[#564241]">(Open Access, {journal.licence.name})</span></span>],
    ['DOI Prefix', <span key="doi" className="font-mono font-bold text-[#9b4500]">{journal.doiPrefix} (Crossref)</span>],
    ['Email', <a key="m" className="inline-flex items-center gap-1 font-medium text-wine-800 hover:underline" href={`mailto:${journal.email}`}><Mail className="h-[15px] w-[15px]" aria-hidden="true" /> {journal.email}</a>],
    ['Website', <span key="w" className="inline-flex items-center gap-1 font-medium text-wine-800"><Language className="h-[15px] w-[15px]" aria-hidden="true" /> https://{journal.domain}</span>],
    ['Official Address', <span key="a" className="leading-relaxed">{journal.address.replace(journal.publisher, journal.name)}</span>],
  ]
  rows.splice(1, 0, ['Short Title / Acronym', journal.shortName])
  return (
    <section aria-labelledby="j5-details" className="rounded border-2 border-[#dcc0be] bg-white p-6 shadow-sm sm:p-8">
      <Rule />
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-obsidian-200 pb-2">
        <h2 id="j5-details" className="flex items-center gap-2 font-newsreader text-xl font-bold text-wine-800 sm:text-2xl"><Description className="h-6 w-6 text-[#9b4500]" aria-hidden="true" /><span>Official Journal Details</span></h2>
        <span className="hidden rounded bg-[#e1e8fd] px-2.5 py-1 font-work text-[11px] font-medium uppercase tracking-wider text-[#564241] sm:inline">Journal Profile</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#dcc0be] text-left font-work text-xs sm:text-sm">
          <tbody>
            {rows.map(([k, v], i) => (
              <tr key={k} className={cx('border-b border-obsidian-200', i % 2 === 0 && 'bg-[#f4f5fc]/50')}>
                <th scope="row" className={th}>{k}</th>
                <td className="px-4 py-3 font-medium text-[#141b2b]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
