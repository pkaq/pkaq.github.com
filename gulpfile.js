'use strict';

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin');
//JS压缩
gulp.task('uglify', function() {
    return gulp.src('././public/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('././public/js/'));
});
//CSS压缩
gulp.task('cssmin', function() {
    return gulp.src('././public/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('././public/css/'));
});

//图片压缩
gulp.task('images', function() {
    gulp.src('././public/images/**/*.*')
        .pipe(imagemin({
            progressive: false
        }))
        .pipe(gulp.dest('././public/images/'));
});

gulp.task('build', ['uglify', 'cssmin', 'images']);