// Page frame: skip link, journal tabs, utility bar, header, content, footer and (on phones) a sticky Submit bar.
import type { ReactNode } from 'react'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import type { SuggestFn } from '../../../core/types'
import { ButtonLink, buttonClass } from '../components/Button'
import { SearchContext } from '../components/searchContext'
import { Submit, Track } from '../icons'
import { Footer } from './Footer'
import { Header } from './Header'
import { JournalTabs } from './JournalTabs'
import { UtilityBar } from './UtilityBar'

export function SiteLayout({ children, onSearch, onSuggest, onSubscribe }: {
  children: ReactNode
  onSearch: (q: string) => void
  onSuggest: SuggestFn
  onSubscribe: (email: string) => Promise<void>
}) {
  const { pathname } = useRouter()
  // Article pages carry their own mobile bar, and the submit page its own controls.
  const showBar = !pathname.includes('/article/') && !pathname.endsWith('/submit')
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-wine-800 focus:shadow-lift">Skip to content</a>
      <JournalTabs />
      <UtilityBar />
      <SearchContext.Provider value={{ onSearch, onSuggest }}>
        <Header />
        <main id="main" className="flex-1">{children}</main>
      </SearchContext.Provider>
      <Footer onSubscribe={onSubscribe} />
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-obsidian-200 bg-[#FBF8F4]/95 p-3 backdrop-blur sm:hidden">
          <AppLink to={paths.track} className={`${buttonClass('outline')} flex-1`}><Track className="h-4 w-4" aria-hidden="true" /> Track</AppLink>
          <ButtonLink to={paths.submit} variant="cta" className="flex-[2]"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
        </div>
      )}
    </div>
  )
}
