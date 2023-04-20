import React, { useState } from 'react';
import axios from 'axios';
import styles from './YouTubePlayer.module.css';

const YouTubePlayer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [isInterfaceVisible, setIsInterfaceVisible] = useState(false);

  const API_KEY = 'AIzaSyBAkrVmn0qxOdVYWqC94R3qq9EnH4fLV3Y';

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchVideos = async (e) => {
    e.preventDefault();
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${searchTerm}&key=${API_KEY}&maxResults=6`
    );

    setVideoList(response.data.items);
  };

  const selectVideo = (videoId) => {
    setSelectedVideoId(videoId);
  };

  const toggleInterfaceVisibility = () => {
    setIsInterfaceVisible(!isInterfaceVisible);
  };

  return (
    <div className={styles.container}>
      <button onClick={toggleInterfaceVisibility} className={styles.toggleButton}>
        {isInterfaceVisible ? 'Hide YouTube' : 'Open YouTube'}
      </button>
      
      {isInterfaceVisible && (
        <div className={styles.interface}>
          <form className={styles.form} onSubmit={searchVideos}>
            <input
              className={styles.input}
              type="text"
              placeholder="Search YouTube"
              value={searchTerm}
              onChange={handleChange}
            />
            <button className={styles.searchButton} type="submit">Search</button>
          </form>
          {videoList.length > 0 && (
            <ul className={styles.videoList}>
              {videoList.map((video) => (
                <li
                  className={styles.videoItem}
                  key={video.id.videoId}
                  onClick={() => selectVideo(video.id.videoId)}
                >
                  <img
                    className={styles.thumbnail}
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                  />
                  <span className={styles.title}>{video.snippet.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedVideoId && (
        <div className={styles.player}>
          <iframe
            className={styles.youtubeiframe}
            title="YouTube Video Player"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${selectedVideoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;