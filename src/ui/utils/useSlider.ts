import { attachEvents } from '@src/ui/utils/attachEvents';
import { useEffect } from 'react';

function initSlider(
  element: HTMLElement,
  onChange: (state: any, prevState: any) => void,
) {
  if (!element) {
    return;
  }

  let state = {
    hover: false,
    seeking: false,
    percentage: 0,
  };

  const setState = newState => {
    const prevState = state;
    state = {
      ...state,
      ...newState,
    };
    return prevState;
  };

  const calcSliderPercentage = (pageX: number): number => {
    const scrollX = window.scrollX || window.pageXOffset;

    const bounding = element.getBoundingClientRect();
    let percentage = (pageX - (bounding.left + scrollX)) / bounding.width;
    percentage = Math.min(Math.max(percentage, 0), 1);

    return percentage;
  };

  const onMouseEnter = () => {
    const prevState = setState({ hover: true });
    onChange(state, prevState);
  };

  const onMouseLeave = () => {
    const prevState = setState({ hover: false });
    onChange(state, prevState);
  };

  const onMouseDown = event => {
    event.preventDefault();

    const prevState = setState({
      seeking: true,
      percentage: calcSliderPercentage(event.pageX),
    });

    onChange(state, prevState);
  };

  const onWindowMouseMove = event => {
    if (state.hover || state.seeking) {
      const prevState = setState({
        percentage: calcSliderPercentage(event.pageX),
      });
      onChange(state, prevState);
    }
  };

  const onWindowMouseUp = () => {
    if (state.seeking) {
      const prevState = setState({
        seeking: false,
      });
      onChange(state, prevState);
    }
  };

  const onTouchStart = event => {
    event.preventDefault();

    if (event.touches.length) {
      const prevState = setState({
        hover: true,
        seeking: true,
        percentage: calcSliderPercentage(event.touches[0].pageX),
      });

      onChange(state, prevState);
    }
  };

  const onWindowTouchMove = event => {
    if (event.touches.length) {
      const prevState = setState({
        percentage: calcSliderPercentage(event.touches[0].pageX),
      });

      onChange(state, prevState);
    }
  };

  const onWindowTouchEnd = () => {
    if (state.seeking) {
      const prevState = setState({
        hover: false,
        seeking: false,
      });

      onChange(state, prevState);
    }
  };

  const removeEvents = attachEvents([
    {
      element,
      events: ['mouseenter'],
      callback: onMouseEnter,
    },
    {
      element,
      events: ['mouseleave'],
      callback: onMouseLeave,
    },
    {
      element,
      events: ['mousedown'],
      callback: onMouseDown,
    },
    {
      element,
      events: ['touchstart'],
      callback: onTouchStart,
      passive: false,
    },
    {
      element: window as any,
      events: ['mousemove'],
      callback: onWindowMouseMove,
    },
    {
      element: window as any,
      events: ['touchmove'],
      callback: onWindowTouchMove,
      passive: false,
    },
    {
      element: window as any,
      events: ['mouseup'],
      callback: onWindowMouseUp,
    },
    {
      element: window as any,
      events: ['touchend'],
      callback: onWindowTouchEnd,
      passive: false,
    },
  ]);

  return () => removeEvents();
}

export function useSlider(element: HTMLElement, setSeekbarState) {
  useEffect(() => initSlider(element, setSeekbarState), [element]);
}
