// Icon names usable from static-page mock data (icon-list / card-grid blocks) and the policy directory.
import type { IconType } from 'react-icons'
import {
  MdOutlineArticle, MdOutlineBalance, MdOutlineBlock, MdOutlineCreditCard, MdOutlineDatasetLinked, MdOutlineDescription, MdOutlineDomain,
  MdOutlineEditNote, MdOutlineFactCheck, MdOutlineGavel, MdOutlineHistory, MdOutlineHistoryEdu, MdOutlineInventory2, MdOutlineLockOpen,
  MdOutlinePolicy, MdOutlinePrivacyTip, MdOutlineReceiptLong, MdOutlineSchool, MdOutlineSmartToy, MdOutlineVerifiedUser, MdOutlineVisibility,
  MdOutlineWorkspacePremium, MdOutlineArchive, MdOutlineRateReview, MdOutlineCopyright, MdOutlineReport,
} from 'react-icons/md'
import { TrustIcon } from '../../components/icons'

const registry: Record<string, IconType> = {
  eye: MdOutlineVisibility, 'shield-check': MdOutlineVerifiedUser, graduation: MdOutlineSchool, history: MdOutlineHistory,
  building: MdOutlineDomain, block: MdOutlineBlock,
  // policy slugs -> icon (directory + related cards)
  'peer-review': MdOutlineRateReview, 'publication-ethics': MdOutlineVerifiedUser, plagiarism: MdOutlineFactCheck, 'ai-policy': MdOutlineSmartToy,
  'conflict-of-interest': MdOutlineBalance, 'reviewer-guidelines': MdOutlineSchool, 'open-access': MdOutlineLockOpen,
  'copyright-licensing': MdOutlineCopyright, archiving: MdOutlineArchive, corrections: MdOutlineEditNote, retraction: MdOutlineHistoryEdu,
  data: MdOutlineDatasetLinked, 'author-guidelines': MdOutlineArticle, 'publication-charges': MdOutlineReceiptLong, refund: MdOutlineCreditCard,
  'editorial-policy': MdOutlinePolicy, complaints: MdOutlineReport, privacy: MdOutlinePrivacyTip,
  gavel: MdOutlineGavel, award: MdOutlineWorkspacePremium, inventory: MdOutlineInventory2, doc: MdOutlineDescription,
}

/** Resolves an icon by name; unknown names fall back to the shared trust-icon set, then a document icon. */
export function StaticIcon({ name, className, ...rest }: { name?: string; className?: string } & Record<string, unknown>) {
  const Icon = name ? registry[name] : undefined
  if (Icon) return <Icon className={className} {...rest} />
  if (name) return <TrustIcon name={name} className={className} {...rest} />
  return <MdOutlineDescription className={className} {...rest} />
}
