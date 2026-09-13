import type { Article } from '../../types/article'
import { ArticleCard } from '../ui/ArticleCard'

interface RelatedStoriesProps {
  articles: Article[]
}

export function RelatedStories({
  articles,
}: RelatedStoriesProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <section
      className="
        border-t
        border-[var(--border)]
        py-20
        sm:py-28
      "
    >
      <div className="site-container">
        <p className="eyebrow">
          Continue reading
        </p>

        <h2
          className="
            editorial-title
            mt-3
            text-4xl
            font-semibold
            sm:text-6xl
          "
        >
          Related stories
        </h2>

        <div
          className="
            mt-10
            grid
            gap-x-6
            gap-y-12
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {articles
            .slice(0, 3)
            .map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}
        </div>
      </div>
    </section>
  )
}