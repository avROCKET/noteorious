import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import googlelogo from "../assets/google.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({ visible: false, message: "" });

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/homepage");
      }
    });
  }, [navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => showAlert(err.message));
  };

  const handleSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => showAlert(err.message));
  };

  const handleSignUp = () => {
    if (signupInfo.email !== signupInfo.confirmEmail) {
      showAlert("Email does not match.");
      return;
    } else if (signupInfo.password !== signupInfo.confirmPassword) {
      showAlert("Passwords do not match.");
      return;
    }
    createUserWithEmailAndPassword(auth, signupInfo.email, signupInfo.password)
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => showAlert(err.message));
  };

  const handlePasswordReset = () => {
    if (email === "") {
      showAlert("Please enter your email address.");
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          showAlert("Password reset email sent! Check your inbox.");
        })
        .catch((err) => {
          showAlert(err.message);
        });
    }
  };

  const showAlert = (message) => {
    setAlert({ visible: true, message });
  };

  const hideAlert = () => {
    const alertElement = document.querySelector(".custom-alert");
    if (alertElement) {
      alertElement.classList.add("fade-out");
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
        alertElement.classList.remove("fade-out");
      }, 300); // The duration of the fade-out animation
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isRegistering) {
        handleSignUp();
      } else {
        handleSignIn();
      }
    }
  };
  

  return (
    <div className="login" onKeyDown={handleKeyDown}>
      {alert.visible && (
        <>
          <div className="overlay"></div>
          <div className={`custom-alert ${alert.visible ? "visible" : ""}`}>
            <p>{alert.message}</p>
            <button onClick={hideAlert}>OK</button>
          </div>
        </>
      )}
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <h1>NOTEorious</h1>
      <p>online note taking. made simple.</p>
      {isRegistering ? (
        <>
          <div className="login-container">
            <h3>Create An Account</h3>
            <label className="empty-space"></label>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={signupInfo.email}
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, email: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Confirm Email Address"
              value={signupInfo.confirmEmail}
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, confirmEmail: e.target.value })
              }
            />
            <h1 className="empty-space"></h1>
            <input
              type="password"
              placeholder="Enter Password"
              value={signupInfo.password}
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, password: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupInfo.confirmPassword}
              onChange={(e) =>
                setSignupInfo({
                  ...signupInfo,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={() => setIsRegistering(false)}>
              Return to Login
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="login-container">
            <h3>Login Here</h3>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email Address"
              onChange={handleEmailChange}
              value={email}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              onChange={handlePasswordChange}
              value={password}
            />
            <button onClick={handleSignIn}>Log In</button>
            <button onClick={() => setIsRegistering(true)}>Create an Account</button>
            <button onClick={handleSignInWithGoogle}>Log In with 
            <img
            style={{ height: 25, marginBottom: 0, marginLeft: 12 }}
            src={googlelogo}
            alt="googlelogo"
            />
            </button>
            <button onClick={handlePasswordReset}>Forgot Password?</button>
          </div>
        </>
      )}
    </div>
  );
}
