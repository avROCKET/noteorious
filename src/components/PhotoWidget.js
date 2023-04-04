import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase.js";
import photologo from "../assets/photologo.jpg";

const PhotoWidget = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  // Upload an image to Firebase Storage
  const uploadImage = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      const storageRef = ref(storage, `${Date.now()}_${e.target.files[0].name}`);
      const metadata = {
        contentType: e.target.files[0].type,
        customMetadata: {
          "uid": auth.currentUser.uid
        }
      };
      uploadBytes(storageRef, e.target.files[0], metadata).then(() => {
        getDownloadURL(storageRef).then((url) => {
          setUrl(url);
          saveImage(url);
        });
      });
    }
  };

  // Save image URL to Firebase Realtime Database
  const saveImage = (url) => {
    db.ref(`/${auth.currentUser.uid}/photos`).push({ url });
  };

  return (
    <div className="photo-widget">
      <h3><img style={{ height: 35, marginBottom: 2, marginRight: 10}} src={photologo} alt="photoriouslogo"/>PHOTOrious</h3>
      <input type="file" onChange={uploadImage} />
      {file && <p>{file.name} has been uploaded.</p>}
      <div className="image-container">
        <img src={url} alt="Save to your PHOTOrious Cloud." style={{ maxWidth: "100%", maxHeight: "100%" }}/>
      </div>
    </div>
  );
};

export default PhotoWidget;