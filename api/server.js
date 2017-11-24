require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const llamas = require('./routes/llamas')
const posts = require('./routes/posts')

var app = express();
const port = process.env.PORT;

const options = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "x-auth"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: false
};

app.use(cors(options));
app.options("*", cors(options));

app.use(bodyParser.json());

app.use('/llamas', llamas);
app.use('/posts', posts)

app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = { app };