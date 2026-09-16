import {
  AlertTriangle,
  Check,
  Globe2,
  SearchCheck,
  ShieldCheck,
  X,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
} from 'react'

import type {
  AdminEditorSource,
  PostStatus,
} from '../../types/database'

interface PublishReviewDialogProps {
  open: boolean
  currentStatus: PostStatus
  title: string
  slug: string
  excerpt: string
  hasCategory: boolean
  hasContent: boolean
  featuredImage: string
  imageAlt: string
  readingTime: string
  sources: AdminEditorSource[]
  metaTitle: string
  metaDescription: string
  warnings: string[]
  saving: boolean
  onClose: () => void
  onConfirm: () => void
}

interface ReviewItem {
  label: string
  ready: boolean
  detail: string
}

export function PublishReviewDialog({
  open,
  currentStatus,
  title,
  slug,
  excerpt,
  hasCategory,
  hasContent,
  featuredImage,
  imageAlt,
  readingTime,
  sources,
  metaTitle,
  metaDescription,
  warnings,
  saving,
  onClose,
  onConfirm,
}: PublishReviewDialogProps) {
  const validSources =
    useMemo(
      () =>
        sources.filter(
          (source) =>
            source.label.trim() &&
            source.url.trim(),
        ),
      [sources],
    )

  const reviewItems: ReviewItem[] =
    [
      {
        label: 'Title',
        ready:
          Boolean(
            title.trim(),
          ),
        detail:
          title.trim() ||
          'Missing',
      },
      {
        label: 'Slug',
        ready:
          Boolean(
            slug.trim(),
          ),
        detail:
          slug.trim()
            ? `/${slug.trim()}`
            : 'Missing',
      },
      {
        label: 'Category',
        ready:
          hasCategory,
        detail:
          hasCategory
            ? 'Selected'
            : 'Missing',
      },
      {
        label: 'Excerpt',
        ready:
          Boolean(
            excerpt.trim(),
          ),
        detail:
          excerpt.trim()
            ? `${excerpt.trim().length} characters`
            : 'Missing',
      },
      {
        label: 'Article content',
        ready:
          hasContent,
        detail:
          hasContent
            ? 'Content added'
            : 'Missing',
      },
      {
        label: 'Featured image',
        ready:
          Boolean(
            featuredImage.trim(),
          ),
        detail:
          featuredImage.trim()
            ? 'Selected'
            : 'Missing',
      },
      {
        label: 'Image alt text',
        ready:
          Boolean(
            imageAlt.trim(),
          ),
        detail:
          imageAlt.trim()
            ? 'Added'
            : 'Missing',
      },
      {
        label: 'Reading time',
        ready:
          !readingTime.trim() ||
          Number(
            readingTime,
          ) > 0,
        detail:
          readingTime.trim()
            ? `${readingTime.trim()} min`
            : 'Auto-calculated',
      },
    ]

  const allRequiredReady =
    reviewItems.every(
      (item) =>
        item.ready,
    )

  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        'Escape'
      ) {
        onClose()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    open,
    onClose,
  ])

  if (!open) {
    return null
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[120]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/75
        p-4
        backdrop-blur-xl
        sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-review-title"
    >
      <button
        type="button"
        aria-label="Close publish review"
        className="
          absolute
          inset-0
          cursor-default
        "
        onClick={
          onClose
        }
      />

      <section
        className="
          relative
          z-10
          my-auto
          w-full
          max-w-3xl
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.10]
          bg-[#0d1119]/95
          shadow-2xl
          shadow-black/50
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-5
            border-b
            border-white/[0.08]
            px-6
            py-6
            sm:px-8
          "
        >
          <div>
            <div
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#AD2730]/30
                bg-[#AD2730]/10
                px-3
                py-1.5
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#ef6a72]
              "
            >
              <ShieldCheck
                size={14}
              />
              Pre-publish review
            </div>

            <h2
              id="publish-review-title"
              className="
                text-2xl
                font-semibold
                tracking-tight
                text-white
              "
            >
              {currentStatus ===
              'published'
                ? 'Review changes before updating'
                : 'Ready to publish?'}
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-white/45
              "
            >
              Check the article details before making this version publicly visible.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              inline-flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.08]
              bg-white/[0.04]
              text-white/50
              transition
              hover:bg-white/[0.08]
              hover:text-white
            "
            aria-label="Close"
          >
            <X
              size={17}
            />
          </button>
        </div>

        <div
          className="
            max-h-[65vh]
            overflow-y-auto
            px-6
            py-6
            sm:px-8
          "
        >
          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
            "
          >
            {reviewItems.map(
              (item) => (
                <div
                  key={
                    item.label
                  }
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-[18px]
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    p-4
                  "
                >
                  <span
                    className={`
                      mt-0.5
                      inline-flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      ${
                        item.ready
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-[#AD2730]/15 text-[#ef6a72]'
                      }
                    `}
                  >
                    {item.ready
                      ? (
                        <Check
                          size={14}
                        />
                      )
                      : (
                        <X
                          size={14}
                        />
                      )}
                  </span>

                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-white/85
                      "
                    >
                      {item.label}
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        text-white/35
                      "
                    >
                      {item.detail}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          <div
            className="
              mt-6
              grid
              gap-4
              lg:grid-cols-2
            "
          >
            <div
              className="
                rounded-[20px]
                border
                border-white/[0.07]
                bg-white/[0.025]
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-white/80
                "
              >
                <SearchCheck
                  size={16}
                />
                SEO review
              </div>

              <div
                className="
                  mt-4
                  space-y-3
                  text-xs
                "
              >
                <ReviewLine
                  label="SEO title"
                  value={
                    metaTitle.trim()
                      ? `${metaTitle.trim().length} characters`
                      : 'Not provided'
                  }
                  warning={
                    !metaTitle.trim() ||
                    metaTitle.trim().length >
                      60
                  }
                />

                <ReviewLine
                  label="Meta description"
                  value={
                    metaDescription.trim()
                      ? `${metaDescription.trim().length} characters`
                      : 'Not provided'
                  }
                  warning={
                    !metaDescription.trim() ||
                    metaDescription.trim().length >
                      160
                  }
                />

                <ReviewLine
                  label="Sources"
                  value={
                    validSources.length ===
                    0
                      ? 'No sources attached'
                      : `${validSources.length} source${validSources.length === 1 ? '' : 's'} attached`
                  }
                  warning={
                    false
                  }
                />
              </div>
            </div>

            <div
              className="
                rounded-[20px]
                border
                border-white/[0.07]
                bg-white/[0.025]
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-white/80
                "
              >
                <Globe2
                  size={16}
                />
                Publication
              </div>

              <div
                className="
                  mt-4
                  rounded-[16px]
                  border
                  border-white/[0.06]
                  bg-black/20
                  p-4
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-white/30
                  "
                >
                  Status
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    font-semibold
                    text-white/80
                  "
                >
                  {currentStatus ===
                  'published'
                    ? 'Published → Published'
                    : `${formatStatus(currentStatus)} → Published`}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-white/35
                  "
                >
                  {currentStatus ===
                  'published'
                    ? 'Saving will update the version currently visible on the public website.'
                    : 'Confirming will make this article publicly visible.'}
                </p>
              </div>
            </div>
          </div>

          {warnings.length >
            0 && (
            <div
              className="
                mt-6
                rounded-[20px]
                border
                border-amber-300/15
                bg-amber-300/[0.05]
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-amber-200
                "
              >
                <AlertTriangle
                  size={16}
                />
                Recommendations
              </div>

              <div
                className="
                  mt-3
                  space-y-2
                "
              >
                {warnings.map(
                  (warning) => (
                    <p
                      key={
                        warning
                      }
                      className="
                        text-xs
                        leading-5
                        text-amber-100/55
                      "
                    >
                      • {warning}
                    </p>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-white/[0.08]
            bg-black/15
            px-6
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
          "
        >
          <p
            className="
              text-xs
              text-white/30
            "
          >
            {allRequiredReady
              ? 'Required publishing checks passed.'
              : 'Resolve the missing required fields before publishing.'}
          </p>

          <div
            className="
              flex
              gap-3
            "
          >
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-full
                border
                border-white/[0.10]
                bg-white/[0.04]
                px-5
                text-sm
                font-semibold
                text-white/65
                transition
                hover:bg-white/[0.08]
                hover:text-white
                disabled:opacity-40
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                onConfirm
              }
              disabled={
                saving ||
                !allRequiredReady
              }
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#AD2730]
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#c3313b]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Globe2
                size={15}
              />

              {saving
                ? 'Publishing...'
                : currentStatus ===
                    'published'
                  ? 'Update Published'
                  : 'Publish Article'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ReviewLine({
  label,
  value,
  warning,
}: {
  label: string
  value: string
  warning: boolean
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <span
        className="
          text-white/40
        "
      >
        {label}
      </span>

      <span
        className={
          warning
            ? 'text-amber-200/70'
            : 'text-white/65'
        }
      >
        {value}
      </span>
    </div>
  )
}

function formatStatus(
  status: PostStatus,
) {
  return status
    .charAt(0)
    .toUpperCase() +
    status.slice(1)
}
