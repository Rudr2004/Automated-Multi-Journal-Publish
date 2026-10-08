// Google Scholar / Highwire Press meta tags + ScholarlyArticle JSON-LD, built from one place.
import type { ArticleFull } from '../types'
import { doiFor, journal } from '../../config/journals'
import { paths } from '../../config/routes'

export interface MetaTag { name: string; content: string }

const dotDate = (iso: string) => iso.replace(/-/g, '/') // Scholar prefers yyyy/mm/dd

export function getScholarMeta(article: ArticleFull) {
  const origin = `https://${journal.domain}`
  const [firstPage, lastPage] = article.pages.split('–')
  const absUrl = `${origin}${paths.article(article.paperId)}`
  const pdfUrl = `${origin}${paths.pdf(article.paperId)}`

  const tags: MetaTag[] = [
    { name: 'citation_title', content: article.title },
    ...article.authorDetails.flatMap((a) => [
      { name: 'citation_author', content: a.name },
      ...a.affiliations.map((i) => ({ name: 'citation_author_institution', content: article.affiliations[i - 1] })),
      ...(a.orcid ? [{ name: 'citation_author_orcid', content: `https://orcid.org/${a.orcid}` }] : []),
    ]),
    { name: 'citation_publication_date', content: dotDate(article.publishedAt) },
    { name: 'citation_online_date', content: dotDate(article.publishedOnline) },
    { name: 'citation_journal_title', content: journal.name },
    { name: 'citation_issn', content: journal.issnOnline },
    { name: 'citation_volume', content: String(article.volume) },
    { name: 'citation_issue', content: String(article.issue) },
    { name: 'citation_firstpage', content: firstPage },
    { name: 'citation_lastpage', content: lastPage ?? firstPage },
    { name: 'citation_doi', content: doiFor(article.paperId) },
    { name: 'citation_pdf_url', content: pdfUrl },
    { name: 'citation_abstract_html_url', content: absUrl },
    { name: 'citation_keywords', content: article.keywords.join('; ') },
    { name: 'citation_language', content: 'en' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: article.title,
    name: article.title,
    abstract: article.abstract,
    author: article.authorDetails.map((a) => ({
      '@type': 'Person', name: a.name,
      ...(a.orcid ? { sameAs: `https://orcid.org/${a.orcid}` } : {}),
      affiliation: a.affiliations.map((i) => ({ '@type': 'Organization', name: article.affiliations[i - 1] })),
    })),
    datePublished: article.publishedOnline,
    dateCreated: article.received,
    keywords: article.keywords.join(', '),
    inLanguage: 'en',
    isAccessibleForFree: true,
    license: journal.licence.url,
    identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: doiFor(article.paperId) },
    url: absUrl,
    pageStart: firstPage,
    pageEnd: lastPage ?? firstPage,
    isPartOf: {
      '@type': 'PublicationIssue', issueNumber: String(article.issue),
      isPartOf: { '@type': 'PublicationVolume', volumeNumber: String(article.volume), isPartOf: { '@type': 'Periodical', name: journal.name, issn: journal.issnOnline } },
    },
    encoding: { '@type': 'MediaObject', contentUrl: pdfUrl, encodingFormat: 'application/pdf' },
  }
  return { tags, jsonLd }
}
