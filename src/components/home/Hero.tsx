import {
  ArrowDown,
  ArrowUpRight,
  Quote,
} from 'lucide-react'

import { motion } from 'motion/react'

export function Hero() {
  return (
    <section
      className="
        relative
        flex
        min-h-screen
        items-center
        overflow-hidden
        pb-14
        pt-32
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 0.08,
          scale: 1,
        }}
        transition={{
          delay: 0.25,
          duration: 1.4,
        }}
        className="
          pointer-events-none
          absolute
          -left-24
          top-24
          h-[420px]
          w-[420px]
          rounded-full
          bg-[var(--brand-red)]
          blur-[120px]
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.85,
        }}
        animate={{
          opacity: 0.06,
          scale: 1,
        }}
        transition={{
          delay: 0.35,
          duration: 1.5,
        }}
        className="
          pointer-events-none
          absolute
          -right-20
          bottom-10
          h-[520px]
          w-[520px]
          rounded-full
          bg-[var(--foreground)]
          blur-[150px]
        "
      />

      <div className="site-container relative z-10">
        <div
          className="
            grid
            items-center
            gap-12
            lg:grid-cols-[1.15fr_0.85fr]
          "
        >
          <div>
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
                filter: 'blur(8px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              transition={{
                delay: 0.05,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-3.5
                py-2
                backdrop-blur-xl
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[var(--brand-red)]
                "
              />

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[var(--foreground-muted)]
                "
              >
                Independent digital commentary
              </span>
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 40,
                filter: 'blur(12px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              transition={{
                delay: 0.14,
                duration: 0.95,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                editorial-title
                max-w-[900px]
                text-[clamp(4rem,9vw,8.5rem)]
                font-semibold
                leading-[0.82]
              "
            >
              Think.

              <br />

              <motion.span
                initial={{
                  opacity: 0,
                  x: -18,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.32,
                  duration: 0.65,
                }}
                className="text-[var(--brand-red)]"
              >
                Question.
              </motion.span>

              <br />

              Critique.
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.34,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-8
                max-w-2xl
                text-base
                leading-8
                text-[var(--foreground-muted)]
                sm:text-lg
              "
            >
              Exploring Philippine politics,
              public issues, accountability and
              the stories shaping our society —
              with context beyond the headline.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.46,
                duration: 0.7,
              }}
              className="
                mt-9
                flex
                flex-wrap
                gap-3
              "
            >
              <a
                href="#latest"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[var(--foreground)]
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  !text-[var(--background)]
                  transition
                  duration-300
                  hover:-translate-y-0.5
                "
              >
                Explore latest

                <ArrowDown size={16} />
              </a>

              <a
                href="https://www.facebook.com/TheFilipinoCritic"
                target="_blank"
                rel="noreferrer"
                className="
                  liquid-glass
                  flex
                  items-center
                  gap-2
                  rounded-full
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  transition
                  duration-300
                  hover:-translate-y-0.5
                "
              >
                Follow on Facebook

                <ArrowUpRight size={16} />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 35,
              rotate: 1.5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: 0,
            }}
            transition={{
              delay: 0.22,
              duration: 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              liquid-glass
              relative
              overflow-hidden
              rounded-[38px]
              p-4
              sm:p-5
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                bg-[var(--background-secondary)]
              "
            >
              <motion.img
                src="/images/tfc-logo.jpg"
                alt="The Filipino Critic logo"
                initial={{
                  scale: 1.08,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  aspect-square
                  h-full
                  w-full
                  object-cover
                "
              />

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.55,
                  duration: 0.7,
                }}
                className="
                  absolute
                  bottom-4
                  left-4
                  right-4
                  rounded-[22px]
                  border
                  border-white/20
                  bg-black/55
                  p-4
                  text-white
                  shadow-2xl
                  backdrop-blur-xl
                "
              >
                <Quote
                  size={18}
                  className="mb-2 text-red-400"
                />

                <p
                  className="
                    editorial-title
                    text-xl
                    leading-snug
                    sm:text-2xl
                  "
                >
                  The headline is only the
                  beginning.
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-white/60
                  "
                >
                  The Filipino Critic
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.85,
            duration: 0.65,
          }}
          className="
            mt-14
            hidden
            items-center
            gap-3
            text-xs
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[var(--foreground-muted)]
            md:flex
          "
        >
          <span
            className="
              h-px
              w-10
              bg-[var(--border)]
            "
          />

          Scroll to explore
        </motion.div>
      </div>
    </section>
  )
}