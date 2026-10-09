// Header: a light utility bar (ISSN, DOI prefix, Open Access, status links), a brand row (logo tile, journal name, Track + Submit) that
// scrolls away, and a sticky solid-emerald navigation bar with dropdowns, the Disciplines menu and search.
// On phones and tablets one compact sticky bar replaces the brand and navigation rows.
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import type { SuggestFn } from '../../../core/types'
import { BrandBlock, LogoTile } from '../components/BrandBlock'
import { DisciplineIcon, disciplines } from '../components/discipline'
import { CloudUpload, TravelExplore, VerifiedUser } from '../components/homeIcons'
import { cx } from '../components/primitives'
import { ChevronDown, Close, Email, Menu, OpenAccess, Search } from '../icons'
import { apcLink, editorialLink, homeLink, menus, primaryLinks, type NavLinkItem } from './nav'
import { MobileNav } from './MobileNav'
import { SearchOverlay } from './SearchOverlay'

type MenuId = 'disciplines' | 'authors' | 'policies' | 'about' | null

function UtilityBar() {
  return (
    <div className="border-b border-graphite-200 bg-graphite-100 text-graphite-700">
      <div className="mx-auto flex min-h-9 max-w-site flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 text-xs sm:px-6 lg:px-8">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-display font-bold tracking-wide text-brand-800">ISSN: {journal.issnOnline}</span>
          <span aria-hidden="true" className="hidden text-graphite-300 sm:inline">|</span>
          <span className="hidden sm:inline">DOI Prefix: <a href={`https://doi.org/${journal.doiPrefix}`} target="_blank" rel="noreferrer" className="font-medium text-accent-700 hover:underline">{journal.doiPrefix}</a></span>
          {journal.badges.openAccess && (
            <span className="inline-flex items-center gap-1 rounded-full border border-cta-200 bg-cta-50 px-2 py-0.5 text-[11px] font-medium text-cta-900">
              <OpenAccess className="h-3.5 w-3.5 text-cta-700" aria-hidden="true" /> Open Access ({journal.licence.name})
            </span>
          )}
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
          <AppLink to={paths.track} className="inline-flex items-center gap-1 hover:text-brand-800 hover:underline"><TravelExplore className="h-4 w-4 text-accent-700" aria-hidden="true" /> Track Status</AppLink>
          <AppLink to={paths.verify()} className="hidden items-center gap-1 hover:text-brand-800 hover:underline sm:inline-flex"><VerifiedUser className="h-4 w-4 text-accent-700" aria-hidden="true" /> Verify Certificate</AppLink>
          <a href={`mailto:${journal.email}`} className="hidden items-center gap-1 hover:text-brand-800 hover:underline md:inline-flex"><Email className="h-4 w-4 text-accent-700" aria-hidden="true" /> {journal.email}</a>
          <span className="hidden rounded border border-brand-300 bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-800 lg:inline">{journal.publisher.replace(/\s*\(.*$/, '')}</span>
        </p>
      </div>
    </div>
  )
}

// Nav items sit on the solid emerald bar; the focus ring is white there because the global teal ring would be invisible.
const navItem = (active: boolean) => cx('relative inline-flex items-center gap-0.5 whitespace-nowrap rounded-chip px-2.5 py-2 text-[13px] font-medium transition-colors focus-visible:!outline-white', active ? 'bg-brand-900 font-semibold text-white' : 'text-brand-100 hover:bg-white/10 hover:text-white')

export function Header({ onSearch, onSuggest }: { onSearch: (q: string) => void; onSuggest: SuggestFn }) {
  const { pathname } = useRouter()
  const [menu, setMenu] = useState<MenuId>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<number>()
  const searchBtn = useRef<HTMLButtonElement>(null)
  const isActive = (to: string) => (to === paths.home ? pathname === to || pathname === `${to}/` : pathname === to || pathname.startsWith(`${to}/`))

  // Close menus on navigation, show the compact Submit button once the brand row has scrolled away, and open search with "/".
  useEffect(() => { setMenu(null); setMobileOpen(false); setSearchOpen(false) }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') setMenu(null)
    }
    const onScroll = () => setScrolled(window.scrollY > 220)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll) }
  }, [])
  const closeSearch = () => { setSearchOpen(false); searchBtn.current?.focus() }

  const open = (id: MenuId) => { window.clearTimeout(closeTimer.current); setMenu(id) }
  const leave = () => { closeTimer.current = window.setTimeout(() => setMenu(null), 140) }
  const toggle = (id: Exclude<MenuId, null>) => setMenu((m) => (m === id ? null : id))
  const plain = (l: NavLinkItem) => <AppLink key={l.to} to={l.to} aria-current={isActive(l.to) ? 'page' : undefined} className={navItem(isActive(l.to))}>{l.label}</AppLink>
  const mobileSearch = (
    <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search (press /)" className="rounded-soft p-2.5 text-graphite-700 hover:bg-graphite-100"><Search className="h-5 w-5" aria-hidden="true" /></button>
  )
  const trigger = (id: Exclude<MenuId, null>, label: string) => (
    <button type="button" aria-expanded={menu === id} aria-haspopup="true" onClick={() => toggle(id)} className={navItem(menu === id)}>
      {label} <ChevronDown className={cx('h-4 w-4 transition-transform', menu === id && 'rotate-180')} aria-hidden="true" />
    </button>
  )

  return (
    <>
      <UtilityBar />

      {/* Brand row: desktop only, scrolls away. */}
      <div className="hidden border-b border-graphite-200 bg-white xl:block">
        <div className="mx-auto flex max-w-site items-center justify-between gap-6 px-8 py-3.5">
          <div className="min-w-0 flex-1 pr-4"><BrandBlock /></div>
          <div className="flex shrink-0 items-center gap-2.5">
            <AppLink to={paths.track} className="inline-flex items-center gap-1.5 rounded-panel border border-graphite-300 bg-white px-4 py-2.5 text-xs font-semibold text-graphite-700 hover:border-brand-800 hover:bg-graphite-50 hover:text-brand-800"><TravelExplore className="h-[18px] w-[18px] text-accent-700" aria-hidden="true" /> Track Manuscript</AppLink>
            <AppLink to={paths.submit} className="inline-flex items-center gap-1.5 rounded-panel bg-accent-700 px-4 py-2.5 text-xs font-semibold text-white shadow-card hover:bg-brand-800"><CloudUpload className="h-[18px] w-[18px]" aria-hidden="true" /> Submit Paper</AppLink>
          </div>
        </div>
      </div>

      {/* Sticky bar. */}
      <div className="sticky top-0 z-50" onMouseLeave={leave} onMouseEnter={() => window.clearTimeout(closeTimer.current)}>
        {/* Phones and tablets */}
        <div className="border-b border-graphite-200 bg-white/95 backdrop-blur xl:hidden">
          <div className="mx-auto flex h-16 max-w-site items-center gap-3 px-4 sm:px-6">
            <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex min-w-0 flex-1 items-center gap-3">
              <LogoTile className="h-12 w-12" />
              <span className="min-w-0 leading-tight">
                <span className="block font-display text-base font-bold text-brand-900">{journal.shortName}</span>
                <span className="block text-[11px] font-medium leading-snug text-graphite-600">{journal.name}</span>
              </span>
            </AppLink>
            {mobileSearch}
            <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="rounded-soft p-2.5 text-graphite-700 hover:bg-graphite-100">
              {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden border-y border-brand-900 bg-brand-800 text-white xl:block">
          <div className="mx-auto flex h-11 max-w-site items-center gap-2 px-8">
            <nav aria-label="Main" className="flex items-center gap-0.5">
              {plain(homeLink)}
              {primaryLinks.map(plain)}
              <div className="relative" onMouseEnter={() => open('disciplines')}>{trigger('disciplines', 'Disciplines')}</div>
              {menus.map((m) => (
                <div key={m.id} className="relative" onMouseEnter={() => open(m.id)}>
                  {trigger(m.id, m.label)}
                  {menu === m.id && (
                    <div className={cx('absolute top-full z-50 pt-1', m.id === 'about' ? 'right-0' : 'left-0')}>
                      <div className={cx('grid gap-6 rounded-panel border border-graphite-200 bg-white p-4 text-graphite-800 shadow-pop motion-safe:animate-fade-in', m.groups.length > 1 ? 'w-[34rem] grid-cols-2' : 'w-72')}>
                        {m.groups.map((g) => (
                          <div key={g.title}>
                            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-accent-700">{g.title}</p>
                            <ul className="space-y-0.5">
                              {g.links.map((l) => (
                                <li key={l.to + l.label}><AppLink to={l.to} className="block rounded-soft px-2 py-1.5 hover:bg-brand-50">
                                  <span className="block text-sm font-medium text-graphite-800">{l.label}</span>
                                  {l.note && <span className="block text-xs text-graphite-600">{l.note}</span>}
                                </AppLink></li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {plain(editorialLink)}
              {plain(apcLink)}
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden items-center gap-1.5 font-mono text-[11px] text-brand-200 2xl:flex">Next: {journal.nextIssue.label.split(' — ')[0]} open</span>
              {scrolled && <AppLink to={paths.submit} className="inline-flex items-center gap-1.5 rounded-chip bg-white px-3 py-1.5 text-xs font-bold text-brand-800 hover:bg-brand-50 focus-visible:!outline-white"><CloudUpload className="h-4 w-4" aria-hidden="true" /> Submit Paper</AppLink>}
              <button ref={searchBtn} type="button" onClick={() => setSearchOpen(true)} aria-label="Search (press /)" className="rounded-chip p-2 text-brand-100 hover:bg-white/10 hover:text-white focus-visible:!outline-white"><Search className="h-5 w-5" aria-hidden="true" /></button>
            </div>
          </div>
        </div>

        {menu === 'disciplines' && (
          <div className="absolute inset-x-0 top-full hidden border-b border-graphite-200 bg-white text-graphite-800 shadow-pop motion-safe:animate-fade-in xl:block" onMouseEnter={() => window.clearTimeout(closeTimer.current)}>
            <div className="mx-auto grid max-w-site grid-cols-[1fr_16rem] gap-8 px-8 py-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-700">Browse research by discipline</p>
                <ul className="grid grid-cols-4 gap-3">
                  {disciplines.map((d) => (
                    <li key={d.id}>
                      <AppLink to={paths.search(d.name)} className="flex h-full items-center gap-3 rounded-panel border border-transparent p-3 hover:border-brand-200 hover:bg-brand-50">
                        <DisciplineIcon discipline={d} />
                        <span className="text-sm font-semibold leading-snug text-graphite-800">{d.name}</span>
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-panel bg-brand-50 p-5">
                <p className="font-display text-base font-semibold text-brand-900">Not sure where your paper fits?</p>
                <p className="mt-1 text-sm text-graphite-700">{journal.shortName} welcomes work that crosses disciplines. Our editors will route it to the right reviewers.</p>
                <AppLink to={paths.search('')} className="mt-3 inline-block text-sm font-semibold text-accent-700 hover:underline">Browse all articles →</AppLink>
              </div>
            </div>
          </div>
        )}
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} onSearch={onSearch} onSuggest={onSuggest} />
    </>
  )
}
