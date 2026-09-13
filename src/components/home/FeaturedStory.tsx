import {
  ArrowRight,
  Clock3,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import type { Article } from '../../types/article'

interface FeaturedStoryProps {
  article: Article
}

export function FeaturedStory({
  article,
}: FeaturedStoryProps) {
  return (
    <section
      className="
        py-24
        sm:py-32
      "
    >
      <div className="site-container">
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
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
            duration: 0.75,
          }}
          className="
            grid
            overflow-hidden
            rounded-[36px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[var(--shadow-soft)]
            backdrop-blur-3xl
            lg:grid-cols-[1.05fr_0.95fr]
          "
        >
          <div
            className="
              relative
              min-h-[420px]
              overflow-hidden
              lg:min-h-[650px]
            "
          >
            <motion.img
              src={article.image}
              alt={article.title}
              whileHover={{
                scale: 1.025,
              }}
              transition={{
                duration: 0.8,
              }}
              className="
                absolute
                inset-0
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
                from-black/50
                via-transparent
                to-transparent
              "
            />

            <div
              className="
                absolute
                left-5
                top-5
                rounded-full
                border
                border-white/20
                bg-black/30
                px-3
                py-1.5
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white
                backdrop-blur-2xl
              "
            >
              Featured Story
            </div>
          </div>

          <div
            className="
              flex
              flex-col
              justify-center
              p-7
              sm:p-10
              lg:p-14
            "
          >
            <p className="eyebrow">
              {article.category}
            </p>

            <h2
              className="
                editorial-title
                mt-5
                text-[clamp(2.7rem,5vw,5rem)]
                font-semibold
                leading-[0.98]
              "
            >
              {article.title}
            </h2>

            <p
              className="
                mt-6
                text-base
                leading-8
                text-[var(--foreground-muted)]
              "
            >
              {article.excerpt}
            </p>

            <div
              className="
                mt-7
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
                <Clock3 size={14} />

                {article.readingTime}
              </span>
            </div>

            <Link
              to={`/article/${article.slug}`}
              className="
                mt-9
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-[var(--foreground)]
                px-5
                py-3
                text-sm
                font-semibold
                text-[var(--background)]
                transition
                duration-300
                hover:-translate-y-0.5
              "
            >
              Read full story

              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}