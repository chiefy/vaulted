'use strict';

var gulp         = require('gulp');
var jshint       = require('gulp-jshint');
var istanbul     = require('gulp-istanbul');
var mocha        = require('gulp-mocha');
var jsdoc        = require('gulp-jsdoc3');
var deploy       = require('gulp-gh-pages');


var SOURCE_CODE = ['lib/**/*.js'];
var TEST_CODE = ['tests/**/*.js'];

gulp.task('lint', function() {
  return gulp.src(SOURCE_CODE)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('pre-test', ['lint'], function () {
  return gulp.src(SOURCE_CODE)
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(TEST_CODE)
    .pipe(mocha())
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports());
});

gulp.task('html', function (cb) {
  var config = require('./jsdocConfig.json');
  gulp.src(['README.md'].concat(SOURCE_CODE), {read: false})
    .pipe(jsdoc(config, cb));
});

gulp.task('deploy', ['html'], function () {
  return gulp
    .src('./gen-docs/**/*')
    .pipe(deploy());
});

