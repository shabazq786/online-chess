import React  from 'react'
import {chess_pieces} from '../../../../images/chesspieces_img'

const  CapturedPiece = (props) => {
  const source=chess_pieces[props.val].src[props.color];
  return (
    <div>
      <img style={{ height: 30, width: 30 }} src={source} alt=""/>
    </div>
  );
}

export default (CapturedPiece);