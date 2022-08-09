import { useState, useEffect, useCallback } from 'react';

function useParentSize(element) {
  const parentElement = element ? element.parentElement : undefined;

  const getSize = () => ({
    width: parentElement ? parentElement.offsetWidth : undefined,
    height: parentElement ? parentElement.offsetHeight : undefined,
    forceUpdate: getSize,
  });

  const [parentSize, setParentSize] = useState(getSize);
  useEffect(() => {
    function handleResize() {
      setParentSize(getSize());
    }
    if (parentElement) {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [element]);

  return parentSize;
}

export default useParentSize;
