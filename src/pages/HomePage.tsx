import { CategorySection } from '../components/home/CategorySection'
import { EditorialStatement } from '../components/home/EditorialStatement'
import { FacebookCTA } from '../components/home/FacebookCTA'
import { FeaturedStory } from '../components/home/FeaturedStory'
import { Hero } from '../components/home/Hero'
import {
  HomeFeedEmpty,
  HomeFeedError,
  HomeFeedLoading,
} from '../components/home/HomeFeedState'
import { LatestStories } from '../components/home/LatestStories'
import { PrinciplesSection } from '../components/home/PrinciplesSection'
import { TrendingStories } from '../components/home/TrendingStories'
import { Footer } from '../components/layout/Footer'
import { usePublishedArticles } from '../hooks/usePublishedArticles'

export function HomePage() {
  const {
    articles,
    loading,
    error,
    refetch,
  } = usePublishedArticles()

  const featuredArticle =
    articles.find(
      (article) =>
        article.featured,
    ) ??
    articles[0]

  const latestArticles =
    featuredArticle
      ? articles.filter(
          (article) =>
            article.id !==
            featuredArticle.id,
        )
      : []

  const trendingArticles =
    articles.filter(
      (article) =>
        article.trendingRank !==
        undefined,
    )

  return (
    <main>
      <Hero />

      <EditorialStatement />

      {loading && (
        <HomeFeedLoading />
      )}

      {!loading &&
        error && (
          <HomeFeedError
            message={error}
            onRetry={() => {
              void refetch()
            }}
          />
        )}

      {!loading &&
        !error &&
        articles.length === 0 && (
          <HomeFeedEmpty />
        )}

      {!loading &&
        !error &&
        featuredArticle && (
          <>
            <FeaturedStory
              article={
                featuredArticle
              }
            />

            {latestArticles.length >
              0 && (
              <LatestStories
                articles={
                  latestArticles
                }
              />
            )}

            {trendingArticles.length >
              0 && (
              <TrendingStories
                articles={
                  trendingArticles
                }
              />
            )}

            <CategorySection
              title="Politics"
              category="Politics"
              articles={
                articles
              }
              route="/category/politics"
            />

            <CategorySection
              title="Public Issues"
              category="Public Issues"
              articles={
                articles
              }
              route="/category/issues"
            />

            <CategorySection
              title="Opinion"
              category="Opinion"
              articles={
                articles
              }
              route="/category/opinion"
            />

            <CategorySection
              title="Accountability"
              category="Accountability"
              articles={
                articles
              }
              route="/category/accountability"
            />
          </>
        )}

      <PrinciplesSection />

      <FacebookCTA />

      <Footer />
    </main>
  )
}