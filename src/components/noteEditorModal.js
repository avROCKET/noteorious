import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import './noteEditorModal.css'

export default function NoteEditorModal(props) {
   const { quill, quillRef } = useQuill();
   const [ noteTitle, setNoteTitle ] = useState('');
   const { isEdit, note, setShow, title, okAction, cancelAction } = props;

   React.useEffect(() => {
    if (quill && isEdit) {
      quill.clipboard.dangerouslyPasteHTML(note.content);
      setNoteTitle(note.title);
    } else if (quill) {
      quill.clipboard.dangerouslyPasteHTML("<p></p>");
    }
   }, [isEdit, quill, note.content, note.title]);

   const handleSave = () => {
      if (noteTitle === '') {
         window.alert('Title is required');
         return;
      }
      const noteBodyWithoutTags = quill.root.innerHTML.replace( /(<([^>]+)>)/ig, '');
      if (noteBodyWithoutTags === '') {
         window.alert('Note body is required');
         return;
      }

      okAction.action(noteTitle, quill.root.innerHTML)
   }

   return (
      <Modal show={true} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control type="text" value={noteTitle} placeholder="Note Title" onChange={(e) => setNoteTitle(e.target.value)} />
          </Form.Group>
          <div className="editor">
            <div ref={quillRef} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={cancelAction.action}>
            {cancelAction.text}
          </Button>
          <Button onClick={handleSave}>
            {okAction.text}
          </Button>
        </Modal.Footer>
      </Modal>
   );
}   