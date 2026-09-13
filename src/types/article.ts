export type CoreArticleCategory =
  | 'Politics'
  | 'Public Issues'
  | 'Opinion'
  | 'Accountability'

export type ArticleCategory =
  | CoreArticleCategory
  | (string & {})

export interface ArticleSource {
  label: string
  url: string
}

export interface ArticleSection {
  heading?: string
  paragraphs?: string[]
  quote?: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string

  category: ArticleCategory

  image: string
  imageAlt?: string

  publishedAt: string
  publishedAtRaw?: string

  readingTime: string
  readingTimeMinutes?: number

  author: string

  featured?: boolean
  trendingRank?: number

  sections?: ArticleSection[]
  sources?: ArticleSource[]
}