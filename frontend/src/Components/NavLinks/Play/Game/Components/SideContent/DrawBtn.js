import React, { useEffect, useState} from 'react'
import {socket} from '../../../client'
import {connect} from 'react-redux'
import {store} from '../../../../../../store'
import {Button} from 'react-bootstrap'
import {Modal, notification} from 'antd'
import {action_UpdateGameSession, GameResult} from '../../../../../../redux/actions/actions'
import { OpponentName } from '../../Globals'
import './DrawBtn.css'

function mapStateToProps(state) {
  return {
      GameSession: state.GameSession,
  };
}
const DrawBtn = (props) => {
  const [visible,setvisible] = useState(false)
  const [disabled,setdisabled] = useState(false)

  useEffect(() => {
    if(!props.GameSession) {
      setdisabled(true)
    }

  },[props.GameSession])

  useEffect(() => {
    socket.on("Draw Accepted", function() {
      if (props.GameSession) {
        notification.info({message: "Draw by Agreement"})
        store.dispatch(action_UpdateGameSession(false))
      }
    })
    socket.on("Draw Declined", function() {
      notification.info({message: `${OpponentName} declined Draw`})
      setdisabled(false)
    })

    socket.on("Draw Offered", function() {
      setvisible(true)
    })

    return () => {
      socket.off("Draw Accepted")
      socket.off("Draw Declined")
      socket.off("Draw Offered")
    }
  },[props.GameSession]);

  function onClickHandler() {
    socket.emit("Draw Offered", function() {
    })
    setdisabled(true)
  }
  function onhandleOk() {
    socket.emit("Draw Accepted", function() {
    })
    setvisible(false)
    if (props.GameSession) {
      notification.info({message: "Draw by Agreement"})
      store.dispatch(GameResult("Draw"))
      store.dispatch(action_UpdateGameSession(false))
    }
  }

  function onhandleCancel() {
    socket.emit("Draw Declined", function() {
    })
    setvisible(false)
  }

  return (
    <>
      <Modal
        visible={visible}
        onOk={onhandleOk}
        onCancel={onhandleCancel}
        footer={[
          <Button key="accept" onClick={onhandleOk}>
            Accept
          </Button>,
          <Button key="decline" type="primary" onClick={onhandleCancel}>
            Decline
          </Button>,
        ]}
      >
      <p>{OpponentName} has offered a Draw! </p>

      </Modal>
    <Button style={{display:props.GameSession ? "":"none"}} className="Draw-btn" onClick={onClickHandler} disabled={disabled} >Draw</Button>
    </>
  
  );
}
 
export default connect(mapStateToProps)(DrawBtn);