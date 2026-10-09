// Header: a white masthead (logo, serif title, italic subtitle, service facts) that scrolls away, and a sticky navy navigation bar with the keyword search at the right.
// On phones and tablets one compact sticky bar replaces both. Search opens the command palette (Ctrl/Cmd + K). Menus open on hover, click or Enter.
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import { cx } from '../components/primitives'
import { themes } from '../components/themes'
import { ChevronDown, Close, Menu, Search, Submit, Track } from '../icons'
import { editorialLink, menus, primaryLinks, type NavLinkItem } from './nav'

type MenuId = 'collections' | 'authors' | 'about' | null

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const linkCls = (active: boolean) => cx('inline-flex items-center gap-1 whitespace-nowrap border-b-2 px-3 py-3.5 font-inter text-[15px] transition-colors', active ? 'border-ember-500 bg-iris-600 font-semibold text-white' : 'border-transparent text-iris-100 hover:bg-iris-600 hover:text-white')
const actionBtn = 'inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2 font-inter text-xs font-semibold uppercase tracking-[0.06em] transition-colors'

/** Journal facts under the subtitle. Each one only appears when the journal config says it is true. */
const facts = () => [
  journal.badges.peerReviewed && 'Peer-reviewed',
  journal.badges.openAccess && 'Open access',
  journal.frequency,
  `Published by ${journal.publisher}`,
].filter(Boolean) as string[]

/** Real service facts for the masthead strip: only configured, visible values (no impact figures are invented). */
const metrics = () => journal.heroStats.filter((s) => s.show && s.value).slice(0, 4)

/** The IJCSD logo, shown whole (never cropped). */
function Logo({ className }: { className?: string }) {
  return <img src="/journals/j3/logo.png" alt="" width={72} height={72} className={cx('shrink-0 object-contain', className)} />
}

/** Desktop masthead: logo, serif title with an italic subtitle, and the facts strip. */
function Masthead() {
  const m = metrics()
  return (
    <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-8 px-10 py-4">
      <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex min-w-0 items-center gap-4">
        <Logo className="h-16 w-16" />
        <span className="min-w-0">
          <span className="block font-jakarta text-[1.375rem] font-semibold leading-tight tracking-tight text-iris-700 2xl:text-[1.5rem]">{journal.name}</span>
          <span className="mt-0.5 block font-jakarta text-base font-medium italic text-mauve-600">{journal.tagline}</span>
          <span className="mt-0.5 block font-inter text-xs text-mauve-600">{facts().join(' · ')}</span>
        </span>
      </AppLink>
      {m.length > 0 && (
        <dl className="grid shrink-0 grid-flow-col gap-2 bg-iris-50 p-2">
          {m.map((s) => (
            <div key={s.id} className="flex min-w-[7rem] flex-col px-2">
              <dt className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-mauve-600">{s.label}</dt>
              <dd className="font-jakarta text-lg font-semibold leading-snug text-iris-700">{s.value}</dd>
              {s.caption && s.id !== 'decision' && <dd className="font-inter text-xs text-mauve-600">{s.caption}</dd>}
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

function Dropdown({ children }: { children: React.ReactNode }) {
  return <div className="absolute left-0 top-full z-50 w-72 border border-mauve-100 border-t-2 border-t-ember-500 bg-white p-2 shadow-dock motion-safe:animate-fade-in">{children}</div>
}

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { pathname } = useRouter()
  const [menu, setMenu] = useState<MenuId>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number>()
  const isActive = (to: string) => (to === paths.home ? pathname === to : pathname === to || pathname.startsWith(`${to}/`))

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
  const label = `Search (${isMac ? 'Command' : 'Control'} K)`
  /** "field" looks like the reference's keyword box (desktop nav bar); "compact" is a square icon button (small screens). */
  const searchButton = (variant: 'field' | 'compact') => variant === 'field' ? (
    <button type="button" onClick={onOpenSearch} aria-label={label} className="flex h-9 w-60 items-center gap-2 bg-white pl-3 pr-2 text-left transition-colors hover:bg-iris-50 2xl:w-72">
      <span className="min-w-0 flex-1 font-inter text-sm text-mauve-600">Keyword, author, DOI…</span>
      <kbd className="flex shrink-0 items-center gap-1 border border-mauve-200 bg-mauve-50 px-1.5 py-0.5 font-inter text-[10px] font-semibold leading-none text-mauve-600"><span>{isMac ? '⌘' : 'Ctrl'}</span><span>K</span></kbd>
      <Search className="h-[18px] w-[18px] shrink-0 text-mauve-600" aria-hidden="true" />
    </button>
  ) : (
    <button type="button" onClick={onOpenSearch} aria-label={label} className="flex h-11 w-11 items-center justify-center border border-mauve-200 text-iris-700 transition-colors hover:border-iris-700 hover:bg-iris-50">
      <Search className="h-5 w-5" aria-hidden="true" />
    </button>
  )

  return (
    <>
      {/* Masthead: desktop only, scrolls away. */}
      <div className="hidden border-b border-mauve-100 bg-white xl:block"><Masthead /></div>

      {/* Sticky bar. */}
      <div ref={root} data-j3-nav onMouseEnter={holdOpen} onMouseLeave={scheduleClose} className="sticky top-0 z-50">
        {/* Phones and tablets */}
        <div className="flex h-[68px] items-center gap-3 border-b border-mauve-100 bg-white px-4 sm:px-6 xl:hidden">
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="mr-auto flex min-w-0 items-center gap-3">
            <Logo className="h-11 w-11" />
            <span className="max-w-[11rem] font-jakarta text-[13px] font-semibold leading-tight text-iris-700 sm:max-w-none sm:text-sm">{journal.name}</span>
          </AppLink>
          {searchButton('compact')}
          <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="flex h-11 w-11 items-center justify-center border border-mauve-200 text-iris-700 hover:bg-iris-50">
            {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden bg-iris-700 xl:block">
          <div className="mx-auto flex max-w-[1360px] items-center gap-2 px-10">
            <nav aria-label="Main" className="flex items-center">
              {primaryLinks.map(plain)}
              <div className="relative" onMouseEnter={() => openMenu('collections')}>
                <button type="button" aria-expanded={menu === 'collections'} aria-haspopup="true" onClick={() => openMenu('collections')} className={linkCls(menu === 'collections')}>Collections <ChevronDown className={cx('h-4 w-4 transition-transform', menu === 'collections' && 'rotate-180')} aria-hidden="true" /></button>
                {menu === 'collections' && (
                  <Dropdown>
                    <ul>{themes.map((t) => <li key={t.id}><AppLink to={paths.search(t.name)} className="flex items-center gap-3 px-3 py-2 hover:bg-iris-50"><span aria-hidden="true" className="h-3 w-3 shrink-0" style={{ backgroundColor: t.color }} /><span className="font-inter text-sm font-semibold text-iris-700">{t.name}</span></AppLink></li>)}</ul>
                  </Dropdown>
                )}
              </div>
              {plain(editorialLink)}
              {menus.map((m) => (
                <div key={m.id} className="relative" onMouseEnter={() => openMenu(m.id)}>
                  <button type="button" aria-expanded={menu === m.id} aria-haspopup="true" onClick={() => openMenu(m.id)} className={linkCls(menu === m.id)}>{m.label} <ChevronDown className={cx('h-4 w-4 transition-transform', menu === m.id && 'rotate-180')} aria-hidden="true" /></button>
                  {menu === m.id && (
                    <Dropdown>
                      <ul>{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} className="block px-3 py-2 hover:bg-iris-50"><span className="block font-inter text-sm font-semibold text-iris-700">{l.label}</span>{l.note && <span className="block font-inter text-xs text-mauve-600">{l.note}</span>}</AppLink></li>)}</ul>
                    </Dropdown>
                  )}
                </div>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2" onMouseEnter={() => setMenu(null)}>
              {scrolled && (
                <>
                  <AppLink to={paths.track} className={cx(actionBtn, 'text-iris-100 hover:bg-iris-600 hover:text-white')}><Track className="h-4 w-4" aria-hidden="true" /> Track</AppLink>
                  <AppLink to={paths.submit} className={cx(actionBtn, 'bg-ember-500 text-night-900 hover:bg-ember-400')}>Submit <Submit className="h-4 w-4" aria-hidden="true" /></AppLink>
                </>
              )}
              {searchButton('field')}
            </div>
          </div>
        </div>

        {mobileOpen && (
          <nav aria-label="Mobile" className="max-h-[calc(100vh-68px)] overflow-y-auto border-b border-mauve-100 bg-white px-4 pb-6 pt-2 motion-safe:animate-slide-down sm:px-6 xl:hidden">
            {[...primaryLinks, editorialLink].map((l) => <AppLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block border-b border-mauve-100 py-3.5 font-jakarta text-lg font-semibold text-iris-700">{l.label}</AppLink>)}
            {[{ id: 'collections', label: 'Collections', links: themes.map((t) => ({ label: t.name, to: paths.search(t.name) })) }, ...menus].map((m) => (
              <details key={m.id} className="group border-b border-mauve-100">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-jakarta text-lg font-semibold text-iris-700">{m.label}<ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <ul className="pb-3">{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} onClick={() => setMobileOpen(false)} className="block px-2 py-2 font-inter text-sm text-mauve-700 hover:bg-iris-50">{l.label}</AppLink></li>)}</ul>
              </details>
            ))}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <AppLink to={paths.track} onClick={() => setMobileOpen(false)} className={cx(actionBtn, 'border border-iris-700 py-3 text-iris-700 hover:bg-iris-50')}><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
              <AppLink to={paths.submit} onClick={() => setMobileOpen(false)} className={cx(actionBtn, 'bg-iris-700 py-3 text-white hover:bg-iris-600')}><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</AppLink>
            </div>
          </nav>
        )}
      </div>
    </>
  )
}
