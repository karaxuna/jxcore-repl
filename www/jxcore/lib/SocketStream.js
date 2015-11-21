var Stream = require('stream');

// constructor
function SocketStream(socket, options) {
    var self = this;
    Stream.call(this, options);
    self.socket = socket;

    // listen socket info
    socket.on('stdin', function (data) {
        self.emit('data', data + '\n');
    });
};

// inherit
SocketStream.prototype.__proto__ = Stream.prototype;

// methods
SocketStream.prototype.resume = function () {
    var self = this;
};

SocketStream.prototype.pause = function () {
    var self = this;
};

SocketStream.prototype.write = function (data) {
    var self = this;
    self.socket.emit('stdout', data);
};

// export
module.exports = SocketStream;