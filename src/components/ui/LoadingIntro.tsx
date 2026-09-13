import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { AnimatePresence, motion } from 'motion/react'

interface LoadingIntroProps {
  onComplete: () => void
}

const INTRO_SESSION_KEY = 'tfc-intro-seen'

export function LoadingIntro({
  onComplete,
}: LoadingIntroProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<
    'mark' | 'brand' | 'tagline' | 'complete'
  >('mark')

  const completionCalled = useRef(false)

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
  }, [])

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(
      INTRO_SESSION_KEY,
    )

    if (alreadySeen === 'true' || reducedMotion) {
      sessionStorage.setItem(INTRO_SESSION_KEY, 'true')

      if (!completionCalled.current) {
        completionCalled.current = true
        onComplete()
      }

      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const duration = 3200
    const start = performance.now()

    let animationFrame = 0

    function animate(now: number) {
      const elapsed = now - start

      const nextProgress = Math.min(
        100,
        Math.round((elapsed / duration) * 100),
      )

      setProgress(nextProgress)

      if (nextProgress < 30) {
        setPhase('mark')
      } else if (nextProgress < 63) {
        setPhase('brand')
      } else if (nextProgress < 92) {
        setPhase('tagline')
      } else {
        setPhase('complete')
      }

      if (elapsed < duration) {
        animationFrame =
          requestAnimationFrame(animate)

        return
      }

      sessionStorage.setItem(
        INTRO_SESSION_KEY,
        'true',
      )

      window.setTimeout(() => {
        document.body.style.overflow =
          previousOverflow

        if (!completionCalled.current) {
          completionCalled.current = true
          onComplete()
        }
      }, 550)
    }

    animationFrame =
      requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)

      document.body.style.overflow =
        previousOverflow
    }
  }, [onComplete, reducedMotion])

  if (reducedMotion) {
    return null
  }

  return (
    <motion.div
      initial={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        scale: 1.02,
        filter: 'blur(8px)',
      }}
      transition={{
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="
        fixed
        inset-0
        z-[99999]
        overflow-hidden
        bg-[#0a0e16]
        text-[#f5f1e8]
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_35%,rgba(173,39,48,0.16),transparent_26%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.04),transparent_30%)]
        "
      />

      <motion.div
        animate={{
          x: ['-10%', '8%', '-6%'],
          y: ['0%', '-4%', '4%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="
          absolute
          left-[-10%]
          top-[15%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[rgba(173,39,48,0.12)]
          blur-[160px]
        "
      />

      <motion.div
        animate={{
          x: ['5%', '-8%', '6%'],
          y: ['0%', '6%', '-4%'],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="
          absolute
          bottom-[-12%]
          right-[-8%]
          h-[620px]
          w-[620px]
          rounded-full
          bg-white/[0.05]
          blur-[180px]
        "
      />

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-6
        "
      >
        <div className="w-full max-w-[980px]">
          <div
            className="
              flex
              min-h-[430px]
              flex-col
              justify-between
              sm:min-h-[520px]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white/35
                sm:text-xs
              "
            >
              <span>
                The Filipino Critic
              </span>

              <span>
                Independent Editorial Platform
              </span>
            </div>

            <div className="relative py-10">
              <AnimatePresence mode="wait">
                {phase === 'mark' && (
                  <motion.div
                    key="mark"
                    initial={{
                      opacity: 0,
                      scale: 0.75,
                      filter: 'blur(18px)',
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      filter: 'blur(0px)',
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1.07,
                      filter: 'blur(10px)',
                    }}
                    transition={{
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >
                    <motion.div
                      initial={{
                        rotate: -8,
                      }}
                      animate={{
                        rotate: 0,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="
                        relative
                        h-28
                        w-28
                        overflow-hidden
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.04]
                        p-2
                        shadow-2xl
                        backdrop-blur-2xl
                        sm:h-36
                        sm:w-36
                      "
                    >
                      <img
                        src="/images/tfc-logo.jpg"
                        alt="The Filipino Critic"
                        className="
                          h-full
                          w-full
                          rounded-full
                          object-cover
                        "
                      />
                    </motion.div>

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
                        delay: 0.15,
                        duration: 0.55,
                      }}
                      className="
                        mt-6
                        font-serif
                        text-5xl
                        font-semibold
                        tracking-[-0.06em]
                        text-white
                        sm:text-7xl
                      "
                    >
                      TFC
                    </motion.div>
                  </motion.div>
                )}

                {phase === 'brand' && (
                  <motion.div
                    key="brand"
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{
                        opacity: 0,
                        scaleX: 0,
                      }}
                      animate={{
                        opacity: 1,
                        scaleX: 1,
                      }}
                      transition={{
                        duration: 0.55,
                      }}
                      className="
                        mx-auto
                        mb-7
                        h-px
                        w-20
                        origin-center
                        bg-[var(--brand-red)]
                      "
                    />

                    <h1
                      className="
                        font-serif
                        text-[clamp(3.2rem,9vw,7.5rem)]
                        font-semibold
                        leading-[0.9]
                        tracking-[-0.055em]
                      "
                    >
                      The Filipino
                      <br />
                      <span className="text-[#c4333d]">
                        Critic
                      </span>
                    </h1>
                  </motion.div>
                )}

                {phase === 'tagline' && (
                  <motion.div
                    key="tagline"
                    initial={{
                      opacity: 0,
                      y: 22,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1.03,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      mx-auto
                      max-w-4xl
                      text-center
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.34em]
                        text-[#d54b54]
                        sm:text-xs
                      "
                    >
                      Perspective. Context.
                      Accountability.
                    </p>

                    <p
                      className="
                        mt-7
                        font-serif
                        text-[clamp(2.2rem,6vw,5rem)]
                        leading-[1.02]
                        tracking-[-0.045em]
                        text-white
                      "
                    >
                      Beyond the headline.
                    </p>

                    <p
                      className="
                        mx-auto
                        mt-5
                        max-w-2xl
                        text-sm
                        leading-7
                        text-white/45
                        sm:text-base
                      "
                    >
                      Philippine politics,
                      public affairs, context,
                      evidence and accountability.
                    </p>
                  </motion.div>
                )}

                {phase === 'complete' && (
                  <motion.div
                    key="complete"
                    initial={{
                      opacity: 0,
                      scale: 0.94,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <div
                      className="
                        h-3
                        w-3
                        rounded-full
                        bg-[#c4333d]
                        shadow-[0_0_28px_rgba(196,51,61,0.8)]
                      "
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div
                className="
                  mb-4
                  flex
                  items-end
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-white/25
                      sm:text-[10px]
                    "
                  >
                    Initializing editorial
                    experience
                  </p>
                </div>

                <motion.span
                  key={progress}
                  initial={{
                    opacity: 0.4,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="
                    font-mono
                    text-xs
                    tracking-[0.08em]
                    text-white/50
                  "
                >
                  {progress
                    .toString()
                    .padStart(3, '0')}
                  %
                </motion.span>
              </div>

              <div
                className="
                  relative
                  h-px
                  overflow-hidden
                  bg-white/10
                "
              >
                <motion.div
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.08,
                    ease: 'linear',
                  }}
                  className="
                    absolute
                    left-0
                    top-0
                    h-full
                    bg-[#b92a34]
                  "
                />
              </div>

              <div
                className="
                  mt-3
                  flex
                  justify-between
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-white/20
                "
              >
                <span>
                  Context
                </span>

                <span>
                  Evidence
                </span>

                <span>
                  Accountability
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-32
          bg-gradient-to-t
          from-black/30
          to-transparent
        "
      />
    </motion.div>
  )
}