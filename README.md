## Socket.io Auth JWT
[![Build Status](https://travis-ci.org/MadnessCODE/socket.io-auth-jwt.svg?branch=master)](https://travis-ci.org/MadnessCODE/socket.io-auth-jwt)

Socket.IO authentication middleware using JSON Web Token

## Installation

The Socket.io Auth JWT can be installed with [NPM](https://nodejs.org/en/). Run this command:
```sh
npm i socket.io-auth-jwt
```

## Using
_Server side:_
```javascript
io.use(new authJWT({
    secret: 'your secret key',
    error_details: true,
    error_event: "unauthorized_error"
})).on("connection", (socket) => {
    if(this.socket.handshake.user == undefined){
        //Redirect user to login page
        this.socket.disconnect(true);
    }
        
    console.log(this.socket.handshake.user);
});

```
> **Note:** Only secret parametar is required. By default error_details: `false` and error_event is '`unauthorized`'

_Client side:_
```javascript
var your_jwt_token = "xxxxx.xxxx.xxxx";
var socket = io('http://localhost:3000', {query: "token="+your_jwt_token});

socket.on('unauthorized_error', function (err) {
    console.log(err);
});
```

## License
Please see the [license file](https://github.com/MadnessCODE/socket.io-auth-jwt/blob/master/LICENSE) for more information.
