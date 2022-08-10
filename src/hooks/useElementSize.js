import { useRef, useState } from 'react'
import useIsoLayoutEffect from './useIsoLayoutEffect'

const useElementSize = () => {
  const [size, setSize] = useState({ height: 0, width: 0 })
  const elementRef = useRef(null)

  useIsoLayoutEffect(() => {
    if (elementRef.current) {
      setSize({
        height: elementRef.current.clientHeight,
        width: elementRef.current.clientWidth
      })
    }
  }, [])
  return { elementRef, size }
}

export default useElementSize
