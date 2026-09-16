import { supabase } from '../lib/supabase'

import type {
  AdminDashboardStats,
  AdminPostEditorInput,
  AdminPostEditorRecord,
  AdminPostRecord,
  CategoryRow,
  PostContentSection,
  PostStatus,
} from '../types/database'

const ARTICLE_IMAGE_BUCKET =
  'article-images'

const adminPostSelect = `
  id,
  title,
  slug,
  excerpt,
  status,
  is_featured,
  is_trending,
  trending_rank,
  featured_image,
  published_at,
  created_at,
  updated_at,
  category:categories (
    id,
    name,
    slug
  )
`

export interface UploadedArticleImage {
  url: string
  path: string
}

export interface CategoryPostReference {
  id: string
  title: string
  slug: string
  status: PostStatus
}

export interface CategoryDeleteCheck {
  canDelete: boolean
  isProtected: boolean
  references: CategoryPostReference[]
}

const PROTECTED_CATEGORY_SLUGS =
  new Set([
    'politics',
    'public-issues',
    'opinion',
    'accountability',
  ])

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [
    totalResult,
    publishedResult,
    draftResult,
    archivedResult,
    featuredResult,
    trendingResult,
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('id', {
        count: 'exact',
        head: true,
      }),

    supabase
      .from('posts')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq(
        'status',
        'published',
      ),

    supabase
      .from('posts')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq(
        'status',
        'draft',
      ),

    supabase
      .from('posts')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq(
        'status',
        'archived',
      ),

    supabase
      .from('posts')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq(
        'is_featured',
        true,
      ),

    supabase
      .from('posts')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq(
        'is_trending',
        true,
      ),
  ])

  const results = [
    totalResult,
    publishedResult,
    draftResult,
    archivedResult,
    featuredResult,
    trendingResult,
  ]

  const failedResult =
    results.find(
      (result) =>
        result.error,
    )

  if (
    failedResult?.error
  ) {
    throw new Error(
      failedResult.error.message ||
        'Unable to load dashboard statistics.',
    )
  }

  return {
    total:
      totalResult.count ??
      0,

    published:
      publishedResult.count ??
      0,

    drafts:
      draftResult.count ??
      0,

    archived:
      archivedResult.count ??
      0,

    featured:
      featuredResult.count ??
      0,

    trending:
      trendingResult.count ??
      0,
  }
}

export async function getAdminPosts(): Promise<
  AdminPostRecord[]
> {
  const {
    data,
    error,
  } = await supabase
    .from('posts')
    .select(
      adminPostSelect,
    )
    .order(
      'created_at',
      {
        ascending: false,
      },
    )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to load posts.',
    )
  }

  return (
    data ?? []
  ) as unknown as AdminPostRecord[]
}

export async function getAdminCategories(): Promise<
  CategoryRow[]
> {
  const {
    data,
    error,
  } = await supabase
    .from('categories')
    .select(
      `
        id,
        name,
        slug,
        description,
        created_at,
        updated_at
      `,
    )
    .order(
      'name',
      {
        ascending: true,
      },
    )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to load categories.',
    )
  }

  return (
    data ?? []
  ) as CategoryRow[]
}

export async function updatePostStatus(
  postId: string,
  status: PostStatus,
): Promise<void> {
  const updates: {
    status: PostStatus
    published_at?: string | null
  } = {
    status,
  }

  if (
    status ===
    'published'
  ) {
    const {
      data,
      error,
    } = await supabase
      .from('posts')
      .select(
        'published_at',
      )
      .eq(
        'id',
        postId,
      )
      .maybeSingle()

    if (error) {
      throw new Error(
        error.message ||
          'Unable to inspect post.',
      )
    }

    updates.published_at =
      data?.published_at ??
      new Date().toISOString()
  }

  const {
    error,
  } = await supabase
    .from('posts')
    .update(updates)
    .eq(
      'id',
      postId,
    )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to update post status.',
    )
  }
}

export async function deletePost(
  postId: string,
): Promise<void> {
  const {
    error,
  } = await supabase
    .from('posts')
    .delete()
    .eq(
      'id',
      postId,
    )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to delete post.',
    )
  }
}

export async function createCategory(
  input: {
    name: string
    slug: string
    description?: string
  },
): Promise<CategoryRow> {
  const {
    data,
    error,
  } = await supabase
    .from('categories')
    .insert({
      name:
        input.name.trim(),

      slug:
        input.slug.trim(),

      description:
        input.description?.trim() ||
        null,
    })
    .select(
      `
        id,
        name,
        slug,
        description,
        created_at,
        updated_at
      `,
    )
    .single()

  if (error) {
    throw new Error(
      error.message ||
        'Unable to create category.',
    )
  }

  return data as CategoryRow
}

export async function checkCategoryDeletion(
  categoryId: string,
): Promise<CategoryDeleteCheck> {
  const {
    data: category,
    error: categoryError,
  } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('id', categoryId)
    .maybeSingle()

  if (categoryError) {
    throw new Error(
      categoryError.message ||
        'Unable to inspect category.',
    )
  }

  if (!category) {
    throw new Error(
      'The selected category no longer exists.',
    )
  }

  const isProtected =
    PROTECTED_CATEGORY_SLUGS.has(
      category.slug,
    )

  const {
    data: posts,
    error: postsError,
  } = await supabase
    .from('posts')
    .select(
      'id, title, slug, status',
    )
    .eq(
      'category_id',
      categoryId,
    )
    .order(
      'updated_at',
      {
        ascending: false,
      },
    )

  if (postsError) {
    throw new Error(
      postsError.message ||
        'Unable to check category references.',
    )
  }

  const references =
    (posts ?? []).map(
      (post) => ({
        id: String(post.id),
        title: String(post.title),
        slug: String(post.slug),
        status:
          post.status as PostStatus,
      }),
    )

  return {
    canDelete:
      !isProtected &&
      references.length === 0,
    isProtected,
    references,
  }
}

export async function deleteCategory(
  categoryId: string,
): Promise<void> {
  const check =
    await checkCategoryDeletion(
      categoryId,
    )

  if (check.isProtected) {
    throw new Error(
      'Core categories cannot be deleted.',
    )
  }

  if (
    check.references.length > 0
  ) {
    const articleWord =
      check.references.length === 1
        ? 'article'
        : 'articles'

    throw new Error(
      `Deletion blocked. This category is still used by ${check.references.length} ${articleWord}.`,
    )
  }

  const {
    error,
  } = await supabase
    .from('categories')
    .delete()
    .eq(
      'id',
      categoryId,
    )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to delete category.',
    )
  }
}

export async function getAdminPostById(
  postId: string,
): Promise<AdminPostEditorRecord | null> {
  const {
    data,
    error,
  } = await supabase
    .from('posts')
    .select(
      `
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image,
        image_alt,
        category_id,
        author_id,
        status,
        is_featured,
        is_trending,
        trending_rank,
        reading_time_minutes,
        meta_title,
        meta_description,
        published_at,
        created_at,
        updated_at
      `,
    )
    .eq(
      'id',
      postId,
    )
    .maybeSingle()

  if (error) {
    throw new Error(
      error.message ||
        'Unable to load article.',
    )
  }

  if (!data) {
    return null
  }

  const {
    data: sourceData,
    error: sourceError,
  } = await supabase
    .from('post_sources')
    .select(
      `
        id,
        label,
        url,
        sort_order
      `,
    )
    .eq(
      'post_id',
      postId,
    )
    .order(
      'sort_order',
      {
        ascending: true,
      },
    )

  if (sourceError) {
    throw new Error(
      sourceError.message ||
        'Unable to load article sources.',
    )
  }

  return {
    id:
      data.id,

    title:
      data.title,

    slug:
      data.slug,

    excerpt:
      data.excerpt,

    content:
      normalizeContent(
        data.content,
      ),

    featured_image:
      data.featured_image,

    image_alt:
      data.image_alt,

    category_id:
      data.category_id,

    author_id:
      data.author_id,

    status:
      data.status as PostStatus,

    is_featured:
      data.is_featured,

    is_trending:
      data.is_trending,

    trending_rank:
      data.trending_rank,

    reading_time_minutes:
      data.reading_time_minutes,

    meta_title:
      data.meta_title,

    meta_description:
      data.meta_description,

    published_at:
      data.published_at,

    created_at:
      data.created_at,

    updated_at:
      data.updated_at,

    sources:
      (
        sourceData ?? []
      ).map(
        (source) => ({
          id:
            source.id,

          label:
            source.label,

          url:
            source.url,
        }),
      ),
  }
}

export async function createAdminPost(
  input: AdminPostEditorInput,
): Promise<string> {
  const {
    data,
    error,
  } = await supabase.rpc(
    'save_admin_post',
    {
      p_post_id:
        null,

      p_input:
        buildAdminPostRpcInput(
          input,
        ),
    },
  )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to create article.',
    )
  }

  if (
    typeof data !== 'string' ||
    !data
  ) {
    throw new Error(
      'The article was saved, but no article ID was returned.',
    )
  }

  return data
}

export async function updateAdminPost(
  postId: string,
  input: AdminPostEditorInput,
): Promise<void> {
  const {
    error,
  } = await supabase.rpc(
    'save_admin_post',
    {
      p_post_id:
        postId,

      p_input:
        buildAdminPostRpcInput(
          input,
        ),
    },
  )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to update article.',
    )
  }
}

export async function uploadArticleImage(
  file: File,
  userId: string,
): Promise<UploadedArticleImage> {
  validateArticleImage(
    file,
  )

  const extension =
    getImageExtension(
      file,
    )

  const randomId =
    crypto.randomUUID()

  const storagePath =
    `${userId}/${Date.now()}-${randomId}.${extension}`

  const {
    error,
  } = await supabase.storage
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
  } = supabase.storage
    .from(
      ARTICLE_IMAGE_BUCKET,
    )
    .getPublicUrl(
      storagePath,
    )

  if (
    !data.publicUrl
  ) {
    throw new Error(
      'Image uploaded, but its public URL could not be generated.',
    )
  }

  return {
    path:
      storagePath,

    url:
      data.publicUrl,
  }
}

export async function deleteArticleImage(
  storagePath: string,
): Promise<void> {
  const {
    error,
  } = await supabase.storage
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

function buildAdminPostRpcInput(
  input: AdminPostEditorInput,
): Record<string, unknown> {
  return {
    title:
      input.title.trim(),

    slug:
      input.slug.trim(),

    excerpt:
      input.excerpt.trim(),

    content:
      input.content,

    featured_image:
      normalizeNullableString(
        input.featured_image,
      ),

    image_alt:
      normalizeNullableString(
        input.image_alt,
      ),

    category_id:
      input.category_id,

    author_id:
      input.author_id,

    status:
      input.status,

    is_featured:
      input.is_featured,

    is_trending:
      input.is_trending,

    trending_rank:
      input.is_trending
        ? input.trending_rank
        : null,

    reading_time_minutes:
      input.reading_time_minutes,

    meta_title:
      normalizeNullableString(
        input.meta_title,
      ),

    meta_description:
      normalizeNullableString(
        input.meta_description,
      ),

    sources:
      input.sources
        .map(
          (source) => ({
            label:
              source.label.trim(),

            url:
              source.url.trim(),
          }),
        )
        .filter(
          (source) =>
            source.label ||
            source.url,
        ),
  }
}

function validateArticleImage(
  file: File,
): void {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ]

  if (
    !allowedTypes.includes(
      file.type,
    )
  ) {
    throw new Error(
      'Unsupported image format. Please use JPG, PNG, WebP, or AVIF.',
    )
  }

  const maximumSize =
    5 * 1024 * 1024

  if (
    file.size >
    maximumSize
  ) {
    throw new Error(
      'The image is too large. Maximum file size is 5 MB.',
    )
  }
}

function getImageExtension(
  file: File,
): string {
  switch (file.type) {
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

function normalizeNullableString(
  value:
    | string
    | null,
): string | null {
  if (!value) {
    return null
  }

  const trimmed =
    value.trim()

  return trimmed || null
}

function normalizeContent(
  value: unknown,
): PostContentSection[] {
  if (
    !Array.isArray(value)
  ) {
    return []
  }

  return value
    .filter(
      (
        section,
      ): section is Record<
        string,
        unknown
      > =>
        typeof section ===
          'object' &&
        section !== null,
    )
    .map(
      (section) => ({
        heading:
          typeof section.heading ===
          'string'
            ? section.heading
            : undefined,

        paragraphs:
          Array.isArray(
            section.paragraphs,
          )
            ? section.paragraphs.filter(
                (
                  paragraph,
                ): paragraph is string =>
                  typeof paragraph ===
                  'string',
              )
            : [],

        quote:
          typeof section.quote ===
          'string'
            ? section.quote
            : undefined,
      }),
    )
}