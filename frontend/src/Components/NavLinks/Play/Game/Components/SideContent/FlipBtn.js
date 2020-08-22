import React from 'react'
import {store} from '../../../../../../store'
import {Button} from 'react-bootstrap'
import {action_Flip} from '../../../../../../redux/actions/actions'
import './FlipBtn.css'


const FlipBtn = () => {
  function onClickHandler() {
    store.dispatch(action_Flip());
  }
  return (
    <div><Button onClick={onClickHandler} className="flip-btn" >Flip Board</Button></div>  
  );
}
 
export default FlipBtn;