// Header: a brand row (logo, full journal name, Track My Paper and Submit) that scrolls away, then a sticky row with the navigation (Research Areas is a 3-column matrix menu).
// It turns dark slate once the page is scrolled. Search lives in the home hero; the magnifier here opens the search page.
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import { AREA_BLURB, AREA_ICONS, areas } from '../components/areas'
import { ArchiveSearch } from '../components/ArchiveSearch'
import { ButtonLink, buttonClass } from '../components/Button'
import { cx } from '../components/primitives'
import { ChevronDown, Close, Menu, Search, Submit, Track } from '../icons'
import { editorialLink, menus, primaryLinks, type NavLinkItem } from './nav'

type MenuId = 'areas' | 'authors' | 'about' | 'search' | null

/** The IJECM logo, shown whole. It has a white background, so on the dark footer it sits on a white tile. */
export function Logo({ size = 64, tile, className }: { size?: number; tile?: boolean; className?: string }) {
  return <img src="/journals/j4/logo.png" alt="" width={size} height={size} style={{ width: size, height: size }} className={cx('shrink-0 object-contain', tile && 'rounded-ctl bg-white p-1', className)} />
}

export function Header() {
  const { pathname } = useRouter()
  const [menu, setMenu] = useState<MenuId>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number>()
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`)

  useEffect(() => { setMenu(null); setMobileOpen(false) }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(null) }
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setMenu(null) }
    const onScroll = () => setScrolled(window.scrollY > 80)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); window.removeEventListener('scroll', onScroll) }
  }, [])
  // Menus open when the pointer enters a button (or on click / Enter) and close shortly after it leaves the header, on Esc, or on a click elsewhere.
  const openMenu = (id: Exclude<MenuId, null>) => { window.clearTimeout(closeTimer.current); setMenu(id) }
  const holdOpen = () => window.clearTimeout(closeTimer.current)
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setMenu((m) => (m === 'search' ? m : null)), 140) }

  const dark = scrolled
  const linkCls = (active: boolean) => cx('inline-flex items-center gap-1 whitespace-nowrap rounded-ctl px-2.5 py-2 text-sm font-medium transition-colors',
    dark ? (active ? 'bg-white/10 text-white' : 'text-abyss-200 hover:bg-white/10 hover:text-white') : (active ? 'bg-azure-50 text-cobalt-700' : 'text-abyss-800 hover:bg-abyss-100 hover:text-abyss-900'))
  const plain = (l: NavLinkItem) => <div key={l.to} onMouseEnter={() => setMenu((m) => (m === 'search' ? m : null))}><AppLink to={l.to} aria-current={isActive(l.to) ? 'page' : undefined} className={linkCls(isActive(l.to))}>{l.label}</AppLink></div>
  const chev = (open: boolean) => <ChevronDown className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />

  return (
    <>
      {/* Brand row: logo and the full journal name. It scrolls away; the navigation row below stays. */}
      <div className="border-b border-abyss-200 bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Logo size={64} className="h-12 w-12 sm:h-16 sm:w-16" />
            <span className="min-w-0">
              <span className="block font-serif4 text-[1.1875rem] font-semibold leading-tight tracking-tight text-abyss-900 sm:text-[1.625rem] lg:text-[1.5rem]">{journal.name}</span>
              <span className="mt-1 hidden text-[13px] font-medium text-steel-600 sm:block">Monthly open access journal · ISSN {journal.issnOnline}</span>
            </span>
          </AppLink>
          {/* Track and Submit live here while the page is at the top; the sticky row shows them once it is scrolled. */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 sm:flex">
            <ButtonLink to={paths.track} variant="outline" className="hidden lg:inline-flex"><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</ButtonLink>
            <ButtonLink to={paths.submit} variant="cta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          </div>
        </div>
      </div>

    <div ref={root} data-j4-header onMouseEnter={holdOpen} onMouseLeave={scheduleClose}
      className={cx('sticky top-0 z-50 border-b transition-colors duration-200 motion-reduce:transition-none', dark ? 'border-white/10 bg-abyss-900 text-white' : 'border-abyss-200 bg-white/95 text-abyss-900 backdrop-blur')}>
      <div className="mx-auto flex h-12 max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <AppLink to={paths.home} aria-label={`${journal.shortName} home`} className={cx('font-serif4 text-xl font-bold tracking-tight xl:hidden', dark ? 'text-white' : 'text-abyss-900')}>{journal.shortName}</AppLink>

        <nav aria-label="Main" className="hidden items-center xl:flex">
          {primaryLinks.map(plain)}
          <div onMouseEnter={() => openMenu('areas')}>
            <button type="button" aria-expanded={menu === 'areas'} aria-haspopup="true" onClick={() => openMenu('areas')} className={linkCls(menu === 'areas')}>Research Areas {chev(menu === 'areas')}</button>
          </div>
          {plain(editorialLink)}
          {menus.map((m) => (
            <div key={m.id} className="relative" onMouseEnter={() => openMenu(m.id)}>
              <button type="button" aria-expanded={menu === m.id} aria-haspopup="true" onClick={() => openMenu(m.id)} className={linkCls(menu === m.id)}>{m.label} {chev(menu === m.id)}</button>
              {menu === m.id && (
                <div className={cx('absolute top-full z-50 mt-1 w-72 rounded-pane border border-abyss-200 bg-white p-2 text-abyss-900 shadow-float motion-safe:animate-fade-in', m.id === 'about' ? 'right-0' : 'left-0')}>
                  <ul>{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} className="block rounded-ctl px-3 py-2 hover:bg-abyss-100"><span className="block text-sm font-semibold text-abyss-900">{l.label}</span>{l.note && <span className="block text-xs text-steel-600">{l.note}</span>}</AppLink></li>)}</ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" aria-label="Search the archive" aria-expanded={menu === 'search'} aria-controls="j4-header-search" onClick={() => setMenu((m) => (m === 'search' ? null : 'search'))}
            className={cx('rounded-ctl p-2.5', menu === 'search' ? (dark ? 'bg-white/10 text-white' : 'bg-azure-50 text-cobalt-700') : dark ? 'text-abyss-200 hover:bg-white/10 hover:text-white' : 'text-abyss-700 hover:bg-abyss-100')}>
            {menu === 'search' ? <Close className="h-5 w-5" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
          </button>
          {dark && <AppLink to={paths.track} className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-ctl px-2.5 py-2 text-sm font-medium text-abyss-200 hover:bg-white/10 hover:text-white lg:inline-flex"><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>}
          {dark && <ButtonLink to={paths.submit} variant="cta" className="hidden sm:inline-flex"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>}
          <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className={cx('rounded-ctl p-2.5 xl:hidden', dark ? 'text-white hover:bg-white/10' : 'text-abyss-800 hover:bg-abyss-100')}>
            {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Search: the same archive search as the home page, opened from the magnifier. It stays open until Esc, a click elsewhere or a page change. */}
      {menu === 'search' && (
        <div id="j4-header-search" className="absolute inset-x-0 top-full border-b border-abyss-200 bg-abyss-50 py-4 text-abyss-900 shadow-float motion-safe:animate-fade-in">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6"><ArchiveSearch autoFocus /></div>
        </div>
      )}

      {/* Research Areas: a 3-column matrix of the engineering areas. */}
      {menu === 'areas' && (
        <div className="absolute inset-x-0 top-full hidden border-b border-abyss-200 bg-white text-abyss-900 shadow-float motion-safe:animate-fade-in xl:block">
          <div className="mx-auto max-w-[1240px] px-6 py-6">
            <div className="mb-4 flex items-end justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-cobalt-700">Research areas</p>
              <AppLink to={paths.search('')} className="text-sm font-semibold text-cobalt-700 hover:underline">Browse all articles →</AppLink>
            </div>
            <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-pane border border-abyss-200 bg-abyss-200">
              {areas.map((a) => {
                const Icon = AREA_ICONS[a.id]
                return (
                  <li key={a.id} className="bg-white">
                    <AppLink to={paths.search(a.name)} className="flex h-full items-start gap-3 p-4 hover:bg-azure-50">
                      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-ctl" style={{ backgroundColor: `${a.color}18`, color: a.color }}>{Icon && <Icon className="h-5 w-5" />}</span>
                      <span className="min-w-0"><span className="block font-serif4 text-base font-semibold leading-snug text-abyss-900">{a.name}</span><span className="mt-0.5 block text-[13px] leading-snug text-steel-600">{AREA_BLURB[a.id]}</span></span>
                    </AppLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav aria-label="Mobile" className="max-h-[calc(100vh-48px)] overflow-y-auto border-t border-abyss-200 bg-white px-4 pb-6 pt-2 text-abyss-900 motion-safe:animate-slide-down sm:px-6 xl:hidden">
          {[...primaryLinks, editorialLink].map((l) => <AppLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block border-b border-abyss-100 py-3.5 font-serif4 text-lg font-semibold">{l.label}</AppLink>)}
          {[{ id: 'areas', label: 'Research Areas', links: areas.map((a) => ({ label: a.name, to: paths.search(a.name) })) }, ...menus].map((m) => (
            <details key={m.id} className="group border-b border-abyss-100">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-serif4 text-lg font-semibold">{m.label}<ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
              <ul className="pb-3">{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} onClick={() => setMobileOpen(false)} className="block rounded-ctl px-2 py-2 text-sm text-steel-700 hover:bg-abyss-100">{l.label}</AppLink></li>)}</ul>
            </details>
          ))}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <AppLink to={paths.track} onClick={() => setMobileOpen(false)} className={buttonClass('outline')}><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
            <ButtonLink to={paths.submit} variant="cta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          </div>
        </nav>
      )}
    </div>
    </>
  )
}
