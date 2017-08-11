var JWT = require('jsonwebtoken');
var SocketIOAuthJWTException = require('./exceptions');

class SocketIOAuthJWT {
    /**
     * Constructor of class
     */
    constructor(settings, callback) {
        var parent_obj = this;

        if(settings.algorithm == undefined)
            settings.algorithm = "HS256";

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
            return this.error(next, err.message);
        }

        this.socket.handshake.user = payload;
        return this.success(next, payload);
    }

    /**
     * Error
     *
     * @param next
     * @param error
     *
     * @return void
     */
    error(next, error) {
        this.callback(error, null);
        next();
    }

    /**
     * Success
     *
     * @param next
     * @param payload
     *
     * @return void
     */
    success(next, payload) {
        this.callback(null, payload);
        next();
    }
}

module.exports = SocketIOAuthJWT;