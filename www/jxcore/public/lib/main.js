(function check() {
    if (typeof jxcore === 'undefined') {
        setTimeout(check, 5);
    } else if (jxcore === 'none' || cordova === 'none') {
        init(location.protocol + '//' + location.host + '/');
    } else {
        jxcore.isReady(function () {
            Mobile('alert').register(alert);
            jxcore('app.js').loadMainFile(function(result, err) {
                if (err) {
                    alert(err);
                } else {
                    Mobile('getLocalIP').call(function (host) {
                        init(host);
                    });
                }
            });
        });
    }
})();

function init(host) {
    var s = document.createElement('script');
    s.async = false;
    s.src = host + 'socket.io/socket.io.js';
    document.body.appendChild(s);

    (function _check() {
        if (window.io) {
            start(host);
        } else {
            setTimeout(_check, 5);
        }
    })();
}

var socket,
    bash = new Bash(document.getElementById('bash'));

bash.on('stdin', function (command) {
    if (socket) {
        socket.emit('stdin', command);
    } else {
        alert('Wait for socket initialization.');
    }
});

function start(host) {
    socket = io.connect(host);
    bash.write('> host: ' + host);
    bash.write('>');

    socket.on('stdout', function (text) {
        bash.write(text);
    });

    socket.on('stdin', function (command) {
        bash.prepare();
        bash.write('> ' + command);
    });

    socket.on('disconnect', function () {
        if (confirm('You have been disconnected. Try reconnecting?')) {
            window.location.reload();
        }
    });
}