var gulp = require('gulp'),
    shell = require('gulp-shell'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch'),
    path = require('path'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    useref = require('gulp-useref'),
    download = require('gulp-download'),
    clean = require('gulp-clean'),
    fs = require('fs');

gulp.task('cordova-create', function (callback) {
    if (fs.existsSync('cordova')) {
        callback();
    } else {
        return gulp.src('').pipe(shell('cordova create cordova com.nubisa.repl JXcoreREPL'));
    }
});

gulp.task('download-jxcore-cordova', ['cordova-create'], function (callback) {
    if (fs.existsSync('cordova/io.jxcore.node')) {
        callback();
    } else {
        var url = 'https://github.com/jxcore/jxcore-cordova-release/raw/master/0.0.4/io.jxcore.node.jx';
        return download(url).pipe(gulp.dest('cordova'));
    }
});

gulp.task('unpack-jxcore-cordova', ['download-jxcore-cordova'], function (callback) {
    if (fs.existsSync('cordova/io.jxcore.node.jx')) {
        return gulp.src('').pipe(shell('jx io.jxcore.node.jx', {
            cwd: 'cordova'
        }));
    } else {
        callback();
    }
});

gulp.task('add-jxcore-cordova', ['unpack-jxcore-cordova'], function (callback) {
    if (fs.existsSync('cordova/plugins/io.jxcore.node')) {
        callback();
    } else {
        require('child_process').exec('cordova plugins add ./io.jxcore.node/', {
            cwd: 'cordova'
        }, callback);
    }
});

gulp.task('add-platforms', ['add-jxcore-cordova'], function (callback) {
    if (fs.existsSync('cordova/platforms/android')) {
        callback();
    } else {
        return gulp.src('').pipe(shell('cordova platforms add android', {
            cwd: 'cordova'
        }));
    }
});

gulp.task('clean-www', ['cordova-create', 'add-platforms'], function () {
    return gulp.src('cordova/www', {
        read: false
    }).pipe(clean());
});

gulp.task('install-server-packages', function () {
    return gulp.src('').pipe(shell('jx install', {
        cwd: 'www/jxcore'
    }));
});

gulp.task('move-server-to-www', ['install-server-packages', 'clean-www'], function () {
    return gulp
        .src('www/**/*', {
            base: 'www'
        })
        .pipe(gulp.dest('cordova/www'));
});

gulp.task('build', ['add-platforms', 'move-server-to-www'], function () {

});

gulp.task('run', ['build'], function () {
    return gulp.src('').pipe(shell('cordova run android', {
        cwd: 'cordova'
    }));
});