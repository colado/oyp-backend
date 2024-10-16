const express = require("express");
const { loginSpotify, handleSpotifyCallback, importPlaylistsFromSpotify } = require("../services/spotifyService");
const router = express.Router();

router.get("/login", loginSpotify);
router.get("/callback", handleSpotifyCallback);
router.post("/import", importPlaylistsFromSpotify);

module.exports = router;
