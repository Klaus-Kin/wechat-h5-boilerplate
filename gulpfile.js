'use strict';

const autoprefixer = require('gulp-autoprefixer');
const browserify = require('gulp-browserify');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const { series, parallel, watch, src, dest } = gulp;
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const minifycss = require('gulp-minify-css');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const merge = require('merge-stream');

const vendors = require('./config/vendors');

// ============================================================================================================
// ============================================ For Development ================================================
// ============================================================================================================

// copy fonts from node_modules and app/src/fonts to app/dist/fonts
function publishFonts() {
    const fonts = vendors.fonts.concat([
        'app/src/fonts/*'
    ]);

    return src(fonts, { allowEmpty: true })
        .pipe(dest('app/dist/fonts'));
}

// optimize images under app/src/images and save the results to app/dist/images
function publishImages() {
    // 修复 glob 模式错误
    return src([
        'app/src/images/**/*',
        '!app/src/images/**/*.svg', // 排除 SVG
        'app/src/images/**/*.svg'   // 单独包含 SVG
    ], { allowEmpty: true })
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            // 添加 SVG 优化配置
            svgoPlugins: [{ removeViewBox: false }]
        }))
        .pipe(dest('app/dist/images'));
}

// copy audios from app/src/audios to app/dist/audios
function publishAudios() {
    return src('app/src/audios/*', { allowEmpty: true })
        .pipe(dest('app/dist/audios'));
}

// compile sass, concat stylesheets in the right order
function publishCss() {
    const cssVendors = vendors.stylesheets;

    // 使用 merge-stream 正确处理多个源
    const vendorStream = src(cssVendors, { allowEmpty: true });
    const sassStream = src('app/src/scss/main.scss', { allowEmpty: true })
        .pipe(plumber({ errorHandler: errorAlert }))
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(autoprefixer());

    return merge(vendorStream, sassStream)
        .pipe(concat('bundle.css'))
        .pipe(dest('app/dist/stylesheets'))
        .pipe(browserSync.stream());
}

// bundle and concat javascripts
function publishJs() {
    const jsVendors = vendors.javascripts;

    // 使用 merge-stream 正确处理多个源
    const vendorStream = src(jsVendors, { allowEmpty: true });
    const jsStream = src('app/src/javascripts/main.js', { allowEmpty: true })
        .pipe(plumber({ errorHandler: errorAlert }))
        .pipe(browserify({
            transform: ['partialify'],
            debug: true
        }));

    return merge(vendorStream, jsStream)
        .pipe(concat('bundle.js'))
        .pipe(dest('app/dist/javascripts'));
}

// inject assets into index.html
function injectTask() {
    const target = src('app/src/index.html');
    const assets = src([
        'app/dist/stylesheets/bundle.css',
        'app/dist/javascripts/bundle.js'
    ], { read: false, allowEmpty: true });

    return target
        .pipe(inject(assets, {
            ignorePath: 'app/dist/',
            addRootSlash: false,
            removeTags: true
        }))
        .pipe(dest('app/dist'));
}

// watch files and run corresponding tasks
function watchTask(done) {
    browserSync.init({
        server: {
            baseDir: 'app/dist'
        },
      // 添加这行禁用连接提示弹窗
      notify: false
    });

    watch('app/src/index.html', series(injectTask, reloadBrowser));
    watch('app/src/scss/**/*.scss', publishCss);
    watch('app/src/javascripts/**/*', series(publishJs, injectTask, reloadBrowser));
    watch('app/src/fonts/**/*', series(publishFonts, reloadBrowser));
    watch('app/src/images/**/*', series(publishImages, reloadBrowser));
    watch('app/src/audios/**/*', series(publishAudios, reloadBrowser));

    done();
}

function reloadBrowser(done) {
    browserSync.reload();
    done();
}

// delete files under app/dist
function cleanFiles() {
    return del([
        'app/dist/**/*'
    ], { force: true });
}

// ============================================================================================================
// ================================================= For Production ============================================
// ============================================================================================================

// minify CSS
function minifyCss() {
    return src('app/dist/stylesheets/bundle.css', { allowEmpty: true })
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('app/dist/stylesheets'));
}

// uglify JS
function uglifyJs() {
    return src('app/dist/javascripts/bundle.js', { allowEmpty: true })
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('app/dist/javascripts'));
}

// inject minified assets
function injectMin() {
    const target = src('app/src/index.html');
    const assets = src([
        'app/dist/stylesheets/bundle.min.css',
        'app/dist/javascripts/bundle.min.js'
    ], { read: false, allowEmpty: true });

    return target
        .pipe(inject(assets, {
            ignorePath: 'app/dist/',
            addRootSlash: false,
            removeTags: true
        }))
        .pipe(dest('app/dist'));
}

// delete unminified bundles
function delBundle() {
    return del([
        'app/dist/stylesheets/bundle.css',
        'app/dist/javascripts/bundle.js'
    ], { force: true });
}

// ===============================================
// ================== Functions ==================
// ===============================================

// handle errors
function errorAlert(error){
    notify.onError({
        title: "Error in plugin '" + error.plugin + "'",
        message: 'Check your terminal',
        sound: 'Sosumi'
    })(error);
    console.log(error.toString());
    this.emit('end');
}

// ===============================================
// ================== Task Exports ===============
// ===============================================

// development workflow task
exports.dev = series(
    cleanFiles,
    parallel(
        publishFonts,
        publishImages,
        publishAudios,
        publishCss,
        publishJs
    ),
    injectTask,
    watchTask
);

// production build task
exports.prod = series(
    minifyCss,
    uglifyJs,
    parallel(
        injectMin,
        delBundle
    )
);

// default task
exports.default = exports.dev;