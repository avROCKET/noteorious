import { useEffect } from 'react';
import qs from 'querystring-es3';

const AUTH_URL = 'https://accounts.spotify.com/authorize';

const SpotifyAuthorizationComponent = () => {
  const redirectUri = encodeURIComponent('https://noteorious.netlify.app/homepage');

  const scopes = ['user-read-private', 'user-read-email', 'streaming'];

  const clientId = 'c5b9b11c06c843de9849503eced353cf';

  const queryParams = {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
  };

  const authUrl = `${AUTH_URL}?${qs.stringify(queryParams)}`;

  useEffect(() => {
    window.location.href = authUrl;
  }, [authUrl]);

  return (
    <div>
      <h2>Authorizing your Spotify account...</h2>
      <p>Please wait while we redirect you to the Spotify authorization page.</p>
    </div>
  );
};

export default SpotifyAuthorizationComponent;