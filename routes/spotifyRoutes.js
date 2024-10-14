const express = require("express");
const { loginSpotify, handleSpotifyCallback } = require("../services/spotifyService");
const router = express.Router();

// Route to handle Spotify login
router.get("/login", loginSpotify);

// Route to handle Spotify OAuth callback
router.get("/callback", handleSpotifyCallback);

module.exports = router;
