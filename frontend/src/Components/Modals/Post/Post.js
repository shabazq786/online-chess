import React, { useState} from 'react'
import axios from 'axios'
import { store } from '../../../store'
import { Modal, Form, Button } from 'react-bootstrap'
import { Input, notification} from 'antd'
import {URL} from '../../../Url'
import './Post.css'

const { TextArea } = Input;
const Post = (props) => {
  const [Title, setTitle] = useState("")
  const [Body, setBody] = useState("")
  const Username = store.getState().Username

  function onSubmitHandler(e) {
    e.preventDefault();
    if (!Title.trim() || !Body.trim()) {
      notification.warning({
        message: 'Invalid Post!',
        description: 'field contains whitespaces only'
    })
      return;
    }
    axios.post(`${URL}/forum/posts/`, {
      posted_by: Username,
      title: Title,
      body: Body
    })
    .then(res => {
      const data = res.data
      if (data[0].error) {
        notification.error({
          message: 'Error Creating a Post!'
      })
      } else {
        notification.success({
          message: 'Successfully Created a Post!'
      })
        props.onHide();
      }
    })
    .catch(err => {
      notification.error({
        message: 'Error Creating a Post!'
    })
    })
  }

    function onChangeTitle(e) {
      setTitle(e.target.value)
    }

    function onChangeBody(e) {
      setBody(e.target.value)
    }

    return ( 
      < Modal show = { props.show }
        onHide = { props.onHide }
        size = "lg"
        aria-labelledby = "contained-modal-title-vcenter"
        centered style = {{
          position: "relative",
          margin: "auto",
          maxWidth: "500px",
          alignContent: "center"
        }} 
      >
        < Modal.Header closeButton ><h3> Create Post </h3></Modal.Header>
        <Modal.Body>
          <Form onSubmit = { onSubmitHandler }>
            <div className = "create-post-title" > Add Title: </div> 
            <div className = "post-titlebox">
              <Input onChange = { onChangeTitle } maxLength = "100" required = { true }/> 
            </div>
            <div className = "post-description" > Add Description:</div> 
            <div className = "post-descriptionbox" >
              < TextArea rows = { 4 }
                maxLength = "3000"
                onChange = { onChangeBody }
                required = { true }
              /> 
            </div> 
            <div className = "post-submit-btn">
              <Button type = "submit" > Create Post </Button> 
            </div> 
          </Form> 
        </Modal.Body>
      </Modal>
    );
}
export default Post;