// Journal 2 (JIMRT) theme: "Emerald Scholar". Registers its pages with the shared containers.
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/ibm-plex-sans'
import type { Theme } from '../../core/theme'
import { SiteShell } from '../../core/site/SiteShell'
import { AsyncView } from './components/AsyncView'
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
  pages: {
    Home: HomePage, Issue: IssuePage, PastIssues: PastIssuesPage, Article: ArticlePage, EditorialBoard: EditorialBoardPage,
    Submit: SubmitPage, Track: TrackPage, Verify: VerifyCertificatePage, Search: SearchPage, Static: StaticPage, NotFound: NotFoundPage,
  },
}

export default function J2Site() {
  return <SiteShell theme={theme} Providers={ToastProvider} Layout={SiteLayout} ComingSoon={ComingSoon} />
}
