import * as React from 'react';

interface SliderInfo {
  isHover: boolean;
  isSeeking: boolean;
  percentage: number;
}

interface SliderProps {
  className: string;
  disabled?: boolean;
  children(data: SliderInfo);
  onSeeked?(percentage: number);
  onSeeking?();
  onChange?(percentage: number);
}

interface SliderState {
  isHover: boolean;
  isSeeking: boolean;
  percentage: number;
}

export class Slider extends React.Component<SliderProps, SliderState> {
  public ref: HTMLElement;

  constructor(props) {
    super(props);

    this.state = {
      isHover: false,
      isSeeking: false,
      percentage: 0,
    };
  }

  public componentDidMount() {
    this.ref.addEventListener('mouseenter', this.onMouseEnter);
    this.ref.addEventListener('mouseleave', this.onMouseLeave);

    this.ref.addEventListener('mousedown', this.onMouseDown);
    this.ref.addEventListener('touchstart', this.onTouchStart, {
      passive: false,
    });

    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('touchmove', this.onWindowTouchMove, {
      passive: false,
    });

    window.addEventListener('mouseup', this.onWindowMouseUp);
    window.addEventListener('touchend', this.onWindowTouchEnd, {
      passive: false,
    });
  }

  public componentWillUnmount() {
    this.ref.removeEventListener('mouseenter', this.onMouseEnter);
    this.ref.removeEventListener('mouseleave', this.onMouseLeave);

    this.ref.removeEventListener('mousedown', this.onMouseDown);
    this.ref.removeEventListener('touchstart', this.onTouchStart);

    window.removeEventListener('mousemove', this.onWindowMouseMove);
    window.removeEventListener('touchmove', this.onWindowTouchMove);

    window.removeEventListener('mouseup', this.onWindowMouseUp);
    window.removeEventListener('touchend', this.onWindowTouchEnd);
  }

  // Mouse

  public onMouseDown = event => {
    event.preventDefault();

    this.setState({ isSeeking: true });
    this.calcSliderPercentage(event.pageX);

    if (this.props.onSeeking) {
      this.props.onSeeking();
    }
  };

  public onWindowMouseMove = event => {
    this.calcSliderPercentage(event.pageX);
  };

  public onWindowMouseUp = () => {
    if (this.state.isSeeking) {
      this.setState({ isSeeking: false });

      if (this.props.onSeeked) {
        this.props.onSeeked(this.state.percentage);
      }
    }
  };

  public onMouseEnter = () => {
    this.setState({ isHover: true });
  };

  public onMouseLeave = () => {
    this.setState({ isHover: false });
  };

  // Touch

  public onTouchStart = event => {
    event.preventDefault();

    this.setState({
      isSeeking: true,
      isHover: true,
    });
    if (event.touches.length) {
      this.calcSliderPercentage(event.touches[0].pageX);
    }

    if (this.props.onSeeking) {
      this.props.onSeeking();
    }
  };

  public onWindowTouchMove = event => {
    if (event.touches.length) {
      this.calcSliderPercentage(event.touches[0].pageX);
    }
  };

  public onWindowTouchEnd = event => {
    if (this.state.isSeeking) {
      this.setState({
        isSeeking: false,
        isHover: false,
      });

      if (this.props.onSeeked) {
        this.props.onSeeked(this.state.percentage);
      }
    }
  };

  public calcSliderPercentage(pageOffsetX) {
    const scrollX = window.scrollX || window.pageXOffset;

    const bounding = this.ref.getBoundingClientRect();
    let percentage = (pageOffsetX - (bounding.left + scrollX)) / bounding.width;
    percentage = Math.min(Math.max(percentage, 0), 1);

    this.setState({ percentage });

    if (this.state.isSeeking && this.props.onChange) {
      this.props.onChange(percentage);
    }
  }

  public render() {
    const sliderInfo = {
      isHover: this.state.isHover,
      isSeeking: this.state.isSeeking,
      percentage: this.state.percentage,
    };

    return (
      <div
        className={this.props.className}
        style={{
          pointerEvents: this.props.disabled ? 'none' : 'all',
        }}
        ref={ref => {
          this.ref = ref;
        }}
      >
        {this.props.children(sliderInfo)}
      </div>
    );
  }
}
