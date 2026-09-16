import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  deleteMediaImage,
  getMediaLibrary,
  uploadMediaImage,
  type MediaItem,
} from '../services/media'

interface UseMediaLibraryResult {
  media: MediaItem[]
  loading: boolean
  uploading: boolean
  deleting: boolean
  error: string | null

  refresh: () =>
    Promise<void>

  upload: (
    file: File,
    userId: string,
  ) => Promise<void>

  remove: (
    path: string,
  ) => Promise<void>
}

export function useMediaLibrary():
  UseMediaLibraryResult {
  const [
    media,
    setMedia,
  ] =
    useState<
      MediaItem[]
    >([])

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    uploading,
    setUploading,
  ] =
    useState(false)

  const [
    deleting,
    setDeleting,
  ] =
    useState(false)

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null)

  const refresh =
    useCallback(
      async () => {
        setLoading(
          true,
        )

        setError(
          null,
        )

        try {
          const data =
            await getMediaLibrary()

          setMedia(
            data,
          )
        } catch (
          caughtError
        ) {
          console.error(
            'Unable to load media library:',
            caughtError,
          )

          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : 'Unable to load media library.',
          )
        } finally {
          setLoading(
            false,
          )
        }
      },
      [],
    )

  const upload =
    useCallback(
      async (
        file: File,
        userId: string,
      ) => {
        setUploading(
          true,
        )

        setError(
          null,
        )

        try {
          await uploadMediaImage(
            file,
            userId,
          )

          const data =
            await getMediaLibrary()

          setMedia(
            data,
          )
        } catch (
          caughtError
        ) {
          console.error(
            'Unable to upload media:',
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
          setUploading(
            false,
          )
        }
      },
      [],
    )

  const remove =
    useCallback(
      async (
        path: string,
      ) => {
        setDeleting(
          true,
        )

        setError(
          null,
        )

        try {
          await deleteMediaImage(
            path,
          )

          setMedia(
            (
              current,
            ) =>
              current.filter(
                (
                  item,
                ) =>
                  item.path !==
                  path,
              ),
          )
        } catch (
          caughtError
        ) {
          console.error(
            'Unable to delete media:',
            caughtError,
          )

          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : 'Unable to delete image.',
          )

          throw caughtError
        } finally {
          setDeleting(
            false,
          )
        }
      },
      [],
    )

  useEffect(() => {
    void refresh()
  }, [
    refresh,
  ])

  return {
    media,
    loading,
    uploading,
    deleting,
    error,
    refresh,
    upload,
    remove,
  }
}