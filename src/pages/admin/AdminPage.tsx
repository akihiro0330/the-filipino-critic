import {
  Archive,
  FileText,
  Newspaper,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import { AdminLayout } from '../../components/admin/AdminLayout'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import { useAdminPosts } from '../../hooks/useAdminPosts'

export function AdminPage() {
  const {
    stats,
    loading,
    error,
    refresh,
  } =
    useAdminDashboard()

  const {
    posts,
    loading:
      postsLoading,
  } =
    useAdminPosts()

  const recentPosts =
    posts.slice(
      0,
      5,
    )

  return (
    <AdminLayout>
      <div
        className="
          flex
          flex-col
          gap-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.20em]
              text-[#d64a52]
            "
          >
            Dashboard
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-semibold
              tracking-tight
              sm:text-4xl
            "
          >
            Editorial Overview
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-7
              text-white/45
            "
          >
            Manage stories, monitor
            publication status and
            maintain The Filipino
            Critic content library.
          </p>
        </div>

        <div
          className="
            flex
            gap-2
          "
        >
          <button
            type="button"
            onClick={() =>
              void refresh()
            }
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-full
              border
              border-white/[0.10]
              bg-white/[0.04]
              px-4
              text-sm
              font-medium
              text-white/70
              transition
              hover:bg-white/[0.08]
              hover:text-white
            "
          >
            <RefreshCw
              size={15}
            />

            Refresh
          </button>

          <Link
            to="/admin/posts/new"
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-full
              bg-[#AD2730]
              px-5
              text-sm
              font-semibold
              !text-white
              transition
              hover:bg-[#c3313b]
            "
          >
            <Plus
              size={16}
            />

            New Article
          </Link>
        </div>
      </div>

      {error && (
        <div
          className="
            mt-6
            rounded-[20px]
            border
            border-red-500/20
            bg-red-500/[0.06]
            p-4
            text-sm
            text-red-200
          "
        >
          {error}
        </div>
      )}

      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-6
        "
      >
        <StatCard
          label="All posts"
          value={
            stats.total
          }
          loading={
            loading
          }
          icon={FileText}
        />

        <StatCard
          label="Published"
          value={
            stats.published
          }
          loading={
            loading
          }
          icon={Newspaper}
        />

        <StatCard
          label="Drafts"
          value={
            stats.drafts
          }
          loading={
            loading
          }
          icon={FileText}
        />

        <StatCard
          label="Archived"
          value={
            stats.archived
          }
          loading={
            loading
          }
          icon={Archive}
        />

        <StatCard
          label="Featured"
          value={
            stats.featured
          }
          loading={
            loading
          }
          icon={Sparkles}
        />

        <StatCard
          label="Trending"
          value={
            stats.trending
          }
          loading={
            loading
          }
          icon={TrendingUp}
        />
      </div>

      <section
        className="
          mt-8
          overflow-hidden
          rounded-[26px]
          border
          border-white/[0.08]
          bg-white/[0.035]
          backdrop-blur-2xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/[0.08]
            px-5
            py-5
            sm:px-6
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Recent Posts
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-white/40
              "
            >
              Latest content in
              your publication
              library.
            </p>
          </div>

          <Link
            to="/admin/posts"
            className="
              text-sm
              font-semibold
              !text-white/60
              transition
              hover:!text-white
            "
          >
            View all
          </Link>
        </div>

        {postsLoading ? (
          <RecentPostsSkeleton />
        ) : recentPosts.length ===
          0 ? (
          <div
            className="
              p-10
              text-center
              text-sm
              text-white/40
            "
          >
            No posts yet.
          </div>
        ) : (
          <div>
            {recentPosts.map(
              (post) => (
                <RecentPostRow
                  key={
                    post.id
                  }
                  post={
                    post
                  }
                />
              ),
            )}
          </div>
        )}
      </section>
    </AdminLayout>
  )
}

interface StatCardProps {
  label: string
  value: number
  loading: boolean
  icon: React.ComponentType<{
    size?: number
  }>
}

function StatCard({
  label,
  value,
  loading,
  icon: Icon,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-[22px]
        border
        border-white/[0.08]
        bg-white/[0.035]
        p-5
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <span
          className="
            text-xs
            font-medium
            text-white/40
          "
        >
          {label}
        </span>

        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white/[0.05]
            text-white/55
          "
        >
          <Icon
            size={14}
          />
        </span>
      </div>

      {loading ? (
        <div
          className="
            mt-5
            h-9
            w-14
            animate-pulse
            rounded-lg
            bg-white/[0.08]
          "
        />
      ) : (
        <p
          className="
            mt-4
            text-3xl
            font-semibold
            tracking-tight
          "
        >
          {value}
        </p>
      )}
    </div>
  )
}

interface RecentPostRowProps {
  post: import('../../types/database').AdminPostRecord
}

function RecentPostRow({
  post,
}: RecentPostRowProps) {
  const category =
    Array.isArray(
      post.category,
    )
      ? post.category[0]
          ?.name
      : post.category
          ?.name

  return (
    <div
      className="
        flex
        items-center
        gap-4
        border-b
        border-white/[0.06]
        px-5
        py-4
        last:border-b-0
        sm:px-6
      "
    >
      <div
        className="
          h-12
          w-16
          shrink-0
          overflow-hidden
          rounded-[12px]
          bg-white/[0.06]
        "
      >
        {post.featured_image ? (
          <img
            src={
              post.featured_image
            }
            alt=""
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              text-white/20
            "
          >
            <FileText
              size={17}
            />
          </div>
        )}
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            truncate
            text-sm
            font-semibold
          "
        >
          {post.title}
        </p>

        <div
          className="
            mt-1
            flex
            items-center
            gap-2
            text-xs
            text-white/35
          "
        >
          <span>
            {category ??
              'Uncategorized'}
          </span>

          <span>
            •
          </span>

          <span>
            {formatAdminDate(
              post.created_at,
            )}
          </span>
        </div>
      </div>

      <StatusBadge
        status={
          post.status
        }
      />
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status:
    | 'draft'
    | 'published'
    | 'archived'
}) {
  const classes =
    status ===
    'published'
      ? 'bg-emerald-400/10 text-emerald-300'
      : status ===
          'draft'
        ? 'bg-amber-400/10 text-amber-300'
        : 'bg-white/[0.06] text-white/45'

  return (
    <span
      className={`
        shrink-0
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-semibold
        capitalize
        ${classes}
      `}
    >
      {status}
    </span>
  )
}

function RecentPostsSkeleton() {
  return (
    <div>
      {Array.from({
        length: 4,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="
              flex
              animate-pulse
              items-center
              gap-4
              border-b
              border-white/[0.06]
              px-6
              py-4
            "
          >
            <div
              className="
                h-12
                w-16
                rounded-xl
                bg-white/[0.06]
              "
            />

            <div
              className="
                flex-1
              "
            >
              <div
                className="
                  h-3
                  w-2/3
                  rounded
                  bg-white/[0.08]
                "
              />

              <div
                className="
                  mt-2
                  h-2
                  w-1/3
                  rounded
                  bg-white/[0.05]
                "
              />
            </div>
          </div>
        ),
      )}
    </div>
  )
}

function formatAdminDate(
  value: string,
) {
  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(date)
}