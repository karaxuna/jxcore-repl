function EventTarget() {
    var self = this;
    self._listeners = {};
};

EventTarget.prototype.on = function (type, listener) {
    if (typeof this._listeners[type] == "undefined") {
        this._listeners[type] = [];
    }

    this._listeners[type].push(listener);
};

EventTarget.prototype.trigger = function (type, data) {
    if (this._listeners[type] instanceof Array) {
        var listeners = this._listeners[type];
        for (var i = 0, len = listeners.length; i < len; i++) {
            if (data instanceof Array) {
                listeners[i].apply(this, data);
            } else {
                listeners[i].call(this, data);
            }
        }
    }
};

EventTarget.prototype.removeListener = function (type, listener) {
    if (this._listeners[type] instanceof Array) {
        var listeners = this._listeners[type];
        for (var i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                break;
            }
        }
    }
};

function Bash(container) {
    var self = this;
    self.container = container;
    EventTarget.call(self);

    // add class
    container.className = 'bash';

    // focus input on click anywhere
    container.addEventListener('click', function () {
        cmdInput.focus();
    });

    // add command input
    var cmdInput = self.cmdInput = document.createElement('input');
    cmdInput.type = 'text';
    cmdInput.className = 'bash-input';
    cmdInput.autofocus = true;
    cmdInput.spellcheck = false;
    container.appendChild(cmdInput);

    // listen for command
    cmdInput.addEventListener('keypress', function (e) {
        if (e.which === 13) {
            var cmd = self.cmds[this.value];
            if (cmd) {
                cmd.call(self);
            } else {
                self.trigger('stdin', this.value);
            }
            this.value = null;
        }
    });

    // define commands
    self.cmds = {
        cls: self.clear
    };
}

// inherit from EventTarget
Bash.prototype.__proto__ = EventTarget.prototype;

// methods
Bash.prototype.write = function (command) {
    var self = this,
        container = self.container,
        cmdInput = self.cmdInput,
        NEW_LINE = '\n',
        cmdText;

    if (command.indexOf(NEW_LINE) !== -1) {
        var i = 0, j;
        while (true) {
            j = command.indexOf(NEW_LINE, i);
            if (j === -1) {
                break;
            }

            cmdText = document.createTextNode(command.substring(i, j));
            container.insertBefore(cmdText, cmdInput);
            container.insertBefore(document.createElement('br'), cmdInput);
            i = j + 1;
        }

        cmdText = document.createTextNode(command.substring(i, command.length - 1));
        container.insertBefore(cmdText, cmdInput);
    } else {
        cmdText = document.createTextNode(command);
        container.insertBefore(cmdText, cmdInput);
    }

    window.scrollTo(0, document.body.scrollHeight);
};

Bash.prototype.clear = function () {
    //var self = this,
    //    cmdsContainer = self.cmdsContainer,
    //    commandContainers = cmdsContainer.childNodes;
//
    //while (commandContainers.length > 2) {
    //    cmdsContainer.removeChild(commandContainers[0]);
    //}
};