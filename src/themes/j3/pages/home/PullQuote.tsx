// Pull-quote panel: one sentence lifted from an article in the current issue, with a reference card for the source article.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, Testimonial } from '../../../../core/types'
import { Artwork } from '../../components/Artwork'
import { Container, Kicker } from '../../components/primitives'
import { themeColor } from '../../components/themes'
import { ArrowRight, Quote } from '../../icons'

export function PullQuote({ quote, article }: { quote: Testimonial; article?: ArticleSummary }) {
  return (
    <section aria-label="From the issue" className="py-14 sm:py-20">
      <Container>
        <div className="grid gap-8 rounded-sheet bg-iris-50 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 lg:p-12">
          <figure className="min-w-0">
            <Kicker className="text-iris-700">From the issue</Kicker>
            <Quote aria-hidden="true" className="mt-4 h-10 w-10 text-ember-500" />
            <blockquote className="mt-3 font-jakarta text-[1.375rem] font-bold leading-snug tracking-tight text-night-900 sm:text-[1.75rem]">{quote.quote}</blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              {quote.photo && <img src={quote.photo} alt="" width={52} height={52} className="h-[52px] w-[52px] rounded-full object-cover ring-2 ring-white" />}
              <span className="min-w-0">
                <span className="block font-jakarta text-base font-extrabold text-night-900">{quote.name}</span>
                <span className="block text-sm text-mauve-700">{quote.institution}</span>
              </span>
            </figcaption>
          </figure>

          {article && (
            <AppLink to={paths.article(article.paperId)} className="group flex flex-col overflow-hidden rounded-block bg-white ring-1 ring-inset ring-mauve-200 transition-shadow hover:shadow-lift3">
              <Artwork seed={article.paperId} className="h-28 w-full" />
              <span className="flex flex-1 flex-col p-5">
                <span className="font-jakarta text-xs font-extrabold uppercase tracking-[0.08em]" style={{ color: themeColor(article.subject) }}>{article.subject}</span>
                <span className="mt-2 font-jakarta text-base font-extrabold leading-snug text-night-900 group-hover:text-iris-700">{article.title}</span>
                <span className="mt-2 text-sm text-mauve-700">{article.authors.slice(0, 2).join(', ')}{article.authors.length > 2 ? ' et al.' : ''}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 font-jakarta text-sm font-bold text-iris-700">Read the article <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
              </span>
            </AppLink>
          )}
        </div>
      </Container>
    </section>
  )
}
