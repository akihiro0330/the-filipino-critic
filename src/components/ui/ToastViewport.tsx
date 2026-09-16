import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react'

import {
  AnimatePresence,
  motion,
} from 'motion/react'

import {
  useToast,
  type ToastItem,
} from '../../context/ToastContext'

export function ToastViewport() {
  const {
    toasts,
    dismissToast,
  } = useToast()

  return (
    <div
      className="
        pointer-events-none
        fixed
        bottom-4
        right-4
        z-[500]
        flex
        w-[calc(100%-2rem)]
        max-w-[390px]
        flex-col
        gap-3
        sm:bottom-6
        sm:right-6
      "
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence
        initial={false}
      >
        {toasts.map(
          (toast) => (
            <ToastCard
              key={
                toast.id
              }
              toast={
                toast
              }
              onDismiss={() =>
                dismissToast(
                  toast.id,
                )
              }
            />
          ),
        )}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: () => void
}) {
  const appearance =
    getAppearance(
      toast.type,
    )

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        x: 24,
        scale: 0.97,
      }}
      transition={{
        duration: 0.22,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        pointer-events-auto
        relative
        overflow-hidden
        rounded-[20px]
        border
        border-white/[0.10]
        bg-[#11161f]/90
        shadow-2xl
        shadow-black/25
        backdrop-blur-3xl
      "
      role={
        toast.type ===
        'error'
          ? 'alert'
          : 'status'
      }
    >
      <div
        className="
          flex
          items-start
          gap-3
          px-4
          pb-4
          pt-4
        "
      >
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-[12px]
            border

            ${appearance.iconContainer}
          `}
        >
          {
            appearance.icon
          }
        </div>

        <div
          className="
            min-w-0
            flex-1
            pt-0.5
          "
        >
          <p
            className="
              text-sm
              font-semibold
              leading-5
              text-white
            "
          >
            {toast.title}
          </p>

          {toast.description && (
            <p
              className="
                mt-1
                text-xs
                leading-5
                text-white/45
              "
            >
              {
                toast.description
              }
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={
            onDismiss
          }
          aria-label="Dismiss notification"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            text-white/30
            transition
            hover:bg-white/[0.08]
            hover:text-white
          "
        >
          <X size={14} />
        </button>
      </div>

      {toast.duration >
        0 && (
        <motion.div
          className={`
            absolute
            bottom-0
            left-0
            h-[2px]

            ${appearance.progress}
          `}
          initial={{
            width: '100%',
          }}
          animate={{
            width: '0%',
          }}
          transition={{
            duration:
              toast.duration /
              1000,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  )
}

function getAppearance(
  type: ToastItem['type'],
) {
  switch (type) {
    case 'success':
      return {
        icon: (
          <CheckCircle2
            size={17}
          />
        ),

        iconContainer:
          'border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300',

        progress:
          'bg-emerald-400',
      }

    case 'error':
      return {
        icon: (
          <XCircle
            size={17}
          />
        ),

        iconContainer:
          'border-red-400/20 bg-red-400/[0.08] text-red-300',

        progress:
          'bg-red-400',
      }

    case 'warning':
      return {
        icon: (
          <AlertTriangle
            size={17}
          />
        ),

        iconContainer:
          'border-amber-400/20 bg-amber-400/[0.08] text-amber-300',

        progress:
          'bg-amber-400',
      }

    case 'info':
    default:
      return {
        icon: (
          <Info
            size={17}
          />
        ),

        iconContainer:
          'border-sky-400/20 bg-sky-400/[0.08] text-sky-300',

        progress:
          'bg-sky-400',
      }
  }
}