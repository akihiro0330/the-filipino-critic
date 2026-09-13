import {
  ArrowUpRight,
  Clock3,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import type { Article } from '../../types/article'

interface ArticleCardProps {
  article: Article
  large?: boolean
}

export function ArticleCard({
  article,
  large = false,
}: ArticleCardProps) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link
        to={`/article/${article.slug}`}
        className="block"
      >
        <div
          className={`
            relative
            overflow-hidden
            rounded-[28px]
            bg-[var(--background-secondary)]
            ${
              large
                ? 'aspect-[16/10]'
                : 'aspect-[4/3]'
            }
          `}
        >
          <motion.img
            src={article.image}
            alt={article.title}
            loading="lazy"
            whileHover={{
              scale: 1.035,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              h-full
              w-full
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/45
              via-transparent
              to-transparent
            "
          />

          <div
            className="
              absolute
              left-4
              top-4
              rounded-full
              border
              border-white/20
              bg-black/30
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-white
              backdrop-blur-xl
            "
          >
            {article.category}
          </div>

          <div
            className="
              absolute
              bottom-4
              right-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-white/15
              text-white
              opacity-0
              backdrop-blur-xl
              transition
              duration-300
              group-hover:opacity-100
            "
          >
            <ArrowUpRight size={17} />
          </div>
        </div>

        <div className="pt-5">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              text-xs
              text-[var(--foreground-muted)]
            "
          >
            <span>
              {article.publishedAt}
            </span>

            <span>
              •
            </span>

            <span
              className="
                flex
                items-center
                gap-1
              "
            >
              <Clock3 size={13} />

              {article.readingTime}
            </span>
          </div>

          <h3
            className={`
              editorial-title
              mt-3
              font-semibold
              leading-tight
              transition-colors
              duration-300
              group-hover:text-[var(--brand-red)]
              ${
                large
                  ? 'text-3xl sm:text-4xl'
                  : 'text-2xl'
              }
            `}
          >
            {article.title}
          </h3>

          <p
            className="
              mt-3
              line-clamp-3
              text-sm
              leading-7
              text-[var(--foreground-muted)]
            "
          >
            {article.excerpt}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}