//这里的babel插件必须是require引用，不能用 import
require('babel-core/register');
require('babel-polyfill');
//程序的启动文件入口
require('./server/app.js');