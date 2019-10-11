import React from 'react';

interface GhostProps {
  skeletonSVG: string;
  //   width: number;
  //   height: number;
  itemClassName?: string;
  style?: React.CSSProperties;
}

export const Ghost = (props: GhostProps) => {
  return (
    <div
      className={props.itemClassName}
      style={props.style}
      dangerouslySetInnerHTML={{ __html: props.skeletonSVG }}
    ></div>
  );
};
