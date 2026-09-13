import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import type { Article } from '../../types/article'
import { ArticleCard } from '../ui/ArticleCard'

interface LatestStoriesProps {
  articles: Article[]
}

export function LatestStories({
  articles,
}: LatestStoriesProps) {
  return (
    <section
      id="latest"
      className="
        py-24
        sm:py-32
      "
    >
      <div className="site-container">
        <div
          className="
            mb-10
            flex
            items-end
            justify-between
            gap-6
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
              Latest
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
              Latest stories
            </h2>
          </motion.div>

          <Link
            to="/latest"
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
            View all

            <ArrowRight size={16} />
          </Link>
        </div>

        <div
          className="
            grid
            gap-x-6
            gap-y-12
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {articles.slice(0, 6).map(
            (article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ),
          )}
        </div>
      </div>
    </section>
  )
}