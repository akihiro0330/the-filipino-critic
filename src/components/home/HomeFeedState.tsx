import {
  AlertTriangle,
  FileText,
  RefreshCw,
} from 'lucide-react'

interface HomeFeedLoadingProps {
  cards?: number
}

export function HomeFeedLoading({
  cards = 6,
}: HomeFeedLoadingProps) {
  return (
    <section
      className="
        py-24
        sm:py-32
      "
    >
      <div className="site-container">
        <div
          className="
            animate-pulse
          "
        >
          <div
            className="
              h-3
              w-20
              rounded-full
              bg-[var(--foreground)]/10
            "
          />

          <div
            className="
              mt-5
              h-12
              max-w-md
              rounded-2xl
              bg-[var(--foreground)]/10
            "
          />

          <div
            className="
              mt-12
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {Array.from({
              length: cards,
            }).map((_, index) => (
              <div
                key={index}
              >
                <div
                  className="
                    aspect-[4/3]
                    rounded-[28px]
                    bg-[var(--foreground)]/10
                  "
                />

                <div
                  className="
                    mt-5
                    h-3
                    w-32
                    rounded-full
                    bg-[var(--foreground)]/10
                  "
                />

                <div
                  className="
                    mt-4
                    h-8
                    rounded-xl
                    bg-[var(--foreground)]/10
                  "
                />

                <div
                  className="
                    mt-2
                    h-8
                    w-4/5
                    rounded-xl
                    bg-[var(--foreground)]/10
                  "
                />

                <div
                  className="
                    mt-4
                    h-4
                    rounded-lg
                    bg-[var(--foreground)]/10
                  "
                />

                <div
                  className="
                    mt-2
                    h-4
                    w-3/4
                    rounded-lg
                    bg-[var(--foreground)]/10
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface HomeFeedErrorProps {
  message: string
  onRetry: () => void
}

export function HomeFeedError({
  message,
  onRetry,
}: HomeFeedErrorProps) {
  return (
    <section
      className="
        py-24
        sm:py-32
      "
    >
      <div className="site-container">
        <div
          className="
            mx-auto
            max-w-2xl
            rounded-[32px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-8
            text-center
            backdrop-blur-2xl
            sm:p-12
          "
        >
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-[var(--brand-red)]/10
              text-[var(--brand-red)]
            "
          >
            <AlertTriangle
              size={20}
            />
          </div>

          <p
            className="
              eyebrow
              mt-6
            "
          >
            Unable to load stories
          </p>

          <h2
            className="
              editorial-title
              mt-3
              text-3xl
              font-semibold
              sm:text-4xl
            "
          >
            We could not reach the publication feed.
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-lg
              text-sm
              leading-7
              text-[var(--foreground-muted)]
            "
          >
            {message}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[var(--foreground)]
              px-5
              py-3
              text-sm
              font-semibold
              text-[var(--background)]
              transition
              hover:-translate-y-0.5
            "
          >
            <RefreshCw
              size={15}
            />

            Try again
          </button>
        </div>
      </div>
    </section>
  )
}

export function HomeFeedEmpty() {
  return (
    <section
      className="
        py-24
        sm:py-32
      "
    >
      <div className="site-container">
        <div
          className="
            mx-auto
            max-w-2xl
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--surface)]
            "
          >
            <FileText
              size={19}
            />
          </div>

          <p
            className="
              eyebrow
              mt-6
            "
          >
            Publication
          </p>

          <h2
            className="
              editorial-title
              mt-3
              text-4xl
              font-semibold
              sm:text-5xl
            "
          >
            No stories published yet.
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-lg
              leading-7
              text-[var(--foreground-muted)]
            "
          >
            Published articles will appear
            here automatically once they are
            released through The Filipino
            Critic administration system.
          </p>
        </div>
      </div>
    </section>
  )
}