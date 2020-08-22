import React, {useState, useEffect} from 'react';
import {store} from '../../../store'
import {socket} from './client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {notification} from 'antd'
import {
  action_ResetBoard,
  action_resetSwitch,
  action_resetFlip,
  action_CapturePiece,
  action_ShowValidMoves,
  action_UpdatePinnedPieces,
  action_UpdateSelectedSquare,
  action_UpdateInCheck,
  action_LastMove,
  action_UpdateGameSession,
  GameResult
  } from '../../../redux/actions/actions'
import {resetHistory} from '../Play/Game/Components/History'
import {resetCapturedPieces} from '../Play/Game/Components/SideContent/CapturedPieces/CapturedPieces'
import * as Component from './Game/Components/index'
import Content from './Game/Components/Extras/Content'
import Home from './Game/Components/Home/Home'
import Loading from './Game/Components/Home/Loading'
import { setOpponentName, setPlayerColor,updateLastCaptureMove, updateValidCheckMoves } from './Game/Globals/index';
import './Game.css';


const Play = () => {
  const [Game,setGame] = useState(0)

  function GameState(id) {
    setGame(id)
    if (id === 0) {
      socket.emit("Cancel Game")
    }
  }

  useEffect(() => {
    if (Game === 0) {
      store.dispatch(action_ResetBoard());
      store.dispatch(action_CapturePiece({piece: -1, color:-1}))
      store.dispatch(action_resetFlip());
      store.dispatch(action_resetSwitch());
      store.dispatch(action_ShowValidMoves('RESET',[]))
      store.dispatch(action_UpdateInCheck(false));
      store.dispatch(action_LastMove(new Map()));
      store.dispatch(action_UpdatePinnedPieces({}));
      store.dispatch(action_UpdateSelectedSquare(-1));
      store.dispatch(action_UpdateGameSession(true))
      resetCapturedPieces();
      resetHistory();
      setPlayerColor(1);
      updateLastCaptureMove(0);
      updateValidCheckMoves({})
    }
  },[Game])

  useEffect (() => {

    socket.on("OpponentFound", data => {
      setOpponentName(data)
      setGame(2)
    });
    socket.on("End GameSession", function() {
      if (store.getState().GameSession) {
        store.dispatch(GameResult("Win"))
        const Username = store.getState().Username ? store.getState().Username : "guest"
        notification.info({message:`${Username} Wins by Abandonment`})
      }
      else {
        notification.info({
          message: "Opponent Disconnected"
        })
      }
      store.dispatch(action_UpdateGameSession(false))
    });

    socket.on("OpponentDisconnected", data => {

      if (store.getState().GameSession) {
        store.dispatch(GameResult("Win"))
        const Username = store.getState().Username ? store.getState().Username : "guest"
        notification.info({message:`${Username} Wins by Abandonment`})
      }
      else {
        notification.info({
          message: "Opponent Disconnected"
        })
      }
      store.dispatch(action_UpdateGameSession(false))
    });

    socket.on("Error", function() {
      notification.error({
        message: "Error connecting to Server"
    })
      store.dispatch(action_UpdateGameSession(false))
      socket.emit("End GameSession");
      setGame(0)
    });
    return () => {
      socket.off("Error")
      socket.off("OpponentFound")
      socket.off("OpponentDisconnected");
      socket.emit("End GameSession");
      socket.off("End GameSession");
      setGame(0)
      store.dispatch(action_UpdateGameSession(false))

    }
  },[]);

  if (Game === 0) {
    return <div><Home GameState = {GameState}/></div>
  }
  else if (Game === 1) {
    return <div><Loading GameState = {GameState}/></div>
  }
  else {
  return (
    <>
    <div className="game">
      <div className="board-content">
      <Content/>
      <DndProvider backend={HTML5Backend}>
        <Component.Board />
      </DndProvider>
      <Component.History />
      </div>
      <div className="side-content">
        <Component.CapturedPieces />
        <div className="btn-group-container"> 
          <div className="btn-group">
          <Component.NewGameBtn GameState={() => {setGame(0); socket.emit("End GameSession")}}/>
          <Component.FlipBtn/>
          <Component.ResignBtn/>
          <Component.DrawBtn/>
          </div>
        </div>
          <Component.Chat/>
      </div>
    </div>
    </>
  );
  }
}

export default (React.memo(Play));