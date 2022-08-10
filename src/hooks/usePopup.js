import { useState, useEffect } from 'react'
import useWindowSize from './useWindowSize'

const usePopup = (popupMaxSceenWidth, isSearchFiltersOpen) => {
  const windowSize = useWindowSize()
  const [isPopup, setIsPopup] = useState(false)

  useEffect(() => {
    windowSize.width <= popupMaxSceenWidth || isSearchFiltersOpen
      ? setIsPopup(true)
      : setIsPopup(false)
  }, [windowSize, isSearchFiltersOpen])

  return isPopup
}

export default usePopup
