import React from 'react';

import { WidgetProps } from './@typings';
import { Placeholder, PlaceholderProps } from './components/Placeholder';
import parseStyle from './utils/parseStyle';

//import styleAsString from './style/style.scss';

/**
 * This file is to define how your widget is shown in
 *  - Studio Pro: Design Mode (Mendix 8) / View Mode (Mendix 7)
 *  - Studio
 *
 * You need to export `preview` as a normal React component.
 * NOTE: it has to be lower-case, named export.
 *
 * It's better that `preview` is only a dumb component,
 * because the whole purpose of this file is to show "HOW IT LOOKS".
 * Smart components might fail to render in some cases.
 *
 * To inject css for your `preview`, export another named function `getPreviewCss`
 * This function should return compiled css as string.
 * We use `@researchgate/babel-plugin-transform-scss-import-to-string`
 * so we can just import our scss as string.
 */

export const preview = (props: WidgetProps) => {
  const nextProps: PlaceholderProps = {
    style: parseStyle(props.style),
    className: props.className,
    animate: true,
    animateInterval: 0.25,
    ariaLabel: 'Loading content ...',
    gradientRatio: 2,
    width: props.width,
    height: props.height,
    preserveAspectRatio: 'none',
    primaryColor: '#f0f0f0',
    primaryOpacity: 1,
    secondaryColor: '#e0e0e0',
    secondaryOpacity: 1,
    rtl: false,
    speed: 2,
    skeletonSVG: props.placeholderSkeleton,
    repeatCount: props.repeatCount,
  };

  return <Placeholder {...nextProps} />;
};

export function getPreviewCss() {
  return '';
}
