const GameSession = (state = true, action) => {
  switch (action.type) {
    case 'UPDATE_GAME_SESSION':
      return action.bool;

    default:
      return state;
  }
}
export default GameSession;