import {
  Award, BadgeCheck, ClipboardCheck, CreditCard, Database, Eye, Gavel, Globe, Link2, MessageCircle,
  Receipt, Rocket, ScanSearch, Scale, Send, ShieldCheck, Unlock, Users, Zap, FileText, type IconProps,
} from './uiIcons'
import type { ComponentType } from 'react'

// Icon names used in config (journal.ts) → icon components (see ./uiIcons).
const registry: Record<string, ComponentType<IconProps>> = {
  'shield-check': ShieldCheck, unlock: Unlock, link: Link2, 'scan-search': ScanSearch, database: Database,
  scale: Scale, zap: Zap, globe: Globe, 'badge-check': BadgeCheck, award: Award, 'message-circle': MessageCircle,
  receipt: Receipt, 'file-text': FileText, send: Send, 'clipboard-check': ClipboardCheck, users: Users,
  gavel: Gavel, 'credit-card': CreditCard, rocket: Rocket, eye: Eye,
}

export function TrustIcon({ name, ...props }: { name: string } & IconProps) {
  const Icon = registry[name] ?? ShieldCheck
  return <Icon strokeWidth={1.5} {...props} />
}
