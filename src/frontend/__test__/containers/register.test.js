import React from 'react';
import { mount } from 'enzyme';
import Register from '../../containers/Register';
import ProviderMocks from '../../__mocks__/providerMocks';

describe('<Register>', () => {
  test('', () => {
    const preventDefault = jest.fn();
    const register = mount(
      <ProviderMocks>
        <Register></Register>
      </ProviderMocks>
    );

    register.find('form').simulate('submit', { preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    register.unmount();
  });
});
