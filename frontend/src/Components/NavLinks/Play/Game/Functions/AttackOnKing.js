import {store} from '../../../../../store'
import {updateValidCheckMoves} from '../Globals/index'
import {action_UpdateInCheck, action_UpdatePinnedPieces} from '../../../../../redux/actions/actions'

var CurrentPieces;
var ValidCheckMoves = new Map();
var row;
var col;
var color; 
var inCheck;
var direction;
var PinnedPieces;

function check_bound(r,c) {
  if (r < 0 || c < 0 || r > 7 || c > 7){
    return false;
  }
  return true;
}

function FindAttacks_iter(i, j) {
  let pos;
  let pos_row;
  let pos_col;
  let defender = -1;
  let temp_inCheck = 0;
  let temp_ValidCheckMoves = {};

  while (true) {
    pos_row = row - i;
    pos_col = col - j;
    pos = 8*(pos_row) + (pos_col);

    //out of bound - no attacker
    if (!check_bound(pos_row,pos_col)) {
      defender = -1;
      break;
    }

    else if (!CurrentPieces.has(pos) || CurrentPieces.get(pos).color === color ) {
      //empty square
      if (!CurrentPieces.has(pos)) {
        temp_ValidCheckMoves[pos] = 0;
      }
      if(CurrentPieces.has(pos) && CurrentPieces.get(pos).color === color) {
        if (defender === -1){
          defender = pos;
        }
        //double defender
        else {
          defender = -1;
          break;
        }
      }
      if (i < 0) {
        i -= 1;
      }
      if (i > 0) {
        i += 1;
      }
      if (j < 0) {
        j -= 1;
      }
      if (j > 0) {
        j += 1;
      }
      continue;
    }
    //attackers
    else if (CurrentPieces.get(pos).color !== color) {
      //pawn
      if(CurrentPieces.get(pos).piece === 0) {
        if (((pos - (8*row + col)) === -7 || (pos - (8*row + col)) === -9) && CurrentPieces.get(pos).color === 0) {
          temp_ValidCheckMoves[pos] = 0;
          temp_inCheck++;
          inCheck++;
        }
        else if(((pos - (8*row + col)) === 7 || (pos - (8*row + col)) === 9) && CurrentPieces.get(pos).color === 1) {
          temp_ValidCheckMoves[pos] = 0;
          temp_inCheck++;
          inCheck++;
        }
        else {
          temp_ValidCheckMoves = {};
        }
        defender = -1;
      }

      else if ((direction === 0 || direction === 2 || direction === 5 || direction === 7) && (CurrentPieces.get(pos).piece === 2 || CurrentPieces.get(pos).piece === 4)) {
        if (defender === -1) {
          temp_ValidCheckMoves[pos] = 0;
          inCheck++;
          temp_inCheck++;
        }
      }
      else if ((direction === 1 || direction === 3 || direction === 4 || direction === 6) && (CurrentPieces.get(pos).piece === 3 || CurrentPieces.get(pos).piece === 4)) {
        if (defender === -1) {
          temp_ValidCheckMoves[pos] = 0;
          inCheck++;
          temp_inCheck++;
        }
      }
      else {
        defender = -1;
      }
      break;
    }
  }
  if (temp_inCheck === 1) {
    ValidCheckMoves = {...temp_ValidCheckMoves};
  }
  if (defender !== -1) {
    PinnedPieces[defender] = direction;
  }
  return;
}

function FindAttacks(i,j) {
  if (!check_bound(i,j)) {
    return;
  }
  let pos = 8*(i) + (j);
  if (CurrentPieces.has(pos) && CurrentPieces.get(pos).color !== color && CurrentPieces.get(pos).piece === 1) {
    ValidCheckMoves[pos] = 0;
    inCheck++;
  }
  return;
}

export function AttackOnKing(pos) {
    CurrentPieces = store.getState().CurrentPieces;

    row = Math.floor(pos / 8);
    col = pos % 8;
    color = CurrentPieces.get(pos).color;
    ValidCheckMoves = {};
    PinnedPieces = {};
    inCheck = 0;

    //radial attacks
    direction = 0;
    FindAttacks_iter(-1,-1);
    direction = 1;
    FindAttacks_iter(-1,0);
    direction = 2;
    FindAttacks_iter(-1,1);
    direction = 3;
    FindAttacks_iter(0,-1);
    direction = 4;
    FindAttacks_iter(0,1);
    direction = 5;
    FindAttacks_iter(1,-1);
    direction = 6;
    FindAttacks_iter(1,0);
    direction = 7;
    FindAttacks_iter(1,1);

    //knight attacks
    FindAttacks(row + 2,col + 1);
    FindAttacks(row + 2,col - 1);
    FindAttacks(row - 2,col + 1);
    FindAttacks(row - 2,col - 1);
    FindAttacks(row + 1,col + 2);
    FindAttacks(row + 1,col - 2);
    FindAttacks(row - 1,col + 2);
    FindAttacks(row - 1,col - 2);

   
    store.dispatch(action_UpdatePinnedPieces(PinnedPieces));
    if (inCheck > 0) {
      store.dispatch(action_UpdateInCheck(true));
    }
    else {
      store.dispatch(action_UpdateInCheck(false));
    }

    if (inCheck === 1) {
      updateValidCheckMoves(ValidCheckMoves);
    }
    else {
      updateValidCheckMoves({});
    }

    return;
}