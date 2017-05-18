var express = require('express')
var path = require('path')
var compression = require('compression')
var proxy = require('express-http-proxy');
var argv = require('yargs').argv;
if (argv.c != null) {
    var conf = require(argv.c)
} else {
    var conf = require('./config/gulp_config');
}
//npm install express compression express-http-proxy
//unzip zjf.zip -d zjf
//DEBUG=express:* node server.js
//config
var allowFakeData = false;
var allowProxy = true;
//config end
var app = express()

app.use(compression())

/*
 * {from: '/api/captcha*', to: '/captcha', host: '120.92.16.213'},
 * file: 'dist/index.html'   指定文件
 * dir: 'XXX'  指定文件
 * */
var apilist = conf.proxyList;
// {from: '/', file: 'dist/index.html'},
// {from: '/aboutus.jspx', file: 'dist/aboutus.html'},
// {from: '/css_zhiwei_top.css', file:'dist/zhiwei_top.css'},
// {from: '/api/captcha*', to: '/captcha', host: '120.92.16.213'},
// {from: '/api/*', to: '/'},
// {from: '/usr/geo'},
// {from: '/zjf/*', to: '/webgl/3d/', host: 'demo.zhaojifang.com'},
// {from: '*'},


var apiHost = conf.proxyTargetHost;

if (allowProxy) apilist.map(function (api) {
    var from = api.from;
    if (api.file != null) {
        //静态文件
        return app.get(api.from, function (req, res, next) {
            res.sendFile(path.join(__dirname, api.file))
        })
    } else if (api.dir != null) {
        return app.use(api.from, express.static(api.dir))
    }
    else {
        //普通代理
        var host = api.host == null ? apiHost : api.host;
        return app.use(api.from, proxy(host, {
            forwardPath: function (req, res) {
                console.log('proxy', req._parsedUrl.path)
                var p = req._parsedUrl.path
                var rstr = null;
                var windex = from.indexOf('*')
                if (windex >= 0) {
                    rstr = from.substring(0, windex)
                }
                if (api.to != null) {
                    p = p.replace(rstr, api.to)
                }
                console.log('proxy redirect to =>', host, p)
                return p
            },
        }))
    }
})


// send all requests to index.html so browserHistory works
app.get('*', function (req, res, next) {
    // res.sendFile(path.join(__dirname, 'public', 'index.html'))
    // next()
})

var PORT = process.env.PORT || conf.proxyPort;
app.listen(PORT, '0.0.0.0', function () {
    console.log('Production Express server running at localhost:' + PORT)
})
