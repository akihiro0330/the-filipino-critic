import { ArrowUp } from 'lucide-react'
import {
  AnimatePresence,
  motion,
} from 'motion/react'
import { useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 700)
    }

    handleScroll()

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      },
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      )
    }
  }, [])

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          initial={{
            opacity: 0,
            y: 12,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 12,
            scale: 0.9,
          }}
          className="
            liquid-glass
            fixed
            bottom-5
            right-5
            z-40
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            sm:bottom-7
            sm:right-7
          "
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
