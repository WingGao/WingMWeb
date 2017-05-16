var path = require('path');
var PROJ_PATH = path.join(__dirname, '../WebContent');

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
    devTasks: ['browser-sync'],
    browserSyncType: 'default',// default | proxy | docker
    browserSyncPort: 3000,
    browserSyncProxy: "127.0.0.1:7005",
    browserSyncBaseDir: "",//default proj_path
    taskReloadGlob: '',
};
config.taskReloadGlob = config.proj_path + "/**/*.html";
config.browserSyncBaseDir = config.proj_path;

module.exports = config;