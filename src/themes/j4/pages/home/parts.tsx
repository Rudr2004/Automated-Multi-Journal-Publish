// Shared pieces of the home page cards, copied from the reference's classes: the white 12px card, the main-column section head and the sidebar card head.
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../components/primitives'

/** White card with a slate-200 hairline and 12px corners (the reference's `rounded-xl`; J4's Tailwind maps rounded-xl to 4px, so the value is explicit). */
export function Box({ className, children, ...rest }: { className?: string; children: ReactNode } & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  return <section {...rest} className={cx('rounded-[12px] border border-slate-200 bg-white', className)}>{children}</section>
}

/** Main-column section head: serif title with a sky icon, a caption and a small tag at the right, over a hairline. */
export function SectionHead({ id, icon, title, text, tag, tagClass }: { id: string; icon: ReactNode; title: string; text?: string; tag?: string; tagClass?: string }) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
      <div>
        <h2 id={id} className="flex items-center gap-2 font-serif4 text-xl font-bold text-[#0b2545]">{icon}{title}</h2>
        {text && <p className="mt-0.5 text-xs text-slate-500">{text}</p>}
      </div>
      {tag && <span className={cx('shrink-0 self-start rounded px-2.5 py-1 text-xs font-medium sm:self-auto', tagClass ?? 'border border-sky-100 bg-sky-50 text-cobalt-700')}>{tag}</span>}
    </div>
  )
}
