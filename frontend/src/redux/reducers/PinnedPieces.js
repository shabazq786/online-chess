const PinnedPieces = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_PINNED_PIECES':
      return action.map;

    default:
      return state;
  }
}
export default PinnedPieces;