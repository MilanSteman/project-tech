const express = require('express')
const app = express()
const port = 3000
const nunjucks = require('nunjucks');

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', (req, res) => {
  let data = {
    message: 'Hello world!',
    title: 'Home',
    authorised: true,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  }

  res.render('home.njk', data)
})

//middelware
app.use(express.static('static/public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/movies', (req, res) => {
  res.send('<h1>This will render a list of movies.</h1>')
})

app.get('/movies/:movieId/:slug', (req, res) => {
  res.send(`<h1>This will render a detail page for ${req.params.slug}`)
})

//middleware
app.use((req, res, next) => {
  res.status(404).send("<h1>Sorry, we can't find that page!</h1>")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})