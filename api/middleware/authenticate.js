var { Llama } = require('../models/llamas');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  Llama.findByToken(token).then((llama) => {
    if (!llama) {
      return Promise.reject();
    }
    req.llama = llama;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = { authenticate };
