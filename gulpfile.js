const gulp = require('gulp'),
	sass = require('gulp-sass')(require('sass')),
	postcss = require('gulp-postcss'),
	rename = require('gulp-rename'),
	//watch = require('gulp-watch'),
	notify = require('gulp-notify'),
	cleanCSS = require('gulp-clean-css'),
	plumber = require('gulp-plumber');

const onError = function (err) {
	notify.onError({
		title: 'Gulp',
		subtitle: 'Failure!',
		message: 'Error: <%= error.message %>',
		sound: 'Beep',
	})(err);

	this.emit('end');
};

const css = function () {
	return gulp
		.src('./dev/main.scss')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			sass({
				errLogToConsole: true,
			})
		)
		.on(
			'error',
			notify.onError({
				message: 'Error: <%= error.message %>',
			})
		)
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('./assets/'))
		.pipe(
			notify({
				message: 'Theme CSS ready',
				onLast: true,
			})
		);
};

const watch = function () {
	gulp.watch('./dev/*.scss', css);
};

exports.default = gulp.parallel(css, watch);
