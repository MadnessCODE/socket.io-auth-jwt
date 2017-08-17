var JWT = require('jsonwebtoken');

class SocketIOAuthJWT {
    /**
     * Constructor of class
     */
    constructor(settings) {
        var parent_obj = this;

        if(settings.algorithm == undefined)
            settings.algorithm = "HS256";

        this.settings = settings;
        this.socket = null;
        this.error_event_name = settings.error_event ? settings.error_event : 'unauthorized';
        this.error_details = settings.error_details ? settings.error_details : false;

        return function(socket, callback){
            if(parent_obj.settings.secret == undefined)
                return parent_obj.error(callback, "Secret is required");

            return parent_obj.check(socket, callback);
        }
    }

    /**
     * Check token
     *
     * @param socket
     * @param next
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
        return this.success(next);
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
        let err = null;
        if(this.error_details)
            err = error;
        else
            err = "access forbidden";
        this.socket.emit(this.error_event_name, err);
        next();
    }

    /**
     * Success
     *
     * @param next
     *
     * @return void
     */
    success(next) {
        next();
    }
}

module.exports = SocketIOAuthJWT;