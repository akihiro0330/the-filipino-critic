import {
  Archive,
  CheckCircle2,
  Edit3,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Undo2,
} from 'lucide-react'

import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { Link } from 'react-router-dom'

import { AdminLayout } from '../../components/admin/AdminLayout'
import { PublicationStateDialog } from '../../components/admin/PublicationStateDialog'
import { useToast } from '../../context/ToastContext'
import { useAdminPosts } from '../../hooks/useAdminPosts'

import type {
  AdminPostRecord,
  PostStatus,
} from '../../types/database'

type StatusFilter = 'all' | PostStatus

interface PendingPublish {
  post: AdminPostRecord
}

interface PendingVisibilityChange {
  post: AdminPostRecord
  targetStatus: Extract<PostStatus, 'draft' | 'archived'>
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message
    ? error.message
    : fallback
}

export function AdminPostsPage() {
  const {
    posts,
    categories,
    loading,
    mutating,
    error,
    changeStatus,
    removePost,
  } = useAdminPosts()

  const toast = useToast()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [category, setCategory] = useState('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [deletingPost, setDeletingPost] = useState<AdminPostRecord | null>(null)
  const [pendingPublish, setPendingPublish] = useState<PendingPublish | null>(null)
  const [pendingVisibilityChange, setPendingVisibilityChange] =
    useState<PendingVisibilityChange | null>(null)

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return posts.filter((post) => {
      const postCategory = getPostCategory(post)

      const matchesSearch =
        !normalizedSearch ||
        post.title.toLowerCase().includes(normalizedSearch) ||
        post.slug.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        status === 'all' ||
        post.status === status

      const matchesCategory =
        category === 'all' ||
        postCategory?.slug === category

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [posts, search, status, category])

  async function handleStatus(
    post: AdminPostRecord,
    nextStatus: PostStatus,
  ) {
    setActiveMenu(null)

    if (nextStatus === 'published') {
      // Publishing must go through the article editor so the F1
      // pre-publish validation and review cannot be bypassed.
      return
    }

    if (
      post.status === 'published' &&
      (
        nextStatus === 'draft' ||
        nextStatus === 'archived'
      )
    ) {
      setPendingVisibilityChange({
        post,
        targetStatus: nextStatus,
      })
      return
    }

    try {
      await changeStatus(post.id, nextStatus)

      if (nextStatus === 'draft') {
        toast.success(
          'Moved to draft',
          `“${post.title}” is no longer published.`,
        )
      } else if (nextStatus === 'archived') {
        toast.success(
          'Article archived',
          `“${post.title}” has been moved to the archive.`,
        )
      }
    } catch (caughtError) {
      toast.error(
        'Status update failed',
        getErrorMessage(
          caughtError,
          'The article status could not be changed.',
        ),
      )
    }
  }

  async function handleVisibilityChangeConfirm() {
    if (!pendingVisibilityChange) {
      return
    }

    const {
      post,
      targetStatus,
    } = pendingVisibilityChange

    try {
      await changeStatus(
        post.id,
        targetStatus,
      )

      setPendingVisibilityChange(
        null,
      )

      if (
        targetStatus ===
        'draft'
      ) {
        toast.success(
          'Article unpublished',
          `“${post.title}” is no longer visible publicly and is now a draft.`,
        )
      } else {
        toast.success(
          'Article archived',
          `“${post.title}” is no longer visible publicly and has been archived.`,
        )
      }
    } catch (caughtError) {
      toast.error(
        'Status update failed',
        getErrorMessage(
          caughtError,
          'The published article could not be updated.',
        ),
      )
    }
  }

  async function handlePublishConfirm() {
    if (!pendingPublish) {
      return
    }

    const post = pendingPublish.post

    try {
      await changeStatus(post.id, 'published')
      setPendingPublish(null)

      toast.success(
        'Article published',
        `“${post.title}” is now visible on the public website.`,
      )
    } catch (caughtError) {
      toast.error(
        'Publishing failed',
        getErrorMessage(
          caughtError,
          'The article could not be published.',
        ),
      )
    }
  }

  async function handleDelete() {
    if (!deletingPost) {
      return
    }

    const post = deletingPost

    try {
      await removePost(post.id)
      setDeletingPost(null)

      toast.success(
        'Article deleted',
        `“${post.title}” and its associated sources were deleted.`,
      )
    } catch (caughtError) {
      toast.error(
        'Delete failed',
        getErrorMessage(
          caughtError,
          'The article could not be deleted.',
        ),
      )
    }
  }

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
            Content Library
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
            Posts
          </h1>

          <p className="mt-3 text-sm text-white/45">
            Manage all published, draft and archived stories.
          </p>
        </div>

        <Link
          to="/admin/posts/new"
          className="
            inline-flex
            h-11
            items-center
            justify-center
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
          <Plus size={16} />
          New Article
        </Link>
      </div>

      <div
        className="
          mt-8
          rounded-[24px]
          border
          border-white/[0.08]
          bg-white/[0.035]
          p-4
          backdrop-blur-xl
        "
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_190px_220px]">
          <label className="relative block">
            <Search
              size={16}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-white/30
              "
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or slug..."
              className="
                h-12
                w-full
                rounded-[16px]
                border
                border-white/[0.08]
                bg-black/20
                pl-11
                pr-4
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-[#AD2730]/60
                focus:ring-2
                focus:ring-[#AD2730]/10
              "
            />
          </label>

          <label className="relative">
            <SlidersHorizontal
              size={14}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-white/30
              "
            />

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as StatusFilter)
              }
              className="
                h-12
                w-full
                appearance-none
                rounded-[16px]
                border
                border-white/[0.08]
                bg-[#11151c]
                pl-10
                pr-4
                text-sm
                text-white
                outline-none
                focus:border-[#AD2730]/60
              "
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="
              h-12
              w-full
              appearance-none
              rounded-[16px]
              border
              border-white/[0.08]
              bg-[#11151c]
              px-4
              text-sm
              text-white
              outline-none
              focus:border-[#AD2730]/60
            "
          >
            <option value="all">All categories</option>

            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div
          className="
            mt-5
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

      <section
        className="
          mt-5
          overflow-visible
          rounded-[24px]
          border
          border-white/[0.08]
          bg-white/[0.03]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/[0.07]
            px-5
            py-4
          "
        >
          <p className="text-sm font-semibold">
            {filteredPosts.length}{' '}
            {filteredPosts.length === 1 ? 'post' : 'posts'}
          </p>

          <p className="text-xs text-white/35">
            {posts.length} total
          </p>
        </div>

        {loading ? (
          <PostsLoading />
        ) : filteredPosts.length === 0 ? (
          <PostsEmpty />
        ) : (
          <>
            <div
              className="
                hidden
                grid-cols-[minmax(300px,1fr)_150px_130px_130px_60px]
                gap-4
                border-b
                border-white/[0.06]
                px-5
                py-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-white/30
                lg:grid
              "
            >
              <span>Article</span>
              <span>Category</span>
              <span>Status</span>
              <span>Updated</span>
              <span />
            </div>

            {filteredPosts.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                mutating={mutating}
                onStatus={handleStatus}
                onDelete={() => setDeletingPost(post)}
              />
            ))}
          </>
        )}
      </section>

      {pendingVisibilityChange && (
        <PublicationStateDialog
          open
          title={
            pendingVisibilityChange.post.title
          }
          targetStatus={
            pendingVisibilityChange.targetStatus
          }
          mutating={
            mutating
          }
          onCancel={() =>
            setPendingVisibilityChange(
              null,
            )
          }
          onConfirm={() =>
            void handleVisibilityChangeConfirm()
          }
        />
      )}

      {pendingPublish && (
        <PublishPostDialog
          post={pendingPublish.post}
          mutating={mutating}
          onCancel={() => setPendingPublish(null)}
          onConfirm={() => void handlePublishConfirm()}
        />
      )}

      {deletingPost && (
        <DeletePostDialog
          post={deletingPost}
          mutating={mutating}
          onCancel={() => setDeletingPost(null)}
          onConfirm={() => void handleDelete()}
        />
      )}
    </AdminLayout>
  )
}

interface PostRowProps {
  post: AdminPostRecord
  activeMenu: string | null
  setActiveMenu: (value: string | null) => void
  mutating: boolean
  onStatus: (
    post: AdminPostRecord,
    status: PostStatus,
  ) => Promise<void>
  onDelete: () => void
}

function PostRow({
  post,
  activeMenu,
  setActiveMenu,
  mutating,
  onStatus,
  onDelete,
}: PostRowProps) {
  const category = getPostCategory(post)
  const menuOpen = activeMenu === post.id

  return (
    <div
      className="
        relative
        grid
        gap-4
        border-b
        border-white/[0.06]
        px-5
        py-5
        last:border-b-0
        lg:grid-cols-[minmax(300px,1fr)_150px_130px_130px_60px]
        lg:items-center
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="
            h-14
            w-20
            shrink-0
            overflow-hidden
            rounded-[13px]
            bg-white/[0.06]
          "
        >
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt=""
              className="h-full w-full object-cover"
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
              <FileText size={18} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {post.title}
          </p>

          <p className="mt-1 truncate text-xs text-white/30">
            /article/{post.slug}
          </p>
        </div>
      </div>

      <div>
        <MobileLabel>Category</MobileLabel>

        <p className="text-sm text-white/60">
          {category?.name ?? 'Uncategorized'}
        </p>
      </div>

      <div>
        <MobileLabel>Status</MobileLabel>
        <PostStatusBadge status={post.status} />
      </div>

      <div>
        <MobileLabel>Updated</MobileLabel>

        <p className="text-sm text-white/45">
          {formatDate(post.updated_at)}
        </p>
      </div>

      <div className="relative flex justify-end">
        <button
          type="button"
          disabled={mutating}
          onClick={() =>
            setActiveMenu(menuOpen ? null : post.id)
          }
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-white/[0.08]
            bg-white/[0.04]
            text-white/55
            transition
            hover:bg-white/[0.08]
            hover:text-white
            disabled:opacity-40
          "
          aria-label={`Actions for ${post.title}`}
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <div
            className="
              absolute
              right-0
              top-11
              z-30
              w-52
              overflow-hidden
              rounded-[16px]
              border
              border-white/[0.10]
              bg-[#11151c]
              p-1.5
              shadow-2xl
            "
          >
            <Link
              to={`/admin/posts/${post.id}/edit`}
              className="
                flex
                items-center
                gap-3
                rounded-[12px]
                px-3
                py-2.5
                text-sm
                !text-white/70
                transition
                hover:bg-white/[0.06]
                hover:!text-white
              "
            >
              <Edit3 size={15} />
              Edit
            </Link>

            {post.status !== 'published' && (
              <Link
                to={`/admin/posts/${post.id}/edit`}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-[12px]
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  !text-emerald-300
                  transition
                  hover:bg-emerald-400/[0.08]
                "
              >
                <CheckCircle2 size={15} />
                Review &amp; Publish
              </Link>
            )}

            {post.status !== 'draft' && (
              <button
                type="button"
                onClick={() => void onStatus(post, 'draft')}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-[12px]
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-amber-300
                  transition
                  hover:bg-amber-400/[0.08]
                "
              >
                <Undo2 size={15} />
                Move to draft
              </button>
            )}

            {post.status !== 'archived' && (
              <button
                type="button"
                onClick={() => void onStatus(post, 'archived')}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-[12px]
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-white/60
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >
                <Archive size={15} />
                Archive
              </button>
            )}

            <div className="my-1 h-px bg-white/[0.08]" />

            <button
              type="button"
              onClick={() => {
                setActiveMenu(null)
                onDelete()
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-[12px]
                px-3
                py-2.5
                text-left
                text-sm
                text-red-300
                transition
                hover:bg-red-500/[0.08]
              "
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function PublishPostDialog({
  post,
  mutating,
  onCancel,
  onConfirm,
}: {
  post: AdminPostRecord
  mutating: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <ConfirmationDialog
      icon={
        <CheckCircle2 size={18} />
      }
      iconClass="bg-emerald-500/10 text-emerald-300"
      title="Publish article?"
      description={
        <>
          “{post.title}” will become visible on the public website.
        </>
      }
      mutating={mutating}
      cancelLabel="Cancel"
      confirmLabel={mutating ? 'Publishing...' : 'Publish'}
      confirmClass="bg-[#AD2730] hover:bg-[#c3313b]"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

function DeletePostDialog({
  post,
  mutating,
  onCancel,
  onConfirm,
}: {
  post: AdminPostRecord
  mutating: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <ConfirmationDialog
      icon={<Trash2 size={18} />}
      iconClass="bg-red-500/10 text-red-300"
      title="Delete article?"
      description={
        <>
          “{post.title}” will be permanently deleted, including its
          associated sources. This action cannot be undone.
        </>
      }
      mutating={mutating}
      cancelLabel="Cancel"
      confirmLabel={mutating ? 'Deleting...' : 'Delete'}
      confirmClass="bg-red-500 hover:bg-red-400"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

function ConfirmationDialog({
  icon,
  iconClass,
  title,
  description,
  mutating,
  cancelLabel,
  confirmLabel,
  confirmClass,
  onCancel,
  onConfirm,
}: {
  icon: ReactNode
  iconClass: string
  title: string
  description: ReactNode
  mutating: boolean
  cancelLabel: string
  confirmLabel: string
  confirmClass: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/75
        p-4
        backdrop-blur-md
      "
      role="presentation"
      onMouseDown={(event) => {
        if (!mutating && event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="post-confirmation-title"
        className="
          w-full
          max-w-md
          rounded-[24px]
          border
          border-white/[0.10]
          bg-[#11151c]
          p-6
          shadow-2xl
        "
      >
        <div
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <h2
          id="post-confirmation-title"
          className="mt-5 text-xl font-semibold"
        >
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/45">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={mutating}
            onClick={onCancel}
            className="
              rounded-full
              border
              border-white/[0.10]
              px-4
              py-2.5
              text-sm
              font-medium
              text-white/70
              transition
              hover:bg-white/[0.06]
              hover:text-white
              disabled:opacity-40
            "
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={mutating}
            onClick={onConfirm}
            className={`
              rounded-full
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              disabled:opacity-40
              ${confirmClass}
            `}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function PostStatusBadge({
  status,
}: {
  status: PostStatus
}) {
  const styles =
    status === 'published'
      ? 'bg-emerald-400/10 text-emerald-300'
      : status === 'draft'
        ? 'bg-amber-400/10 text-amber-300'
        : 'bg-white/[0.06] text-white/45'

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-semibold
        capitalize
        ${styles}
      `}
    >
      {status}
    </span>
  )
}

function MobileLabel({
  children,
}: {
  children: ReactNode
}) {
  return (
    <p
      className="
        mb-1
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.14em]
        text-white/25
        lg:hidden
      "
    >
      {children}
    </p>
  )
}

function PostsLoading() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="
            flex
            animate-pulse
            gap-4
            border-b
            border-white/[0.06]
            px-5
            py-5
          "
        >
          <div className="h-14 w-20 rounded-xl bg-white/[0.06]" />

          <div className="flex-1">
            <div className="h-3 w-1/2 rounded bg-white/[0.08]" />
            <div className="mt-3 h-2 w-1/4 rounded bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function PostsEmpty() {
  return (
    <div className="px-6 py-16 text-center">
      <div
        className="
          mx-auto
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-white/[0.05]
          text-white/30
        "
      >
        <FileText size={18} />
      </div>

      <h2 className="mt-4 text-lg font-semibold">
        No matching posts
      </h2>

      <p className="mt-2 text-sm text-white/35">
        Try adjusting your search or filters.
      </p>
    </div>
  )
}

function getPostCategory(post: AdminPostRecord) {
  if (Array.isArray(post.category)) {
    return post.category[0] ?? null
  }

  return post.category ?? null
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
