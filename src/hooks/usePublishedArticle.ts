import {
  useEffect,
  useState,
} from 'react'

import { getPublishedArticleBySlug } from '../services/articles'

import type { Article } from '../types/article'

interface UsePublishedArticleResult {
  article: Article | null
  loading: boolean
  error: string | null
}

export function usePublishedArticle(
  slug: string | undefined,
): UsePublishedArticleResult {
  const [
    article,
    setArticle,
  ] = useState<Article | null>(
    null,
  )

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

  useEffect(() => {
    let active = true

    async function loadArticle() {
      if (!slug) {
        setArticle(null)
        setLoading(false)

        return
      }

      setLoading(true)
      setError(null)

      try {
        const data =
          await getPublishedArticleBySlug(
            slug,
          )

        if (!active) {
          return
        }

        setArticle(data)
      } catch (caughtError) {
        if (!active) {
          return
        }

        console.error(
          'Unable to load article:',
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
            'Unable to load article.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadArticle()

    return () => {
      active = false
    }
  }, [slug])

  return {
    article,
    loading,
    error,
  }
}