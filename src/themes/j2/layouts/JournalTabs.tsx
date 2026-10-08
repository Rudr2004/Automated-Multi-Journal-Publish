// Journal tabs at the very top: the active journal is a white pill; unbuilt journals are shown as "Soon".
import { journal } from '../../../config/journals'
import { network, networkHref } from '../../../config/journals/network'
import { cx } from '../components/primitives'

export function JournalTabs() {
  return (
    <nav aria-label="Our journals" className="bg-graphite-100">
      <ul className="mx-auto grid max-w-site grid-cols-5 gap-1 px-2 py-1.5 sm:px-4">
        {network.map((j) => {
          const active = j.code === journal.shortName
          const href = networkHref(j)
          const cls = cx('block rounded-chip px-1 py-1.5 text-center text-xs font-semibold sm:text-sm', active ? 'bg-white text-brand-800 shadow-card' : href ? 'text-graphite-600 hover:bg-white/70 hover:text-brand-800' : 'cursor-default text-graphite-500')
          return (
            <li key={j.code}>
              {href && !active
                ? <a href={href} className={cls}>{j.code}</a>
                : <span className={cls} aria-current={active ? 'true' : undefined} title={href ? undefined : 'Coming soon'}>{j.code}{!href && <span className="ml-1 hidden text-[10px] font-medium sm:inline">Soon</span>}</span>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
