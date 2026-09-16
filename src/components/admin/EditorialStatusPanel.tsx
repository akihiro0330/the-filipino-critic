import {
  Clock3,
  FileCheck2,
  Flame,
  SearchCheck,
  Star,
} from 'lucide-react'

import type {
  ReactNode,
} from 'react'

import type {
  PostStatus,
} from '../../types/database'

interface EditorialStatusPanelProps {
  status: PostStatus
  publishedAt: string | null
  updatedAt: string | null
  sourceCount: number
  metaTitle: string
  metaDescription: string
  featured: boolean
  trending: boolean
  trendingRank: string
}

export function EditorialStatusPanel({
  status,
  publishedAt,
  updatedAt,
  sourceCount,
  metaTitle,
  metaDescription,
  featured,
  trending,
  trendingRank,
}: EditorialStatusPanelProps) {
  const seoReady =
    Boolean(
      metaTitle.trim(),
    ) &&
    Boolean(
      metaDescription.trim(),
    )

  return (
    <section
      className="
        mt-6
        grid
        gap-3
        md:grid-cols-2
        xl:grid-cols-4
      "
      aria-label="Editorial status"
    >
      <StatusCard
        icon={
          <FileCheck2
            size={16}
          />
        }
        label="Publication"
        value={
          formatStatus(
            status,
          )
        }
        detail={
          status ===
            'published'
            ? publishedAt
              ? `Published ${formatDateTime(publishedAt)}`
              : 'Published'
            : 'Not publicly visible'
        }
      />

      <StatusCard
        icon={
          <Clock3
            size={16}
          />
        }
        label="Last updated"
        value={
          updatedAt
            ? formatDateTime(
                updatedAt,
              )
            : 'Unsaved'
        }
        detail={
          status ===
            'published'
            ? 'Saved changes affect the live article.'
            : 'CMS working version'
        }
      />

      <StatusCard
        icon={
          <SearchCheck
            size={16}
          />
        }
        label="Editorial metadata"
        value={
          seoReady
            ? 'SEO ready'
            : 'SEO incomplete'
        }
        detail={`${sourceCount} source${sourceCount === 1 ? '' : 's'} attached`}
        warning={
          !seoReady
        }
      />

      <StatusCard
        icon={
          trending
            ? (
              <Flame
                size={16}
              />
            )
            : (
              <Star
                size={16}
              />
            )
        }
        label="Placement"
        value={
          getPlacementLabel(
            featured,
            trending,
          )
        }
        detail={
          trending
            ? trendingRank.trim()
              ? `Trending rank #${trendingRank.trim()}`
              : 'Trending rank required'
            : featured
              ? 'Homepage highlight'
              : 'Standard article'
        }
        warning={
          trending &&
          !trendingRank.trim()
        }
      />
    </section>
  )
}

function StatusCard({
  icon,
  label,
  value,
  detail,
  warning = false,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
  warning?: boolean
}) {
  return (
    <div
      className="
        rounded-[20px]
        border
        border-white/[0.08]
        bg-white/[0.035]
        p-4
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-white/40
        "
      >
        {icon}

        <span
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.14em]
          "
        >
          {label}
        </span>
      </div>

      <p
        className={`
          mt-3
          text-sm
          font-semibold
          ${
            warning
              ? 'text-amber-200'
              : 'text-white/85'
          }
        `}
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          leading-5
          text-white/35
        "
      >
        {detail}
      </p>
    </div>
  )
}

function formatStatus(
  status: PostStatus,
): string {
  return (
    status
      .charAt(0)
      .toUpperCase() +
    status.slice(1)
  )
}

function formatDateTime(
  value: string,
): string {
  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone:
        'Asia/Manila',
    },
  ).format(date)
}

function getPlacementLabel(
  featured: boolean,
  trending: boolean,
): string {
  if (
    featured &&
    trending
  ) {
    return 'Featured + Trending'
  }

  if (featured) {
    return 'Featured'
  }

  if (trending) {
    return 'Trending'
  }

  return 'Standard'
}
