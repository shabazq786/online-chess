import { combineReducers } from 'redux'
import isLoggedIn from './isLoggedIn'
import Username from './Username'
import Avatar from './Avatar'
import GetValidMoves from './GetValidMoves'
import CapturedPiece from './CapturedPiece'
import CurrentPieces from './CurrentPieces'
import FlipBoard from './FlipBoard'
import LastMove from './LastMove'
import CurrentTurn from './CurrentTurn'
import PinnedPieces from './PinnedPieces'
import InCheck from './InCheck'
import SelectedSquare from './SelectedSquare'
import GameSession from './GameSession'

export default combineReducers({
  isLoggedIn,
  Username,
  Avatar,
  GetValidMoves,
  CapturedPiece,
  CurrentPieces,
  FlipBoard,
  LastMove,
  CurrentTurn,
  PinnedPieces,
  InCheck,
  SelectedSquare,
  GameSession
})
