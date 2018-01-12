import Router from 'koa-router';

const initRouter = (app)=>{
    console.log('路由初始化');
    const router = new Router();
    router.get('/api/list',async (ctx,next)=>{
        ctx.body={
            name :'李四',
            age : 25
        }
    });
    app.use(router.routes()).use(router.allowedMethods());
}

export default initRouter;