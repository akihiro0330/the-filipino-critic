import {
  LoaderCircle,
} from 'lucide-react'
import type {
  ReactNode,
} from 'react'
import {
  Navigate,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

interface ProtectedAdminRouteProps {
  children: ReactNode
}

export function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const {
    user,
    isAdmin,
    loading,
  } = useAuth()

  const location = useLocation()

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
        <div
          className="
            flex
            flex-col
            items-center
            gap-4
          "
        >
          <LoaderCircle
            size={24}
            className="animate-spin"
          />

          <p
            className="
              text-xs
              uppercase
              tracking-[0.16em]
              text-white/35
            "
          >
            Verifying access
          </p>
        </div>
      </main>
    )
  }

  if (!user || !isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    )
  }

  return children
}