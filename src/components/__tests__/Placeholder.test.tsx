import React from 'react';
import { create } from 'react-test-renderer';

import parseStyle from '../../utils/parseStyle';
import { Ghost } from '../Ghost';
import { Placeholder, PlaceholderProps } from '../Placeholder';

const hasClass = (className: string, expectedClass: string) => {
  return className.indexOf(expectedClass) > -1;
};

const itemsCount = 2;
const svgText = `<svg style="width:100%; height:100%;">
<rect x="10%" y="10%" rx="4" ry="4" width="45%" height="10"></rect>
<rect x="60%" y="10%" rx="4" ry="4" width="35%" height="10"></rect>
</svg>`;
const containerClassName = 'myContainerClass';
const containerStyle = 'width:400px;height:300px;';
const itemClassName = 'myItemClass';
const itemStyle = 'height:20px';

const props: PlaceholderProps = {
  skeletonSVG: svgText,
  repeatCount: itemsCount,
  containerClassName: containerClassName,
  containerStyle: parseStyle(containerStyle),
  itemClassName: itemClassName,
  itemStyle: parseStyle(itemStyle),
};

describe('Placeholder Component Test Unit', () => {
  const testRenderer = create(<Placeholder {...props} />);
  const divItems = testRenderer.root.findAllByType('div');

  it('should render one container', () => {
    const myContainers = divItems.filter(i =>
      hasClass(i.props.className, containerClassName)
    );
    expect(myContainers.length).toBe(1);
    expect(myContainers[0].props.style.height).toBe('300px');
  });

  it('should render ghosts inside container', () => {
    const myItems = divItems.filter(i =>
      hasClass(i.props.className, itemClassName)
    );
    expect(myItems.length).toBe(2);
    expect(myItems[0].props.style.height).toBe('20px');
  });

  it('should pass SVG to the ghost', () => {
    const ghostItems = testRenderer.root.findAllByType(Ghost);
    expect(ghostItems[0].props.skeletonSVG).toBe(svgText);
  });
});
