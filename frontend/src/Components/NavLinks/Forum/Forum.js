import React, { useState, useEffect } from 'react'
import { store } from '../../../store'
import axios from 'axios'
import { useHistory, useParams, Link} from 'react-router-dom'
import { Button} from 'react-bootstrap'
import Post from '../../Modals/Post/Post'
import {Input, notification} from 'antd'
import { Table, Pagination, Segment} from 'semantic-ui-react'
import {URL} from '../../../Url'
import {gettime} from '../../../Functions/gettime'
import {isNumeric} from '../../../Functions/isNumeric'

import './Forum.css'

const {Search} = Input;
let posts_table;

const Forum = () => {
    const { pagenumber } = useParams();
    const history = useHistory();

    const [show, setshow] = useState(false)
    const [showPosts, setshowPosts] = useState(true)
    const [posts, setposts] = useState([])
    const [postsCount, setpostsCount] = useState(0)
    const [pageNumber, setpageNumber] = useState(1)
    const [matchedText,setmatchedText] = useState("")
    const [isLoading,setisLoading] = useState(false)
    
    useEffect(() => {

      if (!isNumeric(pagenumber)) {
        history.push(`/Forum/page=1`)
      }
      else {
        setpageNumber(Math.max(1,pagenumber))
      }
    },[pagenumber,history])

    useEffect(() => {
      return () => {
        setposts([])
        setisLoading(false)
      }
    },[])

    function onShowPost() {
      if (!store.getState().isLoggedIn) {
        notification.warning({
          message: 'Please log in to continue!',
      })
      }
       else {
        setshow(true)
      }
    }
    function onHidePost() {
      setshow(false)
      setshowPosts(!showPosts)
    }


    function onChangePage(e, { activePage }) {
      history.push('/Forum/page=' + String(activePage))
      window.scrollTo(0, 0);
    }

    function onChangeSearch(e) {
      history.push('/Forum/page=' + String(1))
      setmatchedText(e.target.value)
    }

    function Matching(text, match_text) {
      const parts = text.split(new RegExp(`(${match_text})`, 'gi'));
      return <span>{parts.map((part,index) => part.toLowerCase() === match_text.toLowerCase() ? <b key={index} style={{backgroundColor:"yellow"}}>{part}</b> : part)}</span>;
  }

    useEffect(() => {
      setisLoading(true)
      axios.get(`${URL}/forum/posts/like=${matchedText}&page=${pageNumber}&limit=${10}`)
        .then(res => {
          const data = res.data
          let temp_posts = [];
          if (data) {
            data.forEach(function(key, index) {
              const route = "/Forum/postid=" + key.pk + "&page=1"
              const path = {pathname: route, state:{page:pageNumber}}
              temp_posts.push( 
                <Table.Row key = { index } >
                  <Table.Cell> 
                    <div className="post-title">
                      <div> <Link to={path} > { Matching(key.fields.title,matchedText)}</Link> </div>
                      <div className="post-info"> by  <Link to={`/${key.fields.posted_by}/Stats/page=1`}>{ Matching(key.fields.posted_by,matchedText)}</Link></div> 
                    </div> 
                  </Table.Cell> 
                  <Table.Cell>
                    <div className = "post-info">
                      <div> <Link to={`/${key.fields.last_posted_by}/Stats/page=1`} >{ Matching(key.fields.last_posted_by,matchedText)}</Link></div> 
                      <div> { gettime(key.fields.last_posted_date) } </div>  
                    </div>
                  </Table.Cell> 
                  <Table.Cell>
                    <div className = "post-replies" > <Link to={path}>{ key.fields.replies }</Link></div>
                  </Table.Cell> 
                </Table.Row>
              )
            });
          }
          setposts(temp_posts)
          setisLoading(false)
        })
        .catch(err => {
          if (pageNumber !== parseInt(pageNumber, 10)) {
            notification.error({
              message: 'Error retreiving posts',
              description: "invalid page number (!#)!"
          })
          } else if (pageNumber <= 0) {
            notification.error({
              message: 'Error retreiving posts',
              description: "invalid page number (<0)!"
          })
          } else { 
            notification.error({
              message: 'Error retreiving posts',
              description: "Unknown error!"
          })
          }
        })
      return () => {
      }
    }, [showPosts, pageNumber, matchedText]);

    useEffect(() => {
      axios.get(`${URL}/forum/posts/like=${matchedText}/count`)
      .then(res => {
        const data = res.data[0]
        if (data.error) {
          notification.error({
            message: "Error getting posts count!"
        })
        } else {
          setpostsCount(data.posts_count)
        }
      })
      .catch(err => {
        notification.error({
          message: "Error getting posts count!"
      })})
    }, [showPosts,matchedText]);

    posts_table = 
      <Table striped fixed unstackable padded>
        <Table.Header>
          <Table.Row >
            <Table.HeaderCell style={{width:"60%"}}></Table.HeaderCell> 
            <Table.HeaderCell style={{width:"100px"}}> Last Modified By </Table.HeaderCell>
            <Table.HeaderCell style={{width:"80px"}}> Replies </Table.HeaderCell> 
          </Table.Row>
        </Table.Header>
        <Table.Body>{posts}</Table.Body>
      </Table>
    
    const pageCount = Math.ceil(postsCount / 10)
    const pagination =  
      <Pagination style={{overflowX:"auto" , display: pageCount <= 1 ? "none": "" }}
        activePage={pageNumber}
        onPageChange={onChangePage}
        totalPages={pageCount}
      />
    return (
      <>
        <Post show = { show } onHide = { onHidePost }/> 
          <Segment raised className="forum-container">
            <div className = "forum-header" >
              Forum
            </div> 
            <div className = "create-post" >
              < Button onClick = { onShowPost } > Create Post </Button> 
              <li className = "post-search">< Search onChange={onChangeSearch}placeholder = "Search Posts.."/></li> 
            </div> 
            <div className = "posts-container" > { posts_table } </div> 
            <div className = "no-posts"
              style = {
              { display: posts.length || isLoading ? 'none' : '' } } > No Posts Here! 
            </div>
            <div className = "pagination-btm-forum" >
              {pagination}
            </div>
          </Segment> 
        </>
    );
}

export default Forum;