'use strict'

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
var rename = require('gulp-rename');


var SOURCE_CODE = ['lib/**/*.js'];

gulp.task('docs', function () {
  return gulp.src(SOURCE_CODE)
    .pipe(gulpJsdoc2md())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('jsdoc2md failed'), err.message)
    })
    .pipe(rename(function (path) {
      path.extname = '.md'
    }))
    .pipe(gulp.dest('docs'));
});
