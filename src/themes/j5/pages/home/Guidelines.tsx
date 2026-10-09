// Editorial Guidelines & Perspectives: the editors' perspective(s) from the home data, then guideline cards, each with an illustrated header.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { HomeData } from '../../../../core/types'
import { Kicker } from '../../components/signature'
import { ArrowRight } from '../../icons'
import { HomeSection } from './HomeHead'

const GUIDES = [
  { img: 'card-guidelines', tag: 'For authors', title: 'Author guidelines', text: 'Structure, format and the ethics checklist for your manuscript.', to: paths.policy('author-guidelines') },
  { img: 'card-review', tag: 'Peer review', title: 'How review works', text: 'Editor screening, external review against a published checklist, and written reasons for every decision.', to: paths.policy('peer-review') },
  { img: 'card-ethics', tag: 'Standards', title: 'Publication ethics', text: 'What we expect of authors, reviewers and editors, and how concerns are handled.', to: paths.policy('publication-ethics') },
]

export function Guidelines({ perspectives }: { perspectives: HomeData['perspectives'] }) {
  return (
    <HomeSection id="guides-title" label="Guidelines & perspectives" title="Editorial guidelines and the editors’ view" bg="bg-white">
      <div className="space-y-4">
        {perspectives.map((p) => (
          <AppLink key={p.title} to={p.to} className="group grid overflow-hidden rounded border border-wine-800/20 bg-[#FBF8F4] transition duration-150 hover:-translate-y-px hover:border-wine-800 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:grid-cols-[18rem_1fr]">
            <img src="/journals/j5/images/card-perspective.svg" alt="" width={400} height={140} className="h-36 w-full object-cover md:h-full" />
            <span className="block p-5 sm:p-6">
              <Kicker>{p.tag}</Kicker>
              <span className="mt-1.5 block font-newsreader text-2xl font-semibold text-obsidian-900 group-hover:text-wine-800">{p.title}</span>
              <span className="mt-2 block font-serif4 text-[1.0625rem] leading-relaxed text-obsidian-700">{p.text}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-wine-800">Read the current issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
            </span>
          </AppLink>
        ))}
        <ul className="grid gap-4 md:grid-cols-3">
          {GUIDES.map((g) => (
            <li key={g.title}>
              <AppLink to={g.to} className="group flex h-full flex-col overflow-hidden rounded border border-obsidian-200 bg-white transition duration-150 hover:-translate-y-px hover:border-wine-800 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <img src={`/journals/j5/images/${g.img}.svg`} alt="" width={400} height={140} className="h-32 w-full object-cover" />
                <span className="flex flex-1 flex-col p-5">
                  <Kicker>{g.tag}</Kicker>
                  <span className="mt-1.5 font-newsreader text-xl font-semibold text-obsidian-900 group-hover:text-wine-800">{g.title}</span>
                  <span className="mt-1.5 font-serif4 text-[15px] leading-relaxed text-obsidian-700">{g.text}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-wine-800">Read more <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </HomeSection>
  )
}
