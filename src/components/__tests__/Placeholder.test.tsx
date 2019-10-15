import React from 'react';
import { ReactTestInstance, create } from 'react-test-renderer';

import parseStyle from '../../utils/parseStyle';
import { Placeholder, PlaceholderProps } from '../Placeholder';

const hasClass = (className: string, expectedClass: string) => {
  return className.indexOf(expectedClass) > -1;
};

const itemsCount = 2;
const svgText = `<svg style="width:100%; height:100%;">
<rect x="10%" y="10%" rx="4" ry="4" width="45%" height="10"></rect>
<rect x="60%" y="10%" rx="4" ry="4" width="35%" height="10"></rect>
</svg>`;

describe('Placeholder Component Test Unit', () => {
  it('should render correctly', () => {
    const props: PlaceholderProps = {
      skeletonSVG: svgText,
      repeatCount: itemsCount,
      containerClassName: 'myContainerClass',
      containerStyle: parseStyle('width:400px;height:300px;'),
      itemClassName: 'myItemClass',
      itemStyle: parseStyle('height:20px;'),
    };

    const testRenderer = create(<Placeholder {...props} />);
    const divItems = testRenderer.root.findAllByType('div');

    const myContainers = divItems.filter(i =>
      hasClass(i.props.className, 'myContainerClass')
    );
    expect(myContainers.length).toBe(1);
    expect(myContainers[0].props.style.height).toBe('300px');

    const myItems = divItems.filter(i =>
      hasClass(i.props.className, 'myItemClass')
    );
    expect(myItems.length).toBe(2);
    expect(myItems[0].props.style.height).toBe('20px');
  });
});
