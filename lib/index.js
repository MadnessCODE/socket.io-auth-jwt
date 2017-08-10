var JWT = require('jsonwebtoken');
var SocketIOAuthJWTException = require('./exceptions');

class SocketIOAuthJWT {
    /**
     * Constructor of class
     */
    constructor(settings, callback) {
        var parent_obj = this;

        if(settings.algorithm == undefined)
            settings.algorithm = "HS2561";

        if(settings.secret == undefined)
            throw new SocketIOAuthJWTException("Secret is required");

        this.settings = settings;
        this.socket = null;
        this.callback = callback;

        return function(socket, callback){
            return parent_obj.check(socket, callback);
        }
    }

    /**
     * Check token
     *
     * @param socket
     * @param callback
     * @return {*}
     */
    check(socket, next) {
        this.socket = socket;

        if(typeof socket.handshake.query.token !== "string")
            return this.error("Invalid token");

        try {
            var payload = JWT.verify(socket.handshake.query.token, this.settings.secret, { algorithms: [this.settings.algorithm ] });
        } catch(err) {
            console.log(err);
            return this.error(err.message);
        }

        return this.success(next);
    }


    error(error) {

    }

    success(next) {
        next();

    }
}

module.exports = SocketIOAuthJWT;