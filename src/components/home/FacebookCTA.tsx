import {
  ArrowUpRight,
  MessageCircle,
} from 'lucide-react'
import { motion } from 'motion/react'

export function FacebookCTA() {
  return (
    <section
      className="
        px-3
        pb-8
        pt-16
        sm:px-6
        sm:pb-12
      "
    >
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
        }}
        className="
          relative
          mx-auto
          max-w-[1380px]
          overflow-hidden
          rounded-[38px]
          bg-[#111722]
          px-6
          py-20
          text-white
          sm:px-10
          lg:px-16
          lg:py-28
        "
      >
        <div
          className="
            absolute
            -right-20
            -top-20
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#ad2730]/20
            blur-[120px]
          "
        />

        <div
          className="
            relative
            z-10
            grid
            gap-10
            lg:grid-cols-[1fr_auto]
            lg:items-end
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
                text-red-400
              "
            >
              <MessageCircle size={18} />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                "
              >
                Continue the discussion
              </span>
            </div>

            <h2
              className="
                editorial-title
                mt-5
                max-w-4xl
                text-[clamp(3rem,7vw,7rem)]
                font-semibold
                leading-[0.9]
              "
            >
              The conversation does not end here.
            </h2>

            <p
              className="
                mt-7
                max-w-2xl
                text-base
                leading-8
                text-white/55
              "
            >
              Follow The Filipino Critic on
              Facebook for daily commentary,
              public issues and ongoing
              discussions.
            </p>
          </div>

          <a
            href="https://www.facebook.com/TheFilipinoCritic"
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              w-fit
              items-center
              gap-3
              rounded-full
              bg-white
              px-6
              py-3.5
              text-sm
              font-semibold
              text-[#111722]
              transition
              hover:scale-[1.02]
            "
          >
            Visit Facebook

            <ArrowUpRight size={16} />
          </a>
        </div>
      </motion.div>
    </section>
  )
}