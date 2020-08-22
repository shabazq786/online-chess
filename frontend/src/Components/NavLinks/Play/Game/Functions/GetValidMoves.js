import {store} from '../../../../../store'
import {action_ShowValidMoves, action_UpdateSelectedSquare} from '../../../../../redux/actions/actions'
import {PlayerColor} from '../Globals/index'

export function GetValidMoves(pos) {
  let CurrentPieces = store.getState().CurrentPieces;
  let CurrentTurn = store.getState().CurrentTurn;
  let GameSession = store.getState().GameSession;
  
  if ((CurrentTurn !== PlayerColor && GameSession) || !CurrentPieces.has(pos) || CurrentPieces.get(pos).color !== CurrentTurn || (Object.keys(CurrentPieces.get(pos).validMoves).length === 0)) {
    store.dispatch(action_UpdateSelectedSquare(-1));
    store.dispatch(action_ShowValidMoves('RESET',[]));
  }
  else {
    store.dispatch(action_UpdateSelectedSquare(pos));
    store.dispatch(action_ShowValidMoves('VALID_MOVES',CurrentPieces.get(pos).validMoves));
  }
  return;
}