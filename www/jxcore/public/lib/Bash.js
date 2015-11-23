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

    // add command input
    var cmdInputContainer = self.cmdInputContainer = document.createElement('div');
    cmdInputContainer.className = 'bash-input';
    container.appendChild(cmdInputContainer);
    var cmdInput = self.cmdInput = document.createElement('input');
    cmdInput.type = 'text';
    cmdInput.placeholder = 'Type here...';
    cmdInput.spellcheck = false;
    cmdInputContainer.appendChild(cmdInput);

    // listen for command
    cmdInput.addEventListener('keypress', function (e) {
        if (e.which === 13) {
            self.trigger('stdin', this.value);
            this.value = null;
        }
    });
}

// inherit from EventTarget
Bash.prototype.__proto__ = EventTarget.prototype;

// methods
Bash.prototype.write = function (command) {
    var self = this,
        container = self.container,
        cmdInputContainer = self.cmdInputContainer;

    var cmdText = createSpan(command);
    container.insertBefore(cmdText, cmdInputContainer);
    window.scrollTo(0, document.body.scrollHeight);
};

function createSpan(text) {
    var span = document.createElement('span');
    text = escapeHtml(text);
    text = replaceAll(text, ' ', '&nbsp;');
    text = replaceAll(text, '\n', '<br/>');
    span.innerHTML = text;
    return span;
}

function escapeHtml(html) {
    var text = document.createTextNode(html);
    var div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

function replaceAll(text, a, b) {
    while (text.indexOf(a) !== -1) {
        text = text.replace(a, b);
    }
    return text;
}