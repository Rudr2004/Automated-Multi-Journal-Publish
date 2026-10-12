// Header after the Academic Editorial & Press reference: a purple masthead (logo, title, identifiers, Submit) that scrolls away, a sticky white navigation bar with a purple underline
// on the active item, and a Mist 'Latest dispatch' line fed by the journal announcements. Phones and tablets get one compact sticky bar. Menus open on hover, click or Enter.
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import { cx, onDark } from '../components/primitives'
import { themes } from '../components/themes'
import { ChevronDown, Close, Menu, Search, Submit, Track } from '../icons'
import { editorialLink, menus, primaryLinks, type NavLinkItem } from './nav'

type MenuId = 'collections' | 'authors' | 'about' | null

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const linkCls = (active: boolean) => cx('inline-flex items-center gap-1 whitespace-nowrap border-b-2 px-4 py-4 font-jakarta text-[15px] transition-colors', active ? 'border-iris-700 bg-j3paper-cool font-semibold text-iris-700' : 'border-transparent font-medium text-night-700 hover:bg-j3paper-cool hover:text-iris-700')
const actionBtn = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-tile px-4 py-2 font-jakarta text-xs font-bold uppercase tracking-[0.06em] transition-colors'

/** Journal facts under the title. Each one only appears when the journal config says it is true. */
const facts = () => [journal.badges.peerReviewed && 'Peer-reviewed', journal.badges.openAccess && 'Open access', journal.frequency, 'Multidisciplinary creative studies'].filter(Boolean) as string[]

/** The IJCSD logo, shown whole (never cropped). */
function Logo({ className }: { className?: string }) {
  return <img src="/journals/j3/logo.png" alt="" width={72} height={72} className={cx('shrink-0 object-contain', className)} />
}

/** Desktop masthead: logo on white, large title, facts line, ISSN chip and the Submit call to action. */
function Masthead() {
  return (
    <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-8 px-10 py-6">
      <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex min-w-0 items-center gap-5">
        <span className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-tile bg-white p-1.5"><Logo className="h-full w-full" /></span>
        <span className="min-w-0">
          <span className="block whitespace-nowrap font-jakarta text-[1.375rem] font-bold leading-[1.15] tracking-[-0.01em] text-white xl:text-[1.6rem] 2xl:text-[1.75rem]">{journal.name}</span>
          <span className="mt-2 block font-jakarta text-xs font-semibold uppercase tracking-[0.08em] text-iris-100">{facts().join('  •  ')}</span>
        </span>
      </AppLink>
      <div className="flex shrink-0 flex-col items-end gap-3">
        <div className="flex items-center gap-3">
          <p className="rounded-tile border border-white/35 px-3 py-2 font-inter text-xs font-semibold tabular-nums text-white">E-ISSN: {journal.issnOnline}</p>
          <AppLink to={paths.submit} className="inline-flex items-center gap-2 rounded-tile bg-ember-500 px-5 py-2.5 font-jakarta text-sm font-bold text-night-900 transition-colors hover:bg-ember-400"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</AppLink>
        </div>
        <AppLink to={paths.forAuthors('become-a-reviewer')} className="font-inter text-xs font-medium text-white underline underline-offset-4 hover:text-iris-100">Join as a reviewer</AppLink>
      </div>
    </div>
  )
}

/** The 'Latest dispatch' line under the navigation: the journal announcements, separated by bullets. */
function Dispatch() {
  const items = journal.announcements
  if (!items.length) return null
  return (
    <div className="border-b border-j3paper-rule bg-j3paper-cool">
      <p className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 font-inter text-[13px] text-night-700 sm:px-6 lg:px-10">
        <span className="inline-flex items-center gap-2 font-jakarta text-xs font-bold uppercase tracking-[0.08em] text-iris-700"><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />Latest dispatch:</span>
        {items.map((a, i) => (
          <span key={a.id} className="inline-flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="text-mauve-500">&bull;</span>}
            <AppLink to={a.to} className="hover:text-iris-700 hover:underline">{a.text}</AppLink>
          </span>
        ))}
      </p>
    </div>
  )
}

function Dropdown({ children }: { children: React.ReactNode }) {
  return <div className="absolute left-0 top-full z-50 w-72 border border-j3paper-rule border-t-2 border-t-iris-700 bg-white p-2 motion-safe:animate-fade-in">{children}</div>
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
    <button type="button" onClick={onOpenSearch} aria-label={label} className="flex h-10 w-60 items-center gap-2 rounded-tile border border-j3paper-rule bg-white pl-3 pr-2 text-left transition-colors hover:border-iris-700 hover:bg-j3paper-cool 2xl:w-72">
      <span className="min-w-0 flex-1 truncate whitespace-nowrap font-inter text-sm text-mauve-600">Keyword, author, DOI…</span>
      <kbd className="flex shrink-0 items-center gap-1 rounded-tile border border-j3paper-rule bg-j3paper-cool px-1.5 py-0.5 font-inter text-[10px] font-semibold leading-none text-mauve-600"><span>{isMac ? '⌘' : 'Ctrl'}</span><span>K</span></kbd>
      <Search className="h-[18px] w-[18px] shrink-0 text-mauve-600" aria-hidden="true" />
    </button>
  ) : (
    <button type="button" onClick={onOpenSearch} aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-tile border border-j3paper-rule text-iris-700 transition-colors hover:border-iris-700 hover:bg-j3paper-cool">
      <Search className="h-5 w-5" aria-hidden="true" />
    </button>
  )

  return (
    <>
      {/* Masthead: desktop only, scrolls away. */}
      <div className={`hidden bg-iris-700 xl:block ${onDark}`}><Masthead /></div>

      {/* Sticky bar. */}
      <div ref={root} data-j3-nav onMouseEnter={holdOpen} onMouseLeave={scheduleClose} className="sticky top-0 z-50">
        {/* Phones and tablets */}
        <div className="flex h-[68px] items-center gap-3 border-b border-j3paper-rule bg-white px-4 sm:px-6 xl:hidden">
          <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="mr-auto flex min-w-0 items-center gap-3">
            <Logo className="h-11 w-11" />
            <span className="max-w-[11rem] font-jakarta text-[13px] font-semibold leading-tight text-iris-700 sm:max-w-none sm:text-sm">{journal.name}</span>
          </AppLink>
          {searchButton('compact')}
          <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="flex h-11 w-11 items-center justify-center rounded-tile border border-j3paper-rule text-iris-700 hover:bg-j3paper-cool">
            {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden border-b border-j3paper-rule bg-white xl:block">
          <div className="mx-auto flex max-w-[1360px] items-center gap-2 px-10">
            <nav aria-label="Main" className="flex items-center">
              {primaryLinks.map(plain)}
              <div className="relative" onMouseEnter={() => openMenu('collections')}>
                <button type="button" aria-expanded={menu === 'collections'} aria-haspopup="true" onClick={() => openMenu('collections')} className={linkCls(menu === 'collections')}>Collections <ChevronDown className={cx('h-4 w-4 transition-transform', menu === 'collections' && 'rotate-180')} aria-hidden="true" /></button>
                {menu === 'collections' && (
                  <Dropdown>
                    <ul>{themes.map((t) => <li key={t.id}><AppLink to={paths.search(t.name)} className="flex items-center gap-3 px-3 py-2 hover:bg-j3paper-cool"><span aria-hidden="true" className="h-3 w-3 shrink-0" style={{ backgroundColor: t.color }} /><span className="font-inter text-sm font-semibold text-iris-700">{t.name}</span></AppLink></li>)}</ul>
                  </Dropdown>
                )}
              </div>
              {plain(editorialLink)}
              {menus.map((m) => (
                <div key={m.id} className="relative" onMouseEnter={() => openMenu(m.id)}>
                  <button type="button" aria-expanded={menu === m.id} aria-haspopup="true" onClick={() => openMenu(m.id)} className={linkCls(menu === m.id)}>{m.label} <ChevronDown className={cx('h-4 w-4 transition-transform', menu === m.id && 'rotate-180')} aria-hidden="true" /></button>
                  {menu === m.id && (
                    <Dropdown>
                      <ul>{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} className="block px-3 py-2 hover:bg-j3paper-cool"><span className="block font-inter text-sm font-semibold text-iris-700">{l.label}</span>{l.note && <span className="block font-inter text-xs text-mauve-600">{l.note}</span>}</AppLink></li>)}</ul>
                    </Dropdown>
                  )}
                </div>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2" onMouseEnter={() => setMenu(null)}>
              {scrolled && (
                <>
                  <AppLink to={paths.track} className={cx(actionBtn, 'text-iris-700 hover:bg-j3paper-cool')}><Track className="h-4 w-4" aria-hidden="true" /> Track</AppLink>
                  <AppLink to={paths.submit} className={cx(actionBtn, 'bg-ember-500 text-night-900 hover:bg-ember-400')}>Submit <Submit className="h-4 w-4" aria-hidden="true" /></AppLink>
                </>
              )}
              {searchButton('field')}
            </div>
          </div>
        </div>

        {mobileOpen && (
          <nav aria-label="Mobile" className="max-h-[calc(100vh-68px)] overflow-y-auto border-b border-j3paper-rule bg-white px-4 pb-6 pt-2 motion-safe:animate-slide-down sm:px-6 xl:hidden">
            {[...primaryLinks, editorialLink].map((l) => <AppLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block border-b border-j3paper-rule py-3.5 font-jakarta text-lg font-semibold text-night-900">{l.label}</AppLink>)}
            {[{ id: 'collections', label: 'Collections', links: themes.map((t) => ({ label: t.name, to: paths.search(t.name) })) }, ...menus].map((m) => (
              <details key={m.id} className="group border-b border-j3paper-rule">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-jakarta text-lg font-semibold text-iris-700">{m.label}<ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <ul className="pb-3">{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} onClick={() => setMobileOpen(false)} className="block px-2 py-2 font-inter text-sm text-mauve-700 hover:bg-j3paper-cool">{l.label}</AppLink></li>)}</ul>
              </details>
            ))}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <AppLink to={paths.track} onClick={() => setMobileOpen(false)} className={cx(actionBtn, 'border border-j3paper-rule py-3 text-iris-700 hover:border-iris-700 hover:bg-j3paper-cool')}><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
              <AppLink to={paths.submit} onClick={() => setMobileOpen(false)} className={cx(actionBtn, 'bg-iris-700 py-3 text-white hover:bg-iris-800')}><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</AppLink>
            </div>
          </nav>
        )}
      </div>
      <Dispatch />
    </>
  )
}
