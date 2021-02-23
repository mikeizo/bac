const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');

/**
 * Builds CSS files from SCSS.
 *
 */
function buildCss() {
  return gulp.src([
    './assets/scss/style.scss',
  ])
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({includePaths: ['node_modules']}).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./assets/css/'));
}

function buildJs() {
  return gulp.src([
    //'./node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './assets/js/app.js',
  ])
    .pipe( concat('scripts.js') )
    .pipe( uglify() )
    .pipe(gulp.dest('./assets/js/'));
}

function watch() {
  browserSync.init({
    proxy: 'http://dev.bac'
  });
  gulp.watch('./assets/scss/**/*.scss', buildCss).on('change', browserSync.reload);
  gulp.watch('./assets/js/**/*.js', buildJs).on('change', browserSync.reload);
  gulp.watch('./templates/**/*.html.twig').on('change',browserSync.reload);
}


exports.buildCss = buildCss;
exports.buildJs = buildJs;
exports.watch = watch;
