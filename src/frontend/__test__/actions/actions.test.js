import { setFavorite, loginRequest } from '../../actions';
import movieMocks from '../../__mocks__/movieMocks';

describe('Actions', () => {
  test('Set Favorite', () => {
    const payload = movieMocks;
    const expectedAction = {
      type: 'SET_FAVORITE',
      payload,
    };

    expect(setFavorite(payload)).toEqual(expectedAction);
  });

  test('Login', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password',
    };
    const expectedAction = {
      type: 'LOGIN_REQUEST',
      payload,
    };

    expect(loginRequest(payload)).toEqual(expectedAction);
  });
});
