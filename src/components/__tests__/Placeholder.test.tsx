import Placeholder from '../Placeholder';
import React from 'react';
import { render } from '@testing-library/react';

describe('Placeholder Component Test Unit', () => {
  it('should render correctly', () => {
    const props = { dummyKey: 'SOME_DUMMY_KEY' };
    const { container } = render(<Placeholder {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
