import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  Monitor,
  Smartphone,
  X,
} from 'lucide-react'

import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type {
  AdminEditorSource,
  PostContentSection,
} from '../../types/database'

interface AdminArticlePreviewProps {
  open: boolean
  onClose: () => void

  title: string
  excerpt: string

  categoryName: string

  featuredImage: string
  imageAlt: string

  readingTimeMinutes: number

  sections: PostContentSection[]
  sources: AdminEditorSource[]
}

type PreviewMode =
  | 'desktop'
  | 'mobile'

export function AdminArticlePreview({
  open,
  onClose,
  title,
  excerpt,
  categoryName,
  featuredImage,
  imageAlt,
  readingTimeMinutes,
  sections,
  sources,
}: AdminArticlePreviewProps) {
  const [
    mode,
    setMode,
  ] =
    useState<PreviewMode>(
      'desktop',
    )

  const publishDate =
    useMemo(() => {
      return new Intl.DateTimeFormat(
        'en-PH',
        {
          dateStyle:
            'long',

          timeZone:
            'Asia/Manila',
        },
      ).format(
        new Date(),
      )
    }, [])

  if (!open) {
    return null
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        flex-col
        bg-[#090c12]
      "
    >
      <header
        className="
          relative
          z-20
          flex
          min-h-[72px]
          shrink-0
          items-center
          justify-between
          gap-4
          border-b
          border-white/[0.08]
          bg-[#0c1017]/90
          px-4
          backdrop-blur-2xl
          sm:px-6
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <button
            type="button"
            onClick={
              onClose
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.08]
              bg-white/[0.04]
              text-white/60
              transition
              hover:bg-white/[0.08]
              hover:text-white
            "
            aria-label="Close article preview"
          >
            <ArrowLeft
              size={17}
            />
          </button>

          <div
            className="
              min-w-0
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Article Preview
              </p>

              <span
                className="
                  rounded-full
                  border
                  border-amber-400/20
                  bg-amber-400/[0.07]
                  px-2
                  py-0.5
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-amber-200
                "
              >
                Unpublished
              </span>
            </div>

            <p
              className="
                mt-0.5
                truncate
                text-[11px]
                text-white/30
              "
            >
              This preview uses your current unsaved editor content.
            </p>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              hidden
              items-center
              rounded-full
              border
              border-white/[0.08]
              bg-white/[0.03]
              p-1
              sm:flex
            "
          >
            <PreviewModeButton
              active={
                mode ===
                'desktop'
              }
              onClick={() =>
                setMode(
                  'desktop',
                )
              }
              icon={
                <Monitor
                  size={14}
                />
              }
              label="Desktop"
            />

            <PreviewModeButton
              active={
                mode ===
                'mobile'
              }
              onClick={() =>
                setMode(
                  'mobile',
                )
              }
              icon={
                <Smartphone
                  size={14}
                />
              }
              label="Mobile"
            />
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              flex
              h-10
              w-10
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
            aria-label="Close preview"
          >
            <X
              size={17}
            />
          </button>
        </div>
      </header>

      <div
        className="
          flex-1
          overflow-y-auto
          bg-[#11151d]
          px-3
          py-5
          sm:px-6
          sm:py-8
        "
      >
        <div
          className={`
            mx-auto
            min-h-full
            overflow-hidden
            border
            border-white/[0.08]
            bg-[#F4F0E8]
            shadow-2xl
            transition-[max-width]
            duration-300

            ${
              mode ===
              'mobile'
                ? 'max-w-[430px] rounded-[32px]'
                : 'max-w-[1440px] rounded-[24px]'
            }
          `}
        >
          <article
            className="
              min-h-screen
              bg-[#F4F0E8]
              text-[#121823]
            "
          >
            <div
              className="
                border-b
                border-black/[0.08]
                bg-[#F4F0E8]/95
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  max-w-7xl
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-5
                  sm:px-8
                  lg:px-12
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <img
                    src="/images/tfc-logo.jpg"
                    alt="The Filipino Critic"
                    className="
                      h-10
                      w-10
                      rounded-xl
                      object-cover
                    "
                  />

                  <div>
                    <p
                      className="
                        font-serif
                        text-sm
                        font-bold
                        tracking-tight
                      "
                    >
                      The Filipino Critic
                    </p>

                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#AD2730]
                      "
                    >
                      Article Preview
                    </p>
                  </div>
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-[#121823]/10
                    bg-white/35
                    px-3
                    py-1.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#121823]/50
                  "
                >
                  Preview only
                </span>
              </div>
            </div>

            <div
              className="
                mx-auto
                max-w-5xl
                px-5
                pb-20
                pt-12
                sm:px-8
                sm:pt-16
                lg:px-12
                lg:pt-24
              "
            >
              <div
                className="
                  max-w-4xl
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.20em]
                    text-[#AD2730]
                  "
                >
                  {categoryName ||
                    'Uncategorized'}
                </p>

                <h1
                  className="
                    mt-5
                    max-w-4xl
                    font-serif
                    text-[clamp(2.5rem,7vw,5.7rem)]
                    font-semibold
                    leading-[0.95]
                    tracking-[-0.045em]
                  "
                >
                  {title ||
                    'Untitled Article'}
                </h1>

                <p
                  className="
                    mt-7
                    max-w-3xl
                    text-base
                    leading-8
                    text-[#121823]/65
                    sm:text-lg
                    sm:leading-9
                  "
                >
                  {excerpt ||
                    'Your article excerpt will appear here.'}
                </p>

                <div
                  className="
                    mt-8
                    flex
                    flex-wrap
                    items-center
                    gap-x-5
                    gap-y-3
                    border-y
                    border-[#121823]/10
                    py-4
                    text-xs
                    font-medium
                    text-[#121823]/50
                  "
                >
                  <span>
                    The Filipino Critic
                  </span>

                  <span
                    className="
                      hidden
                      h-1
                      w-1
                      rounded-full
                      bg-[#121823]/25
                      sm:block
                    "
                  />

                  <span
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <CalendarDays
                      size={13}
                    />

                    {
                      publishDate
                    }
                  </span>

                  <span
                    className="
                      hidden
                      h-1
                      w-1
                      rounded-full
                      bg-[#121823]/25
                      sm:block
                    "
                  />

                  <span
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Clock3
                      size={13}
                    />

                    {
                      readingTimeMinutes
                    }{' '}
                    min read
                  </span>
                </div>
              </div>

              {featuredImage ? (
                <figure
                  className="
                    mt-10
                    sm:mt-14
                  "
                >
                  <div
                    className="
                      overflow-hidden
                      rounded-[22px]
                      bg-[#ECE7DD]
                    "
                  >
                    <img
                      src={
                        featuredImage
                      }
                      alt={
                        imageAlt ||
                        title ||
                        'Article featured image'
                      }
                      className="
                        aspect-[16/9]
                        w-full
                        object-cover
                      "
                    />
                  </div>

                  {imageAlt && (
                    <figcaption
                      className="
                        mt-3
                        text-xs
                        leading-5
                        text-[#121823]/45
                      "
                    >
                      {
                        imageAlt
                      }
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div
                  className="
                    mt-10
                    flex
                    aspect-[16/9]
                    items-center
                    justify-center
                    rounded-[22px]
                    border
                    border-dashed
                    border-[#121823]/15
                    bg-[#ECE7DD]
                    text-sm
                    text-[#121823]/35
                    sm:mt-14
                  "
                >
                  No featured image selected
                </div>
              )}

              <div
                className="
                  mx-auto
                  mt-12
                  max-w-3xl
                  sm:mt-16
                "
              >
                {sections.length >
                0 ? (
                  <div
                    className="
                      space-y-12
                    "
                  >
                    {sections.map(
                      (
                        section,
                        sectionIndex,
                      ) => (
                        <ArticleSectionPreview
                          key={
                            sectionIndex
                          }
                          section={
                            section
                          }
                          isFirst={
                            sectionIndex ===
                            0
                          }
                        />
                      ),
                    )}
                  </div>
                ) : (
                  <p
                    className="
                      text-base
                      leading-8
                      text-[#121823]/50
                    "
                  >
                    Start writing your article to see the content preview.
                  </p>
                )}

                {sources.length >
                  0 && (
                  <section
                    className="
                      mt-16
                      border-t
                      border-[#121823]/10
                      pt-8
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-[#AD2730]
                      "
                    >
                      Sources & References
                    </p>

                    <div
                      className="
                        mt-5
                        space-y-3
                      "
                    >
                      {sources.map(
                        (
                          source,
                          index,
                        ) => {
                          if (
                            !source.label.trim() &&
                            !source.url.trim()
                          ) {
                            return null
                          }

                          return (
                            <a
                              key={
                                index
                              }
                              href={
                                source.url ||
                                undefined
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="
                                group
                                flex
                                items-start
                                justify-between
                                gap-4
                                rounded-[16px]
                                border
                                border-[#121823]/10
                                bg-white/35
                                px-4
                                py-4
                                !text-[#121823]
                                transition
                                hover:border-[#AD2730]/30
                                hover:bg-white/55
                              "
                            >
                              <div
                                className="
                                  min-w-0
                                "
                              >
                                <p
                                  className="
                                    text-sm
                                    font-semibold
                                  "
                                >
                                  {source.label ||
                                    'Source'}
                                </p>

                                <p
                                  className="
                                    mt-1
                                    truncate
                                    text-xs
                                    text-[#121823]/45
                                  "
                                >
                                  {
                                    source.url
                                  }
                                </p>
                              </div>

                              <ExternalLink
                                size={14}
                                className="
                                  mt-1
                                  shrink-0
                                  text-[#121823]/30
                                  transition
                                  group-hover:text-[#AD2730]
                                "
                              />
                            </a>
                          )
                        },
                      )}
                    </div>
                  </section>
                )}

                <footer
                  className="
                    mt-16
                    border-t
                    border-[#121823]/10
                    pt-8
                  "
                >
                  <p
                    className="
                      font-serif
                      text-xl
                      font-semibold
                    "
                  >
                    The Filipino Critic
                  </p>

                  <p
                    className="
                      mt-2
                      max-w-xl
                      text-sm
                      leading-7
                      text-[#121823]/50
                    "
                  >
                    Independent commentary, public-interest discussion, and accountability-focused analysis.
                  </p>
                </footer>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

function ArticleSectionPreview({
  section,
  isFirst,
}: {
  section: PostContentSection
  isFirst: boolean
}) {
  const paragraphs =
    (
      section.paragraphs ??
      []
    ).filter(
      (paragraph) =>
        paragraph.trim(),
    )

  const hasHeading =
    Boolean(
      section.heading?.trim(),
    )

  const hasQuote =
    Boolean(
      section.quote?.trim(),
    )

  if (
    !hasHeading &&
    paragraphs.length ===
      0 &&
    !hasQuote
  ) {
    return null
  }

  return (
    <section>
      {hasHeading && (
        <h2
          className="
            mb-5
            font-serif
            text-2xl
            font-semibold
            leading-tight
            tracking-[-0.025em]
            sm:text-3xl
          "
        >
          {
            section.heading
          }
        </h2>
      )}

      <div
        className="
          space-y-6
        "
      >
        {paragraphs.map(
          (
            paragraph,
            index,
          ) => (
            <p
              key={
                index
              }
              className={`
                text-[17px]
                leading-[1.9]
                text-[#121823]/80

                ${
                  isFirst &&
                  index ===
                    0
                    ? 'article-preview-lead'
                    : ''
                }
              `}
            >
              {
                paragraph
              }
            </p>
          ),
        )}
      </div>

      {hasQuote && (
        <blockquote
          className="
            relative
            my-10
            border-l-[3px]
            border-[#AD2730]
            py-1
            pl-6
            font-serif
            text-2xl
            font-medium
            italic
            leading-[1.45]
            tracking-[-0.02em]
            text-[#121823]
            sm:text-3xl
          "
        >
          “{section.quote}”
        </blockquote>
      )}
    </section>
  )
}

function PreviewModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        flex
        h-8
        items-center
        gap-2
        rounded-full
        px-3
        text-[11px]
        font-semibold
        transition

        ${
          active
            ? 'bg-white text-[#121823]'
            : 'text-white/40 hover:text-white'
        }
      `}
    >
      {icon}

      {label}
    </button>
  )
}