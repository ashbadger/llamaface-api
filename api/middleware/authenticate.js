var {Llama} = require('./../models/llama');

var authenticate = (req, res, next) => {
  console.log(req)
  console.log(res)
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

module.exports = {authenticate};
