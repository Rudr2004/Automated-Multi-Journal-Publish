// Header: a brand row (logo tile, full journal name, tags, outline Track My Paper and solid Submit Manuscript) that scrolls away, then a solid dark sticky navigation bar
// with dropdowns (Research Areas is a 3-column matrix menu) and a working search field with instant suggestions (DOI / Paper ID detection).
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import { AREA_BLURB, AREA_ICONS, areas } from '../components/areas'
import { ArchiveSearch } from '../components/ArchiveSearch'
import { ButtonLink, buttonClass } from '../components/Button'
import { cx, Tag } from '../components/primitives'
import { ChevronDown, Close, Menu, OpenAccess, Search, Submit, Track, Verified } from '../icons'
import { editorialLink, menus, primaryLinks, type NavLinkItem } from './nav'

type MenuId = 'areas' | 'authors' | 'about' | 'search' | null

/** The IJFRD logo, shown whole. It has a white background, so on the dark footer it sits on a white tile. */
export function Logo({ size = 64, tile, className }: { size?: number; tile?: boolean; className?: string }) {
  return <img src="/journals/j5/logo.png" alt="" width={size} height={size} style={{ width: size, height: size }} className={cx('shrink-0 object-contain', tile && 'rounded bg-white p-1', className)} />
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

  const dark = true // the navigation bar is solid wine
  const linkCls = (active: boolean) => cx('inline-flex items-center gap-1 whitespace-nowrap rounded px-2.5 py-2 text-sm font-medium transition-colors',
    dark ? (active ? 'bg-bordeaux-900/70 text-white' : 'text-wine-100 hover:bg-bordeaux-900/50 hover:text-white') : (active ? 'bg-ochre-50 text-wine-700' : 'text-obsidian-800 hover:bg-wine-50 hover:text-wine-900'))
  const plain = (l: NavLinkItem) => <div key={l.to} onMouseEnter={() => setMenu((m) => (m === 'search' ? m : null))}><AppLink to={l.to} aria-current={isActive(l.to) ? 'page' : undefined} className={linkCls(isActive(l.to))}>{l.label}</AppLink></div>
  const chev = (open: boolean) => <ChevronDown className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />

  return (
    <>
      {/* Brand row: logo tile, the full journal name and tags, then Track My Paper and Submit. It scrolls away; the navigation bar below stays. */}
      <div className="border-b-[4px] border-double border-wine-800/40 bg-[#FBF8F4]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <Logo size={64} tile className="h-14 w-14 border border-obsidian-200 sm:h-[4.5rem] sm:w-[4.5rem]" />
            <span className="min-w-0">
              <span className="block font-newsreader text-[1.1875rem] font-semibold leading-tight tracking-tight text-obsidian-900 sm:text-[1.625rem]">{journal.name}</span>
              <span className="mt-1.5 hidden flex-wrap items-center gap-x-2 gap-y-1 sm:flex">
                <span className="text-[13px] font-semibold tabular-nums text-obsidian-700">{journal.shortName} · ISSN {journal.issnOnline}</span>
                {journal.badges.peerReviewed && <Tag tone="azure" icon={<Verified className="h-3.5 w-3.5" aria-hidden="true" />}>Peer reviewed</Tag>}
                {journal.badges.openAccess && <Tag tone="azure" icon={<OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />}>Open access</Tag>}
                <Tag>{journal.frequency}</Tag>
              </span>
            </span>
          </AppLink>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <ButtonLink to={paths.track} variant="outline"><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</ButtonLink>
            <ButtonLink to={paths.submit} variant="cta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          </div>
        </div>
      </div>

    <div ref={root} data-j5-header onMouseEnter={holdOpen} onMouseLeave={scheduleClose}
      className="sticky top-0 z-50 border-b-2 border-ochre-600 bg-wine-800 text-white">
      <div className="mx-auto flex h-12 max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <AppLink to={paths.home} aria-label={`${journal.shortName} home`} className={cx('font-newsreader text-xl font-bold tracking-tight xl:hidden', dark ? 'text-white' : 'text-obsidian-900')}>{journal.shortName}</AppLink>

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
                <div className={cx('absolute top-full z-50 mt-1 w-72 rounded border border-obsidian-200 bg-white p-2 text-obsidian-900 shadow-lift motion-safe:animate-fade-in', m.id === 'about' ? 'right-0' : 'left-0')}>
                  <ul>{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} className="block rounded px-3 py-2 hover:bg-obsidian-100"><span className="block text-sm font-semibold text-obsidian-900">{l.label}</span>{l.note && <span className="block text-xs text-obsidian-600">{l.note}</span>}</AppLink></li>)}</ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden w-[19rem] xl:block 2xl:w-[22rem]"><ArchiveSearch variant="compact" placeholder="Search title, author or DOI" /></div>
          <button type="button" aria-label="Search the archive" aria-expanded={menu === 'search'} aria-controls="j5-header-search" onClick={() => setMenu((m) => (m === 'search' ? null : 'search'))}
            className={cx('rounded p-2.5 xl:hidden', menu === 'search' ? (dark ? 'bg-bordeaux-900/70 text-white' : 'bg-wine-50 text-wine-800') : dark ? 'text-wine-100 hover:bg-bordeaux-900/50 hover:text-white' : 'text-obsidian-700 hover:bg-obsidian-100')}>
            {menu === 'search' ? <Close className="h-5 w-5" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
          </button>
          {scrolled && <ButtonLink to={paths.submit} variant="onDarkCta" className="hidden sm:inline-flex" aria-label="Submit Manuscript"><Submit className="h-4 w-4" aria-hidden="true" /><span aria-hidden="true">Submit</span></ButtonLink>}
          <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className={cx('rounded p-2.5 xl:hidden', dark ? 'text-white hover:bg-white/10' : 'text-obsidian-800 hover:bg-obsidian-100')}>
            {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Search below xl: the magnifier opens the archive search. It stays open until Esc, a click elsewhere or a page change. */}
      {menu === 'search' && (
        <div id="j5-header-search" className="absolute xl:hidden inset-x-0 top-full border-b border-obsidian-200 bg-[#FBF8F4] py-4 text-obsidian-900 shadow-lift motion-safe:animate-fade-in">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6"><ArchiveSearch autoFocus /></div>
        </div>
      )}

      {/* Research Areas: a 3-column matrix of the nine fundamental-research areas. */}
      {menu === 'areas' && (
        <div className="absolute inset-x-0 top-full hidden border-b border-obsidian-200 bg-white text-obsidian-900 shadow-lift motion-safe:animate-fade-in xl:block">
          <div className="mx-auto max-w-[1240px] px-6 py-6">
            <div className="mb-4 flex items-end justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-wine-700">Research areas</p>
              <AppLink to={paths.search('')} className="text-sm font-semibold text-wine-700 hover:underline">Browse all articles →</AppLink>
            </div>
            <ul className="grid grid-cols-3 gap-px overflow-hidden rounded border border-obsidian-200 bg-obsidian-200">
              {areas.map((a) => {
                const Icon = AREA_ICONS[a.id]
                return (
                  <li key={a.id} className="bg-white">
                    <AppLink to={paths.search(a.name)} className="flex h-full items-start gap-3 p-4 hover:bg-[#FBF8F4]">
                      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded" style={{ backgroundColor: `${a.color}18`, color: a.color }}>{Icon && <Icon className="h-5 w-5" />}</span>
                      <span className="min-w-0"><span className="block font-newsreader text-base font-semibold leading-snug text-obsidian-900">{a.name}</span><span className="mt-0.5 block text-[13px] leading-snug text-obsidian-600">{AREA_BLURB[a.id]}</span></span>
                    </AppLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav aria-label="Mobile" className="max-h-[calc(100vh-48px)] overflow-y-auto border-t border-obsidian-200 bg-white px-4 pb-6 pt-2 text-obsidian-900 motion-safe:animate-slide-down sm:px-6 xl:hidden">
          {[...primaryLinks, editorialLink].map((l) => <AppLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block border-b border-obsidian-100 py-3.5 font-newsreader text-lg font-semibold">{l.label}</AppLink>)}
          {[{ id: 'areas', label: 'Research Areas', links: areas.map((a) => ({ label: a.name, to: paths.search(a.name) })) }, ...menus].map((m) => (
            <details key={m.id} className="group border-b border-obsidian-100">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-newsreader text-lg font-semibold">{m.label}<ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
              <ul className="pb-3">{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 text-sm text-obsidian-700 hover:bg-obsidian-100">{l.label}</AppLink></li>)}</ul>
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
