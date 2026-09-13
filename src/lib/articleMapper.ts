import type {
  Article,
  ArticleCategory,
  ArticleSection,
  ArticleSource,
} from '../types/article'

import type {
  PostCategoryRelation,
  PostContentSection,
  PublishedPostRecord,
} from '../types/database'

const DEFAULT_ARTICLE_IMAGE =
  '/images/tfc-logo.jpg'

function normalizeCategory(
  category:
    | PostCategoryRelation
    | PostCategoryRelation[]
    | null,
): ArticleCategory {
  if (Array.isArray(category)) {
    return (
      category[0]?.name ??
      'Public Issues'
    )
  }

  return (
    category?.name ??
    'Public Issues'
  )
}

function normalizeContent(
  content:
    | PostContentSection[]
    | null,
): ArticleSection[] {
  if (!Array.isArray(content)) {
    return []
  }

  return content
    .filter(
      (section) =>
        section &&
        typeof section === 'object',
    )
    .map((section) => ({
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
          : undefined,

      quote:
        typeof section.quote ===
        'string'
          ? section.quote
          : undefined,
    }))
}

function normalizeSources(
  post: PublishedPostRecord,
): ArticleSource[] {
  if (!Array.isArray(post.sources)) {
    return []
  }

  return [...post.sources]
    .sort(
      (a, b) =>
        a.sort_order -
        b.sort_order,
    )
    .map((source) => ({
      label: source.label,
      url: source.url,
    }))
}

function estimateReadingTime(
  content: ArticleSection[],
): number {
  const text = content
    .flatMap((section) => [
      section.heading ?? '',
      ...(section.paragraphs ?? []),
      section.quote ?? '',
    ])
    .join(' ')

  const words =
    text
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length

  if (words === 0) {
    return 1
  }

  return Math.max(
    1,
    Math.ceil(words / 220),
  )
}

function formatPublishedDate(
  value: string | null,
): string {
  if (!value) {
    return 'Recently published'
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Recently published'
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Manila',
    },
  ).format(date)
}

export function mapPublishedPostToArticle(
  post: PublishedPostRecord,
): Article {
  const sections =
    normalizeContent(
      post.content,
    )

  const readingTimeMinutes =
    post.reading_time_minutes ??
    estimateReadingTime(sections)

  return {
    id: post.id,

    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,

    category:
      normalizeCategory(
        post.category,
      ),

    image:
      post.featured_image ||
      DEFAULT_ARTICLE_IMAGE,

    imageAlt:
      post.image_alt ||
      post.title,

    publishedAt:
      formatPublishedDate(
        post.published_at,
      ),

    publishedAtRaw:
      post.published_at ??
      post.created_at,

    readingTime:
      `${readingTimeMinutes} min read`,

    readingTimeMinutes,

    author:
      'The Filipino Critic',

    featured:
      post.is_featured,

    trendingRank:
      post.is_trending
        ? post.trending_rank ??
          undefined
        : undefined,

    sections,

    sources:
      normalizeSources(post),
  }
}