import useIsoLayoutEffect from './UseIsoLayoutEffect';
import useScrollBarWidth from './UseScrollBarWidth';

const useAdjustForScrollBar = (element) => {
  const scrollBarWidth = useScrollBarWidth();
  useIsoLayoutEffect(() => {
    if (element.current) {
      if (scrollBarWidth) {
        element.current.style.paddingRight = `${scrollBarWidth}px`;
      }
    }
  }, [element.current, scrollBarWidth]);
};

export default useAdjustForScrollBar;
