const express = require("express");
const cookieParser = require("cookie-parser"); // To parse cookies
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());

// Import routes
const spotifyRoutes = require("./routes/spotifyRoutes");
const playlistRoutes = require("./routes/playlistRoutes");

// Use routes
app.use("/spotify", spotifyRoutes);  // Handles Spotify login and callback
app.use("/playlists", playlistRoutes); // Handles playlist retrieval and IPFS saving

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
