'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var path = require('path');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var ngConfig = require('gulp-ng-config');
var fs = require('fs');
var reload = browserSync.reload;
var gutil = require('gulp-util');

/*$.uglify().on('error', function(err) {
gutil.log(gutil.colors.red('[Error]'), err.toString());
this.emit('end');
})*/


// -----------------------------------------------------------------------------
// JavaScript
// -----------------------------------------------------------------------------

gulp.task('js', function () {
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-route/angular-route.js',
    './localcomponents/**/*.js',
    './localviews/**/*.js',
    './config.js',
    './app.js'])
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./js'))
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'Gulp',
        message: '<%= error.message %>',
      })
    }))
    .pipe(uglify({
      output: {
        max_line_len: 32000,
        beautify: false
      }
    }).on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
      this.emit('end');
    }))
    .pipe(gulp.dest('./js'));
});

// -----------------------------------------------------------------------------
// LESS
// -----------------------------------------------------------------------------

gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('./css'));
});


// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------


gulp.task('htmlviews', function () {
  return gulp.src('./localviews/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('distviews'));
});

gulp.task('htmlcomponents', function () {
  return gulp.src('./localcomponents/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('distcomponents'));
});

// -----------------------------------------------------------------------------
// Setup Environment
// -----------------------------------------------------------------------------

/*
 *  We first generate the json file for configuration.
 *  Then we source it into our gulp task.
 *  The env constants will be a saved as a sub-module of our app, EnvironmentConfig.
 *  So we shall name it EnvironmentConfig.
 */

gulp.task('ng-config', function () {
  gulp.src('./config.json')
    .pipe(
    ngConfig('moviepost.config', {
      environment: ['env.dist', 'global']
    })
    )
    .pipe(gulp.dest('./'))
});

gulp.task('ng-config-test', function () {
  gulp.src('./config.json')
    .pipe(
    ngConfig('moviepost.config', {
      environment: ['env.local', 'global']
    })
    )
    .pipe(gulp.dest('./'))
});


gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch(['./index.html'], [reload]);
  gulp.watch('./less/**/*.less', ['less', reload]);
  gulp.watch(['./index.html'], [reload]);
  gulp.watch('./localviews/**/*.html', ['htmlviews', reload]);
  gulp.watch('./localcomponents/**/*.html', ['htmlcomponents', reload]);
  gulp.watch('./localcomponents/**/*.js', ['js', reload]);
  gulp.watch('./localviews/**/*.js', ['js', reload]);
  gulp.watch('./app.js', ['js', reload]);

});

// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------

gulp.task('build', [], function () {
  runSequence('less', 'ng-config', 'js', 'htmlviews', 'htmlhelp', 'htmlcomponents');
});

// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------

gulp.task('test', [], function () {
  runSequence('less', 'ng-config-test', 'js', 'serve');
});


// -----------------------------------------------------------------------------
// Watch Files & Reload
// -----------------------------------------------------------------------------


gulp.task('serve', function () {
  browserSync.init({
    server: {
      open: 'external',
      host: 'http://moviepost.loc:3000',
      proxy: 'http://moviepost.loc:3000',
      port: 80,
      baseDir: "./",
      middleware: [historyApiFallback()]
    }
  });

  gulp.watch(['./index.html'], [reload]);
  gulp.watch('./less/**/*.less', ['less', reload]);
  gulp.watch(['./index.html'], [reload]);
  gulp.watch('./localviews/**/*.html', ['htmlviews', reload]);
  gulp.watch('./localcomponents/**/*.html', ['htmlcomponents', reload]);
  gulp.watch('./localcomponents/**/*.js', ['js', reload]);
  gulp.watch('./localviews/**/*.js', ['js', reload]);
  gulp.watch('./app.js', ['js', reload]);

});


// -----------------------------------------------------------------------------
// Gulp Default
// -----------------------------------------------------------------------------

var historyApiFallback = require('connect-history-api-fallback');

gulp.task('default', [], function () {
  gulp.start('serve');
});