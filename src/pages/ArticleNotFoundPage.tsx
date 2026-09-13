import {
  ArrowLeft,
  SearchX,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Footer } from '../components/layout/Footer'

export function ArticleNotFoundPage() {
  return (
    <>
      <main
        className="
          flex
          min-h-[80vh]
          items-center
          justify-center
          px-6
          pb-20
          pt-40
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-[var(--surface)]
              text-[var(--brand-red)]
            "
          >
            <SearchX size={25} />
          </div>

          <p className="eyebrow mt-7">
            Article not found
          </p>

          <h1
            className="
              editorial-title
              mx-auto
              mt-4
              max-w-3xl
              text-5xl
              font-semibold
              leading-[0.95]
              sm:text-7xl
            "
          >
            This story may have moved or does not exist.
          </h1>

          <p
            className="
              mx-auto
              mt-6
              max-w-xl
              leading-7
              text-[var(--foreground-muted)]
            "
          >
            Check the URL or return to the homepage to browse the latest stories.
          </p>

          <Link
            to="/"
            className="
              mt-8
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
            "
          >
            <ArrowLeft size={15} />

            Return home
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}