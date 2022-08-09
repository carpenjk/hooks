import { useState } from 'react';
import useIsoLayoutEffect from './UseIsoLayoutEffect';

// Scales an element of a given reference based on given conditions
// using element transform style
//
// @param elementRef: element to scale
// @param scaleUp: bln condition that triggers scale to be applied
// @param scale: scale value to be used
// @param scaleOnHover: bln condition to scale on hover
//
// @return
//  {
//  scale:    function to override scale to true regardless of conditions.
//            scale remains until unscaled
//  unScale:  function to unset scale override defaulting back to conditions
//  onMouseEnter: function to pass to element onMouseEnter
//  onMouseLeave: function to pass to element onMouseLeave
//  }
const useScale = ({ elementRef, scaleUp, scale, scaleOnHover }) => {
  const [override, setOverride] = useState(scaleUp);
  function handleMouseEnter() {
    if (elementRef.current && scaleOnHover) {
      elementRef.current.style.transform = `scale(${scale})`;
    }
  }

  function handleMouseLeave() {
    if (elementRef.current && !scaleUp && !override && scaleOnHover) {
      elementRef.current.style.transform = 'none';
    }
  }

  function overrideScale() {
    setOverride(true);
  }
  function resetOverride() {
    setOverride(false);
  }
  useIsoLayoutEffect(() => {
    if (!elementRef.current) {
      return;
    }
    if (override || scaleUp) {
      elementRef.current.style.transform = `scale(${scale})`;
    } else {
      elementRef.current.style.transform = 'none';
    }
  }, [scaleUp, override, elementRef, scaleOnHover]);

  return {
    scale: overrideScale,
    unScale: resetOverride,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
};

export default useScale;
