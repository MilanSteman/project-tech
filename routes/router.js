const express = require("express");
const multer = require("multer");
const { MongoClient } = require("mongodb");

const router = express.Router();
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yxc1m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

let database = null;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) throw err;
  console.log("connected");
  database = client.db(process.env.DB_NAME);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.png`);
  },
});

const upload = multer({ storage: storage });

const categories = ["Games", "Sports", "Movies"];

const profile = {
  message: "Welkom terug, milan.",
  displayname: "milan",
  username: "milannn",
  title: "Home",
  picture: "images/profile-picture.jpg",
  banner: "images/michael.jpg",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

  posts: ["images/michael.jpg", "images/michael.jpg", "images/michael.jpg"],
};

// temporary array for users
const users = [
  {
    username: "Simeon Yetarian",
    picture: "images/simeon.png",
    description:
      "Go and get it. Just try to bring the car back in good condition huh?",
    games: ["GTA V", "GTA IV"],
  },
  {
    username: "Franklin Clinton",
    picture: "images/franklin.jpg",
    description:
      "A what? A credit fraud? Be serious dude.... I just work the repo man.",
    games: ["GTA V", "GTA San Andreas"],
  },
  {
    username: "Michael Townley",
    picture: "images/michael.jpg",
    description:
      "You forget a thousand things everyday, pal. Make sure this is one of them.",
    games: ["GTA V", "GTA San Andreas"],
  },
];

router.get("/", (req, res) => {
  res.render("home.njk", { profile, users });
});

router.get("/profile", (req, res) => {
  res.render("profile.njk", { profile, users });
});

router.get("/profile-settings", (req, res) => {
  res.render("profile-settings.njk", { profile, categories });
});

// TODO:: maak een active user die de net aangemaakte user wordt, wanneer er geen active user is profiel aanmaken.
router.post(
  "/profile-settings",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  (req, res) => {
    const user = {
      username: req.body.name,
      description: req.body.description,
      games: req.body.categories,
      avatar: req.files.avatar[0],
      banner: req.files.banner[0],
    };

    database.collection("users").insertOne(user);

    res.redirect(`/profiles/${user._id}`);
  }
);

// middleware
router.use((req, res, next) => {
  res.status(404).send("404");
});

module.exports = router;
