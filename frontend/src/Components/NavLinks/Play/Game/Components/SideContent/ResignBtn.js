import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {store} from '../../../../../../store'
import {socket} from '../../../client'
import {Button} from 'react-bootstrap'
import {OpponentName} from '../../Globals/OpponentName'
import {action_UpdateGameSession, GameResult} from '../../../../../../redux/actions/actions'
import {notification} from 'antd'
import './ResignBtn.css'


function mapStateToProps(state) {
  return {
      GameSession: state.GameSession,
  };
}

const ResignBtn = (props) => {
  const [disabled,setdisabled] = useState(false)

  useEffect(() => {
    if(!props.GameSession) {
      setdisabled(true)
    }

  },[props.GameSession])

  useEffect(() => {
    socket.on("Resigned", function() {
      if (props.GameSession) {
        let Username = store.getState().Username ? store.getState().Username : "guest"
        notification.info({message: `${Username} Wins by Resignation`})
        store.dispatch(GameResult("Win"))
        store.dispatch(action_UpdateGameSession(false))
      }
    })
    return () => {
      socket.off("Resigned")
    }
  },[props.GameSession]);

  function onClickHandler() {
    socket.emit("Resigned", function() {
    })
    if (props.GameSession) {
      notification.info({message: `${OpponentName} Wins by Resignation`})
      store.dispatch(action_UpdateGameSession(false))
    }
  }
  return (<Button style={{display:props.GameSession ? "":"none"}} className="Resign-btn" onClick={onClickHandler} disabled={disabled}>Resign</Button>);
}
 
export default connect(mapStateToProps)(ResignBtn);