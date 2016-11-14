var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	minifyCSS = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	plumber      = require('gulp-plumber'), // Helps prevent stream crashing on errors
	notify = require("gulp-notify"),
	browserSync = require('browser-sync').create();

var gulpPaths = {
	sass:'scss/',
	cssDist:'dist/css/'
};

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	gulp.src(gulpPaths.sass + '**/*.scss')
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'nested',
			errLogToConsole:false,
			onError: function(err) {
				return notify().write(err);
			},
			lineNumbers: true,
			sourcemap: true
			// includePaths: [paths.styles.src, bourbon].concat(neat)
		}))
		.pipe(concat(gulpPaths.cssDist + 'app.css'))
		.pipe(gulp.dest('./'))
		.pipe(minifyCSS())
		.pipe(rename('app.min.css'))
		.pipe(plumber.stop())
		.pipe(gulp.dest(gulpPaths.cssDist))
		.pipe(browserSync.stream());
});


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

	browserSync.init({
		server: "./"
	});

	gulp.watch( gulpPaths.sass + '**/*.scss', ['sass']);
	gulp.watch( "*.html").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);
