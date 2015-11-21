(function check() {
    if (typeof jxcore === 'undefined') {
        setTimeout(check, 5);
    } else {
        jxcore.isReady(function () {
            registerFunctions();
            jxcore('app.js').loadMainFile(function(result, err) {
                if (err) {
                    alert(err);
                }
            });
        });
    }
})();

function registerFunctions() {
    jxcore('alert').register(alert);
    jxcore('setHost').register(setHost);
    jxcore('addConnection').register(addConnection);
    jxcore('removeConnection').register(removeConnection);
}

function setHost(host) {
    var hostElement = document.getElementById('host');
    hostElement.textContent = host;
}

function addConnection(ip) {
    var table = document.getElementById('connections');
    var tr = document.createElement('tr');
    table.appendChild(tr);
    var tdIp = document.createElement('td');
    tdIp.className = 'connection';
    tdIp.textContent = ip;
    tr.appendChild(tdIp);
    var tdBtns = document.createElement('td');
    var btnRemove = document.createElement('a');
    btnRemove.addEventListener('click', function () {
        jxcore('destroyConnection').call(ip);
    });
    btnRemove.textContent = 'remove';
    btnRemove.style.float = 'right';
    tdBtns.appendChild(btnRemove);
    tr.appendChild(tdBtns);
    table.appendChild(tr);
}

function removeConnection(ip) {
    var connections = document.getElementsByClassName('connection');
    var i, conn;
    for (i = 0; i < connections.length; i++) {
        conn = connections[i];
        if (conn.textContent === ip) {
            conn.parentNode.parentNode.removeChild(conn.parentNode);
            break;
        }
    }
}