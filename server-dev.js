var express = require('express')
var path = require('path')
var compression = require('compression')
var proxy = require('express-http-proxy');
//npm install express compression express-http-proxy
//unzip zjf.zip -d zjf
//DEBUG=express:* node server.js
//config
var allowFakeData = false;
var allowProxy = true;
//config end
var app = express()

app.use(compression())

// serve our static stuff like index.css
// app.use(express.static(path.join(__dirname, 'public')))
// console.log(path.join(__dirname, '../WebContent/mainS'))
app.use('/mainS', express.static(path.join(__dirname, '../WebContent/mainS')))
app.use('/mainA', express.static(path.join(__dirname, '../WebContent/mainA')))
app.use('/resources/data', express.static(path.join(__dirname, '../target/exam/resources/data')))
app.use('/resources', express.static(path.join(__dirname, '../WebContent/resources')))

/*
 * {from: '/api/captcha*', to: '/captcha', host: '120.92.16.213'},
 * file: 'dist/index.html'   指定文件
 * */
var apilist = [
    // {from: '/', file: 'dist/index.html'},
    // {from: '/aboutus.jspx', file: 'dist/aboutus.html'},
    // {from: '/css_zhiwei_top.css', file:'dist/zhiwei_top.css'},
    // {from: '/api/captcha*', to: '/captcha', host: '120.92.16.213'},
    // {from: '/api/*', to: '/'},
    // {from: '/usr/geo'},
    // {from: '/zjf/*', to: '/webgl/3d/', host: 'demo.zhaojifang.com'},
    {from: '*'},
]

var apiHost = '127.0.0.1:7003';

if (allowProxy) apilist.map(function (api) {
    var from = api.from;
    if (api.file != null) {
        //静态文件
        return app.get(api.from, function (req, res, next) {
            res.sendFile(path.join(__dirname, api.file))
        })
    } else {
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

var PORT = process.env.PORT || 7005
app.listen(PORT, '0.0.0.0', function () {
    console.log('Production Express server running at localhost:' + PORT)
})
