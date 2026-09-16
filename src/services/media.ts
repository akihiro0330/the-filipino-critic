import { supabase } from '../lib/supabase'

const ARTICLE_IMAGE_BUCKET =
  'article-images'

const MAXIMUM_FILE_SIZE =
  5 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]

export interface MediaItem {
  id: string
  name: string
  path: string
  url: string

  createdAt:
    | string
    | null

  updatedAt:
    | string
    | null

  size:
    | number
    | null

  mimeType:
    | string
    | null
}

export interface UploadedMediaItem {
  path: string
  url: string
}

export interface MediaPostReference {
  id: string
  title: string
  slug: string
  status: string
}

export interface MediaDeleteCheck {
  canDelete: boolean
  references: MediaPostReference[]
}

export async function getMediaLibrary():
  Promise<MediaItem[]> {
  const items =
    await listFolderRecursive(
      '',
    )

  return items.sort(
    (a, b) => {
      const first =
        a.createdAt
          ? new Date(
              a.createdAt,
            ).getTime()
          : 0

      const second =
        b.createdAt
          ? new Date(
              b.createdAt,
            ).getTime()
          : 0

      return second - first
    },
  )
}

async function listFolderRecursive(
  folder: string,
): Promise<MediaItem[]> {
  const {
    data,
    error,
  } =
    await supabase.storage
      .from(
        ARTICLE_IMAGE_BUCKET,
      )
      .list(
        folder,
        {
          limit: 1000,

          sortBy: {
            column:
              'created_at',

            order:
              'desc',
          },
        },
      )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to load media library.',
    )
  }

  if (!data) {
    return []
  }

  const media: MediaItem[] =
    []

  for (const item of data) {
    const path =
      folder
        ? `${folder}/${item.name}`
        : item.name

    /*
     * Supabase Storage folders do not
     * have file metadata/id in the same
     * way normal objects do.
     */
    const isFolder =
      !item.metadata

    if (isFolder) {
      const children =
        await listFolderRecursive(
          path,
        )

      media.push(
        ...children,
      )

      continue
    }

    if (
      !isSupportedImage(
        item.name,
        item.metadata,
      )
    ) {
      continue
    }

    const {
      data:
        publicUrlData,
    } =
      supabase.storage
        .from(
          ARTICLE_IMAGE_BUCKET,
        )
        .getPublicUrl(
          path,
        )

    media.push({
      id:
        item.id ||
        path,

      name:
        item.name,

      path,

      url:
        publicUrlData.publicUrl,

      createdAt:
        item.created_at ??
        null,

      updatedAt:
        item.updated_at ??
        null,

      size:
        getMetadataNumber(
          item.metadata,
          'size',
        ),

      mimeType:
        getMetadataString(
          item.metadata,
          'mimetype',
        ) ??
        getMetadataString(
          item.metadata,
          'contentType',
        ),
    })
  }

  return media
}

export async function uploadMediaImage(
  file: File,
  userId: string,
): Promise<UploadedMediaItem> {
  validateMediaImage(
    file,
  )

  const extension =
    getImageExtension(
      file,
    )

  const id =
    crypto.randomUUID()

  const storagePath =
    `${userId}/` +
    `${Date.now()}-${id}.${extension}`

  const {
    error,
  } =
    await supabase.storage
      .from(
        ARTICLE_IMAGE_BUCKET,
      )
      .upload(
        storagePath,
        file,
        {
          cacheControl:
            '3600',

          contentType:
            file.type,

          upsert:
            false,
        },
      )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to upload image.',
    )
  }

  const {
    data,
  } =
    supabase.storage
      .from(
        ARTICLE_IMAGE_BUCKET,
      )
      .getPublicUrl(
        storagePath,
      )

  if (!data.publicUrl) {
    throw new Error(
      'The image was uploaded, but its public URL could not be generated.',
    )
  }

  return {
    path:
      storagePath,

    url:
      data.publicUrl,
  }
}

export async function getMediaPostReferences(
  imageUrl: string,
): Promise<MediaPostReference[]> {
  const {
    data,
    error,
  } =
    await supabase
      .from('posts')
      .select(
        'id, title, slug, status',
      )
      .eq(
        'featured_image',
        imageUrl,
      )
      .order(
        'updated_at',
        {
          ascending: false,
        },
      )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to check whether this image is used by an article.',
    )
  }

  return (
    data ?? []
  ).map(
    (post) => ({
      id: String(post.id),
      title: String(post.title),
      slug: String(post.slug),
      status: String(post.status),
    }),
  )
}

export async function checkMediaDeletion(
  imageUrl: string,
): Promise<MediaDeleteCheck> {
  const references =
    await getMediaPostReferences(
      imageUrl,
    )

  return {
    canDelete:
      references.length === 0,
    references,
  }
}

export async function deleteMediaImage(
  storagePath: string,
  imageUrl?: string,
): Promise<void> {
  if (imageUrl) {
    const {
      canDelete,
      references,
    } =
      await checkMediaDeletion(
        imageUrl,
      )

    if (!canDelete) {
      const articleWord =
        references.length === 1
          ? 'article'
          : 'articles'

      throw new Error(
        `Deletion blocked. This image is still used by ${references.length} ${articleWord}.`,
      )
    }
  }
  const {
    error,
  } =
    await supabase.storage
      .from(
        ARTICLE_IMAGE_BUCKET,
      )
      .remove([
        storagePath,
      ])

  if (error) {
    throw new Error(
      error.message ||
        'Unable to delete image.',
    )
  }
}

function validateMediaImage(
  file: File,
) {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type,
    )
  ) {
    throw new Error(
      'Unsupported image format. Use JPG, PNG, WebP, or AVIF.',
    )
  }

  if (
    file.size >
    MAXIMUM_FILE_SIZE
  ) {
    throw new Error(
      'The image is too large. Maximum file size is 5 MB.',
    )
  }
}

function getImageExtension(
  file: File,
) {
  switch (
    file.type
  ) {
    case 'image/jpeg':
      return 'jpg'

    case 'image/png':
      return 'png'

    case 'image/webp':
      return 'webp'

    case 'image/avif':
      return 'avif'

    default:
      return 'jpg'
  }
}

function isSupportedImage(
  name: string,
  metadata: unknown,
) {
  const mimeType =
    getMetadataString(
      metadata,
      'mimetype',
    ) ??
    getMetadataString(
      metadata,
      'contentType',
    )

  if (
    mimeType?.startsWith(
      'image/',
    )
  ) {
    return true
  }

  return /\.(jpe?g|png|webp|avif)$/i.test(
    name,
  )
}

function getMetadataString(
  metadata: unknown,
  key: string,
):
  | string
  | null {
  if (
    !metadata ||
    typeof metadata !==
      'object'
  ) {
    return null
  }

  const value =
    (
      metadata as Record<
        string,
        unknown
      >
    )[key]

  return typeof value ===
    'string'
    ? value
    : null
}

function getMetadataNumber(
  metadata: unknown,
  key: string,
):
  | number
  | null {
  if (
    !metadata ||
    typeof metadata !==
      'object'
  ) {
    return null
  }

  const value =
    (
      metadata as Record<
        string,
        unknown
      >
    )[key]

  return typeof value ===
    'number'
    ? value
    : null
}