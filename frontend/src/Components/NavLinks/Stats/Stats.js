import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {store} from '../../../store'
import { useHistory, useParams, Link} from 'react-router-dom'
import {notification} from 'antd'
import { Table, Pagination, Segment} from 'semantic-ui-react'
import {Doughnut} from 'react-chartjs-2';
import {isNumeric} from '../../../Functions/isNumeric'
import {URL} from '../../../Url'
import './Stats.css'

let Games_table;

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn
  };
}

const Stats = (props) => {
    const { pagenumber } = useParams();
    const history = useHistory();
    const [Games, setGames] = useState([])
    const [GamesCount, setGamesCount] = useState(0)
    const [pageNumber, setpageNumber] = useState(1)
    const [Stats,setStats] = useState([0,0,0])
    const [isLoading,setLoading] = useState(false)
    const StatsRef = useRef()
    const Chart = {
      labels: ['Wins', 'Draws', 'Losses'],
      datasets: [
        {
          label: 'Rainfall',
          backgroundColor: [
            '#2FDE00',
            '#C9DE00',
            '#B21F00',
          ],
          hoverBackgroundColor: [
          '#175000',
          '#4B5000',
          '#501800',
          ],
          data: Stats
        }
      ]
    }

    useEffect(() => {
      if (!isNumeric(pagenumber)) {
        let str = String(window.location)
        let idx1 = str.indexOf('Stats/')
        let idx2 = str.indexOf('page=')
  
        history.push(str.substring(idx1 + 6,idx2) + "page=1")
      }
      else {
        setpageNumber(Math.max(1,pagenumber))
        //window.scrollTo(0, StatsRef.current.offsetTop)
      }
    },[pagenumber, history])

    useEffect(() => {
      return () => {
        setGames([])
      }
    },[])

    function onChangePage(e, { activePage }) {
      if (props.username) {
        history.push('/' + props.username + '/Stats/page=' + String(activePage))
      }
      else {
        history.push('/Stats/page=' + String(activePage))
      }
    }

    useEffect(() => {
      setLoading(true)
      if (!props.isLoggedIn && !props.username) {
        setLoading(false)
        return;
      }
      let Username;
      if (props.username) {
        Username = props.username
      }
      else {
        Username = store.getState().Username
      }
      if (Username === "guest") {
        setGames([])
        setLoading(false)
        return;
      }
      axios.get(`${URL}/Stats/username=${Username}&page=${pageNumber}&limit=${10}`)
        .then(res => {
          let data = res.data
          let temp_Games = [];
          if (data) {
            data.forEach(function(key, index) {
              let opponent;
              let result = key.fields.result;

              if (key.fields.player === Username) {
                opponent = key.fields.opponent
                if (key.fields.result === 'Win') {
                  result = 'Won'
                }
              }
              else {
                opponent = key.fields.player
                if (key.fields.result === 'Win') {
                  result = 'Lost'
                }
              }
              if (opponent !== "guest") {
              opponent = <Link to={`/${opponent}/Stats/page=1`}>{opponent}</Link>
              }
              temp_Games.push( 
                <Table.Row key = { index } >
                  <Table.Cell > { index + 1 } </Table.Cell> 
                  <Table.Cell> 
                    {opponent}
                  </Table.Cell> 
                  <Table.Cell>
                    {result}
                  </Table.Cell> 
                </Table.Row>
              )
            });
          }
          setGames(temp_Games)
          setLoading(false)
        })
        .catch(err => {
          notification.info({message:"Error retreiving games"})
        })

    }, [pageNumber, props.isLoggedIn, props.username]);

    useEffect(() => {
      setLoading(true)
      if (!props.isLoggedIn && !props.username) {
        notification.info({message:"Log in to view Stats"})
        setLoading(false)
        return;
      }
      let Username;
      if (props.username) {
        Username = props.username
      }
      else {
        Username = store.getState().Username
      }
      if (Username === "guest") {
        setGames([])
        setLoading(false)
        return;
      }
      axios.get(`${URL}/Stats/username=${Username}/count`)
      .then(res => {
        let data = res.data[0]
        if (data.error) {
          notification.error({
            message: "Error getting Games count!"
        })
        } else {
          setGamesCount(data.Games_count)
          setStats([data.Win_count,data.Draw_count,data.Lose_count])
          setLoading(false)

        }
      })
      .catch(err => {
        notification.error({
          message: "Error getting Games count!"
      })})
    }, [props.isLoggedIn, props.username]);

    Games_table = 
      <Table striped fixed unstackable padded>
        <Table.Header>
          <Table.Row >
            <Table.HeaderCell style={{width:"10%"}}> # </Table.HeaderCell> 
            <Table.HeaderCell style={{width:"60%"}}> Opponent </Table.HeaderCell> 
            <Table.HeaderCell style={{width:"20%"}}> Result </Table.HeaderCell> 
          </Table.Row>
        </Table.Header>
        <Table.Body>{Games}</Table.Body>
      </Table>
    
    let pageCount = Math.ceil(GamesCount / 10)
    let pagination =  
      <Pagination style={{overflowX:"auto" , display: pageCount <= 1 ? "none": "" }}
        activePage={pageNumber}
        onPageChange={onChangePage}
        totalPages={pageCount}
      />
    if (isLoading) {
      return (<div></div>)
    }
    else {
    return (
      <>
        {(Games.length) ? <div className = "Game-container" >
          <div className="game-title">Game Statistics</div>
          <div style={{textAlign:"center"}} >
            <Doughnut
            data={Chart}
            options={{
              legend:{
                display:true,
                position:'right'
              }
            }}
          />
          </div>
          <Segment raised className="results-container">
            <div ref={StatsRef} className="game-pagination">
              {pagination}
            </div> 
            <div > {Games_table} </div> 
            <div className="game-pagination">
              {pagination}
            </div>
          </Segment>
          </div> : <>{ props.username ? <div className="no-results" >No Games Found for {props.username}!</div> : <div className="no-results">No Games Found!</div>}</>}
      </>
    );
  }
}

export default connect(mapStateToProps)(Stats);

