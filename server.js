const express = require("express");
const nunjucks = require("nunjucks");
const router = require("./routes/router.js");

const app = express();
const port = process.env.PORT || 3000;

// Static files
app.use(express.static("static/public"));

app.use(express.json());
app.use(express.urlencoded());
app.use("/", router);

nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
