const LastMove = (state = new Map(), action) => {
  switch (action.type) {
    case 'LAST_MOVE':
      let newState = new Map([[action.arr[0] , 0], [action.arr[1] , 0]]);
      return newState;

    default:
      return state;   
  }
}
export default LastMove;