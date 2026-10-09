// Wraps every occurrence of the search words in <mark>. Words shorter than 2 characters are ignored.
import { Fragment } from 'react'

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function Highlight({ text, term }: { text: string; term: string }) {
  const words = [...new Set(term.trim().split(/\s+/).filter((w) => w.length >= 2))]
  if (!words.length) return <>{text}</>
  const re = new RegExp(`(${words.map(esc).join('|')})`, 'ig')
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="rounded-[3px] bg-amber-100 px-0.5 text-inherit">{part}</mark> : <Fragment key={i}>{part}</Fragment>))}</>
}
