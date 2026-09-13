import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { getAdminDashboardStats } from '../services/admin'

import type { AdminDashboardStats } from '../types/database'

interface UseAdminDashboardResult {
  stats: AdminDashboardStats
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const emptyStats: AdminDashboardStats = {
  total: 0,
  published: 0,
  drafts: 0,
  archived: 0,
  featured: 0,
  trending: 0,
}

export function useAdminDashboard(): UseAdminDashboardResult {
  const [
    stats,
    setStats,
  ] =
    useState<AdminDashboardStats>(
      emptyStats,
    )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null)

  const loadStats =
    useCallback(
      async () => {
        setLoading(true)
        setError(null)

        try {
          const data =
            await getAdminDashboardStats()

          setStats(data)
        } catch (
          caughtError
        ) {
          console.error(
            'Unable to load dashboard statistics:',
            caughtError,
          )

          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : 'Unable to load dashboard statistics.',
          )
        } finally {
          setLoading(false)
        }
      },
      [],
    )

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  return {
    stats,
    loading,
    error,
    refresh:
      loadStats,
  }
}