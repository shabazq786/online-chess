import {store} from '../../../../../store'
import {PlayerColor} from '../Globals/PlayerColor'
import {GameResult, action_UpdateGameSession, action_MoveTo, action_CapturePiece, action_Switch,action_LastMove, action_Promote, action_Delete, action_UpdateValidMoves} from '../../../../../redux/actions/actions'
import {AllPossibleMoves, AttackOnKing} from './index'
import {LastCaptureMove, updateLastCaptureMove} from '../Globals/index'
import { notification } from 'antd';

let num_Moves = 0;

export function MoveTo(prev_pos, new_pos) {
  let captured_piece = store.getState().CurrentPieces.get(new_pos);
  let selected_piece = store.getState().CurrentPieces.get(prev_pos);
  let GameSession = store.getState().GameSession;
  //move piece
  store.dispatch(action_MoveTo(prev_pos,new_pos));
  num_Moves++;
    
  //capture piece
  if (captured_piece) {
    store.dispatch(action_CapturePiece(captured_piece));
    updateLastCaptureMove(num_Moves);
  }

  //promotion
  if (selected_piece.piece === 0 && ((selected_piece.color === 0 && Math.floor(new_pos/8) === 7) || (selected_piece.color === 1 && Math.floor(new_pos/8) === 0))) {
    store.dispatch(action_Promote(new_pos));
  }

  //en passant
  if (!captured_piece && (selected_piece.piece === 0 && (Math.abs(new_pos - prev_pos) % 8 !== 0))) {
    let color = (selected_piece.color + 1) % 2;
    let diff = new_pos - prev_pos;
    if (diff === -9 || diff === 7){
      store.dispatch(action_Delete(prev_pos - 1));
    }
    else {
      store.dispatch(action_Delete(prev_pos + 1));
    }
    store.dispatch(action_CapturePiece({piece:0,color:color}));
    updateLastCaptureMove(num_Moves);
  }
  //50 moves rule
  if((num_Moves - LastCaptureMove) === 100 && GameSession) {
    notification.info({
      message: "Draw by 50 moves rule"
  })
    if (PlayerColor === 1) { 
      store.dispatch(GameResult("Draw"))
    }
    store.dispatch(action_UpdateGameSession(false))
  }
  //castling
  if (selected_piece.piece === 5 && Math.abs(prev_pos - new_pos) !== 1){
    if (new_pos === 6){
      store.dispatch(action_MoveTo(7,5));
    }
    else if (new_pos === 2){
      store.dispatch(action_MoveTo(0,3));
    }
    else if (new_pos === 62){
      store.dispatch(action_MoveTo(63,61));
    }
    else if (new_pos === 58){
      store.dispatch(action_MoveTo(56,59));
    }
  }

  //switch turns
  store.dispatch(action_Switch());

  //update last two moves
  store.dispatch(action_LastMove([prev_pos,new_pos]));

  //update allPossibleMoves
  let CurrentTurn = store.getState().CurrentTurn;
  let map = {};
  let attacked_squares = {};
  let king_pos = -1;
  
  for (const [key,value] of store.getState().CurrentPieces.entries()) {
    if (value.color !== CurrentTurn) {
      attacked_squares = {...attacked_squares,...AllPossibleMoves(key,{})};
    }
    if (value.color === CurrentTurn && value.piece === 5) {
      king_pos = key;
    }
  }
  if (king_pos === -1) {
    notification.error({
      message: "Error has occurred, King not found!"
  })
    window.location.reload();
  }
  AttackOnKing(king_pos);
  let validMoves_ct = 0;

  for (const [key,value] of store.getState().CurrentPieces.entries()) {
    if (value.color === CurrentTurn) {
      map[key] = AllPossibleMoves(key,attacked_squares)
      validMoves_ct += Object.keys(map[key]).length;
    }
    else {
      map[key] = {};
    }
  }

  map[king_pos] = AllPossibleMoves(king_pos,attacked_squares);
  let InCheck = store.getState().InCheck

  //checkmate/stalemate
  if (InCheck && validMoves_ct === 0 && GameSession) {
    if (CurrentTurn === 0){
      notification.info({
        message: "White wins by Checkmate"
    })
      if(PlayerColor === 1) {
        store.dispatch(GameResult("Win"))
      }
    }
    else {
      notification.info({
        message: "Black wins by Checkmate"
    })
      if(PlayerColor === 0) {
        store.dispatch(GameResult("Win"))
      }
    }
    store.dispatch(action_UpdateGameSession(false))
  }
  if (!InCheck && validMoves_ct === 0 && GameSession){
    notification.info({
      message: "Draw by Stalemate"
  })
    if (PlayerColor === 1) {
      store.dispatch(GameResult("Draw"))
    }
    store.dispatch(action_UpdateGameSession(false))
  }
  store.dispatch(action_UpdateValidMoves(map));  
}