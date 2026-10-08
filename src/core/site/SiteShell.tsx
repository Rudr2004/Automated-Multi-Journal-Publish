// Everything a journal site needs that is not design: router adapter, head manager, scroll handling, theme context and the route table.
// A theme only supplies its layout, toast provider, "coming soon" page and the page components in `theme`.
import { useEffect, useMemo, type ComponentType, type ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { paths } from '../../config/routes'
import { api } from '../api'
import { ArticleContainer } from '../containers/ArticleContainer'
import { SearchContainer, SubmitContainer, TrackContainer, VerifyContainer } from '../containers/AuthorContainers'
import { EditorialBoardContainer } from '../containers/EditorialBoardContainer'
import { HomeContainer } from '../containers/HomeContainer'
import { CurrentIssueContainer, IssueContainer, PastIssuesContainer } from '../containers/IssueContainers'
import { StaticPageContainer } from '../containers/StaticPageContainer'
import { RouterAdapterProvider, type RouterAdapter } from '../router'
import { ThemeProvider, type Theme } from '../theme'
import type { SuggestFn } from '../types'

export interface SiteParts {
  theme: Theme
  Providers: ComponentType<{ children: ReactNode }>
  Layout: ComponentType<{ children: ReactNode; onSearch: (q: string) => void; onSuggest: SuggestFn; onSubscribe: (email: string) => Promise<void> }>
  ComingSoon: ComponentType<{ title: string }>
}

// Paths are relative to the journal's address (see BASE in config/routes).
const placeholders: [path: string, title: string][] = [['editorial-login', 'Editorial Login']]

/** New page: scroll to the top. Link with a #hash: scroll to that element once it exists (pages load their data first). */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    let tries = 0
    const t = setInterval(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); clearInterval(t) }
      else if (++tries > 25) clearInterval(t)
    }, 120)
    return () => clearInterval(t)
  }, [pathname, hash])
  return null
}

export function SiteShell({ theme, Providers, Layout, ComingSoon }: SiteParts) {
  const location = useLocation()
  const navigate = useNavigate()
  const adapter = useMemo<RouterAdapter>(() => ({
    Link: ({ to, children, ...rest }) => <Link to={to} {...rest}>{children}</Link>,
    pathname: location.pathname,
    search: location.search,
    navigate,
  }), [location.pathname, location.search, navigate])
  const { NotFound } = theme.pages

  return (
    <HelmetProvider>
      <RouterAdapterProvider value={adapter}>
        <ThemeProvider value={theme}>
          <Providers>
            <ScrollToTop />
            <Layout onSearch={(q) => navigate(paths.search(q))} onSuggest={api.suggest} onSubscribe={api.subscribe}>
              <Routes>
                <Route index element={<HomeContainer />} />
                <Route path="current-issue" element={<CurrentIssueContainer />} />
                <Route path="past-issues" element={<PastIssuesContainer />} />
                <Route path="issue/:volume/:issue" element={<IssueContainer />} />
                <Route path="article/:id" element={<ArticleContainer />} />
                <Route path="editorial-board" element={<EditorialBoardContainer />} />
                <Route path="submit" element={<SubmitContainer />} />
                <Route path="track" element={<TrackContainer />} />
                <Route path="verify-certificate" element={<VerifyContainer />} />
                <Route path="search" element={<SearchContainer />} />
                <Route path="policies/:slug" element={<StaticPageContainer group="policies" />} />
                <Route path="for-authors/:slug" element={<StaticPageContainer group="for-authors" />} />
                <Route path="about/:slug" element={<StaticPageContainer group="about" />} />
                {placeholders.map(([path, title]) => <Route key={path} path={path} element={<ComingSoon title={title} />} />)}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Providers>
        </ThemeProvider>
      </RouterAdapterProvider>
    </HelmetProvider>
  )
}
