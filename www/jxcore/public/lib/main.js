(function check() {
    if (typeof jxcore === 'undefined') {
        setTimeout(check, 5);
    } else if (jxcore === 'none' || cordova === 'none') {
        var host = location.protocol + '//' + location.host;
        connect(host, function () {
            start(host);
        });
    } else {
        jxcore.isReady(function () {
            jxcore('alert').register(alert);
            jxcore('app.js').loadMainFile(function(result, err) {
                if (err) {
                    alert(err);
                } else {
                    jxcore('getServerInfo').call(function (server) {
                        connect(server.protocol + '//127.0.0.1:' + server.port, function () {
                            start(server.ip ? (server.protocol + '//' + server.ip + ':' + server.port) : null);
                        });
                    });
                }
            });
        });
    }
})();

var socket,
    bash = new Bash(document.getElementById('bash'));

bash.on('stdin', function (command) {
    if (socket) {
        socket.emit('stdin', command);
    } else {
        alert('Wait for socket initialization.');
    }
});

function connect(host, callback) {
    var s = document.createElement('script');
    s.async = false;
    s.src = host + '/socket.io/socket.io.js';
    document.body.appendChild(s);

    (function _check() {
        if (window.io) {
            socket = io.connect(host);
            callback();
        } else {
            setTimeout(_check, 5);
        }
    })();
}

function start(host) {
    if (host) {
        bash.write('Connected! host: ' + host + '\n');
    } else {
        bash.write('Enable wifi or mobile internet to connect from browser\n');
    }

    bash.write('> ');

    socket.on('stdout', function (text) {
        bash.write(text);
    });

    socket.on('stdin', function (command) {
        bash.write(command + '\n');
    });

    socket.on('disconnect', function () {
        if (confirm('You have been disconnected. Try reconnecting?')) {
            window.location.reload();
        }
    });
}