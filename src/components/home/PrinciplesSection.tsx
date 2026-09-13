import {
  BookOpen,
  Eye,
  Scale,
} from 'lucide-react'
import { motion } from 'motion/react'

const principles = [
  {
    icon: BookOpen,
    number: '01',
    title: 'Context',
    description:
      'A headline alone is rarely enough. We look at the background, timeline and wider implications.',
  },
  {
    icon: Eye,
    number: '02',
    title: 'Evidence',
    description:
      'Claims should be examined against credible sources, official records and verifiable information.',
  },
  {
    icon: Scale,
    number: '03',
    title: 'Accountability',
    description:
      'Public officials and institutions should be evaluated consistently regardless of political affiliation.',
  },
]

export function PrinciplesSection() {
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
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="
            mb-12
            max-w-3xl
          "
        >
          <p className="eyebrow">
            Editorial principles
          </p>

          <h2
            className="
              editorial-title
              mt-4
              text-[clamp(2.8rem,6vw,6rem)]
              font-semibold
              leading-[0.96]
            "
          >
            Criticism should have
            <span className="text-[var(--brand-red)]">
              {' '}
              standards.
            </span>
          </h2>
        </motion.div>

        <div
          className="
            grid
            gap-5
            lg:grid-cols-3
          "
        >
          {principles.map(
            ({
              icon: Icon,
              number,
              title,
              description,
            }) => (
              <motion.div
                key={title}
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
                }}
                transition={{
                  duration: 0.65,
                }}
                className="
                  liquid-glass
                  rounded-[30px]
                  p-7
                  sm:p-8
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--foreground)]
                      text-[var(--background)]
                    "
                  >
                    <Icon size={18} />
                  </div>

                  <span
                    className="
                      editorial-title
                      text-4xl
                      text-[var(--foreground-muted)]
                      opacity-20
                    "
                  >
                    {number}
                  </span>
                </div>

                <h3
                  className="
                    editorial-title
                    mt-14
                    text-3xl
                    font-semibold
                  "
                >
                  {title}
                </h3>

                <p
                  className="
                    mt-4
                    leading-7
                    text-[var(--foreground-muted)]
                  "
                >
                  {description}
                </p>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}