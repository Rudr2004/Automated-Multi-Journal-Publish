// Header, as in the reference: a parchment masthead (logo, scholarly badges, journal name, tagline and three action buttons), a dark Journal Xplore band
// (search with DOI / Paper-ID detection) and a sticky white navigation bar with uppercase links and hover / click dropdowns.
import { useEffect, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink, useRouter } from '../../../core/router'
import { ArchiveSearch } from '../components/ArchiveSearch'
import { Badge, ExpandMore, PublicIcon } from '../components/homeIconsJ5'
import { cx } from '../components/primitives'
import { Book, Close, Menu, Submit, Track } from '../icons'
import type { NavItem } from '../../../config/navigation'
import { j5Nav } from './nav'

/** The IJFRD logo, shown whole. It has a white background, so on the dark footer it sits on a white tile. */
export function Logo({ size = 64, tile, className }: { size?: number; tile?: boolean; className?: string }) {
  return <img src="/journals/j5/logo.png" alt="" width={size} height={size} style={{ width: size, height: size }} className={cx('shrink-0 object-contain', tile && 'rounded bg-white p-1', className)} />
}

const shell = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
const navShell = 'mx-auto max-w-[88rem] px-4'
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

  const link = 'flex items-center gap-1 whitespace-nowrap px-1.5 py-3.5 font-work text-[10.5px] font-medium uppercase leading-4 tracking-normal transition-colors'
  const idle = 'text-[#564241] hover:bg-[#f4f5fc] hover:text-wine-800'
  const on = 'border-b-2 border-[#9b4500] bg-[#9b4500]/10 font-bold text-[#9b4500]'
  const itemActive = (it: NavItem) => (it.match ? it.match(pathname) : isActive(it.to))
  const plain = (it: NavItem) => {
    const active = itemActive(it)
    return (
      <div key={it.label} onMouseEnter={() => setMenu(null)}>
        <AppLink to={it.to} aria-current={active ? 'page' : undefined} className={cx(link, active ? on : idle)}>{it.label}</AppLink>
      </div>
    )
  }
  const dropdown = (it: NavItem, i: number) => {
    const open = menu === it.label
    return (
      <div key={it.label} className="relative" onMouseEnter={() => openMenu(it.label)}>
        <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => (open ? setMenu(null) : openMenu(it.label))} className={cx(link, 'cursor-pointer', itemActive(it) ? on : idle, open && 'text-wine-800')}>
          {it.label}<ExpandMore className={cx('h-3.5 w-3.5 text-[#897270] transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
        </button>
        {open && (
          <ul className={cx('absolute top-full z-50 max-h-[460px] w-80 overflow-y-auto rounded border border-[#dcc0be] bg-white py-1.5 shadow-lg motion-safe:animate-fade-in', i > 6 ? 'right-0' : 'left-0')}>
            {it.children!.map((l) => (
              <li key={l.label}><AppLink to={l.to} className="block px-4 py-2 font-work text-xs leading-snug text-[#141b2b] transition-colors hover:bg-[#f4f5fc] hover:text-wine-800">{l.label}</AppLink></li>
            ))}
          </ul>
        )}
      </div>
    )
  }
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
        <div className={cx(navShell, 'relative flex min-h-[48px] items-center justify-between')}>
          <AppLink to={paths.home} aria-label={`${journal.shortName} home`} className="font-newsreader text-xl font-bold tracking-tight text-wine-800 xl:hidden">{journal.shortName}</AppLink>
          <nav aria-label="Main" className="hidden min-w-0 flex-1 flex-wrap items-center justify-between xl:flex">
            {j5Nav.map((it, i) => (it.children ? dropdown(it, i) : plain(it)))}
          </nav>
          <div className="ml-auto flex items-center gap-1 xl:hidden">
            <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="rounded p-2.5 text-[#141b2b] hover:bg-[#f4f5fc]">
              {mobileOpen ? <Close className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav aria-label="Mobile" className="max-h-[calc(100vh-48px)] overflow-y-auto border-t border-obsidian-200 bg-white px-4 pb-6 pt-2 motion-safe:animate-slide-down sm:px-6 xl:hidden">
            {j5Nav.map((it) => it.children ? (
              <details key={it.label} className="group border-b border-obsidian-100">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-work text-sm font-semibold uppercase tracking-wider text-[#141b2b]">{it.label}<ExpandMore className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <ul className="pb-3">{it.children.map((l) => <li key={l.label}><AppLink to={l.to} onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 text-sm text-[#564241] hover:bg-[#f4f5fc]">{l.label}</AppLink></li>)}</ul>
              </details>
            ) : <AppLink key={it.label} to={it.to} onClick={() => setMobileOpen(false)} className={mobileLink}>{it.label}</AppLink>)}
          </nav>
        )}
      </div>
    </>
  )
}
