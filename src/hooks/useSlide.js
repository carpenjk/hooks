import { useState, useCallback } from 'react';
import useIsoLayoutEffect from './UseIsoLayoutEffect';
import useWindowSize from './UseWindowSize';

const useSlide = ({
  items,
  itemsToDisplay,
  showMoreItem,
  initialPos,
  keyboardSelectSlot,
  parentRef,
}) => {
  const [currentPos, setCurrentPos] = useState(initialPos || 0);
  const [itemRefs, setItemRefs] = useState([]);
  const windowSize = useWindowSize();

  const atLeastOne = items.length > itemsToDisplay;
  const remainder = atLeastOne ? items.length % itemsToDisplay : 0;

  const derivedKeyboardSelectSlot =
    keyboardSelectSlot || Math.round(itemsToDisplay / 2);

  function getItemCount() {
    return showMoreItem ? items.length + 1 : items.length;
  }

  function getFilledPages() {
    return atLeastOne ? items.length / itemsToDisplay : 0;
  }
  function getItemsInLastPage() {
    return showMoreItem ? remainder + 1 : remainder;
  }
  function getPageCount() {
    return Math.ceil(getItemCount() / itemsToDisplay);
  }

  function getCurrentPage() {
    if (currentPos < itemsToDisplay) {
      return 1;
    }
    return Math.trunc((currentPos + 1) / itemsToDisplay) + 1;
  }
  function getKeyboardItem(p) {
    const pos = p || currentPos;
    return pos + derivedKeyboardSelectSlot - 1;
  }

  function getPageStart() {
    const pageFactor = getCurrentPage() - 1;
    return pageFactor * itemsToDisplay;
  }

  function getPageEnd(p) {
    const page = p || getCurrentPage();
    return page * itemsToDisplay - 1;
  }

  function getNextPageEnd() {
    return getPageEnd(getCurrentPage() + 1);
  }

  function isNextPageLast() {
    const nextPage = getCurrentPage() + 1;
    const pageCount = getPageCount();
    return nextPage === pageCount;
  }

  function getLastPos() {
    return getItemCount() - 1;
  }

  function getLastScrollPos(scrollToEnd) {
    const lastItem = getItemCount() - 1;
    if (scrollToEnd) {
      return lastItem - (derivedKeyboardSelectSlot - 1);
    }
    return getItemCount() - itemsToDisplay;
  }

  function getFirstScrollPos(scrollToEnd) {
    if (scrollToEnd) {
      return derivedKeyboardSelectSlot * -1 + 1;
    }
    return 0;
  }

  function getIndexOnPage() {
    if (getCurrentPage() === 1) {
      return currentPos;
    }
    return currentPos % getPageStart();
  }

  function isStart(p, scrollToEnd) {
    return p === getFirstScrollPos(scrollToEnd);
  }

  function isEnd(p, scrollToEnd) {
    return p === getLastScrollPos(scrollToEnd);
  }

  function getLastIndex() {
    return getItemCount() - 1;
  }

  function isCurrentPage(c) {
    const currPage = getCurrentPage();
    return c >= getPageStart(currPage) && c <= getPageEnd(currPage);
  }
  function getViewEnd() {
    return currentPos + itemsToDisplay;
  }
  function isCurrentView(c) {
    return c >= currentPos && c < getViewEnd();
  }

  // Nav functions ***************************************************************

  function pageLeft() {
    setCurrentPos((prevValue) => {
      const pageStart = getPageStart();
      if (pageStart === 0 || prevValue > pageStart) {
        return pageStart;
      }
      return pageStart - itemsToDisplay;
    });
  }

  function pageRight() {
    setCurrentPos(() => {
      if (currentPos < 0) return 0;
      const currPage = getCurrentPage();
      const isLastPage = currPage === getPageCount();
      const extendsPastKeyboardSlot =
        getItemsInLastPage() > derivedKeyboardSelectSlot;
      if (isLastPage || (isNextPageLast() && !extendsPastKeyboardSlot)) {
        return getLastPos() - derivedKeyboardSelectSlot;
      }
      return getPageEnd() + 1;
    });
  }

  function cleanLeftPos(p, scrollToEnd) {
    const firstPos = getFirstScrollPos(scrollToEnd);
    if (p < firstPos) {
      return firstPos;
    }
    return p;
  }

  function cleanRightPos(p, scrollToEnd) {
    const lastPos = getLastScrollPos(scrollToEnd);
    if (p > lastPos) {
      return lastPos;
    }
    return p;
  }

  function scrollRight(n) {
    if (n) {
      setCurrentPos((prevValue) => cleanRightPos(prevValue + n, true));
    } else {
      pageRight();
    }
  }

  function scrollLeft(n) {
    if (n) {
      setCurrentPos((prevValue) => cleanLeftPos(prevValue - n, true));
    } else {
      pageLeft();
    }
  }

  // state and lifcycle management
  const addItemRef = useCallback((item) => {
    setItemRefs((prevValue) => [...prevValue, item]);
  }, []);

  const [viewWidth, setViewWidth] = useState(-1);

  const getViewWidth = useCallback(() => {
    if (!parentRef || !parentRef.current) {
      return -1;
    }
    const contentElement = parentRef ? parentRef.current : undefined;
    const paddingLeft = contentElement
      ? window.getComputedStyle(contentElement).paddingLeft
      : '0';
    const paddingRight = contentElement
      ? window.getComputedStyle(contentElement).paddingRight
      : '0';

    const regex = /[\d]+/;
    const pxPaddingLeft = paddingLeft.match(regex)[0];
    const pxPaddingRight = paddingRight.match(regex)[0];
    const contentWidth =
      contentElement.offsetWidth - pxPaddingLeft - pxPaddingRight;
    return contentWidth;
  }, [parentRef, windowSize.width]);

  useIsoLayoutEffect(() => {
    const width = getViewWidth();
    if (width > 0) {
      setViewWidth(width);
    }
  }, [getViewWidth]);

  // build return object
  const getSlide = useCallback(
    () => ({
      items,
      addItemRef,
      itemRefs,
      parentRef,
      itemCount: showMoreItem ? items.length + 1 : items.length,
      filledPages: getFilledPages(),
      pageCount: getPageCount(),
      itemsInLastPage: getItemsInLastPage(),
      emptySlots: itemsToDisplay - getItemsInLastPage(),
      keyboardItem: getKeyboardItem(),
      scrollLeft,
      scrollRight,
      currentPos,
      currentPage: getCurrentPage(),
      indexOnPage: getIndexOnPage(),
      indexOfLast: getLastIndex(),
      pageLeft,
      pageRight,
      isStart: isStart(currentPos, true),
      isEnd: isEnd(currentPos, true),
      isPageStart: isStart(currentPos, false),
      isPageEnd: isEnd(currentPos, false),
      isCurrentPage,
      isCurrentView,
      isNextPageLast,
      nextPageEnd: getNextPageEnd(),
      viewWidth,
    }),
    [
      currentPos,
      items,
      itemsToDisplay,
      showMoreItem,
      initialPos,
      keyboardSelectSlot,
      parentRef,
      viewWidth,
    ]
  );

  const [slide, setSlide] = useState(getSlide);
  useIsoLayoutEffect(() => setSlide(getSlide), [getSlide]);

  return slide;
};

export default useSlide;
