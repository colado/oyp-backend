const axios = require("axios");
const FormData = require("form-data");

const savePlaylistToIPFS = async (playlistData) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  try {
    // Send JSON data directly to Pinata's pinJSONToIPFS endpoint
    const response = await axios.post(url, playlistData, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET,
      },
    });

    return response.data.IpfsHash; // Return the CID (Content Identifier) from IPFS
  } catch (error) {
    console.error(
      "Error saving playlist to IPFS:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const savePlaylistsToIPFS = async (req, res) => {
  const { playlists } = req.body;

  if (!playlists) {
    return res.status(400).json({ message: "No playlists provided" });
  }

  try {
    // Call the function to save playlists to IPFS
    const cid = await savePlaylistToIPFS(playlists);

    if (!cid) {
      return res
        .status(500)
        .json({ message: "Failed to save playlists to IPFS" });
    }

    // Respond with the CID from IPFS
    res.json({ message: "Playlists saved to IPFS", cid });
  } catch (error) {
    console.error("Error saving playlists to IPFS:", error);
    res.status(500).json({ message: "Error saving playlists to IPFS" });
  }
};

const getPlaylistsFromIPFS = async (req, res) => {
  const { cid } = req.params;
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

  try {
    const playlistData = await axios.get(url);

    if (!playlistData.data) {
      return res
        .status(404)
        .json({ message: "No playlists found for this CID" });
    }

    return res.json(playlistData.data);
  } catch (error) {
    console.error("Error fetching playlists from IPFS:", error);
    return res.status(500).json({ message: "Error fetching playlists" });
  }
};

module.exports = {
  savePlaylistToIPFS,
  savePlaylistsToIPFS,
  getPlaylistsFromIPFS,
};
