const axios = require("axios");

// TODO: Will need to be refactored at some point with refresh/DID logic
const isAuthenticated = async (req) => {
  const accessToken = req.cookies["access_token"];
  if (!accessToken) {
    console.log("No access token found.");
    return false;
  }

  try {
    // Test if the access token is valid by making a request to the Spotify API
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Spotify response:", response.status);

    if (response.status === 200) {
      console.log("Access token is valid.");
      return true;
    } else {
      console.log("Access token is invalid.");
      return false;
    }
  } catch (error) {
    console.error("Error validating access token:", error.message);
    return false; // Token is invalid or expired
  }
};

module.exports = { isAuthenticated };
