import { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

const CLIENT_ID = 'c5b9b11c06c843de9849503eced353cf';
const CLIENT_SECRET = 'a5e98c3c4b154e76ba2b2c45e48652d6';

function SpotifyPlayerComponent() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(CLIENT_ID + ':' + CLIENT_SECRET)}`,
        },
        body: 'grant_type=client_credentials',
      });
      const data = await response.json();
      setToken(data.access_token);
    };
    fetchData();
  }, []);

  return (
    <div>
      <SpotifyPlayer
        token={token}
        uris={['spotify:playlist:37i9dQZF1DX0kbJZpiYdZl', 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd']}
      />
    </div>
  );
}

export default SpotifyPlayerComponent;
