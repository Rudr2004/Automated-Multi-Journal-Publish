import { useEffect, useState, type ReactNode } from 'react'
import { BASE, paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { useRouter } from '../../../core/router'
import type { SuggestFn } from '../components/SearchBox'
import { ArrowUp } from '../components/uiIcons'
import { SiteFooter } from './Footer'
import { MainNav, SiteHeader } from './Header'
import { MobileDrawer } from './MobileDrawer'
import { JournalTabs } from './JournalTabs'
import { ResearchRibbon } from './ResearchRibbon'

export function SiteLayout({ children, onSearch, onSuggest }: { children: ReactNode; onSearch: (q: string) => void; onSuggest: SuggestFn }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const { pathname } = useRouter()
  // The article page renders its own sticky bottom bar (Download PDF, Cite, Share); the submit page has Back / Next.
  const ownBottomBar = pathname.startsWith(`${BASE}/article/`) || pathname === paths.submit

  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[80] focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to main content
      </a>
      <JournalTabs />
      <ResearchRibbon />
      <SiteHeader onSearch={onSearch} onSuggest={onSuggest} onMenuOpen={() => setMenuOpen(true)} />
      <MainNav onSearch={onSearch} onSuggest={onSuggest} />
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main id="main">{children}</main>
      <SiteFooter />

      {showTop && (
        <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed left-4 z-30 flex h-11 w-11 items-center justify-center rounded border border-line bg-white text-navy hover:border-scholar hover:text-scholar md:bottom-6 bottom-20`}>
          <ArrowUp className="h-5 w-5" aria-hidden />
        </button>
      )}

      {/* Sticky mobile CTA */}
      {!ownBottomBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-3 md:hidden">
          <ButtonLink to={paths.submit} variant="submit" className="w-full">Submit Manuscript</ButtonLink>
        </div>
      )}
    </div>
  )
}
