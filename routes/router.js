const express = require("express");
const multer = require("multer");
const { MongoClient, ObjectID } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const router = express.Router();

// Variable for rendering the available categories
const categories = ["Games", "Sports", "Movies"];

// Variable for our current profile (no login yet)
let profile = {
  _id: "01",
  name: "milan",
  description:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  category: "Games",
  avatar: "images/default.jpg",
  banner: "images/default.jpg",
};

// Variable to check (for now) if a profile is a different profile from yours or not
let differentProfile = null;

// Set up database
let db = null;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yxc1m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
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

/**
 * Renders the current user profile page.
 */
router.get("/profile", (req, res) => {
  // Set different profile to false
  differentProfile = false;
  res.render("profile.njk", { profile, differentProfile });
});

/**
 * Renders the settings page for the current user profile.
 */
router.get("/profile-settings", (req, res, user) => {
  // Set different profile to false
  differentProfile = false;
  res.render("profile-settings.njk", { profile, categories });
});

/**
 * This will update the current user profile. It will make a new user and assign that to the profile variable.
 */
router.post(
  "/profile-settings",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  (req, res, user) => {
    // Create user
    user = {
      _id: "01",
      name: req.body.name,
      avatar: `uploads/${req.files.avatar[0].filename}`,
      banner: `uploads/${req.files.banner[0].filename}`,
      description: req.body.description,
      category: req.body.category,
    };

    // Asign user to the profile variable
    profile = user;

    // Redirect back to user page
    res.redirect("/profile");
  }
);

/**
 * Renders the page for adding a new user.
 */
router.get("/add-user", (req, res) => {
  res.render("add-user.njk", { categories });
});

/**
 * This creates a new user from data provided by the user on the profile add page.
 * It will insert data into the collection 'users' and redirect the user to the created page with a slug of the user ID.
 */
router.post(
  "/add-user",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  (req, res, user) => {
    // Create an user to insert the necessary data into the database
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

      // Set different profile to true
      differentProfile = true;

      // Render the profile of the given user
      res.render("profile.njk", { result, differentProfile });
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

      // Fix the destination to uploaded images
      result.banner.path = `../../uploads/${result.banner.filename}`; 
      result.avatar.path = `../../uploads/${result.avatar.filename}`;

      differentProfile = true;

      // Render the profile of the given user
      res.render("profile-settings.njk", {
        result,
        categories,
        differentProfile,
      });
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

      // Replace current data stored inside the database with user input
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
