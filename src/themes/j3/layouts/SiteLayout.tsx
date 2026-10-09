// Page frame: skip link, journal tabs, utility bar, header, content, footer, the command palette and (on phones) a sticky Submit bar.
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import type { SuggestFn } from '../../../core/types'
import { CommandPalette } from '../components/CommandPalette'
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
  const [paletteOpen, setPaletteOpen] = useState(false)
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  // Article pages carry their own bottom dock, and the submit page has its own controls.
  const showBar = !pathname.includes('/article/') && !pathname.endsWith('/submit')

  // Ctrl/Cmd + K toggles the palette; "/" opens it when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen((v) => !v); return }
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) { e.preventDefault(); setPaletteOpen(true) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => { setPaletteOpen(false) }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-j3paper">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-5 focus:py-2.5 focus:font-inter focus:text-sm focus:font-semibold focus:text-iris-700 focus:shadow-dock">Skip to content</a>
      <JournalTabs />
      <UtilityBar />
      <SearchContext.Provider value={{ onSearch, onSuggest, openPalette }}>
        <Header onOpenSearch={openPalette} />
        <main id="main" className="flex-1">{children}</main>
      </SearchContext.Provider>
      <Footer onSubscribe={onSubscribe} />
      <CommandPalette open={paletteOpen} onClose={closePalette} onSearch={onSearch} onSuggest={onSuggest} />
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/10 bg-night-900 p-3 sm:hidden">
          <AppLink to={paths.track} className="flex flex-1 items-center justify-center gap-2 border border-white/40 px-3 py-3 font-inter text-xs font-semibold uppercase tracking-[0.06em] text-white hover:bg-white/10"><Track className="h-4 w-4" aria-hidden="true" /> Track</AppLink>
          <AppLink to={paths.submit} className="flex flex-[2] items-center justify-center gap-2 bg-ember-500 px-3 py-3 font-inter text-xs font-semibold uppercase tracking-[0.06em] text-night-900 hover:bg-ember-400"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</AppLink>
        </div>
      )}
    </div>
  )
}
