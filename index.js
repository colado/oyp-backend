const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = 3000;

// TODO: Check if this is still needed
app.use(bodyParser.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from local frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(cookieParser());
app.use(express.json());

const spotifyRoutes = require("./routes/spotifyRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/spotify", spotifyRoutes);
app.use("/playlists", playlistRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
