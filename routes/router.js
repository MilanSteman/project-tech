const express = require("express");
const multer = require("multer");
const { MongoClient, ObjectID, connect } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const router = express.Router();

// Variable for rendering the available categories
const categories = ["Games", "Sports", "Movies"];

// Variable for getting my user from the database
const myId = "60af660257a900035aa3455a";

// Set up database
let db = null;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connectToDB() {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
    } finally {
      console.log('Connected to database')
    }
}

connectToDB();

// Set up multer
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "static/public/uploads");
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.jpg`);
    },
});

const upload = multer({ storage });

/**
 * Renders a list of current users on the homepage who match your chosen category
 */
router.get("/", async (req, res) => {
    await db.collection("users").findOne(
        {
            _id: ObjectId(myId),
        },
        (err, myUser) => {
            if (err) throw err;
             db
            .collection("users")
            .find({
                _id: { $ne: ObjectId(myId) },
                category: { $eq: myUser.category },
            })
            .toArray((err, result) => {
                if (err) throw err;
    
                // Fix the destination to uploaded images for each result
                result.forEach((result) => {
                    result.banner = `../../uploads/${result.banner}`;
                    result.avatar = `../../uploads/${result.avatar}`;
                });
    
                res.render("home.njk", { result, myUser });
            });
    
        }
    );
});

/**
 * Renders the current user profile page
 */
router.get("/profile", (req, res) => {
    res.redirect(`/profiles/${myId}`);
});

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
    async (req, res) => {
        // Create an user to insert the necessary data into the database
        const user = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            avatar: req.files.avatar[0].filename,
            banner: req.files.banner[0].filename,
        };

        // Insert the variable above into the collection 'users' within the database.
        await db.collection("users").insertOne(user);

        // Automatically redirect to the created user
        res.redirect(`/profiles/${user._id}`);
    }
);

/**
 * This will render a profile from an existing user with its data attached to it. It is done by looking for the
 * exact userId (which can only exists once in a database).
 */
router.get("/profiles/:userId", async (req, res) => {
    // Store the userId
    const userId = req.params.userId;

    // Find the user matching the userId
    await db.collection("users").findOne(
        {
            _id: ObjectId(userId),
        },
        (err, result) => {
            if (err) throw err;

            // Fix the destination to uploaded images
            result.banner = `../../uploads/${result.banner}`;
            result.avatar = `../../uploads/${result.avatar}`;

            res.render("profile.njk", { result });
        }
    );
});

/**
 * This will render the profile settings page to update a current user.
 */
router.get("/profiles/:userId/update", async (req, res) => {
    // Store the userId
    const userId = req.params.userId;

    // Find the user matching the userId
    await db.collection("users").findOne(
        {
            _id: ObjectId(userId),
        },
        (err, result) => {
            if (err) throw err;

            // Fix the destination to uploaded images
            result.banner = `../../uploads/${result.banner}`;
            result.avatar = `../../uploads/${result.avatar}`;

            // Render the profile of the given user
            res.render("profile-settings.njk", {
                result,
                categories,
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
    async (req, res) => {
        const userId = req.params.userId;

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
                    avatar: req.files.avatar[0].filename,
                    banner: req.files.banner[0].filename,
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
