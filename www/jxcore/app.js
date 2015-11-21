var path = require('path'),
    http = require('http'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    repl = require('repl'),
    SocketStream = require('./lib/SocketStream');

// is mobile?
var isMobile = typeof Mobile !== 'undefined';

// listen
var port = 8991;
http.listen(process.env.PORT || port);

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// on connection
io.on('connection', function (socket) {
    var stream = new SocketStream(socket);
    var server = socket.repl = repl.start({
        prompt: '>',
        input: stream,
        output: stream,
        useGlobal: true
    });

    if (isMobile) {
        Mobile('addConnection').call(socket.handshake.address);
        socket.on('disconnect', function () {
            Mobile('removeConnection').call(socket.handshake.address);
            server.close();
        });
    }
});

if (isMobile) {
    var host = getLocalIP();
    Mobile('setHost').call(host);
    Mobile('destroyConnection').registerSync(destroyConnection);
}

function destroyConnection(ip) {
    var sockets = io.sockets.sockets,
        i, socket;

    for (i = 0; i < sockets.length; i++) {
        socket = sockets[i];
        if (socket.handshake.address === ip) {
            socket.disconnect();
            break;
        }
    }
}

function getLocalIP() {
    var os = require('os');
    var net = os.networkInterfaces();
    var ips = [];

    for (var ifc in net) {
        var addrs = net[ifc];
        for (var a in addrs) {
            if (addrs[a].family == 'IPv4' && !addrs[a].internal) {
                var addr = addrs[a].address;
                if (addr.indexOf('192.168.') == 0 || addr.indexOf('10.0.') == 0) {
                    ips.push(addr);
                }
            }
        }
    }

    if (ips.length == 0) {
        if (net.hasOwnProperty('en0') || net.hasOwnProperty('en1')) {
            var addrs = net['en0'] || net['en1'];
            for (var a in addrs) {
                if (addrs[a].family == 'IPv4' && !addrs[a].internal) {
                    var addr = addrs[a].address;
                    ips.push(addr);
                }
            }
        }

        if (ips.length == 0) {
            for (var ifc in net) {
                var addrs = net[ifc];
                for (var a in addrs) {
                    if (addrs[a].family == 'IPv4' && !addrs[a].internal) {
                        var addr = addrs[a].address;
                        ips.push(addr);
                    }
                }
            }
        }
    }

    return 'http://' + ips[0] + ':' + port + '/';
}