import Koa from 'koa';
import { loggerMiddleware } from './middlewares/logger';
import { authMiddleware } from './middlewares/auth';
import cors  from 'koa2-cors';
import koaBody from 'koa-body';
import staticFiles from 'koa-static';
import { koaSwagger } from 'koa2-swagger-ui';
import { join } from 'path';
import { BASE_DIR } from './const';
import type { SwaggerOptions } from 'koa2-swagger-ui';
import type { CustomContext } from './typer/app';
import Router from 'koa-router';
import YAML from 'yamljs';
import { createDirSync } from './utils/file';
import routerFactory from './routers/index';


const router: Router<any, {}> = new Router();
const app: Koa<CustomContext, Koa.Next> = new Koa();
const uploadDir: string = join(BASE_DIR, 'public', 'img');

createDirSync(uploadDir);

app.use(loggerMiddleware());
app.use(staticFiles(join(BASE_DIR, 'public')));
app.use(cors({
  origin: function(_) { // 设置允许来自指定域名请求
    return '*';
  },
    credentials: true, // 是否允许发送Cookie
    allowMethods: ['*'], // 设置所允许的HTTP请求方法'
    allowHeaders: ['*'], // 设置服务器支持的所有头信息字段
  }

));

app.use(koaBody({
  multipart: true,
  formLimit: '100mb',
  textLimit: '100mb',
  formidable: {
    uploadDir: uploadDir,
    keepExtensions: true,
  }
}));

app.use(authMiddleware());
routerFactory.loadRouters(router);

const spec: SwaggerOptions = YAML.load(join(BASE_DIR, 'apis', 'index.yaml'));

router.get('/docs', koaSwagger({
  routePrefix: false, // host at /swagger instead of default /docs
  exposeSpec: false, // expose spec file
  hideTopbar: false, // hide swagger top bar
  swaggerOptions: {
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    defaultModelRendering: 'schema',
    jsonEditor: false,
    spec,
  },
}));
app.use(router.routes());

export default app;