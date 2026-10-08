// Toasts (e.g. "DOI copied"). Announced to screen readers through an aria-live region.
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { Check, ErrorIcon } from '../icons'

type Kind = 'success' | 'error'
type Push = (message: string, kind?: Kind) => void
const Ctx = createContext<Push>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string; kind: Kind }[]>([])
  const next = useRef(0)
  const push = useCallback<Push>((message, kind = 'success') => {
    const id = ++next.current
    setItems((l) => [...l.slice(-2), { id, message, kind }])
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3200)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto flex items-center gap-2 rounded-soft bg-graphite-800 px-4 py-2.5 text-sm font-medium text-white shadow-pop motion-safe:animate-toast-in">
            {t.kind === 'success' ? <Check className="h-4 w-4 text-brand-300" aria-hidden="true" /> : <ErrorIcon className="h-4 w-4 text-cta-300" aria-hidden="true" />}
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
