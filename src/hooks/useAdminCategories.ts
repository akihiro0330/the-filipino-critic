import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
} from '../services/admin'

import type {
  CategoryRow,
} from '../types/database'

interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
}

export function useAdminCategories() {
  const [
    categories,
    setCategories,
  ] = useState<CategoryRow[]>([])

  const [loading, setLoading] =
    useState(true)

  const [mutating, setMutating] =
    useState(false)

  const [error, setError] = useState<
    string | null
  >(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data =
        await getAdminCategories()

      setCategories(data)
    } catch (caughtError) {
      console.error(
        'Unable to load categories:',
        caughtError,
      )

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to load categories.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const addCategory = useCallback(
    async (input: CreateCategoryInput) => {
      setMutating(true)
      setError(null)

      try {
        await createCategory(input)
        await load()
      } catch (caughtError) {
        console.error(
          'Unable to create category:',
          caughtError,
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to create category.',
        )

        throw caughtError
      } finally {
        setMutating(false)
      }
    },
    [load],
  )

  const removeCategory =
    useCallback(
      async (
        categoryId: string,
      ) => {
        setMutating(true)
        setError(null)

        try {
          await deleteCategory(
            categoryId,
          )

          await load()
        } catch (caughtError) {
          console.error(
            'Unable to delete category:',
            caughtError,
          )

          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'Unable to delete category.',
          )

          throw caughtError
        } finally {
          setMutating(false)
        }
      },
      [load],
    )

  useEffect(() => {
    void load()
  }, [load])

  return {
    categories,
    loading,
    mutating,
    error,
    refresh: load,
    addCategory,
    removeCategory,
  }
}