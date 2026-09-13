import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  deletePost,
  getAdminCategories,
  getAdminPosts,
  updatePostStatus,
} from '../services/admin'

import type {
  AdminPostRecord,
  CategoryRow,
  PostStatus,
} from '../types/database'

interface UseAdminPostsResult {
  posts: AdminPostRecord[]
  categories: CategoryRow[]
  loading: boolean
  mutating: boolean
  error: string | null
  refresh: () => Promise<void>

  changeStatus: (
    postId: string,
    status: PostStatus,
  ) => Promise<void>

  removePost: (
    postId: string,
  ) => Promise<void>
}

export function useAdminPosts(): UseAdminPostsResult {
  const [
    posts,
    setPosts,
  ] = useState<AdminPostRecord[]>([])

  const [
    categories,
    setCategories,
  ] = useState<CategoryRow[]>([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    mutating,
    setMutating,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState<string | null>(null)

  const load = useCallback(
    async () => {
      setLoading(true)
      setError(null)

      try {
        const [
          postsData,
          categoriesData,
        ] = await Promise.all([
          getAdminPosts(),
          getAdminCategories(),
        ])

        setPosts(postsData)
        setCategories(categoriesData)
      } catch (caughtError) {
        console.error(
          'Unable to load admin posts:',
          caughtError,
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to load posts.',
        )
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const changeStatus = useCallback(
    async (
      postId: string,
      status: PostStatus,
    ) => {
      setMutating(true)
      setError(null)

      try {
        await updatePostStatus(
          postId,
          status,
        )

        await load()
      } catch (caughtError) {
        console.error(
          'Unable to update post:',
          caughtError,
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to update post.',
        )

        throw caughtError
      } finally {
        setMutating(false)
      }
    },
    [load],
  )

  const removePost = useCallback(
    async (
      postId: string,
    ) => {
      setMutating(true)
      setError(null)

      try {
        await deletePost(postId)

        await load()
      } catch (caughtError) {
        console.error(
          'Unable to delete post:',
          caughtError,
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to delete post.',
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
    posts,
    categories,
    loading,
    mutating,
    error,
    refresh: load,
    changeStatus,
    removePost,
  }
}