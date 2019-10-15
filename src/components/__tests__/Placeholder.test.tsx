import { Placeholder, PlaceholderProps } from '../Placeholder';

import React from 'react';
import parseStyle from '../../utils/parseStyle';
import { render } from '@testing-library/react';

describe('Placeholder Component Test Unit', () => {
  it('should render correctly', () => {
    const props: PlaceholderProps = {
      skeletonSVG: `<svg style="width:100%; height:100%;">
        <rect x="10%" y="10%" rx="4" ry="4" width="45%" height="10"></rect>
        <rect x="60%" y="10%" rx="4" ry="4" width="35%" height="10"></rect>
      </svg>`,
      repeatCount: 2,
      containerClassName: 'myContainerClass',
      containerStyle: parseStyle('width:400px;height:300px;'),
      itemClassName: 'myItemClass',
      itemStyle: parseStyle('height:20px;'),
    };
    const { container } = render(<Placeholder {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
