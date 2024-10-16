const express = require("express");
const { savePlaylistsToIPFS } = require("../services/ipfsService");
const router = express.Router();

router.post("/save", savePlaylistsToIPFS);

module.exports = router;
