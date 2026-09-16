import {
  AlertTriangle,
  Check,
  Clipboard,
  Eye,
  FileImage,
  Images,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'

import { AdminLayout } from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useMediaLibrary } from '../../hooks/useMediaLibrary'

import {
  checkMediaDeletion,
  type MediaItem,
  type MediaPostReference,
} from '../../services/media'

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  return error instanceof Error &&
    error.message
    ? error.message
    : fallback
}

export function AdminMediaPage() {
  const {
    user,
  } = useAuth()

  const toast =
    useToast()

  const {
    media,
    loading,
    uploading,
    deleting,
    error,
    refresh,
    upload,
    remove,
  } = useMediaLibrary()

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    )

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    previewItem,
    setPreviewItem,
  ] =
    useState<MediaItem | null>(
      null,
    )

  const [
    deletingItem,
    setDeletingItem,
  ] =
    useState<MediaItem | null>(
      null,
    )

  const [
    checkingDelete,
    setCheckingDelete,
  ] = useState(false)

  const [
    deleteReferences,
    setDeleteReferences,
  ] = useState<MediaPostReference[]>([])

  const [
    deleteCheckError,
    setDeleteCheckError,
  ] = useState<string | null>(null)

  const [
    copiedPath,
    setCopiedPath,
  ] =
    useState<string | null>(
      null,
    )

  const filteredMedia =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return media
      }

      return media.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(query) ||
          item.path
            .toLowerCase()
            .includes(query) ||
          item.mimeType
            ?.toLowerCase()
            .includes(query),
      )
    }, [
      media,
      search,
    ])

  async function handleRefresh() {
    try {
      await refresh()

      toast.success(
        'Media refreshed',
        'The latest files have been loaded from storage.',
      )
    } catch (caughtError) {
      toast.error(
        'Refresh failed',
        getErrorMessage(
          caughtError,
          'The media library could not be refreshed.',
        ),
      )
    }
  }

  async function handleFileChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0]

    event.target.value = ''

    if (!file) {
      return
    }

    if (!user) {
      toast.error(
        'Upload failed',
        'You must be signed in before uploading media.',
      )
      return
    }

    try {
      await upload(
        file,
        user.id,
      )

      toast.success(
        'Image uploaded',
        `${file.name} was added to the Media Library.`,
      )
    } catch (caughtError) {
      toast.error(
        'Upload failed',
        getErrorMessage(
          caughtError,
          'The image could not be uploaded.',
        ),
      )
    }
  }

  async function handleCopy(
    item: MediaItem,
  ) {
    try {
      await navigator.clipboard.writeText(
        item.url,
      )

      setCopiedPath(
        item.path,
      )

      toast.success(
        'URL copied',
        'The public image URL is now on your clipboard.',
      )

      window.setTimeout(
        () => {
          setCopiedPath(
            (current) =>
              current === item.path
                ? null
                : current,
          )
        },
        1800,
      )
    } catch {
      toast.error(
        'Copy failed',
        'Your browser could not copy the image URL.',
      )
    }
  }

  async function requestDelete(
    item: MediaItem,
  ) {
    setDeletingItem(item)
    setCheckingDelete(true)
    setDeleteReferences([])
    setDeleteCheckError(null)

    try {
      const result =
        await checkMediaDeletion(
          item.url,
        )

      setDeleteReferences(
        result.references,
      )
    } catch (caughtError) {
      setDeleteCheckError(
        getErrorMessage(
          caughtError,
          'The CMS could not verify whether this image is in use.',
        ),
      )
    } finally {
      setCheckingDelete(false)
    }
  }

  async function handleDelete() {
    if (!deletingItem) {
      return
    }

    const item =
      deletingItem

    try {
      const latestCheck =
        await checkMediaDeletion(
          item.url,
        )

      if (!latestCheck.canDelete) {
        setDeleteReferences(
          latestCheck.references,
        )

        toast.error(
          'Deletion blocked',
          `This image is still used by ${latestCheck.references.length} ${
            latestCheck.references.length === 1
              ? 'article'
              : 'articles'
          }.`,
        )

        return
      }

      await remove(
        item.path,
      )

      setDeletingItem(
        null,
      )

      if (
        previewItem?.path ===
        item.path
      ) {
        setPreviewItem(
          null,
        )
      }

      toast.success(
        'Image deleted',
        `${item.name} was removed from storage.`,
      )
    } catch (caughtError) {
      toast.error(
        'Delete failed',
        getErrorMessage(
          caughtError,
          'The image could not be deleted.',
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
            Asset Library
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
            Media
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
            Upload, inspect and reuse editorial images stored in Supabase.
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          <button
            type="button"
            disabled={
              loading ||
              uploading
            }
            onClick={() =>
              void handleRefresh()
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-white/[0.10]
              bg-white/[0.04]
              px-4
              text-sm
              font-semibold
              text-white/70
              transition
              hover:bg-white/[0.08]
              hover:text-white
              disabled:opacity-40
            "
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />
            Refresh
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={() =>
              fileInputRef.current?.click()
            }
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
              text-white
              transition
              hover:bg-[#c3313b]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Upload size={16} />

            {uploading
              ? 'Uploading...'
              : 'Upload Image'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(event) =>
              void handleFileChange(
                event,
              )
            }
            className="hidden"
          />
        </div>
      </div>

      <section
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
        <div
          className="
            flex
            flex-col
            gap-3
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <label
            className="
              relative
              block
              w-full
              md:max-w-xl
            "
          >
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
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search filename, path or type..."
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

          <p
            className="
              px-1
              text-xs
              text-white/35
            "
          >
            {filteredMedia.length}{' '}
            {filteredMedia.length === 1
              ? 'image'
              : 'images'}
            {' · '}
            {formatBytes(
              media.reduce(
                (total, item) =>
                  total +
                  (item.size ?? 0),
                0,
              ),
            )}
          </p>
        </div>
      </section>

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

      <section className="mt-5">
        {loading ? (
          <MediaLoading />
        ) : filteredMedia.length ===
          0 ? (
          <MediaEmpty
            searching={
              Boolean(
                search.trim(),
              )
            }
            onUpload={() =>
              fileInputRef.current?.click()
            }
          />
        ) : (
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
            "
          >
            {filteredMedia.map(
              (item) => (
                <MediaCard
                  key={item.path}
                  item={item}
                  copied={
                    copiedPath ===
                    item.path
                  }
                  disabled={
                    deleting
                  }
                  onPreview={() =>
                    setPreviewItem(
                      item,
                    )
                  }
                  onCopy={() =>
                    void handleCopy(
                      item,
                    )
                  }
                  onDelete={() =>
                    void requestDelete(
                      item,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </section>

      {previewItem && (
        <MediaPreviewDialog
          item={previewItem}
          copied={
            copiedPath ===
            previewItem.path
          }
          onClose={() =>
            setPreviewItem(
              null,
            )
          }
          onCopy={() =>
            void handleCopy(
              previewItem,
            )
          }
          onDelete={() => {
            void requestDelete(
              previewItem,
            )
          }}
        />
      )}

      {deletingItem && (
        <DeleteMediaDialog
          item={deletingItem}
          deleting={deleting}
          checking={checkingDelete}
          references={deleteReferences}
          checkError={deleteCheckError}
          onCancel={() => {
            setDeletingItem(null)
            setDeleteReferences([])
            setDeleteCheckError(null)
          }}
          onConfirm={() =>
            void handleDelete()
          }
        />
      )}
    </AdminLayout>
  )
}

function MediaCard({
  item,
  copied,
  disabled,
  onPreview,
  onCopy,
  onDelete,
}: {
  item: MediaItem
  copied: boolean
  disabled: boolean
  onPreview: () => void
  onCopy: () => void
  onDelete: () => void
}) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.08]
        bg-white/[0.035]
        transition
        hover:border-white/[0.14]
        hover:bg-white/[0.05]
      "
    >
      <button
        type="button"
        onClick={onPreview}
        className="
          relative
          block
          aspect-[4/3]
          w-full
          overflow-hidden
          bg-black/30
          text-left
        "
      >
        <img
          src={item.url}
          alt={item.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-[1.025]
          "
        />

        <span
          className="
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            bg-black/45
            text-white
            opacity-0
            backdrop-blur-xl
            transition
            group-hover:opacity-100
          "
        >
          <Eye size={16} />
        </span>
      </button>

      <div className="p-4">
        <p
          className="
            truncate
            text-sm
            font-semibold
          "
          title={item.name}
        >
          {item.name}
        </p>

        <div
          className="
            mt-2
            flex
            flex-wrap
            gap-x-3
            gap-y-1
            text-[11px]
            text-white/35
          "
        >
          <span>
            {formatBytes(
              item.size,
            )}
          </span>

          <span>
            {formatMediaDate(
              item.createdAt,
            )}
          </span>
        </div>

        <p
          className="
            mt-2
            truncate
            text-[10px]
            text-white/25
          "
          title={item.path}
        >
          {item.path}
        </p>

        <div
          className="
            mt-4
            grid
            grid-cols-3
            gap-2
          "
        >
          <MediaAction
            icon={
              <Eye size={14} />
            }
            label="Preview"
            onClick={onPreview}
          />

          <MediaAction
            icon={
              copied
                ? <Check size={14} />
                : <Clipboard size={14} />
            }
            label={
              copied
                ? 'Copied'
                : 'Copy URL'
            }
            onClick={onCopy}
          />

          <MediaAction
            icon={
              <Trash2 size={14} />
            }
            label="Delete"
            danger
            disabled={disabled}
            onClick={onDelete}
          />
        </div>
      </div>
    </article>
  )
}

function MediaAction({
  icon,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        flex
        min-w-0
        items-center
        justify-center
        gap-1.5
        rounded-[12px]
        border
        px-2
        py-2
        text-[10px]
        font-semibold
        transition
        disabled:opacity-30
        ${
          danger
            ? `
              border-red-500/10
              bg-red-500/[0.04]
              text-red-300/70
              hover:bg-red-500/10
              hover:text-red-300
            `
            : `
              border-white/[0.07]
              bg-white/[0.035]
              text-white/50
              hover:bg-white/[0.07]
              hover:text-white
            `
        }
      `}
    >
      {icon}
      <span className="truncate">
        {label}
      </span>
    </button>
  )
}

function MediaPreviewDialog({
  item,
  copied,
  onClose,
  onCopy,
  onDelete,
}: {
  item: MediaItem
  copied: boolean
  onClose: () => void
  onCopy: () => void
  onDelete: () => void
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[150]
        flex
        items-center
        justify-center
        bg-black/80
        p-4
        backdrop-blur-xl
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Media preview"
        className="
          flex
          max-h-[92vh]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-[26px]
          border
          border-white/[0.10]
          bg-[#0d1118]
          shadow-2xl
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
            py-4
          "
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {item.name}
            </p>

            <p className="mt-1 truncate text-xs text-white/30">
              {item.path}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="
              ml-4
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/[0.06]
              text-white/60
              transition
              hover:bg-white/[0.10]
              hover:text-white
            "
          >
            <X size={16} />
          </button>
        </div>

        <div
          className="
            flex
            min-h-0
            flex-1
            items-center
            justify-center
            overflow-auto
            bg-black/30
            p-4
            sm:p-8
          "
        >
          <img
            src={item.url}
            alt={item.name}
            className="
              max-h-[62vh]
              max-w-full
              rounded-[16px]
              object-contain
              shadow-2xl
            "
          />
        </div>

        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-white/[0.08]
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              flex-wrap
              gap-x-4
              gap-y-1
              text-xs
              text-white/35
            "
          >
            <span>
              {item.mimeType ??
                'Image'}
            </span>

            <span>
              {formatBytes(
                item.size,
              )}
            </span>

            <span>
              {formatMediaDate(
                item.createdAt,
              )}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCopy}
              className="
                inline-flex
                h-10
                items-center
                gap-2
                rounded-full
                border
                border-white/[0.10]
                bg-white/[0.04]
                px-4
                text-xs
                font-semibold
                text-white/65
                transition
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              {copied
                ? <Check size={14} />
                : <Clipboard size={14} />}

              {copied
                ? 'Copied'
                : 'Copy URL'}
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="
                inline-flex
                h-10
                items-center
                gap-2
                rounded-full
                bg-red-500/10
                px-4
                text-xs
                font-semibold
                text-red-300
                transition
                hover:bg-red-500/15
              "
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteMediaDialog({
  item,
  deleting,
  checking,
  references,
  checkError,
  onCancel,
  onConfirm,
}: {
  item: MediaItem
  deleting: boolean
  checking: boolean
  references: MediaPostReference[]
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
        aria-labelledby="delete-media-title"
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

        <h2
          id="delete-media-title"
          className="mt-5 text-xl font-semibold"
        >
          Delete image?
        </h2>

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
              <AlertTriangle
                size={17}
                className="mt-0.5 shrink-0 text-amber-300"
              />
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Deletion unavailable
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-100/60">
                  {checkError} The image will not be deleted unless its references can be verified safely.
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
                    This image cannot be deleted
                  </p>
                  <p className="mt-1 text-xs leading-5 text-red-100/55">
                    It is currently used as the featured image for {references.length}{' '}
                    {references.length === 1 ? 'article' : 'articles'}. Replace or remove the image from those articles first.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {references.map((reference) => (
                <a
                  key={reference.id}
                  href={`/admin/posts/${reference.id}/edit`}
                  className="block rounded-[14px] border border-white/[0.07] bg-white/[0.035] px-4 py-3 transition hover:bg-white/[0.06]"
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
              ))}
            </div>
          </div>
        ) : (
          <p
            className="
              mt-3
              text-sm
              leading-6
              text-white/45
            "
          >
            “{item.name}” is not referenced by any article and can be permanently removed from Supabase Storage.
          </p>
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
              disabled:opacity-40
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
                    : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function MediaLoading() {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
      "
    >
      {Array.from({
        length: 8,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-white/[0.07]
              bg-white/[0.025]
            "
          >
            <div
              className="
                aspect-[4/3]
                animate-pulse
                bg-white/[0.06]
              "
            />

            <div className="p-4">
              <div
                className="
                  h-3
                  w-2/3
                  animate-pulse
                  rounded
                  bg-white/[0.08]
                "
              />

              <div
                className="
                  mt-3
                  h-2
                  w-1/3
                  animate-pulse
                  rounded
                  bg-white/[0.04]
                "
              />
            </div>
          </div>
        ),
      )}
    </div>
  )
}

function MediaEmpty({
  searching,
  onUpload,
}: {
  searching: boolean
  onUpload: () => void
}) {
  return (
    <div
      className="
        rounded-[24px]
        border
        border-dashed
        border-white/[0.10]
        bg-white/[0.025]
        px-6
        py-20
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-white/[0.05]
          text-white/30
        "
      >
        {searching
          ? <FileImage size={19} />
          : <Images size={19} />}
      </div>

      <h2 className="mt-4 text-lg font-semibold">
        {searching
          ? 'No matching images'
          : 'Your media library is empty'}
      </h2>

      <p
        className="
          mx-auto
          mt-2
          max-w-md
          text-sm
          leading-6
          text-white/35
        "
      >
        {searching
          ? 'Try a different filename or clear the search.'
          : 'Upload your first editorial image to start building the library.'}
      </p>

      {!searching && (
        <button
          type="button"
          onClick={onUpload}
          className="
            mt-5
            inline-flex
            h-10
            items-center
            gap-2
            rounded-full
            bg-[#AD2730]
            px-4
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-[#c3313b]
          "
        >
          <Upload size={14} />
          Upload Image
        </button>
      )}
    </div>
  )
}

function formatBytes(
  bytes: number | null,
) {
  if (
    bytes === null ||
    !Number.isFinite(bytes)
  ) {
    return 'Size unavailable'
  }

  if (bytes === 0) {
    return '0 B'
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
  ]

  const index =
    Math.min(
      Math.floor(
        Math.log(bytes) /
          Math.log(1024),
      ),
      units.length - 1,
    )

  const value =
    bytes /
    1024 ** index

  return `${value.toFixed(
    index === 0
      ? 0
      : value >= 10
        ? 1
        : 2,
  )} ${units[index]}`
}

function formatMediaDate(
  value: string | null,
) {
  if (!value) {
    return 'Date unavailable'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Date unavailable'
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
