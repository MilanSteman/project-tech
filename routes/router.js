const express = require("express");
const multer = require("multer");
const { MongoClient, ObjectID } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const router = express.Router();

// Variable for rendering the available categories
const categories = ["Games", "Sports", "Movies"];

// Variable for our current profile (no login yet)
const profile = {
  message: "Welkom terug, milan.",
  displayname: "milan",
  username: "milannn",
  title: "Home",
  picture: "images/profile-picture.jpg",
  banner: "images/michael.jpg",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  category: "Games",
};

// Set up database
let db = null;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yxc1m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) throw err;
  console.log("connected");
  db = client.db(process.env.DB_NAME);
});

// Set up multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`);
  },
});

const upload = multer({ storage: storage });

/**
 * Renders a list of current users on the homepage who match your chosen category.
 */
router.get("/", (req, res, recommendedUsers) => {
  // Find all users
  db.collection("users")
    .find({})
    .toArray((err, result) => {
      // Check for errors
      if (err) throw err;

      // Fix the destination to uploaded images for each result
      result.forEach((result) => {
        result.banner.path = `../../uploads/${result.banner.filename}`;
        result.avatar.path = `../../uploads/${result.avatar.filename}`;
      });

      // Filter for the results that match your category (from the object profile)
      recommendedUsers = result.filter((match) =>
        match.category.includes(profile.category)
      );

      // Render the homepage with the recommended users
      res.render("home.njk", { profile, recommendedUsers });
    });
});

router.get("/profile", (req, res) => {
  res.render("profile.njk", { profile });
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
      category: req.body.category,
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
      // Check for errors
      if (err) throw err;

      // Fix the destination to uploaded images
      result.banner.path = `../../uploads/${result.banner.filename}`;
      result.avatar.path = `../../uploads/${result.avatar.filename}`;

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

  // Find the user matching the userId
  db.collection("users").findOne(
    {
      _id: ObjectId(userId),
    },
    (err, result) => {
      // Check for errors
      if (err) throw err;
      console.log(result);

      // Fix the destination to uploaded images
      result.banner.path = `../../uploads/${result.banner.filename}`;
      result.avatar.path = `../../uploads/${result.avatar.filename}`;

      // Render the profile of the given user
      res.render("profile-settings.njk", { result, categories });
    }
  );
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
      // Search for the current userId
      { _id: ObjectID(userId) },

      // Replace current data stored inside the database with current user input
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          avatar: req.files.avatar[0],
          banner: req.files.banner[0],
        },
      }
    );

    // Automatically redirect to the updated user
    res.redirect(`/profiles/${userId}`);
  }
);

// 404
router.use((req, res, next) => {
  res.status(404).send("404");
});

// Export the router for use in the server
module.exports = router;
