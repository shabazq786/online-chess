import React, {useState, useEffect} from 'react'
import {store} from '../../../../../../store'
import {notification} from 'antd'
import {GameTime} from '../../Globals/GameTime'
import {PlayerColor} from '../../Globals/PlayerColor'
import { action_UpdateGameSession, GameResult } from '../../../../../../redux/actions/actions'

/*https://stackoverflow.com/questions/39426083/update-react-component-every-second*/
function toTimeString(seconds) {
  try {
    if (seconds < 0){
      return '00:00'
    }  
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0].substr(3,7);
  }
  catch(err){     
    return '00:00'
  }
}


const Timer = (props) => {
    const [time, setTime] = useState(GameTime[0]);
  
    useEffect(() => {
     if(!props.F) {
       setTime(state => (state - GameTime[1]))
     } 
    },[]);

    useEffect(() => {
      if(!props.F) {
        setTime((state) => (state + GameTime[1]))
      }
    },[props.F])
    useEffect(() => {
      if (time === 0 && props.F && props.GameSession){ 
        const alert = (props.CurrentTurn ? 'Black': 'White') + ' Wins on Time'
        notification.info({
          message: alert
      })
        if(props.CurrentTurn ^ PlayerColor) {
          store.dispatch(GameResult("Win"))
        }
        store.dispatch(action_UpdateGameSession(false))
      }
    },[time,props.F,props.GameSession, props.CurrentTurn])

    
    useEffect(() => {
      function timer() {
        if (props.F) {
          setTime(time - 1) ;
        }
      }
      if (time < 1) {
        setTime(-1)
      }
      if (time < 1 || (!props.F) || !props.GameSession){
        return;
      }
      const interval = setInterval(() => timer(), 1000);
      return () => {
        clearInterval(interval);
      };
    }, [time,props.F, props.GameSession]);

    return (<div style={{backgroundColor: (props.F ) ? '#fcbe37':''}}>{toTimeString(time)}</div>);
}
 
export default (Timer);