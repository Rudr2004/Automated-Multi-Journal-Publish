// Journal 4 (IJECM) theme: "Scholarly Precision". Registers its pages with the shared containers.
import '@fontsource-variable/source-serif-4'
import '@fontsource-variable/work-sans'
import type { Theme } from '../../core/theme'
import { SiteShell } from '../../core/site/SiteShell'
import { AsyncView } from './components/AsyncView'
import { ToastProvider } from './components/Toast'
import { SiteLayout } from './layouts/SiteLayout'
import { ComingSoon } from './pages/ComingSoon'
import { ArticlePage } from './pages/ArticlePage'
import { EditorialBoardPage } from './pages/EditorialBoardPage'
import { HomePage } from './pages/HomePage'
import { IssuePage } from './pages/IssuePage'
import { PastIssuesPage } from './pages/PastIssuesPage'
import { SearchPage } from './pages/SearchPage'
import { StaticPage } from './pages/StaticPage'
import { VerifyCertificatePage } from './pages/VerifyCertificatePage'
import { SubmitPage } from './pages/SubmitPage'
import { TrackPage } from './pages/TrackPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Pages marked pending are designed in the next phases; they already receive the same props as the other journals' pages.
const theme: Theme = {
  AsyncView,
  pages: {
    Home: HomePage,
    Issue: IssuePage, PastIssues: PastIssuesPage, Article: ArticlePage, EditorialBoard: EditorialBoardPage,
    Submit: SubmitPage, Track: TrackPage, Verify: VerifyCertificatePage,
    Search: SearchPage, Static: StaticPage, NotFound: NotFoundPage,
  },
}

export default function J4Site() {
  return <SiteShell theme={theme} Providers={ToastProvider} Layout={SiteLayout} ComingSoon={ComingSoon} />
}
