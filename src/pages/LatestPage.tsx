import { usePublishedArticles } from '../hooks/usePublishedArticles'
import { ArticleListingPage } from './ArticleListingPage'

export function LatestPage() {
  const {
    articles,
    loading,
    error,
  } =
    usePublishedArticles()

  return (
    <ArticleListingPage
      eyebrow="Latest"
      title="Latest Stories"
      description="The latest commentary, analysis and public-interest coverage from The Filipino Critic."
      articles={articles}
      loading={loading}
      error={error}
    />
  )
}