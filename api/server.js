require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const { Llama } = require('./models/llama');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get('/llamas', (req, res) => {
    Llama.find({}).then((llamas) => {
        res.send(llamas);
    }, (err) => res.status(404).send(e))
})

app.get('/llamas/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }

    Llama.findById(id).then((llama) => {
        res.send(llama);
    }, (err) => res.status(404).send(e))
})

app.post('/llamas', (req, res) => {
    var body = _.pick(req.body, ['email', 'password', 'name', 'age', 'picture_url', 'description', 'location']);
    var llama = new Llama(body);
    
    llama.save().then(() => {
        return llama.generateAuthToken();
    })
    .then((token) => {
        res.header('x-auth', token).send(llama);
    })
    .catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/llamas/me', authenticate, (req, res) => {
    res.send(req.llama);
  });
  
app.post('/llamas/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    Llama.findByCredentials(body.email, body.password).then((llama) => {
        return llama.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(llama);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/llamas/me/token', authenticate, (req, res) => {
    req.llama.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.patch('/llamas/:id', authenticate, (req, res) => {
    const id = req.params.id;
    
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Llama.findByIdAndUpdate(id, req.body, {new: true}).then((llama) => {
        if (!llama) {
            return res.status(404).send();
        }
        res.send(llama);
    }).catch((e) => res.status(400).send())
});

app.delete('/llamas/:id', authenticate, (req, res) => {
    const id = req.params.id;
    
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Llama.findByIdAndRemove(id).then((llama) => {
        if (!llama) {
            return res.status(404).send();
        }
        res.send(llama);
    }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = {app};