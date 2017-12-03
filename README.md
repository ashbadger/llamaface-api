![logo](https://github.com/ashbadger/llamaface-ng2/blob/master/src/assets/images/logo.png?raw=true)

llamaFace is f*cebook for llamas.

this is a full stack project. frontend (angular 2) can be found here: [llamaface-ng2](https://github.com/ashbadger/llamaface-ng2)

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


**technologies**: node, express, mongoose, bcrypt, jwt, mocha, heroku.

view llamaFace on [heroku](https://llamaface-ng2.herokuapp.com/posts)

(heroku dyno takes 10 seconds or so to boot up. reload the page then.)