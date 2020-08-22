const CapturedPiece = (state = {piece: -1, color:-1}, action) => {
  switch (action.type) {
    case 'CAPTURED':
      let newState = {piece:action.obj.piece, color:action.obj.color};
      return newState
      
    default:
      return state;
  }
}
export default CapturedPiece;