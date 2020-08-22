const GetValidMoves = (state =  {}, action) => {
  switch (action.type) {
    case 'VALID_MOVES':
      return action.map;

    case 'RESET':
      return  {};

    default:
      return state;
  }
}
export default GetValidMoves;