/**
 * Custom error class
 */
module.exports = class SocketIOAuthJWTException extends Error {
    /**
     * Constructor
     *
     * @param message
     * @param status
     */
    constructor (message, status) {

        // Calling parent constructor of base Error class.
        super(message);

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);

        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;
    }
}
