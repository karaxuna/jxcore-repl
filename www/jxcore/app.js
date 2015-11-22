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

// serve empty jxcore and cordova
['jxcore', 'cordova'].forEach(function (name) {
    app.get('/' + name + '.js', function (req, res) {
        res.send('window.' + name + '="none";');
    });
});

// start repl
var stream = new SocketStream(io);
var server = repl.start({
    prompt: '>',
    input: stream,
    output: stream,
    useGlobal: true
});

// on connection
io.on('connection', function (socket) {
    stream.addSocket(socket);
});

if (isMobile) {
    try {
        Mobile('getLocalIP').registerSync(getLocalIP);
    }
    catch(ex) {
        Mobile('alert').call(ex.message ? ex.message : ex);
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