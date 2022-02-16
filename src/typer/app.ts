import * as Koa from 'koa';

export interface CustomContext extends Koa.Context{
    [key:string]: any
}