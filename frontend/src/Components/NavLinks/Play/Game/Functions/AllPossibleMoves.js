import {store} from '../../../../../store'
import {ValidCheckMoves} from '../Globals/index'

var CurrentPieces;
var CurrentTurn;
var map = new Map();
var row;
var col;
var piece; 
var color; 

function check_bound(r,c) {
  if (r < 0 || c < 0 || r > 7 || c > 7){
    return false;
  }
  return true;
}

function ValidMoves_iter(i, j) {
  let pos;
  let pos_row;
  let pos_col;
  
  while (true) {
    pos_row = row - i;
    pos_col = col - j;
    pos = 8*(pos_row) + (pos_col);
        
    if (!check_bound(pos_row,pos_col)) {
      break;
    }
    else if (!CurrentPieces.has(pos) || (CurrentTurn !== color && CurrentPieces.get(pos).color !== color && CurrentPieces.get(pos).piece === 5)) {
      map[pos] = 0;
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
      continue
    }
    else {
      if (CurrentPieces.get(pos).color !== color || (CurrentTurn !== color)) {
        map[pos] = 0;
      }
      break;
    }
  }
}

function ValidMoves(i,j) {
  if (!check_bound(i,j)) {
    return;
  }
  const pos = 8*(i) + (j);
  if (!CurrentPieces.has(pos) || CurrentPieces.get(pos).color !== color || CurrentTurn !== color) {
    map[pos] = 0;
  }
  return;
}

export function AllPossibleMoves(id,attacked_map) {

  CurrentPieces = store.getState().CurrentPieces;
  CurrentTurn = store.getState().CurrentTurn;
  const PinnedPieces = store.getState().PinnedPieces;
  const InCheck = store.getState().InCheck;

  row = Math.floor(id / 8);
  col = id % 8;
  piece = CurrentPieces.get(id).piece;
  color = CurrentPieces.get(id).color;
  map = {};
  //pawn
  if (piece === 0) {
    let pos;
    let pos_row = (color === 1) ? row - 1: row + 1;
    let pos_col = col;
    let LastMove = store.getState().LastMove;
    pos = 8*(pos_row) + pos_col;

    //single move
    if (!(id in PinnedPieces) || (PinnedPieces[id] === 1 || PinnedPieces[id] === 6)) {
      if (check_bound(pos_row,pos_col) && !CurrentPieces.has(pos) && CurrentTurn === color) {
        map[pos] = 0;
          // first move
        if (((color === 1 && row === 6) || (color === 0 && row === 1))) {
          let inc = (color === 1) ? -1: 1;
          if (!CurrentPieces.has(pos + 8*inc) && CurrentTurn === color) {
            map[pos + 8*inc] = 0;
          }
        }
      }
    }

    //diagonal capture
    pos_col = col - 1;
    pos = 8*(pos_row) + pos_col;
    if (check_bound(pos_row,pos_col) && (CurrentPieces.has(pos) && CurrentPieces.get(pos).color !== color)) {
      if(!(id in PinnedPieces) || (((PinnedPieces[id] === 2 || PinnedPieces[id] === 5) && color === 0) || ((PinnedPieces[id] === 0 || PinnedPieces[id] === 7) && color === 1))){
        map[pos] = 0;
      }
    } 
    if (check_bound(pos_row,pos_col) && CurrentTurn !== color) {
      map[pos] = 0;
    }
      
    pos_col = col + 1;
    pos = 8*(pos_row) + pos_col;
    if (check_bound(pos_row,pos_col) && (CurrentPieces.has(pos)  && CurrentPieces.get(pos).color !== color)) {
      if(!(id in PinnedPieces) || (((PinnedPieces[id] === 2 || PinnedPieces[id] === 5) && color === 1) || ((PinnedPieces[id] === 0 || PinnedPieces[id] === 7) && color === 0))){
        map[pos] = 0;
      }
    }
    if (check_bound(pos_row,pos_col) && CurrentTurn !== color){
      map[pos] = 0;
    }

    //en passant
    if ((color === 1 && row === 3) || (color === 0 && row === 4)){
      let sign = (color === 1) ? -1: 1; 
      if (check_bound(row,col + 1) && CurrentPieces.has(id + 1) && CurrentPieces.get(id + 1).piece === 0){
        if(LastMove.has(id + 1) && LastMove.has(id + 1 + sign*16)) {
          if(!(id in PinnedPieces) || (((PinnedPieces[id] === 2 || PinnedPieces[id] === 5) && color === 1) || ((PinnedPieces[id] === 0 || PinnedPieces[id] === 7) && color === 0))){
            map[id + 1 + sign*8] = 0;
          }
        }
      }
      if (check_bound(row,col - 1) && CurrentPieces.has(id - 1) && CurrentPieces.get(id - 1).piece === 0){
        if(LastMove.has(id - 1) && LastMove.has(id - 1 + sign*16)) {
          if(!(id in PinnedPieces) || (((PinnedPieces[id] === 2 || PinnedPieces[id] === 5) && color === 0) || ((PinnedPieces[id] === 0 || PinnedPieces[id] === 7) && color === 1))){
            map[id - 1 + sign*8] = 0;
          }
        }
      }
    }
  }
  //knight
  else if (piece === 1){
    if (!(id in PinnedPieces)) {
      ValidMoves(row + 2,col + 1);
      ValidMoves(row + 2,col - 1);
      ValidMoves(row - 2,col + 1);
      ValidMoves(row - 2,col - 1);
      ValidMoves(row + 1,col + 2);
      ValidMoves(row + 1,col - 2);
      ValidMoves(row - 1,col + 2);
      ValidMoves(row - 1,col - 2);
    }
  }
  //bishop
  else if (piece === 2){
    if(!(id in PinnedPieces) || (PinnedPieces[id] === 0 || PinnedPieces[id] === 7)){
      ValidMoves_iter(-1,-1);
      ValidMoves_iter(1,1);
    }
    if(!(id in PinnedPieces) || (PinnedPieces[id] === 2 || PinnedPieces[id] === 5)){
      ValidMoves_iter(1,-1);
      ValidMoves_iter(-1,1);
    }    
  }
  //rook
  else if (piece === 3){
    if(!(id in PinnedPieces) || (PinnedPieces[id] === 1 || PinnedPieces[id] === 6)){
      ValidMoves_iter(1,0);
      ValidMoves_iter(-1,0);
    }
    if(!(id in PinnedPieces) || (PinnedPieces[id] === 3 || PinnedPieces[id] === 4)){
      ValidMoves_iter(0,1);
      ValidMoves_iter(0,-1);
    }
  }
  //queen
  else if (piece === 4){
    if(!(id in PinnedPieces) || (PinnedPieces[id] === 1 || PinnedPieces[id] === 6)){
      ValidMoves_iter(1,0);
      ValidMoves_iter(-1,0);
    }
    if(!(id in PinnedPieces) || (PinnedPieces[id] === 3 || PinnedPieces[id] === 4)){
      ValidMoves_iter(0,1);
      ValidMoves_iter(0,-1);
    }
    if(!(id in PinnedPieces) || (PinnedPieces[id] === 0 || PinnedPieces[id] === 7)){
      ValidMoves_iter(-1,-1);
      ValidMoves_iter(1,1);
    }
    if(!(id in PinnedPieces) || (PinnedPieces[id] === 2 || PinnedPieces[id] === 5)){
      ValidMoves_iter(1,-1);
      ValidMoves_iter(-1,1);
    }    
  }

  //king
  else if (piece === 5){
    ValidMoves(row + 1,col);
    ValidMoves(row + 1,col - 1);
    ValidMoves(row + 1,col + 1);
    ValidMoves(row ,col - 1);
    ValidMoves(row ,col + 1);
    ValidMoves(row - 1,col + 1);
    ValidMoves(row - 1,col);
    ValidMoves(row - 1,col - 1);
  }
  //block checks
  if (InCheck && piece !== 5 && color === CurrentTurn) {
    let result = {};
    for (let key of Object.keys(map)) {
      if (key in ValidCheckMoves) {
        result[key] = 0;
      }
    }
    return result;
  }
  //safe squares for king 
  if (piece === 5 && color === CurrentTurn) {
    let result = {};
    for (let key of Object.keys(map)) {
      if (!(key in attacked_map)) {
        result[key] = 0;
      }
    }
    //castling
    if (CurrentPieces.get(id).firstMove && !(InCheck)) {
      if(!(CurrentPieces.has(id + 1)) && !((id + 1) in attacked_map) && !(CurrentPieces.has(id + 2)) && !((id + 2) in attacked_map)  && CurrentPieces.has(id + 3) && CurrentPieces.get(id + 3).firstMove){
        result[id + 2] = 0;
      }
      if(!(CurrentPieces.has(id - 1)) && !((id - 1) in attacked_map) && !(CurrentPieces.has(id - 2)) && !((id - 2) in attacked_map) && !(CurrentPieces.has(id - 3)) && !((id - 3) in attacked_map) && CurrentPieces.has(id - 4) && CurrentPieces.get(id - 4).firstMove){
        result[id - 2] = 0;
      }
    }
   
    return result;
  }
  return map;
}