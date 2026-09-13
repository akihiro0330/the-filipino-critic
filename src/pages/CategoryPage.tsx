import { useParams } from 'react-router-dom'

import { useCategoryArticles } from '../hooks/useCategoryArticles'
import { ArticleListingPage } from './ArticleListingPage'

interface CategoryConfig {
  title: string
  eyebrow: string
  description: string
}

const categoryConfig: Record<
  string,
  CategoryConfig
> = {
  politics: {
    title: 'Politics',
    eyebrow:
      'Philippine Politics',
    description:
      'Analysis of political developments, institutions, leadership, policy and the decisions that shape public life.',
  },

  issues: {
    title:
      'Public Issues',
    eyebrow:
      'Public Affairs',
    description:
      'Coverage and commentary on issues affecting Filipino communities, institutions and public services.',
  },

  opinion: {
    title: 'Opinion',
    eyebrow:
      'Commentary',
    description:
      'Editorial analysis, perspective and argument on the issues shaping public discourse.',
  },

  accountability: {
    title:
      'Accountability',
    eyebrow:
      'Transparency & Governance',
    description:
      'Stories examining government responsibility, transparency, public spending and institutional accountability.',
  },
}

const databaseSlugMap: Record<
  string,
  string
> = {
  politics: 'politics',
  issues: 'public-issues',
  opinion: 'opinion',
  accountability:
    'accountability',
}

export function CategoryPage() {
  const {
    categorySlug,
  } = useParams<{
    categorySlug: string
  }>()

  const routeSlug =
    categorySlug ??
    'politics'

  const databaseSlug =
    databaseSlugMap[
      routeSlug
    ] ?? routeSlug

  const {
    articles,
    loading,
    error,
  } =
    useCategoryArticles(
      databaseSlug,
    )

  const config =
    categoryConfig[
      routeSlug
    ] ?? {
      title:
        'Stories',
      eyebrow:
        'The Filipino Critic',
      description:
        'Published stories from The Filipino Critic.',
    }

  return (
    <ArticleListingPage
      eyebrow={
        config.eyebrow
      }
      title={
        config.title
      }
      description={
        config.description
      }
      articles={
        articles
      }
      loading={
        loading
      }
      error={
        error
      }
    />
  )
}