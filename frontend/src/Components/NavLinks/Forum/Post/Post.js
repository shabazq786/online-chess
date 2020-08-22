import React, {useState, useEffect, useRef, useCallback} from 'react'
import axios from 'axios'
import { useHistory, useParams } from 'react-router'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {store} from '../../../../store'
import {Button, Form} from 'react-bootstrap'
import { Card, Input, Avatar, notification} from 'antd'
import {Pagination, Header, Icon, Segment, Dimmer, Loader, Image} from 'semantic-ui-react'
import {gettime} from '../../../../Functions/gettime'
import {isNumeric} from '../../../../Functions/isNumeric'
import Comments from './Comments'
import {URL} from '../../../../Url'
import def_Avatar from '../../../../images/avatar.png'
import './Post.css'

const { Meta } = Card;
const { TextArea } = Input;
const loader = 
  <Segment key={1}>
  <Dimmer active inverted>
    <Loader size='medium' >Loading</Loader>
  </Dimmer>

  <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
  </Segment>

let prev_location = 1;

function mapStateToProps(state) {
  return {
    Username: state.Username,
    isLoggedIn: state.isLoggedIn,
  };
}

const Post = (props) => {
  const history = useHistory();
  const { postid, pagenumber } = useParams();

  if (props.location.state) {
    prev_location = props.location.state.page
  }

  const path = String(window.location.pathname)
  const postid_path = path.substring(path.indexOf('=')+1,path.indexOf("&"));

  const ref = useRef({
    title: "",
    body: "",
    posted_by: "",
    posted_date: "",
    edited: "",
    avatar: ""
  });
  
  const pageSize = 10
  const Username = props.Username 
  const [commentCounts,setcommentCounts] = useState(0)
  const [pageNumber, setpageNumber] = useState(pagenumber)
  const [comments,setcomments] = useState([loader])
  const [text, settext] = useState("")
  const [render, setrender] = useState(false)
  const [Edit,setEdit] = useState(false)
  const textInput = useRef()
  const bodyInput = useRef()
  const CommentsRef = useRef()
  const [isLoading,setisLoading] = useState(false)
  const avatar = store.getState().Avatar
  

  useEffect(() => {
    setcomments(loader)
    if (!isNumeric(pagenumber)) {
      const str = String(window.location)
      const idx1 = str.indexOf('postid=')
      const idx2 = str.indexOf('page=')

      history.push(str.substring(idx1,idx2) + "page=1")
    }
    else {
      setpageNumber(Math.max(1,pagenumber))
      window.scrollTo(0, CommentsRef.current.offsetTop )
    }
  },[pagenumber,history])

  function goBackHandler() {
    history.push(`/Forum/page=${prev_location}`)
  }

  function onChangePage(e, {activePage }) {
    history.push(`/Forum/postid=${postid}&page=${activePage }`)
  }

  function onChangeInput(e) {
    settext(e.target.value)
  } 
    
  const decCommentCounts = useCallback(() => setcommentCounts(state => state - 1), []);
  

  function onSubmitComment(e) {
    e.preventDefault();
    if (!text.trim()) {
      notification.warning({
        message: "Invalid comment!",
        description: "field contains whitespaces only"
    })
      return;
    }

    axios.post(`${URL}/forum/posts/postid`, { post_id:postid_path, body:text, posted_by: Username, parent_id:"None"})
      .then(res => {
        const data = res.data[0]
        if (data.error) {
          notification.error({
            message: "Error adding comment!",
        })
        } else {
          const now = new Date()  
          const time = Math.round(now.getTime() / 1000) 
          const commentid = {
            pk: data.commentid,
            fields:{
              posted_by:Username,
              posted_date:time,
              body:text,
              edited:'posted',
              likes:0,
              dislikes:0,
              rated:-1,
              avatar:avatar
            }
          }
          setcomments(state => [...state,
            < Comments 
              key={state.length}
              commentid={commentid} 
              Username={Username} 
              decCommentCounts={decCommentCounts} 
              isLoggedIn={props.isLoggedIn}
              postid_path={postid_path}
              postid={postid}
            
            /> 
          ])
            
          setcommentCounts(commentCounts + 1)
          settext("")
          
      }})
      .catch(err => {
        notification.error({
          message: "Error adding comment!",
      })
      })
  }

  function onEditPost() {
    if (!Edit) {
      setEdit(true) 
      } else {
        if (!ref.current.title.trim()) {
          notification.warning({
            message: "Invalid title",
            description: "field contains whitespaces only",
        })
        } else if (!ref.current.body.trim()) {
          notification.warning({
            message: "Invalid body",
            description: "field contains whitespaces only",
        })
        } else {
        axios.put(`${URL}/forum/posts/postid=${postid}/edit`, {title:ref.current.title, body:ref.current.body})
        .then(res => {
          const data = res.data[0]
          if (data.error) {
            notification.error({
              message: "Error editing post"
          })
          } else {
            const now = new Date()  
            const time = Math.round(now.getTime() / 1000) 
            ref.current.posted_date = gettime(time)
            ref.current.edited = "edited"
            setEdit(false) 
          }
        })
        .catch(err => {
          notification.error({
            message: "Error editing post"
        })
        })}
      }
  }

  function onDeletePost() {
    axios.delete(`${URL}/forum/posts/postid=${postid}/delete`)
    .then(res => {
      const data = res.data[0]
      if (data.error) {
        notification.error({
          message: "Error deleting post!"
      })
      } else {
        history.push('/Forum/page=1')
      }
    })
    .catch(err => {
      notification.error({
        message: "Error deleting post!"
    })
    })
  }
  useEffect(() => {
    if (Edit) {
      bodyInput.current.focus();
      window.scrollTo({ behavior: 'smooth', top: bodyInput.current.offsetTop })
    }
  }, [Edit,bodyInput]);

  useEffect(() => {
    if (!render) {
      setisLoading(true)
      textInput.current.focus()
      axios.get(`${URL}/forum/posts/postid=${postid}`)
        .then(res => {
          const data = res.data[0]
          ref.current.title = data.title
          ref.current.body = data.body
          ref.current.posted_by = data.posted_by
          ref.current.posted_date = gettime(data.posted_date)
          ref.current.edited = data.edited
          ref.current.avatar = data.avatar
          setrender(true)
          setisLoading(false)

        })
        .catch(err => {
          notification.error({
            message: "Error retreiving post info"
        })
        })
  }},[render,postid, textInput]);

  useEffect(() => {
    let User;
    if (Username){
      User=Username
    }
    else {
      User="guest"
    }
    const parent_id = "None"
    axios.get(`${URL}/forum/posts/postid=${postid}&username=${User}&parent=${parent_id}&page=${pageNumber}&limit=${pageSize}`)
      .then(res => {
        const data = res.data
        let temp_comments = []
        data.forEach(function(key,index){
          const commentid = {
            pk: key.comment_id,
            fields:{
              posted_by:key.posted_by,
              posted_date:key.posted_date,
              body:key.body,
              edited:key.edited,
              likes:key.likes,
              dislikes:key.dislikes,
              rated:key.rated,
              avatar:key.avatar,
            }
          }
          temp_comments.push(
          <Comments 
            key={index} 
            commentid={commentid}
            Username={Username} 
            decCommentCounts={decCommentCounts} 
            isLoggedIn={props.isLoggedIn}
            postid_path={postid_path}
            postid={postid}
          />
        )});
        setcomments(temp_comments)
      })
      .catch(err => {
        notification.error({
          message: "Error retreiving post comments"
      })
      })
  }, [pageNumber, pageSize, Username, postid,postid_path,props.isLoggedIn, decCommentCounts]);

  useEffect(() => {
    axios.get(`${URL}/forum/posts/postid=${postid}/count`)
      .then(res => {
        const data = res.data[0]
        if (data.error) {
          notification.error({
            message: "Error retreiving comments count"
        })
        } else {
          setcommentCounts(data.comments_count)
        }
      })
      .catch(err => {
        notification.error({
          message: "Error retreiving comments count"
      })
      })
  }, [postid]);

  const Editable = Edit && (props.Username === ref.current.posted_by)
  let title;
  let description;

  function Editbody(body) {
    ref.current.body=body
  }
  function Edittitle(title) {
    ref.current.title=title
  }
  if (!Editable) {
    description = 
      <p style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}}> {ref.current.body}</p>
    title = 
      <div style={{ wordWrap:"break-word", height:"auto"}} >
        {ref.current.title}
      </div> 
  }
  else {
    title = 
      <TextArea type="text" defaultValue={ref.current.title} onChange={(e) => Edittitle(e.target.value)}/>

    description = 
      <TextArea  ref={bodyInput} type="text" defaultValue={ref.current.body} onChange={(e) => Editbody(e.target.value)}/>
  }

  const pageCount = Math.ceil(commentCounts / 10)
  const pagination =  
    <Pagination style={{overflowX:"auto", display: pageCount <= 1 ? "none": "" }}
      activePage={ pageNumber}
      onPageChange={onChangePage}
      totalPages={pageCount}
    />

  return (<>
    {isLoading ? <></> :
    <Segment raised className="post-container">
      <div className="back-btn">
        <Header as='h2'>
          <Icon name='arrow left' size='mini' style={{cursor: "pointer", color:"rgb(136, 136, 136)"}} onClick={goBackHandler}/>
          <Header.Content style={{color:"rgb(136, 136, 136)"}}>Back to Forum</Header.Content>
        </Header>
      </div>
      <div className="post-card-container">
        {ref.current.title ? 
        <Card className="card-body">
          <Meta 
            title={
              <div>
                <div className="modify-btn" style={{display:(ref.current.posted_by === props.Username && props.isLoggedIn) ? "":"none"}}>
                  <Button size="sm" variant="outline-danger" onClick={() => onDeletePost()}>Delete</Button>
                  <Button size="sm" variant="outline-primary" onClick={() => onEditPost()}>{!Edit ? "Edit": "Save"}</Button>
                </div>
            <div style={{overflow:"break-word"}}>{title}</div>
            </div>
            } 
            avatar={ <Link to={`/${ref.current.posted_by}/Stats/page=1`}><Avatar src={ref.current.avatar ? ref.current.avatar: def_Avatar}/></Link>}
            description={
              <div>
                {description}
                <div className="post-posted-by">{ref.current.edited} {ref.current.posted_date} by 
                  <p style={{color:"#007bff"}}> <Link to={`/${ref.current.posted_by}/Stats/page=1`}>{ref.current.posted_by}</Link></p>
                </div>
              </div>
            }
          />
        </Card>
        : <h1>Post Doesn't Exist!</h1>}
        <div className = "pagination-top-post" ref={CommentsRef}>
          {pagination}
        </div>
        <div>{commentCounts}  {commentCounts <= 1 ? "Comment":"Comments"}</div>
        <div>{comments}</div>
        <Form onSubmit={onSubmitComment}>
          <div className="Form-child">
            <div style={{color: "red", display: props.isLoggedIn ? "none":""}}>Log In First!</div>
            <div>
              <TextArea rows={5} value={text} onChange={onChangeInput} required= {true} ref={ textInput }/>
            </div>
            <div>
            <Button type="submit" disabled={!props.isLoggedIn || !ref.current.title}>Add Comment</Button>
            </div>
          </div>
        </Form>
        <div className = "pagination-btm-post" >
          {pagination}
        </div>
      </div> 
     
    </Segment>}
  </>
  );
}
 
export default withRouter(connect(mapStateToProps)(Post));