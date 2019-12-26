const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Video = require("./models/video");
const cv = require("opencv4nodejs");

app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);

mongoose.connect("mongodb://localhost:27017/camera-system-app", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, "video-" + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
let upload = multer({
  storage: storage
});

app.use(express.static("./public"));
app.set("view engine", "ejs");

// let cap = new cv.VideoCapture(0);
// cap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
// cap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

const FPS = 25;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/livestream", (req, res) => {
  res.render("livestream");
});

app.get("/videos", (req, res) => {
  Video.find((err, videos) => {
    if (err) console.log(err);
    else {
      console.log(videos);
      res.render("video", { videos: videos });
    }
  });
});

app.post("/upload", upload.single("video"), (req, res) => {
  let path = req.file.path.slice(6);
  Video.create({ link: path }, (err, video) => {
    if (err) console.log(err);
    else {
      console.log(video);
      res.send("Successfully");
    }
  });
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("image", data => {
    io.emit("encoded_image", data);
  });
});

http.listen(8000, () => {
  console.log("The server has started");
});
