import { Placeholder, PlaceholderProps } from './components/Placeholder';

import React from 'react';
import { WidgetProps } from './@typings';
import parseStyle from './utils/parseStyle';
import styleAsString from './style/style.scss';

export const preview = (props: WidgetProps) => {
  const nextProps: PlaceholderProps = {
    skeletonSVG: props.placeholderSkeleton,
    repeatCount: props.repeatCount,
    containerClassName: props.containerClass,
    containerStyle: parseStyle(props.containerStyle),
    itemClassName: props.itemClass,
    itemStyle: parseStyle(props.itemStyle),
  };
  return <Placeholder {...nextProps} />;
};

export function getPreviewCss() {
  return styleAsString;
}
