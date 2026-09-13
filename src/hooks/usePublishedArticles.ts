import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { getPublishedArticles } from '../services/articles'

import type { Article } from '../types/article'

interface UsePublishedArticlesResult {
  articles: Article[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePublishedArticles(): UsePublishedArticlesResult {
  const [
    articles,
    setArticles,
  ] = useState<Article[]>([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  )

  const loadArticles =
    useCallback(
      async () => {
        setLoading(true)
        setError(null)

        try {
          const data =
            await getPublishedArticles()

          setArticles(data)
        } catch (caughtError) {
          console.error(
            'Unable to load published articles:',
            caughtError,
          )

          if (
            caughtError instanceof
            Error
          ) {
            setError(
              caughtError.message,
            )
          } else {
            setError(
              'Unable to load published articles.',
            )
          }
        } finally {
          setLoading(false)
        }
      },
      [],
    )

  useEffect(() => {
    void loadArticles()
  }, [loadArticles])

  return {
    articles,
    loading,
    error,
    refetch: loadArticles,
  }
}