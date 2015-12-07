var gulp = require('gulp'),
    shell = require('gulp-shell'),
    download = require('gulp-download'),
    fs = require('fs');

gulp.task('download-jxcore-cordova', function (callback) {
    if (fs.existsSync('./io.jxcore.node')) {
        callback();
    } else {
        var url = 'https://github.com/jxcore/jxcore-cordova-release/raw/master/0.0.4/io.jxcore.node.jx';
        return download(url).pipe(gulp.dest('.'));
    }
});

gulp.task('unpack-jxcore-cordova', ['download-jxcore-cordova'], function (callback) {
    if (fs.existsSync('./io.jxcore.node.jx')) {
        return gulp.src('').pipe(shell('jx io.jxcore.node.jx'));
    } else {
        callback();
    }
});

gulp.task('add-jxcore-cordova-plugin', ['unpack-jxcore-cordova'], function (callback) {
    if (fs.existsSync('./plugins/io.jxcore.node')) {
        callback();
    } else {
        require('child_process').exec('cordova plugins add ./io.jxcore.node/', callback);
    }
});

gulp.task('install-server-packages', function () {
    return gulp.src('').pipe(shell('jx install', {
        cwd: 'www/jxcore'
    }));
});

gulp.task('add-platforms', ['add-jxcore-cordova-plugin'], function (callback) {
    if (fs.existsSync('./platforms/android')) {
        callback();
    } else {
        return gulp.src('').pipe(shell('cordova platforms add android'));
    }
});

gulp.task('build', ['add-platforms', 'install-server-packages'], function () {

});

gulp.task('run-android', ['build'], function () {
    return gulp.src('').pipe(shell('cordova run android'));
});

// release config (does not work with gulp, just to remember)
gulp.task('generate-keystore', function () {
    return gulp.src('').pipe(shell('keytool -genkey -v -keystore build.keystore -alias jxcore-repl -keyalg RSA -keysize 2048 -validity 10000'));
});

gulp.task('build-release', ['build'], function () {
    return gulp.src('').pipe(shell('"platforms/android/cordova/build" --release --buildConfig build.json'));
});