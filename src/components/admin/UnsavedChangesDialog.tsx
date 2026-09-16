import {
  AlertTriangle,
  ArrowRight,
  Save,
  X,
} from 'lucide-react'

import {
  useEffect,
} from 'react'

interface UnsavedChangesDialogProps {
  open: boolean
  onStay: () => void
  onLeave: () => void
}

export function UnsavedChangesDialog({
  open,
  onStay,
  onLeave,
}: UnsavedChangesDialogProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === 'Escape'
      ) {
        onStay()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.body.style.overflow =
        previousOverflow
    }
  }, [
    open,
    onStay,
  ])

  if (!open) {
    return null
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[300]
        flex
        items-center
        justify-center
        bg-black/65
        px-4
        py-8
        backdrop-blur-xl
      "
      role="presentation"
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onStay()
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="unsaved-title"
        aria-describedby="unsaved-description"
        className="
          relative
          w-full
          max-w-[480px]
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.10]
          bg-[#11161f]/95
          p-6
          text-white
          shadow-2xl
          backdrop-blur-3xl
          sm:p-7
        "
      >
        <button
          type="button"
          onClick={onStay}
          aria-label="Close"
          className="
            absolute
            right-5
            top-5
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-white/[0.08]
            bg-white/[0.04]
            text-white/35
            transition
            hover:bg-white/[0.08]
            hover:text-white
          "
        >
          <X size={15} />
        </button>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-[16px]
            border
            border-amber-400/20
            bg-amber-400/[0.08]
            text-amber-300
          "
        >
          <AlertTriangle
            size={21}
          />
        </div>

        <p
          className="
            mt-6
            text-[10px]
            font-bold
            uppercase
            tracking-[0.20em]
            text-amber-300
          "
        >
          Unsaved changes
        </p>

        <h2
          id="unsaved-title"
          className="
            mt-2
            text-2xl
            font-semibold
            tracking-tight
          "
        >
          Leave this article?
        </h2>

        <p
          id="unsaved-description"
          className="
            mt-3
            max-w-md
            text-sm
            leading-7
            text-white/45
          "
        >
          You have changes that
          haven't been saved.
          Leaving this page will
          permanently discard them.
        </p>

        <div
          className="
            mt-7
            flex
            flex-col-reverse
            gap-2
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={onLeave}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-red-400/15
              bg-red-500/[0.06]
              px-5
              text-sm
              font-semibold
              text-red-200
              transition
              hover:bg-red-500/[0.12]
            "
          >
            Leave without saving

            <ArrowRight
              size={14}
            />
          </button>

          <button
            type="button"
            onClick={onStay}
            autoFocus
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-full
              bg-white
              px-5
              text-sm
              font-semibold
              text-[#121823]
              transition
              hover:bg-white/90
            "
          >
            <Save size={14} />

            Keep editing
          </button>
        </div>
      </div>
    </div>
  )
}