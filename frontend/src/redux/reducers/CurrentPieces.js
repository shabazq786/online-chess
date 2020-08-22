/*
Pawn- 0
Knight = 1
Bishop = 2
Rook = 3
Queen = 4
King = 5
*/
const arr = [3,1,2,4,5,2,1,3,0,0,0,0,0,0,0,0];

const initState = new Map();
    
arr.forEach(function(item,index) {
  initState.set(index, {piece:item, color:0, validMoves:{},firstMove:true});
  initState.set(63 - index, {piece:item, color:1, validMoves:{},firstMove:true});
})
let i;

for(i = 8; i < 16; i++) {
  initState.get(i).validMoves[i + 8] = 0
  initState.get(i).validMoves[i + 16] = 0   
}
for(i = 48; i < 56; i++) {
  initState.get(i).validMoves[i - 8] = 0
  initState.get(i).validMoves[i - 16] = 0
}
//knight
initState.set(1,{piece:1, color:0, validMoves:{16:0,18:0},firstMove:true});
initState.set(6,{piece:1, color:0, validMoves:{21:0,23:0},firstMove:true});
initState.set(57,{piece:1, color:1, validMoves:{40:0,42:0},firstMove:true});
initState.set(62,{piece:1, color:1, validMoves:{45:0,47:0},firstMove:true});
//king queen swap
initState.set(59,{piece:4,color:1,validMoves:{},firstMove:true});
initState.set(60,{piece:5,color:1,validMoves:{},firstMove:true});
  

const CurrentPieces = (state = initState, action) => {
  switch (action.type) { 
    case 'MOVE': {
      let newState = new Map(state);
      const prev_pos = action.object.prev_pos;
      const new_pos = action.object.new_pos;
      newState.set(new_pos, {piece:state.get(prev_pos).piece, color:state.get(prev_pos).color,validMoves:{}, firstMove:false});
      newState.delete(prev_pos);
      return newState;
    }
    case 'UPDATE_VALID_MOVES': {
      let newState = new Map(state);
      for (const [key] of newState.entries()) {
        newState.get(key).validMoves = action.map[key]
      }
      return newState;
    }
    case 'PROMOTE': {
      let newState = new Map(state);
      newState.set(action.pos, {piece:4, color:state.get(action.pos).color, validMoves:{}, firstMove:false});
      return newState;
    }
    case 'DELETE': {
      let newState = new Map(state);
      newState.delete(action.pos);
      return newState;
    }
    case 'RESET_CURRENT_PIECES':
      let newState = new Map();
    
      arr.forEach(function(item,index) {
        newState.set(index, {piece:item, color:0, validMoves:{},firstMove:true});
        newState.set(63 - index, {piece:item, color:1, validMoves:{},firstMove:true});
      })
      let i;
      
      for(i = 8; i < 16; i++) {
        newState.get(i).validMoves[i + 8] = 0
        newState.get(i).validMoves[i + 16] = 0   
      }
      for(i = 48; i < 56; i++) {
        newState.get(i).validMoves[i - 8] = 0
        newState.get(i).validMoves[i - 16] = 0
      }
      //knight
      newState.set(1,{piece:1, color:0, validMoves:{16:0,18:0},firstMove:true});
      newState.set(6,{piece:1, color:0, validMoves:{21:0,23:0},firstMove:true});
      newState.set(57,{piece:1, color:1, validMoves:{40:0,42:0},firstMove:true});
      newState.set(62,{piece:1, color:1, validMoves:{45:0,47:0},firstMove:true});
      //king queen swap
      newState.set(59,{piece:4,color:1,validMoves:{},firstMove:true});
      newState.set(60,{piece:5,color:1,validMoves:{},firstMove:true});
      return newState

      default:
        return state;
  }
}  
export default CurrentPieces;