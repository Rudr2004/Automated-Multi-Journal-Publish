// Small shared pieces for the home page, after the reference: label chips, the Open Access mark, the ORCID mark and section helpers.
import type { ReactNode } from 'react'
import { cx } from '../../components/primitives'
import { OpenAccess } from '../../icons'

/** Page width: the reference's 1360px column with 40px gutters on desktop. */
export const wrapCls = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'
/** White panel with a 1px hairline (no shadow elevation). */
export const panel = 'border border-mauve-100 bg-white'
/** Uppercase tracked 12px label. */
export const labelCls = 'font-inter text-[11px] font-semibold uppercase tracking-[0.06em]'
/** Primary navy button label style. */
export const btn = 'inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-4 py-2 font-inter text-xs font-semibold uppercase tracking-[0.06em] transition-colors'
export const btnPrimary = `${btn} bg-iris-700 text-white hover:bg-iris-600`
export const btnQuiet = `${btn} bg-iris-100 text-iris-700 hover:bg-iris-200`

const TONES = ['bg-iris-100 text-iris-700', 'bg-ember-100 text-ember-800', 'bg-j3valid-100 text-j3valid-800']
export function Chip({ children, tone = 0, className }: { children: ReactNode; tone?: number; className?: string }) {
  return <span className={cx(labelCls, 'px-2 py-0.5', TONES[tone % TONES.length], className)}>{children}</span>
}

export function OaMark({ label = 'Open Access', className }: { label?: string; className?: string }) {
  return <span className={cx(labelCls, 'inline-flex items-center gap-1 text-j3valid-700', className)}><OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />{label}</span>
}

/** The round ORCID mark. The green circle is the one allowed round shape. */
export function OrcidMark({ orcid, name }: { orcid: string; name: string }) {
  const href = orcid.startsWith('http') ? orcid : `https://orcid.org/${orcid}`
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={`ORCID iD of ${name}`} className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-j3valid-700 font-inter text-[8px] font-bold leading-none text-white hover:bg-j3valid-800">iD</a>
  )
}

export function SectionHead({ title, kicker, aside }: { title: string; kicker?: string; aside?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-mauve-100 pb-3">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 className="font-jakarta text-lg font-semibold tracking-tight text-iris-700">{title}</h2>
        {kicker && <span className={cx(labelCls, 'tracking-[0.1em] text-mauve-600')}>{kicker}</span>}
      </div>
      {aside}
    </div>
  )
}
