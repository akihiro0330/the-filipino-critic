import {
  FileText,
  FolderKanban,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  X,
} from 'lucide-react'

import {
  useState,
  type ReactNode,
} from 'react'

import {
  NavLink,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

interface AdminLayoutProps {
  children: ReactNode
}

const navigation = [
  {
    label: 'Overview',
    to: '/admin',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Posts',
    to: '/admin/posts',
    icon: FileText,
    end: false,
  },
  {
    label: 'Categories',
    to: '/admin/categories',
    icon: FolderKanban,
    end: false,
  },
  {
    label: 'Media',
    to: '/admin/media',
    icon: Images,
    end: false,
  },
]

export function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false)

  const {
    profile,
    signOut,
  } = useAuth()

  const navigate =
    useNavigate()

  async function handleSignOut() {
    await signOut()

    navigate(
      '/admin/login',
      {
        replace: true,
      },
    )
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#090c12]
        text-white
      "
    >
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-48
            -top-48
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#AD2730]/10
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            -bottom-48
            -right-48
            h-[620px]
            w-[620px]
            rounded-full
            bg-white/[0.04]
            blur-[160px]
          "
        />
      </div>

      <aside
        className="
          fixed
          bottom-0
          left-0
          top-0
          z-40
          hidden
          w-[270px]
          border-r
          border-white/[0.08]
          bg-[#0d1118]/85
          p-5
          backdrop-blur-3xl
          lg:flex
          lg:flex-col
        "
      >
        <AdminSidebar
          profileName={
            profile?.display_name ??
            'Administrator'
          }
          onSignOut={
            handleSignOut
          }
        />
      </aside>

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            lg:hidden
          "
        >
          <button
            type="button"
            aria-label="Close admin navigation"
            onClick={() =>
              setMobileOpen(false)
            }
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-sm
            "
          />

          <aside
            className="
              absolute
              bottom-0
              left-0
              top-0
              w-[min(310px,88vw)]
              border-r
              border-white/[0.10]
              bg-[#0d1118]
              p-5
              shadow-2xl
            "
          >
            <button
              type="button"
              onClick={() =>
                setMobileOpen(false)
              }
              aria-label="Close menu"
              className="
                absolute
                right-4
                top-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/[0.06]
                text-white
              "
            >
              <X size={18} />
            </button>

            <AdminSidebar
              profileName={
                profile?.display_name ??
                'Administrator'
              }
              onNavigate={() =>
                setMobileOpen(false)
              }
              onSignOut={
                handleSignOut
              }
            />
          </aside>
        </div>
      )}

      <div
        className="
          relative
          min-h-screen
          lg:pl-[270px]
        "
      >
        <header
          className="
            sticky
            top-0
            z-30
            border-b
            border-white/[0.08]
            bg-[#090c12]/75
            px-4
            py-3
            backdrop-blur-2xl
            sm:px-6
            lg:hidden
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
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
                  h-9
                  w-9
                  rounded-full
                  object-cover
                "
              />

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  TFC Admin
                </p>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.16em]
                    text-white/40
                  "
                >
                  Content management
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              aria-label="Open admin navigation"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/[0.10]
                bg-white/[0.05]
              "
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        <main
          className="
            relative
            mx-auto
            max-w-[1600px]
            px-4
            py-6
            sm:px-6
            sm:py-8
            xl:px-10
            xl:py-10
          "
        >
          {children}
        </main>
      </div>
    </div>
  )
}

interface AdminSidebarProps {
  profileName: string
  onNavigate?: () => void
  onSignOut: () => Promise<void>
}

function AdminSidebar({
  profileName,
  onNavigate,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <>
      <div
        className="
          flex
          items-center
          gap-3
          px-2
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

        <div className="min-w-0">
          <p className="truncate font-semibold">
            The Filipino Critic
          </p>

          <p
            className="
              mt-1
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-white/40
            "
          >
            Administration
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p
          className="
            px-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-white/35
          "
        >
          Workspace
        </p>

        <nav className="mt-3 space-y-1">
          {navigation.map(
            ({
              label,
              to,
              icon: Icon,
              end,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={
                  onNavigate
                }
                className={({
                  isActive,
                }) => `
                  flex
                  items-center
                  gap-3
                  rounded-[16px]
                  px-3
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    isActive
                      ? `
                        bg-white
                        !text-[#121823]
                        shadow-lg
                      `
                      : `
                        !text-white/60
                        hover:bg-white/[0.06]
                        hover:!text-white
                      `
                  }
                `}
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ),
          )}
        </nav>

        <NavLink
          to="/admin/posts/new"
          onClick={
            onNavigate
          }
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            rounded-[16px]
            bg-[#AD2730]
            px-4
            py-3
            text-sm
            font-semibold
            !text-white
            transition
            hover:bg-[#c3313b]
          "
        >
          <Plus size={16} />
          New Article
        </NavLink>
      </div>

      <div className="mt-auto pt-8">
        <div
          className="
            rounded-[18px]
            border
            border-white/[0.08]
            bg-white/[0.035]
            p-3
          "
        >
          <p className="truncate text-sm font-semibold">
            {profileName}
          </p>

          <p className="mt-1 text-xs text-white/40">
            Administrator
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void onSignOut()
          }
          className="
            mt-2
            flex
            w-full
            items-center
            gap-3
            rounded-[16px]
            px-3
            py-3
            text-sm
            font-medium
            text-white/50
            transition
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </>
  )
}
