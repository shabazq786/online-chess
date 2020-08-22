import React from 'react'
import {Modal,Spinner} from 'react-bootstrap'
import {Icon} from 'semantic-ui-react'
import './Loading.css'

const Loading = (props) => {

  return (
    <>
    <Modal.Dialog>
      <div className="loading-icon">
        <Icon onClick={() => props.GameState(0)} link name='close' size='large' />
      </div>
      <Modal.Body className="modal-container">
        <p>Searching for Opponent...</p>
        <Spinner className="spinner" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Modal.Body>
    </Modal.Dialog>
    
    </>
  );
}
 
export default Loading;