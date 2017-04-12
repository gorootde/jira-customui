//import the necessary gulp plugins
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var merge = require('merge-stream');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var tsprojectServer = ts.createProject("./tsconfig.json");
var tsprojectClient = ts.createProject("./tsconfig.json");



gulp.task('default', ['browser-sync'], function() {});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init({
        proxy: "localhost:3000",
        files: ["client/src/**/*.*", "server/src/**/*.*"],
        brower: "Safari",
        port: 7000
    });
});

gulp.task('nodemon', function(cb) {
    var started = false;
    return nodemon({
        script: 'server/runtime/app.js',
        ext:"js ts html",
        execMap: {
            js: 'DEBUG=* node'
        }
    }).on('restart',["build"])
    .on('start', function() {
        if (!started) {
            cb();
            started = true;
        }
    })
});

//declare the task
gulp.task('build', function(done) {
    var server = gulp.src('./server/src/**/*.ts')
        // .pipe(tslint())
        // .pipe(tslint.report())
        .pipe(tsprojectServer())
        .pipe(gulp.dest('./server/runtime'));

    var client = gulp.src('./client/src/**/*.ts')
        // .pipe(tslint())
        // .pipe(tslint.report())
        .pipe(tsprojectClient())
        .pipe(gulp.dest('./client/src'));
    return merge(client, server);
});