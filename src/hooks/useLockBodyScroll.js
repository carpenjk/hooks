import { useEffect, useState } from 'react'
import useIsoLayoutEffect from './useIsoLayoutEffect'
import useHasMounted from './useHasMounted'

const useLockBodyScroll = (hideScrollbar, isLocked) => {
  const [scrollPosition, setScrollPosition] = useState()
  const hasMounted = useHasMounted()
  const [isBodyLocked, setIsBodyLocked] = useState(
    isLocked === undefined || isLocked === true
  )
  const [origOverflow, setOrigOverflow] = useState()
  const [origPosition, setOrigPosition] = useState()

  function scrollTo (pos) {
    console.log('scrollTo')
    if (hasMounted) {
      console.log('scrollTo', pos)
      window.scrollTo(0, pos)
    }
  }

  function lockBody (scrollPos) {
    if (!hideScrollbar) {
      if (isBodyLocked) {
        document.body.style.position = 'fixed'
        document.body.style.overflowY = 'scroll'
      }
    } else if (isBodyLocked) {
      document.body.style.overflow = 'hidden'
    }
    scrollTo(scrollPos)
  }

  function unLockBody (overflow, position, scrollPos) {
    document.body.style.overflow = overflow
    document.body.style.position = position
    document.body.style.overflow = 'scroll'
    document.body.style.position = 'relative'
    scrollTo(scrollPos)
  }

  useEffect(() => {
    console.log('mounted')
  }, [])

  useIsoLayoutEffect(() => {
    // Get body overflow
    const overflow = isBodyLocked
      ? window.getComputedStyle(document.body).overflow
      : origOverflow
    const position = isBodyLocked
      ? window.getComputedStyle(document.body).position
      : origPosition
    const scrollPos = isBodyLocked ? window.pageYOffset : scrollPosition

    // set initial state
    if (isBodyLocked) {
      setOrigOverflow(overflow)
      setOrigPosition(position)
      setScrollPosition(scrollPos)
      // Prevent scrolling on mount
      lockBody(scrollPos)
    } else {
      unLockBody(overflow, position, scrollPos)
    }
    scrollTo(scrollPos)
    // Re-enable scrolling when component unmounts
    return () => {
      unLockBody(overflow, position, scrollPos)
    }
  }, [isBodyLocked])

  const lock = () => setIsBodyLocked(true)
  const unlock = () => setIsBodyLocked(false)
  return {
    lock,
    unlock,
    scrollTo
  }
}

export default useLockBodyScroll
