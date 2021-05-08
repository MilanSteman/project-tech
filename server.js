/* eslint-disable prettier/prettier */
/* eslint-disable object-shorthand */

const express = require('express');
const nunjucks = require('nunjucks');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.png`);
  },
});

const upload = multer({ storage: storage });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());

const categories = ['Games', 'Sports', 'Movies'];

const profile = {
  message: 'Welkom terug, milan.',
  displayname: 'milan',
  username: 'milannn',
  title: 'Home',
  picture: 'images/profile-picture.jpg',
  banner: 'images/michael.jpg',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',

  posts: ['images/michael.jpg', 'images/michael.jpg', 'images/michael.jpg'],
};

// temporary array for users
const users = [
  {
    username: 'Simeon Yetarian',
    picture: 'images/simeon.png',
    description:
      'Go and get it. Just try to bring the car back in good condition huh?',
    games: ['GTA V', 'GTA IV'],
  },
  {
    username: 'Franklin Clinton',
    picture: 'images/franklin.jpg',
    description:
      'A what? A credit fraud? Be serious dude.... I just work the repo man.',
    games: ['GTA V', 'GTA San Andreas'],
  },
  {
    username: 'Michael Townley',
    picture: 'images/michael.jpg',
    description:
      'You forget a thousand things everyday, pal. Make sure this is one of them.',
    games: ['GTA V', 'GTA San Andreas'],
  },
];

// temporary array for users
const onlineUsers = [
  {
    username: 'Franklin Clinton',
    picture: 'images/franklin.jpg',
    online: true,
  },
  {
    username: 'Michael Townley',
    picture: 'images/michael.jpg',
    online: false,
  },
  {
    username: 'Simeon Yetarian',
    picture: 'images/simeon.png',
    online: true,
  },
];

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.get('/', (req, res) => {
  res.render('home.njk', { profile, users, onlineUsers });
});

app.get('/profile', (req, res) => {
  res.render('profile.njk', { profile, users, onlineUsers });
});

app.get('/profile-settings', (req, res) => {
  res.render('profile-settings.njk', { profile, categories });
});

app.post(
  '/profile-settings',
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
  ]),
  (req, res) => {
    const user = {
      username: req.body.displayname,
      picture: `uploads/${req.files.avatar[0].filename}`,
      description: req.body.description,
      games: req.body.categories,
    };
    users.push(user);
    res.render('home.njk', { profile, categories, users, onlineUsers });
  }
);

// middelware
app.use(express.static('static/public'));

// middleware
app.use((req, res, next) => {
  res.status(404).render('home.njk', { profile, users, onlineUsers });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
