const isLoggedIn = (state = false, action) => {
  switch (action.type) {
    case 'UPDATE_IS_LOGGED_IN':
      return action.bool

    default:
      return state;
  }
}
export default isLoggedIn;