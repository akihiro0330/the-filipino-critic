import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  Session,
  User,
} from '@supabase/supabase-js'

import { supabase } from '../lib/supabase'
import type { ProfileRow } from '../types/database'

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: ProfileRow | null

  loading: boolean
  isAdmin: boolean

  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: string | null
  }>

  signOut: () => Promise<void>
}

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  )

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [session, setSession] =
    useState<Session | null>(null)

  const [profile, setProfile] =
    useState<ProfileRow | null>(null)

  const [loading, setLoading] =
    useState(true)

  async function loadProfile(
    userId: string,
  ) {
    const {
      data,
      error,
    } = await supabase
      .from('profiles')
      .select(
        `
          id,
          display_name,
          role,
          created_at,
          updated_at
        `,
      )
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error(
        'Unable to load profile:',
        error.message,
      )

      setProfile(null)
      return
    }

    setProfile(
      data as ProfileRow | null,
    )
  }

  useEffect(() => {
    let active = true

    async function initialize() {
      const {
        data,
      } = await supabase.auth.getSession()

      if (!active) {
        return
      }

      const currentSession =
        data.session

      setSession(currentSession)

      if (currentSession?.user) {
        await loadProfile(
          currentSession.user.id,
        )
      } else {
        setProfile(null)
      }

      if (active) {
        setLoading(false)
      }
    }

    void initialize()

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, nextSession) => {
          setSession(nextSession)

          if (nextSession?.user) {
            void loadProfile(
              nextSession.user.id,
            )
          } else {
            setProfile(null)
          }

          setLoading(false)
        },
      )

    return () => {
      active = false

      authListener.subscription.unsubscribe()
    }
  }, [])

  async function signIn(
    email: string,
    password: string,
  ) {
    const {
      error,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
      )

    return {
      error: error?.message ?? null,
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const value =
    useMemo<AuthContextValue>(
      () => ({
        session,
        user:
          session?.user ?? null,

        profile,

        loading,

        isAdmin:
          profile?.role === 'admin',

        signIn,
        signOut,
      }),
      [
        session,
        profile,
        loading,
      ],
    )

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider.',
    )
  }

  return context
}