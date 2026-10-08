// Plain-language explanation of what is happening at each stage, following the platform's paper flow.
import type { TrackedPaper } from '../types'
import { formatDate } from './format'

export interface StageInfo {
  title: string
  text: string
  /** wait: nothing for the author to do · action: author can act now · done: finished */
  tone: 'wait' | 'action' | 'done'
}

/** Decision and acceptance messages go out once a day at 08:45 IST. */
export const BATCH_TIME = '08:45 IST'

const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return formatDate(d.toISOString().slice(0, 10)) }

export function stageInfo(p: TrackedPaper): StageInfo {
  switch (p.stageIndex) {
    case 0:
      return { tone: 'wait', title: 'We have your manuscript', text: 'Your Paper ID was sent by email, SMS and WhatsApp. The editor will screen your paper next. You can edit it until the decision is made.' }
    case 1:
      return { tone: 'wait', title: 'Editor screening and review', text: 'The editor screens your paper. An external reviewer is consulted only if the editor needs one. When this stage ends, a review report PDF is prepared for you.' }
    case 2:
      return { tone: 'wait', title: 'Decision made, message queued', text: `The editor has approved, asked for changes or rejected, and the reason is logged. Decisions are sent in one batch every day at ${BATCH_TIME}. Yours is queued for ${tomorrow()} at 08:45.` }
    case 3:
      return p.copyrightSigned
        ? { tone: 'action', title: 'Accepted: payment is next', text: 'Your copyright form is signed. Pay the article processing charge using the payment link we sent, or from this page.' }
        : { tone: 'action', title: 'Accepted: sign the copyright form', text: `Your acceptance letter, copyright form and payment link were sent at ${BATCH_TIME}. Sign the copyright form with an email OTP, then pay the APC.` }
    case 4:
      if (p.payment === 'verifying') return { tone: 'wait', title: 'Payment proof received', text: 'The editor is verifying your UPI or bank proof, usually within one working day. Payment reminders are paused. You will get a GST invoice once it is confirmed.' }
      if (p.payment === 'paid') return { tone: 'done', title: 'Payment confirmed', text: 'We have confirmed your payment and emailed the GST invoice. Payment reminders have stopped.' }
      return { tone: 'action', title: 'Payment due', text: 'Pay the APC online (INR through Razorpay, USD through Stripe) or upload your UPI or bank proof. Reminders continue until the payment is confirmed.' }
    case 5:
      return { tone: 'wait', title: 'Your article is in production', text: 'Payment is confirmed and the GST invoice was emailed. The associate editor is checking content and metadata, and your Word file is being converted into the web article.' }
    case 6:
      return { tone: 'done', title: 'Your article is published', text: 'The editor gave final approval and the article is live. Its DOI was deposited with Crossref and certificates with QR codes were emailed to every author. Next: the weekly Google Scholar check.' }
    default:
      return p.indexedOn
        ? { tone: 'done', title: 'Indexed in Google Scholar', text: `The weekly Google Scholar check found your article on ${formatDate(p.indexedOn)}, and we emailed you. Your paper has completed every stage.` }
        : { tone: 'wait', title: 'Weekly Google Scholar check pending', text: 'We check Google Scholar once a week. You will get an email as soon as your article is indexed.' }
  }
}
