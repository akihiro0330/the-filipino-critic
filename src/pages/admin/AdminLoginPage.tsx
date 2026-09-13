import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from 'lucide-react'
import {
  type FormEvent,
  useState,
} from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

interface LocationState {
  from?: string
}

export function AdminLoginPage() {
  const {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
  } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const state =
    location.state as
      | LocationState
      | null

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [submitting, setSubmitting] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#080b11]
          text-white
        "
      >
        <LoaderCircle
          className="animate-spin"
          size={24}
        />
      </main>
    )
  }

  if (user && isAdmin) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    )
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setSubmitting(true)
    setErrorMessage(null)

    const result =
      await signIn(
        email.trim(),
        password,
      )

    if (result.error) {
      setErrorMessage(
        'Unable to sign in. Check your email and password.',
      )

      setSubmitting(false)
      return
    }

    /*
     * AuthContext will verify the database
     * profile after authentication.
     *
     * Give the auth state a short moment to
     * synchronize before navigating.
     */
    window.setTimeout(() => {
      const destination =
        state?.from?.startsWith(
          '/admin',
        )
          ? state.from
          : '/admin'

      navigate(
        destination,
        {
          replace: true,
        },
      )

      setSubmitting(false)
    }, 300)
  }

  async function handleInvalidAccount() {
    await signOut()

    setErrorMessage(
      'This account is authenticated but is not authorized for the TFC administration area.',
    )
  }

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#080b11]
        px-5
        py-12
        text-white
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -left-28
          top-10
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#ad2730]/15
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-[520px]
          w-[520px]
          rounded-full
          bg-white/[0.05]
          blur-[150px]
        "
      />

      <section
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[34px]
          border
          border-white/10
          bg-white/[0.055]
          p-6
          shadow-2xl
          backdrop-blur-3xl
          sm:p-8
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <img
            src="/images/tfc-logo.jpg"
            alt="The Filipino Critic"
            className="
              h-14
              w-14
              rounded-full
              object-cover
            "
          />

          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-red-400
              "
            >
              Private administration
            </p>

            <p
              className="
                editorial-title
                mt-1
                text-2xl
                font-semibold
              "
            >
              The Filipino Critic
            </p>
          </div>
        </div>

        <div className="mt-9">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white/[0.07]
              text-red-400
            "
          >
            <LockKeyhole size={18} />
          </div>

          <h1
            className="
              editorial-title
              mt-5
              text-4xl
              font-semibold
            "
          >
            Welcome back.
          </h1>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-white/45
            "
          >
            Sign in to manage articles,
            sources and publication settings.
          </p>
        </div>

        {user && !isAdmin && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-red-400/20
              bg-red-400/10
              p-4
            "
          >
            <p
              className="
                text-sm
                leading-6
                text-red-200
              "
            >
              The signed-in account does not
              have administrator privileges.
            </p>

            <button
              type="button"
              onClick={
                handleInvalidAccount
              }
              className="
                mt-3
                text-sm
                font-semibold
                text-white
                underline
                underline-offset-4
              "
            >
              Sign out
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <label
            htmlFor="admin-email"
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white/45
            "
          >
            Email
          </label>

          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            className="
              mt-2
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/[0.055]
              px-4
              py-3.5
              text-sm
              text-white
              outline-none
              transition
              placeholder:text-white/20
              focus:border-red-400/45
              focus:bg-white/[0.075]
            "
            placeholder="you@example.com"
          />

          <label
            htmlFor="admin-password"
            className="
              mt-5
              block
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white/45
            "
          >
            Password
          </label>

          <div className="relative mt-2">
            <input
              id="admin-password"
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.055]
                px-4
                py-3.5
                pr-12
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-white/20
                focus:border-red-400/45
                focus:bg-white/[0.075]
              "
              placeholder="••••••••••••"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current,
                )
              }
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
              className="
                absolute
                right-3
                top-1/2
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                text-white/45
                transition
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>

          {errorMessage && (
            <p
              className="
                mt-4
                rounded-xl
                bg-red-400/10
                px-4
                py-3
                text-sm
                leading-6
                text-red-200
              "
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              Boolean(
                user &&
                  !isAdmin,
              )
            }
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-white
              px-4
              py-3.5
              text-sm
              font-bold
              text-[#0a0e16]
              transition
              hover:bg-white/90
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {submitting && (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            )}

            Sign in
          </button>
        </form>

        <p
          className="
            mt-7
            text-center
            text-[11px]
            leading-5
            text-white/25
          "
        >
          This area is restricted to authorized
          administrators of The Filipino Critic.
        </p>
      </section>
    </main>
  )
}