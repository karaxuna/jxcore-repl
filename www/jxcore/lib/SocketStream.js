var Stream = require('stream');

// constructor
function SocketStream(io, options) {
    var self = this;
    Stream.call(this, options);
    self.io = io;

    // listen socket info
    io.sockets.sockets.forEach(function (socket) {
        self.addSocket(socket);
    });
};

// inherit
SocketStream.prototype.__proto__ = Stream.prototype;

// methods
SocketStream.prototype.addSocket = function (socket) {
    var self = this;
    socket.on('stdin', function (data) {
        self.io.emit('stdin', data);
        self.emit('data', data + '\n');
    });
};

SocketStream.prototype.resume = function () {
    var self = this;
};

SocketStream.prototype.pause = function () {
    var self = this;
};

SocketStream.prototype.write = function (cmd) {
    var self = this;
    self.io.emit('stdout', cmd);
};

// export
module.exports = SocketStream;