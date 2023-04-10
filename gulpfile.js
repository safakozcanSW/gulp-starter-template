const gulp = require('gulp');
const browserSync = require('browser-sync').create();
var sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const cleancss = require('gulp-clean-css');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const pipeline = require('readable-stream').pipeline;
// $ npm install --save-dev gulp-babel @babel/core @babel/preset-env

// !STATIC SERVER
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './',
        },
        //connected bildirimini kapatma
        notify: false,
        browser: 'chrome',
    });
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./scss/**/*.scss', gulp.series(['sass']));
    // gulp.watch('./js/*.js', gulp.series(['babel', 'minify']));
});

// ! SASS + POSTCSS + CLEANCSS

gulp.task('sass', () => {
    return (
        gulp
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
            //!1-->şu anda klasör indisi ./css'de. Bundan sonraki işlemlerde buraya göre konum alınacak
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/css/'))
            //!2-->css içerisine çıkartmak istiyoruz. O yüzden
            //root'da /css'e kaydedildikten sonra cleancss() ile minify edilip,
            .pipe(cleancss())
            //minify hali dist/css'e kaydediliyor.
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/css/minify/'))
            .pipe(browserSync.stream())
    );
});
// ! IMG'LARI SIKIŞTIRMA
// gulp.task('imagemin', () =>{
//     return gulp.src('./img/**/*')
//         .pipe(imagemin())
//         .pipe(gulp.dest('./img/img-min'))
//         .pipe(browserSync.stream())
// });

// !JS DOSYALARINI BABEL'DAN GEÇİRME
// gulp.task('babel', () => {
//     return gulp
//         .src('./js/*.js')
//         .pipe(
//             babel({
//                 presets: ['@babel/env'],
//             })
//         )
//         .pipe(gulp.dest('./dist/js'));
// });

// !JS DOSYALARINI .min.js'E ÇEVİRME
// gulp.task('minify', () => {
//     return gulp.src(['./dist/js/main.js']).pipe(minify()).pipe(gulp.dest('./dist/js'));
// });

// !JS DOSYALARINI BİRLEŞTİRME
// gulp.task('concat', () => {
//     return gulp.src('./dist/js/*-min.js')
//         .pipe(concat('dist.min.js'))
//         .pipe(gulp.dest('./dist/js'))
// });

gulp.task('default', gulp.series(['sass', 'browser-sync']));
