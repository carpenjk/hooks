import { useEffect, useLayoutEffect } from 'react';

const useIsoOnClickOutside = (ref, handler, deps) => {
  const useIsoLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  useIsoLayoutEffect(() => {
    const domRef = ref ? ref.current || ref : undefined;
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!domRef || domRef.contains(event.target)) {
        return;
      }
      handler(event);
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    }
  }, [ref, handler, ...deps]);
};

export default useIsoOnClickOutside;
