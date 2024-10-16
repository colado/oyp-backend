const axios = require("axios");
const querystring = require("querystring");

const loginSpotify = (req, res) => {
  // TODO: Do we really need this scope? Can we do with a smaller scope?
  const scope = "user-read-private user-read-email"; // Scopes define what data your app needs
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
  const spotifyAuthUrl =
    `https://accounts.spotify.com/authorize?` +
    `response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}` +
    `&scope=${scope}&redirect_uri=${redirectUri}`;

  res.redirect(spotifyAuthUrl);
};

const handleSpotifyCallback = async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).send("Authorization code is missing");
  }

  try {
    const tokenResponse = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;

    // Set the tokens in HTTP-only cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect("http://localhost:5173/");
  } catch (error) {
    console.error("Error exchanging code for token:", error);

    res.status(500).send("Authentication failed");
  }
};

const fetchPlaylists = async (accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching playlists from Spotify:', error);
    return null;
  }
};

module.exports = { loginSpotify, handleSpotifyCallback, fetchPlaylists };
