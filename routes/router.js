const express = require("express");
const multer = require("multer");
const { MongoClient, ObjectID } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const router = express.Router();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yxc1m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

let db = null;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) throw err;
  console.log("connected");
  db = client.db(process.env.DB_NAME);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`);
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

/**
 * This creates a new user from data provided by the user on the profile settings page.
 * It will insert data into the collection 'users' and redirect the user to the created page with a slug of the user ID.
 */
router.post(
  "/profile-settings",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  (req, res, user) => {
    // Create a variable user to insert the necessary data into the database
    user = {
      name: req.body.name,
      description: req.body.description,
      games: req.body.categories,
      avatar: req.files.avatar[0],
      banner: req.files.banner[0],
    };

    // Insert the variable above into the collection 'users' within the database.
    db.collection("users").insertOne(user);

    // Automatically redirect to the created user
    res.redirect(`/profiles/${user._id}`);
  }
);

/**
 * This will render a profile from an existing user with its data attached to it. It is done by looking for the
 * exact userId (which can only exists once in a database).
 */
router.get("/profiles/:userId", (req, res, userId) => {
  // Store the userId
  userId = req.params.userId;

  // Find the user matching the userId
  db.collection("users").findOne(
    {
      _id: ObjectId(userId),
    },
    (err, result) => {
      if (err) throw err;

      // Fix the destination to uploaded images
      result.banner.path = `../uploads/${result.banner.filename}`;
      result.avatar.path = `../uploads/${result.avatar.filename}`;

      // Render the profile of the given user
      res.render("profile.njk", { result });
    }
  );
});

/**
 * This will render the profile settings page to update a current user.
 */
router.get("/profiles/:userId/update", (req, res, userId) => {
  // Store the userId
  userId = req.params.userId;

  // Render the profile settings of the given user
  res.render("profile-settings.njk"); // TODO: profile zo opzetten dat het andere data laad.
});

/**
 * This will update a profile from an existing user. It is done by looking for the
 * exact userId (which can only exists once in a database).
 */
router.post(
  "/profiles/:userId/update",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  (req, res, userId) => {
    // Store the userId
    userId = req.params.userId;

    // Update the current user
    db.collection("users").updateOne(
      { _id: ObjectID(userId) },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          games: req.body.categories,
          avatar: req.files.avatar[0],
          banner: req.files.banner[0],
        },
      }
    );

    // Automatically redirect to the updated user
    res.redirect(`/profiles/${user._id}`);
  }
);

// 404
router.use((req, res, next) => {
  res.status(404).send("404");
});

module.exports = router;
