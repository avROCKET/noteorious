import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { set, ref, onValue, remove, update } from "firebase/database";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { useQuill } from 'react-quilljs';
import background from "../assets/background.mp4"
import 'quill/dist/quill.snow.css';
import "./Homepage.css"



export default function Homepage() {
    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState("");
    const [isEdit, setEdit] = useState(false);
    const [tempUIDD, setTempUIDD] = useState("");
    const navigate = useNavigate();
    
    
    // NOTE: If user is not signed in, they will be routed to the Login page
    useEffect (() => {
        auth.onAuthStateChanged(user => {
            if (user){
                onValue(ref(db, `/${auth.currentUser.uid}`), snapshot => {
                    setNotes([]);
                    const data = snapshot.val();
                    if (data !== null){
                        Object.values(data).map(note => {
                            setNotes((oldArray) => [...oldArray, note])
                        })
                    }
                })
            } else if(!user){
                navigate('/')
            };
    });
    },[]);
    
    //Allows user to sign out.
    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/');
        }).catch(err => {
            alert(err.message);
        });
    };

    /* For now, this method saves notes in an online database for a single, 
    for later sprints we will implement collaboration */

    // Read a Note

    // Add a Note
    const writeData = () => {
        const uidd = uid(); // This creates an ID for each note
        const content = quill.root.innerHTML; // Get the content of the editor
        set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
          note: note,
          uidd: uidd,
          content: content, // Add the content to the note object
        });
        setNote("");
    };

    // Update a Note, need to fix for next sprint
    const handleEdit = (note) => {
        setEdit(true);
        setNote(note.note);
        setTempUIDD(note.uidd);
    };

    const handleUpdate = () => {
        update(ref(db, `/${auth.currentUser.uid}/${tempUIDD}`), {
            note: note,
            tempUIDD: tempUIDD
        });
        setNote("");
        setEdit(false);
    };
        
    // Delete a Note
    const handleDelete = (uid) => {
        remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
    };

    // Quill.js 
    const { quill, quillRef } = useQuill();
    React.useEffect(() => {
        if (quill) {
          quill.on('text-change', (delta, oldDelta, source) => {
            console.log('Text change!');
            console.log(quill.getText()); // Get text only
            console.log(quill.getContents()); // Get delta contents
            console.log(quill.root.innerHTML); // Get innerHTML using quill
            console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
          });
        }
      }, [quill]);

    // Log
    console.log(auth.currentUser)

    return (
        <div className="homepage">
            <div className= "overlay"></div>
            <video src={background} autoPlay loop muted />
            <div className="content">
            <button className="logout" onClick={handleSignOut}>Sign Out</button>
            <h1>NOTEorious</h1>
            <br/><br/><br/><br/><br/><br/>
            
            {isEdit ? 
                (<div className="edit">
                    <button  onClick={handleUpdate}>Update</button>
                    <button  onClick={() => {setEdit(false); setNote(""); }}>Cancel</button>
                </div>
                ) : (
                <div classname = "edit">
                    <button className="addNote" onClick={writeData}>Add Note</button>
                </div>
                )
            }
            <div className="textedit">
                <div style={{ width: 1100, height: 1000}}>
                    <div ref={quillRef}/>
                </div>
            </div>
            
            
            <div className="notesMap">
            {
                notes.map(note => (
                <div className="note" key={note}>
                <button onClick={() => handleEdit(note.uidd)}>Edit</button>
                <button onClick={() => handleDelete(note.uidd)}>Delete </button>
                <h2>{note.note}</h2>
                <div dangerouslySetInnerHTML={{ __html: note.content }}></div> {/* Display the content */}
                </div>
                 ))
            }
            </div>
            <br/><br/>
            
           
                
            </div>
            
        </div>
    )
    
}