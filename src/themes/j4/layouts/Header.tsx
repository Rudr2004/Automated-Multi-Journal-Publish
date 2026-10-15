// Header, as in the reference: a white masthead (logo, IJECM, ISSN and tags, full journal name, descriptor; Submit Manuscript Online with Search Archive and Track My Paper below it)
// that scrolls away, then a white sticky navigation bar (2px sky active underline, For Authors and Policies dropdowns that open on hover, focus or click) with a working search field
// (instant suggestions, DOI / Paper ID detection) at its right edge, then the "Indexed in" strip.
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import { ArchiveSearch } from '../components/ArchiveSearch'
import { ButtonLink, buttonClass } from '../components/Button'
import { cx } from '../components/primitives'
import { ManageSearch, Verified as VerifiedRef } from '../components/refIconsJ4'
import { ChevronDown, Close, Menu, Search, Submit, Track } from '../icons'
import type { NavItem } from '../../../config/navigation'
import { j4Nav } from './nav'
import { IndexedStrip } from './IndexedStrip'

type MenuId = string | null

/** The IJECM logo, shown whole. It has a white background, so on the dark footer it sits on a white tile. */
export function Logo({ size = 64, tile, className }: { size?: number; tile?: boolean; className?: string }) {
  return <img src="/journals/j4/logo.png" alt="" width={size} height={size} style={{ width: size, height: size }} className={cx('shrink-0 object-contain', tile && 'rounded bg-white p-1', className)} />
}

const DROP = 'absolute left-0 top-full z-40 mt-0 w-52 rounded-md border border-slate-200 bg-white py-1 font-normal text-slate-700 shadow-[0_10px_15px_-3px_rgba(15,23,42,0.1),0_4px_6px_-4px_rgba(15,23,42,0.1)] motion-safe:animate-fade-in'

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
    const onScroll = () => setScrolled(window.scrollY > 200)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); window.removeEventListener('scroll', onScroll) }
  }, [])
  // Menus open when the pointer enters a button (or on click / Enter) and close shortly after it leaves the header, on Esc, or on a click elsewhere.
  const openMenu = (id: string) => { window.clearTimeout(closeTimer.current); setMenu(id) }
  const holdOpen = () => window.clearTimeout(closeTimer.current)
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setMenu((m) => (m === 'search' ? m : null)), 140) }

  const linkCls = (active: boolean) => cx('relative inline-flex items-center gap-1 whitespace-nowrap border-b-2 px-2 py-3 text-[13px] font-medium transition-colors',
    active ? 'border-azure-600 font-semibold text-cobalt-700' : 'border-transparent text-slate-700 hover:text-cobalt-700')
  const itemActive = (it: NavItem) => (it.match ? it.match(pathname) : isActive(it.to))
  const plain = (it: NavItem) => <div key={it.label} onMouseEnter={() => setMenu((m) => (m === 'search' ? m : null))}><AppLink to={it.to} aria-current={itemActive(it) ? 'page' : undefined} className={linkCls(itemActive(it))}>{it.label}</AppLink></div>
  const chev = (open: boolean) => <ChevronDown className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />

  return (
    <>
      {/* Masthead: it scrolls away; the navigation bar stays. */}
      <div className="w-full border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-3">
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="group flex min-w-0 items-center gap-3 sm:gap-4">
            <Logo size={80} className="h-14 w-14 rounded sm:h-16 sm:w-16 md:h-20 md:w-20" />
            <span className="min-w-0">
              <span className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-serif4 text-2xl font-bold leading-none tracking-tight text-[#0b2545] sm:text-3xl">{journal.shortName}</span>
                <span className="hidden items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tabular-nums text-amber-900 sm:inline-flex"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500" />ISSN: {journal.issnOnline} (Online)</span>
                {journal.sjifImpactFactor && <span className="hidden items-center gap-1 rounded border border-orange-300 bg-orange-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-orange-900 sm:inline-flex">SJIF Impact Factor: {journal.sjifImpactFactor}</span>}
                {(journal.badges.peerReviewed || journal.badges.openAccess) && (
                  <span className="hidden items-center gap-1 rounded border border-sky-200 bg-sky-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-cobalt-700 md:inline-flex"><VerifiedRef className="h-3.5 w-3.5" aria-hidden="true" />{[journal.badges.peerReviewed && 'Peer-Reviewed', journal.badges.openAccess && 'Open Access'].filter(Boolean).join(' ')}</span>
                )}
              </span>
              <span className="mt-0.5 block font-serif4 text-base font-bold leading-tight tracking-tight text-slate-900 sm:text-lg md:text-xl min-[1360px]:whitespace-nowrap lg:text-2xl">{journal.name}</span>
              <span className="mt-0.5 hidden text-[11px] tracking-wide text-slate-500 sm:block">{journal.descriptor.replace(/ · /g, ' • ')} • {journal.publisherCity}</span>
            </span>
          </AppLink>
          <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
            <ButtonLink to={paths.submit} variant="cta" className="rounded-[6px] !border-orange-700 !bg-orange-600 px-5 py-2.5 text-xs font-bold !text-white hover:!bg-orange-700 sm:text-sm"><Submit className="h-5 w-5" aria-hidden="true" /> Submit Manuscript Online</ButtonLink>
            <div className="flex items-center justify-end gap-2">
              <button type="button" aria-label="Journal Xplore Search" aria-expanded={menu === 'search'} aria-controls="j4-header-search" onClick={() => setMenu((m) => (m === 'search' ? null : 'search'))}
                className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-[#0b2545] transition-colors hover:bg-slate-200"><ManageSearch className="h-4 w-4 text-azure-600" aria-hidden="true" />Journal Xplore Search</button>
              <AppLink to={paths.track} className="inline-flex items-center gap-1.5 rounded border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-cobalt-700 transition-colors hover:bg-sky-100"><Track className="h-4 w-4" aria-hidden="true" />Track My Paper</AppLink>
            </div>
          </div>
        </div>
      </div>

      <div ref={root} data-j4-header onMouseEnter={holdOpen} onMouseLeave={scheduleClose} className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white text-slate-700">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4">
          <AppLink to={paths.home} aria-label={`${journal.shortName} home`} className="py-3 font-serif4 text-xl font-bold tracking-tight text-[#0b2545] min-[1360px]:hidden">{journal.shortName}</AppLink>

          <nav aria-label="Main" className="hidden min-w-0 flex-1 flex-wrap items-center justify-between min-[1360px]:flex">
            {j4Nav.map((it, i) => it.children ? (
              <div key={it.label} className="relative" onMouseEnter={() => openMenu(it.label)}>
                <button type="button" aria-expanded={menu === it.label} aria-haspopup="true" onClick={() => openMenu(it.label)} className={linkCls(menu === it.label || itemActive(it))}>{it.label} {chev(menu === it.label)}</button>
                {menu === it.label && (
                  <div className={cx(DROP, 'w-72', i > 6 && 'left-auto right-0')}>
                    <ul>{it.children.map((l) => <li key={l.label}><AppLink to={l.to} className="block px-4 py-2 text-sm leading-snug hover:bg-slate-50 hover:text-cobalt-700">{l.label}</AppLink></li>)}</ul>
                  </div>
                )}
              </div>
            ) : plain(it))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button type="button" aria-label="Search the archive" aria-expanded={menu === 'search'} aria-controls="j4-header-search" onClick={() => setMenu((m) => (m === 'search' ? null : 'search'))}
              className={cx('rounded p-2.5 2min-[1360px]:hidden', menu === 'search' ? 'bg-sky-50 text-cobalt-700' : 'text-slate-700 hover:bg-slate-100')}>
              {menu === 'search' ? <Close className="h-5 w-5" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
            </button>
            {scrolled && <ButtonLink to={paths.submit} variant="cta" className="hidden !py-1.5 sm:inline-flex min-[1360px]:!hidden" aria-label="Submit Manuscript"><Submit className="h-4 w-4" aria-hidden="true" /><span aria-hidden="true">Submit</span></ButtonLink>}
            <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="rounded p-2.5 text-slate-800 hover:bg-slate-100 min-[1360px]:hidden">
              {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Search panel: the magnifier (or Search Archive in the masthead) opens the archive search. It stays open until Esc, a click elsewhere or a page change. */}
        {menu === 'search' && (
          <div id="j4-header-search" className="absolute inset-x-0 top-full border-b border-slate-200 bg-slate-50 py-4 text-slate-900 shadow-float motion-safe:animate-fade-in 2min-[1360px]:hidden">
            <div className="mx-auto max-w-7xl px-4"><ArchiveSearch autoFocus /></div>
          </div>
        )}

        {mobileOpen && (
          <nav aria-label="Mobile" className="max-h-[calc(100vh-48px)] overflow-y-auto border-t border-slate-200 bg-white px-4 pb-6 pt-2 text-slate-900 motion-safe:animate-slide-down min-[1360px]:hidden">
            {j4Nav.map((it) => it.children ? (
              <details key={it.label} className="group border-b border-slate-100">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-serif4 text-lg font-semibold">{it.label}<ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <ul className="pb-3">{it.children.map((l) => <li key={l.label}><AppLink to={l.to} onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 text-sm text-slate-700 hover:bg-slate-100">{l.label}</AppLink></li>)}</ul>
              </details>
            ) : <AppLink key={it.label} to={it.to} onClick={() => setMobileOpen(false)} className="block border-b border-slate-100 py-3.5 font-serif4 text-lg font-semibold">{it.label}</AppLink>)}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <AppLink to={paths.track} onClick={() => setMobileOpen(false)} className={buttonClass('outline')}><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
              <ButtonLink to={paths.submit} variant="cta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
            </div>
          </nav>
        )}
      </div>
      <IndexedStrip />
    </>
  )
}
