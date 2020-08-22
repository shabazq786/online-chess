const Username = (state = "", action) => {
  switch (action.type) {
    case 'UPDATE_USERNAME':
      return action.id

    default:
      return state;
  }
}
export default Username;