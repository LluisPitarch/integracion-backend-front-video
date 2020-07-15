import React from 'react';
import { mount } from 'enzyme';
import { createRenderer } from 'react-test-render';
import Header from '../../components/Header';
import ProviderMock from '../../__mocks__/providerMocks';

describe('Header', () => {
  test('Header Logo Image', () => {
    const header = mount(
      <ProviderMock>
        <Header />
      </ProviderMock>
    );

    expect(header.find('.header__img')).toHaveLength(1);
  });

  //   test('Header Snapshot', () => {
  //     const header = createRenderer(
  //       <ProviderMock>
  //         <Header />
  //       </ProviderMock>
  //     );

  // //     expect(header.find('.header__img')).toHaveLength(1);
  //   });
});
