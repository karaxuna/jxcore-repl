## Nodejs repl server running on phone

JXcore app that allows to run nodejs code remotely from browser to phone.

### Build
Supposing you have already installed [JXcore](http://jxcore.com/downloads/), cordova and gulp, now install local npm modules:

```bash
jx install
```

Then build the project:

```bash
gulp build
```

This includes creating cordova app, downloading and adding io.jxcore.cordova plugin, adding platforms, installing npm modules for `www/jxcore` and moving www files to `cordova/www`.

### Run on android

```bash
gulp run
```