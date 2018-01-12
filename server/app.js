import Koa from 'koa';
import KoaStatic from 'koa-static';
import koaBody from 'koa-body';
//要确保数据库定义的Schema先执行，才能保证路由里面能正常使用，所以要优于路由文件加载进来
import database from './database';
import router from './router';
import config from './config';
const app = new Koa();
app.use(koaBody({
    multipart: true
}));
app.use(KoaStatic('./client/'));

//database(app);
router(app);

app.listen(config.port, () => {
    console.log(`服务器运行中，监听${config.port}`);
});