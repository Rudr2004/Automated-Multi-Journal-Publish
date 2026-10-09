// Shared frame for the home sections: a Kicker, a Newsreader title, optional text and action, and the OrnamentRule beneath.
import type { ReactNode } from 'react'
import { Container, cx } from '../../components/primitives'
import { Kicker, OrnamentRule } from '../../components/signature'

export function HomeSection({ id, label, title, text, action, bg = 'bg-white', className, children }: {
  id: string; label: string; title: string; text?: string; action?: ReactNode; bg?: string; className?: string; children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className={cx('border-t border-wine-800/10 py-12 sm:py-16', bg, className)}>
      <Container>
        <div className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <Kicker>{label}</Kicker>
              <h2 id={id} className="mt-2 font-newsreader text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-obsidian-900 sm:text-[2.125rem]">{title}</h2>
              {text && <p className="mt-2 font-serif4 text-base text-obsidian-600">{text}</p>}
            </div>
            {action}
          </div>
          <OrnamentRule className="mt-5" />
        </div>
        {children}
      </Container>
    </section>
  )
}
