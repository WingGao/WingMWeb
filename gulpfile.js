var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
const babel = require('gulp-babel');
var order = require("gulp-order");
var addsrc = require('gulp-add-src');
var os = require('os');
var _ = require('lodash');
var http = require('http');
var path = require('path');
var conf = require('./config/gulp_config');

var AUTOPREFIXER_BROWSERS = [
    'last 3 versions',
    'ie >= 8',
    'ios >= 7',
    'android >= 2.0',
    'bb >= 10'
];
//配置当前项目
var IS_DEV = false;
var PROJ_PATH = conf.proj_path;
var JS_PATH = '../js-src';
var JS_DIST_PATH = PROJ_PATH + '/resources/js';
var JS_FILES = JS_PATH + '/**/*.js';
var SASS_PATH = '../css-src';
var SASS_DIST_PATH = PROJ_PATH + '/resources/css';
var SASS_FILES = SASS_PATH + '/*.scss';
var SASS_COMBINE_NAME = 'wing.css';

gulp.task('html', function () {
    var t = new Date().getTime();
    // var urlp = 'http://7xowky.com1.z0.glb.clouddn.com/2016_12_21/';
    var urlp = 'http://qn.suamo-h5.com/2016_12_21/';
    gulp.src('index*.html')
        .pipe(replace('weblibs/swiper.min.css', 'http://cdn.staticfile.org/Swiper/3.2.5/css/swiper.min.css'))
        .pipe(replace('weblibs/jquery-2.1.3.min.js', 'http://libs.baidu.com/libs/jquery/2.1.1/jquery.min.js'))
        .pipe(replace('weblibs/swiper.jquery.js', 'http://cdn.staticfile.org/Swiper/3.2.5/js/swiper.jquery.min.js'))
        .pipe(replace('weblibs/jweixin-1.0.0.js', 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js'))
        .pipe(replace('weblibs/share.js', "http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js"))
        .pipe(replace('weblibs/lodash.min.js', "http://qn.suamo-h5.com/weblibs/lodash.min.js"))
        .pipe(replace('weblibs/hammer.min.js', "http://qn.suamo-h5.com/weblibs/hammer.min.js"))
        .pipe(replace('weblibs/weui.min.css', "http://res.wx.qq.com/open/libs/weui/1.1.0/weui.min.css"))
        .pipe(replace('weblibs/jquery-ui-1.12.1/jquery-ui.css', ''))
        .pipe(replace('weblibs/jquery-ui-1.12.1/jquery-ui.js', ''))
        .pipe(replace('weblibs/GreenSock-JS-1.19.0/TweenMax.js', 'http://qn.suamo-h5.com/weblibs/1.19.0/TweenMax.min.js'))
        .pipe(replace('weblibs/pixi.js', 'http://qn.suamo-h5.com/weblibs/4.0.3/pixi.min.js'))
        .pipe(replace('weblibs/phaser.js', 'http://qn.suamo-h5.com/weblibs/phaser_2_6_2.min.js'))
        .pipe(replace('weblibs/weui.js', 'http://qn.suamo-h5.com/weblibs/weui_1a.min.js'))
        .pipe(replace('="weblibs/', '="../weblibs/'))
        .pipe(replace('dist/main.js', urlp + 'p.min.js?v=' + t))
        .pipe(replace('dist/wx.js', ''))
        .pipe(replace('dist/weui.js', ''))
        .pipe(replace('dist/proj.js', ''))
        .pipe(replace('dist/tl.js', ''))
        .pipe(replace('dist/s3.js', ''))
        .pipe(replace('dist/imagesloaded.pkgd.min.js', ''))
        .pipe(replace('dist/html2canvas.js', ''))
        .pipe(replace('dist/main.css', urlp + 'main.css?v=' + t))
        .pipe(replace('var isDist = false', 'var isDist = true'))
        .pipe(replace('var resourcePath = "img/"', 'var resourcePath = "' + urlp + '"'))
        .pipe(replace(/(src|href|poster)="(img|dist)\/([^"]+)/g, '$1="' + urlp + 'img/$3'))
        .pipe(gulp.dest('dist'))
});
gulp.task('html-test', function () {
    var urlp = 'dist/';
    gulp.src('index*.html')
        .pipe(replace('weblibs/jquery-ui-1.12.1/jquery-ui.css', ''))
        .pipe(replace('weblibs/jquery-ui-1.12.1/jquery-ui.js', ''))
        .pipe(replace('="weblibs/', '="../weblibs/'))
        .pipe(replace('dist/main.js', 'dist/p.min.js'))
        .pipe(replace('dist/wx.js', ''))
        .pipe(replace('dist/weui.js', ''))
        .pipe(replace('dist/proj.js', ''))
        .pipe(replace('dist/tl.js', ''))
        .pipe(replace('dist/s3.js', ''))
        .pipe(replace('dist/imagesloaded.pkgd.min.js', ''))
        .pipe(replace('dist/html2canvas.js', ''))
        .pipe(gulp.dest('dist'))
});
gulp.task('version', function () {
    var t = new Date().getTime();
    gulp.src('../src/wp-content/plugins/suamoplugin/class.suamo.php')
        .pipe(replace(/const VERSION = '\d+';/g, "const VERSION = '" + t + "';"))
        .pipe(gulp.dest('../src/wp-content/plugins/suamoplugin'))
});


gulp.task('js', function () {
    return gulp.src(JS_FILES)
        .pipe(babel({
            presets: ['babel-preset-es2015'].map(require.resolve)
        }).on('error', console.error.bind(console)))
        .pipe(gulp.dest(JS_DIST_PATH));
});


function jsCombine(ugly) {
    var g = gulp.src(JS_FILES)
    // .pipe(order([
    //     JS_PATH + '/03_*',
    //     JS_PATH + '/utils.js',
    //     JS_PATH + '/*.js',
    // ]))
    // .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['babel-preset-es2015'].map(require.resolve)
        }).on('error', console.error.bind(console)))
    // .pipe(concat('suamo.js'))
    if (ugly) {
        g = g.pipe(uglify())
    }
    // g.pipe(sourcemaps.write('../../tmp'))
    g = g.pipe(gulp.dest(JS_DIST_PATH));
    return g;
}

gulp.task('js-comb-test', [], function () {
    jsCombine(false);
});

gulp.task('js-comb', [], function () {
    jsCombine(true);
});

function sassCombine(ugly) {
    var g = gulp.src(SASS_FILES)
    // .pipe(order([
    //     SASS_PATH + '/01_pure.scss',
    //     SASS_PATH + '/02_style.scss',
    //     SASS_PATH + '/03_pure-grids-responsive.scss',
    //     SASS_PATH + '/11_suamo.scss',
    //     SASS_PATH + '/*.scss',
    //     SASS_PATH + '/screen.scss',
    // ]))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    if (ugly) {
        g = g.pipe(minifyCSS())
    }
    if (!IS_DEV) {
        // g.pipe(addsrc.prepend(SASS_PATH + '/00_theme.css'))
    }
    if (SASS_COMBINE_NAME.length > 0) g = g.pipe(concat(SASS_COMBINE_NAME));
    g
    // .pipe(sourcemaps.write('./tmp'))
        .pipe(gulp.dest(SASS_DIST_PATH))
        .pipe(browserSync.stream());
    return g
}
gulp.task('sass', function () {
    sassCombine(false)
});
gulp.task('sass-dist', function () {
    sassCombine(true)
});
// Static server
gulp.task('browser-sync', function () {
    var p = conf.browserSyncType;
    switch (p) {
        case 0:
            //docker
            require('child_process').exec('docker-machine ip ' + process.env.DOCKER_MACHINE_NAME, function (error, stdout, stderr) {
                var dockerip = stdout.trim()
                console.log('your docker ip is', dockerip)
                browserSync.init({
                    online: true,
                    //your docker ip
                    proxy: dockerip + ":8100",
                    port: conf.browserSyncPort,
                });
            });
            break;
        case 'proxy':
            //proxy
            browserSync.init({
                online: true,
                //your docker ip
                proxy: conf.browserSyncProxy,
                port: conf.browserSyncPort,
            });
            break;
        case 'default':
            browserSync.init({
                online: true,
                port: conf.browserSyncPort,
            });
            break;
    }

});

gulp.task('js-watch', ['js-comb-test'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('browsersync-reload', function () {
    browserSync.reload();
});

gulp.task('dev-watch', conf.devTasks, function () {
    IS_DEV = true;
    conf.devTasks.forEach(function (task) {
        switch (task) {
        }
    })
    // gulp.watch(JS_FILES, ['js-watch']);
    // gulp.watch(SASS_FILES, ['sass']);
    // gulp.watch("../src/wp-content/**/*.php", ['browsersync-reload']);
    gulp.watch(conf.taskReloadGlob, ['browsersync-reload']);
});

gulp.task('default', ['dev-watch']);
