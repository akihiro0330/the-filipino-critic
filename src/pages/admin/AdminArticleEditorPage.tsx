import {
  ArrowLeft,
  Check,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  GripVertical,
  Image as ImageIcon,
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

  function validate():
    | string
    | null {
    if (
      !form.title.trim()
    ) {
      return 'Article title is required.'
    }

    if (
      !form.slug.trim()
    ) {
      return 'Article slug is required.'
    }

    if (
      !form.excerpt.trim()
    ) {
      return 'Article excerpt is required.'
    }

    if (
      !form.categoryId
    ) {
      return 'Please select a category.'
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
      return 'Add at least one paragraph to the article.'
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
      return 'Trending articles need a valid rank.'
    }

    return null
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
        form.sources,
    }
  }

  async function saveArticle(
    status: PostStatus,
  ) {
    const validationError =
      validate()

    if (
      validationError
    ) {
      toast.warning(
        'Article needs attention',
        validationError,
      )

      return
    }

    try {
      const input =
        buildInput(
          status,
        )

      if (isEditing) {
        await update(
          input,
        )

        setSavedSnapshot(
          snapshotForm(
            form,
          ),
        )

        if (
          status ===
          'published'
        ) {
          toast.success(
            article?.status ===
              'published'
              ? 'Published article updated'
              : 'Article published',
            article?.status ===
              'published'
              ? 'Your latest changes are now live.'
              : 'The article is now visible on the public website.',
          )
        } else {
          toast.success(
            'Draft saved',
            'Your article changes have been saved successfully.',
          )
        }

        return
      }

      const newPostId =
        await create(
          input,
        )

      setSavedSnapshot(
        snapshotForm(
          form,
        ),
      )

      if (
        status ===
        'published'
      ) {
        toast.success(
          'Article published',
          'The article is now live on The Filipino Critic.',
        )
      } else {
        toast.success(
          'Draft created',
          'Your new article has been saved as a draft.',
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
        status ===
          'published'
          ? 'Publishing failed'
          : 'Save failed',

        getErrorMessage(
          caughtError,
          status ===
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
                'draft',
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
              : 'Save Draft'}
          </button>

          <button
            type="button"
            disabled={
              saving ||
              uploadingImage
            }
            onClick={() =>
              void saveArticle(
                'published',
              )
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
              : article?.status ===
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
              required
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
              required
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
  children,
}: {
  label: string
  required?: boolean
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