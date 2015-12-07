## Nodejs repl server

Play with nodejs code on mobile. You can also connect to phone's repl server from browser, navigating to `host` displayed on app.

![Android](https://raw.githubusercontent.com/karaxuna/jxcore-repl/master/screens/android.png "Android")
![Browser](https://raw.githubusercontent.com/karaxuna/jxcore-repl/master/screens/browser.png "Browser")

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
gulp run-android
```
