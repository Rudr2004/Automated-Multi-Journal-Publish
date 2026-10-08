// Header: a slim top bar, a brand row (logo, full journal name, Track + Submit) that scrolls away, and a sticky navigation row
// with the Disciplines mega menu and search. On phones and tablets one compact sticky bar replaces the brand and navigation rows.
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import type { SuggestFn } from '../../../core/types'
import { BrandBlock, LogoTile } from '../components/BrandBlock'
import { ButtonLink, buttonClass } from '../components/Button'
import { DisciplineIcon, disciplines } from '../components/discipline'
import { cx } from '../components/primitives'
import { ChevronDown, Close, Email, Menu, OpenAccess, Search, Submit, Track } from '../icons'
import { editorialLink, menus, primaryLinks, type NavLinkItem } from './nav'
import { MobileNav } from './MobileNav'
import { SearchOverlay } from './SearchOverlay'

type MenuId = 'disciplines' | 'authors' | 'about' | null

function TopBar() {
  return (
    <div className="bg-brand-800 text-brand-50">
      <div className="mx-auto flex h-9 max-w-site items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
        <p className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold"><OpenAccess className="h-4 w-4" aria-hidden="true" /> Open Access</span>
          <span className="hidden h-3 w-px bg-brand-300/50 sm:block" aria-hidden="true" />
          <span className="hidden sm:inline">ISSN (Online) <span className="font-semibold text-white">{journal.issnOnline}</span></span>
        </p>
        <a href={`mailto:${journal.email}`} className="inline-flex items-center gap-1.5 hover:text-white hover:underline"><Email className="h-4 w-4" aria-hidden="true" /> {journal.email}</a>
      </div>
    </div>
  )
}

const linkCls = (active: boolean) => cx('relative inline-flex items-center gap-1 whitespace-nowrap rounded-soft px-3 py-2 text-sm font-semibold transition-colors', active ? 'text-accent-700' : 'text-graphite-700 hover:bg-graphite-100 hover:text-graphite-900')

export function Header({ onSearch, onSuggest }: { onSearch: (q: string) => void; onSuggest: SuggestFn }) {
  const { pathname } = useRouter()
  const [menu, setMenu] = useState<MenuId>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<number>()
  const searchBtn = useRef<HTMLButtonElement>(null)
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`)

  // Close menus on navigation, show the compact Submit button once the brand row has scrolled away, and open search with "/".
  useEffect(() => { setMenu(null); setMobileOpen(false); setSearchOpen(false) }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') setMenu(null)
    }
    const onScroll = () => setScrolled(window.scrollY > 180)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll) }
  }, [])
  const closeSearch = () => { setSearchOpen(false); searchBtn.current?.focus() }

  const open = (id: MenuId) => { window.clearTimeout(closeTimer.current); setMenu(id) }
  const leave = () => { closeTimer.current = window.setTimeout(() => setMenu(null), 140) }
  const toggle = (id: Exclude<MenuId, null>) => setMenu((m) => (m === id ? null : id))
  const plain = (l: NavLinkItem) => <AppLink key={l.to} to={l.to} aria-current={isActive(l.to) ? 'page' : undefined} className={linkCls(isActive(l.to))}>{l.label}</AppLink>
  const searchButton = (
    <button ref={searchBtn} type="button" onClick={() => setSearchOpen(true)} aria-label="Search (press /)" className="rounded-soft p-2.5 text-graphite-700 hover:bg-graphite-100"><Search className="h-5 w-5" aria-hidden="true" /></button>
  )

  return (
    <>
      <TopBar />

      {/* Brand row: desktop only, scrolls away. */}
      <div className="hidden border-b border-graphite-200 bg-white xl:block">
        <div className="mx-auto flex max-w-site items-center justify-between gap-6 px-8 py-4">
          <div className="-ml-5 min-w-0 flex-1 pr-6"><BrandBlock /></div>
          <div className="flex shrink-0 items-center gap-2">
            <AppLink to={paths.track} className={buttonClass('outline')}><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
            <ButtonLink to={paths.submit} variant="cta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          </div>
        </div>
      </div>

      {/* Sticky bar. */}
      <div className="sticky top-0 z-50 border-b border-graphite-200 bg-white/95 backdrop-blur" onMouseLeave={leave} onMouseEnter={() => window.clearTimeout(closeTimer.current)}>
        {/* Phones and tablets */}
        <div className="mx-auto flex h-16 max-w-site items-center gap-3 px-4 sm:px-6 xl:hidden">
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex min-w-0 flex-1 items-center gap-3">
            <LogoTile className="h-12" />
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-base font-bold text-brand-900">{journal.shortName}</span>
              <span className="block truncate text-[11px] font-medium text-graphite-600">{journal.name}</span>
            </span>
          </AppLink>
          {searchButton}
          <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="rounded-soft p-2.5 text-graphite-700 hover:bg-graphite-100">
            {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Desktop */}
        <div className="mx-auto hidden h-[52px] max-w-site items-center gap-2 px-8 xl:flex">
          <nav aria-label="Main" className="flex items-center gap-0.5">
            {primaryLinks.map(plain)}
            <div className="relative" onMouseEnter={() => open('disciplines')}>
              <button type="button" aria-expanded={menu === 'disciplines'} aria-haspopup="true" onClick={() => toggle('disciplines')} className={linkCls(menu === 'disciplines')}>
                Disciplines <ChevronDown className={cx('h-4 w-4 transition-transform', menu === 'disciplines' && 'rotate-180')} aria-hidden="true" />
              </button>
            </div>
            {plain(editorialLink)}
            {menus.map((m) => (
              <div key={m.id} className="relative" onMouseEnter={() => open(m.id)}>
                <button type="button" aria-expanded={menu === m.id} aria-haspopup="true" onClick={() => toggle(m.id)} className={linkCls(menu === m.id)}>
                  {m.label} <ChevronDown className={cx('h-4 w-4 transition-transform', menu === m.id && 'rotate-180')} aria-hidden="true" />
                </button>
                {menu === m.id && (
                  <div className={cx('absolute top-full z-50 mt-1 grid gap-6 rounded-panel border border-graphite-200 bg-white p-5 shadow-pop motion-safe:animate-fade-in', m.groups.length > 1 ? 'w-[34rem] grid-cols-2' : 'w-64', m.id === 'about' ? 'right-0' : 'left-0')}>
                    {m.groups.map((g) => (
                      <div key={g.title}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-700">{g.title}</p>
                        <ul className="space-y-0.5">
                          {g.links.map((l) => (
                            <li key={l.to + l.label}><AppLink to={l.to} className="block rounded-soft px-2 py-1.5 hover:bg-accent-50">
                              <span className="block text-sm font-medium text-graphite-800">{l.label}</span>
                              {l.note && <span className="block text-xs text-graphite-600">{l.note}</span>}
                            </AppLink></li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {scrolled && <ButtonLink to={paths.submit} variant="cta" className="py-2"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>}
            {searchButton}
          </div>
        </div>

        {menu === 'disciplines' && (
          <div className="absolute inset-x-0 top-full hidden border-b border-graphite-200 bg-white shadow-pop motion-safe:animate-fade-in xl:block" onMouseEnter={() => window.clearTimeout(closeTimer.current)}>
            <div className="mx-auto grid max-w-site grid-cols-[1fr_16rem] gap-8 px-8 py-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-700">Browse research by discipline</p>
                <ul className="grid grid-cols-4 gap-3">
                  {disciplines.map((d) => (
                    <li key={d.id}>
                      <AppLink to={paths.search(d.name)} className="flex h-full items-center gap-3 rounded-panel border border-transparent p-3 hover:border-accent-200 hover:bg-accent-50">
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
