import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ComponentType } from 'react'
import { MdOutlineEditNote, MdOutlineGroups, MdOutlineHome, MdOutlineInventory2, MdOutlineMenuBook } from 'react-icons/md'
import { journal } from '../../../config/journals/j1'
import { nav, type NavItem } from '../../../config/navigation'
import { paths } from '../../../config/routes'
import { btnClass } from '../components/Button'
import { Container } from '../components/primitives'
import { QuickTrack } from '../components/QuickTrack'
import { AppLink, useRouter } from '../../../core/router'
import { SearchBox, type SuggestFn } from '../components/SearchBox'
import { BadgeCheck, ChevronDown, Menu, Search, X } from '../components/uiIcons'

/** Navy call-to-action used in the brand row ("Submit Paper") and the compact sticky bar. */
const NAVY_CTA = 'bg-navy text-white hover:bg-navy-900'

/**
 * Journal identity. The full version (brand row) shows the seal, the full name with the short-name tag and the descriptor
 * line with the ISO badge. `compact` is the small version (sticky bar, mobile menu); `light` forces dark text; `markOnly` hides the name.
 */
export function Brand({ compact = false, light = false, markOnly = false }: { compact?: boolean; light?: boolean; markOnly?: boolean }) {
  const iso = journal.logos.find((l) => l.id === 'iso' && l.show)

  if (!compact) {
    return (
      <AppLink to={paths.home} className="flex items-center gap-3 sm:gap-4" aria-label={`${journal.shortName}: ${journal.name} home`}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-line bg-white p-0.5 sm:h-14 sm:w-14 sm:p-1">
          <img src="/journals/j1/logo.png" alt="" width={56} height={56} className="h-full w-full object-contain" />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="block font-serif text-[1.0625rem] font-bold leading-snug tracking-tight text-navy sm:text-[1.25rem] xl:text-[1.375rem]">{journal.name}</span>
            <span className="hidden rounded-sm border border-line bg-mist px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-scholar xl:inline-block">({journal.shortName})</span>
          </span>
          <span className="mt-1 hidden flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-semibold tracking-wide text-ink-muted sm:flex">
            <span className="text-scholar">Peer-Reviewed</span>
            {['Open Access Refereed Journal', 'Multidisciplinary Subjects'].map((f) => (
              <span key={f} className="inline-flex items-center gap-3"><span aria-hidden className="text-line">•</span><span className="font-medium">{f}</span></span>
            ))}
            {iso && <><span aria-hidden className="text-line">•</span><span className="inline-flex items-center gap-1 font-medium text-ink"><BadgeCheck className="h-3.5 w-3.5 text-scholar" aria-hidden />{iso.name} Certified</span></>}
          </span>
        </span>
      </AppLink>
    )
  }

  const onDark = !light
  return (
    <AppLink to={paths.home} className="flex items-center gap-3" aria-label={`${journal.shortName}: ${journal.name} home`}>
      <img src="/journals/j1/logo.png" alt="" width={40} height={40} className={`h-10 w-10 shrink-0 rounded bg-white ${onDark ? 'ring-1 ring-white/30' : ''}`} />
      <span className={`leading-tight ${markOnly ? 'sr-only' : ''}`}>
        <span className={`block font-serif text-sm font-semibold ${onDark ? 'text-white' : 'text-navy'}`}>{journal.name}</span>
      </span>
    </AppLink>
  )
}

/** Brand row: seal and title on the left; "Track Status" (outline) and "Submit Paper" (navy) on the right. */
export function SiteHeader({ onSearch, onSuggest, onMenuOpen }: { onSearch: (q: string) => void; onSuggest: SuggestFn; onMenuOpen: () => void }) {
  return (
    <header className="border-b border-line bg-white">
      <Container className="flex items-center gap-4 py-3.5 sm:py-4">
        <div className="min-w-0 flex-1 pr-2"><Brand /></div>
        <div className="flex shrink-0 items-center gap-3">
          <QuickTrack className="hidden sm:block" />
          <AppLink to={paths.submit} className={`hidden h-11 items-center gap-2 rounded px-5 text-sm font-bold md:inline-flex ${NAVY_CTA}`}><MdOutlineEditNote className="h-5 w-5" aria-hidden />Submit Paper</AppLink>
          <button type="button" onClick={onMenuOpen} aria-haspopup="dialog" aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded border border-line text-navy lg:hidden"><Menu className="h-5 w-5" aria-hidden /></button>
        </div>
      </Container>
      {/* On small screens the navigation bar is hidden, so search sits under the header. */}
      <Container className="pb-3.5 lg:hidden"><SearchBox id="mobile-search" onSearch={onSearch} onSuggest={onSuggest} /></Container>
    </header>
  )
}

// Navigation row: white, slate text, Scholar Blue underline on the active item.
const navLink = (active: boolean) =>
  `relative inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-t px-2.5 text-sm font-semibold transition-colors xl:px-3 ${
    active ? 'text-scholar after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-scholar' : 'text-ink-muted hover:bg-mist hover:text-navy'}`

const NAV_ICONS: Record<string, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  Home: MdOutlineHome, 'Current Issue': MdOutlineMenuBook, 'Past Issues': MdOutlineInventory2, 'Editorial Board': MdOutlineGroups,
}

/** Menu item with a panel. Plain dropdown for short lists; a wide mega menu when `item.mega` is set. */
function MenuItem({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const reduce = useReducedMotion()
  const mega = !!item.mega

  return (
    <li ref={ref} className={mega ? '' : 'relative'} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false) }}
      onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); ref.current?.querySelector('button')?.focus() } }}>
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)} className={navLink(active)}>
        {item.label}<ChevronDown className={`-mr-1 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={reduce ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute z-50 border border-line bg-white text-ink shadow-xl ${mega ? 'inset-x-0 top-full border-x-0' : 'left-0 top-full min-w-56 py-2'}`}>
            {mega ? (
              <Container className="grid gap-8 py-6 lg:grid-cols-[repeat(3,1fr)_260px]">
                {item.mega!.map((g) => (
                  <div key={g.title}>
                    <p className="mb-2 border-b border-line pb-1.5 text-[11px] font-bold uppercase tracking-wider text-navy">{g.title}</p>
                    <ul className="space-y-0.5">
                      {g.links.map((l) => (
                        <li key={l.to + l.label}>
                          <AppLink to={l.to} onClick={() => setOpen(false)} className="group block rounded px-2 py-1.5 hover:bg-mist">
                            <span className="block text-sm font-semibold text-navy group-hover:text-scholar">{l.label}</span>
                            <span className="block text-xs text-ink-muted">{l.description}</span>
                          </AppLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="flex flex-col justify-between rounded bg-navy p-5 text-white">
                  <div>
                    <p className="font-serif text-lg font-semibold">Ready to publish?</p>
                    <p className="mt-1 text-sm text-navy-100">Submit in about ten minutes. No account needed, and your Paper ID arrives instantly.</p>
                  </div>
                  <AppLink to={paths.submit} className={`${btnClass('submit', 'sm')} mt-4 self-start`}><MdOutlineEditNote className="h-5 w-5" aria-hidden />Submit Manuscript</AppLink>
                </div>
              </Container>
            ) : (
              <ul>
                {item.children!.map((c) => (
                  <li key={c.to + c.label}><AppLink to={c.to} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-ink hover:bg-mist hover:text-scholar">{c.label}</AppLink></li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/** Sticky white navigation row with icons and chevrons; a search icon opens the search field. After scrolling it shows the compact mark and the Submit button. */
export function MainNav({ onSearch, onSuggest }: { onSearch: (q: string) => void; onSuggest: SuggestFn }) {
  const { pathname } = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 160)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setSearchOpen(false) }, [pathname])
  useEffect(() => { if (searchOpen) document.getElementById('global-search')?.focus() }, [searchOpen])
  const isActive = (item: NavItem) => (item.match ? item.match(pathname) : pathname.startsWith(item.to))

  return (
    <nav aria-label="Main" className={`sticky top-0 z-40 hidden border-b border-line bg-white lg:block ${scrolled ? 'shadow-lift' : ''}`}>
      <Container className="flex items-center">
        {scrolled && <div className="mr-3 py-1"><Brand compact markOnly light /></div>}
        <ul className="flex flex-1 items-center">
          {nav.map((item) => {
            const Icon = NAV_ICONS[item.label]
            return item.children ? (
              <MenuItem key={item.label} item={item} active={isActive(item)} />
            ) : (
              <li key={item.label}>
                <AppLink to={item.to} className={navLink(isActive(item))} aria-current={isActive(item) ? 'page' : undefined}>
                  {Icon && <Icon className="h-4 w-4" aria-hidden />}{item.label}
                </AppLink>
              </li>
            )
          })}
        </ul>
        {searchOpen && <SearchBox id="global-search" variant="nav" onSearch={onSearch} onSuggest={onSuggest} className="mr-2 w-64 shrink-0 xl:w-80" />}
        <button type="button" aria-expanded={searchOpen} aria-label={searchOpen ? 'Close search' : 'Search articles'} onClick={() => setSearchOpen(!searchOpen)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-ink-muted hover:bg-mist hover:text-navy">
          {searchOpen ? <X className="h-5 w-5" aria-hidden /> : <Search className="h-5 w-5" aria-hidden />}
        </button>
        {scrolled && <AppLink to={paths.submit} className={`ml-2 inline-flex h-9 items-center gap-1.5 rounded px-4 text-sm font-bold ${NAVY_CTA}`}><MdOutlineEditNote className="h-5 w-5" aria-hidden />Submit</AppLink>}
      </Container>
    </nav>
  )
}
