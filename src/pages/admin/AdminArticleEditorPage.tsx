import {
  ArrowLeft,
  Check,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  GripVertical,
  Image as ImageIcon,
  Images,
  Link2,
  LoaderCircle,
  Plus,
  Quote,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { AdminArticlePreview } from '../../components/admin/AdminArticlePreview'
import { PublishReviewDialog } from '../../components/admin/PublishReviewDialog'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { UnsavedChangesDialog } from '../../components/admin/UnsavedChangesDialog'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useAdminArticleEditor } from '../../hooks/useAdminArticleEditor'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'

import type {
  AdminEditorSource,
  AdminPostEditorInput,
  PostContentSection,
  PostStatus,
} from '../../types/database'

import {
  getMediaLibrary,
  type MediaItem,
} from '../../services/media'

interface EditorFormState {
  title: string
  slug: string
  excerpt: string
  categoryId: string
  featuredImage: string
  imageAlt: string
  readingTime: string
  isFeatured: boolean
  isTrending: boolean
  trendingRank: string
  metaTitle: string
  metaDescription: string
  sections: PostContentSection[]
  sources: AdminEditorSource[]
}

function createInitialState(): EditorFormState {
  return {
    title: '',
    slug: '',
    excerpt: '',
    categoryId: '',
    featuredImage: '',
    imageAlt: '',
    readingTime: '',
    isFeatured: false,
    isTrending: false,
    trendingRank: '',
    metaTitle: '',
    metaDescription: '',
    sections: [
      {
        heading: '',
        paragraphs: [''],
        quote: '',
      },
    ],
    sources: [],
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeFormForSnapshot(
  form: EditorFormState,
) {
  return {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    categoryId: form.categoryId,
    featuredImage: form.featuredImage,
    imageAlt: form.imageAlt,
    readingTime: form.readingTime,
    isFeatured: form.isFeatured,
    isTrending: form.isTrending,
    trendingRank: form.trendingRank,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,

    sections: form.sections.map(
      (section) => ({
        heading:
          section.heading ?? '',

        paragraphs:
          section.paragraphs ?? [],

        quote:
          section.quote ?? '',
      }),
    ),

    sources: form.sources.map(
      (source) => ({
        id:
          source.id ??
          null,

        label:
          source.label,

        url:
          source.url,
      }),
    ),
  }
}

function snapshotForm(
  form: EditorFormState,
) {
  return JSON.stringify(
    normalizeFormForSnapshot(
      form,
    ),
  )
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message
  }

  return fallback
}

export function AdminArticleEditorPage() {
  const {
    postId,
  } = useParams<{
    postId?: string
  }>()

  const isEditing =
    Boolean(postId)

  const navigate =
    useNavigate()

  const {
    user,
  } = useAuth()

  const toast =
    useToast()

  const {
    article,
    categories,
    loading,
    saving,
    uploadingImage,
    create,
    update,
    uploadImage,
  } = useAdminArticleEditor(
    postId,
  )

  const [
    form,
    setForm,
  ] =
    useState<EditorFormState>(
      createInitialState,
    )

  const [
    slugEdited,
    setSlugEdited,
  ] =
    useState(false)

  const [
    previewOpen,
    setPreviewOpen,
  ] =
    useState(false)

  const [
    publishReviewOpen,
    setPublishReviewOpen,
  ] =
    useState(false)

  const [
    mediaPickerOpen,
    setMediaPickerOpen,
  ] =
    useState(false)

  const [
    currentStatus,
    setCurrentStatus,
  ] =
    useState<PostStatus>(
      'draft',
    )

  const [
    savedSnapshot,
    setSavedSnapshot,
  ] =
    useState<string | null>(
      null,
    )

  useEffect(() => {
    if (!postId) {
      const freshForm =
        createInitialState()

      setForm(
        freshForm,
      )

      setSlugEdited(
        false,
      )

      setCurrentStatus(
        'draft',
      )

      setSavedSnapshot(
        snapshotForm(
          freshForm,
        ),
      )

      return
    }

    if (!article) {
      return
    }

    const loadedForm: EditorFormState = {
      title:
        article.title,

      slug:
        article.slug,

      excerpt:
        article.excerpt,

      categoryId:
        article.category_id ??
        '',

      featuredImage:
        article.featured_image ??
        '',

      imageAlt:
        article.image_alt ??
        '',

      readingTime:
        article
          .reading_time_minutes
          ?.toString() ??
        '',

      isFeatured:
        article.is_featured,

      isTrending:
        article.is_trending,

      trendingRank:
        article
          .trending_rank
          ?.toString() ??
        '',

      metaTitle:
        article.meta_title ??
        '',

      metaDescription:
        article.meta_description ??
        '',

      sections:
        article.content.length >
        0
          ? article.content
          : [
              {
                heading: '',
                paragraphs: [
                  '',
                ],
                quote: '',
              },
            ],

      sources:
        article.sources,
    }

    setForm(
      loadedForm,
    )

    setSlugEdited(
      true,
    )

    setCurrentStatus(
      article.status,
    )

    setSavedSnapshot(
      snapshotForm(
        loadedForm,
      ),
    )
  }, [
    article,
    postId,
  ])

  const currentSnapshot =
    useMemo(
      () =>
        snapshotForm(
          form,
        ),
      [form],
    )

  const isDirty =
    savedSnapshot !==
      null &&
    currentSnapshot !==
      savedSnapshot

  const {
    isBlocked,
    proceed,
    reset,
    allowNextNavigation,
  } = useUnsavedChanges(
    isDirty &&
      !saving,
  )

  const wordCount =
    useMemo(() => {
      const text =
        form.sections
          .flatMap(
            (section) => [
              section.heading ??
                '',

              ...(
                section.paragraphs ??
                []
              ),

              section.quote ??
                '',
            ],
          )
          .join(' ')
          .trim()

      if (!text) {
        return 0
      }

      return text
        .split(/\s+/)
        .filter(Boolean)
        .length
    }, [
      form.sections,
    ])

  const estimatedReadingTime =
    Math.max(
      1,
      Math.ceil(
        wordCount /
          220,
      ),
    )

  const previewReadingTime =
    form.readingTime
      ? Math.max(
          1,
          Number(
            form.readingTime,
          ) || 1,
        )
      : estimatedReadingTime

  const previewCategoryName =
    useMemo(() => {
      return (
        categories.find(
          (category) =>
            category.id ===
            form.categoryId,
        )?.name ??
        'Uncategorized'
      )
    }, [
      categories,
      form.categoryId,
    ])

  function updateField<
    K extends keyof EditorFormState,
  >(
    key: K,
    value:
      EditorFormState[K],
  ) {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      }),
    )
  }

  function handleTitleChange(
    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,

        title:
          value,

        slug:
          slugEdited
            ? current.slug
            : slugify(
                value,
              ),
      }),
    )
  }

  function updateSection(
    index: number,
    updates:
      Partial<PostContentSection>,
  ) {
    setForm(
      (current) => ({
        ...current,

        sections:
          current.sections.map(
            (
              section,
              sectionIndex,
            ) =>
              sectionIndex ===
              index
                ? {
                    ...section,
                    ...updates,
                  }
                : section,
          ),
      }),
    )
  }

  function addSection() {
    setForm(
      (current) => ({
        ...current,

        sections: [
          ...current.sections,

          {
            heading: '',
            paragraphs: [
              '',
            ],
            quote: '',
          },
        ],
      }),
    )
  }

  function removeSection(
    index: number,
  ) {
    setForm(
      (current) => ({
        ...current,

        sections:
          current.sections.filter(
            (
              _,
              sectionIndex,
            ) =>
              sectionIndex !==
              index,
          ),
      }),
    )
  }

  function updateParagraph(
    sectionIndex: number,
    paragraphIndex: number,
    value: string,
  ) {
    const section =
      form.sections[
        sectionIndex
      ]

    const paragraphs = [
      ...(
        section.paragraphs ??
        []
      ),
    ]

    paragraphs[
      paragraphIndex
    ] = value

    updateSection(
      sectionIndex,
      {
        paragraphs,
      },
    )
  }

  function addParagraph(
    sectionIndex: number,
  ) {
    const section =
      form.sections[
        sectionIndex
      ]

    updateSection(
      sectionIndex,
      {
        paragraphs: [
          ...(
            section.paragraphs ??
            []
          ),
          '',
        ],
      },
    )
  }

  function removeParagraph(
    sectionIndex: number,
    paragraphIndex: number,
  ) {
    const section =
      form.sections[
        sectionIndex
      ]

    const paragraphs =
      (
        section.paragraphs ??
        []
      ).filter(
        (
          _,
          index,
        ) =>
          index !==
          paragraphIndex,
      )

    updateSection(
      sectionIndex,
      {
        paragraphs:
          paragraphs.length >
          0
            ? paragraphs
            : [''],
      },
    )
  }

  function addSource() {
    setForm(
      (current) => ({
        ...current,

        sources: [
          ...current.sources,

          {
            label: '',
            url: '',
          },
        ],
      }),
    )
  }

  function updateSource(
    index: number,
    key:
      | 'label'
      | 'url',
    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,

        sources:
          current.sources.map(
            (
              source,
              sourceIndex,
            ) =>
              sourceIndex ===
              index
                ? {
                    ...source,
                    [key]:
                      value,
                  }
                : source,
          ),
      }),
    )
  }

  function removeSource(
    index: number,
  ) {
    setForm(
      (current) => ({
        ...current,

        sources:
          current.sources.filter(
            (
              _,
              sourceIndex,
            ) =>
              sourceIndex !==
              index,
          ),
      }),
    )
  }

  async function handleImageUpload(
    file: File,
  ) {
    if (!user) {
      toast.error(
        'Upload failed',
        'You must be signed in before uploading an image.',
      )

      return
    }

    try {
      const uploaded =
        await uploadImage(
          file,
          user.id,
        )

      updateField(
        'featuredImage',
        uploaded.url,
      )

      if (
        !form.imageAlt.trim()
      ) {
        const generatedAlt =
          file.name
            .replace(
              /\.[^/.]+$/,
              '',
            )
            .replace(
              /[-_]+/g,
              ' ',
            )
            .trim()

        updateField(
          'imageAlt',
          generatedAlt,
        )
      }

      toast.success(
        'Image uploaded',
        'The featured image is ready. Save the article to attach it permanently.',
      )
    } catch (
      caughtError
    ) {
      toast.error(
        'Image upload failed',
        getErrorMessage(
          caughtError,
          'The image could not be uploaded.',
        ),
      )
    }
  }

  function validateForSave():
    | string
    | null {
    if (
      !form.title.trim()
    ) {
      return 'Add a title before saving this draft.'
    }

    if (
      !form.slug.trim()
    ) {
      return 'Add a valid article slug before saving.'
    }

    if (
      form.readingTime &&
      (
        !Number.isFinite(
          Number(
            form.readingTime,
          ),
        ) ||
        Number(
          form.readingTime,
        ) < 1
      )
    ) {
      return 'Reading time must be at least 1 minute.'
    }

    if (
      form.isTrending &&
      form.trendingRank &&
      (
        !Number.isFinite(
          Number(
            form.trendingRank,
          ),
        ) ||
        Number(
          form.trendingRank,
        ) < 1
      )
    ) {
      return 'Trending rank must be a positive number when provided.'
    }

    return null
  }

  function validateSourceUrl(
    value: string,
  ) {
    try {
      const url =
        new URL(
          value,
        )

      return (
        url.protocol ===
          'http:' ||
        url.protocol ===
          'https:'
      )
    } catch {
      return false
    }
  }

  function validateForPublish():
    | string
    | null {
    const saveError =
      validateForSave()

    if (saveError) {
      return saveError
    }

    if (
      !form.excerpt.trim()
    ) {
      return 'Add an article excerpt before publishing.'
    }

    if (
      !form.categoryId
    ) {
      return 'Select a category before publishing.'
    }

    const hasContent =
      form.sections.some(
        (section) =>
          (
            section.paragraphs ??
            []
          ).some(
            (paragraph) =>
              paragraph.trim(),
          ),
      )

    if (!hasContent) {
      return 'Add at least one paragraph before publishing.'
    }

    if (
      !form.featuredImage.trim()
    ) {
      return 'Add a featured image before publishing.'
    }

    if (
      !form.imageAlt.trim()
    ) {
      return 'Add descriptive alt text for the featured image before publishing.'
    }

    if (
      form.isTrending &&
      (
        !form.trendingRank ||
        Number(
          form.trendingRank,
        ) < 1
      )
    ) {
      return 'Trending articles need a valid rank before publishing.'
    }

    for (
      let index = 0;
      index <
      form.sources.length;
      index += 1
    ) {
      const source =
        form.sources[
          index
        ]

      const label =
        source.label.trim()

      const url =
        source.url.trim()

      if (
        !label &&
        !url
      ) {
        continue
      }

      if (
        !label ||
        !url
      ) {
        return `Source ${index + 1} needs both a label and URL before publishing.`
      }

      if (
        !validateSourceUrl(
          url,
        )
      ) {
        return `Source ${index + 1} needs a valid http:// or https:// URL.`
      }
    }

    return null
  }

  function getPublishingWarnings() {
    const warnings: string[] =
      []

    if (
      !form.metaTitle.trim()
    ) {
      warnings.push(
        'SEO title is empty.',
      )
    }

    if (
      !form.metaDescription.trim()
    ) {
      warnings.push(
        'Meta description is empty.',
      )
    }

    if (
      form.excerpt.trim().length >
      180
    ) {
      warnings.push(
        'Excerpt is longer than the recommended 180 characters.',
      )
    }

    if (
      form.metaTitle.trim()
        .length > 60
    ) {
      warnings.push(
        'SEO title is longer than the recommended 60 characters.',
      )
    }

    if (
      form.metaDescription
        .trim().length > 160
    ) {
      warnings.push(
        'Meta description is longer than the recommended 160 characters.',
      )
    }

    return warnings
  }

  function buildInput(
    status: PostStatus,
  ): AdminPostEditorInput {
    return {
      title:
        form.title,

      slug:
        form.slug,

      excerpt:
        form.excerpt,

      category_id:
        form.categoryId ||
        null,

      author_id:
        user?.id ??
        article?.author_id ??
        null,

      status,

      content:
        form.sections.map(
          (section) => ({
            heading:
              section.heading
                ?.trim() ||
              undefined,

            paragraphs:
              (
                section.paragraphs ??
                []
              )
                .map(
                  (
                    paragraph,
                  ) =>
                    paragraph.trim(),
                )
                .filter(
                  Boolean,
                ),

            quote:
              section.quote
                ?.trim() ||
              undefined,
          }),
        ),

      featured_image:
        form.featuredImage ||
        null,

      image_alt:
        form.imageAlt ||
        null,

      reading_time_minutes:
        form.readingTime
          ? Number(
              form.readingTime,
            )
          : estimatedReadingTime,

      is_featured:
        form.isFeatured,

      is_trending:
        form.isTrending,

      trending_rank:
        form.isTrending &&
        form.trendingRank
          ? Number(
              form.trendingRank,
            )
          : null,

      meta_title:
        form.metaTitle ||
        null,

      meta_description:
        form.metaDescription ||
        null,

      sources:
        form.sources
          .map(
            (source) => ({
              ...source,
              label:
                source.label.trim(),
              url:
                source.url.trim(),
            }),
          )
          .filter(
            (source) =>
              source.label ||
              source.url,
          ),
    }
  }

  function requestPublish() {
    const validationError =
      validateForPublish()

    if (validationError) {
      toast.warning(
        'Not ready to publish',
        validationError,
      )

      return
    }

    setPublishReviewOpen(
      true,
    )
  }

  async function saveArticle(
    requestedStatus: PostStatus,
  ) {
    const targetStatus =
      currentStatus ===
        'published' &&
      requestedStatus ===
        'draft'
        ? 'published'
        : requestedStatus

    const validationError =
      targetStatus ===
      'published'
        ? validateForPublish()
        : validateForSave()

    if (
      validationError
    ) {
      toast.warning(
        targetStatus ===
          'published'
          ? 'Not ready to publish'
          : 'Draft needs attention',
        validationError,
      )

      return
    }

    const publishingWarnings =
      targetStatus ===
        'published'
        ? getPublishingWarnings()
        : []

    try {
      const input =
        buildInput(
          targetStatus,
        )

      if (isEditing) {
        const wasPublished =
          currentStatus ===
          'published'

        await update(
          input,
        )

        setCurrentStatus(
          targetStatus,
        )

        setSavedSnapshot(
          snapshotForm(
            form,
          ),
        )

        if (
          targetStatus ===
          'published'
        ) {
          toast.success(
            wasPublished
              ? 'Published article updated'
              : 'Article published',
            wasPublished
              ? 'Your latest changes are now live.'
              : 'The article is now visible on the public website.',
          )

          if (
            publishingWarnings.length >
            0
          ) {
            toast.info(
              'Publishing recommendations',
              publishingWarnings.join(
                ' ',
              ),
            )
          }
        } else {
          toast.success(
            'Draft saved',
            'Your unfinished article has been saved successfully.',
          )
        }

        return
      }

      const newPostId =
        await create(
          input,
        )

      setCurrentStatus(
        targetStatus,
      )

      setSavedSnapshot(
        snapshotForm(
          form,
        ),
      )

      if (
        targetStatus ===
        'published'
      ) {
        toast.success(
          'Article published',
          'The article is now live on The Filipino Critic.',
        )

        if (
          publishingWarnings.length >
          0
        ) {
          toast.info(
            'Publishing recommendations',
            publishingWarnings.join(
              ' ',
            ),
          )
        }
      } else {
        toast.success(
          'Draft created',
          'Your unfinished article has been saved as a draft.',
        )
      }

      allowNextNavigation()

      navigate(
        `/admin/posts/${newPostId}/edit`,
        {
          replace: true,
        },
      )
    } catch (
      caughtError
    ) {
      toast.error(
        targetStatus ===
          'published'
          ? 'Publishing failed'
          : 'Save failed',

        getErrorMessage(
          caughtError,
          targetStatus ===
            'published'
            ? 'The article could not be published.'
            : 'The article could not be saved.',
        ),
      )
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <EditorLoading />
      </AdminLayout>
    )
  }

  if (
    isEditing &&
    !article
  ) {
    return (
      <AdminLayout>
        <div
          className="
            flex
            min-h-[60vh]
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <FileText
              size={30}
              className="
                mx-auto
                text-white/25
              "
            />

            <h1
              className="
                mt-5
                text-2xl
                font-semibold
              "
            >
              Article not found
            </h1>

            <Link
              to="/admin/posts"
              className="
                mt-5
                inline-flex
                !text-[#d64a52]
              "
            >
              Return to Posts
            </Link>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <UnsavedChangesDialog
        open={
          isBlocked
        }
        onStay={
          reset
        }
        onLeave={
          proceed
        }
      />

      <AdminArticlePreview
        open={
          previewOpen
        }
        onClose={() =>
          setPreviewOpen(
            false,
          )
        }
        title={
          form.title
        }
        excerpt={
          form.excerpt
        }
        categoryName={
          previewCategoryName
        }
        featuredImage={
          form.featuredImage
        }
        imageAlt={
          form.imageAlt
        }
        readingTimeMinutes={
          previewReadingTime
        }
        sections={
          form.sections
        }
        sources={
          form.sources
        }
      />

      <PublishReviewDialog
        open={
          publishReviewOpen
        }
        currentStatus={
          currentStatus
        }
        title={
          form.title
        }
        slug={
          form.slug
        }
        excerpt={
          form.excerpt
        }
        hasCategory={
          Boolean(
            form.categoryId,
          )
        }
        hasContent={
          form.sections.some(
            (section) =>
              (
                section.paragraphs ??
                []
              ).some(
                (paragraph) =>
                  paragraph.trim(),
              ),
          )
        }
        featuredImage={
          form.featuredImage
        }
        imageAlt={
          form.imageAlt
        }
        readingTime={
          form.readingTime
        }
        sources={
          form.sources
        }
        metaTitle={
          form.metaTitle
        }
        metaDescription={
          form.metaDescription
        }
        warnings={
          getPublishingWarnings()
        }
        saving={
          saving
        }
        onClose={() =>
          setPublishReviewOpen(
            false,
          )
        }
        onConfirm={() => {
          setPublishReviewOpen(
            false,
          )

          void saveArticle(
            'published',
          )
        }}
      />

      <MediaPickerDialog
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(item) => {
          updateField('featuredImage', item.url)
          if (!form.imageAlt.trim()) {
            updateField('imageAlt', mediaNameToAlt(item.name))
          }
          setMediaPickerOpen(false)
          toast.success(
            'Media selected',
            'The selected image is now the featured image. Save the article to apply it.',
          )
        }}
      />

      <div
        className="
          flex
          flex-col
          gap-5
          xl:flex-row
          xl:items-end
          xl:justify-between
        "
      >
        <div>
          <Link
            to="/admin/posts"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              !text-white/45
              transition
              hover:!text-white
            "
          >
            <ArrowLeft
              size={15}
            />

            Back to Posts
          </Link>

          <p
            className="
              mt-7
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.20em]
              text-[#d64a52]
            "
          >
            {isEditing
              ? 'Edit Article'
              : 'New Article'}
          </p>

          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <h1
              className="
                text-3xl
                font-semibold
                tracking-tight
                sm:text-4xl
              "
            >
              {isEditing
                ? 'Edit story'
                : 'Create story'}
            </h1>

            <EditorSaveStatus
              dirty={
                isDirty
              }
              saving={
                saving
              }
            />
          </div>
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
            onClick={() =>
              setPreviewOpen(
                true,
              )
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
              px-5
              text-sm
              font-semibold
              text-white/70
              transition
              hover:bg-white/[0.08]
              hover:text-white
            "
          >
            <Eye
              size={15}
            />
            Preview
          </button>

          <button
            type="button"
            disabled={
              saving ||
              uploadingImage
            }
            onClick={() =>
              void saveArticle(
                currentStatus ===
                  'published'
                  ? 'published'
                  : 'draft',
              )
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
              px-5
              text-sm
              font-semibold
              text-white/70
              transition
              hover:bg-white/[0.08]
              hover:text-white
              disabled:opacity-40
            "
          >
            <Save
              size={15}
            />

            {saving
              ? 'Saving...'
              : currentStatus ===
                  'published'
                ? 'Save Changes'
                : 'Save Draft'}
          </button>

          <button
            type="button"
            disabled={
              saving ||
              uploadingImage
            }
            onClick={
              requestPublish
            }
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
              text-white
              transition
              hover:bg-[#c3313b]
              disabled:opacity-40
            "
          >
            <Globe2
              size={15}
            />

            {saving
              ? 'Saving...'
              : currentStatus ===
                  'published'
                ? 'Update Published'
                : 'Publish'}
          </button>
        </div>
      </div>

      <div
        className="
          mt-8
          grid
          gap-6
          xl:grid-cols-[minmax(0,1fr)_360px]
        "
      >
        <div className="space-y-6">
          <EditorCard
            title="Article Details"
            description="Primary information displayed across the public website."
          >
            <EditorLabel
              label="Title"
              required
            >
              <input
                value={
                  form.title
                }
                onChange={(
                  event,
                ) =>
                  handleTitleChange(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="Enter article title..."
                className={
                  inputClass
                }
              />
            </EditorLabel>

            <EditorLabel
              label="Slug"
              required
            >
              <div className="relative">
                <Link2
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-white/25
                  "
                />

                <input
                  value={
                    form.slug
                  }
                  onChange={(
                    event,
                  ) => {
                    setSlugEdited(
                      true,
                    )

                    updateField(
                      'slug',
                      slugify(
                        event
                          .target
                          .value,
                      ),
                    )
                  }}
                  placeholder="article-slug"
                  className={`
                    ${inputClass}
                    pl-11
                  `}
                />
              </div>
            </EditorLabel>

            <EditorLabel
              label="Excerpt"
              hint="Required to publish"
            >
              <textarea
                value={
                  form.excerpt
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'excerpt',
                    event
                      .target
                      .value,
                  )
                }
                rows={4}
                placeholder="Short summary shown on cards and previews..."
                className={
                  textareaClass
                }
              />

              <CharacterCount
                current={
                  form.excerpt
                    .length
                }
                recommended={
                  180
                }
              />
            </EditorLabel>
          </EditorCard>

          <EditorCard
            title="Article Content"
            description={`${wordCount} words · approximately ${estimatedReadingTime} min read`}
          >
            <div className="space-y-5">
              {form.sections.map(
                (
                  section,
                  sectionIndex,
                ) => (
                  <div
                    key={
                      sectionIndex
                    }
                    className="
                      rounded-[20px]
                      border
                      border-white/[0.08]
                      bg-black/10
                      p-4
                      sm:p-5
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-semibold
                          text-white/40
                        "
                      >
                        <GripVertical
                          size={
                            15
                          }
                        />

                        Section{' '}
                        {sectionIndex +
                          1}
                      </div>

                      {form
                        .sections
                        .length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeSection(
                              sectionIndex,
                            )
                          }
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            text-white/30
                            transition
                            hover:bg-red-500/10
                            hover:text-red-300
                          "
                        >
                          <Trash2
                            size={
                              14
                            }
                          />
                        </button>
                      )}
                    </div>

                    <input
                      value={
                        section.heading ??
                        ''
                      }
                      onChange={(
                        event,
                      ) =>
                        updateSection(
                          sectionIndex,
                          {
                            heading:
                              event
                                .target
                                .value,
                          },
                        )
                      }
                      placeholder="Optional section heading"
                      className={`
                        ${inputClass}
                        mt-4
                      `}
                    />

                    <div className="mt-4 space-y-3">
                      {(
                        section.paragraphs ??
                        ['']
                      ).map(
                        (
                          paragraph,
                          paragraphIndex,
                        ) => (
                          <div
                            key={
                              paragraphIndex
                            }
                            className="
                              flex
                              items-start
                              gap-2
                            "
                          >
                            <textarea
                              value={
                                paragraph
                              }
                              onChange={(
                                event,
                              ) =>
                                updateParagraph(
                                  sectionIndex,
                                  paragraphIndex,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              rows={
                                6
                              }
                              placeholder="Write paragraph..."
                              className={`
                                ${textareaClass}
                                flex-1
                              `}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeParagraph(
                                  sectionIndex,
                                  paragraphIndex,
                                )
                              }
                              className="
                                mt-2
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-white/25
                                transition
                                hover:bg-red-500/10
                                hover:text-red-300
                              "
                            >
                              <Trash2
                                size={
                                  14
                                }
                              />
                            </button>
                          </div>
                        ),
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addParagraph(
                          sectionIndex,
                        )
                      }
                      className="
                        mt-3
                        inline-flex
                        items-center
                        gap-2
                        text-xs
                        font-semibold
                        text-white/40
                        transition
                        hover:text-white
                      "
                    >
                      <Plus
                        size={
                          13
                        }
                      />
                      Add paragraph
                    </button>

                    <div
                      className="
                        mt-5
                        border-t
                        border-white/[0.06]
                        pt-5
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-semibold
                          text-white/40
                        "
                      >
                        <Quote
                          size={
                            14
                          }
                        />

                        Optional pull quote
                      </div>

                      <textarea
                        value={
                          section.quote ??
                          ''
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSection(
                            sectionIndex,
                            {
                              quote:
                                event
                                  .target
                                  .value,
                            },
                          )
                        }
                        rows={2}
                        placeholder="Highlight a key statement..."
                        className={`
                          ${textareaClass}
                          mt-3
                        `}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={
                addSection
              }
              className="
                mt-5
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-[16px]
                border
                border-dashed
                border-white/[0.12]
                text-sm
                font-semibold
                text-white/45
                transition
                hover:border-white/25
                hover:bg-white/[0.03]
                hover:text-white
              "
            >
              <Plus
                size={15}
              />
              Add Section
            </button>
          </EditorCard>

          <EditorCard
            title="Sources & References"
            description="Add external sources supporting the article."
          >
            {form.sources
              .length ===
            0 ? (
              <div
                className="
                  rounded-[18px]
                  border
                  border-dashed
                  border-white/[0.10]
                  px-5
                  py-8
                  text-center
                "
              >
                <Search
                  size={20}
                  className="
                    mx-auto
                    text-white/20
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    text-white/35
                  "
                >
                  No sources added yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {form.sources.map(
                  (
                    source,
                    index,
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="
                        grid
                        gap-2
                        rounded-[18px]
                        border
                        border-white/[0.07]
                        bg-black/10
                        p-3
                        sm:grid-cols-[0.8fr_1.4fr_40px]
                      "
                    >
                      <input
                        value={
                          source.label
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSource(
                            index,
                            'label',
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="Source label"
                        className={
                          inputClass
                        }
                      />

                      <input
                        value={
                          source.url
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSource(
                            index,
                            'url',
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="https://..."
                        className={
                          inputClass
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeSource(
                            index,
                          )
                        }
                        className="
                          flex
                          h-11
                          w-10
                          items-center
                          justify-center
                          rounded-[14px]
                          text-white/30
                          transition
                          hover:bg-red-500/10
                          hover:text-red-300
                        "
                      >
                        <Trash2
                          size={
                            14
                          }
                        />
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}

            <button
              type="button"
              onClick={
                addSource
              }
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#d64a52]
              "
            >
              <Plus
                size={14}
              />
              Add source
            </button>
          </EditorCard>

          <EditorCard
            title="SEO"
            description="Optional search and sharing metadata."
          >
            <EditorLabel label="SEO Title">
              <input
                value={
                  form.metaTitle
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'metaTitle',
                    event
                      .target
                      .value,
                  )
                }
                placeholder="Defaults to article title"
                className={
                  inputClass
                }
              />

              <CharacterCount
                current={
                  form
                    .metaTitle
                    .length
                }
                recommended={
                  60
                }
              />
            </EditorLabel>

            <EditorLabel label="Meta Description">
              <textarea
                value={
                  form.metaDescription
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'metaDescription',
                    event
                      .target
                      .value,
                  )
                }
                rows={3}
                placeholder="Description for search engines and social previews..."
                className={
                  textareaClass
                }
              />

              <CharacterCount
                current={
                  form
                    .metaDescription
                    .length
                }
                recommended={
                  160
                }
              />
            </EditorLabel>
          </EditorCard>
        </div>

        <aside
          className="
            space-y-6
            xl:sticky
            xl:top-6
            xl:self-start
          "
        >
          <EditorCard
            title="Publishing"
            description="Control how this article appears."
          >
            <EditorLabel
              label="Category"
              hint="Required to publish"
            >
              <select
                value={
                  form.categoryId
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'categoryId',
                    event
                      .target
                      .value,
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select category
                </option>

                {categories.map(
                  (
                    category,
                  ) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  ),
                )}
              </select>
            </EditorLabel>

            <EditorLabel label="Reading Time">
              <input
                type="number"
                min={1}
                value={
                  form.readingTime
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'readingTime',
                    event
                      .target
                      .value,
                  )
                }
                placeholder={`${estimatedReadingTime} min automatically`}
                className={
                  inputClass
                }
              />
            </EditorLabel>

            <ToggleRow
              label="Featured Article"
              description="Highlight this article on the homepage."
              checked={
                form.isFeatured
              }
              onChange={(
                checked,
              ) =>
                updateField(
                  'isFeatured',
                  checked,
                )
              }
            />

            <ToggleRow
              label="Trending"
              description="Include in the trending stories list."
              checked={
                form.isTrending
              }
              onChange={(
                checked,
              ) =>
                updateField(
                  'isTrending',
                  checked,
                )
              }
            />

            {form.isTrending && (
              <EditorLabel label="Trending Rank">
                <input
                  type="number"
                  min={1}
                  value={
                    form.trendingRank
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'trendingRank',
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="1"
                  className={
                    inputClass
                  }
                />
              </EditorLabel>
            )}
          </EditorCard>

          <EditorCard
            title="Featured Image"
            description="Upload an image from your computer or use an external URL."
          >
            <input
              id="tfc-featured-image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={
                uploadingImage
              }
              onChange={(
                event,
              ) => {
                const file =
                  event
                    .currentTarget
                    .files?.[0]

                if (file) {
                  void handleImageUpload(
                    file,
                  )
                }

                event.currentTarget.value =
                  ''
              }}
              className="sr-only"
            />

            <label
              htmlFor="tfc-featured-image-upload"
              className={`
                flex
                min-h-[120px]
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-[18px]
                border
                border-dashed
                border-white/[0.14]
                bg-black/10
                px-5
                py-6
                text-center
                transition
                hover:border-[#AD2730]/55
                hover:bg-[#AD2730]/[0.04]

                ${
                  uploadingImage
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              `}
            >
              {uploadingImage ? (
                <>
                  <LoaderCircle
                    size={
                      22
                    }
                    className="
                      animate-spin
                      text-[#d64a52]
                    "
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-semibold
                      text-white/65
                    "
                  >
                    Uploading image...
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-white/[0.05]
                      text-white/45
                    "
                  >
                    <Upload
                      size={
                        17
                      }
                    />
                  </div>

                  <p
                    className="
                      mt-3
                      text-sm
                      font-semibold
                      text-white/65
                    "
                  >
                    Choose an image
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-white/30
                    "
                  >
                    JPG, PNG,
                    WebP or AVIF
                    <br />
                    Maximum 5 MB
                  </p>
                </>
              )}
            </label>

            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => setMediaPickerOpen(true)}
              className="
                flex h-11 w-full items-center justify-center gap-2
                rounded-[16px] border border-white/[0.10]
                bg-white/[0.04] text-sm font-semibold text-white/65
                transition hover:border-white/[0.16] hover:bg-white/[0.07]
                hover:text-white disabled:opacity-40
              "
            >
              <Images size={15} />
              Choose from Media Library
            </button>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  flex-1
                  bg-white/[0.07]
                "
              />

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white/20
                "
              >
                or
              </span>

              <span
                className="
                  h-px
                  flex-1
                  bg-white/[0.07]
                "
              />
            </div>

            <EditorLabel label="External Image URL">
              <div className="relative">
                <ImageIcon
                  size={
                    15
                  }
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-white/25
                  "
                />

                <input
                  value={
                    form.featuredImage
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'featuredImage',
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="https://..."
                  className={`
                    ${inputClass}
                    pl-11
                  `}
                />
              </div>
            </EditorLabel>

            <EditorLabel label="Image Alt Text">
              <input
                value={
                  form.imageAlt
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'imageAlt',
                    event
                      .target
                      .value,
                  )
                }
                placeholder="Describe what appears in the image"
                className={
                  inputClass
                }
              />
            </EditorLabel>

            {form.featuredImage && (
              <div
                className="
                  overflow-hidden
                  rounded-[18px]
                  border
                  border-white/[0.08]
                  bg-black/20
                "
              >
                <div className="relative">
                  <img
                    src={
                      form.featuredImage
                    }
                    alt={
                      form.imageAlt ||
                      'Featured image preview'
                    }
                    className="
                      aspect-[16/9]
                      w-full
                      object-cover
                    "
                  />

                  <button
                    type="button"
                    aria-label="Remove featured image"
                    onClick={() => {
                      updateField(
                        'featuredImage',
                        '',
                      )

                      updateField(
                        'imageAlt',
                        '',
                      )

                      toast.info(
                        'Featured image removed',
                        'Save the article to apply this change.',
                      )
                    }}
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
                      bg-black/65
                      text-white
                      shadow-lg
                      backdrop-blur-xl
                      transition
                      hover:bg-red-500
                    "
                  >
                    <X
                      size={
                        15
                      }
                    />
                  </button>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-4
                    py-3
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        text-xs
                        font-semibold
                        text-white/60
                      "
                    >
                      Featured image
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-[10px]
                        text-white/25
                      "
                    >
                      {
                        form.featuredImage
                      }
                    </p>
                  </div>

                  <a
                    href={
                      form.featuredImage
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open original image"
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white/[0.05]
                      !text-white/40
                      transition
                      hover:bg-white/[0.08]
                      hover:!text-white
                    "
                  >
                    <ExternalLink
                      size={
                        14
                      }
                    />
                  </a>
                </div>
              </div>
            )}
          </EditorCard>
        </aside>
      </div>
    </AdminLayout>
  )
}

function mediaNameToAlt(name: string) {
  return name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').replace(/^\d+\s*/, '').trim()
}

function MediaPickerDialog({ open, onClose, onSelect }: {
  open: boolean
  onClose: () => void
  onSelect: (item: MediaItem) => void
}) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    let active = true
    async function loadMedia() {
      setLoadingMedia(true)
      setMediaError(null)
      try {
        const items = await getMediaLibrary()
        if (active) setMedia(items)
      } catch (caughtError) {
        if (active) setMediaError(getErrorMessage(caughtError, 'The Media Library could not be loaded.'))
      } finally {
        if (active) setLoadingMedia(false)
      }
    }
    void loadMedia()
    return () => { active = false }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const filteredMedia = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return media
    return media.filter((item) =>
      item.name.toLowerCase().includes(normalized) ||
      item.path.toLowerCase().includes(normalized),
    )
  }, [media, query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[180] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="media-picker-title"
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0d1118] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d64a52]">Featured Image</p>
            <h2 id="media-picker-title" className="mt-1 text-xl font-semibold">Choose from Media Library</h2>
            <p className="mt-1 text-xs text-white/35">Reuse an existing image without uploading another copy.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Media Library"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/55 transition hover:bg-white/[0.10] hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="border-b border-white/[0.07] p-4 sm:px-6">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
            <input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Media Library..." className={`${inputClass} pl-11`} />
          </div>
        </div>

        <div className="min-h-[320px] flex-1 overflow-y-auto p-4 sm:p-6">
          {loadingMedia ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-[4/3] animate-pulse rounded-[18px] bg-white/[0.06]" />
              ))}
            </div>
          ) : mediaError ? (
            <div className="flex min-h-[300px] items-center justify-center text-center">
              <div><ImageIcon size={24} className="mx-auto text-white/20" /><p className="mt-3 text-sm text-red-200">{mediaError}</p></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center text-center">
              <div>
                <Images size={25} className="mx-auto text-white/20" />
                <p className="mt-3 text-sm font-semibold text-white/55">{query.trim() ? 'No matching images' : 'No images in the Media Library'}</p>
                <p className="mt-1 text-xs text-white/30">{query.trim() ? 'Try a different search.' : 'Upload an image from the Featured Image panel first.'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {filteredMedia.map((item) => (
                <button key={item.path} type="button" onClick={() => onSelect(item)}
                  className="group overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.03] text-left transition hover:border-[#AD2730]/55 hover:bg-white/[0.06]">
                  <div className="aspect-[4/3] overflow-hidden bg-black/25">
                    <img src={item.url} alt={item.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-semibold text-white/65">{item.name}</p>
                    <p className="mt-1 truncate text-[9px] text-white/25">{item.path}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] px-5 py-4 sm:px-6">
          <p className="text-[10px] text-white/30">{filteredMedia.length} {filteredMedia.length === 1 ? 'image' : 'images'}</p>
          <button type="button" onClick={onClose}
            className="rounded-full border border-white/[0.10] px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white">Cancel</button>
        </div>
      </div>
    </div>
  )
}

function EditorSaveStatus({
  dirty,
  saving,
}: {
  dirty: boolean
  saving: boolean
}) {
  if (saving) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-white/[0.08]
          bg-white/[0.04]
          px-3
          py-1.5
          text-[10px]
          font-semibold
          text-white/40
        "
      >
        <LoaderCircle
          size={11}
          className="animate-spin"
        />

        Saving
      </span>
    )
  }

  if (dirty) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-amber-400/20
          bg-amber-400/[0.07]
          px-3
          py-1.5
          text-[10px]
          font-semibold
          text-amber-200
        "
      >
        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-amber-300
          "
        />

        Unsaved changes
      </span>
    )
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-emerald-400/15
        bg-emerald-400/[0.05]
        px-3
        py-1.5
        text-[10px]
        font-semibold
        text-emerald-200/75
      "
    >
      <Check
        size={11}
      />
      Saved
    </span>
  )
}

function EditorCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section
      className="
        rounded-[24px]
        border
        border-white/[0.08]
        bg-white/[0.03]
        p-5
        backdrop-blur-xl
        sm:p-6
      "
    >
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      {description && (
        <p
          className="
            mt-1
            text-xs
            leading-6
            text-white/35
          "
        >
          {description}
        </p>
      )}

      <div className="mt-5 space-y-5">
        {children}
      </div>
    </section>
  )
}

function EditorLabel({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          block
          text-xs
          font-semibold
          text-white/55
        "
      >
        {label}

        {required && (
          <span
            className="
              ml-1
              text-[#d64a52]
            "
          >
            *
          </span>
        )}

        {hint && (
          <span className="ml-2 text-[10px] font-normal text-white/25">
            {hint}
          </span>
        )}
      </span>

      {children}
    </label>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (
    checked: boolean,
  ) => void
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        rounded-[18px]
        border
        border-white/[0.07]
        bg-black/10
        p-4
      "
    >
      <div>
        <p className="text-sm font-semibold">
          {label}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-white/35
          "
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={
          checked
        }
        onClick={() =>
          onChange(
            !checked,
          )
        }
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition

          ${
            checked
              ? 'bg-[#AD2730]'
              : 'bg-white/[0.10]'
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow
            transition

            ${
              checked
                ? 'left-6'
                : 'left-1'
            }
          `}
        />
      </button>
    </div>
  )
}

function CharacterCount({
  current,
  recommended,
}: {
  current: number
  recommended: number
}) {
  return (
    <p
      className="
        mt-2
        text-right
        text-[10px]
        text-white/25
      "
    >
      {current} / ~
      {recommended}
    </p>
  )
}

function EditorLoading() {
  return (
    <div className="animate-pulse">
      <div
        className="
          h-4
          w-28
          rounded
          bg-white/[0.06]
        "
      />

      <div
        className="
          mt-8
          h-10
          w-64
          rounded
          bg-white/[0.08]
        "
      />

      <div
        className="
          mt-10
          grid
          gap-6
          xl:grid-cols-[1fr_360px]
        "
      >
        <div
          className="
            h-[650px]
            rounded-[24px]
            bg-white/[0.04]
          "
        />

        <div
          className="
            h-[420px]
            rounded-[24px]
            bg-white/[0.04]
          "
        />
      </div>
    </div>
  )
}

const inputClass = `
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
  transition
  placeholder:text-white/20
  focus:border-[#AD2730]/60
  focus:ring-2
  focus:ring-[#AD2730]/10
`

const textareaClass = `
  w-full
  resize-y
  rounded-[14px]
  border
  border-white/[0.08]
  bg-black/20
  px-4
  py-3
  text-sm
  leading-6
  text-white
  outline-none
  transition
  placeholder:text-white/20
  focus:border-[#AD2730]/60
  focus:ring-2
  focus:ring-[#AD2730]/10
`
