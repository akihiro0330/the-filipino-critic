import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  description?: string
  duration: number
}

interface ToastInput {
  type?: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextValue {
  toasts: ToastItem[]

  showToast: (
    input: ToastInput,
  ) => string

  success: (
    title: string,
    description?: string,
  ) => string

  error: (
    title: string,
    description?: string,
  ) => string

  warning: (
    title: string,
    description?: string,
  ) => string

  info: (
    title: string,
    description?: string,
  ) => string

  dismissToast: (
    id: string,
  ) => void

  dismissAll: () => void
}

const ToastContext =
  createContext<ToastContextValue | null>(
    null,
  )

const DEFAULT_DURATION = 4500

function createToastId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

export function ToastProvider({
  children,
}: {
  children: ReactNode
}) {
  const [toasts, setToasts] =
    useState<ToastItem[]>([])

  const timersRef = useRef<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map())

  const dismissToast = useCallback(
    (id: string) => {
      setToasts((current) =>
        current.filter(
          (toast) =>
            toast.id !== id,
        ),
      )

      const timer =
        timersRef.current.get(id)

      if (timer) {
        clearTimeout(timer)
        timersRef.current.delete(id)
      }
    },
    [],
  )

  const showToast = useCallback(
    ({
      type = 'info',
      title,
      description,
      duration = DEFAULT_DURATION,
    }: ToastInput) => {
      const id =
        createToastId()

      const toast: ToastItem = {
        id,
        type,
        title,
        description,
        duration,
      }

      setToasts(
        (current) => [
          ...current,
          toast,
        ],
      )

      if (duration > 0) {
        const timer =
          setTimeout(() => {
            setToasts(
              (current) =>
                current.filter(
                  (item) =>
                    item.id !==
                    id,
                ),
            )

            timersRef.current.delete(
              id,
            )
          }, duration)

        timersRef.current.set(
          id,
          timer,
        )
      }

      return id
    },
    [],
  )

  const success =
    useCallback(
      (
        title: string,
        description?: string,
      ) =>
        showToast({
          type: 'success',
          title,
          description,
        }),
      [showToast],
    )

  const error =
    useCallback(
      (
        title: string,
        description?: string,
      ) =>
        showToast({
          type: 'error',
          title,
          description,
          duration: 6500,
        }),
      [showToast],
    )

  const warning =
    useCallback(
      (
        title: string,
        description?: string,
      ) =>
        showToast({
          type: 'warning',
          title,
          description,
          duration: 5500,
        }),
      [showToast],
    )

  const info =
    useCallback(
      (
        title: string,
        description?: string,
      ) =>
        showToast({
          type: 'info',
          title,
          description,
        }),
      [showToast],
    )

  const dismissAll =
    useCallback(() => {
      timersRef.current.forEach(
        (timer) => {
          clearTimeout(timer)
        },
      )

      timersRef.current.clear()

      setToasts([])
    }, [])

  useEffect(() => {
    const timers =
      timersRef.current

    return () => {
      timers.forEach(
        (timer) => {
          clearTimeout(timer)
        },
      )

      timers.clear()
    }
  }, [])

  const value =
    useMemo<ToastContextValue>(
      () => ({
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        dismissToast,
        dismissAll,
      }),
      [
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        dismissToast,
        dismissAll,
      ],
    )

  return (
    <ToastContext.Provider
      value={value}
    >
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context =
    useContext(
      ToastContext,
    )

  if (!context) {
    throw new Error(
      'useToast must be used inside ToastProvider.',
    )
  }

  return context
}