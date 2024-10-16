const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

// Function to save playlist data to IPFS
const savePlaylistToIPFS = async (playlistData) => {
  const formData = new FormData();
  formData.append("file", JSON.stringify(playlistData));

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error saving playlist to IPFS:", error);
    return null;
  }
};

// Save playlists to IPFS (combined flow)
const savePlaylistsToIPFS = async (req, res) => {
  const accessToken = req.cookies["access_token"];

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No access token provided" });
  }

  const playlists = await fetchPlaylists(accessToken);

  if (!playlists) {
    return res
      .status(500)
      .json({ message: "Failed to fetch playlists from Spotify" });
  }

  const cid = await savePlaylistToIPFS(playlists);

  if (cid) {
    res.json({ message: "Playlists saved to IPFS", cid });
  } else {
    res.status(500).json({ message: "Failed to save playlists to IPFS" });
  }
};

module.exports = { savePlaylistsToIPFS };
