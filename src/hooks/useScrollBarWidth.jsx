import { useState } from 'react';
import useIsoLayoutEffect from './UseIsoLayoutEffect';

const useScrollBarWidth = () => {
  const [scrollBarWidth, setScrollBarWidth] = useState(17);

  useIsoLayoutEffect(() => {
    setScrollBarWidth(window.innerWidth - document.documentElement.clientWidth);
  }, []);

  return scrollBarWidth;
};

export default useScrollBarWidth;
