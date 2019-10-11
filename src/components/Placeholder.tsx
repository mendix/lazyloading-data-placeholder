import React from 'react';

import Skeleton from './Skeleton';

/**
 * `style` and `class` are default properties that are not defined in widget.config.ejs
 * You need to do some extra work to make them usable
 */

export interface PlaceholderProps {
  style: React.CSSProperties;
  className: string;
  animate: boolean;
  animateInterval: number;
  ariaLabel: string;
  gradientRatio: number;
  width: number;
  height: number;
  preserveAspectRatio: string;
  primaryColor: string;
  primaryOpacity: number;
  secondaryColor: string;
  secondaryOpacity: number;
  rtl: boolean;
  speed: number;
  skeletonSVG: string;
  repeatCount: number;
}

const min = 20;

const getLength = (maxWidth: number) => {
  let w = 0;
  do {
    w = Math.round(Math.random() * 100);
  } while (w < min || w > maxWidth);
  return w;
};

const defaultSkeleton = (containerWidth: number, containerHeight: number) => {
  let topCorner = 10;
  let skeleton = '';
  do {
    let leftCorner = 10;
    do {
      let rectWidth = getLength(containerWidth - leftCorner - min);
      skeleton += `<rect x="${leftCorner}" y="${topCorner}" rx="4" ry="4" width="${rectWidth}" height="10"></rect>`;
      leftCorner += rectWidth + 20;
    } while (leftCorner < containerWidth - 2 * min);
    topCorner += 20;
  } while (topCorner < containerHeight - min);
  return skeleton;
};

export const Placeholder = (props: PlaceholderProps) => {
  let content = [];
  const childProps = {
    ...props,
    height: Math.round(props.height / props.repeatCount),
    skeletonSVG:
      props.skeletonSVG ||
      defaultSkeleton(props.width, props.height / props.repeatCount),
  };

  for (var i = 0; i < props.repeatCount; i++) {
    content.push(
      <div>
        <Skeleton key={i} {...childProps} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: props.width,
        height: props.height,
      }}
    >
      {content}
    </div>
  );
};
