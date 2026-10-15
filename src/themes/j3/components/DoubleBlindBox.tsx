// "Double-blind peer reviewed" notice shown on every article (issue lists and the article page). The same wording for all articles.
import { MdOutlineShield } from 'react-icons/md'

export function DoubleBlindBox({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 border border-j3valid-700/40 border-l-4 border-l-j3valid-700 bg-j3valid-50 px-4 py-3 ${className}`}>
      <MdOutlineShield className="mt-0.5 h-5 w-5 shrink-0 text-j3valid-700" aria-hidden="true" />
      <p className="font-inter text-[13px] leading-snug text-night-900"><strong className="font-jakarta font-bold text-j3valid-800">Double-blind peer reviewed.</strong> Author and reviewer identities are hidden from each other during evaluation, so the decision rests on the work alone.</p>
    </div>
  )
}
