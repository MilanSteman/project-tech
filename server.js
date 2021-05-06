/* eslint-disable prettier/prettier */
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
const port = 3000;

const data = {
  message: 'Welkom terug, milan.',
  displayname: 'milan',
  username: 'milannn',
  title: 'Home',
  picture: 'images/profile-picture.jpg',
  banner: 'images/michael.jpg',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dui eros, porta ut urna in, lacinia consectetur nisl.',

  posts: ['images/michael.jpg', 'images/michael.jpg', 'images/michael.jpg'],
};

// temporary array for users
const users = [
  {
    username: 'Simeon Yetarian',
    picture: 'images/simeon.png',
    description: 'Go and get it. Just try to bring the car back in good condition huh?',
    games: ['GTA V', 'GTA IV'],
  },
  {
    username: 'Franklin Clinton',
    picture: 'images/franklin.jpg',
    description: 'A what? A credit fraud? Be serious dude.... I just work the repo man.',
    games: ['GTA V', 'GTA San Andreas'],
  },
  {
    username: 'Michael Townley',
    picture: 'images/michael.jpg',
    description: 'You forget a thousand things everyday, pal. Make sure this is one of them.',
    games: ['GTA V', 'GTA San Andreas'],
  },
];

// temporary array for users
const onlineUsers = [
  {
    username: 'Franklin Clinton',
    picture: 'images/franklin.jpg',
    online: true
  },
  {
    username: 'Michael Townley',
    picture: 'images/michael.jpg',
    online: false
  },
  {
    username: 'Simeon Yetarian',
    picture: 'images/simeon.png',
    online: true
  },
];

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.get('/', (req, res) => {
  res.render('home.njk', { data, users, onlineUsers });
});

app.get('/profile', (req, res) => {
  res.render('profile.njk', { data, users, onlineUsers });
});

app.get('/settings/profile', (req, res) => {
  res.render('profile-settings.njk', { data });
});

// middelware
app.use(express.static('static/public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/movies', (req, res) => {
  res.send('<h1>This will render a list of movies.</h1>');
});

app.get('/movies/:movieId/:slug', (req, res) => {
  res.send(`<h1>This will render a detail page for ${req.params.slug}`);
});

// middleware
app.use((req, res, next) => {
  const data2 = {
    message: 'Error 404',
    title: 'Error 404',
    authorised: true,
    description: 'We could not find that page!',
  };

  res.status(404).render('home.njk', data2);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});