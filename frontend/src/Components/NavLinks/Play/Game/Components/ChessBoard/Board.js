import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import {store} from '../../../../../../store'
import {socket} from '../../../client'
import Square from './Square'
import {BoardState} from '../../Globals/index'
import {MoveTo} from '../../Functions/index'
import './Board.css'


function mapStateToProps(state) {
  return {
      GetValidMoves: state.GetValidMoves,
      Flip : state.FlipBoard,
      PinnedPieces: state.PinnedPieces,
      InCheck: state.InCheck,
  };
}

const Board = (props) => {
  const CurrentPieces = store.getState().CurrentPieces;
  const LastMove = store.getState().LastMove;
  const SelectedSquare = store.getState().SelectedSquare
  let grid = [];
  let flag = 0;
  
  useEffect (() => {
    socket.on("FromServer", data => {
      MoveTo(data[0],data[1])
    });
    return () => {
      socket.off("FromServer")
    }

  },[]);

  for (var i = 0; i < 8; i++) {
    let row = [];
    for (var j = 0; j < 8; j++) {
      const pos = BoardState[8*i + j][props.Flip];
                
      const child_props = {
        pos:pos,
        CurrentPiece:CurrentPieces.get(pos),
        canMoveTo:(props.GetValidMoves[pos] === 0),
        LastMove:LastMove.has(pos),
        Flip: props.Flip,
        color: flag,
        InCheck:(props.InCheck),
        Pinned:(props.PinnedPieces[pos] !== undefined),
        SelectedSquare_flag:(SelectedSquare === pos)
      }  
      row.push(<div key={j} ><Square {...child_props} /></div>)
      flag = ~flag;
    }
    flag = ~flag;
    grid.push(<div className = "board-row" key={i}> {row} </div>)
  }
  return (
    <div className="board">{grid}</div>
  );  
}
 
export default connect(mapStateToProps)(React.memo(Board));