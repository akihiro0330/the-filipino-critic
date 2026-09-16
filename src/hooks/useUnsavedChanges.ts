import { useCallback, useEffect, useRef } from 'react'
import { useBlocker } from 'react-router-dom'

export function useUnsavedChanges(isDirty: boolean) {
  const allowNextNavigationRef = useRef(false)

  const shouldBlock = useCallback(
    ({
      currentLocation,
      nextLocation,
    }: {
      currentLocation: {
        pathname: string
        search: string
        hash: string
      }
      nextLocation: {
        pathname: string
        search: string
        hash: string
      }
    }) => {
      if (allowNextNavigationRef.current) {
        allowNextNavigationRef.current = false
        return false
      }

      if (!isDirty) {
        return false
      }

      return (
        currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search ||
        currentLocation.hash !== nextLocation.hash
      )
    },
    [isDirty],
  )

  const blocker = useBlocker(shouldBlock)

  useEffect(() => {
    if (!isDirty) {
      return
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  function allowNextNavigation() {
    allowNextNavigationRef.current = true
  }

  function proceed() {
    if (blocker.state === 'blocked') {
      blocker.proceed()
    }
  }

  function reset() {
    if (blocker.state === 'blocked') {
      blocker.reset()
    }
  }

  return {
    blocker,
    isBlocked: blocker.state === 'blocked',
    proceed,
    reset,
    allowNextNavigation,
  }
}