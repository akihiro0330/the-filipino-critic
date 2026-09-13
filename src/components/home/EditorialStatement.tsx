import { motion } from 'motion/react'

export function EditorialStatement() {
  return (
    <section
      className="
        border-y
        border-[var(--border)]
        py-24
        sm:py-32
      "
    >
      <div className="site-container">
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            mx-auto
            max-w-5xl
            text-center
          "
        >
          <p className="eyebrow">
            Beyond the headline
          </p>

          <h2
            className="
              editorial-title
              mt-6
              text-[clamp(2.6rem,6vw,6rem)]
              font-semibold
              leading-[0.98]
            "
          >
            News tells you what happened.
            <span className="text-[var(--brand-red)]">
              {' '}
              Context tells you why it matters.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-8
              max-w-2xl
              text-base
              leading-8
              text-[var(--foreground-muted)]
            "
          >
            The Filipino Critic examines
            issues, statements and political
            developments with a focus on
            context, evidence and public
            accountability.
          </p>
        </motion.div>
      </div>
    </section>
  )
}