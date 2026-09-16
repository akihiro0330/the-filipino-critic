import {
  useCallback,
  useState,
} from 'react'

import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import {
  AnimatePresence,
  motion,
} from 'motion/react'

import { Analytics } from '@vercel/analytics/react'

import { ProtectedAdminRoute } from './components/admin/ProtectedAdminRoute'
import { Header } from './components/layout/Header'
import { LoadingIntro } from './components/ui/LoadingIntro'

import { useTheme } from './hooks/useTheme'

import { ArticlePage } from './pages/ArticlePage'
import { CategoryPage } from './pages/CategoryPage'
import { HomePage } from './pages/HomePage'
import { LatestPage } from './pages/LatestPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

import { AdminArticleEditorPage } from './pages/admin/AdminArticleEditorPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminMediaPage } from './pages/admin/AdminMediaPage'
import { AdminPage } from './pages/admin/AdminPage'
import { AdminPostsPage } from './pages/admin/AdminPostsPage'

function App() {
  const {
    theme,
    toggleTheme,
  } = useTheme()

  const location =
    useLocation()

  const isAdminRoute =
    location.pathname.startsWith(
      '/admin',
    )

  const introAlreadySeen =
    typeof window !==
      'undefined' &&
    sessionStorage.getItem(
      'tfc-intro-seen',
    ) === 'true'

  const [
    showIntro,
    setShowIntro,
  ] = useState(
    !introAlreadySeen,
  )

  const completeIntro =
    useCallback(() => {
      setShowIntro(false)
    }, [])

  return (
    <>
      <AnimatePresence>
        {showIntro &&
          !isAdminRoute && (
            <LoadingIntro
              onComplete={
                completeIntro
              }
            />
          )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          opacity:
            showIntro &&
            !isAdminRoute
              ? 0.35
              : 1,

          scale:
            showIntro &&
            !isAdminRoute
              ? 1.01
              : 1,
        }}
        transition={{
          duration: 0.8,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        {!isAdminRoute && (
          <Header
            theme={theme}
            onToggleTheme={
              toggleTheme
            }
          />
        )}

        <Routes
          location={location}
        >
          <Route
            path="/"
            element={
              <HomePage />
            }
          />

          <Route
            path="/article/:slug"
            element={
              <ArticlePage />
            }
          />

          <Route
            path="/latest"
            element={
              <LatestPage />
            }
          />

          <Route
            path="/category/:categorySlug"
            element={
              <CategoryPage />
            }
          />

          <Route
            path="/admin/login"
            element={
              <AdminLoginPage />
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/posts"
            element={
              <ProtectedAdminRoute>
                <AdminPostsPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <ProtectedAdminRoute>
                <AdminCategoriesPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/media"
            element={
              <ProtectedAdminRoute>
                <AdminMediaPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/posts/new"
            element={
              <ProtectedAdminRoute>
                <AdminArticleEditorPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/posts/:postId/edit"
            element={
              <ProtectedAdminRoute>
                <AdminArticleEditorPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page not found"
              />
            }
          />
        </Routes>
      </motion.div>

      <Analytics />
    </>
  )
}

export default App
