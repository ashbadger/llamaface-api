const express = require('express');
const bodyParser = require('body-parser');
require('./config/config')

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const { Llama } = require('./models/llama');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


app.get('/llamas', (req, res) => {
    Llama.find({}).then((llamas) => {
        res.send({llamas});
    }, (err) => res.status(404).send(e))
})

app.get('/llamas/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }

    Llama.findById(id).then((llama) => {
        res.send({llama});
    }, (err) => res.status(404).send(e))
})

app.post('/llamas', (req, res) => {
    var llama = new Llama({
        name: req.body.name, 
        age: req.body.age
    });

    llama.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/llamas/:id', (req, res) => {
    const id = req.params.id;
    
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Llama.findByIdAndRemove(id).then((llama) => {
        if (!llama) {
            return res.status(404).send();
        }
        res.send({llama});
    }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = {app};