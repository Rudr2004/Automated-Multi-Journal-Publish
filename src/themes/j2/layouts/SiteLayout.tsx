// Page frame: skip link, header, content, footer and (on phones) a sticky Submit bar.
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

export function SiteLayout({ children, onSearch, onSuggest, onSubscribe }: {
  children: ReactNode
  onSearch: (q: string) => void
  onSuggest: SuggestFn
  onSubscribe: (email: string) => Promise<void>
}) {
  const { pathname } = useRouter()
  // Article pages carry their own mobile action bar, so the generic one is hidden there.
  const showBar = !pathname.includes('/article/') && !pathname.endsWith('/submit')
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-soft focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-700 focus:shadow-pop">Skip to content</a>
      <JournalTabs />
      <SearchContext.Provider value={{ onSearch, onSuggest }}>
        <Header onSearch={onSearch} onSuggest={onSuggest} />
        <main id="main" className="flex-1">{children}</main>
      </SearchContext.Provider>
      <Footer onSubscribe={onSubscribe} />
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-graphite-200 bg-white/95 p-3 backdrop-blur sm:hidden">
          <AppLink to={paths.track} className={`${buttonClass('outline')} flex-1`}><Track className="h-4 w-4" aria-hidden="true" /> Track</AppLink>
          <ButtonLink to={paths.submit} variant="cta" className="flex-[2]"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
        </div>
      )}
    </div>
  )
}
