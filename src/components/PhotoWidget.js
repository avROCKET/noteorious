import React, { useEffect, useState } from "react";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { ref as dbRef, onValue, push, remove } from "firebase/database";
import { auth, db, storage } from "../firebase.js";
import photologo from "../assets/photologo.jpg";
import styles from "./PhotoWidget.module.css";

const PhotoWidget = () => {
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(dbRef(db, `/${user.uid}/photos`), (snapshot) => {
          const data = snapshot.val();
          const photoArray = [];
          if (data !== null) {
            Object.entries(data).forEach(([key, photo]) => {
              photoArray.push({ key, ...photo });
            });
            setPhotos(photoArray);
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const uploadImage = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      const storageReference = storageRef(storage, `${Date.now()}_${e.target.files[0].name}`);
      const metadata = {
        contentType: e.target.files[0].type,
        customMetadata: {
          uid: auth.currentUser.uid,
        },
      };
      uploadBytes(storageReference, e.target.files[0], metadata).then(() => {
        getDownloadURL(storageReference).then((url) => {
          saveImage(url);
        });
      });
    }
  };

  const saveImage = (url) => {
    push(dbRef(db, `/${auth.currentUser.uid}/photos`), { url });
  };

  const deleteImage = (photo) => {
    remove(dbRef(db, `/${auth.currentUser.uid}/photos/${photo.key}`));
  };

  const downloadImage = (url, filename) => {
    const element = document.createElement("a");
    element.href = url;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };



  return (
    <div className={styles["photo-widget"]}>
      <h3>
        <img
          style={{ height: 35, marginBottom: 3, marginRight: 10 }}
          src={photologo}
          alt="photoriouslogo"
        />
        <b>PHOTOrious</b>
      </h3>
      <div className={styles["photo-upload"]}>
        <input 
          type="file" 
          id="file-input" 
          onChange={uploadImage} 
          className={styles["hidden-file-input"]} 
          accept=".jpeg, .jpg, .png, .gif, .webp, .heif"
        />
        <label htmlFor="file-input" className={styles["upload-button"]}>
          Upload Photo
        </label>
      </div>
      {file && <p>{file.name} has been uploaded.</p>}
      <div className={styles["image-container"]}>
        {photos.map((photo, index) => (
          <div key={index} className={styles["photo-grid-item"]}>
            <img
              src={photo.url}
              alt={`User photo ${index}`}
              onClick={() => window.open(photo.url)}
              className={styles["img"]}
            />
            <div className={styles["photo-options"]}>
              <button onClick={() => window.open(photo.url)} className={styles["downloadButton"]}>
                Download
              </button>
              <button onClick={() => deleteImage(photo)} className={styles["button"]}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoWidget;
