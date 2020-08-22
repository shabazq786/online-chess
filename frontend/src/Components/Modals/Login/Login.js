import React, { useState } from 'react'
import axios from 'axios'
import { store } from '../../../store'
import { Modal, Button, Form } from 'react-bootstrap'
import {Upload, notification} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import {URL} from '../../../Url'
import { update_isLoggedIn, update_Username, update_Avatar } from '../../../redux/actions/actions'
import './Login.css'

const Login = (props) => {
  const [active, setactive] = useState(true)
  const [Username, setUsername] = useState("")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")
  const [UsernameWarning, setUsernameWarning] = useState("")
  const [EmailWarning, setEmailWarning] = useState("")
  const [PasswordWarning, setPasswordWarning] = useState("")
  const [ConfirmPasswordWarning, setConfirmPasswordWarning] = useState("")
  const [Image,setImage] = useState("")
  const [Imageloading,setImageloading] = useState(false)
  
  const uploadButton = (
    <div>
      {Imageloading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  function onChangeEmail(e) {
    setEmail(e.target.value)
  }

  function onChangeUsername(e) {
    setUsername(e.target.value)
  }

  function onChangePassword(e) {
    setPassword(e.target.value)
  }

  function onChangeConfirmPassword(e) {
    setConfirmPassword(e.target.value)
  }

  function onClickHandler() {
    setactive(!active)
    setUsernameWarning("")
    setEmailWarning("")
    setPasswordWarning("")
    setConfirmPasswordWarning("")
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    if (active) {
      axios.post(`${URL}/users/user=${Username}`, {password: Password })
        .then(res => {
          const data = res.data[0]
          if (data.error === "username doesn't exist") {
            setUsernameWarning("Username doesn't exist!") 
            return;
          } else {
            setUsernameWarning("")
          }
          if (data.error === "invalid password") {
            setPasswordWarning("Invalid password!")
          } else {
            props.onHide()
            store.dispatch(update_Username(Username))
            store.dispatch(update_isLoggedIn(true))
            store.dispatch(update_Avatar(data.avatar))
            notification.success({
              message: 'Successfully Logged In'
          })
          }
        })
        .catch(err => {
          notification.error({
            message: "Error Retreiving User Info, Please try again!"
        })
        })
    } else {
      let flag = true
      if (Password !== ConfirmPassword) {
        setPasswordWarning("password don't match!")
        setConfirmPasswordWarning("password don't match!")
        flag = false;
      } else {
          setPasswordWarning("")
          setConfirmPasswordWarning("")
      }
      if (Password.length < 8) {
          setPasswordWarning("password must be at least 8 characters long")
          flag = false;
      } else if (!Password.trim()) {
          setPasswordWarning("invalid password")
          flag = false;
      } else {
        setPasswordWarning("")
      }
      if(Username.indexOf(' ') >= 0) {
        setUsernameWarning("invalid username (no spaces allowed)")
        flag = false;
      } else {
        
        setUsernameWarning("")
      }
      if (!flag) {
        return;
      }
      flag = true;
      axios.post(`${URL}/users/`, { username: Username.trim(), email: Email.trim(), password: Password, avatar: Image})
        .then(res => {
          const data = res.data[0]
          if (data.error === 'username exists') {
            setUsernameWarning('username exists!')
            flag = false
          } else {
            setUsernameWarning('')
          }
          if (data.error === 'email exists') {
            setEmailWarning('email exists!')
            flag = false
          } else {
            setEmailWarning('')
          }
          if (data.error === 'User could not be added!') {
            notification.error({
              message: 'User cannot be added, Please try again!'
          })
            flag = false;
          }
          if (flag) {
            notification.success({
              message: 'Successfully Registered!'
          })
            onClickHandler()
          }
        })
        .catch(err => {
          notification.error({
            message: 'Error Registering, Please try again!'
        })
        })
      }
    }
    function getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }

    function beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        notification.warning({
          message: 'Only JPN/PNG files are valid!'
      })
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        notification.warning({
          message: 'Image must be smaller than 2MB!'
      })
      }
      return isJpgOrPng && isLt2M;
    }

    function onChangeImage(info) {
      if (info.file.status === 'uploading') {
        setImageloading(true)
        return;
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, Image =>
          setImage(Image),
          setImageloading(false)
        );
      }
    };
    const dummyRequest = ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    };

    return ( 
      <>
        <Modal 
          show = { props.show }
          onHide = { props.onHide }
          animation = { false }
          size = "lg"
          aria-labelledby = "contained-modal-title-vcenter"
          centered style = {{
            position: "relative",
            margin: "auto",
            maxWidth: "500px",
            alignContent: "center",
            overflowY:"none"
          }} 
        >
        <Modal.Header closeButton><h3>{ active ? "Login " : "Register Now" }</h3></Modal.Header> 
        <Modal.Body>
          <div style = {{ display: active ? "none" : ""}}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={dummyRequest}
              beforeUpload={beforeUpload}
              onChange={onChangeImage}
            >
              {Image ? <img src={Image} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </div>
          <Form onSubmit = { onSubmitHandler }>
            <Form.Group controlId = "formBasicUserName">
            <div style={{marginBottom:"5px"}}>Enter Username:</div>
              <Form.Control onChange = { onChangeUsername }
                maxLength = "50"
                placeholder = "username"
                required = { true }
              /> 
              <Form.Text className = "text-muted" style = {{ color: 'red' }} >
              <li > { UsernameWarning } </li> </Form.Text> 
            </Form.Group> 
            <div style = {{ display: active ? "none" : "" }}>
              <Form.Group controlId = "formBasicEmail">
              <div style={{marginBottom:"5px"}}>Enter Email Address:</div>
                <Form.Control 
                  onChange = { onChangeEmail } 
                  type = "email"
                  maxLength = "50"
                  placeholder = "username@gmail.com"
                  required = {!active }
                /> 
                <Form.Text className = "text-muted" style = {{ color: 'red' } }>
                  <li> { EmailWarning } </li> 
                </Form.Text> 
              </Form.Group> 
            </div> 
            <Form.Group controlId = "formBasicPassword">
              <div style={{marginBottom:"5px"}}>Enter Password:</div>
              <Form.Control 
                onChange = { onChangePassword }
                maxLength = "15"
                type = "password"
                placeholder = "password"
                required = { true }
              /> 
              <Form.Text className = "text-muted" style = {{ color: 'red' }}>
                <li> { PasswordWarning }</li> 
              </Form.Text> 
            </Form.Group> 
            <div style = {{ display: active ? "none" : ""}}>
              <Form.Group>
              <div style={{marginBottom:"5px"}}>Confirm Password:</div>
                <Form.Control 
                  onChange = { onChangeConfirmPassword }
                  maxLength = "15"
                  type = "password"
                  placeholder = "password"
                  required = {!active }
                /> 
                <Form.Text className = "text-muted"style = {{ color: 'red' } } >
                  <li> { ConfirmPasswordWarning } </li> 
                </Form.Text> 
              </Form.Group> 
            </div> 
            <div className = "submit-btn" >
              <Button className = "submit-btn-child-1"
                variant = "primary"
                type = "submit" > { active ? "Log In" : "Register" } 
              </Button> 
              <div className = "submit-btn-child-2"> Or </div> 
              <div className = "submit-btn-child-3" onClick = { onClickHandler } > {!active ? "Log In" : "Register Now" } </div> 
            </div> 
          </Form> 
        </Modal.Body> 
      </Modal> 
    </>
    );
}
export default Login;
