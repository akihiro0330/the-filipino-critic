import {
  ExternalLink,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom'

import type { ThemeMode } from '../../hooks/useTheme'

interface HeaderProps {
  theme: ThemeMode
  onToggleTheme: () => void
}

const navigation = [
  {
    label: 'Home',
    to: '/',
    end: true,
  },
  {
    label: 'Latest',
    to: '/latest',
    end: true,
  },
  {
    label: 'Politics',
    to: '/category/politics',
    end: true,
  },
  {
    label: 'Issues',
    to: '/category/issues',
    end: true,
  },
  {
    label: 'Opinion',
    to: '/category/opinion',
    end: true,
  },
  {
    label: 'Accountability',
    to: '/category/accountability',
    end: true,
  },
]

export function Header({
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false)

  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className="
        pointer-events-none
        fixed
        left-0
        right-0
        top-0
        z-50
        px-3
        pt-3
        sm:px-5
        sm:pt-4
        lg:px-6
      "
    >
      <div
        className="
          pointer-events-auto
          relative
          mx-auto
          flex
          max-w-[1480px]
          items-center
          justify-between
          gap-3
          overflow-visible
          rounded-[26px]
          border
          border-white/20
          bg-white/[0.08]
          px-3
          py-2.5
          shadow-[0_18px_60px_rgba(0,0,0,0.20)]
          backdrop-blur-[28px]
          dark:border-white/[0.14]
          dark:bg-[#161a22]/70
          sm:px-4
          sm:py-3
        "
      >
        {/* subtle inner glass highlight */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[1px]
            rounded-[24px]
            border
            border-white/[0.08]
          "
        />

        {/* Brand */}
        <Link
          to="/"
          aria-label="The Filipino Critic home"
          className="
            relative
            z-10
            flex
            min-w-0
            shrink-0
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-white/20
              bg-[#F4F0E8]
              shadow-[0_5px_18px_rgba(0,0,0,0.18)]
              sm:h-11
              sm:w-11
            "
          >
            <img
              src="/images/tfc-logo.jpg"
              alt=""
              className="
                h-full
                w-full
                object-cover
              "
            />
          </div>

          <div
            className="
              hidden
              min-w-0
              md:block
            "
          >
            <p
              className="
                editorial-title
                truncate
                text-[17px]
                font-semibold
                leading-none
                text-[var(--foreground)]
                lg:text-[18px]
              "
            >
              The Filipino Critic
            </p>

            <p
              className="
                mt-1.5
                truncate
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-[var(--foreground-muted)]
                lg:text-[9px]
              "
            >
              Perspective. Context. Accountability.
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="
            relative
            z-10
            hidden
            min-w-0
            items-center
            justify-center
            gap-1
            xl:flex
          "
        >
          {navigation.map(
            ({
              label,
              to,
              end,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({
                  isActive,
                }) => {
                  const baseClasses = `
                    relative
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    whitespace-nowrap
                    rounded-full
                    px-4
                    py-2
                    text-[13px]
                    font-medium
                    leading-none
                    transition-all
                    duration-200
                    ease-out
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#AD2730]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-transparent
                  `

                  if (isActive) {
                    return `
                      ${baseClasses}
                      border
                      border-[#AD2730]/80
                      bg-[#F4F0E8]
                      !text-[#121823]
                      shadow-[0_4px_18px_rgba(0,0,0,0.15)]
                      ring-1
                      ring-white/50
                    `
                  }

                  return `
                    ${baseClasses}
                    border
                    border-transparent
                    !text-[var(--foreground)]
                    hover:border-white/10
                    hover:bg-white/[0.08]
                  `
                }}
              >
                {label}
              </NavLink>
            ),
          )}
        </nav>

        {/* Actions */}
        <div
          className="
            relative
            z-10
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.12]
              bg-white/[0.06]
              text-[var(--foreground)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-white/[0.12]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#AD2730]
              sm:h-11
              sm:w-11
            "
          >
            {theme === 'light' ? (
              <Moon size={17} />
            ) : (
              <Sun size={17} />
            )}
          </button>

          <a
            href="https://www.facebook.com/TheFilipinoCritic"
            target="_blank"
            rel="noreferrer"
            className="
              hidden
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#AD2730]
              px-5
              py-2.5
              text-[13px]
              font-semibold
              text-white
              shadow-[0_8px_24px_rgba(173,39,48,0.26)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#C6323C]
              hover:shadow-[0_12px_30px_rgba(173,39,48,0.32)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#AD2730]
              focus-visible:ring-offset-2
              lg:inline-flex
            "
          >
            Facebook

            <ExternalLink
              size={14}
              strokeWidth={2}
            />
          </a>

          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={
              mobileMenuOpen
            }
            onClick={() =>
              setMobileMenuOpen(
                (current) =>
                  !current,
              )
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.12]
              bg-white/[0.06]
              text-[var(--foreground)]
              transition
              hover:bg-white/[0.12]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#AD2730]
              sm:h-11
              sm:w-11
              xl:hidden
            "
          >
            {mobileMenuOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>
        </div>

        {/* Mobile / tablet menu */}
        {mobileMenuOpen && (
          <div
            className="
              absolute
              left-0
              right-0
              top-[calc(100%+10px)]
              z-50
              rounded-[26px]
              border
              border-white/[0.14]
              bg-[#11151d]/95
              p-3
              shadow-[0_24px_70px_rgba(0,0,0,0.38)]
              backdrop-blur-[30px]
              xl:hidden
            "
          >
            <nav
              aria-label="Mobile navigation"
              className="
                flex
                flex-col
                gap-1
              "
            >
              {navigation.map(
                ({
                  label,
                  to,
                  end,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({
                      isActive,
                    }) => {
                      const baseClasses = `
                        flex
                        min-h-12
                        items-center
                        justify-between
                        rounded-[18px]
                        px-4
                        py-3
                        text-sm
                        font-medium
                        transition
                      `

                      if (
                        isActive
                      ) {
                        return `
                          ${baseClasses}
                          bg-[#F4F0E8]
                          !text-[#121823]
                        `
                      }

                      return `
                        ${baseClasses}
                        !text-white
                        hover:bg-white/[0.08]
                      `
                    }}
                  >
                    <span>
                      {label}
                    </span>

                    <span
                      aria-hidden="true"
                      className="
                        text-xs
                        opacity-50
                      "
                    >
                      →
                    </span>
                  </NavLink>
                ),
              )}

              <a
                href="https://www.facebook.com/TheFilipinoCritic"
                target="_blank"
                rel="noreferrer"
                className="
                  mt-2
                  flex
                  min-h-12
                  items-center
                  justify-between
                  rounded-[18px]
                  bg-[#AD2730]
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#C6323C]
                "
              >
                <span>
                  Facebook Page
                </span>

                <ExternalLink
                  size={15}
                />
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}