/*
From https://github.com/danilowoz/react-content-loader
*/

import React from 'react';

interface SkeletonProps {
  style?: React.CSSProperties;
  rtl?: boolean;
  speed: number;
  animate: boolean;
  animateInterval: number;
  width: number;
  height: number;
  gradientRatio: number;
  ariaLabel?: string;
  skeletonSVG: string;
  className: string;
  uniquekey?: string;
  primaryColor: string;
  primaryOpacity: number;
  secondaryColor: string;
  secondaryOpacity: number;
  preserveAspectRatio: string;
}

const randomId = (): string =>
  Math.random()
    .toString(36)
    .substring(2);

export default class Skeleton extends React.Component<SkeletonProps> {
  private skelatonPlaceRef: React.RefObject<SVGClipPathElement>;

  constructor(props: SkeletonProps) {
    super(props);
    this.skelatonPlaceRef = React.createRef();
  }

  componentDidMount() {
    this.skelatonPlaceRef.current!.innerHTML = this.props.skeletonSVG;
  }

  render() {
    const props = this.props;
    const clipId = props.uniquekey ? `${props.uniquekey}-clipId` : randomId();
    const gradientId = props.uniquekey
      ? `${props.uniquekey}-gradientId`
      : randomId();
    const directionStyle = props.rtl ? { transform: 'scaleX(-1)' } : {};
    const timeDuration = `${props.speed}s`;
    const keyTimes = `0; ${props.animateInterval}; 1`;

    return (
      <svg
        role="img"
        style={{ ...props.style, ...directionStyle }}
        className={props.className}
        aria-label={props.ariaLabel ? props.ariaLabel : null}
        viewBox={`0 0 ${props.width} ${props.height}`}
        preserveAspectRatio={props.preserveAspectRatio}
        {...props}
      >
        {props.ariaLabel ? <title>{props.ariaLabel}</title> : null}
        <rect
          x="0"
          y="0"
          width={props.width}
          height={props.height}
          clipPath={`url(#${clipId})`}
          style={{ fill: `url(#${gradientId})` }}
        />
        <defs>
          <clipPath id={clipId} ref={this.skelatonPlaceRef}></clipPath>
          <linearGradient id={gradientId}>
            <stop
              offset="0%"
              stopColor={props.primaryColor}
              stopOpacity={props.primaryOpacity}
            >
              {props.animateInterval && (
                <animate
                  attributeName="offset"
                  values={`${-props.gradientRatio}; ${-props.gradientRatio}; 1`}
                  keyTimes={keyTimes}
                  dur={timeDuration}
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop
              offset="50%"
              stopColor={props.secondaryColor}
              stopOpacity={props.secondaryOpacity}
            >
              {props.animateInterval && (
                <animate
                  attributeName="offset"
                  values={`${-props.gradientRatio / 2}; ${-props.gradientRatio /
                    2}; ${1 + props.gradientRatio / 2}`}
                  keyTimes={keyTimes}
                  dur={timeDuration}
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop
              offset="100%"
              stopColor={props.primaryColor}
              stopOpacity={props.primaryOpacity}
            >
              {props.animateInterval && (
                <animate
                  attributeName="offset"
                  values={`0; 0; ${1 + props.gradientRatio}`}
                  keyTimes={keyTimes}
                  dur={timeDuration}
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>
        </defs>
      </svg>
    );
  }
}
