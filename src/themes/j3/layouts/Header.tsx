// Header: a brand row (logo, the full journal name on one line, search and Submit) that scrolls away, and a slim sticky navigation row.
// On phones and tablets one compact sticky bar replaces both. Search opens the command palette (Ctrl/Cmd + K).
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import { ButtonLink, buttonClass } from '../components/Button'
import { cx } from '../components/primitives'
import { themes } from '../components/themes'
import { ChevronDown, Close, Menu, Search, Submit, Track } from '../icons'
import { editorialLink, menus, primaryLinks, type NavLinkItem } from './nav'

type MenuId = 'collections' | 'authors' | 'about' | null

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const linkCls = (active: boolean) => cx('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 font-jakarta text-sm font-semibold transition-colors', active ? 'bg-iris-50 text-iris-700' : 'text-night-800 hover:bg-iris-50 hover:text-iris-700')

/** Short facts shown under the journal name. Each one only appears when the journal config says it is true. */
const facts = () => [
  journal.badges.peerReviewed && 'Peer-Reviewed',
  journal.badges.openAccess && 'Open Access Refereed Journal',
  'Creative Studies and Development',
  journal.frequency,
].filter(Boolean) as string[]

function Seal({ className }: { className?: string }) {
  return <img src="/journals/j3/logo.png" alt="" width={72} height={72} className={cx('shrink-0', className)} />
}

/** Desktop brand block: the round IJCSD seal, the full name on one line and a row of facts. */
function BrandBlock() {
  return (
    <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="-ml-3 flex min-w-0 items-center gap-4">
      <Seal className="h-[74px] w-[74px]" />
      <span className="min-w-0">
        <span className="block font-jakarta text-[1.25rem] font-extrabold leading-snug tracking-tight text-night-900 2xl:text-[1.375rem]">{journal.name}</span>
        <span className="mt-1.5 flex flex-nowrap items-center gap-x-3 whitespace-nowrap text-[13px] font-medium text-mauve-700">
          {facts().map((f, i) => (
            <span key={f} className="inline-flex items-center gap-3">{i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-mauve-300" />}{f}</span>
          ))}
        </span>
      </span>
    </AppLink>
  )
}

function Dropdown({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return <div className={cx('absolute top-full z-50 mt-2 w-72 rounded-block bg-white p-3 shadow-dock ring-1 ring-mauve-100 motion-safe:animate-fade-in', align === 'right' ? 'right-0' : 'left-0')}>{children}</div>
}

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
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
    const onScroll = () => setScrolled(window.scrollY > 160)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); window.removeEventListener('scroll', onScroll) }
  }, [])
  // Menus open when the pointer enters a button (or on click / Enter) and close shortly after it leaves the bar, on Esc, or on a click elsewhere.
  const openMenu = (id: Exclude<MenuId, null>) => { window.clearTimeout(closeTimer.current); setMenu(id) }
  const holdOpen = () => window.clearTimeout(closeTimer.current)
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setMenu(null), 140) }
  const plain = (l: NavLinkItem) => <div key={l.to} onMouseEnter={() => setMenu(null)}><AppLink to={l.to} aria-current={isActive(l.to) ? 'page' : undefined} className={linkCls(isActive(l.to))}>{l.label}</AppLink></div>
  /** "field" looks like a search box (desktop brand row); "compact" is a round icon button (small screens and the sticky row). */
  const searchButton = (variant: 'field' | 'compact') => variant === 'field' ? (
    <button type="button" onClick={onOpenSearch} aria-label={`Search (${isMac ? 'Command' : 'Control'} K)`}
      className="flex h-10 w-60 items-center gap-2.5 rounded-full border border-mauve-200 bg-white pl-3.5 pr-1.5 text-left transition-colors hover:border-iris-700">
      <Search className="h-[18px] w-[18px] shrink-0 text-mauve-500" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate font-inter text-[13px] text-mauve-500">Search articles, DOI…</span>
      <kbd className="flex shrink-0 items-center gap-1 rounded-full border border-mauve-200 bg-mauve-50 px-2 py-1 font-jakarta text-[10px] font-bold leading-none text-mauve-700"><span>{isMac ? '⌘' : 'Ctrl'}</span><span>K</span></kbd>
    </button>
  ) : (
    <button type="button" onClick={onOpenSearch} aria-label={`Search (${isMac ? 'Command' : 'Control'} K)`} className="flex h-11 w-11 items-center justify-center rounded-full border border-mauve-200 text-night-800 transition-colors hover:border-iris-700 hover:text-iris-700">
      <Search className="h-5 w-5" aria-hidden="true" />
    </button>
  )

  return (
    <>
      {/* Brand row: desktop only, scrolls away. */}
      <div className="hidden border-b border-mauve-100 bg-white xl:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-4">
          <BrandBlock />
          <div className="-mr-3 flex shrink-0 items-center gap-2">
            {searchButton('field')}
            <ButtonLink to={paths.submit} variant="cta" className="h-10 px-5 text-[13px]">Submit Manuscript <Submit className="h-4 w-4" aria-hidden="true" /></ButtonLink>
          </div>
        </div>
      </div>

      {/* Sticky bar. */}
      <div ref={root} data-j3-nav onMouseEnter={holdOpen} onMouseLeave={scheduleClose} className={cx('sticky top-0 z-50 border-b bg-white/95 backdrop-blur', scrolled ? 'border-mauve-100 shadow-lift3' : 'border-mauve-100')}>
        {/* Phones and tablets */}
        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center gap-3 px-4 sm:px-6 xl:hidden">
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="mr-auto flex min-w-0 items-center gap-3">
            <Seal className="h-11 w-11" />
            <span className="max-w-[11rem] font-jakarta text-[12px] font-bold leading-tight text-night-900 sm:max-w-none sm:text-sm">{journal.name}</span>
          </AppLink>
          {searchButton('compact')}
          <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="rounded-full p-2.5 text-night-800 hover:bg-iris-50">
            {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="mx-auto hidden h-[52px] max-w-[1280px] items-center gap-2 px-6 xl:flex">
          <nav aria-label="Main" className="flex items-center gap-0.5">
            {primaryLinks.map(plain)}
            <div className="relative" onMouseEnter={() => openMenu('collections')}>
              <button type="button" aria-expanded={menu === 'collections'} aria-haspopup="true" onClick={() => openMenu('collections')} className={linkCls(menu === 'collections')}>Collections <ChevronDown className={cx('h-4 w-4 transition-transform', menu === 'collections' && 'rotate-180')} aria-hidden="true" /></button>
              {menu === 'collections' && (
                <Dropdown>
                  <ul>{themes.map((t) => <li key={t.id}><AppLink to={paths.search(t.name)} className="flex items-center gap-3 rounded-tile px-3 py-2 hover:bg-iris-50"><span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: t.color }} /><span className="font-jakarta text-sm font-bold text-night-900">{t.name}</span></AppLink></li>)}</ul>
                </Dropdown>
              )}
            </div>
            {plain(editorialLink)}
            {menus.map((m) => (
              <div key={m.id} className="relative" onMouseEnter={() => openMenu(m.id)}>
                <button type="button" aria-expanded={menu === m.id} aria-haspopup="true" onClick={() => openMenu(m.id)} className={linkCls(menu === m.id)}>{m.label} <ChevronDown className={cx('h-4 w-4 transition-transform', menu === m.id && 'rotate-180')} aria-hidden="true" /></button>
                {menu === m.id && (
                  <Dropdown>
                    <ul>{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} className="block rounded-tile px-3 py-2 hover:bg-iris-50"><span className="block font-jakarta text-sm font-bold text-night-900">{l.label}</span>{l.note && <span className="block text-xs text-mauve-600">{l.note}</span>}</AppLink></li>)}</ul>
                  </Dropdown>
                )}
              </div>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {scrolled && <>
              <AppLink to={paths.track} className={cx(buttonClass('ghost'), 'py-2')}><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
              <ButtonLink to={paths.submit} variant="cta" className="px-5 py-2">Submit Manuscript <Submit className="h-4 w-4" aria-hidden="true" /></ButtonLink>
              {searchButton('compact')}
            </>}
          </div>
        </div>

        {mobileOpen && (
          <nav aria-label="Mobile" className="max-h-[calc(100vh-68px)] overflow-y-auto border-t border-mauve-100 bg-white px-4 pb-6 pt-2 motion-safe:animate-slide-down sm:px-6 xl:hidden">
            {[...primaryLinks, editorialLink].map((l) => <AppLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block border-b border-mauve-100 py-3.5 font-jakarta text-lg font-bold text-night-900">{l.label}</AppLink>)}
            {[{ id: 'collections', label: 'Collections', links: themes.map((t) => ({ label: t.name, to: paths.search(t.name) })) }, ...menus].map((m) => (
              <details key={m.id} className="group border-b border-mauve-100">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-jakarta text-lg font-bold text-night-900">{m.label}<ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <ul className="pb-3">{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} onClick={() => setMobileOpen(false)} className="block rounded-tile px-2 py-2 text-sm font-medium text-mauve-800 hover:bg-iris-50">{l.label}</AppLink></li>)}</ul>
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
