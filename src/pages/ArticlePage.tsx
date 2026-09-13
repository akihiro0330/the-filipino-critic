import {
  ArrowLeft,
  Clock3,
  LoaderCircle,
} from 'lucide-react'

import {
  motion,
} from 'motion/react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  useEffect,
} from 'react'

import { ArticleShare } from '../components/article/ArticleShare'
import { ArticleSources } from '../components/article/ArticleSources'
import { BackToTop } from '../components/article/BackToTop'
import { ReadingProgress } from '../components/article/ReadingProgress'
import { RelatedStories } from '../components/article/RelatedStories'
import { Footer } from '../components/layout/Footer'

import { usePublishedArticle } from '../hooks/usePublishedArticle'
import { usePublishedArticles } from '../hooks/usePublishedArticles'

import { ArticleNotFoundPage } from './ArticleNotFoundPage'

export function ArticlePage() {
  const {
    slug,
  } = useParams<{
    slug: string
  }>()

  const {
    article,
    loading,
    error,
  } =
    usePublishedArticle(
      slug,
    )

  const {
    articles:
      allArticles,
  } =
    usePublishedArticles()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [slug])

  useEffect(() => {
    if (!article) {
      return
    }

    document.title =
      `${article.title} | The Filipino Critic`

    return () => {
      document.title =
        'The Filipino Critic'
    }
  }, [article])

  if (loading) {
    return (
      <>
        <main
          className="
            flex
            min-h-screen
            items-center
            justify-center
            px-6
          "
        >
          <div
            className="
              text-center
            "
          >
            <LoaderCircle
              className="
                mx-auto
                animate-spin
                text-[var(--brand-red)]
              "
              size={26}
            />

            <p
              className="
                eyebrow
                mt-5
              "
            >
              Loading story
            </p>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <main
          className="
            flex
            min-h-screen
            items-center
            justify-center
            px-6
          "
        >
          <div
            className="
              max-w-xl
              text-center
            "
          >
            <p className="eyebrow">
              Unable to load article
            </p>

            <h1
              className="
                editorial-title
                mt-4
                text-5xl
                font-semibold
              "
            >
              Something went wrong.
            </h1>

            <p
              className="
                mt-5
                leading-7
                text-[var(--foreground-muted)]
              "
            >
              {error}
            </p>

            <Link
              to="/"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[var(--foreground)]
                px-5
                py-3
                text-sm
                font-semibold
                text-[var(--background)]
              "
            >
              <ArrowLeft
                size={15}
              />

              Return home
            </Link>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  if (!article) {
    return (
      <ArticleNotFoundPage />
    )
  }

  const relatedArticles =
    allArticles
      .filter(
        (item) =>
          item.id !==
            article.id &&
          item.category ===
            article.category,
      )
      .slice(
        0,
        3,
      )

  const fallbackRelated =
    relatedArticles.length >
    0
      ? relatedArticles
      : allArticles
          .filter(
            (item) =>
              item.id !==
              article.id,
          )
          .slice(
            0,
            3,
          )

  return (
    <>
      <ReadingProgress />

      <main>
        <article>
          <header
            className="
              pb-14
              pt-36
              sm:pb-20
              sm:pt-40
            "
          >
            <div className="site-container">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration:
                    0.65,
                }}
                className="max-w-5xl"
              >
                <Link
                  to="/"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-[var(--foreground-muted)]
                    transition
                    hover:text-[var(--foreground)]
                  "
                >
                  <ArrowLeft
                    size={15}
                  />

                  Back to stories
                </Link>

                <p
                  className="
                    eyebrow
                    mt-10
                  "
                >
                  {
                    article.category
                  }
                </p>

                <h1
                  className="
                    editorial-title
                    mt-5
                    max-w-6xl
                    text-[clamp(3.4rem,8vw,8rem)]
                    font-semibold
                    leading-[0.88]
                  "
                >
                  {
                    article.title
                  }
                </h1>

                <p
                  className="
                    mt-8
                    max-w-3xl
                    text-lg
                    leading-8
                    text-[var(--foreground-muted)]
                    sm:text-xl
                    sm:leading-9
                  "
                >
                  {
                    article.excerpt
                  }
                </p>

                <div
                  className="
                    mt-8
                    flex
                    flex-wrap
                    items-center
                    gap-x-4
                    gap-y-2
                    text-sm
                    text-[var(--foreground-muted)]
                  "
                >
                  <span
                    className="
                      font-semibold
                      text-[var(--foreground)]
                    "
                  >
                    {
                      article.author
                    }
                  </span>

                  <span>
                    •
                  </span>

                  <span>
                    {
                      article.publishedAt
                    }
                  </span>

                  <span>
                    •
                  </span>

                  <span
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Clock3
                      size={
                        14
                      }
                    />

                    {
                      article.readingTime
                    }
                  </span>
                </div>

                <div className="mt-8">
                  <ArticleShare
                    title={
                      article.title
                    }
                  />
                </div>
              </motion.div>
            </div>
          </header>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale:
                0.99,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.15,
              duration:
                0.8,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="site-container"
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[26px]
                sm:rounded-[38px]
              "
            >
              <img
                src={
                  article.image
                }
                alt={
                  article.imageAlt ??
                  article.title
                }
                className="
                  aspect-[16/9]
                  min-h-[300px]
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/20
                  via-transparent
                  to-transparent
                "
              />
            </div>
          </motion.div>

          <div
            className="
              site-container
              grid
              gap-12
              py-16
              lg:grid-cols-[minmax(0,760px)_minmax(220px,1fr)]
              lg:justify-between
              lg:py-24
            "
          >
            <div>
              <div
                className="
                  article-content
                  text-[1.06rem]
                  leading-[1.9]
                  text-[var(--foreground)]
                  sm:text-[1.12rem]
                "
              >
                {article.sections?.map(
                  (
                    section,
                    sectionIndex,
                  ) => (
                    <section
                      key={`${article.id}-${sectionIndex}`}
                      className={
                        sectionIndex ===
                        0
                          ? ''
                          : 'mt-12'
                      }
                    >
                      {section.heading && (
                        <h2
                          className="
                            editorial-title
                            mb-5
                            text-3xl
                            font-semibold
                            leading-tight
                            sm:text-4xl
                          "
                        >
                          {
                            section.heading
                          }
                        </h2>
                      )}

                      {section.paragraphs?.map(
                        (
                          paragraph,
                          paragraphIndex,
                        ) => (
                          <p
                            key={`${sectionIndex}-${paragraphIndex}`}
                            className={`
                              mb-6
                              text-[var(--foreground-muted)]
                              ${
                                sectionIndex ===
                                  0 &&
                                paragraphIndex ===
                                  0
                                  ? 'article-lead'
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

                      {section.quote && (
                        <blockquote
                          className="
                            relative
                            my-12
                            border-l-[3px]
                            border-[var(--brand-red)]
                            pl-6
                            sm:pl-8
                          "
                        >
                          <span
                            className="
                              absolute
                              -top-6
                              left-5
                              font-serif
                              text-7xl
                              leading-none
                              text-[var(--brand-red)]
                              opacity-15
                            "
                          >
                            “
                          </span>

                          <p
                            className="
                              editorial-title
                              relative
                              text-3xl
                              font-semibold
                              leading-[1.15]
                              sm:text-4xl
                            "
                          >
                            {
                              section.quote
                            }
                          </p>
                        </blockquote>
                      )}
                    </section>
                  ),
                )}
              </div>

              <ArticleSources
                sources={
                  article.sources ??
                  []
                }
              />

              <div
                className="
                  mt-12
                  rounded-[28px]
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-6
                  backdrop-blur-xl
                  sm:p-8
                "
              >
                <p className="eyebrow">
                  Share the story
                </p>

                <h3
                  className="
                    editorial-title
                    mt-3
                    text-3xl
                    font-semibold
                  "
                >
                  Keep the discussion
                  going.
                </h3>

                <p
                  className="
                    mt-3
                    max-w-xl
                    leading-7
                    text-[var(--foreground-muted)]
                  "
                >
                  If this article
                  helped add context
                  to the discussion,
                  share it with
                  others who may find
                  it useful.
                </p>

                <div className="mt-6">
                  <ArticleShare
                    title={
                      article.title
                    }
                  />
                </div>
              </div>
            </div>

            <aside
              className="
                hidden
                lg:block
              "
            >
              <div
                className="
                  sticky
                  top-32
                  rounded-[28px]
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-6
                  backdrop-blur-xl
                "
              >
                <p className="eyebrow">
                  Article
                </p>

                <div
                  className="
                    mt-5
                    space-y-5
                    text-sm
                  "
                >
                  <ArticleMeta
                    label="Category"
                    value={
                      article.category
                    }
                  />

                  <ArticleMeta
                    label="Published"
                    value={
                      article.publishedAt
                    }
                  />

                  <ArticleMeta
                    label="Reading time"
                    value={
                      article.readingTime
                    }
                  />

                  <ArticleMeta
                    label="Author"
                    value={
                      article.author
                    }
                  />
                </div>
              </div>
            </aside>
          </div>
        </article>

        <RelatedStories
          articles={
            fallbackRelated
          }
        />
      </main>

      <Footer />

      <BackToTop />
    </>
  )
}

interface ArticleMetaProps {
  label: string
  value: string
}

function ArticleMeta({
  label,
  value,
}: ArticleMetaProps) {
  return (
    <div>
      <p
        className="
          text-xs
          uppercase
          tracking-[0.14em]
          text-[var(--foreground-muted)]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          font-semibold
        "
      >
        {value}
      </p>
    </div>
  )
}