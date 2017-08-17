var server = require('./server');
var io = require('socket.io-client');
var assert = require('assert');


describe('authorizer', function () {
    before(server.start);
    after(server.stop);

    describe('when user connect to server', function () {

        it('and token is missing', function (done) {
            var socket = io('http://localhost:3000', {query: "token="});

            socket.on("unauthorized", function(data) {
                assert.equal(data, 'jwt must be provided');
                done();
            });
        });

        it('and token is invalid', function(done) {
            var socket = io('http://localhost:3000', {query: "token="+555});

            socket.on("unauthorized", function(data) {
                assert.equal(data, 'jwt malformed');
                done();
            });
        });

        it('and token signature is wrong', function(done) {
            var socket = io('http://localhost:3000', {query: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"});

            socket.on("unauthorized", function(data) {
                assert.equal(data, 'invalid signature');
                done();
            });
        });

        it('and token is expired', function(done) {
            var socket = io('http://localhost:3000', {query: "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUwMjk5MTY0NCwiZXhwIjoxNTAyOTkxNjQ1fQ.41V8o-Y0ue35zPoBS72EPt1wn3LjDxp_BSMzBBCF8-U"});

            socket.on("unauthorized", function(data) {
                assert.equal(data, 'jwt expired');
                done();
            });
        });
    });
});