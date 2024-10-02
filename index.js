const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

const app = express();
const port = 3000;

// Spotify login route (Step 1: Redirect to Spotify authorization page)
app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email"; // Scopes define what data your app needs
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
  const spotifyAuthUrl =
    `https://accounts.spotify.com/authorize?` +
    `response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}` +
    `&scope=${scope}&redirect_uri=${redirectUri}`;

  res.redirect(spotifyAuthUrl);
});

// Spotify callback route (Step 2: Handle the callback and exchange the code for an access token)
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).send("Authorization code is missing");
  }

  try {
    // Step 3: Exchange the authorization code for an access token
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

    // Step 4: Use access token to access Spotify API (optional, here for demo)
    const userProfileResponse = await axios.get(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Send the access token and user profile to the frontend
    res.send({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_profile: userProfileResponse.data,
    });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).send("Authentication failed");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
