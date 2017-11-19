require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const llamas = require('./routes/llamas')
const posts = require('./routes/posts')

var app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.use('/llamas', llamas);
app.use('/posts', posts)

app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = { app };