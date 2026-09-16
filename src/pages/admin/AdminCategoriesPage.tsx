import {
  FolderKanban,
  Plus,
  Trash2,
} from 'lucide-react'

import {
  useState,
  type FormEvent,
} from 'react'

import { AdminLayout } from '../../components/admin/AdminLayout'
import { useToast } from '../../context/ToastContext'
import { useAdminCategories } from '../../hooks/useAdminCategories'

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
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  async function handleDelete(
    categoryId: string,
  ) {
    const target = categories.find(
      (category) => category.id === categoryId,
    )

    if (!target) {
      toast.error(
        'Category not found',
        'The selected category is no longer available.',
      )
      return
    }

    if (PROTECTED_CATEGORY_SLUGS.has(target.slug)) {
      toast.warning(
        'Core category protected',
        `“${target.name}” is used by the public site navigation and cannot be deleted here.`,
      )
      return
    }

    const confirmed = window.confirm(
      `Delete “${target.name}”? Articles using it will become uncategorized. This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    setDeletingId(categoryId)

    try {
      await removeCategory(categoryId)

      toast.success(
        'Category deleted',
        `“${target.name}” has been removed.`,
      )
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
                      void handleDelete(category.id)
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
    </AdminLayout>
  )
}
