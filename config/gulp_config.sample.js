var path = require('path');
var os = require('os');
var PROJ_PATH = path.join(__dirname, 'View');
// var MOD_PATH = path.join(__dirname, 'WingMWeb');
var MOD_PATH = '/Users/gaoyunyun/Projs/SuamoIris/sc-admin/WingMWeb';
var PROJ2_PATH = path.join(__dirname, '../../Public', 'Admin');
const VERSION = 1.1;

console.log('PROJ_PATH:', PROJ_PATH);

function modpack(pack) {
    return path.join(MOD_PATH, "node_modules", pack)
}

var webpack = require(modpack('webpack'));

var config = {
    version: VERSION,
    proj_path: PROJ_PATH,
    isDebug: true,
    devTasks: ['sass', 'js', 'browser-sync'],// browser-sync | js | sass
    browserSyncType: 'proxy',// default | proxy | docker
    browserSyncPort: 7024,
    browserSyncProxy: "127.0.0.1:7025",// proxy 所指向的代理服务 ==> proxyPort
    browserSyncBaseDir: path.join(PROJ_PATH, 'View'),//default proj_path
    taskReloadGlob: [path.join(PROJ_PATH, 'dist', '*.js'),],
    // for webpack
    entry: './src/index.js',// 相对于 PROJ_PATH 的入口文件
    // for js task
    taskJS: [
        {
            taskJSGlob: path.join(PROJ2_PATH, 'src-js/**/*.js'),
            taskJSCombineName: '', //合并的文件，空则不合并  xxx.js | '' | null
            taskJSOutPath: path.join(PROJ2_PATH, 'js'),
            taskJSSourceRoot: '/src-js', //sourcemap相关
            taskJSMapPath: '',// dir | '' | null,  相对路径taskJSOutPath
        }
    ],
    // for sass task
    taskSASSGlob: path.join(PROJ_PATH, 'src/**/*.scss'),
    taskSASSCombineName: '', //合并的文件，空则不合并  xxx.css | '' | null
    taskSASSOutPath: path.join(PROJ_PATH, 'dist'),
    taskSASSMapPath: './tmp',// dir | '' | null,  相对路径taskSASSOutPath
    // for server-dev.js
    proxyPort: 7025,
    /*
     * {from: '/api/captcha*', to: '/captcha', host: '120.92.16.213'},
     * file: 'dist/index.html'   指定文件,
     * dir: 'XXX'  指定文件
     * */
    proxyList: [
        { from: '/dist', dir: path.join(PROJ_PATH, 'dist') },
        { from: '/libs', dir: path.join(PROJ_PATH, 'libs') },
        { from: '/bower_components', dir: path.join(MOD_PATH, 'bower_components') },
        { from: '/api/*', to: '/', host: 'prl-dev.shared:7023' },
        { from: '/Uploads', host: 'prl-dev.shared:7023' },
        { from: '/Public/Mall', dir: path.join(PROJ_PATH, '../Public') },
        { from: '*', file: path.join(PROJ_PATH, 'src', 'index.html') },
    ],
    proxyTargetHost: '127.0.0.1:7000',
};


var webpackConf = {
    context: config.proj_path,
    target: 'web',
    entry: config.entry,
    output: {
        filename: 'bundle.js',
        path: path.join(PROJ_PATH, '../dist')
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
                    loader: modpack("babel-loader"),
                    options: {
                        babelrc: false,
                        // presets: [["env", {include: 'transform-es2015-spread'}], "react"]
                        presets: ["env", "react"],
                        plugins: ["transform-object-rest-spread", "transform-class-properties",
                            "transform-decorators-legacy",
                            ["import", { libraryName: "antd", style: "css" }]
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        // loader: modpack('isomorphic-style-loader'),
                        loader: modpack('style-loader'),
                    },
                    {
                        loader: modpack('css-loader'),
                        options: {
                            // CSS Loader https://github.com/webpack/css-loader
                            importLoaders: 1,
                            sourceMap: config.isDebug,
                            // CSS Modules https://github.com/css-modules/css-modules
                            // modules: true,
                            localIdentName: config.isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
                            // CSS Nano http://cssnano.co/options/
                            minimize: !config.isDebug,
                            discardComments: { removeAll: true },
                        },
                    },
                    {
                        loader: modpack('postcss-loader'),
                        options: {
                            // parser: modpack('sugarss'),
                            plugins: [
                                // 'postcss-import': {},
                                // 'cssnext': {},
                                require(modpack('autoprefixer'))(),
                                // 'cssnano': {}
                            ]
                        },
                    },
                ],
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
        alias: {
            WingMWeb: path.resolve(MOD_PATH, 'js/comm')
        },
        extensions: [".js", ".json", ".jsx", ".css"],
        // extensions that are used
    },
    // devtool: 'source-map',
    devtool: 'inline-source-map',
    // devtool: 'cheap-eval-source-map',
    // devtool: 'eval',
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    watchOptions: {
        ignored: /node_modules/,
        poll: true,
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
};


var platform = os.platform();
console.log('platform:', platform);
switch (platform) {
    case 'darwin':
        // var fsevents = require('fsevents');
        console.log('run `npm install fsevents` in project directory to fix high cpu usage');
        break;

}
module.exports = {
    gulp: config,
    default: webpackConf,
};