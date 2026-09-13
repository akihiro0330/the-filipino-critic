import {
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import type { Article } from '../../types/article'

interface TrendingStoriesProps {
  articles: Article[]
}

export function TrendingStories({
  articles,
}: TrendingStoriesProps) {
  const trending = articles
    .filter(
      (article) =>
        article.trendingRank !== undefined,
    )
    .sort(
      (a, b) =>
        (a.trendingRank ?? 999) -
        (b.trendingRank ?? 999),
    )

  return (
    <section
      className="
        border-y
        border-[var(--border)]
        py-24
      "
    >
      <div className="site-container">
        <div
          className="
            grid
            gap-12
            lg:grid-cols-[0.7fr_1.3fr]
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-[var(--brand-red)]
              "
            >
              <TrendingUp size={17} />

              <span className="eyebrow">
                Trending
              </span>
            </div>

            <h2
              className="
                editorial-title
                mt-4
                text-4xl
                font-semibold
                sm:text-6xl
              "
            >
              What people
              <br />
              are reading
            </h2>

            <p
              className="
                mt-5
                max-w-md
                leading-7
                text-[var(--foreground-muted)]
              "
            >
              Stories currently drawing the most
              attention across The Filipino Critic.
            </p>
          </motion.div>

          <div>
            {trending.map(
              (article, index) => (
                <motion.div
                  key={article.id}
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.55,
                  }}
                >
                  <Link
                    to={`/article/${article.slug}`}
                    className="
                      group
                      grid
                      grid-cols-[58px_1fr_auto]
                      items-center
                      gap-4
                      border-b
                      border-[var(--border)]
                      py-7
                    "
                  >
                    <span
                      className="
                        editorial-title
                        text-4xl
                        text-[var(--foreground-muted)]
                        opacity-40
                      "
                    >
                      {String(
                        article.trendingRank,
                      ).padStart(2, '0')}
                    </span>

                    <div>
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.16em]
                          text-[var(--brand-red)]
                        "
                      >
                        {article.category}
                      </p>

                      <h3
                        className="
                          editorial-title
                          mt-2
                          text-xl
                          font-semibold
                          leading-snug
                          transition
                          group-hover:text-[var(--brand-red)]
                          sm:text-2xl
                        "
                      >
                        {article.title}
                      </h3>
                    </div>

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[var(--border)]
                        transition
                        group-hover:bg-[var(--foreground)]
                        group-hover:text-[var(--background)]
                      "
                    >
                      <ArrowUpRight size={16} />
                    </div>
                  </Link>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}