## 技术栈

koa2 + typeorm + typescripts + mysql


##  全局依赖安装

```shell
npm install -g typescript
npm install -g ts-node
npm install -g nodemon
npm install -g typeorm
npm install -g pm2

```
## 安装依赖
```shell
npm install
```

## 修改配置文件

修改`ormconfig.json`里面的`mysql`连接信息

## 启动项目

1. 构建项目

```
npm run build
```
2. 打开调试模式
打开 vscode debug ，执行运行`Launch Program`

## 生成迁移文件

```shell
typeorm migration:generate -n Page

```

## 执行迁移文件
```shell
ts-node ./node_modules/typeorm/cli.js migration:run
```

## 开发模式下的运行

```shell
npm run start
```

**NOTE:** 建议非生产环境下的启动该项目采用这种方式，windows 系统终端不允许后台运行，一旦启动采用PM2 启动项目会导致终端无限闪启

## 部署

```shell
docker build -t dashboard-backend:v1 .
docker run -p 13000:3000 -v /opt/public:/home/marco/public --name dashboard-backend -it dashboard-backend:v1

```
