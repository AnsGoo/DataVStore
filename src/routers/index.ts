import type Router from 'koa-router';
import type { IMiddleware, } from "koa-router";
import ValidatorMiddleware  from './middlewares/validator';
import { checkLoginMiddleware } from './middlewares/checkLogin';
import { getUsers, login } from '../controller/auth';
import {
  getPages,
  createPage,
  updatePage,
  deletePage,
  getPage,
  getHomePage,
  setHomePage,
  setPagePermission
} from '../controller/page';
import { uploadFile, getFiles } from '../controller/file';
import getCacheData from '../controller/data';
import { RouterItem } from '../typer/router';
import { SystemSetting, SystemSchem } from '../controller/system';

class RouterFactory {
  public routers: RouterItem[] = []

  public constructor(routers:RouterItem[]){
    this.routers = routers
  }

  private loadMiddleware(route:RouterItem):IMiddleware<any,{}>[] {
    let middlewares:IMiddleware<any,{}>[] = []

    if (route.login) {
      middlewares.push(checkLoginMiddleware())
    }

    if (route.schema){
      middlewares.push(ValidatorMiddleware(route.schema))
    }
    return middlewares
  }

  public loadRouters(router: Router<any, {}>){
    this.routers.forEach((item: RouterItem) => {
      switch (item.method) {
        case 'get':
          router.get(item.name, item.url, ...this.loadMiddleware(item), item.action);
          break;
        case 'post':
          router.post(item.name, item.url, ...this.loadMiddleware(item), item.action);
          break;
        case 'put':
          router.put(item.name, item.url, ...this.loadMiddleware(item), item.action);
          break;
        case 'delete':
          router.delete(item.name, item.url, ...this.loadMiddleware(item), item.action);
          break;
        case 'patch':
          router.patch(item.name, item.url, ...this.loadMiddleware(item), item.action);
          break;
      }
    });
  }

}
const appRouters: RouterItem[] = [
  {
    name: login.name,
    method: 'post',
    url: '/login',
    action: login.action,
    schema: login.schema,
  },
  {
    name: getUsers.name,
    method: 'get',
    url: '/users',
    action: getUsers.action,
  },
  {
    name: getPages.name,
    method: 'get',
    url: '/pages',
    action: getPages.action,
  },
  {
    name: createPage.name,
    method: 'post',
    url: '/pages',
    action: createPage.action,
    schema: createPage.schema,
    login: true
  },
  {
    name: getPage.name,
    method: 'get',
    url: '/pages/:id',
    action: getPage.action,
  },
  {
    name: updatePage.name,
    method: 'put',
    url: '/pages/:id',
    action: updatePage.action,
    schema: updatePage.schema,
    login: true
  },
  {
    name: deletePage.name,
    method: 'delete',
    url: '/pages/:id',
    action: deletePage.action,
    login: true
  },
  {
    name: uploadFile.name,
    method: 'post',
    url: '/upload',
    action: uploadFile.action,
    login: true
  },
  {
    name: getFiles.name,
    method: 'get',
    url: '/files',
    action: getFiles.action,
  },
  {
    name: getHomePage.name,
    method: 'get',
    url: '/home',
    action: getHomePage.action,
  },
  {
    name: setPagePermission.name,
    method: 'put',
    url: '/permission/:id',
    action: setPagePermission.action,
    login: true
  },
  {
    name: setHomePage.name,
    method: 'put',
    url: '/home/:id',
    action: setHomePage.action,
    login: true
  },
  {
    name: getCacheData.name,
    method: 'get',
    url: '/caches',
    action: getCacheData.action,
  },
  {
    name: SystemSetting.getName,
    method: 'get',
    url: '/system',
    action: SystemSetting.get,
  },
  {
    name: SystemSetting.getAllName,
    method: 'get',
    url: '/systemAll',
    action: SystemSetting.getAll,
  },
  {
    name: SystemSetting.deleteName,
    method: 'delete',
    url: '/system/:id',
    action: SystemSetting.delete,
    login: true
  },
  {
    name: SystemSetting.createName,
    method: 'post',
    url: '/system',
    action: SystemSetting.create,
    schema: SystemSchem.createSchema,
    login: true
  },
  {
    name: SystemSetting.updateName,
    method: 'put',
    url: '/system/:id',
    action: SystemSetting.update,
    schema: SystemSchem.updateSchema,
    login: true
  },
];

export default new RouterFactory(appRouters);
