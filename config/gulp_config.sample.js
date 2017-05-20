var path = require('path');
var os = require('os');
var webpack = require('./WingMWeb/node_modules/webpack');

var PROJ_PATH = path.join(__dirname, './');
var MOD_PATH = path.join(__dirname, 'WingMWeb');

console.log('PROJ_PATH:', PROJ_PATH);

var config = {
    proj_path: PROJ_PATH,
    isDebug: true,
    devTasks: ['browser-sync'],// browser-sync | js | sass
    browserSyncType: 'proxy',// default | proxy | docker
    browserSyncPort: 7001,
    browserSyncProxy: "127.0.0.1:7017",// proxy 所指向的代理服务
    browserSyncBaseDir: path.join(PROJ_PATH, 'WingMWeb', 'html'),//default proj_path
    taskReloadGlob: [path.join(PROJ_PATH, 'dist', '*.js'),],
    // for webpack
    entry: './WingMWeb/js/comm/react-test.jsx',// 相对于 PROJ_PATH 的入口文件
    // for js task
    taskJSGlob: path.join(PROJ_PATH, 'src-js/**/*.js'),
    taskJSCombineName: 'bundle.js', //合并的文件，空则不合并  xxx.js | '' | null
    taskJSOutPath: path.join(PROJ_PATH, 'dist'),
    taskJSMapPath: '../tmp',// dir | '' | null,  相对路径taskJSOutPath
    // for sass task
    taskSASSGlob: path.join(PROJ_PATH, 'src-scss/**/*.scss'),
    taskSASSCombineName: '', //合并的文件，空则不合并  xxx.css | '' | null
    taskSASSOutPath: path.join(PROJ_PATH, 'WebContent/resources/css'),
    taskSASSMapPath: '../tmp',// dir | '' | null,  相对路径taskSASSOutPath
    // for server-dev.js
    proxyPort: 7017,
    /*
     * {from: '/api/captcha*', to: '/captcha', host: '120.92.16.213'},
     * file: 'dist/index.html'   指定文件,
     * dir: 'XXX'  指定文件
     * */
    proxyList: [
        {from: '/dist', dir: path.join(PROJ_PATH, 'dist')},
        {from: '/dist/libs', dir: path.join(PROJ_PATH, 'libs')},
        {from: '*', file: path.join(MOD_PATH, 'html', 'react-test.html')},
    ],
    proxyTargetHost: '127.0.0.1:7010',
};


var webpackConf = {
    context: config.proj_path,
    target: 'web',
    entry: config.entry,
    output: {
        filename: config.taskJSCombineName,
        path: config.taskJSOutPath
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                // include: [
                // path.resolve(MOD_PATH, 'js', 'comm')
                // ],
                exclude: [
                    /node_modules/,
                    /bower_components/,
                    // path.resolve(__dirname, "app/demo-files")
                ],

                enforce: "pre",
                // enforce: "post",
                // flags to apply these rules, even if they are overridden (advanced option)
                use: {
                    loader: path.join(MOD_PATH, "node_modules", "babel-loader"),
                    options: {
                        babelrc: false,
                        presets: ["env", "react"]
                    },
                },
            },
        ]
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)

        modules: [
            "node_modules",
            PROJ_PATH,
            path.join(MOD_PATH, "node_modules"),
        ],
        // directories where to look for modules

        extensions: [".js", ".json", ".jsx", ".css"],
        // extensions that are used
    },
    // devtool: 'eval-source-map',
    devtool: 'inline-source-map',
    // devtool: 'cheap-eval-source-map',
    // devtool: 'eval',
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    watchOptions: {
        poll: true
    },
    plugins: [
        // Define free variables
        // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': config.isDebug ? '"development"' : '"production"',
            'process.env.BROWSER': false,
            __DEV__: config.isDebug,
        }),
    ],
}


var platform = os.platform();
console.log('platform:', platform);
switch (platform) {
    case 'darwin':
        // var fsevents = require('fsevents');
        // console.log('run `npm install fsevents` in project directory')
        break;

}
module.exports = {
    gulp: config,
    default: webpackConf,
};