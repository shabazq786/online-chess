import React, {useState,  useCallback} from 'react'
import {store} from '../../../../../../store'
import {socket} from '../../../client'
import { useDrop } from 'react-dnd'
import *  as Func from '../../Functions/index'
import BoardPiece from './Pieces/BoardPiece'
import {Overlay} from './Overlay'
import './Board.css'

var subgrid_row;
var subgrid_col;


const Square = (props) => {
  var canMoveTo = props.canMoveTo;
  const CurrentTurn = store.getState().CurrentTurn

  const [Drag,setDrag] = useState(false);
  const OnDrag = useCallback(() => setDrag(Drag => ~Drag), []);

  function func_canMove(pos) {
   if (canMoveTo) {
      if(store.getState().GameSession) {
        socket.emit("FromClient", [pos,props.pos])
      }
      Func.MoveTo(pos,props.pos);
   }
   Func.GetValidMoves(props.pos)
  }

  function onClickHandler() { 
    const SelectedSquare = store.getState().SelectedSquare
    if (SelectedSquare === -1){
      Func.GetValidMoves(props.pos);
    }
    else {
      func_canMove(SelectedSquare)
    }
  }

  
  
  const [{isOver}, drop] = useDrop({
    accept: ['Queen','Bishop','Knight', 'Rook','King','Pawn'],
        
    drop: (monitor) => {
      func_canMove(monitor.id);
    },

    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })
    
  let piece;
  let color;

  //drag
  color = (props.color === 0) ? '#eeeed2': '';
  if (Drag || props.SelectedSquare_flag) {
    color = '#b3cde0';
  }
  if (props.CurrentPiece) {
    const piece_props = {
      OnDrag:OnDrag,
      key:props.pos,
      id:props.pos,
      piece_val:props.CurrentPiece.piece,
      color:props.CurrentPiece.color,
    }
    // check
    if(props.InCheck && props.CurrentPiece.piece === 5 && props.CurrentPiece.color === CurrentTurn) {
      color = 'red';
    }
    //pinned
    if (props.Pinned) {
      color = '#baca44'
    }
    piece = <div className='board-piece'><BoardPiece  {...piece_props} /></div>
  }
 
  const row = Math.floor(props.pos / 8);
  const col = props.pos % 8;
    
  subgrid_col = ((col === 0 && !props.Flip) || (col === 7 && props.Flip)) ? 8 - row: null;
  subgrid_row = ((row === 7 && !props.Flip) || (row === 0 && props.Flip)) ? 'abcdefgh'.charAt(col): null;
  
  return (
    <div ref={drop}>
      <div className='board-square' style={{backgroundColor: color}} onClick={onClickHandler}>
        {piece}
        <div className='board-subcol'>{subgrid_col}</div>
        <div>{(props.LastMove) ? <Overlay color='#DCDC58'/>:""}</div>
        <div>{(canMoveTo && !isOver) ? <Overlay color='#ff0000'/>:""}</div>
        <div>{(canMoveTo && isOver) ? <Overlay color='#800000'/>:""}</div>
        <div className='board-subrow'>{subgrid_row}</div> 
      </div>
    </div> 
       
  );
}

export default (React.memo(Square));