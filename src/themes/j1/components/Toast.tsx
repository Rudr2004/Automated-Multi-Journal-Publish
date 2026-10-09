import { CheckCircle2, XCircle } from './uiIcons'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastKind = 'success' | 'error'
interface ToastItem { id: number; kind: ToastKind; message: string }
const Ctx = createContext<(message: string, kind?: ToastKind) => void>(() => {})
export const useToast = () => useContext(Ctx)
/** Removes every error toast that is still on screen (e.g. a stale validation message once the problem is fixed). */
const DismissCtx = createContext<() => void>(() => {})
export const useDismissErrorToasts = () => useContext(DismissCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const push = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setItems((l) => [...l, { id, kind, message }])
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 4000)
  }, [])
  const dismissErrors = useCallback(() => setItems((l) => l.filter((t) => t.kind !== 'error')), [])
  return (
    <Ctx.Provider value={push}>
      <DismissCtx.Provider value={dismissErrors}>
      {children}
      <div aria-live="polite" className="fixed bottom-20 right-4 z-[70] flex flex-col gap-2 md:bottom-6">
        {items.map((t) => (
          <div key={t.id} role="status"
            className={`flex max-w-sm items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm shadow-lg ${t.kind === 'success' ? 'border-oa/40' : 'border-danger/40'}`}>
            {t.kind === 'success' ? <CheckCircle2 className="h-5 w-5 text-oa" aria-hidden /> : <XCircle className="h-5 w-5 text-danger" aria-hidden />}
            {t.message}
          </div>
        ))}
      </div>
      </DismissCtx.Provider>
    </Ctx.Provider>
  )
}
