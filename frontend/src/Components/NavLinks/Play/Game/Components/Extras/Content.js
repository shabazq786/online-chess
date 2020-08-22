import React  from 'react'
import { connect } from 'react-redux'
import Timer from './Timer'
import { PlayerColor,OpponentName, GameTime} from '../../Globals/index'
import './Extras.css'


function mapStateToProps(state) {
    return {
      CurrentTurn: state.CurrentTurn,
      Flip: state.FlipBoard,
      isLoggedIn: state.isLoggedIn,
      Username: state.Username,
      GameSession: state.GameSession
    };
  }

const TimeContent = (props) => {
    let Turn;
    const PlayerName = props.isLoggedIn ? props.Username : "guest"
    if (!props.CurrentTurn){
      Turn = 'Black to Move';
    }
    else {
      Turn = 'White to Move';
    }

    const Name_top = (props.Flip ^ PlayerColor) ? OpponentName: PlayerName;
    const Name_bottom = (props.Flip ^ PlayerColor) ? PlayerName:OpponentName;
    let timer1, timer2;

    if (props.Flip ^ PlayerColor) {
      timer1 = "timer-bottom"
      timer2 = "timer-top"
    }
    else {
      timer1 = "timer-top"
      timer2 = "timer-bottom"
    }
    return ( 
      <>
        <div className="turn-header">{Turn}</div>
        <div className="content-container">
          <div className="name-top">{Name_top}</div>
          <div className="name-bottom">{Name_bottom}</div>
          <div style={{display:GameTime[0] !== -1 ? "":"none"}} className={timer1}><Timer F={!props.CurrentTurn ^ PlayerColor} CurrentTurn={props.CurrentTurn} GameSession={props.GameSession}/></div>
          <div style={{display: GameTime[0] !== -1 ? "":"none"}} className={timer2}><Timer F={(props.CurrentTurn ^ PlayerColor)} CurrentTurn={props.CurrentTurn} GameSession={props.GameSession}/></div>
        </div>
      </>
    );
}
 
export default connect(mapStateToProps)(TimeContent);