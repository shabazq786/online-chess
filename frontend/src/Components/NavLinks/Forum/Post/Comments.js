import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import {store} from '../../../../store'
import { Link } from 'react-router-dom'
import {Button, Form} from 'react-bootstrap';
import {Comment, Avatar, Input, notification} from 'antd'
import {Segment, Dimmer, Loader, Image} from 'semantic-ui-react'
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import {gettime} from '../../../../Functions/gettime'
import def_Avatar from '../../../../images/avatar.png'
import {URL} from '../../../../Url'
import './Post.css'

const { TextArea } = Input;
const loader = 
  <Segment key={1}>
  <Dimmer active inverted>
    <Loader size='medium'>Loading</Loader>
  </Dimmer>

  <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
  </Segment>

const Comments = (props) => {
  const [commentid,setcommentid] = useState({
    body:props.commentid.fields.body,
    posted_by:props.commentid.fields.posted_by,
    posted_date:props.commentid.fields.posted_date,
    edited:props.commentid.fields.edited,
    likes: props.commentid.fields.likes,
    dislikes:props.commentid.fields.dislikes,
    rated:props.commentid.fields.rated,
    avatar:props.commentid.fields.avatar,
  })
  const [Edit,setEdit] = useState(false)
  const [Show, setShow] = useState(true)
  const [ReplyText, setReplyText] = useState("")
  const [showBox, setshowBox] = useState(false)
  const [showReplies,setshowReplies] = useState(false)
  const [replies, setreplies] = useState([])
  const [repliesCount, setrepliesCount] = useState(0)
  const replyInput = useRef()
  const bodyInput = useRef()
  const avatar = store.getState().Avatar

  useEffect(() => {
    setEdit(false)
    setShow(true)
    setshowBox(false)
    setshowReplies(false)
    setReplyText("")
    setcommentid((prevState) => ({
    body:props.commentid.fields.body,
    posted_by:props.commentid.fields.posted_by,
    posted_date:props.commentid.fields.posted_date,
    edited:props.commentid.fields.edited,
    likes: props.commentid.fields.likes,
    dislikes:props.commentid.fields.dislikes,
    rated:props.commentid.fields.rated,
    avatar:props.commentid.fields.avatar,
  }))
  },[props.commentid])


  function onEditComment(comment_id) {
    if (!Edit) {
    setEdit(true) 
    } else {
      if (!commentid.body.trim()) {
        notification.warning({
          message: 'Invalid comment!',
          description: 'field contains whitespaces only'
      })
      } else {
      axios.put(`${URL}/forum/posts/commentid=${comment_id}/edit`, {text:commentid.body})
      .then(res => {
        const data = res.data[0]
        if (data.error) {
          notification.error({
            message: "Error editing comment!"
        })
        } else {
          const now = new Date()  
          const time = Math.round(now.getTime() / 1000) 
          setcommentid((prevState) => ({...prevState,
          posted_date:time,
          edited:"edited"
          }))
          setEdit(false) 
        }
      })
      .catch(err => {
        notification.error({
          message: "Error editing comment!"
      })
      })}
    }
  }
  function onDeleteComment(commentid) {
    axios.delete(`${URL}/forum/posts/commentid=${commentid}/delete`)
      .then(res => {
        const data = res.data[0]
        if (data.error) {
          notification.error({
            message: "Error deleting comment!"
        })
        } else {
          setShow(false)
          if (!props.child) {
            props.decCommentCounts()  
          }
        }
      })
      .catch(err => {
        notification.error({
          message: "Error deleting comment!"
      })
      })
  }

  function showReplyBox() {
    setshowBox(!showBox)
  }

  function showallReplies() {
    setreplies(loader)
    setshowReplies(!showReplies)
  }
  
  function onSubmitHandler(e) {
    e.preventDefault();
    if (!ReplyText.trim()) {
      notification.warning({
        message: "Invalid comment!",
        description:"field contains whitespaces only"
    })
      return;
    }

    axios.post(`${URL}/forum/posts/postid`, { post_id:props.postid_path, body:ReplyText, posted_by: props.Username, parent_id:props.commentid.pk})
    .then(res => {
      const data = res.data[0]
      if (data.error) {
        notification.error({
          message: "Error adding comment!"
      })
      } else {
        const now = new Date()  
        const time = Math.round(now.getTime() / 1000) 
        const commentid = {
          pk: data.commentid,
          fields:{
            posted_by:props.Username,
            posted_date:time,
            body:ReplyText,
            edited:'posted',
            likes:0,
            dislikes:0,
            rated:-1,
            avatar:avatar
          }
        }
        setreplies(state => [...state,
          < Comments 
            key={state.length}
            commentid={commentid} 
            Username={props.Username} 
            isLoggedIn={props.isLoggedIn}
            postid_path={props.postid_path}
            postid={props.postid}
            child={true}
          /> 
        ])
        setshowReplies(true)
        setReplyText("")
      }
    })
    .catch(err => {
      notification.error({
        message: "Error adding comment!"
    })
    })

  }
  
  function onChangeInput(e) {
    setReplyText(e.target.value)
  }

  useEffect(() => {
    if (showBox) {
      replyInput.current.focus();
      window.scrollTo({ behavior: 'smooth', top: replyInput.current.offsetTop })
    }
  }, [showBox,replyInput,showReplies]);

  useEffect(() => {
    if (Edit) {
      bodyInput.current.focus();
      window.scrollTo({ behavior: 'smooth', top: bodyInput.current.offsetTop })
    }
  }, [Edit,bodyInput]);

  useEffect(() => {
    axios.get(`${URL}/forum/posts/postid=${props.postid}&parent=${props.commentid.pk}/count`)
    .then(res => {
      const data = res.data[0]
      if (data.error){
        notification.error({
          message: "Error retreiving post counts!"
      })
      } 
      else {
        setrepliesCount(data.count)
      }
    })
    .catch(err => {
      notification.error({
        message: "Error retreiving post counts!"
    })
    })
  },[props.commentid.pk, props.postid]);

  useEffect(() => {
    let User;
    if (props.Username){
      User=props.Username
    }
    else {
      User="guest"
    }

    if (showReplies) {
      axios.get(`${URL}/forum/posts/postid=${props.postid}&username=${User}&parent=${props.commentid.pk}&page=1&limit=10000`)
        .then(res => {
          const data = res.data
          if (data.error)  {
            notification.error({
              message: "Error retreiving post comments!"
          })
          }
          let temp_replies = []
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
                avatar:key.avatar
              }
            }
            temp_replies.push(
              <Comments 
                key={index} 
                commentid={commentid}
                Username={props.Username} 
                isLoggedIn={props.isLoggedIn}
                postid_path={props.postid_path}
                postid={props.postid}
                child={true}
              />
            )});
            setreplies(temp_replies)
          })
        .catch(err => {
          notification.error({
            message: "Error retreiving post comments!"
        })
        })
      }
  },[showReplies,props.Username,props.isLoggedIn,props.postid_path,props.postid,props.commentid.pk]);
  
  function toggleLikes() {
    if (!props.Username) {
      notification.warning({
        message: "Please log in to rate!"
    })
      return;
    }
    if (commentid.rated === -1){
      setcommentid((prevState) => ({...prevState,
        rated:1,
        likes:prevState.likes + 1
        }))
    } else if (commentid.rated === 0) {
      setcommentid((prevState) => ({...prevState,
        rated:1,
        likes:prevState.likes + 1,
        dislikes:prevState.dislikes - 1
        }))
    } else {
      setcommentid((prevState) => ({...prevState,
        rated:-1,
        likes:prevState.likes - 1,
        }))
    }
    axios.put(`${URL}/forum/posts/comments/ratingsedit`, {comment_id:props.commentid.pk, username:props.Username, rate:'likes'})
    .then(res => {
      const data = res.data
      if (data.error)  {
        notification.error({
          message: "Error updating comment ratings!"
      })
      } else {

      }
      })
    .catch(err => {
      notification.error({
        message: "Error updating comment ratings!"
    })
    })
  }

  function toggleDisLikes() {
    if (!props.Username) {
      notification.warning({
        message: "Please log in to rate!"
    })
      return;
    }
    if (commentid.rated === -1){
      setcommentid((prevState) => ({...prevState,
        rated:0,
        dislikes:prevState.dislikes + 1
        }))
    } else if (commentid.rated === 0) {
      setcommentid((prevState) => ({...prevState,
        rated:-1,
        dislikes:prevState.dislikes - 1
        }))
    } else {
      setcommentid((prevState) => ({...prevState,
        rated:0,
        likes:prevState.likes - 1,
        dislikes:prevState.dislikes + 1
        }))
    }
    axios.put(`${URL}/forum/posts/comments/ratingsedit`, {comment_id:props.commentid.pk, username:props.Username, rate:'dislikes'})
    .then(res => {
      const data = res.data
      if (data.error)  {
        notification.error({
          message: "Error updating comment ratings!"
      })
      } else {
      
      }
      })
    .catch(err => {
      notification.error({
        message: "Error updating comment ratings!"
    })
    })
  }
  const Editable = Edit && (props.Username === commentid.posted_by)
  let content;

  function Editcontent(body) {
    setcommentid((prevState) => ({...prevState,
      body:body
      }))
  }
 
  if (!Editable) {
    content = 
      <p style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}}> {commentid.body}</p>
  }
  else {
    content = 
      <TextArea ref={bodyInput} type="text" defaultValue={commentid.body} onChange={(e) => Editcontent(e.target.value)}/>
  }
  return ( 
    <>
    {Show ?
    <><Comment key={props.index}
      actions={[
        <span onClick={toggleLikes}>{React.createElement(commentid.rated === 1 ? LikeFilled:LikeOutlined)}</span>,
        <span>{commentid.likes}</span>,
        <span onClick={toggleDisLikes}>{React.createElement(commentid.rated === 0 ? DislikeFilled: DislikeOutlined)}</span>,
        <span>{commentid.dislikes}</span>,
        <span style={{display: repliesCount ? "":"none", color:"#007bff"}} onClick={showallReplies}>{(!showReplies) ? `Show all ${repliesCount} replies`:`Hide ${repliesCount} replies`}</span>,
        <span style={{color:"#007bff"}} key="comment-nested-reply-to" onClick={showReplyBox}>{!showBox ? "Reply" :"Hide Reply"}</span>]}
      
      author={
        
        <div className="comment-header">
          <div style={{color:"#007bff"}} ><Link to={`/${commentid.posted_by}/Stats/page=1`}>{commentid.posted_by}</Link></div>
          <div>{commentid.edited} {gettime(commentid.posted_date)}</div>
        </div>
        }
    
      content={
        <div>
          <div className="modify-btn-comment" style={{display:commentid.posted_by === props.Username ? "":"none"}}>
            <Button size="sm" variant="outline-danger" onClick={() => onDeleteComment(props.commentid.pk)}>Delete</Button>
            <Button size="sm" variant="outline-primary" onClick={() => onEditComment(props.commentid.pk)}>{!Edit ? "Edit": "Save"}</Button>
          </div>
          <div 
            style={{paddingTop:'20px',whiteSpace: "pre-wrap"}} >
            {content}
          </div>
        </div>
      }
      avatar={
        <Link to={`/${commentid.posted_by}/Stats/page=1`}>
          <Avatar
            src={commentid.avatar ? commentid.avatar: def_Avatar}
          />
        </Link>
      }
    >
  
    {showReplies ? replies: ""}
    <Form onSubmit={onSubmitHandler} style={{display: showBox ? "": "none"}}>
      <div className="Form-child">
        <div style={{color: "red", display: props.isLoggedIn ? "none":""}}>Log In First!</div>
        <div>
          <TextArea ref={replyInput} value={ReplyText} rows={2} onChange={onChangeInput} required= {true}/>
        </div>
        <div>
          <Button size="sm" variant="outline-primary"  className="btn-comment" type="submit" disabled={!props.isLoggedIn}><p>Add</p></Button>
        </div>
      </div>
    </Form>
    </Comment><hr/></>: ""}
  </>
  );
}
 
export default Comments;
