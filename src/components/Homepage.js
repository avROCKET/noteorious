import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { set, ref, onValue, remove, update } from "firebase/database";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
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


    /* For now, this method saves notes in an online database for a single, for later sprints we will implement collaboration */
    // Read a Note

    // Add a Note
    const writeData = () => {
        const uidd = uid(); // This creates an ID for each note
        set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
            note: note,
            uidd: uidd,
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

    // Log
    console.log(auth.currentUser)

    return (
        <div className="homepage">
            <button className="logout" onClick={handleSignOut}>Sign Out</button>
            <h1>NOTEorious</h1>
            <br/><br/><br/><br/><br/><br/>

            {
                notes.map(note => (
                    <div className="note">
                        <h2>{note.note}</h2>
                        <button onClick={() => handleEdit(note.uidd)}>Edit</button>
                        <button onClick={() => handleDelete(note.uidd)}>Delete </button>
                    </div>
                ))
            
            }
            <br/><br/>
            <input className= "inputnote" type="text" placeholder="Enter note..." value={note} onChange={(e) => setNote(e.target.value)}/>
            
            {isEdit ? 
                (<div>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => {setEdit(false); setNote(""); }}>Cancel</button>
                </div>
                ) : (
                <div>
                    <button className="addNote" onClick={writeData}>Add Note</button>
                </div>
                )
            }
            
        </div>
    )
}