// Header, as in the reference: a parchment masthead (logo, scholarly badges, journal name, tagline and three action buttons), a dark Journal Xplore band
// (search with DOI / Paper-ID detection) and a sticky white navigation bar with uppercase links and hover / click dropdowns.
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import { areas } from '../components/areas'
import { ArchiveSearch } from '../components/ArchiveSearch'
import { Badge, ExpandMore, PublicIcon } from '../components/homeIconsJ5'
import { cx } from '../components/primitives'
import { Book, Close, Menu, Submit, Track } from '../icons'
import { apcLink, contactLink, editorialLink, menus, policiesMenu, reviewerMenu, type NavDropdown, type NavLinkItem } from './nav'

/** The IJFRD logo, shown whole. It has a white background, so on the dark footer it sits on a white tile. */
export function Logo({ size = 64, tile, className }: { size?: number; tile?: boolean; className?: string }) {
  return <img src="/journals/j5/logo.png" alt="" width={size} height={size} style={{ width: size, height: size }} className={cx('shrink-0 object-contain', tile && 'rounded bg-white p-1', className)} />
}

const shell = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
const chip = 'rounded border px-2 py-0.5 font-work text-[11px] uppercase tracking-wider'
const dot = <span aria-hidden="true" className="text-[#dcc0be]">•</span>

export function Header() {
  const { pathname } = useRouter()
  const [menu, setMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number>()
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`)

  useEffect(() => { setMenu(null); setMobileOpen(false) }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(null) }
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setMenu(null) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown) }
  }, [])
  // Dropdowns open when the pointer enters a button (or on click / Enter) and close shortly after it leaves the bar, on Esc, or on a click elsewhere.
  const openMenu = (id: string) => { window.clearTimeout(closeTimer.current); setMenu(id) }
  const holdOpen = () => window.clearTimeout(closeTimer.current)
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setMenu(null), 140) }

  const link = 'flex items-center gap-1 whitespace-nowrap px-3 py-3.5 font-work text-xs font-medium uppercase leading-4 tracking-wider transition-colors'
  const idle = 'text-[#564241] hover:bg-[#f4f5fc] hover:text-wine-800'
  const on = 'border-b-2 border-[#9b4500] bg-[#9b4500]/10 font-bold text-[#9b4500]'
  const plain = (l: NavLinkItem, active: boolean, marker?: string) => (
    <div key={l.to} onMouseEnter={() => setMenu(null)}>
      <AppLink to={l.to} aria-current={active ? 'page' : undefined} className={cx(link, active ? on : idle)}>{marker && <span aria-hidden="true" className={cx('h-1.5 w-1.5 rounded-full', marker)} />}{l.label}</AppLink>
    </div>
  )
  const dropdown = (m: NavDropdown, wide?: boolean) => {
    const open = menu === m.id
    return (
      <div key={m.id} className="relative" onMouseEnter={() => openMenu(m.id)}>
        <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => (open ? setMenu(null) : openMenu(m.id))} className={cx(link, 'cursor-pointer', idle, open && 'text-wine-800')}>
          {m.label}<ExpandMore className={cx('h-3.5 w-3.5 text-[#897270] transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
        </button>
        {open && (
          <ul className={cx('absolute left-0 top-full z-50 max-h-[460px] overflow-y-auto rounded border border-[#dcc0be] bg-white py-1.5 shadow-lg motion-safe:animate-fade-in', wide ? 'w-80' : 'w-64')}>
            {m.links.map((l) => (
              <li key={l.to + l.label}><AppLink to={l.to} className="block px-4 py-2 font-work text-xs text-[#141b2b] transition-colors hover:bg-[#f4f5fc] hover:text-wine-800">{l.label}</AppLink></li>
            ))}
          </ul>
        )}
      </div>
    )
  }
  const authors = menus.find((m) => m.id === 'authors')!
  const about = menus.find((m) => m.id === 'about')!
  const areaMenu: NavDropdown = { id: 'areas', label: 'Research Areas', links: areas.map((a) => ({ label: a.name, to: paths.search(a.name) })) }
  const mobileGroups: NavDropdown[] = [areaMenu, authors, policiesMenu, reviewerMenu, about]
  const flat: NavLinkItem[] = [{ label: 'Home', to: paths.home }, { label: 'Current Issue', to: paths.currentIssue }, { label: 'Archives', to: paths.pastIssues }, apcLink, editorialLink, contactLink]
  const mobileLink = 'block border-b border-obsidian-100 py-3.5 font-work text-sm font-semibold uppercase tracking-wider text-[#141b2b]'

  return (
    <>
      {/* Masthead and Journal Xplore band: they scroll away; the navigation bar below stays. */}
      <div className="w-full border-b border-obsidian-200 bg-[#fdfbf7] shadow-sm">
        <div className={cx(shell, 'py-5')}>
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="flex flex-1 flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
              <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="group shrink-0">
                <img src="/journals/j5/logo.png" alt="" width={96} height={96} className="h-auto w-20 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none sm:w-24" />
              </AppLink>
              <div className="flex min-w-0 max-w-3xl flex-col space-y-1.5 lg:max-w-none">
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                  <span className={cx(chip, 'border-[#dcc0be] bg-white font-medium text-wine-800')}>ISSN: {journal.issnOnline}</span>{dot}{journal.sjifImpactFactor && <><span className={cx(chip, 'border-[#dcc0be] bg-white font-medium text-wine-800')}>SJIF Impact Factor: {journal.sjifImpactFactor}</span>{dot}</>}
                  <span className={cx(chip, 'border-[#dcc0be] bg-white font-medium text-[#9b4500]')}>Crossref DOI: {journal.doiPrefix}</span>{dot}
                  <span className={cx(chip, 'border-[#dcc0be] bg-white text-[#564241]')}>{journal.frequency}</span>
                  {journal.badges.peerReviewed && <>{dot}<span className={cx(chip, 'border-wine-800/20 bg-wine-800/10 font-medium text-wine-800')}>Peer reviewed</span></>}
                  {journal.badges.openAccess && <>{dot}<span className={cx(chip, 'border-amber-300 bg-amber-50 font-semibold text-amber-900')}>Open access</span></>}
                </div>
                <p className="font-newsreader text-2xl font-bold leading-tight tracking-tight text-wine-800 sm:text-3xl lg:whitespace-nowrap lg:text-[1.05rem] min-[1100px]:text-[1.2rem] xl:text-[1.5rem] 2xl:text-[1.6rem]">
                  International Journal of Fundamental Research and Development <span className="text-[#9b4500]">({journal.shortName})</span>
                </p>
                <p className="font-serif4 text-sm italic leading-snug text-[#564241]">A peer-reviewed open access international journal dedicated to fundamental research and the development that follows from it</p>
              </div>
            </div>
            <div className="flex w-full shrink-0 flex-row items-stretch justify-center gap-2.5 lg:w-56 lg:flex-col">
              <AppLink to={paths.track} className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-wine-800 bg-white px-3 py-2 font-work text-xs uppercase tracking-wider text-wine-800 shadow-sm transition hover:bg-[#f4f5fc] hover:shadow lg:flex-initial"><Track className="h-4 w-4" aria-hidden="true" /><span>Track Paper</span></AppLink>
              <AppLink to={paths.submit} className="inline-flex flex-1 items-center justify-center gap-2 rounded bg-wine-800 px-4 py-2.5 font-work text-xs font-semibold uppercase tracking-wider text-white shadow transition hover:bg-bordeaux-900 hover:shadow-md lg:flex-initial"><Submit className="h-4 w-4" aria-hidden="true" /><span>Submit Research Paper</span></AppLink>
              <AppLink to={paths.forAuthors('become-a-reviewer')} className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-[#dcc0be] bg-[#e1e8fd] px-3 py-2 font-work text-xs uppercase tracking-wider text-[#141b2b] shadow-sm transition hover:bg-[#e9edff] lg:flex-initial"><Badge className="h-4 w-4" aria-hidden="true" /><span>Become a Reviewer</span></AppLink>
            </div>
          </div>
        </div>

        {/* Journal Xplore band */}
        <div className="relative z-30 bg-[#581016] text-white shadow-md">
          <div className={cx(shell, 'flex items-center justify-between gap-4 py-2')}>
            <AppLink to={paths.search('')} className="hidden shrink-0 items-center gap-1.5 rounded bg-[#f5a81c] px-3.5 py-1.5 font-work text-xs font-extrabold uppercase tracking-[0.05em] text-[#4a0e12] shadow-sm hover:bg-[#fbbf24] md:flex"><PublicIcon className="h-4 w-4" aria-hidden="true" />Journal Xplore</AppLink>
            <div className="mx-2 w-full max-w-2xl flex-1"><ArchiveSearch variant="xplore" placeholder="Search articles, DOI, author, keywords across Xplore..." /></div>
            <AppLink to={paths.forAuthors('submission-process')} className="hidden shrink-0 items-center gap-1.5 rounded bg-[#f5a81c] px-3 py-1.5 font-work text-xs font-bold uppercase tracking-wider text-[#4a0e12] shadow transition hover:bg-[#fbbf24] lg:flex"><Book className="h-4 w-4" aria-hidden="true" />Knowledge Hub</AppLink>
          </div>
        </div>
      </div>

      {/* Navigation bar: sticky. */}
      <div ref={root} data-j5-header onMouseEnter={holdOpen} onMouseLeave={scheduleClose} className="sticky top-0 z-50 border-b border-obsidian-200 bg-white shadow-sm">
        <div className={cx(shell, 'relative flex min-h-[48px] items-center justify-between')}>
          <AppLink to={paths.home} aria-label={`${journal.shortName} home`} className="font-newsreader text-xl font-bold tracking-tight text-wine-800 xl:hidden">{journal.shortName}</AppLink>
          <nav aria-label="Main" className="hidden items-center xl:flex">
            {plain({ label: 'Home', to: paths.home }, pathname === paths.home)}
            {plain({ label: 'Current Issue', to: paths.currentIssue }, isActive(paths.currentIssue), 'bg-[#9b4500]')}
            {plain({ label: 'Archives', to: paths.pastIssues }, isActive(paths.pastIssues))}
            {dropdown(areaMenu)}
            {dropdown(authors)}
            {dropdown(policiesMenu, true)}
            {dropdown(reviewerMenu)}
            {dropdown(about)}
            {plain(apcLink, isActive(apcLink.to))}
            {plain(editorialLink, isActive(editorialLink.to))}
            {plain(contactLink, isActive(contactLink.to))}
          </nav>
          <div className="ml-auto flex items-center gap-1 xl:hidden">
            <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="rounded p-2.5 text-[#141b2b] hover:bg-[#f4f5fc]">
              {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav aria-label="Mobile" className="max-h-[calc(100vh-48px)] overflow-y-auto border-t border-obsidian-200 bg-white px-4 pb-6 pt-2 motion-safe:animate-slide-down sm:px-6 xl:hidden">
            {flat.slice(0, 3).map((l) => <AppLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className={mobileLink}>{l.label}</AppLink>)}
            {mobileGroups.map((m) => (
              <details key={m.id} className="group border-b border-obsidian-100">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-work text-sm font-semibold uppercase tracking-wider text-[#141b2b]">{m.label}<ExpandMore className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <ul className="pb-3">{m.links.map((l) => <li key={l.to + l.label}><AppLink to={l.to} onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 text-sm text-[#564241] hover:bg-[#f4f5fc]">{l.label}</AppLink></li>)}</ul>
              </details>
            ))}
            {flat.slice(3).map((l) => <AppLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className={mobileLink}>{l.label}</AppLink>)}
          </nav>
        )}
      </div>
    </>
  )
}
