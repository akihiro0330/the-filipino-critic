import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  createAdminPost,
  getAdminCategories,
  getAdminPostById,
  updateAdminPost,
  uploadArticleImage,
} from '../services/admin'

import type {
  AdminPostEditorInput,
  AdminPostEditorRecord,
  CategoryRow,
} from '../types/database'

export function useAdminArticleEditor(
  postId?: string,
) {
  const [
    article,
    setArticle,
  ] =
    useState<AdminPostEditorRecord | null>(
      null,
    )

  const [
    categories,
    setCategories,
  ] = useState<CategoryRow[]>([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null)

  const load = useCallback(
    async () => {
      setLoading(true)
      setError(null)

      try {
        const categoryData =
          await getAdminCategories()

        setCategories(
          categoryData,
        )

        if (!postId) {
          setArticle(null)
          return
        }

        const data =
          await getAdminPostById(
            postId,
          )

        setArticle(
          data,
        )
      } catch (
        caughtError
      ) {
        console.error(
          'Unable to load article editor:',
          caughtError,
        )

        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : 'Unable to load article editor.',
        )
      } finally {
        setLoading(false)
      }
    },
    [postId],
  )

  useEffect(() => {
    void load()
  }, [load])

  const create = useCallback(
    async (
      input: AdminPostEditorInput,
    ) => {
      setSaving(true)
      setError(null)

      try {
        return await createAdminPost(
          input,
        )
      } catch (
        caughtError
      ) {
        console.error(
          'Unable to create article:',
          caughtError,
        )

        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : 'Unable to create article.',
        )

        throw caughtError
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  const update = useCallback(
    async (
      input: AdminPostEditorInput,
    ) => {
      if (!postId) {
        throw new Error(
          'Missing article ID.',
        )
      }

      setSaving(true)
      setError(null)

      try {
        await updateAdminPost(
          postId,
          input,
        )
      } catch (
        caughtError
      ) {
        console.error(
          'Unable to update article:',
          caughtError,
        )

        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : 'Unable to update article.',
        )

        throw caughtError
      } finally {
        setSaving(false)
      }
    },
    [postId],
  )

  const uploadImage =
    useCallback(
      async (
        file: File,
        userId: string,
      ) => {
        setUploadingImage(
          true,
        )

        setError(null)

        try {
          return await uploadArticleImage(
            file,
            userId,
          )
        } catch (
          caughtError
        ) {
          console.error(
            'Unable to upload article image:',
            caughtError,
          )

          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : 'Unable to upload image.',
          )

          throw caughtError
        } finally {
          setUploadingImage(
            false,
          )
        }
      },
      [],
    )

  return {
    article,
    categories,
    loading,
    saving,
    uploadingImage,
    error,
    reload: load,
    create,
    update,
    uploadImage,
  }
}