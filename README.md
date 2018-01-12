# 基于node koa2开发的模板

> node:8.9.0，npm:5.3.0

1、完全遵循es6语法(最新的node版本还不支持es6的模块化，所以需要配置一下babel编译)

2、采用MVC的开发模式

3、前后端分离，登录验证基于jwt的token验证

4、开发阶段使用nodemon实时编译

5、生产环境会使用pm2，和配置Nginx等等

## 下载安装
```bash
# 安装下载依赖
git clone xxxxx
cd
npm i
# 运行
npm run dev （在浏览器打开http://127.0.0.1:8000）
```
## 目录结构

```
|__ server
  |__ controllers                             // 控制层
  |__ middleware                              // 中间件
  |__ model                                   // 模型
  |__ route                                  // 路由
    |__ index.js                                 // 首页
  |__ database                                 // 数据库连接处理
    |__ index.js                              // 数据库初始化
  |__ utils                                   //工具类方法
  |__ config                                   //全局配置参数
|__ www                                        // 前端资源文件目录
  |__ js                                          // javascript
  |__ css                                          // 样式
  |__ images                                        // 图片
  |__ index.html                                      // 首页
|__ uploadFile                                // 上传资源存放
|__ .gitignore                                // git 忽略文件列表
|__ start.js                                   // 启动文件
|__ package.json                              // npm 项目配置
|__ package-lock.json                         // lock 依赖
|__ README.md                                 // 说明文档
```