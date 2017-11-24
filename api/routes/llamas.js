'use strict';

const { mongoose } = require('../db/mongoose');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var express = require('express')
var llamas = express.Router();

const { Llama } = require('../models/llamas');
const { authenticate } = require('../middleware/authenticate');


llamas.route('/')
    .get((req, res) => {
        Llama.find({}).then((llamas) => {
            res.send(llamas);
        }, (err) => res.status(404).send(err))
    })
    .post((req, res) => {
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

llamas.route('/search')
    .get((req, res) => {
        
        var q = req.query.q
        
        Llama
            .find({ $text : { $search: q } },
                { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .then((llama) => {
                res.send(llama);
            }, (err) => res.status(404).send(err))    
    });

llamas.route('/me')
    .get(authenticate, (req, res) => {
        res.send(req.llama).catch((err) => {
            res.status(400).send(err);
        });
    });

llamas.route('/login')
    .post((req, res) => {
        var body = _.pick(req.body, ['email', 'password']);

        Llama.findByCredentials(body.email, body.password).then((llama) => {
            return llama.generateAuthToken().then((token) => {
                res.header('x-auth', token).send({ token });
            });
        }).catch((err) => {
            res.status(400).send(err);
        });
    });

llamas.route('/me/token')
    .delete(authenticate, (req, res) => {
        req.llama.removeToken(req.token).then(() => {
            res.status(200).send(req.token);
        }, (err) => {
            res.status(400).send(err);
        });
    });

llamas.route('/:id')
    .get((req, res) => {
        var id = req.params.id;

        if(!ObjectID.isValid(id)){
            return res.status(404).send()
        }

        Llama.findById(id).then((llama) => {
            res.send(llama);
        }, (err) => res.status(404).send(err))
    })
    .patch(authenticate, (req, res) => {
        const id = req.params.id;
        
        if(!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        Llama.findByIdAndUpdate(id, req.body, {new: true}).then((llama) => {
            if (!llama) {
                return res.status(404).send();
            }
            res.send(llama);
        }).catch((err) => res.status(400).send(err))
    })
    .delete(authenticate, (req, res) => {
        const id = req.params.id;
        
        if(!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        Llama.findByIdAndRemove(id).then((llama) => {
            if (!llama) {
                return res.status(404).send();
            }
            res.send(llama);
        }).catch((err) => res.status(400).send(err));
    });

module.exports = llamas;