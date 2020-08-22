const SelectedSquare = (state = -1, action) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_SQUARE':
      return action.pos;

    default:
      return state;
  }
}
export default SelectedSquare;