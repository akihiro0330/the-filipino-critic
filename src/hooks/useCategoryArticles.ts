import {
  useEffect,
  useState,
} from 'react'

import { getPublishedArticlesByCategory } from '../services/articles'

import type { Article } from '../types/article'

export function useCategoryArticles(
  categorySlug: string,
) {
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

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const data =
          await getPublishedArticlesByCategory(
            categorySlug,
          )

        if (active) {
          setArticles(data)
        }
      } catch (caughtError) {
        if (!active) {
          return
        }

        console.error(
          'Unable to load category:',
          caughtError,
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to load category.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [categorySlug])

  return {
    articles,
    loading,
    error,
  }
}