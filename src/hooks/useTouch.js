import { useEffect, useState, useCallback } from 'react';

const useTouch = ({ onTouchLeft, onTouchRight, touchThreshold }) => {
  const derivedThreshold = touchThreshold || 40;

  function setDefaultTouch() {
    return {
      startX: false,
      startY: false,
      posX: false,
      posY: false,
      dir: false,
      distX: 0,
      distY: 0,
    };
  }

  const [touch, setTouch] = useState(setDefaultTouch());

  const onTouchStart = (e) => {
    const { clientX, clientY } = e.changedTouches[0];
    setTouch({
      startX: clientX,
      startY: clientY,
      posX: clientX,
      posY: clientY,
      distX: 0,
      distY: 0,
      dir: false,
    });
  };

  const onTouchEnd = (e) => {
    const { clientX, clientY } = e.changedTouches[0];
    function getDir(x1, x2) {
      if (x2 < x1) {
        return 'left';
      }
      return 'right';
    }

    setTouch((prevTouch) => ({
      ...prevTouch,
      posX: clientX,
      posY: clientY,
      dir: getDir(prevTouch.startX, clientX),
      distX: clientX - prevTouch.startX,
      distY: clientY - prevTouch.startY,
    }));
  };

  const handleTouchLeft = useCallback(
    (t) => {
      if (onTouchLeft && Math.abs(t.distX) >= derivedThreshold) {
        onTouchLeft();
        setTouch(() => setDefaultTouch());
      }
    },
    [onTouchLeft]
  );

  const handleTouchRight = useCallback(
    (t) => {
      if (onTouchRight && Math.abs(t.distX)) {
        onTouchRight();
        setTouch(() => setDefaultTouch());
      }
    },
    [onTouchRight]
  );

  useEffect(() => {
    // do something
    if (touch.dir === 'right') {
      handleTouchRight(touch);
    } else if (touch.dir === 'left') {
      handleTouchLeft(touch);
    }
  }, [touch, touch.distX, handleTouchLeft, handleTouchRight]);

  const touchObj = {
    touch,
    onTouchStart,
    onTouchEnd,
  };

  return touchObj;
};

export default useTouch;
