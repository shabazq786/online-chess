import React from 'react'
import { connect } from 'react-redux'
import './History.css'

let arr = [];
let i = 0;
const map_letter = {0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'};
const map_number = {7:'1',6:'2',5:'3',4:'4',3:'5',2:'6',1:'7',0:'8'};

export function resetHistory() {
  arr = []
  i = 0;
}

function mapStateToProps(state) {
    return {
      LastMove: state.LastMove
    };
  }

const History = (props) => {
  let x = i.toString() + '.';
  for (let [k] of props.LastMove) {
    x += map_letter[k % 8] + map_number[Math.floor(k / 8)] + " ";
  }
  if (i > 0){
    arr.push(<div key={i} className="move-container">{x}</div>)
  }
  i++;
  return (
    <div className="history-container"><div className="title">Move History:</div><div className="history-content">{arr}</div></div>
  );
}

export default connect(mapStateToProps)(History);