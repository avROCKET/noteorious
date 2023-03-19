import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function NoteViewerModal(props) {
   const { setShow, note, handleClose } = props;

  return (
      <Modal show={true} fullscreen={true} onHide={() => setShow(false)}>
         <Modal.Header closeButton>
            <Modal.Title>Note</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <div dangerouslySetInnerHTML={{ __html: note.content }}></div> 
         </Modal.Body>
         <Modal.Footer>
            <Button onClick={handleClose}>
               Close
            </Button>
         </Modal.Footer>
      </Modal>
  );
}
