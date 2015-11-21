var socket = io.connect(),
    bash = new Bash(document.getElementById('bash'));

socket.on('disconnect', function () {
    if (confirm('You have been disconnected. Try reconnecting?')) {
        window.location.reload();
    }
});

bash.on('stdin', function (command) {
    socket.emit('stdin', command);
});

socket.on('stdout', function (text) {
    bash.write(text);
});