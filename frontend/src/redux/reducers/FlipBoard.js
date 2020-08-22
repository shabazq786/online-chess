/*0 = white on bottom 
  1 = black on bottom
*/

const FlipBoard = (state = 0, action) => {
  switch (action.type) {
    case 'FLIP':
      let newState = (state ? 0 : 1);
      return newState;

    case 'RESET_FLIP':
      return 0

    default:
      return state;
  }
}
export default FlipBoard;