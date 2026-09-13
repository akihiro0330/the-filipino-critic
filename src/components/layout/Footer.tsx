import {
  ArrowUpRight,
} from 'lucide-react'
import {
  Link,
} from 'react-router-dom'

export function Footer() {
  const year =
    new Date().getFullYear()

  return (
    <footer
      className="
        border-t
        border-[var(--border)]
        py-10
      "
    >
      <div className="site-container">
        <div
          className="
            grid
            gap-10
            md:grid-cols-[1fr_auto]
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <img
                src="/images/tfc-logo.jpg"
                alt="The Filipino Critic"
                className="
                  h-11
                  w-11
                  rounded-full
                  object-cover
                "
              />

              <div>
                <p
                  className="
                    editorial-title
                    text-lg
                    font-semibold
                  "
                >
                  The Filipino Critic
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--foreground-muted)]
                  "
                >
                  Perspective. Context.
                  Accountability.
                </p>
              </div>
            </div>

            <p
              className="
                mt-5
                max-w-md
                text-sm
                leading-7
                text-[var(--foreground-muted)]
              "
            >
              Independent digital commentary
              on Philippine politics, public
              affairs and accountability.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-x-12
              gap-y-3
              text-sm
            "
          >
            <Link
              to="/latest"
              className="
                text-[var(--foreground-muted)]
                hover:text-[var(--foreground)]
              "
            >
              Latest
            </Link>

            <Link
              to="/category/politics"
              className="
                text-[var(--foreground-muted)]
                hover:text-[var(--foreground)]
              "
            >
              Politics
            </Link>

            <Link
              to="/category/issues"
              className="
                text-[var(--foreground-muted)]
                hover:text-[var(--foreground)]
              "
            >
              Public Issues
            </Link>

            <Link
              to="/category/opinion"
              className="
                text-[var(--foreground-muted)]
                hover:text-[var(--foreground)]
              "
            >
              Opinion
            </Link>

            <Link
              to="/category/accountability"
              className="
                text-[var(--foreground-muted)]
                hover:text-[var(--foreground)]
              "
            >
              Accountability
            </Link>

            <a
              href="https://www.facebook.com/TheFilipinoCritic"
              target="_blank"
              rel="noreferrer"
              className="
                flex
                items-center
                gap-2
                font-semibold
              "
            >
              Facebook

              <ArrowUpRight
                size={14}
              />
            </a>
          </div>
        </div>

        <div
          className="
            mt-10
            flex
            flex-col
            gap-2
            border-t
            border-[var(--border)]
            pt-6
            text-xs
            text-[var(--foreground-muted)]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {year} The Filipino Critic.
            All rights reserved.
          </p>

          <p>
            Independent commentary and
            analysis.
          </p>
        </div>
      </div>
    </footer>
  )
}