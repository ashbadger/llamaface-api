var mongoose = require('mongoose');
var config = require('../config/config.js')

mongoose.Promise = global.Promise;

console.log(process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
});

module.exports = {mongoose};