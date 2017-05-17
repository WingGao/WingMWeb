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
    browserSyncPort: 3000,
    browserSyncProxy: "127.0.0.1:7010",
    browserSyncBaseDir: "",//default proj_path
    taskReloadGlob: '',
    // for js task
    taskJSGlob: path.join(PROJ_PATH, 'src-js/**/*.js'),
    taskJSCombineName: '', //合并的文件，空则不合并  xxx.js | '' | null
    taskJSMapPath: path.join(PROJ_PATH, 'WebContent/resources/tmp'),// dir | '' | null
    taskJSOutPath: path.join(PROJ_PATH, 'WebContent/resources/js'),
    // for server-dev.js
    proxyPort: 7012,
    /*
     * {from: '/api/captcha*', to: '/captcha', host: '120.92.16.213'},
     * file: 'dist/index.html'   指定文件,
     * dir: 'XXX'  指定文件
     * */
    proxyList: [
        {from: '/mainS', dir: path.join(PROJ_PATH, 'mainS')},
        {from: '/resources', dir: path.join(PROJ_PATH, 'resources')},
        {from: '*'}
    ],
    proxyTargetHost: '127.0.0.1:7010',
};
config.taskReloadGlob = config.proj_path + "/**/*.html";
config.browserSyncBaseDir = config.proj_path;

module.exports = config;