const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FAVORITE':
      return {
        ...state,
        myList: [...state.myList, action.payload],
      };
    case 'DELETE_FAVORITE':
      return {
        ...state,
        myList: state.myList.filter((items) => items.id !== action.payload),
      };
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
    case 'LOGOUT_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'GET_VIDEO_SOURCE':
      return {
        ...state,
        playing:
          state.trends
            .concat(state.originals)
            .find((item) => item.id === action.payload) || {},
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_SEARCH':
      return {
        ...state,
        search: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
