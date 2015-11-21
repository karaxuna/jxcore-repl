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
        commandInput.focus();
    });

    // add commmands container
    var commandsContainer = self.commandsContainer = document.createElement('div');
    commandsContainer.className = 'bash-commands';
    container.appendChild(commandsContainer);

    // add command input
    var commandInput = self.commandInput = document.createElement('input');
    commandInput.type = 'text';
    commandInput.className = 'bash-input';
    commandInput.autofocus = true;
    commandInput.spellcheck = false;
    container.appendChild(commandInput);

    // listen for command
    commandInput.addEventListener('keypress', function (e) {
        if (e.which === 13) {
            switch (this.value) {
                case '.clear':
                self.clear();
                break;
                default:
                self.trigger('stdin', this.value);
                commandsContainer.removeChild(commandsContainer.childNodes[commandsContainer.childNodes.length - 1]);
                self.write('> ' + this.value);
                break;
            }
            this.value = null;
        }
    });
}

// inherit from EventTarget
Bash.prototype.__proto__ = EventTarget.prototype;

// methods
Bash.prototype.write = function (command) {
    var self = this,
        commandInput = self.commandInput,
        commandsContainer = self.commandsContainer;

    var commandContainer = document.createElement('div');
    commandContainer.className = 'bash-command';
    commandContainer.textContent = command;
    commandsContainer.appendChild(commandContainer);
    window.scrollTo(0, document.body.scrollHeight);
};

Bash.prototype.clear = function () {
    var self = this,
        commandsContainer = self.commandsContainer,
        commandContainers = commandsContainer.childNodes;

    while (commandContainers.length > 1) {
        commandsContainer.removeChild(commandContainers[0]);
    }
};