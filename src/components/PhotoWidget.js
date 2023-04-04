import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase.js";

const PhotoWidget = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  // Upload an image to Firebase Storage
  const uploadImage = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      const storageRef = ref(storage, `${Date.now()}_${e.target.files[0].name}`);
      uploadBytes(storageRef, e.target.files[0]).then(() => {
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

  // Render the PhotoWidget component
  return (
    <div className="photo-widget">
      <h3>Photo Widget</h3>
      <input type="file" onChange={uploadImage} />
      {url && <img src={url} alt="Uploaded" />}
    </div>
  );
};

export default PhotoWidget;