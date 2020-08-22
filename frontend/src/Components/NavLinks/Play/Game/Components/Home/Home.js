import React, {useState, useEffect} from 'react'
import {store} from '../../../../../../store'
import {socket} from '../../../client'
import {Form,Button} from 'react-bootstrap'
import {action_Flip} from '../../../../../../redux/actions/actions'
import {setPlayerColor,setGameTime} from '../../Globals/index'
import chessHome from '../../../images/chessHome.png'
import './Home.css'

const Home = (props) => {
  const [Time,setTime] = useState("1 min");
  const [Color,setColor] = useState("White");
  
  useEffect(() => { 
    setTime("1 min")
    setColor("White")
  },[])

  function Time_onChangeHandler(e) {
    setTime(e.target.value)
  }
  function Color_onChangeHandler(e) {
    setColor(e.target.value)
  }
  function onSubmitHandler(event) {
    event.preventDefault();
    const Input = store.getState().isLoggedIn ? store.getState().Username: "guest"
    socket.emit("FindGame", [Color,Time,Input])
    if (Color === "Black"){
      store.dispatch(action_Flip())
      setPlayerColor(0);
    }
    setGameTime(Time)
    props.GameState(1)
  }

  return (<Form className="Form" onSubmit={onSubmitHandler}>
    <h3>Play Chess Online</h3>
    <img className="chess-img" src={chessHome} alt=""/>
    <Form.Group controlId="Form.ControlSelect1">
      <Form.Label className="label">Select Time:</Form.Label>
      <Form.Control onChange={Time_onChangeHandler} as="select">
        <option>1 min</option>
        <option>1|2</option>
        <option>2 min</option>
        <option>3 min</option>
        <option>3|2</option>
        <option>5 min</option>
        <option>5|2</option>
        <option>10 min</option>
        <option>30 min</option>
        <option>unlimited</option>
      </Form.Control>
    </Form.Group>
    <Form.Group controlId="Form.ControlSelect2">
      <Form.Label className="label">Play As:</Form.Label>
      <Form.Control onChange={Color_onChangeHandler}as="select">
        <option>White</option>
        <option>Black</option>
      </Form.Control>
    </Form.Group>
    <Button className="submit-button" type="submit" >Find Game</Button>
  </Form>
  );
}
 
export default Home;