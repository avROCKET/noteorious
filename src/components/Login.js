import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import "./Login.css"
import notes from '../assets/notes.svg'
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [signupInfo, setSignupInfo] = useState({
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: ''

    })

    const navigate = useNavigate();

    //Allows user to stay logged in once authorized.
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user){
                navigate('/homepage');
            }
        });
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    //Routes user to Homepage once authonization is successful, otherwise, user receives error message.
    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password).then(() => {
            navigate('/homepage')
        }).catch((err) => 
            alert(err.message));
    };
    
    //Routes user to Homepage once registration is successful, otherwise, user receives error message.
    const handleSignUp = () => {
        if (signupInfo.email !== signupInfo.confirmEmail){
            alert("Email does not match.")
            return;
        } else if(signupInfo.password !== signupInfo.confirmPassword){
            alert("Passwords do not match.")
            return;
        }
        createUserWithEmailAndPassword(auth, signupInfo.email, signupInfo.password).then(()=> {
            navigate("/homepage")
        }).catch((err) => 
        alert(err.message));
    };

    return (
        <div className="login">
            <h1>NOTEorious</h1>
            <p>online note taking. made simple.</p>
            <img src={notes} className="notes-svg" />
            <div className="login-container">
                {isRegistering ? (
                <>
                    <input type = "email" placeholder="Enter Email Address" value={signupInfo.email} onChange={(e) => setSignupInfo({...signupInfo, email: e.target.value})}/>
                    <input type = "email" placeholder="Confirm Email Address" value={signupInfo.confirmEmail} onChange={(e) => setSignupInfo({...signupInfo, confirmEmail: e.target.value})}/>
                    <input type = "password" placeholder="Enter Password" value={signupInfo.password} onChange={(e) => setSignupInfo({...signupInfo, password: e.target.value})}/>
                    <input type = "password" placeholder="Confirm Password" value={signupInfo.confirmPassword} onChange={(e) => setSignupInfo({...signupInfo, confirmPassword: e.target.value})}/>
                    <button onClick={handleSignUp}>Sign Up</button>
                    <button onClick={() => setIsRegistering(false)}>Return to Login</button>
                </>
                ) : ( 
                <>
                    <input type = "email" placeholder="Enter Email Address" onChange={handleEmailChange} value={email} />
                    <input type = "password" placeholder="Enter Password" onChange={handlePasswordChange} value={password} />
                    <button className="signin-button" onClick={handleSignIn}>Sign In</button>
                    <button className="create-button" onClick={() => setIsRegistering(true)}>Create an Account</button>
                </>
                )}
            </div>
        </div>
    )
}