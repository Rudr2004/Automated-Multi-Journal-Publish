// "Collections": a staggered two-column layout of theme cards. Each card has a coloured header, a short list of featured articles and a link to browse the whole theme.
// The cards in the right-hand column sit lower than the ones on the left, so the section reads as a zig-zag instead of a single row.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { Container, cx, Kicker, SectionTitle } from '../../components/primitives'
import { themes } from '../../components/themes'
import { ArrowRight, ArrowUpRight } from '../../icons'

/** One line about each theme, shown in its card header. */
const BLURB: Record<string, string> = {
  design: 'Practice, process and meaning in design, craft and visual culture.',
  'arts-education': 'How the arts are taught, learned and used in classrooms and communities.',
  media: 'Journalism, social media, audiences and the stories societies tell.',
  heritage: 'Museums, archives and living traditions, and who gets to keep them.',
  industries: 'Work, enterprise and livelihoods in design, craft, film, games and music.',
  digital: 'Making and authorship with new tools, platforms and generative systems.',
  development: 'Creative methods in health, education and community development.',
  performing: 'Theatre, dance, music and ritual performance, past and present.',
}

const MAX_ARTICLES = 3

function ThemeCard({ index, id, name, color, articles }: { index: number; id: string; name: string; color: string; articles: ArticleSummary[] }) {
  const shown = articles.slice(0, MAX_ARTICLES)
  return (
    <li className={cx('flex', index % 2 === 1 && 'md:translate-y-14')}>
      <article aria-labelledby={`theme-${id}`} className="flex w-full flex-col overflow-hidden rounded-block bg-white ring-1 ring-inset ring-mauve-200 transition-shadow hover:shadow-lift3">
        <header className="p-6 text-white sm:p-7" style={{ backgroundColor: color }}>
          <Kicker className="text-white/80">Collection {String(index + 1).padStart(2, '0')}</Kicker>
          <h3 id={`theme-${id}`} className="mt-2 font-jakarta text-[1.5rem] font-extrabold leading-tight tracking-tight">{name}</h3>
          <p className="mt-2 text-sm text-white/90 sm:text-base">{BLURB[id]}</p>
        </header>

        {shown.length ? (
          <ul className="divide-y divide-mauve-100">
            {shown.map((a) => (
              <li key={a.paperId}>
                <AppLink to={paths.article(a.paperId)} className="group flex items-start justify-between gap-4 px-6 py-4 hover:bg-iris-50 sm:px-7">
                  <span className="min-w-0">
                    <span className="block font-jakarta text-base font-bold leading-snug text-night-900 group-hover:text-iris-700">{a.title}</span>
                    <span className="mt-1 block text-sm text-mauve-700">{a.authors.slice(0, 2).join(', ')}{a.authors.length > 2 ? ' et al.' : ''} · {a.type}</span>
                  </span>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-mauve-400 transition-colors group-hover:text-iris-700" aria-hidden="true" />
                </AppLink>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-6 sm:px-7">
            <p className="font-jakarta text-base font-bold text-night-900">Nothing featured here yet</p>
            <p className="mt-1 text-sm text-mauve-700">Work in this theme is welcome. <AppLink to={paths.submit} className="font-semibold text-iris-700 hover:underline">Submit a manuscript</AppLink>.</p>
          </div>
        )}

        <footer className="mt-auto border-t border-mauve-100 px-6 py-4 sm:px-7">
          <AppLink to={paths.search(name)} className="inline-flex items-center gap-1.5 font-jakarta text-sm font-bold text-iris-700 hover:underline">
            Browse all in {name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </AppLink>
        </footer>
      </article>
    </li>
  )
}

export function Shelves({ articles }: { articles: ArticleSummary[] }) {
  if (!themes.length) return null
  return (
    <section aria-labelledby="collections-title" className="bg-iris-50 py-16 sm:py-24">
      <Container>
        <SectionTitle id="collections-title" kicker="Collections" title="Browse by theme" />
        <ul className="grid items-start gap-6 md:grid-cols-2 md:pb-14">
          {themes.map((t, i) => <ThemeCard key={t.id} index={i} id={t.id} name={t.name} color={t.color} articles={articles.filter((a) => a.subject === t.name)} />)}
        </ul>
      </Container>
    </section>
  )
}
