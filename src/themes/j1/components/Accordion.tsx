import { ChevronDown } from './uiIcons'
import { useId, useState, type ReactNode } from 'react'

interface AccordionItemProps {
  title: ReactNode
  children: ReactNode
  /** Uncontrolled: initial state. */
  defaultOpen?: boolean
  /** Controlled: pass both `open` and `onToggle`. */
  open?: boolean
  onToggle?: (open: boolean) => void
}

export function AccordionItem({ title, children, defaultOpen = false, open: controlled, onToggle }: AccordionItemProps) {
  const [internal, setInternal] = useState(defaultOpen)
  const id = useId()
  const open = controlled ?? internal
  const toggle = () => { onToggle?.(!open); if (controlled === undefined) setInternal(!open) }
  return (
    <div className={`rounded-card border bg-white ${open ? 'border-scholar/40' : 'border-line'}`}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={toggle}
          className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left font-serif text-[1.0625rem] font-semibold text-navy hover:text-scholar">
          {title}
          <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </h3>
      <div id={id} role="region" hidden={!open} className="border-t border-line bg-paper px-4 py-4 text-[15px] leading-relaxed text-ink">{children}</div>
    </div>
  )
}

export const Accordion = ({ children }: { children: ReactNode }) => <div className="space-y-2.5">{children}</div>
