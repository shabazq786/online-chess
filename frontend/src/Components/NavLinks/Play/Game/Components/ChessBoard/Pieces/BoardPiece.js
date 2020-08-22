import React from 'react'
import {connect} from 'react-redux'
import { DragPreviewImage, useDrag } from 'react-dnd'
import {chess_pieces} from '../../../../images/chesspieces_img'
import {GetValidMoves} from '../../../Functions/index'
import {PlayerColor} from '../../../Globals/PlayerColor'

function mapStateToProps(state) {
  return {
      GameSession: state.GameSession,
  };
}

const BoardPiece = (props) => {
  
  function canDragit() {
    if ((props.color === PlayerColor) || !props.GameSession) {
      return true;
    }
    return false
  }
  /* eslint-disable no-unused-vars */
  const [{canDrag}, drag, preview] = useDrag({
    /* eslint-disable no-unused-vars */
    item: { type: chess_pieces[props.piece_val].id, id: props.id},
    canDrag: canDragit()
    ,
    begin: () => {
      GetValidMoves(props.id);
      props.OnDrag();  
    },
    end: () => {
      GetValidMoves(-1);
      props.OnDrag();
    }

  })

  const source=chess_pieces[props.piece_val].src[props.color];
  
  return (
    <div>
      <DragPreviewImage connect={preview} src={source} />
        <div ref={drag}>
          <img src={source} alt=""/>
        </div>
    </div>
  );  
}

export default connect(mapStateToProps)(React.memo(BoardPiece));