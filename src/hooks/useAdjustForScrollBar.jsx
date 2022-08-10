import useIsoLayoutEffect from './useIsoLayoutEffect'
import useScrollBarWidth from './useScrollBarWidth'

const useAdjustForScrollBar = (element) => {
  const scrollBarWidth = useScrollBarWidth()
  useIsoLayoutEffect(() => {
    if (element.current) {
      if (scrollBarWidth) {
        element.current.style.paddingRight = `${scrollBarWidth}px`
      }
    }
  }, [element.current, scrollBarWidth])
}

export default useAdjustForScrollBar
