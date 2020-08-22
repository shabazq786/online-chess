import {OpponentName} from '../../Components/NavLinks/Play/Game/Globals/OpponentName'
import {store} from '../../store'
import {notification} from 'antd'
import {URL} from '../../Url'
import axios from 'axios'

export const UPDATE_USERNAME = 'UPDATE_USERNAME'
export const UPDATE_IS_LOGGED_IN = 'UPDATE_IS_LOGGED_IN'
export const UPDATE_AVATAR = 'UPDATE_AVATAR'
export const MOVE = 'MOVE';
export const SWITCH = 'SWITCH';
export const FLIP = 'FLIP';
export const CAPTURED = 'CAPTURED';
export const LAST_MOVE = 'LAST_MOVE';
export const PROMOTE = 'PROMOTE';
export const DELETE = 'DELETE';
export const UPDATE_VALID_MOVES = 'UPDATE_VALID_MOVES'
export const UPDATE_PINNED_PIECES = 'UPDATE_PINNED_PIECES'
export const UPDATE_IN_CHECK = 'UPDATE_IN_CHECK'
export const UPDATE_SELECTED_SQUARE = 'UPDATE_SELECTED_SQUARE'
export const UPDATE_GAME_SESSION = 'UPDATE_GAME_SESSION'
export const RESET_CURRENT_PIECES = 'RESET_CURRENT_PIECES'
export const RESET_FLIP = 'RESET_FLIP'
export const RESET_TURN = 'RESET_TURN'

export function update_Username(id) {
  return {
    type: UPDATE_USERNAME,
    id
  }
}
export function update_isLoggedIn(bool) {
  return {
    type: UPDATE_IS_LOGGED_IN,
    bool
  };
}
export function update_Avatar(src) {
  return {
    type: UPDATE_AVATAR,
    src
  };
}
export function action_MoveTo(prev_pos,new_pos) {
  return { 
    type: MOVE, 
    object:{prev_pos,new_pos}
  };
}
export function action_Promote(pos){
  return {
    type: PROMOTE,pos
  };
}
export function action_Delete(pos){
  return {
    type: DELETE,pos
  };
}
export function action_ResetBoard() {
  return {
    type: RESET_CURRENT_PIECES
  };
}
export function action_Switch() {
  return {type: SWITCH};
}
export function action_resetSwitch() {
  return {type: RESET_TURN};
}

export function action_Flip() {
  return {type: FLIP};
}

export function action_resetFlip() {
  return {type: RESET_FLIP};
}

export function action_ShowValidMoves(type,map) {
  return {type,map};
}

export function action_CapturePiece(obj){
  return {type:CAPTURED, obj};
}

export function action_LastMove(arr) {
  return {type:LAST_MOVE, arr};
}

export function action_UpdateValidMoves(map) {
  return {
    type:UPDATE_VALID_MOVES,
    map
  }
}

export function action_UpdatePinnedPieces(map) {
  return {
    type:UPDATE_PINNED_PIECES,
    map
  }
}

export function action_UpdateInCheck(bool) {
  return {
    type:UPDATE_IN_CHECK,
    bool
  }
}

export function action_UpdateSelectedSquare(pos) {
  return {
    type:UPDATE_SELECTED_SQUARE,
    pos
  }
}

export function action_UpdateGameSession(bool) {
  return {
    type: UPDATE_GAME_SESSION,
    bool
  }
}

export function GameResult(result) {
  return function() {
    let Username = store.getState().Username ? store.getState().Username: "guest"
    if (Username === OpponentName) {
      return;
    }
    axios.post(`${URL}/Game/`, {player:Username, opponent:OpponentName, result:result})
      .then(res => {
        let data = res.data[0]
        if (data.error) {
          notification.error({
            message: "Error Storing Game Result!"
          })
      }})
    }
}