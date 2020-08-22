import React, {useState, useEffect} from 'react'
import { socket } from '../../../client'
import {Button} from 'react-bootstrap'
import {Input, notification} from 'antd'
import {OpponentName} from '../../Globals/OpponentName'
import './Chat.css'

const { TextArea } = Input;


const Chat = () => {
  const [Msg,setMsg] = useState("")
  const [Chat,setChat] = useState([<div className="chat-header" key={0}>type to chat!</div>])

  useEffect (() => {

    socket.on("MessageReceived", data => {

      setChat((state) => [...state,<div key={state.length}><font color="blue">{OpponentName}:</font> {data}</div>])
    });
    return () => {
      socket.off("MessageReceived")
    }

  },[]);

  function sendText() {
    if (!Msg.trim()) {
      notification.warning({
        message:"invalid text"
        }
      )
      setMsg("")
      return;
    }
    socket.emit("MessageSent",Msg);
    setChat((state) => [...state,<div key={Chat.length}><font color="red">you:</font> {Msg}</div>])
    setMsg("")
  }

  return (  
    <div className="chat-container">
      <div className="chat-box">
        {Chat}
      </div>
      <TextArea onChange = {(e) => {setMsg(e.target.value)}} 
       value ={Msg}
       maxLength={200}
      />
      <Button 
        className="send-btn"
        size="sm" 
        color="blue"
        onClick={sendText}
      
      >
        Send
      </Button>
    </div>
  );
}
 
export default Chat;

