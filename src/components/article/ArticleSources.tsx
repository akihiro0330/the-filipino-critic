import {
  ExternalLink,
  FileText,
} from 'lucide-react'

import type { ArticleSource } from '../../types/article'

interface ArticleSourcesProps {
  sources: ArticleSource[]
}

export function ArticleSources({
  sources,
}: ArticleSourcesProps) {
  if (sources.length === 0) {
    return null
  }

  return (
    <section
      className="
        mt-16
        border-t
        border-[var(--border)]
        pt-10
      "
    >
      <div
        className="
          mb-6
          flex
          items-center
          gap-2
        "
      >
        <FileText
          size={17}
          className="text-[var(--brand-red)]"
        />

        <p className="eyebrow">
          Sources & references
        </p>
      </div>

      <div className="space-y-3">
        {sources.map((source) => (
          <a
            key={`${source.label}-${source.url}`}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="
              group
              flex
              items-center
              justify-between
              gap-4
              rounded-[20px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-5
              py-4
              text-sm
              transition
              hover:-translate-y-0.5
              hover:bg-[var(--surface-strong)]
            "
          >
            <span className="font-medium">
              {source.label}
            </span>

            <ExternalLink
              size={15}
              className="
                shrink-0
                text-[var(--foreground-muted)]
                transition
                group-hover:text-[var(--brand-red)]
              "
            />
          </a>
        ))}
      </div>
    </section>
  )
}