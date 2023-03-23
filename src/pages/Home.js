import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { set, ref, onValue, remove, update } from "firebase/database";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import background from "../assets/background.mp4";
import Header from "../components/header.js";
import { Col, Row } from "react-bootstrap";
import TableNotes from "../components/table.js";
import NoteModal from "../components/noteEditorModal.js";
import NoteViewerModal from '../components/noteViewerModal';
import WeatherB from "../components/WeatherB.js";
import SpotifyPlayerComponent from "../components/Spotify.js";
import SpotifyAuthorizationComponent from "../components/SpotifyAuth.js";

export default function Home() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [openEditorModal, setOpenEditorModal] = useState(false);
  const [openViewerModal, setOpenViewerModal] = useState(false);
  const [showSpotifyAuth, setShowSpotifyAuth] = useState(false);

  const handleSpotifyAuthButtonClick = () => {
    setShowSpotifyAuth(true);
  };

  // NOTE: If user is not signed in, they will be routed to the Login page
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setNotes([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((note) => {
              setNotes((oldNotes) => [...oldNotes, note]);
            });
          }
          setIsLoading(false);
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  //Allows user to sign out.
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Add a Note
  const openAddNoteModal = () => setOpenEditorModal(true);

  const addNote = (title, content) => {
    const uidd = uid(); // This creates an ID for each note
    const newNote = {
      uidd,
      title,
      content, 
    };
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {...newNote});
    setOpenEditorModal(false);
  };

  // Preparing for edit note
  const handleEdit = (note) => {
    setNote({...note});
    setIsEdit(true);
    setOpenEditorModal(true);
  };

  // Update a Note
  const updateNote = (title, content) => {
    const updatedNote = {
      ...note,
      title,
      content, 
    };

    update(ref(db, `/${auth.currentUser.uid}/${updatedNote.uidd}`), {
      ...updatedNote,
    });
    setNotes((oldNotes) => {
        return oldNotes.map((oldNote) => {
            if (updatedNote.uidd === oldNote.uidd) {
                oldNote.content = updatedNote.content;
            }
            return oldNote;
        });
    });
    setNote({});
    setIsEdit(false);
    setOpenEditorModal(false);
  };

  // Delete a Note
  const deleteNote = (note) => {
    remove(ref(db, `/${auth.currentUser.uid}/${note.uidd}`));
  };

  const handleCloseEditorModal = () => {
    setOpenEditorModal(false);
    setIsEdit(false);
    setNote({});
  }

  // View note
  const handleView = (note) => {
    setNote(note);
    setOpenViewerModal(true);
  }

  const handleCloseViewerModal = () => {
    setOpenViewerModal(false);
    setIsEdit(false);
    setNote({});
  }

  return (
    <div className="homepage">
      <Header signOut={handleSignOut} />
      <video src={background} autoPlay loop muted />
      <div className="content container">
        <Row className="mt-5 mb-3">

          <Col xs={12}>
            <div className="buttons">
              <button className="addNoteButton" onClick={openAddNoteModal}>
                Create New Note
              </button>
            </div>
          </Col>
        </Row>
        <WeatherB/>
        <Row>
          <Col xs={12}>
            <TableNotes 
              notes={notes} 
              deleteNote={deleteNote} 
              handleEdit={handleEdit} 
              handleView={handleView} 
              isLoading={isLoading}
            />
          </Col>
        </Row>

        {openViewerModal && (
          <NoteViewerModal
            note={note}
            show={openViewerModal}
            setShow={setOpenViewerModal}
            handleClose={handleCloseViewerModal}
          />
        )}

        {openEditorModal && (<NoteModal 
          title={isEdit ? 'Edit Note' : 'Create Note'} 
          isEdit={isEdit}
          show={openEditorModal} 
          setShow={setOpenEditorModal}
          okAction={{
            text: isEdit ? 'Update' : 'Add',
            action: isEdit ? updateNote : addNote,
          }}
          cancelAction={{
            text: 'Cancel',
            action: () => handleCloseEditorModal(),
          }}
          note={note}
        />)}
        <SpotifyPlayerComponent />
        <div>
          <h1>Spotify Auth Test</h1>
          <button onClick={handleSpotifyAuthButtonClick}>Authorize Spotify</button>
          {showSpotifyAuth && <SpotifyAuthorizationComponent />}
          </div>
      </div>
    </div>
  );
}
