import {
  AlertTriangle,
  FileText,
} from 'lucide-react'

import { ArticleCard } from '../components/ui/ArticleCard'
import { Footer } from '../components/layout/Footer'

import type { Article } from '../types/article'

interface ArticleListingPageProps {
  eyebrow: string
  title: string
  description: string

  articles: Article[]

  loading: boolean
  error: string | null
}

export function ArticleListingPage({
  eyebrow,
  title,
  description,
  articles,
  loading,
  error,
}: ArticleListingPageProps) {
  return (
    <>
      <main
        className="
          min-h-screen
          pb-24
          pt-36
          sm:pt-40
        "
      >
        <section className="site-container">
          <div
            className="
              max-w-4xl
            "
          >
            <p className="eyebrow">
              {eyebrow}
            </p>

            <h1
              className="
                editorial-title
                mt-4
                text-[clamp(3.4rem,8vw,7rem)]
                font-semibold
                leading-[0.9]
              "
            >
              {title}
            </h1>

            <p
              className="
                mt-6
                max-w-2xl
                text-lg
                leading-8
                text-[var(--foreground-muted)]
              "
            >
              {description}
            </p>
          </div>
        </section>

        <section
          className="
            site-container
            mt-14
            sm:mt-20
          "
        >
          {loading && (
            <LoadingGrid />
          )}

          {!loading &&
            error && (
              <ErrorState
                message={
                  error
                }
              />
            )}

          {!loading &&
            !error &&
            articles.length ===
              0 && (
              <EmptyState />
            )}

          {!loading &&
            !error &&
            articles.length >
              0 && (
              <div
                className="
                  grid
                  gap-x-6
                  gap-y-14
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {articles.map(
                  (article) => (
                    <ArticleCard
                      key={
                        article.id
                      }
                      article={
                        article
                      }
                    />
                  ),
                )}
              </div>
            )}
        </section>
      </main>

      <Footer />
    </>
  )
}

function LoadingGrid() {
  return (
    <div
      className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {Array.from({
        length: 6,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse"
          >
            <div
              className="
                aspect-[4/3]
                rounded-[28px]
                bg-[var(--foreground)]/10
              "
            />

            <div
              className="
                mt-5
                h-3
                w-28
                rounded-full
                bg-[var(--foreground)]/10
              "
            />

            <div
              className="
                mt-4
                h-8
                rounded-xl
                bg-[var(--foreground)]/10
              "
            />

            <div
              className="
                mt-2
                h-8
                w-4/5
                rounded-xl
                bg-[var(--foreground)]/10
              "
            />
          </div>
        ),
      )}
    </div>
  )
}

function ErrorState({
  message,
}: {
  message: string
}) {
  return (
    <div
      className="
        rounded-[28px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-8
        text-center
      "
    >
      <AlertTriangle
        size={22}
        className="
          mx-auto
          text-[var(--brand-red)]
        "
      />

      <h2
        className="
          editorial-title
          mt-4
          text-3xl
          font-semibold
        "
      >
        Unable to load stories.
      </h2>

      <p
        className="
          mt-3
          text-sm
          leading-7
          text-[var(--foreground-muted)]
        "
      >
        {message}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div
      className="
        rounded-[28px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-10
        text-center
      "
    >
      <FileText
        size={22}
        className="mx-auto"
      />

      <h2
        className="
          editorial-title
          mt-4
          text-3xl
          font-semibold
        "
      >
        No published stories yet.
      </h2>

      <p
        className="
          mt-3
          text-sm
          text-[var(--foreground-muted)]
        "
      >
        Published stories will
        appear here automatically.
      </p>
    </div>
  )
}