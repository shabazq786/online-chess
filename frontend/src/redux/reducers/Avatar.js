const Avatar = (state = "", action) => {
  switch (action.type) {
    case 'UPDATE_AVATAR':
      return action.src

    default:
      return state;
  }
}
export default Avatar;