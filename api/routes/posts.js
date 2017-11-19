const { mongoose } = require('../db/mongoose');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var express = require('express')
var posts = express.Router();

const { Post } = require('../models/posts');
const { authenticate } = require('../middleware/authenticate');

posts.route('/')
    .get((req, res) =>  {
        Post.find({}).then((posts) => {
            res.send(posts);
        }, (err) => res.status(404).send(err))
    })
    .post((req, res) => {
        var body = _.pick(req.body, ['text', 'user_id']);
        var post = new Post(body);
        
        post.save().then((post) => {
            if (!post) {
                return res.status(404).send();
            }
            res.send(post);
        }).catch((err) => res.status(400).send(err));
    });

posts.route('/user/:id')
    .get((req, res) => {
        var id = req.params.id;
        
        if(!ObjectID.isValid(id)){
            return res.status(404).send()
        }

        Post.find({user_id: id}).then((post) => {
            res.send(post);
        }, (err) => res.status(404).send(err))
    })

posts.route('/:id')
    .get((req, res) => {
        var id = req.params.id;
        
        if(!ObjectID.isValid(id)){
            return res.status(404).send()
        }

        Post.findById(id).then((post) => {
            res.send(post);
        }, (err) => res.status(404).send(err))
    })
    .patch((req, res) => {
        const id = req.params.id;
        
        if(!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        Post.findByIdAndUpdate(id, req.body, {new: true}).then((post) => {
            if (!post) {
                return res.status(404).send();
            }
            res.send(post);
        }).catch((err) => res.status(400).send(err))
    })
    .delete((req, res) => {
        const id = req.params.id;
        
        if(!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        Post.findByIdAndRemove(id).then((post) => {
            if (!post) {
                return res.status(404).send();
            }
            res.send(post);
        }).catch((err) => res.status(400).send(err));
    })

module.exports = posts