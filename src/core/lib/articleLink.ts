// The public address of an article page, as encoded in its QR code. It uses the address the site is being served from (so a scan works on any
// deployment, preview or the journal's own domain) and falls back to the journal's domain when there is no browser location.
import { journal } from '../../config/journals'
import { paths } from '../../config/routes'

export const articleUrl = (paperId: string): string =>
  `${typeof window !== 'undefined' && window.location.origin ? window.location.origin : `https://${journal.domain}`}${paths.article(paperId)}`
