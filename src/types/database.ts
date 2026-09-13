export type PostStatus =
  | 'draft'
  | 'published'
  | 'archived'

export type ProfileRole =
  | 'admin'
  | 'editor'

export interface ProfileRow {
  id: string
  display_name: string
  role: ProfileRole
  created_at: string
  updated_at: string
}

export interface CategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface PostContentSection {
  heading?: string
  paragraphs?: string[]
  quote?: string
}

export interface PostRow {
  id: string
  title: string
  slug: string
  excerpt: string
  content: PostContentSection[]
  featured_image: string | null
  image_alt: string | null
  category_id: string | null
  author_id: string | null
  status: PostStatus
  is_featured: boolean
  is_trending: boolean
  trending_rank: number | null
  reading_time_minutes: number | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PostSourceRow {
  id: string
  post_id: string
  label: string
  url: string
  sort_order: number
  created_at: string
}

export interface PostCategoryRelation {
  id: string
  name: string
  slug: string
}

export interface PostSourceRelation {
  id: string
  label: string
  url: string
  sort_order: number
}

export interface PublishedPostRecord {
  id: string
  title: string
  slug: string
  excerpt: string
  content: PostContentSection[] | null
  featured_image: string | null
  image_alt: string | null
  is_featured: boolean
  is_trending: boolean
  trending_rank: number | null
  reading_time_minutes: number | null
  published_at: string | null
  created_at: string

  category:
    | PostCategoryRelation
    | PostCategoryRelation[]
    | null

  sources:
    | PostSourceRelation[]
    | null
}

export interface AdminPostRecord {
  id: string
  title: string
  slug: string
  excerpt: string
  status: PostStatus
  is_featured: boolean
  is_trending: boolean
  trending_rank: number | null
  featured_image: string | null
  published_at: string | null
  created_at: string
  updated_at: string

  category:
    | PostCategoryRelation
    | PostCategoryRelation[]
    | null
}

export interface AdminDashboardStats {
  total: number
  published: number
  drafts: number
  archived: number
  featured: number
  trending: number
}

export interface AdminEditorSource {
  id?: string
  label: string
  url: string
}

export interface AdminPostEditorRecord {
  id: string
  title: string
  slug: string
  excerpt: string
  content: PostContentSection[]
  featured_image: string | null
  image_alt: string | null
  category_id: string | null
  author_id: string | null
  status: PostStatus
  is_featured: boolean
  is_trending: boolean
  trending_rank: number | null
  reading_time_minutes: number | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  sources: AdminEditorSource[]
}

export interface AdminPostEditorInput {
  title: string
  slug: string
  excerpt: string
  content: PostContentSection[]
  featured_image: string | null
  image_alt: string | null
  category_id: string | null
  author_id: string | null
  status: PostStatus
  is_featured: boolean
  is_trending: boolean
  trending_rank: number | null
  reading_time_minutes: number | null
  meta_title: string | null
  meta_description: string | null
  sources: AdminEditorSource[]
}