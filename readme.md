# WingMWeb

基础web集成开发脚手架

## 使用
* `yarn install`
* 复制`config/gulp_config.sample.js`到`config/gulp_config.js`，并更改相关配置

#### gulp
* 可以使用命令行参数 `gulp TASKNAME -c path-of-conifg.js` 来指定配置文件

### server-dev
* `node server-dev.js -c path-of-conifg.js`

#### webpack
* 查看错误 `--display-error-details`
* `./node_modules/.bin/webpack --config ../gulp_config.wing.js --watch`
* 复制`mweb.sh`到项目，更改内容


### debug
```javascript
localStorage.debug = 'log:*'
```