/* 1 = White to move
   0 = Black to move
*/
const CurrentTurn = (state = 1, action) => {  
  switch (action.type) {
    case 'SWITCH':  
      let newState = (state ? 0 : 1);
      return newState;

    case 'RESET_TURN':
      return 1
      
    default:
      return state
  }
}
export default CurrentTurn;