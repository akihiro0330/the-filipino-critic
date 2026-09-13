import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop

      const scrollHeight =
        document.documentElement.scrollHeight -
        window.innerHeight

      if (scrollHeight <= 0) {
        setProgress(0)
        return
      }

      const nextProgress =
        (scrollTop / scrollHeight) * 100

      setProgress(
        Math.min(
          100,
          Math.max(0, nextProgress),
        ),
      )
    }

    updateProgress()

    window.addEventListener(
      'scroll',
      updateProgress,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      updateProgress,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        updateProgress,
      )

      window.removeEventListener(
        'resize',
        updateProgress,
      )
    }
  }, [])

  return (
    <div
      className="
        pointer-events-none
        fixed
        left-0
        right-0
        top-0
        z-[100]
        h-[3px]
        bg-transparent
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
          h-full
          bg-[var(--brand-red)]
          shadow-[0_0_16px_rgba(173,39,48,0.3)]
        "
      />
    </div>
  )
}