import React from 'react';

interface GhostProps {
  skeletonSVG: string;
  itemClassName?: string;
  itemStyle?: React.CSSProperties;
}

const minWidth = 10;

const getLength = (maxWidth: number) => {
  let w = 0;
  do {
    w = Math.round(Math.random() * 25);
  } while (w < minWidth || w > maxWidth);
  return w;
};

const defaultSkeleton = () => {
  let topCorner = 10;
  let skeleton = '<svg style="width:100%; height:100%;">';
  do {
    let leftCorner = 10;
    do {
      let rectWidth = getLength(100 - leftCorner - minWidth);
      skeleton += `<rect x="${leftCorner}%" y="${topCorner}%" rx="4" ry="4" width="${rectWidth}%" height="10"></rect>`;
      leftCorner += rectWidth + 5;
    } while (leftCorner < 100 - 2 * minWidth);
    topCorner += 20;
  } while (topCorner < 100 - minWidth);
  return skeleton + '</svg>';
};

export const Ghost = (props: GhostProps) => {
  const style = { height: '100%', ...props.itemStyle };
  const skeletonHTML = props.skeletonSVG || defaultSkeleton();
  return (
    <div
      className={props.itemClassName}
      style={style}
      dangerouslySetInnerHTML={{ __html: skeletonHTML }}
    ></div>
  );
};
