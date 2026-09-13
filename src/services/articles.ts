import { supabase } from '../lib/supabase'
import { mapPublishedPostToArticle } from '../lib/articleMapper'

import type { Article } from '../types/article'
import type { PublishedPostRecord } from '../types/database'

const publishedPostSelect = `
  id,
  title,
  slug,
  excerpt,
  content,
  featured_image,
  image_alt,
  is_featured,
  is_trending,
  trending_rank,
  reading_time_minutes,
  published_at,
  created_at,
  category:categories (
    id,
    name,
    slug
  ),
  sources:post_sources (
    id,
    label,
    url,
    sort_order
  )
`

export async function getPublishedArticles(): Promise<
  Article[]
> {
  const {
    data,
    error,
  } = await supabase
    .from('posts')
    .select(
      publishedPostSelect,
    )
    .eq(
      'status',
      'published',
    )
    .order(
      'published_at',
      {
        ascending: false,
      },
    )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to load published articles.',
    )
  }

  if (!data) {
    return []
  }

  return (
    data as unknown as
      PublishedPostRecord[]
  ).map(
    mapPublishedPostToArticle,
  )
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<Article | null> {
  const {
    data,
    error,
  } = await supabase
    .from('posts')
    .select(
      publishedPostSelect,
    )
    .eq(
      'status',
      'published',
    )
    .eq(
      'slug',
      slug,
    )
    .maybeSingle()

  if (error) {
    throw new Error(
      error.message ||
        'Unable to load this article.',
    )
  }

  if (!data) {
    return null
  }

  return mapPublishedPostToArticle(
    data as unknown as
      PublishedPostRecord,
  )
}

export async function getPublishedArticlesByCategory(
  categorySlug: string,
): Promise<Article[]> {
  const {
    data: category,
    error: categoryError,
  } = await supabase
    .from('categories')
    .select(
      'id',
    )
    .eq(
      'slug',
      categorySlug,
    )
    .maybeSingle()

  if (categoryError) {
    throw new Error(
      categoryError.message ||
        'Unable to load this category.',
    )
  }

  if (!category) {
    return []
  }

  const {
    data,
    error,
  } = await supabase
    .from('posts')
    .select(
      publishedPostSelect,
    )
    .eq(
      'status',
      'published',
    )
    .eq(
      'category_id',
      category.id,
    )
    .order(
      'published_at',
      {
        ascending: false,
      },
    )

  if (error) {
    throw new Error(
      error.message ||
        'Unable to load category articles.',
    )
  }

  if (!data) {
    return []
  }

  return (
    data as unknown as
      PublishedPostRecord[]
  ).map(
    mapPublishedPostToArticle,
  )
}