import type { ReactNode } from 'react'

export function CTABanner({ title, children, actions }: { title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-card bg-navy p-8 text-white sm:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">{title}</h2>
          {children && <div className="mt-3 text-navy-100">{children}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  )
}
