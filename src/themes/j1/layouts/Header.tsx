import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals/j1'
import { nav, type NavItem } from '../../../config/navigation'
import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'
import { QuickTrack } from '../components/QuickTrack'
import { AppLink, useRouter } from '../../../core/router'
import { SearchBox, type SuggestFn } from '../components/SearchBox'
import { BadgeCheck, ChevronDown, FilePlus2, Menu } from '../components/uiIcons'

/**
 * Journal identity. The full version (header) shows the mark, the short name with the ISO badge, the full name and the
 * descriptor line. `compact` is the small version (sticky bar, mobile menu); `light` forces dark text; `markOnly` hides the name.
 */
export function Brand({ compact = false, light = false, markOnly = false }: { compact?: boolean; light?: boolean; markOnly?: boolean }) {
  const iso = journal.logos.find((l) => l.id === 'iso' && l.show)

  if (!compact) {
    return (
      <AppLink to={paths.home} className="flex items-center gap-4" aria-label={`${journal.shortName}: ${journal.name} home`}>
        <span className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded border border-line bg-white p-1 shadow-lift sm:h-[76px] sm:w-[76px]">
          <img src="/journals/j1/logo.png" alt="" width={76} height={76} className="h-full w-full" />
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-[1.1875rem] font-semibold leading-snug tracking-tight text-navy sm:text-[1.25rem] xl:text-[1.1875rem] 2xl:text-[1.375rem]">{journal.name}</span>
          <span className="mt-1.5 hidden flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-ink-muted sm:flex">
            {['Peer-Reviewed', 'Open Access Refereed Journal', 'Multidisciplinary Subjects'].map((f, i) => (
              <span key={f} className="inline-flex items-center gap-3">{i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-line" />}{f}</span>
            ))}
            {iso && <><span aria-hidden className="h-1 w-1 rounded-full bg-line" /><span className="inline-flex items-center gap-1 text-scholar"><BadgeCheck className="h-4 w-4" aria-hidden />{iso.name} Certified</span></>}
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

export function SiteHeader({ onSearch, onSuggest, onMenuOpen }: { onSearch: (q: string) => void; onSuggest: SuggestFn; onMenuOpen: () => void }) {
  return (
    <header className="bg-white">
      <Container className="flex items-center gap-4 py-4">
        <div className="-ml-3 min-w-0 flex-1 pr-6 xl:-ml-5"><Brand /></div>
        <div className="flex shrink-0 items-center gap-2.5">
          <QuickTrack className="hidden sm:block" />
          <ButtonLink to={paths.submit} variant="submit" className="hidden md:inline-flex"><FilePlus2 className="h-4 w-4" aria-hidden />Submit Manuscript</ButtonLink>
          <button type="button" onClick={onMenuOpen} aria-haspopup="dialog" aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded border border-line text-navy lg:hidden"><Menu className="h-5 w-5" aria-hidden /></button>
        </div>
      </Container>
      {/* On small screens the navigation bar is hidden, so search sits under the header. */}
      <Container className="pb-3.5 lg:hidden"><SearchBox id="mobile-search" onSearch={onSearch} onSuggest={onSuggest} /></Container>
    </header>
  )
}

// Navy navigation bar: white text, white underline on the active item.
const navLink = (active: boolean) =>
  `relative inline-flex h-12 items-center gap-1 px-3.5 text-sm font-medium transition-colors ${
    active ? 'text-white after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-white' : 'text-navy-100 hover:text-white'}`

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
        {item.label}<ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={reduce ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute z-50 border border-line bg-white text-ink shadow-xl ${mega ? 'inset-x-0 top-full border-x-0' : 'left-0 top-full min-w-56 py-2'}`}>
            {mega ? (
              <Container className="grid gap-8 py-6 lg:grid-cols-[repeat(3,1fr)_260px]">
                {item.mega!.map((g) => (
                  <div key={g.title}>
                    <p className="mb-2 border-b border-line pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{g.title}</p>
                    <ul className="space-y-0.5">
                      {g.links.map((l) => (
                        <li key={l.to + l.label}>
                          <AppLink to={l.to} onClick={() => setOpen(false)} className="group block rounded px-2 py-1.5 hover:bg-scholar-soft">
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
                  <ButtonLink to={paths.submit} variant="submit" size="sm" className="mt-4 self-start"><FilePlus2 className="h-4 w-4" aria-hidden />Submit Manuscript</ButtonLink>
                </div>
              </Container>
            ) : (
              <ul>
                {item.children!.map((c) => (
                  <li key={c.to + c.label}><AppLink to={c.to} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-ink hover:bg-scholar-soft hover:text-scholar">{c.label}</AppLink></li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/** Sticky navy navigation bar with the search on the right. After scrolling it shows the compact mark and the Submit button. */
export function MainNav({ onSearch, onSuggest }: { onSearch: (q: string) => void; onSuggest: SuggestFn }) {
  const { pathname } = useRouter()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 160)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const isActive = (item: NavItem) => (item.match ? item.match(pathname) : pathname.startsWith(item.to))

  return (
    <nav aria-label="Main" className={`sticky top-0 z-40 hidden bg-navy transition-shadow lg:block ${scrolled ? 'shadow-xl' : ''}`}>
      <Container className="flex items-center">
        {scrolled && <div className="mr-3 py-1.5"><Brand compact markOnly /></div>}
        <ul className="flex flex-1 items-center">
          {nav.map((item) =>
            item.children ? (
              <MenuItem key={item.label} item={item} active={isActive(item)} />
            ) : (
              <li key={item.label}>
                <AppLink to={item.to} className={navLink(isActive(item))} aria-current={isActive(item) ? 'page' : undefined}>{item.label}</AppLink>
              </li>
            ),
          )}
        </ul>
        <SearchBox id="global-search" variant="nav" onSearch={onSearch} onSuggest={onSuggest} className="ml-3 w-64 shrink-0 xl:w-72" />
        {scrolled && <ButtonLink to={paths.submit} variant="submit" size="sm" className="ml-3"><FilePlus2 className="h-4 w-4" aria-hidden />Submit</ButtonLink>}
      </Container>
    </nav>
  )
}
