import {
  Archive,
  EyeOff,
  X,
} from 'lucide-react'

import {
  useEffect,
  type ReactNode,
} from 'react'

import type {
  PostStatus,
} from '../../types/database'

interface PublicationStateDialogProps {
  open: boolean
  title: string
  targetStatus: Extract<
    PostStatus,
    'draft' | 'archived'
  >
  mutating?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function PublicationStateDialog({
  open,
  title,
  targetStatus,
  mutating = false,
  onCancel,
  onConfirm,
}: PublicationStateDialogProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        'Escape' &&
        !mutating
      ) {
        onCancel()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    open,
    mutating,
    onCancel,
  ])

  if (!open) {
    return null
  }

  const isArchive =
    targetStatus ===
    'archived'

  const Icon =
    isArchive
      ? Archive
      : EyeOff

  const heading =
    isArchive
      ? 'Archive published article?'
      : 'Unpublish this article?'

  const actionLabel =
    isArchive
      ? 'Archive Article'
      : 'Unpublish Article'

  return (
    <div
      className="
        fixed
        inset-0
        z-[130]
        flex
        items-center
        justify-center
        bg-black/75
        p-4
        backdrop-blur-xl
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="publication-state-title"
    >
      <button
        type="button"
        aria-label="Close confirmation"
        className="
          absolute
          inset-0
          cursor-default
        "
        disabled={
          mutating
        }
        onClick={
          onCancel
        }
      />

      <section
        className="
          relative
          z-10
          w-full
          max-w-lg
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.10]
          bg-[#0d1119]/95
          shadow-2xl
          shadow-black/50
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-5
            border-b
            border-white/[0.08]
            px-6
            py-6
          "
        >
          <div
            className="
              flex
              items-start
              gap-4
            "
          >
            <span
              className="
                inline-flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-amber-400/10
                text-amber-300
              "
            >
              <Icon
                size={19}
              />
            </span>

            <div>
              <h2
                id="publication-state-title"
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                {heading}
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-white/45
                "
              >
                “{title}”
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={
              mutating
            }
            onClick={
              onCancel
            }
            className="
              inline-flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.08]
              bg-white/[0.04]
              text-white/45
              transition
              hover:bg-white/[0.08]
              hover:text-white
              disabled:opacity-40
            "
            aria-label="Close"
          >
            <X
              size={16}
            />
          </button>
        </div>

        <div
          className="
            px-6
            py-6
          "
        >
          <div
            className="
              rounded-[18px]
              border
              border-amber-300/15
              bg-amber-300/[0.05]
              p-4
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-amber-100/85
              "
            >
              Public visibility will change immediately.
            </p>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-amber-100/50
              "
            >
              {isArchive
                ? 'The article will be removed from the public website and moved to Archived. You can edit and republish it later.'
                : 'The article will be removed from the public website and returned to Draft. Its content will remain in the CMS.'}
            </p>
          </div>

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              rounded-[16px]
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-4
              py-3
              text-sm
            "
          >
            <span
              className="
                text-white/40
              "
            >
              Status change
            </span>

            <span
              className="
                font-semibold
                text-white/75
              "
            >
              Published → {isArchive
                ? 'Archived'
                : 'Draft'}
            </span>
          </div>
        </div>

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-white/[0.08]
            bg-black/15
            px-6
            py-5
          "
        >
          <DialogButton
            disabled={
              mutating
            }
            onClick={
              onCancel
            }
          >
            Keep Published
          </DialogButton>

          <button
            type="button"
            disabled={
              mutating
            }
            onClick={
              onConfirm
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              rounded-full
              bg-amber-500
              px-5
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-amber-400
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {mutating
              ? 'Updating...'
              : actionLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

function DialogButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={
        disabled
      }
      onClick={
        onClick
      }
      className="
        inline-flex
        h-11
        items-center
        justify-center
        rounded-full
        border
        border-white/[0.10]
        bg-white/[0.04]
        px-5
        text-sm
        font-semibold
        text-white/65
        transition
        hover:bg-white/[0.08]
        hover:text-white
        disabled:opacity-40
      "
    >
      {children}
    </button>
  )
}
