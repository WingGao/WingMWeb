var path = require('path');
var PROJ_PATH = path.join(__dirname, '../../');

function taskMain() {
    gulp.task('dev-watch', [
        'js',
        'sass',
        'browser-sync'], function () {
        IS_DEV = true;
        gulp.watch(JS_FILES, ['js-watch']);
        gulp.watch(SASS_FILES, ['sass']);
        // gulp.watch("../src/wp-content/**/*.php", ['browsersync-reload']);
        gulp.watch(PROJ_PATH + "/**/*.html", ['browsersync-reload']);
    });
}

var config = {
    proj_path: '',
    devTasks: ['js', 'browser-sync'],// browser-sync | js
    browserSyncType: 'proxy',// default | proxy | docker
    browserSyncPort: 7013,
    browserSyncProxy: "127.0.0.1:7012",
    browserSyncBaseDir: "",//default proj_path
    taskReloadGlob: path.join(PROJ_PATH, 'WebContent', '**/*.html'),
    // for js task
    taskJSGlob: path.join(PROJ_PATH, 'src-js/**/*.js'),
    taskJSCombineName: '', //合并的文件，空则不合并  xxx.js | '' | null
    taskJSOutPath: path.join(PROJ_PATH, 'WebContent/resources/js'),
    taskJSMapPath: '../tmp',// dir | '' | null,  相对路径taskJSOutPath
    // for server-dev.js
    proxyPort: 7012,
    /*
     * {from: '/api/captcha*', to: '/captcha', host: '120.92.16.213'},
     * file: 'dist/index.html'   指定文件,
     * dir: 'XXX'  指定文件
     * */
    proxyList: [
        {from: '/mainS', dir: path.join(PROJ_PATH, 'WebContent', 'mainS')},
        {from: '/resources', dir: path.join(PROJ_PATH, 'WebContent', 'resources')},
        {from: '*'}
    ],
    proxyTargetHost: '127.0.0.1:7010',
};
config.browserSyncBaseDir = config.proj_path;

module.exports = config;