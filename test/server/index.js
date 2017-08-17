var io = require('socket.io')();
var authJWT = require('../../../socket.io-auth-jwt');

exports.start = function() {

    io.use(new authJWT({
        secret: 'wrong',
        error_details: true
    }));

    io.listen(3000);
}

exports.stop = function() {
    io.close();
}
