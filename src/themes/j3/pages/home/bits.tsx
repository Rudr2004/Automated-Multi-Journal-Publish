// Small shared pieces for the home page, after the Academic Editorial & Press reference: numbered section heads with the 8px orange square,
// ruled panels, button classes (primary solid, secondary ruled, tertiary underlined), tags and the Open Access mark. 2px radius, hairlines, no shadows.
import type { ReactNode } from 'react'
import { cx } from '../../components/primitives'
import { OpenAccess } from '../../icons'

/** Page width: the 1360px column with 40px gutters on desktop. */
export const wrapCls = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'
/** White panel with a 1px hairline (no shadow elevation). */
export const panel = 'rounded-tile border border-j3paper-rule bg-white'
/** Mist side-rail panel. */
export const rail = 'rounded-tile border border-j3paper-rule bg-j3paper-cool'
/** Uppercase tracked label. */
export const labelCls = 'font-jakarta text-[11px] font-bold uppercase tracking-[0.06em]'
const btnBase = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-tile px-4 py-2.5 font-jakarta text-[13px] font-semibold transition-colors'
/** Primary: solid Primary Purple, hover #3B237D. */
export const btnPrimary = `${btnBase} bg-iris-700 text-white hover:bg-iris-800`
/** Secondary: ruled, hover Mist with a purple border. */
export const btnSecondary = `${btnBase} border border-j3paper-rule bg-white text-night-900 hover:border-iris-700 hover:bg-j3paper-cool`
/** Restricted orange call to action: the fill carries dark plum text for contrast. */
export const btnOrange = `${btnBase} bg-ember-500 text-night-900 hover:bg-ember-400`
/** Tertiary: underlined text link with a hairline. */
export const linkCls = 'font-inter text-[13px] font-medium text-iris-700 underline decoration-j3paper-rule underline-offset-4 transition-colors hover:decoration-iris-700'
/** Compact ruled action used on article rows. */
export const miniBtn = 'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-tile px-3 py-1.5 font-inter text-xs font-semibold transition-colors'

/** Section head: orange 8px square, optional number, purple uppercase label and a hairline rule. */
export function SquareHead({ n, title, aside, id, className }: { n?: string; title: string; aside?: ReactNode; id?: string; className?: string }) {
  return (
    <div className={cx('mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-j3paper-rule pb-3', className)}>
      <h2 id={id} className="flex items-center gap-2.5 font-jakarta text-[13px] font-bold uppercase tracking-[0.08em] text-iris-700">
        <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-ember-500" />
        {n && <span className="tabular-nums">{n} &mdash;</span>}
        {title}
      </h2>
      {aside}
    </div>
  )
}

/** Small ruled tag (document type, status). */
export function Tag({ children, tone = 'mist', className }: { children: ReactNode; tone?: 'mist' | 'plain' | 'orange'; className?: string }) {
  const tones = { mist: 'bg-j3paper-deep text-iris-800', plain: 'border border-j3paper-rule bg-white text-night-700', orange: 'bg-ember-500 text-night-900' }
  return <span className={cx(labelCls, 'inline-flex items-center gap-1 rounded-tile px-2 py-0.5', tones[tone], className)}>{children}</span>
}

/** Open Access mark: the padlock is one of the allowed orange accents (ember-600 passes 3:1 as an icon). */
export function OaMark({ label = 'Open Access', className }: { label?: string; className?: string }) {
  return <span className={cx(labelCls, 'inline-flex items-center gap-1.5 rounded-tile border border-j3paper-rule bg-j3paper-cool px-2 py-0.5 text-night-700', className)}><OpenAccess className="h-3.5 w-3.5 text-ember-600" aria-hidden="true" />{label}</span>
}

/** The round ORCID mark. The green circle is the one allowed round shape. */
export function OrcidMark({ orcid, name }: { orcid: string; name: string }) {
  const href = orcid.startsWith('http') ? orcid : `https://orcid.org/${orcid}`
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={`ORCID iD of ${name}`} className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-j3valid-700 font-inter text-[8px] font-bold leading-none text-white hover:bg-j3valid-800">iD</a>
  )
}

export const initials = (name: string) => name.replace(/^(Prof\.|Dr\.|Professor|Doctor)\s+/i, '').split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
