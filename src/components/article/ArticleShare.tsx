import {
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface ArticleShareProps {
  title: string
}

export function ArticleShare({
  title,
}: ArticleShareProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] =
    useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      )

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch {
      setCopied(false)
    }
  }

  const facebookShareUrl =
    currentUrl.length > 0
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl,
        )}`
      : '#'

  return (
    <div
      className="
        flex
        flex-wrap
        gap-3
      "
    >
      <button
        type="button"
        onClick={copyLink}
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-4
          py-2.5
          text-sm
          font-semibold
          backdrop-blur-xl
          transition
          hover:-translate-y-0.5
          hover:bg-[var(--surface-strong)]
        "
      >
        {copied ? (
          <>
            <Check size={15} />
            Copied
          </>
        ) : (
          <>
            <Copy size={15} />
            Copy link
          </>
        )}
      </button>

      <a
        href={facebookShareUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Share ${title} on Facebook`}
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-[#1877f2]
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:-translate-y-0.5
        "
      >
        Facebook

        <ExternalLink size={15} />
      </a>
    </div>
  )
}