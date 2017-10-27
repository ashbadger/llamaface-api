const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let LlamaSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String, 
        required: false
    }, 
    age: {
        type: Number,
        required: false
    }, 
    picture_url: {
        type: String,
        required: false
    },
    description: {
        type: String, 
        required: false
    },
    location: {
        type: String,
        required: false
    }, 
    tokens: [{
        access: {
            type: String,
            required: true
        }, 
        token: {
            type: String,
            required: true
        }
    }]
});

LlamaSchema.methods.toJSON = function () {
    var llama = this;
    var llamaObject = llama.toObject();

    return _.pick(llamaObject, ['_id', 'email']);
};

LlamaSchema.methods.generateAuthToken = function () {
    var llama = this;
    var access = 'auth';

    var token = jwt.sign({_id: llama._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    llama.tokens.push({access, token})

    return llama.save().then(() => {
        return token;
    })
};

LlamaSchema.methods.removeToken = function (token) {
    var llama = this;
  
    return llama.update({
      $pull: {
        tokens: {token}
      }
    });
  };

LlamaSchema.statics.findByToken = function (token) {
    var Llama = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) { 
        Promise.reject() 
    }

    return Llama.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

LlamaSchema.statics.findByCredentials = function (email, password) {
    var Llama = this;
  
    return Llama.findOne({email}).then((llama) => {
      if (!llama) {
        return Promise.reject();
      }
  
      return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare password and user.password
        bcrypt.compare(password, llama.password, (err, res) => {
          if (res) {
            resolve(llama);
          } else {
            console.log(`Password isn't correct.`)
            reject();
          }
        });
      });
    });
  };

LlamaSchema.pre('save', function (next) {
    var llama = this;

    if(llama.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(llama.password, salt, (err, hash) => {
                llama.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

LlamaSchema.index({ "email" : 1}, { unique : true })

let Llama = mongoose.model('Llama', LlamaSchema);

module.exports = { Llama }
