import '@fontsource-variable/source-sans-3'
import '@fontsource-variable/source-serif-4'
// Journal 1 (IJMAT) theme: "Scholar Navy". Registers its pages with the shared containers.
import type { Theme } from '../../core/theme'
import { SiteShell } from '../../core/site/SiteShell'
import { AsyncView } from './components/AsyncView'
import { ExitIntent } from './components/ExitIntent'
import { ToastProvider } from './components/Toast'
import { SiteLayout } from './layouts/SiteLayout'
import { ArticlePage } from './pages/ArticlePage'
import { ComingSoon } from './pages/ComingSoon'
import { EditorialBoardPage } from './pages/EditorialBoardPage'
import { HomePage } from './pages/HomePage'
import { IssuePage } from './pages/IssuePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PastIssuesPage } from './pages/PastIssuesPage'
import { SearchPage } from './pages/SearchPage'
import { StaticPage } from './pages/StaticPage'
import { SubmitPage } from './pages/SubmitPage'
import { TrackPage } from './pages/TrackPage'
import { VerifyCertificatePage } from './pages/VerifyCertificatePage'

const theme: Theme = {
  AsyncView,
  HomeExtras: ExitIntent,
  pages: {
    Home: HomePage, Issue: IssuePage, PastIssues: PastIssuesPage, Article: ArticlePage, EditorialBoard: EditorialBoardPage,
    Submit: SubmitPage, Track: TrackPage, Verify: VerifyCertificatePage, Search: SearchPage, Static: StaticPage, NotFound: NotFoundPage,
  },
}

export default function J1Site() {
  return <SiteShell theme={theme} Providers={ToastProvider} Layout={SiteLayout} ComingSoon={ComingSoon} />
}
