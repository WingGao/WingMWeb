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
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var os = require('os');
var _ = require('lodash');
var http = require('http');
var path = require('path');
const nunjucks = require('gulp-nunjucks');
var through = require('through2')
var rename = require("gulp-rename");

var argv = require('yargs').argv;
// gulp taskA -c config-file-path
if (_.size(argv.c) > 0) {
    var conf = require(argv.c).gulp
} else {
    var conf = require('./config/gulp_config.sample').gulp;
}
const VERSION = 1.1;

if (VERSION > _.defaultTo(conf.version, 0)) {
    throw '请升级配置文件';
}

console.log('WingMWeb version', VERSION);
//read https://www.browsersync.io/docs/gulp

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
var SASS_PATH = '../css-src';
var SASS_DIST_PATH = PROJ_PATH + '/resources/css';
var SASS_FILES = SASS_PATH + '/*.scss';
var SASS_COMBINE_NAME = 'wing.css';

gulp.task('html', function () {
    var taskHtml = conf.taskHtml
    gulp.src(taskHtml.htmlGlob)
        .pipe(nunjucks.compile(undefined,taskHtml.opts))
        // .pipe(nunjucks.compile())
        .pipe(rename(function (path) {
            path.extname = '.html'
        }))
        // .pipe(through.obj(function (chunk, enc, cb) {
        //     console.log('chunk', chunk.path) // this should log now
        //     cb(null, chunk)
        // }))
        .pipe(gulp.dest(taskHtml.htmlDist))
});

gulp.task('html-watch', ['html'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('html-test', function () {
    // var urlp = 'dist/';
    // gulp.src('index*.html')
    //     .pipe(replace('weblibs/jquery-ui-1.12.1/jquery-ui.css', ''))
    //     .pipe(replace('weblibs/jquery-ui-1.12.1/jquery-ui.js', ''))
    //     .pipe(replace('="weblibs/', '="../weblibs/'))
    //     .pipe(replace('dist/main.js', 'dist/p.min.js'))
    //     .pipe(replace('dist/wx.js', ''))
    //     .pipe(replace('dist/weui.js', ''))
    //     .pipe(replace('dist/proj.js', ''))
    //     .pipe(replace('dist/tl.js', ''))
    //     .pipe(replace('dist/s3.js', ''))
    //     .pipe(replace('dist/imagesloaded.pkgd.min.js', ''))
    //     .pipe(replace('dist/html2canvas.js', ''))
    //     .pipe(gulp.dest('dist'))
});
gulp.task('version', function () {
    var t = new Date().getTime();
    gulp.src('../src/wp-content/plugins/suamoplugin/class.suamo.php')
        .pipe(replace(/const VERSION = '\d+';/g, "const VERSION = '" + t + "';"))
        .pipe(gulp.dest('../src/wp-content/plugins/suamoplugin'))
});


gulp.task('js', function (done) {
    var doneTask = 0;
    conf.taskJS.forEach(function (task, i) {
        jsCombineSingle(task, false, function () {
            doneTask++;
        })
    })

    let inter = setInterval(function () {
        if (doneTask >= conf.taskJS.length) {
            clearInterval(inter);
            done();
        }
    }, 100)
});

//单js任务
function jsCombineSingle(jsconf, ugly, done) {
    var needMap = _.size(jsconf.taskJSMapPath) > 0;
    var g = gulp.src(jsconf.taskJSGlob);
    // .pipe(order([
    //     JS_PATH + '/03_*',
    //     JS_PATH + '/utils.js',
    //     JS_PATH + '/*.js',
    // ]))
    if (needMap) {
        g = g.pipe(sourcemaps.init())
    }
    g = g.pipe(babel({
        presets: ['babel-preset-es2015'].map(require.resolve)
    }).on('error', function (e) {
        console.log('>>> ERROR', e);
        this.emit('end');
    }));

    if (_.size(jsconf.taskJSCombineName) > 0) g = g.pipe(concat(jsconf.taskJSCombineName));

    if (ugly) {
        g = g.pipe(uglify())
    }
    if (needMap) g = g.pipe(sourcemaps.write(jsconf.taskJSMapPath, { sourceRoot: jsconf.taskJSSourceRoot }));

    g = g.pipe(gulp.dest(jsconf.taskJSOutPath))
        .on('end', function () {
            if (done != null) done()
        });
    return g;
}

function jsCombine(ugly, done) {
    var needMap = _.size(conf.taskJSMapPath) > 0;
    var g = gulp.src(conf.taskJSGlob);
    // .pipe(order([
    //     JS_PATH + '/03_*',
    //     JS_PATH + '/utils.js',
    //     JS_PATH + '/*.js',
    // ]))
    if (needMap) {
        g = g.pipe(sourcemaps.init())
    }
    g = g.pipe(babel({
        presets: ['babel-preset-es2015'].map(require.resolve)
    }).on('error', function (e) {
        console.log('>>> ERROR', e);
        this.emit('end');
    }));

    if (_.size(conf.taskJSCombineName) > 0) g = g.pipe(concat(conf.taskJSCombineName));

    if (ugly) {
        g = g.pipe(uglify())
    }
    if (needMap) g = g.pipe(sourcemaps.write(conf.taskJSMapPath, { sourceRoot: '/src-js' }));

    g = g.pipe(gulp.dest(conf.taskJSOutPath))
        .on('end', function () {
            if (done != null) done()
        });
    return g;
}

gulp.task('js-comb', [], function () {
    jsCombine(true);
});

function sassCombine(ugly) {
    var needMap = _.size(conf.taskSASSMapPath) > 0;
    var g = gulp.src(conf.taskSASSGlob);
    // .pipe(order([
    //     SASS_PATH + '/01_pure.scss',
    //     SASS_PATH + '/02_style.scss',
    //     SASS_PATH + '/03_pure-grids-responsive.scss',
    //     SASS_PATH + '/11_suamo.scss',
    //     SASS_PATH + '/*.scss',
    //     SASS_PATH + '/screen.scss',
    // ]))
    if (needMap) {
        g = g.pipe(sourcemaps.init())
    }
    g = g.pipe(sass().on('error', sass.logError));
    if (needMap) {
        g = g.pipe(sourcemaps.write({ includeContent: false }))
            .pipe(sourcemaps.init({ loadMaps: true }))
    }

    g = g.pipe(autoprefixer(AUTOPREFIXER_BROWSERS));
    if (ugly) {
        g = g.pipe(minifyCSS())
    }

    if (_.size(conf.taskSASSCombineName) > 0) g = g.pipe(concat(conf.taskSASSCombineName));
    if (needMap) {
        g = g.pipe(sourcemaps.write(conf.taskSASSMapPath))
    }
    g = g.pipe(gulp.dest(conf.taskSASSOutPath))
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
                var dockerip = stdout.trim();
                console.log('your docker ip is', dockerip);
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
                server: {
                    baseDir: conf.browserSyncBaseDir,
                },
                port: conf.browserSyncPort,
            });
            break;
    }

});

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('browsersync-reload', function () {
    browserSync.reload();
});

gulp.task('dev-watch', conf.devTasks, function () {
    IS_DEV = true;
    var next, mwatch;
    if (os.platform() == 'darwin') {
        //TODO 内存回收
        mwatch = function (g, nextTask) {
            return watch(g, batch(function (events, done) {
                gulp.start(nextTask, done);
            }))
        };
    } else {
        //TODO linux 上不能watch？
        mwatch = function (g, nextTask) {
            return gulp.watch(g, [nextTask])
        };
    }
    conf.devTasks.forEach(function (task) {
        switch (task) {
            case 'js':
                conf.taskJS.forEach(function (task) {
                    mwatch(task.taskJSGlob, 'js-watch');
                });
                break;
            case 'sass':
                mwatch(conf.taskSASSGlob, 'sass');
                break;
            case 'html':
                mwatch(conf.taskHtml.htmlGlob, 'html-watch')
                break;
        }
    });

    if (_.size(conf.taskReloadGlob) > 0) {
        console.log('taskReloadGlob:', conf.taskReloadGlob);
        mwatch(conf.taskReloadGlob, 'browsersync-reload');
    }

});


function getProdTasks(tasks) {
    return _.map(_.filter(tasks, v => v != 'browser-sync'), v => {
        return `${v}-dist`
    })
}

gulp.task('prod', getProdTasks(conf.devTasks), function () {

});

gulp.task('default', ['dev-watch']);
