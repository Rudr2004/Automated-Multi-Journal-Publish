import { useState } from 'react'
import { copyText } from '../../../core/lib/clipboard'
import { Check, Copy } from '../icons'
import { cx } from './primitives'
import { useToast } from './Toast'

/** Small "Copy" button that confirms through a toast and a changed label. */
export function CopyChip({ text, label = 'Copy', done = 'Copied', className }: { text: string; label?: string; done?: string; className?: string }) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const click = async () => {
    const ok = await copyText(text)
    if (ok) { setCopied(true); toast(done); setTimeout(() => setCopied(false), 1800) }
    else toast('Copy is blocked in this browser. Select the text and copy it manually.', 'error')
  }
  return (
    <button type="button" onClick={click} className={cx('inline-flex items-center gap-1.5 rounded-chip border border-graphite-300 bg-white px-2.5 py-1 text-xs font-semibold text-accent-700 hover:bg-accent-50', className)}>
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}{copied ? done : label}
    </button>
  )
}
