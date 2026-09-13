import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import type {
  Article,
  ArticleCategory,
} from '../../types/article'
import { ArticleCard } from '../ui/ArticleCard'

interface CategorySectionProps {
  title: string
  category: ArticleCategory
  articles: Article[]
  route: string
}

export function CategorySection({
  title,
  category,
  articles,
  route,
}: CategorySectionProps) {
  const filteredArticles =
    articles.filter(
      (article) =>
        article.category === category,
    )

  if (filteredArticles.length === 0) {
    return null
  }

  return (
    <section
      className="
        py-24
        sm:py-28
      "
    >
      <div className="site-container">
        <div
          className="
            mb-10
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <p className="eyebrow">
              Section
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
              {title}
            </h2>
          </motion.div>

          <Link
            to={route}
            className="
              hidden
              items-center
              gap-2
              text-sm
              font-semibold
              transition
              hover:text-[var(--brand-red)]
              sm:flex
            "
          >
            Explore section

            <ArrowRight size={16} />
          </Link>
        </div>

        <div
          className="
            grid
            gap-8
            lg:grid-cols-2
          "
        >
          {filteredArticles
            .slice(0, 2)
            .map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                large
              />
            ))}
        </div>
      </div>
    </section>
  )
}