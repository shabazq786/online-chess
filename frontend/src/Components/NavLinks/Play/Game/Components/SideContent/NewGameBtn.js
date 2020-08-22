import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

function mapStateToProps(state) {
  return {
      GameSession: state.GameSession,
  };
}

const NewGameBtn = (props) => {
  return (  
    <Button style={{display:!props.GameSession ? "":"none"}} onClick={props.GameState}>Find New Game</Button>
  );
}
 
export default connect(mapStateToProps)(NewGameBtn);