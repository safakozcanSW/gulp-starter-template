const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const postcssPresetEnv = require('postcss-preset-env');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const copy = require('gulp-copy');

// !STATIC SERVER
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './',
        },
        notify: false,
        browser: 'chrome',
    });
    gulp.watch('./*.html').on('change', gulp.series(['copy-html', browserSync.reload]));
    gulp.watch('./scss/**/*.scss', gulp.series(['sass', 'minify-css']));
    gulp.watch('./js/**/*.js', gulp.series(['babel', 'minify-js']));
});

//! COPY INDEX.HTML -> DIST/INDEX.HTML

gulp.task('copy-html', () => {
    return gulp.src('./index.html').pipe(copy('./dist')).pipe(browserSync.stream());
});

// ! SASS + POSTCSS
gulp.task('sass', () => {
    return gulp
        .src('./scss/main.scss')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass().on('error', sass.logError))
        .pipe(
            postcss([
                postcssPresetEnv({
                    autoprefixer: { grid: true },
                    browsers: ['last 2 versions'],
                }),
            ])
        )
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/normal'))
        .pipe(browserSync.stream());
});

//! MINIFY CSS
gulp.task('minify-css', () => {
    return gulp
        .src('./dist/css/normal/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/minify'))
        .pipe(browserSync.stream());
});

// !JS BABEL
gulp.task('babel', () => {
    return gulp
        .src('./js/**/*.js')
        .pipe(
            babel({
                presets: ['@babel/env'],
            })
        )
        .pipe(gulp.dest('./dist/js/normal'));
});

// !JS MINIFY
gulp.task('minify-js', () => {
    return gulp
        .src(['./dist/js/normal/**/*.js'])
        .pipe(
            minify({
                noSource: true,
                ext: {
                    min: '.min.js',
                },
            })
        )
        .pipe(gulp.dest('./dist/js/minify'));
});

// !JS DOSYALARINI BİRLEŞTİRME
// gulp.task('concat', () => {
//     return gulp.src('./dist/js/*-min.js')
//         .pipe(concat('dist.min.js'))
//         .pipe(gulp.dest('./dist/js'))
// });

gulp.task(
    'default',
    gulp.series(['copy-html', 'sass', 'minify-css', 'babel', 'minify-js', 'browser-sync'])
);
