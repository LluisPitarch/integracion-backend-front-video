import axios from 'axios';

export const setFavorite = (payload) => ({
  type: 'SET_FAVORITE',
  payload,
});

export const loginRequest = (payload) => ({
  type: 'LOGIN_REQUEST',
  payload,
});

export const logoutRequest = (payload) => ({
  type: 'LOGOUT_REQUEST',
  payload,
});

export const registerRequest = (payload) => ({
  type: 'REGISTER_REQUEST',
  payload,
});

export const deleteFavorite = (payload) => ({
  type: 'DELETE_FAVORITE',
  payload,
});

export const getVideoSource = (payload) => ({
  type: 'GET_VIDEO_SOURCE',
  payload,
});

export const setError = (payload) => ({
  type: 'SET_ERROR',
  payload,
});

export const setSearch = (payload) => ({
  type: 'SET_SEARCH',
  payload,
});

export const registerUser = (payload, redirectURL) => {
  return (dispatch) => {
    axios
      .post('auth/sign-up/', payload)
      .then(({ data }) => dispatch(registerRequest(data)))
      .then(() => {
        window.location.href = redirectURL;
      })
      .catch((error) => dispatch(setError(error)));
  };
};

export const loginUser = ({ email, password }, redirectUrl) => {
  return (dispatch) => {
    if (email && password) {
      dispatch(setError(''));
      axios({
        url: '/auth/sign-in',
        method: 'post',
        auth: {
          username: email,
          password,
        },
      })
        .then(({ data }) => {
          document.cookie = `email=${data.user.email}`;
          document.cookie = `name=${data.user.name}`;
          document.cookie = `id=${data.user.id}`;
          dispatch(loginRequest(data.user));
        })
        .then(() => {
          window.location.href = redirectUrl;
        })
        .catch((err) => dispatch(setError('wrong email or password')));
    } else {
      dispatch(setError('Set your data access in the fields'));
    }
  };
};

export const addToFavoriteUserMovies = (payload) => {
  return (dispatch) => {
    axios
      .post('/user-movies', payload)
      .then(() => dispatch(setFavorite(payload)))
      .catch((error) => dispatch(setError(error)));
  };
};

export const deleteFromFavoriteUserMovies = (payload) => {
  return (dispatch) => {
    axios
      .delete(`/user-movies/${payload._id}`)
      .then(() => dispatch(deleteFavorite(payload.id)))
      .catch((error) => dispatch(setError(error)));
  };
};

export { setFavorite as default };
