import React from 'react'
import { connect } from 'react-redux'
import CapturedPiece from './CapturedPiece'
import './CapturedPieces.css'

var black_pieces = [];
var white_pieces = [];
var white_count = 0;
var black_count = 0;

for (var i = 0; i < 5; i++){
  black_pieces.push([]);
  white_pieces.push([]);
}

export function resetCapturedPieces() {
  black_pieces = []
  white_pieces = []
  white_count = 0
  black_count = 0
  for (var i = 0; i < 5; i++){
    black_pieces.push([]);
    white_pieces.push([]);
  }
  
}


function mapStateToProps(state) {
    return {
      CapturedPiece: state.CapturedPiece
    };
  }

const CapturedPieces = (props) => {
  const pos = props.CapturedPiece;

  if (pos.color === 1){
    const length = white_pieces[pos.piece].length;
    white_pieces[pos.piece].push(<div className="captured-piece" key={length}><CapturedPiece val={pos.piece} color={pos.color}/></div>);
    white_count++;
  }
  else if (pos.color === 0){
    const length = black_pieces[pos.piece].length;
    black_pieces[pos.piece].push(<div className="captured-piece" key={length} ><CapturedPiece val={pos.piece} color={pos.color}/></div>);
    black_count++;
  }
  return (
    <div>
      <div className="count">White:{white_count}</div>
      <div className='white-container'>
        <div className='captured-pieces'>{white_pieces[4]}</div>
        <div className='captured-pieces'>{white_pieces[3]}</div>
        <div className='captured-pieces'>{white_pieces[2]}</div>
        <div className='captured-pieces'>{white_pieces[1]}</div>
        <div className='captured-pieces'>{white_pieces[0]}</div>
      </div>
      <div className="count">Black:{black_count}</div>
      <div className='black-container'>
        <div className='captured-pieces'>{black_pieces[4]}</div>
        <div className='captured-pieces'>{black_pieces[3]}</div>
        <div className='captured-pieces'>{black_pieces[2]}</div>
        <div className='captured-pieces'>{black_pieces[1]}</div>
        <div className='captured-pieces'>{black_pieces[0]}</div>
      </div>    
    </div>
  );
}
 
export default connect(mapStateToProps)(CapturedPieces);