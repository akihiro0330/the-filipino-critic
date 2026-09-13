import { Link } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({
  title,
}: PlaceholderPageProps) {
  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        px-6
        pt-28
      "
    >
      <div className="text-center">
        <p className="eyebrow">
          The Filipino Critic
        </p>

        <h1
          className="
            editorial-title
            mt-4
            text-5xl
            font-semibold
            sm:text-7xl
          "
        >
          {title}
        </h1>

        <p
          className="
            mx-auto
            mt-5
            max-w-lg
            text-[var(--foreground-muted)]
          "
        >
          We're preparing this section as part of the
          next stage of development.
        </p>

        <Link
          to="/"
          className="
            mt-8
            inline-flex
            rounded-full
            bg-[var(--foreground)]
            px-5
            py-3
            text-sm
            font-semibold
            text-[var(--background)]
          "
        >
          Return home
        </Link>
      </div>
    </main>
  )
}