import React from 'react';

import { Ghost } from './Ghost';

export interface PlaceholderProps {
  skeletonSVG: string;
  repeatCount: number;
  containerClassName: string;
  containerStyle: React.CSSProperties;
  itemClassName: string;
  itemStyle: React.CSSProperties;
}

export const Placeholder = (props: PlaceholderProps) => {
  let content = [];
  for (var i = 0; i < props.repeatCount; i++) {
    content.push(<Ghost key={i} {...props} />);
  }
  const style = { height: '100%', ...props.containerStyle };

  return (
    <div
      className={`lazyloading-data-placeholder ${props.containerClassName}`}
      style={style}
    >
      {content}
    </div>
  );
};
