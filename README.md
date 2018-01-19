![logo](https://github.com/ashbadger/llamaface-ng2/blob/master/src/assets/images/logo.png?raw=true)

[![Build Status](https://travis-ci.org/ashbadger/llamaface-api.svg?branch=master)](https://travis-ci.org/ashbadger/llamaface-api)

llamaFace is f*cebook for llamas.

this is a full stack project. front end (angular 2) project can be found here: [llamaface-ng2](https://github.com/ashbadger/llamaface-ng2)

__routes__: 

|route|method|
|-----|-------|
|/llamas|/GET, /POST|
|/llamas/:id|/GET, /PATCH, /DELETE|
|/llamas/search|/GET|
|/llamas/me| /GET |
|/llamas/me/token| /DELETE|
|/llamas/login| /POST|
|/posts| /GET, /POST|
|/posts/:id| /GET, /PATCH, /DELETE|
|/posts/user/:id| /GET, /DELETE|


**technologies**: node, express, mongoose, bcrypt, jwt, mocha, heroku, travis ci.

llamaFace api deployed on [heroku](https://llamaface-api.herokuapp.com/llamas)

llamaFace front end deployed on [s3](http://llamaface-ng2.s3-website-us-east-1.amazonaws.com/posts)

(heroku dyno takes 10 seconds or so to boot up. reload the page then.)