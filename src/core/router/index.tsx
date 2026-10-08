// Routing adapter: components stay framework-agnostic. The host app (Vite/React Router now,
// Next.js later) supplies Link / pathname / navigate through this context.
import { createContext, useContext, type CSSProperties, type MouseEventHandler, type ReactNode } from 'react'

export interface AppLinkProps {
  to: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
  'aria-label'?: string
  'aria-current'?: 'page' | undefined
}

export interface RouterAdapter {
  Link: (props: AppLinkProps) => ReactNode
  pathname: string
  /** Query string of the current URL, e.g. "?q=graphene". */
  search: string
  navigate: (to: string) => void
}

const fallback: RouterAdapter = {
  Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>,
  pathname: '/',
  search: '',
  navigate: (to) => { window.location.href = to },
}

const Ctx = createContext<RouterAdapter>(fallback)
export const RouterAdapterProvider = Ctx.Provider
export const useRouter = () => useContext(Ctx)

export function AppLink(props: AppLinkProps) {
  const { Link } = useRouter()
  return <>{Link(props)}</>
}
