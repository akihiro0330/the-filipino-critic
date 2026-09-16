import {
  AlertTriangle,
  FolderKanban,
  LockKeyhole,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react'

import {
  useState,
  type FormEvent,
} from 'react'

import { AdminLayout } from '../../components/admin/AdminLayout'
import { useToast } from '../../context/ToastContext'
import { useAdminCategories } from '../../hooks/useAdminCategories'

import {
  checkCategoryDeletion,
  type CategoryPostReference,
} from '../../services/admin'

import type { CategoryRow } from '../../types/database'

const PROTECTED_CATEGORY_SLUGS = new Set([
  'politics',
  'public-issues',
  'opinion',
  'accountability',
])

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message
    ? error.message
    : fallback
}

export function AdminCategoriesPage() {
  const {
    categories,
    loading,
    mutating,
    error,
    addCategory,
    removeCategory,
  } = useAdminCategories()

  const toast = useToast()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [description, setDescription] = useState('')
  const [
    deletingCategory,
    setDeletingCategory,
  ] = useState<CategoryRow | null>(null)

  const [
    checkingDelete,
    setCheckingDelete,
  ] = useState(false)

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(null)

  const [
    deleteReferences,
    setDeleteReferences,
  ] = useState<CategoryPostReference[]>([])

  const [
    deleteCheckError,
    setDeleteCheckError,
  ] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const normalizedName = name.trim()
    const normalizedSlug = (
      slug.trim() ||
      slugify(normalizedName)
    ).trim()

    if (!normalizedName) {
      toast.warning(
        'Category name required',
        'Enter a category name before creating it.',
      )
      return
    }

    if (!normalizedSlug) {
      toast.warning(
        'Category slug required',
        'Enter a valid URL slug for this category.',
      )
      return
    }

    try {
      await addCategory({
        name: normalizedName,
        slug: normalizedSlug,
        description: description.trim(),
      })

      toast.success(
        'Category created',
        `“${normalizedName}” is now available for articles.`,
      )

      setName('')
      setSlug('')
      setSlugTouched(false)
      setDescription('')
    } catch (caughtError) {
      toast.error(
        'Category creation failed',
        getErrorMessage(
          caughtError,
          'The category could not be created.',
        ),
      )
    }
  }

  async function requestDelete(
    category: CategoryRow,
  ) {
    if (
      PROTECTED_CATEGORY_SLUGS.has(
        category.slug,
      )
    ) {
      toast.warning(
        'Core category protected',
        `“${category.name}” is required by the public site and cannot be deleted.`,
      )
      return
    }

    setDeletingCategory(category)
    setCheckingDelete(true)
    setDeleteReferences([])
    setDeleteCheckError(null)

    try {
      const result =
        await checkCategoryDeletion(
          category.id,
        )

      if (result.isProtected) {
        setDeleteCheckError(
          'This is a protected core category and cannot be deleted.',
        )
        return
      }

      setDeleteReferences(
        result.references,
      )
    } catch (caughtError) {
      setDeleteCheckError(
        getErrorMessage(
          caughtError,
          'The CMS could not verify whether this category is in use.',
        ),
      )
    } finally {
      setCheckingDelete(false)
    }
  }

  function closeDeleteDialog() {
    if (deletingId) {
      return
    }

    setDeletingCategory(null)
    setDeleteReferences([])
    setDeleteCheckError(null)
  }

  async function handleDelete() {
    if (!deletingCategory) {
      return
    }

    const target =
      deletingCategory

    setDeletingId(
      target.id,
    )

    try {
      const latestCheck =
        await checkCategoryDeletion(
          target.id,
        )

      if (
        latestCheck.isProtected
      ) {
        setDeleteCheckError(
          'This is a protected core category and cannot be deleted.',
        )

        toast.warning(
          'Core category protected',
          `“${target.name}” cannot be deleted.`,
        )
        return
      }

      if (
        !latestCheck.canDelete
      ) {
        setDeleteReferences(
          latestCheck.references,
        )

        toast.error(
          'Deletion blocked',
          `“${target.name}” is still used by ${latestCheck.references.length} ${
            latestCheck.references.length === 1
              ? 'article'
              : 'articles'
          }.`,
        )
        return
      }

      await removeCategory(
        target.id,
      )

      toast.success(
        'Category deleted',
        `“${target.name}” has been removed.`,
      )

      setDeletingCategory(null)
      setDeleteReferences([])
      setDeleteCheckError(null)
    } catch (caughtError) {
      toast.error(
        'Category deletion failed',
        getErrorMessage(
          caughtError,
          'The category could not be deleted.',
        ),
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
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
          Taxonomy
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
          Categories
        </h1>

        <p
          className="
            mt-3
            max-w-xl
            text-sm
            leading-7
            text-white/45
          "
        >
          Organize articles into clear editorial sections.
        </p>
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
          gap-6
          xl:grid-cols-[380px_1fr]
        "
      >
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="
            self-start
            rounded-[24px]
            border
            border-white/[0.08]
            bg-white/[0.035]
            p-5
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[#AD2730]/10
              text-[#d64a52]
            "
          >
            <Plus size={17} />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            Add Category
          </h2>

          <p className="mt-2 text-xs leading-6 text-white/35">
            Create a category used for organizing public articles.
          </p>

          <label className="mt-6 block">
            <span className="text-xs font-medium text-white/55">
              Name
            </span>

            <input
              value={name}
              onChange={(event) => {
                const value = event.target.value
                setName(value)

                if (!slugTouched) {
                  setSlug(slugify(value))
                }
              }}
              placeholder="e.g. Investigations"
              className="
                mt-2
                h-11
                w-full
                rounded-[14px]
                border
                border-white/[0.08]
                bg-black/20
                px-4
                text-sm
                text-white
                outline-none
                placeholder:text-white/20
                focus:border-[#AD2730]/60
              "
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-white/55">
              Slug
            </span>

            <input
              value={slug}
              onChange={(event) => {
                setSlugTouched(true)
                setSlug(slugify(event.target.value))
              }}
              placeholder="investigations"
              className="
                mt-2
                h-11
                w-full
                rounded-[14px]
                border
                border-white/[0.08]
                bg-black/20
                px-4
                text-sm
                text-white
                outline-none
                placeholder:text-white/20
                focus:border-[#AD2730]/60
              "
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-white/55">
              Description
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
              placeholder="Optional description..."
              className="
                mt-2
                w-full
                resize-none
                rounded-[14px]
                border
                border-white/[0.08]
                bg-black/20
                px-4
                py-3
                text-sm
                text-white
                outline-none
                placeholder:text-white/20
                focus:border-[#AD2730]/60
              "
            />
          </label>

          <button
            type="submit"
            disabled={mutating || !name.trim()}
            className="
              mt-5
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#AD2730]
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#c3313b]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Plus size={15} />

            {mutating ? 'Saving...' : 'Create Category'}
          </button>
        </form>

        <section
          className="
            overflow-hidden
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
            <div>
              <h2 className="text-sm font-semibold">
                Existing Categories
              </h2>

              <p className="mt-1 text-xs text-white/35">
                {categories.length} total
              </p>
            </div>

            <FolderKanban size={17} className="text-white/30" />
          </div>

          {loading ? (
            <div className="p-8 text-sm text-white/35">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-sm text-white/35">
              No categories found.
            </div>
          ) : (
            categories.map((category) => {
              const protectedCategory =
                PROTECTED_CATEGORY_SLUGS.has(category.slug)

              return (
                <div
                  key={category.id}
                  className="
                    flex
                    items-start
                    gap-4
                    border-b
                    border-white/[0.06]
                    px-5
                    py-5
                    last:border-b-0
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white/[0.05]
                      text-white/35
                    "
                  >
                    <FolderKanban size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {category.name}
                      </p>

                      {protectedCategory && (
                        <span
                          className="
                            rounded-full
                            border
                            border-white/[0.08]
                            bg-white/[0.04]
                            px-2
                            py-0.5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-white/30
                          "
                        >
                          Core
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-white/30">
                      /{category.slug}
                    </p>

                    {category.description && (
                      <p
                        className="
                          mt-2
                          max-w-2xl
                          text-sm
                          leading-6
                          text-white/40
                        "
                      >
                        {category.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={mutating || protectedCategory}
                    title={
                      protectedCategory
                        ? 'Core categories are used by public navigation.'
                        : `Delete ${category.name}`
                    }
                    aria-label={
                      protectedCategory
                        ? `${category.name} is a protected core category`
                        : `Delete ${category.name}`
                    }
                    onClick={() =>
                      void requestDelete(category)
                    }
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/[0.08]
                      bg-white/[0.04]
                      text-white/35
                      transition
                      hover:bg-red-500/10
                      hover:text-red-300
                      disabled:cursor-not-allowed
                      disabled:opacity-20
                    "
                  >
                    {deletingId === category.id ? (
                      <span
                        className="
                          h-3
                          w-3
                          animate-spin
                          rounded-full
                          border
                          border-white/30
                          border-t-white
                        "
                      />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              )
            })
          )}
        </section>
      </div>

      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          checking={checkingDelete}
          deleting={
            deletingId ===
            deletingCategory.id
          }
          references={deleteReferences}
          checkError={deleteCheckError}
          onCancel={closeDeleteDialog}
          onConfirm={() =>
            void handleDelete()
          }
        />
      )}
    </AdminLayout>
  )
}


function DeleteCategoryDialog({
  category,
  checking,
  deleting,
  references,
  checkError,
  onCancel,
  onConfirm,
}: {
  category: CategoryRow
  checking: boolean
  deleting: boolean
  references: CategoryPostReference[]
  checkError: string | null
  onCancel: () => void
  onConfirm: () => void
}) {
  const blocked =
    references.length > 0 ||
    Boolean(checkError)

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/80
        p-4
        backdrop-blur-md
      "
      onMouseDown={(event) => {
        if (
          !deleting &&
          event.target ===
            event.currentTarget
        ) {
          onCancel()
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-category-title"
        className="
          w-full
          max-w-lg
          rounded-[24px]
          border
          border-white/[0.10]
          bg-[#11151c]
          p-6
          shadow-2xl
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-red-500/10
              text-red-300
            "
          >
            <Trash2 size={18} />
          </div>

          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            aria-label="Close delete category dialog"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/[0.05]
              text-white/40
              transition
              hover:bg-white/[0.08]
              hover:text-white
              disabled:opacity-30
            "
          >
            <X size={15} />
          </button>
        </div>

        <h2
          id="delete-category-title"
          className="mt-5 text-xl font-semibold"
        >
          Delete category?
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/40">
          Checking whether “{category.name}” can be safely removed.
        </p>

        {checking ? (
          <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-white/[0.08] bg-white/[0.04] p-4">
            <RefreshCw
              size={16}
              className="shrink-0 animate-spin text-white/45"
            />
            <p className="text-sm text-white/45">
              Checking article references...
            </p>
          </div>
        ) : checkError ? (
          <div className="mt-4 rounded-[16px] border border-amber-500/20 bg-amber-500/[0.07] p-4">
            <div className="flex gap-3">
              <LockKeyhole
                size={17}
                className="mt-0.5 shrink-0 text-amber-300"
              />
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Deletion unavailable
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-100/60">
                  {checkError} The category will not be deleted unless the CMS can verify that removal is safe.
                </p>
              </div>
            </div>
          </div>
        ) : references.length > 0 ? (
          <div className="mt-4">
            <div className="rounded-[16px] border border-red-500/20 bg-red-500/[0.07] p-4">
              <div className="flex gap-3">
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-red-300"
                />
                <div>
                  <p className="text-sm font-semibold text-red-200">
                    This category cannot be deleted
                  </p>
                  <p className="mt-1 text-xs leading-5 text-red-100/55">
                    It is assigned to {references.length}{' '}
                    {references.length === 1
                      ? 'article'
                      : 'articles'}. Reassign those articles to another category first.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 max-h-52 space-y-2 overflow-y-auto">
              {references.map(
                (reference) => (
                  <a
                    key={reference.id}
                    href={`/admin/posts/${reference.id}/edit`}
                    className="
                      block
                      rounded-[14px]
                      border
                      border-white/[0.07]
                      bg-white/[0.035]
                      px-4
                      py-3
                      transition
                      hover:bg-white/[0.06]
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-xs font-semibold text-white/70">
                        {reference.title}
                      </p>

                      <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/35">
                        {reference.status}
                      </span>
                    </div>
                  </a>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-[16px] border border-emerald-500/15 bg-emerald-500/[0.05] p-4">
            <p className="text-sm font-semibold text-emerald-200">
              Safe to delete
            </p>
            <p className="mt-1 text-xs leading-5 text-emerald-100/50">
              No articles currently use “{category.name}”. Deleting it will permanently remove the category.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={deleting}
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
            Cancel
          </button>

          <button
            type="button"
            disabled={
              deleting ||
              checking ||
              blocked
            }
            onClick={onConfirm}
            className="
              rounded-full
              bg-red-500
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-400
              disabled:cursor-not-allowed
              disabled:opacity-35
            "
          >
            {checking
              ? 'Checking...'
              : references.length > 0
                ? 'In use'
                : checkError
                  ? 'Unavailable'
                  : deleting
                    ? 'Deleting...'
                    : 'Delete Category'}
          </button>
        </div>
      </div>
    </div>
  )
}
